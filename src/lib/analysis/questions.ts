import { queryAnthropic } from '../llm/anthropic';

export async function generateQuestions(
  brandName: string, 
  websiteContent: string,
  industry: string
): Promise<string[]> {
  // Utilise Claude pour générer des questions contextuelles
  const prompt = `Tu es un expert en GEO (Generative Engine Optimization). Génère 10 questions que des clients potentiels poseraient à un assistant IA pour trouver des services comme ceux de cette entreprise.

CONTEXTE:
- Nom de l'entreprise: ${brandName || 'Non spécifié'}
- Industrie détectée: ${industry}
- Extrait du site web:
${websiteContent.substring(0, 2000)}

RÈGLES:
1. Les questions doivent être naturelles, comme si un humain les posait à ChatGPT
2. Varie les types de questions:
   - Questions de découverte ("Qui peut m'aider avec...")
   - Questions de comparaison ("Quelles sont les meilleures agences...")
   - Questions spécifiques ("Je cherche un expert en...")
   - Questions de recommandation ("Peux-tu me recommander...")
3. Inclus le nom de la marque dans 2-3 questions
4. Les autres questions doivent être génériques sur l'industrie/services

Retourne UNIQUEMENT un JSON array de 10 questions, rien d'autre:
["Question 1", "Question 2", ...]`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleaned);
    
    if (Array.isArray(questions) && questions.length > 0) {
      return questions.slice(0, 10);
    }
  } catch (error) {
    console.error('Error generating questions:', error);
  }

  // Fallback: questions par défaut
  return generateDefaultQuestions(brandName, industry);
}

function generateDefaultQuestions(brandName: string, industry: string): string[] {
  const brand = brandName || 'cette entreprise';
  
  return [
    `Quelles sont les meilleures agences de ${industry} au Québec?`,
    `Peux-tu me recommander une agence de ${industry} à Montréal?`,
    `Que sais-tu de ${brand}?`,
    `Je cherche un expert en ${industry}, qui me recommandes-tu?`,
    `Quels sont les leaders en ${industry} au Canada?`,
    `${brand} est-elle une bonne agence de ${industry}?`,
    `Compare les meilleures agences de ${industry}`,
    `J'ai besoin d'aide en ${industry}, par où commencer?`,
    `Quelles agences de ${industry} ont les meilleurs avis?`,
    `Qui sont les concurrents de ${brand}?`,
  ];
}

export function extractKeywords(content: string): string[] {
  const words = content.toLowerCase()
    .replace(/[^a-zA-ZÀ-ÿ0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  const stopWords = ['cette', 'notre', 'votre', 'leurs', 'avec', 'pour', 'dans', 'plus', 'nous', 'vous'];
  const filtered = words.filter(w => !stopWords.includes(w));
  
  const frequency: Record<string, number> = {};
  filtered.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

export function detectIndustry(content: string, keywords: string[]): string {
  const industries: Record<string, string[]> = {
    'marketing digital': ['marketing', 'seo', 'sem', 'publicité', 'digital', 'web', 'réseaux sociaux', 'contenu'],
    'développement web': ['développement', 'web', 'site', 'application', 'app', 'logiciel', 'software'],
    'design': ['design', 'ux', 'ui', 'graphique', 'créatif', 'branding', 'identité'],
    'consultation': ['conseil', 'consulting', 'stratégie', 'accompagnement', 'formation'],
    'e-commerce': ['commerce', 'boutique', 'vente', 'produit', 'shop', 'magasin'],
    'technologie': ['tech', 'saas', 'cloud', 'data', 'intelligence artificielle', 'ia', 'ai'],
    'finance': ['finance', 'comptabilité', 'investissement', 'banque', 'assurance'],
    'santé': ['santé', 'médical', 'clinique', 'soin', 'bien-être'],
    'immobilier': ['immobilier', 'propriété', 'maison', 'appartement', 'location'],
    'éducation': ['éducation', 'formation', 'cours', 'apprentissage', 'école'],
  };

  const contentLower = content.toLowerCase();
  let bestMatch = 'services professionnels';
  let bestScore = 0;

  for (const [industry, terms] of Object.entries(industries)) {
    const score = terms.filter(term => contentLower.includes(term)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = industry;
    }
  }

  return bestMatch;
}
