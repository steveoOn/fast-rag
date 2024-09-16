import { db } from '@/lib/db';
import { documents, document_versions } from '@/lib/db/schema/schema';
import { validateClient } from '@/lib/utils';
import { FileUploadRes } from '@/types';

export async function addDoc(files: FileUploadRes[], apiKey: string) {
  const client = await validateClient(apiKey);
  if (!client) return;

  const documentsToInsert = files.map((file) => ({
    client_id: client.id,
    name: file.name,
    storage_url: file.uploadURL,
    type: file.type,
  }));

  const docs = await db.insert(documents).values(documentsToInsert).returning();

  const docVersionInsert = docs.map((doc) => ({
    document_id: doc.id,
    version: 1,
    storage_url: doc.storage_url,
  }));

  const documentVersion = await db.insert(document_versions).values(docVersionInsert).returning();

  return documentVersion;
}
