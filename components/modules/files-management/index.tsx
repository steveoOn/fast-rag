import Uploader from './uploader';
import Embedding from './embedding';
import { FilesTable } from './files-table';

export default function FilesManagement() {
  return (
    <div>
      <div className="flex gap-4">
        <Uploader />
        <Embedding />
      </div>
      <div className="p-4">
        <FilesTable />
      </div>
    </div>
  );
}
