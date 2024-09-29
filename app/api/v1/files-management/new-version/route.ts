import { NextResponse } from 'next/server';
import { upload, addVersion } from '@/lib/actions';
import { CustomError, FileUploadRes } from '@/types';
import { extractApiKey, handleError } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    const apiKey = extractApiKey(request);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentId = formData.get('documentId') as string;

    if (!file) {
      throw new CustomError('未提供文件', 'MISSING_FILE');
    }
    if (!documentId) {
      throw new CustomError('未提供文档ID', 'MISSING_DOCUMENT_ID');
    }

    const res = await upload([file], apiKey);
    const uploadFiles = res
      .filter((item) => item.success && item.file)
      .map((item) => item.file) as FileUploadRes[];

    await addVersion({ file: uploadFiles[0], apiKey, documentId });

    return NextResponse.json('add version success', { status: 201 });
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
