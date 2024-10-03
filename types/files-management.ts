import { z } from 'zod';
import { Table } from '@tanstack/react-table';
import { FileUploadResSchema } from './file';

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
   * 选中的文件
   * @type {Array<{ fileId: string; versionId: string }>}
   */
  selectedFiles: z.array(z.object({ fileId: z.string(), versionId: z.string() })),
  /**
   * 上传进度
   * @type {Array<{ fileName: string; percent: string; completed: boolean; files: FileUploadRes[] }>}
   */
  uploadingProgress: z.array(
    z.object({
      fileName: z.string(),
      percent: z.string(),
      completed: z.boolean(),
      files: z.array(FileUploadResSchema),
    })
  ),
  /**
   * 更新上传进度
   * @param {Object} params - 参数对象
   * @param {string} params.fileName - 文件名
   * @param {string} params.percent - 进度百分比
   * @param {boolean} params.completed - 是否完成
   * @returns {void}
   */
  updateUploadingProgress: z
    .function()
    .args(
      z.object({
        fileName: z.string(),
        percent: z.string(),
        completed: z.boolean(),
        files: z.array(FileUploadResSchema),
      })
    )
    .returns(z.void()),
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
  deleteFiles: z.function(),
  /**
   * 获取表格数据
   * @returns {Promise<void>}
   */
  getTableData: z.function(),
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
  /**
   * 更新选中的文件
   */
  updateSelectedFiles: z.function(),
});

export type FilesManagementStore = z.infer<typeof FilesManagementStoreSchema>;
