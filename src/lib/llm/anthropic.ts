import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function queryAnthropic(question: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: question }],
    });
    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  } catch (error) {
    console.error('Anthropic error:', error);
    return '';
  }
}
