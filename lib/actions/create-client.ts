'use server';

import { db } from '../db';
import { generateAPIKey } from '../api-key/generate-key';
import { clients, Client } from '../db/schema/schema';
import { createAccessToken } from './create-access-token';
import { handleError } from '../utils';
import { CustomError } from '@/types';
import { eq } from 'drizzle-orm';

export async function createClientWithApiKey(
  clientName: string,
  tokenDescription?: string
): Promise<{ client: Client; apiKey: string } | { error: ReturnType<typeof handleError> }> {
  try {
    return await db.transaction(async (tx) => {
      const [newClient] = await tx
        .insert(clients)
        .values({
          name: clientName,
          status: 'active',
        })
        .returning();

      if (!newClient) {
        throw new CustomError('创建客户端失败', 'CLIENT_CREATION_FAILED');
      }

      const apiKey = generateAPIKey(newClient.id);

      await tx.update(clients).set({ api_key: apiKey.fullKey }).where(eq(clients.id, newClient.id));

      const accessTokenResult = await createAccessToken(newClient.id, tokenDescription);

      if ('error' in accessTokenResult) {
        throw new CustomError('创建访问令牌失败', 'ACCESS_TOKEN_CREATION_FAILED');
      }

      return {
        client: newClient,
        apiKey: apiKey.fullKey,
      };
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return { error: handleError(error) };
    }
    return {
      error: handleError(
        new CustomError(
          '创建客户端和API密钥时发生错误',
          'CLIENT_API_KEY_ERROR',
          (error as Error).message
        )
      ),
    };
  }
}
