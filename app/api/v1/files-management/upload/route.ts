import { NextResponse } from 'next/server';
import { z } from 'zod';
import { upload } from '@/lib/actions';
import { CustomError } from '@/types';
import { extractApiKey, handleError } from '@/lib/utils';

export const maxDuration = 120;

const uploadFileSchema = z.object({
  file: z.instanceof(Blob, { message: '文件必须是 Blob 类型' }),
  // metadata: z.record(z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const apiKey = extractApiKey(request);

    const formData = await request.formData();
    const keys = [...formData.keys()];
    const files = keys.map((key) => formData.get(key) as File);

    if (!files.length) {
      throw new CustomError('未提供文件', 'MISSING_FILE');
    }

    const res = await upload(files, apiKey);

    return NextResponse.json({ data: res }, { status: 201 });
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
