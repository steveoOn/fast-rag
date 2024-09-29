import { z } from 'zod';
import { Table } from '@tanstack/react-table';

export const TableDataSchema = z.object({
  id: z.string(),
  version_id: z.string(),
  version: z.number(),
  name: z.string(),
  status: z.enum(['pending', 'processing', 'success', 'failed']).optional(),
  create_at: z.string(),
});

export type TableData = z.infer<typeof TableDataSchema>;

const TableSchema = z.custom<Table<z.infer<typeof TableDataSchema>>>((data) => {
  return data instanceof Object && 'getRowModel' in data;
});

/**
 * @typedef {Object} FilesManagementStore
 */
export const FilesManagementStoreSchema = z.object({
  /**
   * 用于显示文件数据的表格实例
   * @type {Table<TableData> | null}
   */
  table: z.custom<Table<TableData> | null>(),
  /**
   * 用于显示文件数据的表格数据
   * @type {TableData[]}
   */
  tableData: z.array(TableDataSchema),
  /**
   * 设置表格实例
   * @param {Table<TableData>} table - 表格实例
   */
  setTable: z.function().args(TableSchema).returns(z.void()),
  /**
   * 删除文档（包括所有版本）
   * @param {string} fileId - 文件ID
   * @param {string} versionId - 版本ID
   * @returns {void}
   */
  deleteFiles: z.function().args(z.string(), z.string()).returns(z.void()),
  /**
   * 获取表格数据
   * @returns {Promise<void>}
   */
  getTableData: z.function().returns(z.promise(z.void())),
  /**
   * 上传新文档
   * @param {React.ChangeEvent<HTMLInputElement>} event - 文件上传事件
   * @returns {void}
   */
  uploadFiles: z.function().args(z.custom<React.ChangeEvent<HTMLInputElement>>()).returns(z.void()),
  /**
   * 文档（最新版本）批量向量化
   * @returns {void}
   */
  batchEmbedding: z.function().returns(z.void()),
  /**
   * 文档（最新版本）向量化
   * @param {Object} params - 参数对象
   * @param {string} params.fileId - 文件ID
   * @param {string} params.versionId - 版本ID
   * @returns {void}
   */
  currentEmbedding: z
    .function()
    .args(z.custom<{ fileId: string; versionId: string }>())
    .returns(z.void()),
  /**
   * 添加新版本
   * @param {Object} params - 参数对象
   * @param {File} params.file - 新版本文件
   * @param {string} params.documentId - 文档ID
   * @returns {void}
   */
  addNewVersion: z
    .function()
    .args(z.custom<{ file: File; documentId: string }>())
    .returns(z.void()),
});

export type FilesManagementStore = z.infer<typeof FilesManagementStoreSchema>;
