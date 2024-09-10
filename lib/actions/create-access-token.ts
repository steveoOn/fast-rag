'use server';

import { db } from '../db';
import { access_tokens, AccessToken } from '../db/schema/schema';
import { generateAPIKey } from '../api-key/generate-key';
import { handleError } from '../utils';
import { CustomError } from '@/types';

export async function createAccessToken(
  clientId: string,
  description?: string,
  status: AccessToken['status'] = 'active'
): Promise<AccessToken | { error: ReturnType<typeof handleError> }> {
  const apiKey = generateAPIKey(clientId);

  try {
    const [newToken] = await db
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
