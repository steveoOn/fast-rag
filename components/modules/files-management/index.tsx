'use client';
import { useEffect, useRef } from 'react';
import Loading from '@/components/loading';
import AddNewDoc from './add-new-doc';
import Embedding from './embedding';
import FilesTable from './files-table';
import Delete from './delete';
import UploadProgress from './progress';
import useFilesManagementStore from './store';

export default function FilesManagement() {
  const renderCount = useRef(0);
  const { getTableData, isLoading } = useFilesManagementStore();

  useEffect(() => {
    if (renderCount.current > 0) return;
    renderCount.current++;
    getTableData();
  }, [getTableData]);

  return (
    <div>
      <div className="flex gap-4">
        <AddNewDoc />
        <Delete />
        <Embedding />
      </div>
      <UploadProgress />
      <div className="pt-6">
        <FilesTable />
      </div>
      {isLoading ? (
        <div className="absolute w-full h-full dark:bg-gray-950 opacity-70 left-0 top-0">
          <Loading />
        </div>
      ) : null}
    </div>
  );
}
