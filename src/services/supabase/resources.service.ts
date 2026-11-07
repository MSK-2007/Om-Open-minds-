import { supabase } from './client';
import { env } from '@/config/env';
import { ParentResource, AdmissionsFaq, ResourceCategory, Database } from '@/types/database.types';

export type CreateParentResourceInput = Database['public']['Tables']['parent_resources']['Insert'];
export type UpdateParentResourceInput = Database['public']['Tables']['parent_resources']['Update'];
export type CreateAdmissionsFaqInput = Database['public']['Tables']['admissions_faqs']['Insert'];
export type UpdateAdmissionsFaqInput = Database['public']['Tables']['admissions_faqs']['Update'];

export const resourcesService = {
  /**
   * Fetch active parent resources, optionally filtered by category (Public).
   */
  async getPublishedResources(category?: ResourceCategory): Promise<{ data: ParentResource[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('parent_resources')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as ParentResource[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch parent resources.'),
      };
    }
  },

  /**
   * Fetch active admissions FAQs (Public).
   */
  async getAdmissionsFaqs(): Promise<{ data: AdmissionsFaq[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('admissions_faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as AdmissionsFaq[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admissions FAQs.'),
      };
    }
  },

  /**
   * Fetch all resources (Admin only).
   */
  async getAllResourcesAdmin(): Promise<{ data: ParentResource[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('parent_resources')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as ParentResource[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin resources.'),
      };
    }
  },

  /**
   * Create a parent resource (Admin only).
   */
  async createResource(input: CreateParentResourceInput): Promise<{ data: ParentResource | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('parent_resources')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as ParentResource, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create parent resource.'),
      };
    }
  },

  /**
   * Update a parent resource (Admin only).
   */
  async updateResource(id: string, input: UpdateParentResourceInput): Promise<{ data: ParentResource | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('parent_resources')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as ParentResource, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update parent resource.'),
      };
    }
  },

  /**
   * Delete a parent resource (Admin only).
   */
  async deleteResource(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('parent_resources').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete parent resource.'),
      };
    }
  },

  /**
   * Create an admissions FAQ (Admin only).
   */
  async createFaq(input: CreateAdmissionsFaqInput): Promise<{ data: AdmissionsFaq | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('admissions_faqs')
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as AdmissionsFaq, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to create FAQ.'),
      };
    }
  },

  /**
   * Update an admissions FAQ (Admin only).
   */
  async updateFaq(id: string, input: UpdateAdmissionsFaqInput): Promise<{ data: AdmissionsFaq | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('admissions_faqs')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as AdmissionsFaq, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update FAQ.'),
      };
    }
  },

  /**
   * Delete an admissions FAQ (Admin only).
   */
  async deleteFaq(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('admissions_faqs').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete FAQ.'),
      };
    }
  },
};

