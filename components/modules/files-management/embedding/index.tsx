import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useFilesManagementStore from '../store';

export default function Embedding() {
  const t = useTranslations('FilesManagement');
  const { embed } = useFilesManagementStore();

  return <Button onClick={embed}>{t('Operation.batchEmbedding')}</Button>;
}
