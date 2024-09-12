'use server';
import { db } from '../db';
import { access_tokens, AccessToken, clients } from '../db/schema/schema';
import { generateAPIKey } from '../api-key/generate-key';
import { CustomError } from '@/types';
import { eq, and, not } from 'drizzle-orm';

export async function createAccessToken(
  clientId: string,
  description?: string,
  status: AccessToken['status'] = 'active'
): Promise<AccessToken> {
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

    // 将其他令牌设置为非活动状态
    await tx
      .update(access_tokens)
      .set({ status: 'inactive' })
      .where(and(eq(access_tokens.client_id, clientId), not(eq(access_tokens.id, newToken.id))));

    // 更新客户端的 api_key
    await tx.update(clients).set({ api_key: newToken.token }).where(eq(clients.id, clientId));

    return newToken;
  });
}
