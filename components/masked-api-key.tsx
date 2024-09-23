import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { CopyButton } from '@/components/copy-button';
import { useTranslations } from 'next-intl';

export default function MaskedApiKey({ apiKey }: { apiKey: string | null }) {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('Platform.ClientsManagement');

  if (!apiKey) {
    return <span>{t('noApiKey')}</span>;
  }

  const [prefix, ...rest] = apiKey.split('.');
  const maskedKey = isVisible ? apiKey : `${prefix}.${'*'.repeat(rest.join('.').length)}`;

  return (
    <>
      <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-1 rounded-md whitespace-nowrap overflow-x-auto max-w-full">
        {maskedKey}
      </code>
      <div className="absolute right-0 top-0 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? t('hideApiKey') : t('showApiKey')}
          className="p-1"
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <CopyButton content={apiKey} />
      </div>
    </>
  );
}
