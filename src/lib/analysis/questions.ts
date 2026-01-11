export function generateQuestions(brandName: string, keywords: string[], industry: string): string[] {
  const brand = brandName || 'this company';
  
  return [
    `What are the best ${industry} companies or services?`,
    `Can you recommend a good ${industry} provider?`,
    `What do you know about ${brand}?`,
    `Who are the top players in the ${industry} industry?`,
    `I'm looking for ${industry} solutions. What are my options?`,
    `Compare the leading ${industry} companies`,
    `What is ${brand} known for?`,
    `Is ${brand} a good choice for ${industry}?`,
    `What are the alternatives to ${brand}?`,
    `Who would you recommend for ${industry} services?`,
  ];
}

export function extractKeywords(content: string): string[] {
  // Simple extraction - on peut améliorer avec un LLM plus tard
  const words = content.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

export function detectIndustry(content: string, keywords: string[]): string {
  const industries: Record<string, string[]> = {
    'technology': ['software', 'tech', 'digital', 'cloud', 'saas', 'app', 'platform'],
    'marketing': ['marketing', 'seo', 'advertising', 'brand', 'campaign', 'content'],
    'finance': ['finance', 'banking', 'investment', 'insurance', 'fintech', 'payment'],
    'healthcare': ['health', 'medical', 'clinic', 'hospital', 'pharma', 'wellness'],
    'ecommerce': ['shop', 'store', 'commerce', 'retail', 'product', 'buy'],
    'consulting': ['consulting', 'advisory', 'strategy', 'management', 'business'],
    'education': ['education', 'learning', 'training', 'course', 'school', 'university'],
  };

  const contentLower = content.toLowerCase();
  let bestMatch = 'business services';
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
