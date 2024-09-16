import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateAPIKey } from '@/lib/api-key';

export async function middleware(request: NextRequest) {
  // const authHeader = request.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return new NextResponse(JSON.stringify({ error: '未提供有效的 Authorization header' }), {
  //     status: 401,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }

  // const apiKey = authHeader.split('Bearer ')[1];
  // if (!apiKey) {
  //   return new NextResponse(JSON.stringify({ error: '未提供 API KEY' }), {
  //     status: 401,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }

  // try {
  //   await validateAPIKey(apiKey);
  //   console.log('middleware 校验token pass');
  //   return NextResponse.next();
  // } catch (error) {
  //   return new NextResponse(JSON.stringify({ error: '无效的 API KEY' }), {
  //     status: 403,
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
