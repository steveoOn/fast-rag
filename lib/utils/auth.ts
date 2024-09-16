import { db } from '@/lib/db';
import { clients } from '@/lib/db/schema/schema';
import { eq } from 'drizzle-orm';
import { CustomError } from '@/types';

export function extractApiKey(request: Request): string {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new CustomError('未提供有效的 Authorization header', 'MISSING_AUTHORIZATION_HEADER');
  }

  const apiKey = authHeader.split('Bearer ')[1];
  if (!apiKey) {
    throw new CustomError('未提供 API KEY', 'MISSING_API_KEY');
  }

  return apiKey;
}

export async function validateClient(apiKey: string) {
  const client = await db.select().from(clients).where(eq(clients.api_key, apiKey));
  if (!client) {
    throw new CustomError('客户端不存在', 'CLIENT_NOT_FOUND');
  }

  return client[0];
}
