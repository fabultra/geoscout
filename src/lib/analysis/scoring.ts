import { LLMProvider } from '../llm';

export interface AnalysisResult {
  provider: LLMProvider;
  question: string;
  response: string;
  mentionsBrand: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
  competitorsMentioned: string[];
}

export function analyzeLLMResponse(
  response: string,
  brandName: string,
  knownCompetitors: string[] = []
): { mentionsBrand: boolean; sentiment: 'positive' | 'neutral' | 'negative'; competitorsMentioned: string[] } {
  const responseLower = response.toLowerCase();
  const brandLower = brandName.toLowerCase();

  // Check if brand is mentioned
  const mentionsBrand = brandLower ? responseLower.includes(brandLower) : false;

  // Detect sentiment (simple version)
  const positiveWords = ['excellent', 'great', 'best', 'top', 'leading', 'recommended', 'trusted', 'reliable'];
  const negativeWords = ['avoid', 'poor', 'bad', 'worst', 'issues', 'problems', 'complaints'];

  const positiveCount = positiveWords.filter(word => responseLower.includes(word)).length;
  const negativeCount = negativeWords.filter(word => responseLower.includes(word)).length;

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (mentionsBrand) {
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';
  }

  // Detect competitors mentioned
  const competitorsMentioned = knownCompetitors.filter(comp => 
    responseLower.includes(comp.toLowerCase())
  );

  return { mentionsBrand, sentiment, competitorsMentioned };
}

export function calculateScore(results: AnalysisResult[]): number {
  if (results.length === 0) return 0;

  let score = 50; // Base score

  const totalQuestions = results.length;
  const mentions = results.filter(r => r.mentionsBrand).length;
  const positives = results.filter(r => r.sentiment === 'positive').length;
  const negatives = results.filter(r => r.sentiment === 'negative').length;

  // Mention rate (0-30 points)
  const mentionRate = mentions / totalQuestions;
  score += Math.round(mentionRate * 30);

  // Sentiment bonus/penalty (-20 to +20 points)
  const sentimentScore = (positives - negatives) / totalQuestions;
  score += Math.round(sentimentScore * 20);

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
}

export function calculateProviderScore(results: AnalysisResult[], provider: LLMProvider): number {
  const providerResults = results.filter(r => r.provider === provider);
  return calculateScore(providerResults);
}
