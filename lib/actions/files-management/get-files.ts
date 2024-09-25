import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema/schema';
import { validateClient } from '@/lib/utils';
import { CustomError } from '@/types';
import { eq } from 'drizzle-orm';

export async function getFiles(apiKey: string) {
  const client = await validateClient(apiKey);
  if (!client) {
    throw new CustomError('非法请求', 'UN_AUTH_REQUEST');
  }

  const fileList = await db.select().from(documents).where(eq(documents.client_id, client.id));

  return fileList.map((file) => {
    Reflect.deleteProperty(file, 'client_id');
    return file;
  });
}
