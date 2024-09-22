import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getUserClients } from '@/lib/actions/get-user-clients';
import ClientsList from '@/components/modules/clients-list';

export default async function ClientsManagementPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const clients = await getUserClients(user.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">客户端管理</h1>
      <ClientsList initialClients={clients} userId={user.id} />
    </div>
  );
}
