import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';

/**
 * Typed Supabase Client instance for OM OPEN MINDS.
 */
export type TypedSupabaseClient = SupabaseClient<Database>;

