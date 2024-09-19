'use client';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { SupportedLocale, SUPPORTED_LOCALES } from '@/constant';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const router = useRouter();
  const t = useTranslations('LanguageSelector');
  const initialLocale = useLocale() as SupportedLocale;
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>(initialLocale);

  useEffect(() => {
    const savedLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('NEXT_LOCALE='))
      ?.split('=')[1] as SupportedLocale;
    if (savedLocale && SUPPORTED_LOCALES.includes(savedLocale)) {
      setCurrentLocale(savedLocale);
    } else {
      // 如果没有保存的语言，使用初始语言并设置 cookie
      setCookie('NEXT_LOCALE', initialLocale, { maxAge: 365 * 24 * 60 * 60 });
    }
  }, [initialLocale]);

  const handleLanguageChange = (newLocale: SupportedLocale) => {
    setCurrentLocale(newLocale);
    setCookie('NEXT_LOCALE', newLocale, { maxAge: 365 * 24 * 60 * 60 }); // Set cookie for 1 year
    router.refresh(); // Refresh the page to apply the new language
  };

  return (
    <Select value={currentLocale} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-fit border-none hover:bg-gray-100 dark:hover:bg-gray-800">
        <Languages className="w-4 h-4 mr-2 text-muted-foreground" />
        <SelectValue placeholder={t('selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {SUPPORTED_LOCALES.map((locale) => (
            <SelectItem key={locale} value={locale}>
              {t(locale)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
