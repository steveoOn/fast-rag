import { create } from 'zustand';
import api from '@/lib/request';
import { FilesManagementStore, TableData } from '@/types';
import { Table, Row } from '@tanstack/react-table';

const getSelectedFiles = (table: Table<TableData>) => {
  return table.getSelectedRowModel().rows.map((row: Row<TableData>) => row.original.id);
};

const useFilesManagementStore = create<FilesManagementStore>((set, get) => ({
  table: null,
  tableData: [],
  selectedFiles: [],
  setTable: (table: Table<TableData>) => {
    set({ table });
  },
  uploadFiles: async (e) => {
    const { getTableData } = get();
    const files = e.target?.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      await api.post('/files-management/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      getTableData();
    }
  },
  getTableData: async () => {
    const response = await api.get<TableData[]>('/files-management/list');
    set({ tableData: response.data || [] });
  },
  deleteFiles: async () => {
    const { table, getTableData } = get();
    if (!table) return;
    const fileIds = getSelectedFiles(table);
    if (!fileIds?.length) return;
    await api.post('/files-management/delete', { fileIds });
    getTableData();
  },
  embed: async () => {
    const { table, getTableData } = get();
    if (!table) return;
    const files = getSelectedFiles(table);
    if (!files?.length) return;
    await api.post('/doc-process/embedding', {
      files,
      force: true,
    });
    getTableData();
  },
}));

export default useFilesManagementStore;
