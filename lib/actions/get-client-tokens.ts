'use server';
import { db } from '../db';
import { access_tokens } from '../db/schema/schema';
import { eq } from 'drizzle-orm';

export async function getClientTokens(clientId: string) {
  const tokens = await db.select().from(access_tokens).where(eq(access_tokens.client_id, clientId));

  return tokens;
}
