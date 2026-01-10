export type PlanType = 'free' | 'basic' | 'pro' | 'business';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  priceAnnual: number;
  analysesPerMonth: number;
  urlsPerAnalysis: number;
  llmCount: number;
  competitorsShown: number;
  historyDays: number;
  features: {
    recommendations: boolean;
    exportPdf: boolean;
    exportMarkdown: boolean;
    api: boolean;
    whiteLabel: boolean;
  };
}
