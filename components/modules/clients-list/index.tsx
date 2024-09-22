'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { createClientWithApiKey } from '@/lib/actions/create-client';
import { createAccessToken } from '@/lib/actions/create-access-token';
import { setActiveToken } from '@/lib/actions/set-active-token';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

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
          description: '未知错误',
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
          description: '未知错误',
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
    <>
      <Button onClick={() => handleCreateClient('新客户端')} disabled={isCreatingClient}>
        {t('Steps.create')}
      </Button>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onCreateApiKey={handleCreateApiKey}
            onSetActiveToken={handleSetActiveToken}
          />
        ))}
      </div>
    </>
  );
}

function ClientCard({
  client,
  onCreateApiKey,
  onSetActiveToken,
}: {
  client: Client;
  onCreateApiKey: (clientId: string, description?: string) => void;
  onSetActiveToken: (clientId: string, tokenId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{client.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>状态: {client.status}</p>
        <p>API Key: {client.api_key}</p>
        <Button onClick={() => onCreateApiKey(client.id)}>创建新 API Key</Button>
      </CardContent>
    </Card>
  );
}
