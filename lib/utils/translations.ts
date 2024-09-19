import en from '@/messages/en.json';
import zh from '@/messages/zh.json';
import ja from '@/messages/ja.json';

const translations = { en, zh, ja };

export function getTranslation(locale: string, key: string): string {
  const keys = key.split('.');
  let result: any = translations[locale as keyof typeof translations];
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return key; // 如果找不到翻译，返回原始 key
    }
  }
  return typeof result === 'string' ? result : key;
}
