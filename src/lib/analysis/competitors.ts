import { queryAnthropic } from '../llm/anthropic';

export interface Competitor {
  name: string;
  domain?: string;
  mentionCount: number;
  providers: string[];
}

export async function extractCompetitorsFromResponses(
  responses: Record<string, string>,
  brandName: string,
  industry: string
): Promise<Competitor[]> {
  // Combine all responses
  const allResponses = Object.entries(responses)
    .map(([provider, response]) => `[${provider}]: ${response}`)
    .join('\n\n');

  // Use Claude to extract competitors
  const prompt = `Analyze these AI responses and extract all company/brand names mentioned that could be competitors in the ${industry} industry.

Brand to exclude (this is the client): ${brandName || 'N/A'}

Responses:
${allResponses}

Return ONLY a JSON array of competitor names, nothing else. Example: ["Company A", "Company B"]
If no competitors found, return: []`;

  try {
    const result = await queryAnthropic(prompt);
    const cleaned = result.replace(/```json\n?|\n?```/g, '').trim();
    const competitors = JSON.parse(cleaned);
    
    if (!Array.isArray(competitors)) return [];

    // Count mentions per competitor
    const competitorMap: Record<string, Competitor> = {};
    
    for (const name of competitors) {
      if (typeof name !== 'string') continue;
      const nameLower = name.toLowerCase();
      
      if (brandName && nameLower === brandName.toLowerCase()) continue;
      
      if (!competitorMap[nameLower]) {
        competitorMap[nameLower] = {
          name,
          mentionCount: 0,
          providers: [],
        };
      }

      // Count in which providers this competitor appears
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
      .filter(c => c.mentionCount > 0)
      .sort((a, b) => b.mentionCount - a.mentionCount);
  } catch (error) {
    console.error('Error extracting competitors:', error);
    return [];
  }
}
