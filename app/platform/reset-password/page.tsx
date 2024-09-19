import { resetPasswordAction } from '@/lib/actions/sign-up';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthTranslations } from '@/components/auth-translations';

export default function ResetPassword({ searchParams }: { searchParams: Message }) {
  return (
    <AuthTranslations namespace="Auth.ResetPasswordPage">
      {(t) => (
        <div className="flex-1 flex min-h-screen justify-center items-center">
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
              />
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder={t('confirmPasswordPlaceholder')}
                required
              />
              <SubmitButton
                pendingText={t('resetPasswordLoading')}
                formAction={resetPasswordAction}
              >
                {t('resetPassword')}
              </SubmitButton>
              <FormMessage message={searchParams} />
            </div>
          </form>
        </div>
      )}
    </AuthTranslations>
  );
}
