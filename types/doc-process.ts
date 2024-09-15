import { z } from 'zod';

export const ChunkMetadataSchema = z.object({
  start: z.number(),
  end: z.number(),
  size: z.number(),
});

export const ChunkSchema = z.object({
  content: z.string(),
  metadata: ChunkMetadataSchema,
});

export const ChunkOptionsSchema = z.object({
  chunkOverlap: z.number(),
  chunkSize: z.number(),
});

export const ParagraphSchema = z.object({
  content: z.string(),
  size: z.number(),
  start: z.number(),
  end: z.number(),
});

// 派生类型
export type Chunk = z.infer<typeof ChunkSchema>;
export type ChunkOptions = z.infer<typeof ChunkOptionsSchema>;
export type Paragraph = z.infer<typeof ParagraphSchema>;
