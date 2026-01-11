import { queryAnthropic } from '../llm/anthropic';

export interface Competitor {
  name: string;
  domain?: string;
  mentionCount: number;
  providers: string[];
  relevanceScore: number;
  reason: string;
}

// Liste des grandes entreprises à exclure (pas des concurrents directs pour une PME)
const EXCLUDED_COMPANIES = [
  'google', 'microsoft', 'amazon', 'facebook', 'meta', 'apple', 'salesforce',
  'adobe', 'oracle', 'ibm', 'accenture', 'deloitte', 'pwc', 'kpmg', 'ey',
  'mckinsey', 'bain', 'boston consulting', 'bcg', 'gartner', 'forrester',
  'hubspot', 'mailchimp', 'constant contact', 'hootsuite', 'sprout social',
  'semrush', 'ahrefs', 'moz', 'wpp', 'omnicom', 'publicis', 'dentsu',
  'interpublic', 'ipg', 'havas', 'ogilvy', 'bbdo', 'leo burnett', 'edelman',
  'fleishmanhillard', 'fiverr', 'upwork', 'toptal', 'crowdstrike', 'palo alto',
  'fireeye', 'mandiant', 'check point', 'carbon black'
];

export async function extractCompetitorsFromResponses(
  responses: Record<string, string>,
  brandName: string,
  industry: string,
  websiteContent: string
): Promise<Competitor[]> {
  const allResponses = Object.entries(responses)
    .map(([provider, response]) => `[${provider}]: ${response}`)
    .join('\n\n');

  const prompt = `Tu es un expert en analyse concurrentielle. Analyse ces réponses d'IA et identifie les VRAIS concurrents directs.

CONTEXTE:
- Entreprise analysée: ${brandName || 'Non spécifié'}
- Industrie: ${industry}
- Contenu du site: ${websiteContent.substring(0, 1000)}

RÈGLES IMPORTANTES:
1. Ne liste QUE les entreprises qui offrent des services SIMILAIRES et COMPARABLES
2. EXCLUS les grandes multinationales (Google, Microsoft, Salesforce, HubSpot, etc.)
3. EXCLUS les outils SaaS génériques (Mailchimp, Hootsuite, SEMrush, etc.)
4. EXCLUS les cabinets de conseil géants (McKinsey, Accenture, Deloitte, etc.)
5. EXCLUS les holdings publicitaires (WPP, Omnicom, Publicis, etc.)
6. Cherche des agences ou entreprises de TAILLE SIMILAIRE
7. Maximum 10 concurrents pertinents

RÉPONSES DES IA:
${allResponses}

Retourne un JSON array avec ce format exact:
[
  {
    "name": "Nom de l'entreprise",
    "reason": "Pourquoi c'est un concurrent direct (1 phrase)",
    "relevanceScore": 85
  }
]

Si aucun concurrent pertinent n'est trouvé, retourne: []
Retourne UNIQUEMENT le JSON, rien d'autre.`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const competitors = JSON.parse(cleaned);
    
    if (!Array.isArray(competitors)) return [];

    const competitorMap: Record<string, Competitor> = {};
    
    for (const comp of competitors) {
      if (typeof comp.name !== 'string') continue;
      
      const nameLower = comp.name.toLowerCase();
      
      // Exclure la marque analysée
      if (brandName && nameLower.includes(brandName.toLowerCase())) continue;
      
      // Exclure les grandes entreprises
      if (EXCLUDED_COMPANIES.some(excluded => nameLower.includes(excluded))) continue;
      
      if (!competitorMap[nameLower]) {
        competitorMap[nameLower] = {
          name: comp.name,
          mentionCount: 0,
          providers: [],
          relevanceScore: comp.relevanceScore || 50,
          reason: comp.reason || '',
        };
      }

      // Compter les mentions par provider
      for (const [provider, response] of Object.entries(responses)) {
        if (response.toLowerCase().includes(nameLower)) {
          competitorMap[nameLower].mentionCount++;
          if (!competitorMap[nameLower].providers.includes(provider)) {
            competitorMap[nameLower].providers.push(provider);
          }
        }
      }
    }

    return Object.values(competitorMap)
      .filter(c => c.mentionCount > 0 || c.relevanceScore > 70)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
      
  } catch (error) {
    console.error('Error extracting competitors:', error);
    return [];
  }
}
