import { z } from 'zod';
import { document_versions } from '@/lib/db/schema/schema';

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

const createVectorSchema = (dimensions: number) =>
  z
    .array(z.number())
    .length(dimensions)
    .refine((arr) => arr.every((n) => Number.isFinite(n)), {
      message: `Vector must be an array of ${dimensions} finite numbers`,
    });

export const EmbedDataSchema = z.object({
  document_version_id: z.string(),
  content: z.string(),
  embedding: createVectorSchema(1356),
  document_version: z.number(),
});

// 派生类型
export type Chunk = z.infer<typeof ChunkSchema>;
export type ChunkOptions = z.infer<typeof ChunkOptionsSchema>;
export type Paragraph = z.infer<typeof ParagraphSchema>;
export type EmbedData = z.infer<typeof EmbedDataSchema>;
