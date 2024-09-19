import { signUpAction } from '@/lib/actions/sign-up';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { SmtpMessage } from '@/components/smtp-message';
import { useTranslations } from 'next-intl';

export default function Signup({ searchParams }: { searchParams: Message }) {
  const t = useTranslations('Auth');

  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto">
        <h1 className="text-2xl font-medium">{t('signUp')}</h1>
        <p className="text-sm text text-foreground">
          {t('SignUpPage.alreadyHaveAnAccount')}
          <Link className="text-primary font-medium underline" href="/sign-in">
            {t('signIn')}
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">{t('SignUpPage.email')}</Label>
          <Input name="email" placeholder="you@example.com" required />
          <Label htmlFor="password">{t('SignUpPage.password')}</Label>
          <Input
            type="password"
            name="password"
            placeholder={t('SignUpPage.passwordPlaceholder')}
            minLength={6}
            required
          />
          <SubmitButton formAction={signUpAction} pendingText="Signing up...">
            {t('signUp')}
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage
        message={t('SignUpPage.smtpMessage')}
        linkText={t('SignUpPage.smtpLinkText')}
        linkHref="/"
      />
    </>
  );
}
