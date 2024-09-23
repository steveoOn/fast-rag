import { signOutAction } from '@/lib/actions/sign-up';
import Link from 'next/link';
import { Button } from './ui/button';
import { createClient } from '@/lib/utils/supabase/server';
import AuthTranslations from './auth-translations';

export default async function AuthButton() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  return (
    <AuthTranslations namespace="Auth">
      {(t) =>
        user ? (
          <div className="flex items-center gap-4">
            {t('welcome', { name: user.email })}
            <form action={signOutAction}>
              <Button type="submit" variant={'outline'}>
                {t('signOut')}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button asChild size="sm" variant={'outline'}>
              <Link href="/sign-in">{t('signIn')}</Link>
            </Button>
            <Button asChild size="sm" variant={'default'}>
              <Link href="/sign-up">{t('signUp')}</Link>
            </Button>
          </div>
        )
      }
    </AuthTranslations>
  );
}
