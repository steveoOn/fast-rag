import { useTranslations } from 'next-intl';

export default function AuthTranslations({
  children,
  namespace,
}: {
  children: (t: (key: string, params?: any) => string) => React.ReactNode;
  namespace: string;
}) {
  const t = useTranslations(namespace);
  return <>{children(t)}</>;
}
