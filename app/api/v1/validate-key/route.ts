import { NextResponse } from 'next/server';
import { validateAPIKey } from '@/lib/api-key/validate-key';
import { CustomError } from '@/types';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: '未提供有效的 Authorization header' }, { status: 400 });
  }

  const apiKey = authHeader.split('Bearer ')[1];

  if (!apiKey) {
    return NextResponse.json({ error: '未提供 API 密钥' }, { status: 400 });
  }

  try {
    await validateAPIKey(apiKey);
    return NextResponse.json({ isSuccess: true, message: '验证成功' }, { status: 200 });
  } catch (error) {
    if (error instanceof CustomError) {
      return NextResponse.json({ error: error.message, isSuccess: false }, { status: 401 });
    }
    return NextResponse.error();
  }
}
