import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import useFilesManagementStore from '../store';

const UploadProgress = () => {
  const { uploadingProgress } = useFilesManagementStore();

  return (
    <div className={cn('px-4 pt-4', uploadingProgress.length > 0 ? 'block' : 'hidden')}>
      {uploadingProgress.map((item, index) => {
        const { percent, fileName } = item;
        return (
          <div className="flex items-center w-full" key={index}>
            <div className="mr-4 w-[150px]">
              <span className="truncate block">{fileName}</span>
            </div>
            <div className="flex-grow">
              <Progress value={Number(percent)} />
            </div>
            <div className="w-20 ml-4">
              <span>{percent}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UploadProgress;
