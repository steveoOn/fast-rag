import { NextResponse } from 'next/server';
import { extractApiKey, handleError } from '@/lib/utils';
import { delFiles } from '@/lib/actions/files-management/delete';

export async function DELETE(request: Request) {
  try {
    const apiKey = extractApiKey(request);
    const body = await request.json();

    await delFiles(body.fileIds, apiKey);

    return NextResponse.json({ data: 'deleted' }, { status: 201 });
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
