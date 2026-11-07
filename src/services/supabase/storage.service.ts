import { supabase } from './client';
import { env } from '@/config/env';

/**
 * Supabase Storage Service for OM OPEN MINDS.
 * Manages secure file uploads, MIME type validation, file size limits,
 * and bucket object operations across public and private buckets.
 */

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: Error | null;
}

const BUCKET_LIMITS = {
  PUBLIC_ASSETS: {
    bucket: 'public-school-assets',
    maxBytes: 2097152, // 2 MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
  },
  APPROVED_GALLERY: {
    bucket: 'approved-gallery',
    maxBytes: 2097152, // 2 MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
  PRIVATE_ADMIN: {
    bucket: 'private-administrative-files',
    maxBytes: 5242880, // 5 MB
    allowedTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ],
  },
};

export const storageService = {
  /**
   * Upload an asset to public-school-assets bucket (logos, facilities, team photos).
   */
  async uploadPublicAsset(file: File, folder: string = 'general'): Promise<UploadResult> {
    if (!env.isSupabaseConfigured) {
      return { url: null, path: null, error: new Error('Supabase is not configured.') };
    }

    const { bucket, maxBytes, allowedTypes } = BUCKET_LIMITS.PUBLIC_ASSETS;

    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        path: null,
        error: new Error(`Invalid file type (${file.type}). Allowed: JPG, PNG, WebP, SVG.`),
      };
    }

    if (file.size > maxBytes) {
      return {
        url: null,
        path: null,
        error: new Error(`File size (${Math.round(file.size / 1024)} KB) exceeds 2 MB limit.`),
      };
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
      const cleanName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
      const filePath = `${folder}/${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        path: filePath,
        error: null,
      };
    } catch (err) {
      return {
        url: null,
        path: null,
        error: err instanceof Error ? err : new Error('Failed to upload file to storage.'),
      };
    }
  },

  /**
   * Upload a gallery image to approved-gallery bucket.
   * Requires verified parental consent according to child safeguarding guidelines.
   */
  async uploadGalleryPhoto(file: File, hasParentalConsent: boolean): Promise<UploadResult> {
    if (!hasParentalConsent) {
      return {
        url: null,
        path: null,
        error: new Error('Child Safeguarding: Media cannot be uploaded without documented parental consent.'),
      };
    }

    if (!env.isSupabaseConfigured) {
      return { url: null, path: null, error: new Error('Supabase is not configured.') };
    }

    const { bucket, maxBytes, allowedTypes } = BUCKET_LIMITS.APPROVED_GALLERY;

    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        path: null,
        error: new Error(`Invalid image type (${file.type}). Allowed: JPG, PNG, WebP.`),
      };
    }

    if (file.size > maxBytes) {
      return {
        url: null,
        path: null,
        error: new Error(`File size (${Math.round(file.size / 1024)} KB) exceeds 2 MB limit.`),
      };
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanName = `approved-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
      const filePath = `photos/${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        path: filePath,
        error: null,
      };
    } catch (err) {
      return {
        url: null,
        path: null,
        error: err instanceof Error ? err : new Error('Failed to upload gallery photo.'),
      };
    }
  },

  /**
   * Upload an internal administrative document (PDF, Excel, CSV) to private bucket.
   * NOTE: Files in this bucket NEVER have public URLs.
   */
  async uploadPrivateDocument(file: File, folder: string = 'intake'): Promise<UploadResult> {
    if (!env.isSupabaseConfigured) {
      return { url: null, path: null, error: new Error('Supabase is not configured.') };
    }

    const { bucket, maxBytes, allowedTypes } = BUCKET_LIMITS.PRIVATE_ADMIN;

    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        path: null,
        error: new Error(`Invalid document type. Allowed: PDF, XLSX, CSV.`),
      };
    }

    if (file.size > maxBytes) {
      return {
        url: null,
        path: null,
        error: new Error(`File size exceeds 5 MB limit.`),
      };
    }

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
      const cleanName = `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
      const filePath = `${folder}/${cleanName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: '0', upsert: false });

      if (uploadError) throw uploadError;

      return {
        url: null, // Private files do not have public URLs
        path: filePath,
        error: null,
      };
    } catch (err) {
      return {
        url: null,
        path: null,
        error: err instanceof Error ? err : new Error('Failed to upload private document.'),
      };
    }
  },

  /**
   * Delete an object from a storage bucket.
   */
  async deleteFile(bucket: 'public-school-assets' | 'approved-gallery' | 'private-administrative-files', filePath: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete file from storage.'),
      };
    }
  },
};
