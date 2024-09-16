import { db } from '@/lib/db';
import { documents, document_versions } from '@/lib/db/schema/schema';
import { validateClient } from '@/lib/utils';
import { inArray } from 'drizzle-orm';

export async function delFiles(fileIds: string[], apiKey: string) {
  const client = await validateClient(apiKey);
  if (!client) return;

  await db.delete(documents).where(inArray(documents.id, fileIds));
  await db.delete(document_versions).where(inArray(document_versions.document_id, fileIds));
  return;
}
