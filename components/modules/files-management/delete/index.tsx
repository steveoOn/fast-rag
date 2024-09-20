import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useFilesManagementStore from '../store';

export default function Delete() {
  const t = useTranslations('FilesManagement');
  const { deleteFiles } = useFilesManagementStore();

  return (
    <Button variant="destructive" onClick={deleteFiles}>
      {t('Operation.delete')}
    </Button>
  );
}
