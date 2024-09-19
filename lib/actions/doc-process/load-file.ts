import { db } from '@/lib/db';
import { documents, document_versions } from '@/lib/db/schema/schema';
import { eq } from 'drizzle-orm';
import axios from 'axios';

async function fetchFileContent(url: string): Promise<ArrayBuffer> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch file: ${error.message}`);
    }
    throw error;
  }
}

export async function loadFile(fileId: string) {
  const queryDocument = db.select().from(documents).where(eq(documents.id, fileId));
  const versionQuery = db
    .select({ version: document_versions.version, id: document_versions.id })
    .from(document_versions)
    .where(eq(document_versions.document_id, fileId));

  const [[file], [versionResult]] = await Promise.all([queryDocument, versionQuery]);

  if (!file || !file.storage_url) {
    throw new Error('File not found or storage URL is missing');
  }

  const content = await fetchFileContent(file.storage_url);

  return {
    ...file,
    version: versionResult?.version,
    document_version_id: versionResult?.id,
    content,
  };
}
