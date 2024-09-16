import { z } from 'zod';

export const TableDataSchema = z.object({
  id: z.string(),
  version: z.number(),
  name: z.string(),
  status: z.enum(['pending', 'processing', 'success', 'failed']).optional(),
  create_at: z.string(),
});

export type TableData = z.infer<typeof TableDataSchema>;
