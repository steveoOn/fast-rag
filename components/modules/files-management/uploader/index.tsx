import { Input } from '@/components/ui/input';
import useFilesManagementStore from '../store';

export default function Uploader() {
  const { uploadFiles } = useFilesManagementStore();

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input id="picture" type="file" multiple onChange={uploadFiles} />
    </div>
  );
}
