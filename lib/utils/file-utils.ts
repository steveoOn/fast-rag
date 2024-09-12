import { type DocumentType, document_type } from '../db/schema/schema';
import { CustomError } from '@/types';

export function mimeTypeToDocumentType(mimeType: string, fileName: string): DocumentType {
  const mimeMap: Record<string, DocumentType> = {
    'application/pdf': 'pdf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
    'text/markdown': 'md',
    'text/csv': 'csv',
    'application/rtf': 'rtf',
    'application/json': 'json',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
  };

  const documentType = mimeMap[mimeType];
  if (!documentType) {
    throw new CustomError(`不支持的文件类型: ${mimeType}`, 'UNSUPPORTED_FILE_TYPE');
  }

  // 检查文件扩展名
  const extension = fileName.split('.').pop()?.toLowerCase();
  const allowedExtensions = document_type.enumValues.map((value) => value.toLowerCase());
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new CustomError(`不支持的文件扩展名: ${extension}`, 'UNSUPPORTED_FILE_EXTENSION');
  }

  return documentType;
}

export function sanitizeFileName(fileName: string): string {
  // 移除非 ASCII 字符，替换空格为下划线
  return fileName.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, '_');
}
