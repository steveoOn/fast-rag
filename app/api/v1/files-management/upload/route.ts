import { NextResponse } from 'next/server';
import { upload, addDoc } from '@/lib/actions';
import { CustomError, FileUploadRes } from '@/types';
import { extractApiKey, handleError } from '@/lib/utils';

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
    const uploadFiles = res.filter((item) => item.success && item.file).map((item) => item.file);

    const insertRes = await addDoc(uploadFiles as FileUploadRes[], apiKey);
    return NextResponse.json({ data: insertRes }, { status: 201 });
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
