import { supabase } from './client';
import { env } from '@/config/env';
import { TeamMember, TeamDepartment, Database } from '@/types/database.types';

export type CreateTeamMemberInput = Database['public']['Tables']['team_members']['Insert'];
export type UpdateTeamMemberInput = Database['public']['Tables']['team_members']['Update'];

export const teamService = {
  /**
   * Fetch published team members, optionally filtered by department.
   */
  async getPublishedTeamMembers(department?: TeamDepartment): Promise<{ data: TeamMember[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (department) {
        query = query.eq('department', department);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as TeamMember[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch team members.'),
      };
    }
  },

  /**
   * Fetch all team members (Admin only).
   */
  async getAllTeamMembersAdmin(): Promise<{ data: TeamMember[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as TeamMember[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin team members.'),
      };
    }
  },

  /**
   * Create a team member profile (Admin only).
   */
  async createTeamMember(input: CreateTeamMemberInput): Promise<{ data: TeamMember | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as TeamMember, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create team member.'),
      };
    }
  },

  /**
   * Update team member profile (Admin only).
   */
  async updateTeamMember(id: string, input: UpdateTeamMemberInput): Promise<{ data: TeamMember | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as TeamMember, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update team member.'),
      };
    }
  },

  /**
   * Delete team member profile (Admin only).
   */
  async deleteTeamMember(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete team member.'),
      };
    }
  },
};

