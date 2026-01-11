import { queryAnthropic } from '../llm/anthropic';
import { CrawlResult } from '../firecrawl';

export interface WebsiteAnalysis {
  companyName: string;
  industry: string;
  services: string[];
  targetMarket: string;
  location: string;
  uniqueSellingPoints: string[];
  keywords: string[];
  potentialCompetitors: string[];
  technicalIssues: string[];
}

export async function analyzeWebsite(pages: CrawlResult[], brandName?: string): Promise<WebsiteAnalysis> {
  const combinedContent = pages
    .map(p => `## ${p.title}\nURL: ${p.url}\n${p.content}`)
    .join('\n\n---\n\n')
    .substring(0, 8000);

  const prompt = `Tu es un expert en analyse d'entreprise et en marketing digital. Analyse ce site web en profondeur.

CONTENU DU SITE:
${combinedContent}

NOM DE MARQUE FOURNI: ${brandName || 'Non spécifié'}

Analyse et retourne un JSON avec cette structure exacte:
{
  "companyName": "Nom de l'entreprise détecté",
  "industry": "Industrie principale (ex: marketing digital, développement web, consultation)",
  "services": ["Service 1", "Service 2", "Service 3"],
  "targetMarket": "Marché cible (ex: PME au Québec, startups technologiques)",
  "location": "Localisation (ville, province/état, pays)",
  "uniqueSellingPoints": ["Avantage 1", "Avantage 2"],
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3"],
  "potentialCompetitors": ["Concurrent potentiel 1", "Concurrent potentiel 2"],
  "technicalIssues": ["Problème SEO ou technique détecté 1", "Problème 2"]
}

RÈGLES:
- Sois précis sur la localisation (ville si possible)
- Les concurrents potentiels doivent être de TAILLE SIMILAIRE et dans la MÊME RÉGION
- Les problèmes techniques: manque de structured data, pages sans meta description, contenu dupliqué, etc.
- Retourne UNIQUEMENT le JSON, rien d'autre.`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error analyzing website:', error);
    return {
      companyName: brandName || 'Entreprise',
      industry: 'services professionnels',
      services: [],
      targetMarket: 'Entreprises',
      location: 'Canada',
      uniqueSellingPoints: [],
      keywords: [],
      potentialCompetitors: [],
      technicalIssues: [],
    };
  }
}

export async function generateContextualQuestions(analysis: WebsiteAnalysis): Promise<string[]> {
  const prompt = `Génère 12 questions que des clients potentiels poseraient à ChatGPT, Claude ou Perplexity pour trouver une entreprise comme celle-ci.

PROFIL DE L'ENTREPRISE:
- Nom: ${analysis.companyName}
- Industrie: ${analysis.industry}
- Services: ${analysis.services.join(', ')}
- Marché cible: ${analysis.targetMarket}
- Localisation: ${analysis.location}
- Mots-clés: ${analysis.keywords.join(', ')}

TYPES DE QUESTIONS À GÉNÉRER:
1. 3 questions de découverte locale ("meilleure agence de X à [ville]")
2. 3 questions de recommandation générale ("qui peut m'aider avec...")
3. 2 questions mentionnant directement "${analysis.companyName}"
4. 2 questions de comparaison ("compare les agences de...")
5. 2 questions spécifiques aux services ("expert en [service]")

Retourne UNIQUEMENT un JSON array de 12 questions:
["Question 1", "Question 2", ...]`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleaned);
    if (Array.isArray(questions)) return questions.slice(0, 12);
  } catch (error) {
    console.error('Error generating questions:', error);
  }

  // Fallback
  return [
    `Quelle est la meilleure agence de ${analysis.industry} à ${analysis.location}?`,
    `Recommande-moi une entreprise de ${analysis.industry}`,
    `Que sais-tu de ${analysis.companyName}?`,
    `${analysis.companyName} est-elle une bonne entreprise?`,
    `Qui sont les experts en ${analysis.services[0] || analysis.industry}?`,
    `Compare les agences de ${analysis.industry} au Québec`,
  ];
}

export async function identifyCompetitors(
  analysis: WebsiteAnalysis,
  llmResponses: Record<string, string>
): Promise<Array<{name: string; reason: string; relevanceScore: number}>> {
  const allResponses = Object.values(llmResponses).join('\n\n');

  const prompt = `Identifie les VRAIS concurrents directs de cette entreprise.

ENTREPRISE ANALYSÉE:
- Nom: ${analysis.companyName}
- Industrie: ${analysis.industry}
- Services: ${analysis.services.join(', ')}
- Localisation: ${analysis.location}
- Marché cible: ${analysis.targetMarket}

CONCURRENTS POTENTIELS DÉTECTÉS SUR LE SITE: ${analysis.potentialCompetitors.join(', ')}

RÉPONSES DES IA (ChatGPT, Claude, Gemini, Perplexity):
${allResponses.substring(0, 5000)}

RÈGLES STRICTES:
1. UNIQUEMENT des entreprises de TAILLE SIMILAIRE
2. UNIQUEMENT des entreprises dans la MÊME RÉGION (${analysis.location})
3. EXCLURE: Google, Microsoft, Salesforce, HubSpot, Hootsuite, les Big 4, les holdings publicitaires (WPP, Omnicom, Publicis)
4. EXCLURE: les outils SaaS (SEMrush, Ahrefs, Mailchimp, etc.)
5. Maximum 8 concurrents pertinents

Retourne un JSON array:
[
  {"name": "Nom", "reason": "Raison en 1 phrase", "relevanceScore": 85}
]

Retourne [] si aucun concurrent pertinent trouvé.
Retourne UNIQUEMENT le JSON.`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const competitors = JSON.parse(cleaned);
    if (Array.isArray(competitors)) {
      return competitors
        .filter(c => c.name.toLowerCase() !== analysis.companyName.toLowerCase())
        .slice(0, 8);
    }
  } catch (error) {
    console.error('Error identifying competitors:', error);
  }

  return [];
}
