'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ConfigurableCard } from '@/components/configurable-card';
import { createClientWithApiKey } from '@/lib/actions/create-client';
import { createAccessToken } from '@/lib/actions/create-access-token';
import { setActiveToken } from '@/lib/actions/set-active-token';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';
import { Plus, Key, RefreshCw } from 'lucide-react';
import MaskedApiKey from '@/components/masked-api-key';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

type Client = {
  id: string;
  name: string;
  status: string;
  api_key: string | null;
};

export default function ClientsList({
  initialClients,
  userId,
}: {
  initialClients: Client[];
  userId: string;
}) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const { toast } = useToast();
  const t = useTranslations('Platform.ClientsManagement');

  const handleCreateClient = async (clientName: string) => {
    setIsCreatingClient(true);
    try {
      const result = await createClientWithApiKey(clientName, userId);
      setClients([...clients, result.client]);
      toast({
        title: t('Steps.create'),
        description: t('clientCreatedDescription', { name: result.client.name }),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: t('Steps.create'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('Steps.create'),
          description: t('unknownError'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsCreatingClient(false);
    }
  };

  const handleCreateApiKey = async (clientId: string, description?: string) => {
    try {
      const newToken = await createAccessToken(clientId, description);
      setClients(
        clients.map((client) =>
          client.id === clientId ? { ...client, api_key: newToken.token } : client
        )
      );
      toast({
        title: t('Steps.create'),
        description: t('apiKeyCreatedDescription'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: t('Steps.create'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('Steps.create'),
          description: t('unknownError'),
          variant: 'destructive',
        });
      }
    }
  };

  const handleSetActiveToken = async (clientId: string, tokenId: string) => {
    try {
      await setActiveToken(clientId, tokenId);
      toast({
        title: t('Steps.switch'),
        description: t('apiKeyActivatedDescription'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: t('Steps.switch'),
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('Steps.switch'),
          description: '未知错误',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <Button
        onClick={() => handleCreateClient('新客户端')}
        disabled={isCreatingClient}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('Steps.create')}
      </Button>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <ConfigurableCard
            key={client.id}
            icon={Key}
            title={client.name}
            content={
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {t('status')}:{' '}
                  <span
                    className={`font-semibold ${client.status === 'active' ? 'text-green-500' : 'text-gray-400'}`}
                  >
                    {client.status === 'active' ? t('active') : t('inactive')}
                  </span>
                </p>
                <div className="text-gray-600 dark:text-gray-400">
                  <div className="mb-1">{t('apiKey')}:</div>
                  <ScrollArea className="w-full h-10 relative pr-20">
                    <div className="w-full h-10 flex items-center">
                      <MaskedApiKey apiKey={client.api_key} />
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </>
            }
            primaryAction={{
              label: t('createNewApiKey'),
              onClick: () => handleCreateApiKey(client.id),
              icon: Plus,
            }}
            secondaryAction={
              client.api_key
                ? {
                    label: t('setActive'),
                    onClick: () => handleSetActiveToken(client.id, client.api_key!),
                    icon: RefreshCw,
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
