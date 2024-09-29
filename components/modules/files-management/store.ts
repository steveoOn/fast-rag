import { create } from 'zustand';
import api from '@/lib/request';
import { FilesManagementStore, TableData } from '@/types';
import { Table, Row } from '@tanstack/react-table';
import { toast } from '@/hooks/use-toast';
import { t } from '@/lib/utils';

const getSelectedFiles = (table: Table<TableData>) => {
  return table.getSelectedRowModel().rows.map((row: Row<TableData>) => ({
    fileId: row.original.id,
    versionId: row.original.version_id,
  }));
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
    const files = getSelectedFiles(table);

    if (!files?.length) {
      toast({
        title: t('FilesManagement.Messages.selectFiles'),
        variant: 'destructive',
      });
      return;
    }

    await api.post('/files-management/delete', { fileIds: files.map((file) => file.fileId) });
    getTableData();
  },
  batchEmbedding: async () => {
    const { table, getTableData } = get();
    if (!table) return;
    const files = getSelectedFiles(table);

    if (!files?.length) {
      toast({
        title: t('FilesManagement.Messages.selectFiles'),
        variant: 'destructive',
      });
      return;
    }

    await api.post('/doc-process/embedding', {
      files,
      force: true,
    });
    getTableData();
  },
  currentEmbedding: async (file) => {
    const { getTableData } = get();

    await api.post('/doc-process/embedding', {
      files: [file],
      force: true,
    });
    getTableData();
  },
  addNewVersion: async ({ file, documentId }) => {
    const { getTableData } = get();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentId', documentId);

    await api.post('/files-management/new-version', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    getTableData();
  },
}));

export default useFilesManagementStore;
