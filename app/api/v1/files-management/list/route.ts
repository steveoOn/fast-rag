import { NextResponse } from 'next/server';
import { extractApiKey, handleError } from '@/lib/utils';
import { getFiles } from '@/lib/actions';

export async function GET(request: Request) {
  try {
    const apiKey = extractApiKey(request);

    const filesList = await getFiles(apiKey);

    return NextResponse.json({ data: filesList }, { status: 201 });
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
