'use client';
import { Input } from '@/components/ui/input';
import { post } from '@/lib/request';

export default function Uploader() {
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file, index) => {
        formData.append(`${index}`, file);
      });

      const response = await post('/api/v1/files-management/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input id="picture" type="file" multiple onChange={handleChange} />
    </div>
  );
}
