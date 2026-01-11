import { CrawlResult } from '../firecrawl';
import { WebsiteAnalysis } from './website-analyzer';
import { queryAnthropic } from '../llm/anthropic';

export interface TechnicalRecommendation {
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'content' | 'technical' | 'authority' | 'structure';
  affectedPages?: string[];
  howToFix?: string;
}

export async function generateTechnicalRecommendations(
  pages: CrawlResult[],
  analysis: WebsiteAnalysis,
  geoScore: number,
  mentionRate: number,
  maxRecommendations: number = 5
): Promise<TechnicalRecommendation[]> {
  
  const pagesInfo = pages.map(p => ({
    url: p.url,
    title: p.title,
    hasDescription: !!p.description,
    contentLength: p.content.length,
    description: p.description?.substring(0, 100),
  }));

  const prompt = `Tu es un expert en GEO (Generative Engine Optimization) et SEO technique. Analyse ce site et génère des recommandations actionnables.

ANALYSE DU SITE:
- Entreprise: ${analysis.companyName}
- Industrie: ${analysis.industry}
- Score GEO actuel: ${geoScore}/100
- Taux de mention par les IA: ${Math.round(mentionRate * 100)}%
- Problèmes techniques détectés: ${analysis.technicalIssues.join(', ') || 'Aucun'}

PAGES ANALYSÉES:
${JSON.stringify(pagesInfo, null, 2)}

GÉNÈRE ${maxRecommendations} RECOMMANDATIONS avec ce format JSON:
[
  {
    "priority": "P0",
    "title": "Titre court et actionnable",
    "description": "Description détaillée du problème",
    "impact": "high",
    "category": "technical",
    "affectedPages": ["url1", "url2"],
    "howToFix": "Instructions concrètes pour corriger"
  }
]

PRIORITÉS:
- P0: Critique, impact immédiat sur la visibilité IA
- P1: Important, amélioration significative
- P2: Nice-to-have, optimisation

CATÉGORIES:
- content: Qualité et structure du contenu
- technical: SEO technique, structured data, performance
- authority: Backlinks, mentions, citations
- structure: Architecture du site, navigation, UX

Retourne UNIQUEMENT le JSON array.`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const recommendations = JSON.parse(cleaned);
    if (Array.isArray(recommendations)) {
      return recommendations.slice(0, maxRecommendations);
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
  }

  // Fallback recommendations
  return generateFallbackRecommendations(geoScore, mentionRate, analysis);
}

function generateFallbackRecommendations(
  score: number,
  mentionRate: number,
  analysis: WebsiteAnalysis
): TechnicalRecommendation[] {
  const recommendations: TechnicalRecommendation[] = [];

  if (mentionRate < 0.3) {
    recommendations.push({
      priority: 'P0',
      title: 'Améliorer la présence en ligne',
      description: 'Votre marque est rarement mentionnée par les IA. Il faut augmenter votre visibilité.',
      impact: 'high',
      category: 'authority',
      howToFix: 'Publiez du contenu expert sur votre blog, obtenez des mentions dans des publications de votre industrie, et créez des études de cas détaillées.',
    });
  }

  if (score < 50) {
    recommendations.push({
      priority: 'P0',
      title: 'Ajouter des données structurées',
      description: 'Les données structurées (JSON-LD) aident les IA à comprendre votre contenu.',
      impact: 'high',
      category: 'technical',
      howToFix: 'Ajoutez le schema Organization, LocalBusiness, et FAQ sur vos pages principales.',
    });
  }

  recommendations.push({
    priority: 'P1',
    title: 'Créer une page FAQ complète',
    description: 'Les IA puisent souvent dans les FAQs pour répondre aux questions.',
    impact: 'medium',
    category: 'structure',
    howToFix: 'Créez une page FAQ avec 15-20 questions fréquentes sur vos services et votre industrie.',
  });

  return recommendations.slice(0, 5);
}
