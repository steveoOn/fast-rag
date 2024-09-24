import { useTranslations } from 'next-intl';

export default function AuthTranslations({
  children,
  namespace,
}: {
  children: (t: (key: string, params?: unknown) => string) => React.ReactNode;
  namespace: string;
}) {
  const t = useTranslations(namespace) as (key: string, params?: unknown) => string;
  return <>{children(t)}</>;
}
