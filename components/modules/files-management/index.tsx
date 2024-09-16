'use client';
import { useEffect, useRef } from 'react';
import Uploader from './uploader';
import Embedding from './embedding';
import FilesTable from './files-table';
import Delete from './delete';
import useFilesManagementStore from './store';

export default function FilesManagement() {
  const renderCount = useRef(0);
  const { getTableData } = useFilesManagementStore();

  useEffect(() => {
    if (renderCount.current > 0) return;
    renderCount.current++;
    getTableData();
  }, [getTableData]);

  return (
    <div>
      <div className="flex gap-4">
        <Uploader />
        <Delete />
        <Embedding />
      </div>
      <div className="p-4">
        <FilesTable />
      </div>
    </div>
  );
}
