import { create } from 'zustand';
import api from '@/lib/request';
import { FilesManagementStore, TableData } from '@/types';
import { Table, Row } from '@tanstack/react-table';
import { toast } from '@/hooks/use-toast';
import { t } from '@/lib/utils';
import { FileUploadRes } from '@/types/file';

const getSelectedFiles = (table: Table<TableData>) => {
  return table.getSelectedRowModel().rows.map((row: Row<TableData>) => ({
    fileId: row.original.id,
    versionId: row.original.version_id,
  }));
};

const useFilesManagementStore = create<FilesManagementStore>((set, get) => ({
  isOperation: false,
  isLoading: true,
  table: null,
  tableData: [],
  selectedFiles: [],
  uploadingProgress: [],
  setTable: (table: Table<TableData>) => {
    set({ table });
  },
  updateSelectedFiles: () => {
    const { table } = get();
    if (!table) return;
    setTimeout(() => {
      const selectedFiles = getSelectedFiles(table);
      set({ selectedFiles });
    }, 0);
  },
  getTableData: async () => {
    set({ isLoading: true });
    const response = await api.get<TableData[]>('/files-management/list');
    set({
      tableData: response.data || [],
      isLoading: false,
    });
  },
  deleteFiles: async () => {
    const { table, getTableData } = get();
    if (!table) return;
    const files = getSelectedFiles(table);

    if (!files?.length) {
      toast({
        title: t('Platform.FilesManagement.Messages.selectFiles'),
        variant: 'destructive',
      });
      return;
    }
    set({ isOperation: true });

    await api.post('/files-management/delete', { fileIds: files.map((file) => file.fileId) });
    getTableData();
    set({ isOperation: false });
  },
  batchEmbedding: async () => {
    const { table, getTableData } = get();
    if (!table) return;
    const files = getSelectedFiles(table);

    if (!files?.length) {
      toast({
        title: t('Platform.FilesManagement.Messages.selectFiles'),
        variant: 'destructive',
      });
      return;
    }

    set({ isOperation: true });
    await api.post('/doc-process/embedding', {
      files,
      force: true,
    });

    getTableData();
    set({ isOperation: false });
  },
  currentEmbedding: async (file) => {
    const { getTableData } = get();

    set({ isOperation: true });
    await api.post('/doc-process/embedding', {
      files: [file],
      force: true,
    });
    getTableData();
    set({ isOperation: false });
  },
  updateUploadingProgress: (data) => {
    const fileName = data.completed ? data.files[0].name : data.fileName;

    set((state) => {
      const { uploadingProgress } = state;
      if (data.completed || data.percent === '100.00') {
        // 如果完成，从列表中移除
        return {
          uploadingProgress: uploadingProgress.filter((item) => item.fileName !== fileName),
        };
      } else {
        const existingItemIndex = uploadingProgress.findIndex((item) => item.fileName === fileName);

        if (existingItemIndex === -1) {
          // 如果不存在，添加到列表
          return {
            uploadingProgress: [...uploadingProgress, data],
          };
        } else {
          // 如果存在，更新该项
          const updatedProgress = [...uploadingProgress];
          updatedProgress[existingItemIndex] = data;
          return {
            uploadingProgress: updatedProgress,
          };
        }
      }
    });
  },
  uploadFiles: async (e) => {
    const { getTableData, updateUploadingProgress } = get();
    const files = e.target?.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`file-${index}`, file);
      });

      api.sse({
        url: '/files-management/upload',
        data: formData,
        onData: (data) => {
          updateUploadingProgress(
            data as {
              completed: boolean;
              percent: string;
              fileName: string;
              files: FileUploadRes[];
            }
          );
          if (data.completed) {
            getTableData();
          }
        },
      });
    }
  },
  addNewVersion: async ({ file, documentId }) => {
    const { getTableData, updateUploadingProgress } = get();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentId', documentId);

    api.sse({
      url: '/files-management/new-version',
      data: formData,
      onData: (data: { [key: string]: unknown; completed?: boolean; percent?: string }) => {
        updateUploadingProgress(
          data as {
            completed: boolean;
            percent: string;
            fileName: string;
            files: FileUploadRes[];
          }
        );
        if (data.completed) {
          getTableData();
        }
      },
    });
  },
}));

export default useFilesManagementStore;
