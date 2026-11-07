import { supabase } from './client';
import { env } from '@/config/env';
import { Announcement, AnnouncementCategory, Database } from '@/types/database.types';

export type CreateAnnouncementInput = Database['public']['Tables']['announcements']['Insert'];
export type UpdateAnnouncementInput = Database['public']['Tables']['announcements']['Update'];

export const announcementsService = {
  /**
   * Fetch active, non-expired announcements for the public ticker and banners.
   */
  async getActiveAnnouncements(): Promise<{ data: Announcement[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .lte('publish_date', today)
        .or(`expiration_date.is.null,expiration_date.gte.${today}`)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as Announcement[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch announcements.'),
      };
    }
  },

  /**
   * Fetch all announcements (Admin only).
   */
  async getAllAnnouncementsAdmin(category?: AnnouncementCategory): Promise<{ data: Announcement[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('publish_date', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as Announcement[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin announcements.'),
      };
    }
  },

  /**
   * Create an announcement (Admin only).
   */
  async createAnnouncement(input: CreateAnnouncementInput): Promise<{ data: Announcement | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Announcement, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create announcement.'),
      };
    }
  },

  /**
   * Update an announcement (Admin only).
   */
  async updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<{ data: Announcement | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Announcement, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update announcement.'),
      };
    }
  },

  /**
   * Delete an announcement (Admin only).
   */
  async deleteAnnouncement(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete announcement.'),
      };
    }
  },
};

