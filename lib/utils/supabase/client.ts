import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_URL, SUPABASE_PUBLIC_ANON_KEY } from '@/constant';

export const createClient = () => createBrowserClient(SUPABASE_URL!, SUPABASE_PUBLIC_ANON_KEY!);
