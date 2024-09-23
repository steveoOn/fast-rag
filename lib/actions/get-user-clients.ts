'use server';

import { db } from '../db';
import { clients, Client } from '../db/schema/schema';
import { eq } from 'drizzle-orm';

export async function getUserClients(userId: string): Promise<Client[]> {
  return await db.select().from(clients).where(eq(clients.user_id, userId));
}
