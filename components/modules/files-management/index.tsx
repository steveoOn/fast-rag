'use client';
import { useEffect, useRef } from 'react';
import AddNewDoc from './add-new-doc';
import Embedding from './embedding';
import FilesTable from './files-table';
import Delete from './delete';
import UploadProgress from './progress';
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
      <div className="flex gap-4 px-4">
        <AddNewDoc />
        <Delete />
        <Embedding />
      </div>
      <UploadProgress />
      <div className="p-4">
        <FilesTable />
      </div>
    </div>
  );
}
