import { createBrowserClient } from '@supabase/ssr';

// Cliente Supabase para Client Components (sessão armazenada em cookies, compartilhada com o servidor).
export const createSupabaseBrowserClient = () =>
  createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
