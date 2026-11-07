import { supabase } from './client';
import { env } from '@/config/env';
import { CorePillar, SiteSetting, Database } from '@/types/database.types';

export type CreateCorePillarInput = Database['public']['Tables']['core_pillars']['Insert'];
export type UpdateCorePillarInput = Database['public']['Tables']['core_pillars']['Update'];

export const contentService = {
  /**
   * Fetch all site settings (Public & Admin).
   */
  async getSiteSettings(): Promise<{ data: Record<string, string> | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data.forEach((row: SiteSetting) => {
        settingsMap[row.setting_key] = row.setting_value;
      });

      return { data: settingsMap, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch site settings.'),
      };
    }
  },

  /**
   * Update or insert a site setting by key (Admin only).
   */
  async updateSetting(key: string, value: string, description?: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('site_settings').upsert({
        setting_key: key,
        setting_value: value,
        description: description || null,
      });

      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error(`Failed to update setting: ${key}`),
      };
    }
  },

  /**
   * Fetch active core pillars for public view.
   */
  async getCorePillars(): Promise<{ data: CorePillar[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('core_pillars')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as CorePillar[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch core pillars.'),
      };
    }
  },

  /**
   * Fetch all core pillars (Admin only).
   */
  async getAllCorePillarsAdmin(): Promise<{ data: CorePillar[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('core_pillars')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as CorePillar[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin core pillars.'),
      };
    }
  },

  /**
   * Create a core pillar (Admin only).
   */
  async createCorePillar(input: CreateCorePillarInput): Promise<{ data: CorePillar | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('core_pillars')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as CorePillar, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create core pillar.'),
      };
    }
  },

  /**
   * Update a core pillar (Admin only).
   */
  async updateCorePillar(id: string, input: UpdateCorePillarInput): Promise<{ data: CorePillar | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('core_pillars')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as CorePillar, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update core pillar.'),
      };
    }
  },

  /**
   * Delete a core pillar (Admin only).
   */
  async deleteCorePillar(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('core_pillars').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete core pillar.'),
      };
    }
  },
};

