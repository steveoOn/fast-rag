import { db } from '@/lib/db';
import { documents, document_versions } from '@/lib/db/schema/schema';
import { validateClient } from '@/lib/utils';
import { FileUploadRes, CustomError } from '@/types';
import { logger } from '@/lib/utils/logger';

export async function addDoc(files: FileUploadRes[], apiKey: string) {
  return await db.transaction(async (tx) => {
    const client = await validateClient(apiKey);
    if (!client) {
      throw new CustomError('客户端验证失败', 'CLIENT_VALIDATION_FAILED');
    }

    const documentsToInsert = files.map((file) => ({
      client_id: client.id,
      name: file.name,
      storage_url: file.uploadURL,
      type: file.type,
    }));

    const docs = await tx.insert(documents).values(documentsToInsert).returning();

    const docVersionInsert = docs.map((doc) => ({
      document_id: doc.id,
      version: 1,
      storage_url: doc.storage_url,
    }));

    const documentVersion = await tx.insert(document_versions).values(docVersionInsert).returning();

    logger.info(`成功添加 ${docs.length} 个文档和版本记录`);

    return documentVersion;
  });
}
