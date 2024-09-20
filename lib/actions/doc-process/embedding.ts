import { embedMany } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  baseURL: 'https://api.ohmygpt.com/v1/',
  apiKey: process.env.OPENAI_API_KEY,
});

const model = openai.embedding('text-embedding-3-small');

export async function embedding(values: string[]) {
  const { embeddings } = await embedMany({
    model,
    values,
  });
  return embeddings;
}
