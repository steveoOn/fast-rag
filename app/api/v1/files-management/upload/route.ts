import { NextResponse } from 'next/server';
import { z } from 'zod';
import { uploadFileToStorage } from '@/lib/actions/upload-file/save-storage';
import { UploadFile } from '@/types';
import { CustomError } from '@/types';

const uploadFileSchema = z.object({
  file: z.instanceof(Blob),
  metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const apiKey = authHeader?.split('Bearer ')[1];

    if (!apiKey) {
      return NextResponse.json({ error: '未提供 API KEY' }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const metadata = formData.get('metadata') as string | null;

    if (!file) {
      return NextResponse.json({ error: '未提供文件' }, { status: 400 });
    }

    const parsedMetadata = metadata ? JSON.parse(metadata) : undefined;

    const validatedData = uploadFileSchema.parse({
      file,
      metadata: parsedMetadata,
    });

    const buffer = Buffer.from(await validatedData.file.arrayBuffer());

    const uploadFile: UploadFile = {
      name: file.name,
      type: file.type as any, // 这里可能需要进行类型转换
      size: file.size,
      lastModified: file.lastModified,
      extension: file.name.split('.').pop() || '',
      buffer,
      metadata: validatedData.metadata,
    };

    const uploadedUrl = await uploadFileToStorage(uploadFile, apiKey);

    return NextResponse.json({ url: uploadedUrl, isUploaded: true }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message, isUploaded: false }, { status: 401 });
    }

    return NextResponse.json({ error: '未知原因导致上传失败', isUploaded: false }, { status: 500 });
  }
}
