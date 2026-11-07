import { supabase } from './client';
import { env } from '@/config/env';
import { GalleryItem, GalleryCategory, Database } from '@/types/database.types';

export type CreateGalleryItemInput = Database['public']['Tables']['gallery_items']['Insert'];
export type UpdateGalleryItemInput = Database['public']['Tables']['gallery_items']['Update'];
export type CreateGalleryCategoryInput = Database['public']['Tables']['gallery_categories']['Insert'];

export const galleryService = {
  /**
   * Fetch approved, published gallery items with verified parental consent (Public).
   */
  async getPublishedGalleryItems(categoryId?: string): Promise<{ data: GalleryItem[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .eq('has_parental_consent', true)
        .order('display_order', { ascending: true });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as GalleryItem[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch gallery items.'),
      };
    }
  },

  /**
   * Fetch active gallery categories (Public & Admin).
   */
  async getGalleryCategories(): Promise<{ data: GalleryCategory[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return { data: data as unknown as GalleryCategory[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch gallery categories.'),
      };
    }
  },

  /**
   * Fetch all gallery items including draft and unconsented items (Admin only).
   */
  async getAllGalleryItemsAdmin(): Promise<{ data: GalleryItem[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: data as unknown as GalleryItem[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admin gallery items.'),
      };
    }
  },

  /**
   * Upload image file to Supabase Storage and register gallery item record (Admin only).
   */
  async uploadAndCreateGalleryItem(
    file: File,
    itemData: Omit<CreateGalleryItemInput, 'image_url'>
  ): Promise<{ data: GalleryItem | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    // Enforce alternative text validation (minimum 15 characters)
    if (!itemData.alt_text || itemData.alt_text.trim().length < 15) {
      return {
        data: null,
        error: new Error('Descriptive alternative text (min 15 characters) is mandatory for child accessibility compliance.'),
      };
    }

    // Enforce parental consent verification
    if (!itemData.has_parental_consent) {
      return {
        data: null,
        error: new Error('Cannot publish image without documented parental consent on file.'),
      };
    }

    try {
      // 1. Upload to approved-gallery bucket with unique UUID
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
      const filePath = `approved/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('approved-gallery')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // 2. Retrieve public URL
      const { data: publicUrlData } = supabase.storage
        .from('approved-gallery')
        .getPublicUrl(filePath);

      // 3. Insert gallery_items record
      const insertPayload: CreateGalleryItemInput = {
        ...itemData,
        image_url: publicUrlData.publicUrl,
      };

      const { data, error: dbError } = await supabase
        .from('gallery_items')
        .insert(insertPayload)
        .select()
        .single();

      if (dbError) throw dbError;
      return { data: data as unknown as GalleryItem, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to upload and create gallery item.'),
      };
    }
  },

  /**
   * Update gallery item metadata (Admin only).
   */
  async updateGalleryItem(id: string, input: UpdateGalleryItemInput): Promise<{ data: GalleryItem | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .update(input)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as GalleryItem, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update gallery item.'),
      };
    }
  },

  /**
   * Delete gallery item and associated file from storage (Admin only).
   */
  async deleteGalleryItem(id: string, imageUrl?: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      // 1. Delete from database
      const { error: dbError } = await supabase.from('gallery_items').delete().eq('id', id);
      if (dbError) throw dbError;

      // 2. Delete from storage if storage path can be resolved
      if (imageUrl && imageUrl.includes('approved-gallery')) {
        const path = imageUrl.split('approved-gallery/')[1];
        if (path) {
          await supabase.storage.from('approved-gallery').remove([path]);
        }
      }

      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete gallery item.'),
      };
    }
  },
};

