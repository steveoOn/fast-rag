import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import useFilesManagementStore from '../store';

export default function Delete() {
  const t = useTranslations('Platform.FilesManagement');
  const { deleteFiles, selectedFiles } = useFilesManagementStore();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={selectedFiles.length === 0}>
          {t('Operation.delete')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Messages.deleteDialogTitle')}</AlertDialogTitle>
          <AlertDialogDescription>{t('Messages.deleteDialogDescription')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Operation.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={deleteFiles}>{t('Operation.confirm')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
