'use client';
import { Input } from '@/components/ui/input';
import api from '@/lib/request';
import useFilesManagementStore from '../store';

export default function Uploader() {
  const { getTableData } = useFilesManagementStore();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`${index}`, file);
      });

      await api.post('/files-management/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      getTableData();
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input id="picture" type="file" multiple onChange={handleChange} />
    </div>
  );
}
