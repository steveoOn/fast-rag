import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useFilesManagementStore from '../store';

export default function Embedding() {
  const t = useTranslations('Platform.FilesManagement');
  const { batchEmbedding, selectedFiles, isOperation } = useFilesManagementStore();

  return (
    <Button onClick={batchEmbedding} disabled={isOperation || selectedFiles.length === 0}>
      {t('Operation.batchEmbedding')}
    </Button>
  );
}
