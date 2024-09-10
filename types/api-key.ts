import { z } from 'zod';

const APIKeySchema = z.object({
  id: z.string(),
  prefix: z.string(),
  secret: z.string(),
  signature: z.string(), // 新增：服务器签名
  fullKey: z.string(),
  expiresAt: z.date().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
});

type APIKey = z.infer<typeof APIKeySchema>;

export { APIKeySchema };
export type { APIKey };
