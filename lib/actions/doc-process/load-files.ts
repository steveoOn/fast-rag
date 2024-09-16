import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/schema';
import { inArray } from 'drizzle-orm';
import axios from 'axios';

async function fetchFileContent(url: string): Promise<string> {
  try {
    const response = await axios.get(url, { responseType: 'text' });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch file: ${error.message}`);
    }
    throw error;
  }
}

export async function loadFile(fileIds: string[]) {
  const query = db
    .select({
      storageUrl: documents.storage_url,
      type: documents.type,
    })
    .from(documents)
    .where(inArray(documents.id, fileIds));

  const files = await db.select().from(documents).where(inArray(documents.id, fileIds));

  const allPromise = files
    .filter((file) => !!file.storage_url)
    .map(async (file) => ({
      ...file,
      content: await fetchFileContent(file.storage_url as string),
    }));

  const loadRes = await Promise.allSettled(allPromise);

  return loadRes.filter((item) => item.status === 'fulfilled').map((item) => item.value);
}
