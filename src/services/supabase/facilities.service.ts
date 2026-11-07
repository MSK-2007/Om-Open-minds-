import { supabase } from './client';
import { env } from '@/config/env';
import { Facility, FacilityCategory, Database } from '@/types/database.types';

export type CreateFacilityInput = Database['public']['Tables']['facilities']['Insert'];
export type UpdateFacilityInput = Database['public']['Tables']['facilities']['Update'];

export const facilitiesService = {
  /**
   * Fetch published facilities for public display, with optional category filter.
   */
  async getPublishedFacilities(category?: FacilityCategory): Promise<{ data: Facility[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('facilities')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as Facility[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch facilities.'),
      };
    }
  },

  /**
   * Fetch a single facility by slug.
   */
  async getFacilityBySlug(slug: string): Promise<{ data: Facility | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return { data: data as unknown as Facility, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error(`Failed to fetch facility: ${slug}`),
      };
    }
  },

  /**
   * Fetch all facilities (Admin only).
   */
  async getAllFacilitiesAdmin(): Promise<{ data: Facility[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as Facility[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin facilities.'),
      };
    }
  },

  /**
   * Create a facility (Admin only).
   */
  async createFacility(input: CreateFacilityInput): Promise<{ data: Facility | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('facilities')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Facility, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create facility.'),
      };
    }
  },

  /**
   * Update an existing facility (Admin only).
   */
  async updateFacility(id: string, input: UpdateFacilityInput): Promise<{ data: Facility | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('facilities')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Facility, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update facility.'),
      };
    }
  },

  /**
   * Delete a facility (Admin only).
   */
  async deleteFacility(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('facilities').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete facility.'),
      };
    }
  },
};

