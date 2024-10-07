import { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useFilesManagementStore from '../store';

export default function AddNewDoc() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Platform.FilesManagement.Operation');
  const { uploadFiles, isOperation } = useFilesManagementStore();

  const selectFiles = () => {
    const inputFIle = inputFileRef.current;
    if (!inputFIle) return;
    inputFIle.click();
  };

  return (
    <div className="inline-block">
      <Input
        className="hidden"
        ref={inputFileRef}
        type="file"
        multiple
        onChange={(e) => {
          uploadFiles(e);
          e.target.value = '';
        }}
      />
      <Button onClick={selectFiles} disabled={isOperation} variant="outline">
        {t('uploadNewDoc')}
      </Button>
    </div>
  );
}
