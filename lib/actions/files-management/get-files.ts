import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/schema';
import { validateClient } from '@/lib/utils';

export async function getFiles(apiKey: string) {
  const client = await validateClient(apiKey);
  if (!client) return;

  const fileList = await db.select().from(documents);

  return fileList.map((file) => {
    Reflect.deleteProperty(file, 'client_id');
    return file;
  });
}
