'use server';

import { db } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { clients } from '@/lib/db/schema/schema';
import { createClient } from '@/lib/utils/supabase/server';
import { CustomError } from '@/types';
import { handleError } from '@/lib/utils/error';

export async function getUserActiveKey(): Promise<string> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      throw new CustomError('认证失败', 'AUTH_ERROR', authError.message);
    }

    if (!user) {
      throw new CustomError('用户未登录', 'UNAUTHORIZED');
    }

    const activeClient = await db.query.clients.findFirst({
      where: and(eq(clients.user_id, user.id), eq(clients.status, 'active')),
      columns: {
        api_key: true,
      },
    });

    if (!activeClient || !activeClient.api_key) {
      throw new CustomError('未找到活跃的API密钥', 'NO_ACTIVE_KEY');
    }

    return activeClient.api_key;
  } catch (error) {
    const formattedError = handleError(error);
    throw new CustomError(formattedError.message, formattedError.code, formattedError.details);
  }
}
