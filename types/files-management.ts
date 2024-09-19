import { z } from 'zod';
import { Table } from '@tanstack/react-table';

export const TableDataSchema = z.object({
  id: z.string(),
  version: z.number(),
  name: z.string(),
  status: z.enum(['pending', 'processing', 'success', 'failed']).optional(),
  create_at: z.string(),
});

export type TableData = z.infer<typeof TableDataSchema>;

const TableSchema = z.custom<Table<z.infer<typeof TableDataSchema>>>((data) => {
  return data instanceof Object && 'getRowModel' in data;
});

export const FilesManagementStoreSchema = z.object({
  table: z.custom<Table<TableData> | null>(),
  tableData: z.array(TableDataSchema),
  setTable: z.function().args(TableSchema).returns(z.void()),
  deleteFiles: z.function(),
  getTableData: z.function().returns(z.promise(z.void())),
  uploadFiles: z.function().args(z.custom<React.ChangeEvent<HTMLInputElement>>()),
  embed: z.function(),
});

export type FilesManagementStore = z.infer<typeof FilesManagementStoreSchema>;
