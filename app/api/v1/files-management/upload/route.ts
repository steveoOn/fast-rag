import { NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadFileToStorage } from '@/lib/actions';
import { UploadFile, CustomError } from '@/types';
import { mimeTypeToDocumentType, extractApiKey, handleError } from '@/lib/utils';

export const maxDuration = 120;

const uploadFileSchema = z.object({
  file: z.instanceof(Blob, { message: '文件必须是 Blob 类型' }),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const apiKey = extractApiKey(request);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadata = formData.get('metadata') as string | null;

    if (!file) {
      throw new CustomError('未提供文件', 'MISSING_FILE');
    }

    mimeTypeToDocumentType(file.type, file.name);

    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;

    const validatedData = uploadFileSchema.parse({
      file,
      metadata: parsedMetadata,
    });

    const buffer = Buffer.from(await validatedData.file.arrayBuffer());

    const uploadFile: UploadFile = {
      name: file.name,
      type: mimeTypeToDocumentType(file.type, file.name),
      size: file.size,
      lastModified: file.lastModified,
      extension: file.name.split('.').pop() || '',
      buffer,
      metadata: validatedData.metadata,
    };

    const uploadedUrl = await uploadFileToStorage(uploadFile, apiKey);

    return NextResponse.json({ url: uploadedUrl, isUploaded: true }, { status: 201 });
  } catch (error) {
    const { message, code, details } = handleError(error);
    const status =
      code === 'UNEXPECTED_ERROR' || code === 'UNKNOWN_ERROR'
        ? 500
        : code === 'VALIDATION_ERROR'
          ? 400
          : 400;
    return NextResponse.json({ error: message, details, code }, { status });
  }
}
