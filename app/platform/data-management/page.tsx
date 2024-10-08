import { createClient } from '@/lib/utils/supabase/server';
import { redirect } from 'next/navigation';
import FilesManagement from '@/components/modules/files-management';
import TranslationWrapper from '@/components/auth-translations';

export default async function DataManagementPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <TranslationWrapper namespace="Platform.FilesManagement">
      {(t) => (
        <div className="flex-1 w-full flex flex-col">
          <div className="w-full">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-blue-900 mb-4 dark:text-blue-300">
                {t('title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
            </div>
          </div>
          <FilesManagement />
          <div className="flex flex-col gap-2 items-start">
            <h2 className="font-bold text-2xl mb-4">Your user details</h2>
            <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </TranslationWrapper>
  );
}
