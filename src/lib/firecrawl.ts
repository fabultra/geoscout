import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY || '' });

export interface CrawlResult {
  url: string;
  title: string;
  content: string;
  description?: string;
}

export async function crawlWebsite(url: string, maxPages: number = 5): Promise<CrawlResult[]> {
  try {
    // Use scrape for single page
    const response = await firecrawl.scrape(url, {
      formats: ['markdown'],
    }) as any;

    if (!response || !response.markdown) {
      console.error('Firecrawl error: No data returned');
      return [];
    }

    const results: CrawlResult[] = [{
      url: response.url || url,
      title: response.metadata?.title || '',
      content: response.markdown || '',
      description: response.metadata?.description || '',
    }];

    return results;
  } catch (error) {
    console.error('Firecrawl error:', error);
    return [];
  }
}
