import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { UploadFile } from '@/types';
import * as tus from 'tus-js-client';
import { z } from 'zod';
import { SUPABASE_PUBLIC_ANON_KEY, SUPABASE_URL } from 'constant';
import { logger, handleError, sanitizeFileName, mimeTypeToDocumentType } from '@/lib/utils';
import { validateAPIKey } from '@/lib/api-key';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

const uploadFileSchema = z.object({
  file: z.instanceof(Blob, { message: '文件必须是 Blob 类型' }),
  // metadata: z.record(z.unknown()).optional(),
});

const supabase = createClient(SUPABASE_URL!, SUPABASE_PUBLIC_ANON_KEY!);

export async function uploadFileToStorage(file: UploadFile, apiKey: string): Promise<string> {
  try {
    await validateAPIKey(apiKey);

    const bucket = 'file-uploader-test';
    const sanitizedFileName = sanitizeFileName(file.name);
    const path = `${nanoid()}-${sanitizedFileName}`;

    // 创建 Readable 流
    const fileStream = Readable.from(Buffer.from(file.buffer));

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(fileStream, {
        endpoint: `${SUPABASE_URL}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${SUPABASE_PUBLIC_ANON_KEY}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: bucket,
          objectName: path,
          contentType: file.type,
          cacheControl: '3600',
          filename: sanitizedFileName,
          ...(file.metadata && { customMetadata: JSON.stringify(file.metadata) }),
        },
        chunkSize: 6 * 1024 * 1024, // 6MB
        uploadSize: file.size, // 明确指定文件大小
        onError: (error) => {
          handleError(error);
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          logger.info(`上传进度: ${percentage}%`);
        },
        onSuccess: () => {
          logger.info('上传成功');
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
          resolve(urlData.publicUrl);
        },
      });

      upload.start();
    });
  } catch (error) {
    throw error;
  }
}

export async function upload(files: File[], apiKey: string) {
  const allPromise = [];

  for await (const file of files) {
    const validatedData = uploadFileSchema.parse({
      file,
      // metadata: parsedMetadata,
    });

    const buffer = Buffer.from(await validatedData.file.arrayBuffer());

    const uploadFile: UploadFile = {
      name: file.name,
      type: mimeTypeToDocumentType(file.type, file.name),
      size: file.size,
      lastModified: file.lastModified,
      extension: file.name.split('.').pop() || '',
      buffer,
      // metadata: validatedData.metadata,
    };

    allPromise.push(uploadFileToStorage(uploadFile, apiKey));
  }

  const res = await Promise.allSettled(allPromise);

  return res.map((item) => {
    return {
      success: item.status === 'fulfilled',
      url: item.status === 'fulfilled' ? item.value : undefined,
      error: item.status === 'rejected' ? item.reason : undefined,
    };
  });
}
