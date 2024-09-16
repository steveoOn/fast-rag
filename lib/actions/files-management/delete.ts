import { db } from '@/lib/db';
import { documents, document_versions } from '@/lib/db/schema/schema';
import { validateClient } from '@/lib/utils';
import { eq } from 'drizzle-orm';

export async function delFiles(fileIds: string[], apiKey: string) {
  const client = await validateClient(apiKey);
  if (!client) return;

  await db.delete(documents).where(eq(documents.id, fileIds[0]));
  await db.delete(document_versions).where(eq(document_versions.document_id, fileIds[0]));
  return;
}
