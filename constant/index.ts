export const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY;
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_PUBLIC_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 支持的语言
export const SUPPORTED_LOCALES = ['en', 'ja', 'zh'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
