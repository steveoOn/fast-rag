'use server';
import { db } from '../db';
import { clients, access_tokens } from '../db/schema/schema';
import { eq, and, not } from 'drizzle-orm';
import { CustomError } from '@/types';
import { cacheApiKey } from '../redis/api-key-cache';

export async function setActiveToken(clientId: string, tokenId: string): Promise<void> {
  await db.transaction(async (tx) => {
    const [client] = await tx.select().from(clients).where(eq(clients.id, clientId)).limit(1);

    if (!client) {
      throw new CustomError('客户端不存在', 'CLIENT_NOT_FOUND');
    }

    const [token] = await tx
      .select()
      .from(access_tokens)
      .where(and(eq(access_tokens.id, tokenId), eq(access_tokens.client_id, clientId)))
      .limit(1);

    if (!token) {
      throw new CustomError('无效的访问令牌', 'INVALID_ACCESS_TOKEN');
    }

    // 将所有其他令牌设置为非活动状态
    await tx
      .update(access_tokens)
      .set({ status: 'inactive' })
      .where(and(eq(access_tokens.client_id, clientId), not(eq(access_tokens.id, tokenId))));

    // 将选定的令牌设置为活动状态
    await tx.update(access_tokens).set({ status: 'active' }).where(eq(access_tokens.id, tokenId));

    // 更新客户端的 api_key
    await tx.update(clients).set({ api_key: token.token }).where(eq(clients.id, clientId));

    // 缓存新的 API key 到 Redis
    await cacheApiKey(token.token, clientId, 'active');
  });
}
