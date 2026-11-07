import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';
import { Database } from '@/types/database.types';

/**
 * Standard Supabase client configuration.
 * Uses client-safe public anonymous credentials.
 * Service role keys MUST NEVER be used or imported in client-side code.
 */

const FALLBACK_URL = 'https://placeholder-project.supabase.co';
const FALLBACK_ANON_KEY = 'placeholder-anon-key';

const targetUrl = env.supabaseUrl && env.supabaseUrl.startsWith('http')
  ? env.supabaseUrl
  : FALLBACK_URL;

const targetKey = env.supabaseAnonKey || FALLBACK_ANON_KEY;

if (!env.isSupabaseConfigured && env.isDevelopment) {
  console.warn(
    '[Supabase] Using placeholder credentials. Provide valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file to connect to live Supabase backend.'
  );
}

export const supabase = createClient<Database>(targetUrl, targetKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

