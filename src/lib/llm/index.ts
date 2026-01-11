import { queryOpenAI } from './openai';
import { queryAnthropic } from './anthropic';
import { queryGoogle } from './google';
import { queryPerplexity } from './perplexity';

export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'perplexity';

export const LLM_CONFIG = {
  openai: { name: 'ChatGPT', query: queryOpenAI, color: '#10a37f' },
  anthropic: { name: 'Claude', query: queryAnthropic, color: '#d4a574' },
  google: { name: 'Gemini', query: queryGoogle, color: '#4285f4' },
  perplexity: { name: 'Perplexity', query: queryPerplexity, color: '#20b2aa' },
};

export async function queryAllLLMs(question: string): Promise<Record<LLMProvider, string>> {
  const results = await Promise.allSettled([
    queryOpenAI(question),
    queryAnthropic(question),
    queryGoogle(question),
    queryPerplexity(question),
  ]);

  return {
    openai: results[0].status === 'fulfilled' ? results[0].value : '',
    anthropic: results[1].status === 'fulfilled' ? results[1].value : '',
    google: results[2].status === 'fulfilled' ? results[2].value : '',
    perplexity: results[3].status === 'fulfilled' ? results[3].value : '',
  };
}
