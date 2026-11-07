import { supabase } from './client';
import { env } from '@/config/env';
import { Programme, Database } from '@/types/database.types';

export type CreateProgrammeInput = Database['public']['Tables']['programmes']['Insert'];
export type UpdateProgrammeInput = Database['public']['Tables']['programmes']['Update'];

export const programmesService = {
  /**
   * Fetch published programmes for public display (ordered by display_order).
   */
  async getPublishedProgrammes(): Promise<{ data: Programme[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('programmes')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as Programme[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch programmes.'),
      };
    }
  },

  /**
   * Fetch a single programme by its unique slug.
   */
  async getProgrammeBySlug(slug: string): Promise<{ data: Programme | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('programmes')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { data: data as unknown as Programme, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error(`Failed to fetch programme: ${slug}`),
      };
    }
  },

  /**
   * Fetch all programmes including inactive/draft (Admin only).
   */
  async getAllProgrammesAdmin(): Promise<{ data: Programme[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('programmes')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as Programme[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin programmes.'),
      };
    }
  },

  /**
   * Create a new programme (Admin only).
   */
  async createProgramme(input: CreateProgrammeInput): Promise<{ data: Programme | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('programmes')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Programme, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create programme.'),
      };
    }
  },

  /**
   * Update an existing programme (Admin only).
   */
  async updateProgramme(id: string, input: UpdateProgrammeInput): Promise<{ data: Programme | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('programmes')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Programme, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update programme.'),
      };
    }
  },

  /**
   * Delete a programme (Admin only).
   */
  async deleteProgramme(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('programmes').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete programme.'),
      };
    }
  },
};

