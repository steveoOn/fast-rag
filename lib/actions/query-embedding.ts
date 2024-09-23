import { db } from '@/lib/db';
import { embeddings } from '@/lib/db/schema/schema';
import { gt, sql, cosineDistance } from 'drizzle-orm';
import { embedding } from './doc-process/embedding';

export async function queryEmbeddings(question: string) {
  const questionEmbedding = await embedding([question]);
  const similarity = sql<number>`1 - (${cosineDistance(embeddings.embedding, questionEmbedding[0])})`;

  const queryRes = await db.select().from(embeddings).where(gt(similarity, 0.6)).limit(4);

  return queryRes.map((item) => item.content);
}
