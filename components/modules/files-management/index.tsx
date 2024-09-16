'use client';
import { useState, useEffect } from 'react';
import { get } from '@/lib/request';
import useSWR from 'swr';
import Uploader from './uploader';
import Embedding from './embedding';
import { FilesTable } from './files-table';
import { TableData } from '@/types/files-data';

export default function FilesManagement() {
  const { data, isLoading } = useSWR<{ data: { data: TableData[] }; isLoading: boolean }>(
    '/api/v1/files-management/list',
    get
  );

  const [filesData, setData] = useState<TableData[]>([]);

  useEffect(() => {
    if (data && !isLoading) {
      setData(data.data?.data || []);
    }
  }, [data, isLoading]);

  return (
    <div>
      <div className="flex gap-4">
        <Uploader />
        <Embedding />
      </div>
      <div className="p-4">
        <FilesTable data={filesData} />
      </div>
    </div>
  );
}
