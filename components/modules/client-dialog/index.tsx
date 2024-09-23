import { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

interface ClientDialogProps {
  onSubmit: (clientName: string) => void;
  isSubmitting: boolean;
}

export default function ClientDialog({ onSubmit, isSubmitting }: ClientDialogProps) {
  const [clientName, setClientName] = useState<string>('');
  const t = useTranslations('Platform.ClientsManagement');

  const handleSubmit = () => {
    onSubmit(clientName);
    setClientName('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="mr-2 h-4 w-4" />
          {t('Steps.create')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Steps.create')}</DialogTitle>
          <DialogDescription>{t('enterClientName')}</DialogDescription>
        </DialogHeader>
        <Input
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder={t('clientNamePlaceholder')}
        />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {t('Steps.create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
