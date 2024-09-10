'use server';
import { db } from '../db';
import { access_tokens, AccessToken, clients } from '../db/schema/schema';
import { generateAPIKey } from '../api-key/generate-key';
import { handleError } from '../utils';
import { CustomError } from '@/types';
import { eq } from 'drizzle-orm';

export async function createAccessToken(
  clientId: string,
  description?: string,
  status: AccessToken['status'] = 'active'
): Promise<AccessToken | { error: ReturnType<typeof handleError> }> {
  try {
    return await db.transaction(async (tx) => {
      // 检查客户端是否存在
      const clientExists = await tx
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

      if (!clientExists.length) {
        throw new CustomError('客户端不存在', 'CLIENT_NOT_FOUND');
      }

      const apiKey = generateAPIKey(clientId);

      const [newToken] = await tx
        .insert(access_tokens)
        .values({
          client_id: clientId,
          token: apiKey.fullKey,
          description,
          status,
          expires_at: apiKey.expiresAt?.toISOString() ?? null,
        })
        .returning();

      if (!newToken) {
        throw new CustomError('创建访问令牌失败', 'ACCESS_TOKEN_CREATION_FAILED');
      }

      return newToken;
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return { error: handleError(error) };
    }
    return {
      error: handleError(
        new CustomError('创建访问令牌时发生错误', 'ACCESS_TOKEN_ERROR', (error as Error).message)
      ),
    };
  }
}
