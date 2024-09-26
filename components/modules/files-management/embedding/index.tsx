import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useFilesManagementStore from '../store';

export default function Embedding() {
  const t = useTranslations('FilesManagement');
  const { batchEmbedding } = useFilesManagementStore();

  return <Button onClick={batchEmbedding}>{t('Operation.batchEmbedding')}</Button>;
}
