import { z } from 'zod';
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

export type FileUploadRes = z.infer<typeof FileUploadResSchema>;
