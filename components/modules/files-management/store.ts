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
  getTableData: async () => {
    const response = await api.get('/files-management/list');
    const { data } = response;
    set({ tableData: data || [] });
  },
  deleteFiles: async () => {
    const { table, getTableData } = get();
    if (!table) return;
    const fileIds = getSelectedFiles(table);
    await api.post('/files-management/delete', { fileIds });
    getTableData();
  },
}));

export default useFilesManagementStore;
