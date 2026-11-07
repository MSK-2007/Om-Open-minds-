import { supabase } from './client';
import { env } from '@/config/env';
import { Activity, ActivityType, Database } from '@/types/database.types';

export type CreateActivityInput = Database['public']['Tables']['activities']['Insert'];
export type UpdateActivityInput = Database['public']['Tables']['activities']['Update'];

export const eventsService = {
  /**
   * Fetch published activities and campus events.
   */
  async getPublishedActivities(type?: ActivityType): Promise<{ data: Activity[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (type) {
        query = query.eq('activity_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as Activity[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch activities/events.'),
      };
    }
  },

  /**
   * Fetch all activities/events (Admin only).
   */
  async getAllActivitiesAdmin(): Promise<{ data: Activity[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as Activity[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin activities.'),
      };
    }
  },

  /**
   * Create an activity/event (Admin only).
   */
  async createActivity(input: CreateActivityInput): Promise<{ data: Activity | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Activity, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create activity.'),
      };
    }
  },

  /**
   * Update an activity/event (Admin only).
   */
  async updateActivity(id: string, input: UpdateActivityInput): Promise<{ data: Activity | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as Activity, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update activity.'),
      };
    }
  },

  /**
   * Delete an activity/event (Admin only).
   */
  async deleteActivity(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete activity.'),
      };
    }
  },
};

