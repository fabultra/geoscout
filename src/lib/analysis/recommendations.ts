export interface Recommendation {
  priority: 'P0' | 'P1' | 'P2';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'content' | 'technical' | 'authority' | 'structure';
}

export function generateRecommendations(
  score: number,
  mentionRate: number,
  competitorCount: number,
  hasNegativeSentiment: boolean
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // Low visibility
  if (mentionRate < 0.3) {
    recommendations.push({
      priority: 'P0',
      title: 'Améliorer la présence en ligne',
      description: 'Votre marque est rarement mentionnée par les LLMs. Créez plus de contenu de qualité et obtenez des mentions sur des sites autoritaires.',
      impact: 'high',
      category: 'authority',
    });
  }

  // Many competitors
  if (competitorCount > 5) {
    recommendations.push({
      priority: 'P0',
      title: 'Différenciation compétitive',
      description: `${competitorCount} concurrents sont mentionnés. Mettez en avant vos avantages uniques dans votre contenu.`,
      impact: 'high',
      category: 'content',
    });
  }

  // Negative sentiment
  if (hasNegativeSentiment) {
    recommendations.push({
      priority: 'P0',
      title: 'Gérer la réputation',
      description: 'Des sentiments négatifs ont été détectés. Travaillez sur les avis clients et le contenu positif.',
      impact: 'high',
      category: 'authority',
    });
  }

  // Medium score
  if (score >= 40 && score < 70) {
    recommendations.push({
      priority: 'P1',
      title: 'Optimiser le contenu pour les LLMs',
      description: 'Structurez votre contenu avec des données factuelles, des listes et des comparatifs clairs.',
      impact: 'medium',
      category: 'content',
    });
  }

  // Low score
  if (score < 40) {
    recommendations.push({
      priority: 'P0',
      title: 'Créer du contenu authoritative',
      description: 'Publiez des études de cas, des guides experts et obtenez des backlinks de sites reconnus.',
      impact: 'high',
      category: 'authority',
    });
  }

  // Technical recommendations
  recommendations.push({
    priority: 'P1',
    title: 'Implémenter le schema markup',
    description: 'Ajoutez des données structurées (JSON-LD) pour aider les LLMs à comprendre votre contenu.',
    impact: 'medium',
    category: 'technical',
  });

  recommendations.push({
    priority: 'P2',
    title: 'Créer une page FAQ complète',
    description: 'Les LLMs puisent souvent dans les FAQs. Répondez aux questions fréquentes de votre industrie.',
    impact: 'medium',
    category: 'structure',
  });

  return recommendations.slice(0, 8); // Max 8 recommendations
}
