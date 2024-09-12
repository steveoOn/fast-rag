import { NextResponse } from 'next/server';
import { validateAPIKey } from '@/lib/api-key';
import { handleError, extractApiKey } from '@/lib/utils';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const apiKey = extractApiKey(request);
    await validateAPIKey(apiKey);

    return NextResponse.json({ isSuccess: true, message: '验证成功' }, { status: 200 });
  } catch (error) {
    const { message, code } = handleError(error);
    const status = code === 'UNEXPECTED_ERROR' || code === 'UNKNOWN_ERROR' ? 500 : 400;
    return NextResponse.json({ isSuccess: false, error: message }, { status });
  }
}
