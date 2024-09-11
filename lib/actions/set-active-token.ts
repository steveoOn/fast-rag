'use server';
import { db } from '../db';
import { clients, access_tokens } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import { CustomError, ErrorResponse } from '@/types';
import { handleError } from '../utils';

export async function setActiveToken(
  clientId: string,
  tokenId: string
): Promise<void | { error: ErrorResponse }> {
  try {
    await db.transaction(async (tx) => {
      const client = await tx.select().from(clients).where(eq(clients.id, clientId));

      if (!client) {
        throw new CustomError('客户端不存在', 'CLIENT_NOT_FOUND');
      }

      const token = await tx.select().from(access_tokens).where(eq(access_tokens.id, tokenId));

      if (!token.length || token[0].client_id !== clientId) {
        throw new CustomError('无效的访问令牌', 'INVALID_ACCESS_TOKEN');
      }

      // 将所有令牌设置为非活动状态
      await tx
        .update(access_tokens)
        .set({ status: 'inactive' })
        .where(eq(access_tokens.client_id, clientId));

      // 将选定的令牌设置为活动状态
      await tx.update(access_tokens).set({ status: 'active' }).where(eq(access_tokens.id, tokenId));

      // 更新客户端的 api_key
      await tx.update(clients).set({ api_key: token[0].token }).where(eq(clients.id, clientId));
    });
  } catch (error) {
    if (error instanceof CustomError) {
      return { error: handleError(error) };
    }

    return {
      error: handleError(
        new CustomError(
          '设置活动令牌时发生错误',
          'SET_ACTIVE_TOKEN_ERROR',
          (error as Error).message
        )
      ),
    };
  }
}
