import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { UploadFile } from '@/types';
import * as tus from 'tus-js-client';
import { SUPABASE_PUBLIC_ANON_KEY, SUPABASE_URL } from 'constant';
import { handleError } from '@/lib/utils/error';
import { logger } from '@/lib/utils/logger';
import { validateAPIKey } from '@/lib/api-key/validate-key';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

const supabase = createClient(SUPABASE_URL!, SUPABASE_PUBLIC_ANON_KEY!);

export async function uploadFileToStorage(file: UploadFile, apiKey: string): Promise<string> {
  try {
    await validateAPIKey(apiKey);

    const bucket = 'file-uploader-test';
    const path = `${nanoid()}-${file.name}`;

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
          filename: file.name,
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
    throw handleError(error);
  }
}
