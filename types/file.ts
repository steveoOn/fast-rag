import { z } from 'zod';
import { ChunkSchema } from './doc-process';
import { document_type } from '../lib/db/schema/schema';

export const FileSchema = z.object({
  id: z.string().optional(), // 文件唯一标识
  name: z.string(), // 文件名
  type: z.enum(document_type.enumValues), // MIME 类型
  size: z.number(), // 文件大小（字节）
  uploadURL: z.string().url().optional(), // 文件在存储中的 URL（可选，因为上传前可能没有）
  lastModified: z.number(), // 最后修改时间戳
  extension: z.string(), // 文件扩展名
  metadata: z.record(z.unknown()).optional(), // 可选元数据
});

export type FileMetadata = z.infer<typeof FileSchema>;

// 修改 UploadFile 类型定义
export type UploadFile = Omit<FileMetadata, 'uploadURL' | 'id'> & {
  buffer: Buffer;
};

export const FileUploadResSchema = z.object({
  name: z.string(), // 文件名
  type: z.enum(document_type.enumValues), // MIME 类型
  size: z.number(), // 文件大小（字节）
  uploadURL: z.string().url().optional(), // 文件在存储中的 URL（可选，因为上传前可能没有）
  lastModified: z.number(), // 最后修改时间戳
  extension: z.string(), // 文件扩展名
});

// 文件下载
export const FileLoadedSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  type: z.enum(document_type.enumValues),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  document_version_id: z.string(),
});

// 文件读取
export const fileReadSchema = z.object({
  ...FileLoadedSchema.shape,
  text: z.string(),
  chunks: z.array(ChunkSchema),
});

export type FileUploadRes = z.infer<typeof FileUploadResSchema>;
export type FileLoaded = z.infer<typeof FileLoadedSchema>;
export type FileRead = z.infer<typeof fileReadSchema>;
