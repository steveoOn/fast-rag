import { NextResponse } from 'next/server';
import { extractApiKey, handleError } from '@/lib/utils';
import { getVersions } from '@/lib/actions';
import { CustomError } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const apiKey = extractApiKey(request);
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      throw new CustomError('文档ID不能为空', 'DOCUMENT_ID_EMPTY');
    }

    const versionList = await getVersions({ apiKey, documentId });

    return NextResponse.json(versionList, { status: 201 });
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
