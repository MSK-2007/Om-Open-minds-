-- =============================================================================
-- OM OPEN MINDS — Migration 03: Supabase Storage Architecture & Security
-- Description: Provisioning public & private storage buckets and access policies
-- =============================================================================

-- =============================================================================
-- 1. Register Storage Buckets
-- =============================================================================

-- Bucket 1: public-school-assets
-- Logos, campus facility photos, static icons, and brand graphics
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'public-school-assets',
  'public-school-assets',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- Bucket 2: approved-gallery
-- Consented student activity moments and campus celebrations
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'approved-gallery',
  'approved-gallery',
  true,
  2097152, -- 2 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 2097152,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Bucket 3: private-administrative-files
-- Internal administrative documents, confidential PDF intake exports, staff guidelines
-- STRICT: public = false
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'private-administrative-files',
  'private-administrative-files',
  false,
  5242880, -- 5 MB
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];

-- =============================================================================
-- 2. Storage Policies on storage.objects
-- =============================================================================

-- Public Access: Read objects in public buckets only
DROP POLICY IF EXISTS "Public can view public-school-assets" ON storage.objects;
CREATE POLICY "Public can view public-school-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'public-school-assets');

DROP POLICY IF EXISTS "Public can view approved-gallery" ON storage.objects;
CREATE POLICY "Public can view approved-gallery"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'approved-gallery');

-- Strict: NO public access to private-administrative-files

-- Admin Access: Authenticated staff can upload to public buckets
DROP POLICY IF EXISTS "Admins can upload to public-school-assets" ON storage.objects;
CREATE POLICY "Admins can upload to public-school-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'public-school-assets'
  AND public.is_admin()
);

DROP POLICY IF EXISTS "Admins can upload to approved-gallery" ON storage.objects;
CREATE POLICY "Admins can upload to approved-gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'approved-gallery'
  AND public.is_admin()
);

-- Admin Access: Authenticated staff can upload to private bucket
DROP POLICY IF EXISTS "Admins can upload to private-administrative-files" ON storage.objects;
CREATE POLICY "Admins can upload to private-administrative-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'private-administrative-files'
  AND public.is_admin()
);

-- Admin Access: Authenticated staff can view private files
DROP POLICY IF EXISTS "Admins can view private-administrative-files" ON storage.objects;
CREATE POLICY "Admins can view private-administrative-files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-administrative-files'
  AND public.is_admin()
);

-- Admin Access: Authenticated staff can update and delete storage objects
DROP POLICY IF EXISTS "Admins can update storage objects" ON storage.objects;
CREATE POLICY "Admins can update storage objects"
ON storage.objects FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete storage objects" ON storage.objects;
CREATE POLICY "Admins can delete storage objects"
ON storage.objects FOR DELETE
TO authenticated
USING (public.is_admin());

