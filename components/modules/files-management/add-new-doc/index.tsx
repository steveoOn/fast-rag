import { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import useFilesManagementStore from '../store';

export default function AddNewDoc() {
  const [fileList, setFileList] = useState<File[]>([]);
  const [docNames, setDocNames] = useState<string[]>([]);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Platform.FilesManagement.Operation');
  const { uploadFiles, isOperation } = useFilesManagementStore();

  const selectFilesTrigger = () => {
    const inputFIle = inputFileRef.current;
    if (!inputFIle) return;
    inputFIle.click();
  };

  const selectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFileList(fileArray);
      setDocNames(fileArray.map((item) => item.name));
    }
  };

  const updateDocName = (index: number, docName: string) => {
    setDocNames((prev) => prev.map((name, docIndex) => (index === docIndex ? docName : name)));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setFileList([]);
            setDocNames([]);
          }}
          disabled={isOperation}
          variant="outline"
        >
          {t('uploadNewDoc')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('uploadNewDoc')}</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <div>
            <Input
              className="hidden"
              ref={inputFileRef}
              type="file"
              multiple
              onChange={selectFiles}
            />
            <Button className="w-full" onClick={selectFilesTrigger} variant="outline">
              {t('selectFiles')}
            </Button>
          </div>
          <div className="py-4">
            {docNames.map((docName, index) => (
              <div className="py-2" key={index}>
                <Input
                  value={docName}
                  onChange={(e) => {
                    const docName = e.target.value;
                    updateDocName(index, docName);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={() => {
                uploadFiles({ files: fileList, docNames });
              }}
            >
              {t('confirm')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
