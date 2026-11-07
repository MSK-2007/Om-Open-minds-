/**
 * Application environment configuration.
 * Validates and provides access to public environment variables.
 * Note: Only variables prefixed with VITE_ are exposed by Vite to the client.
 */

interface EnvConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConfigured: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate whether Supabase is configured with real credentials
const isConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here'
);

export const env: EnvConfig = {
  supabaseUrl,
  supabaseAnonKey,
  isSupabaseConfigured: isConfigured,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

