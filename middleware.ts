import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/utils/supabase/middleware';
import { logger } from '@/lib/utils/logger';
import { extractApiKey } from '@/lib/utils/extract-api-key';
import { validateRedisAPIKey } from '@/lib/api-key/validate-redis-key';
import { CustomError } from '@/types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/v1/')) {
    try {
      const apiKey = extractApiKey(request);
      logger.info(`API Key: ${apiKey}`);
      await validateRedisAPIKey(apiKey);
    } catch (error) {
      if (error instanceof CustomError) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      return NextResponse.json({ error: '无效的 API 密钥' }, { status: 401 });
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
