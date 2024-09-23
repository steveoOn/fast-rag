import { resetPasswordAction } from '@/lib/actions/sign-up';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthTranslations from '@/components/auth-translations';
import { HashRedirect } from './hash-redirect';

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Message & {
    error?: string;
    error_description?: string;
    success?: string;
    message?: string;
  };
}) {
  let message: Message | null = null;
  if (searchParams.error) {
    message = {
      error: `${searchParams.error}: ${decodeURIComponent(searchParams.error_description || '')}`,
    };
  } else if (typeof searchParams.success === 'string') {
    message = { success: searchParams.success };
  } else if (typeof searchParams.message === 'string') {
    message = { message: searchParams.message };
  }

  const [messageElement, isFormDisabled] = message ? FormMessage({ message }) : [null, false];

  return (
    <AuthTranslations namespace="Auth.ResetPasswordPage">
      {(t) => (
        <div className="flex-1 flex min-h-screen justify-center items-center">
          <HashRedirect />
          <form className="flex flex-col min-w-64 max-w-64 mx-auto">
            <h1 className="text-2xl font-medium">{t('title')}</h1>
            <p className="text-sm text-foreground/60">{t('enterYourNewPassword')}</p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
              <Label htmlFor="password">{t('newPassword')}</Label>
              <Input
                type="password"
                name="password"
                placeholder={t('newPasswordPlaceholder')}
                required
                disabled={isFormDisabled}
              />
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder={t('confirmPasswordPlaceholder')}
                required
                disabled={isFormDisabled}
              />
              <SubmitButton
                pendingText={t('resetPasswordLoading')}
                formAction={resetPasswordAction}
                disabled={isFormDisabled}
              >
                {t('resetPassword')}
              </SubmitButton>
              {messageElement}
            </div>
          </form>
        </div>
      )}
    </AuthTranslations>
  );
}
