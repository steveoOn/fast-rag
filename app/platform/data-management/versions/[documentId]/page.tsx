import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import TranslationWrapper from '@/components/auth-translations';
import { getVersions } from '@/lib/actions';
import { getUserActiveKey } from '@/lib/actions/get-user-active-key';
import BackButton from '@/components/back-button';

export default async function VersionsPage(props: { params: { documentId: string } }) {
  const { documentId } = props.params;
  const supabase = createClient();

  const [
    {
      data: { user },
    },
    apiKey,
  ] = await Promise.all([supabase.auth.getUser(), getUserActiveKey()]);

  if (!user || !apiKey) {
    return redirect('/sign-in');
  }

  const docVersions = await getVersions({ documentId, apiKey });

  return (
    <TranslationWrapper namespace="Platform.VersionsManagement">
      {(t) => (
        <div>
          <BackButton href="/platform/data-management" size="default" label={t('backToFiles')} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Column.name')}</TableHead>
                <TableHead>{t('Column.version')}</TableHead>
                <TableHead>{t('Column.createdAt')}</TableHead>
                <TableHead>{t('Column.preview')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docVersions.map((item) => {
                const { id, version, created_at } = item;
                return (
                  <TableRow key={id}>
                    <TableCell>这是文件名</TableCell>
                    <TableCell>{version}</TableCell>
                    <TableCell>{created_at}</TableCell>
                    <TableCell>这是一个按钮</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </TranslationWrapper>
  );
}
