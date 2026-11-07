-- =============================================================================
-- OM OPEN MINDS — Migration 02: Row Level Security (RLS) & Access Control
-- Description: Security definer functions, RLS enablement, and granular access policies
-- =============================================================================

-- =============================================================================
-- Helper Security Functions (SECURITY DEFINER)
-- Execute with database owner privileges to prevent recursive RLS evaluation
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid()
      AND role = 'super_admin'
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_admin_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.admin_profiles
  WHERE id = auth.uid()
    AND is_active = true;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Enable Row Level Security (RLS) Across All Public Tables
-- =============================================================================

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.core_pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 1. admin_profiles Policies
-- =============================================================================

-- Admins can view their own profile
DROP POLICY IF EXISTS "Admins can view their own profile" ON public.admin_profiles;
CREATE POLICY "Admins can view their own profile"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Super admins can view all profiles
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can view all profiles"
ON public.admin_profiles FOR SELECT
TO authenticated
USING (public.is_super_admin());

-- Super admins can insert new staff profiles
DROP POLICY IF EXISTS "Super admins can create admin profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can create admin profiles"
ON public.admin_profiles FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin());

-- Super admins can update staff profiles
DROP POLICY IF EXISTS "Super admins can update admin profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can update admin profiles"
ON public.admin_profiles FOR UPDATE
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- Super admins can delete staff profiles
DROP POLICY IF EXISTS "Super admins can delete admin profiles" ON public.admin_profiles;
CREATE POLICY "Super admins can delete admin profiles"
ON public.admin_profiles FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- =============================================================================
-- 2. site_settings Policies
-- =============================================================================

-- Public can read site settings
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
TO public
USING (true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings"
ON public.site_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 3. core_pillars Policies
-- =============================================================================

-- Public can read active pillars
DROP POLICY IF EXISTS "Public can view active core pillars" ON public.core_pillars;
CREATE POLICY "Public can view active core pillars"
ON public.core_pillars FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage core pillars" ON public.core_pillars;
CREATE POLICY "Admins can manage core pillars"
ON public.core_pillars FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 4. programmes Policies
-- =============================================================================

-- Public can read active programmes
DROP POLICY IF EXISTS "Public can view active programmes" ON public.programmes;
CREATE POLICY "Public can view active programmes"
ON public.programmes FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage programmes" ON public.programmes;
CREATE POLICY "Admins can manage programmes"
ON public.programmes FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 5. facilities Policies
-- =============================================================================

-- Public can read active facilities
DROP POLICY IF EXISTS "Public can view active facilities" ON public.facilities;
CREATE POLICY "Public can view active facilities"
ON public.facilities FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage facilities" ON public.facilities;
CREATE POLICY "Admins can manage facilities"
ON public.facilities FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 6. team_members Policies
-- =============================================================================

-- Public can read active team members
DROP POLICY IF EXISTS "Public can view active team members" ON public.team_members;
CREATE POLICY "Public can view active team members"
ON public.team_members FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
CREATE POLICY "Admins can manage team members"
ON public.team_members FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 7. activities Policies
-- =============================================================================

-- Public can read active activities
DROP POLICY IF EXISTS "Public can view active activities" ON public.activities;
CREATE POLICY "Public can view active activities"
ON public.activities FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage activities" ON public.activities;
CREATE POLICY "Admins can manage activities"
ON public.activities FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 8. announcements Policies
-- =============================================================================

-- Public can view active published announcements within date validity
DROP POLICY IF EXISTS "Public can view active valid announcements" ON public.announcements;
CREATE POLICY "Public can view active valid announcements"
ON public.announcements FOR SELECT
TO public
USING (
  is_active = true
  AND publish_date <= CURRENT_DATE
  AND (expiration_date IS NULL OR expiration_date >= CURRENT_DATE)
);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;
CREATE POLICY "Admins can manage announcements"
ON public.announcements FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 9. gallery_categories Policies
-- =============================================================================

-- Public can view active categories
DROP POLICY IF EXISTS "Public can view active gallery categories" ON public.gallery_categories;
CREATE POLICY "Public can view active gallery categories"
ON public.gallery_categories FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage gallery categories" ON public.gallery_categories;
CREATE POLICY "Admins can manage gallery categories"
ON public.gallery_categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 10. gallery_items Policies (STRICT CHILD SAFEGUARDING)
-- =============================================================================

-- Public can ONLY view items that are published AND have verified parental consent
DROP POLICY IF EXISTS "Public can view consented published gallery items" ON public.gallery_items;
CREATE POLICY "Public can view consented published gallery items"
ON public.gallery_items FOR SELECT
TO public
USING (is_published = true AND has_parental_consent = true);

-- Admins have full management access (can inspect draft, unconsented, and uncurated items)
DROP POLICY IF EXISTS "Admins can manage gallery items" ON public.gallery_items;
CREATE POLICY "Admins can manage gallery items"
ON public.gallery_items FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 11. parent_resources Policies
-- =============================================================================

-- Public can read active resources
DROP POLICY IF EXISTS "Public can view active parent resources" ON public.parent_resources;
CREATE POLICY "Public can view active parent resources"
ON public.parent_resources FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage parent resources" ON public.parent_resources;
CREATE POLICY "Admins can manage parent resources"
ON public.parent_resources FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 12. admissions_faqs Policies
-- =============================================================================

-- Public can read active FAQs
DROP POLICY IF EXISTS "Public can view active admissions faqs" ON public.admissions_faqs;
CREATE POLICY "Public can view active admissions faqs"
ON public.admissions_faqs FOR SELECT
TO public
USING (is_active = true);

-- Admins have full management access
DROP POLICY IF EXISTS "Admins can manage admissions faqs" ON public.admissions_faqs;
CREATE POLICY "Admins can manage admissions faqs"
ON public.admissions_faqs FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================================================
-- 13. admission_enquiries Policies (CONFIDENTIAL INTAKE)
-- =============================================================================

-- Anyone (public anonymous or authenticated) can submit a valid admission enquiry
DROP POLICY IF EXISTS "Public can submit admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Public can submit admission enquiries"
ON public.admission_enquiries FOR INSERT
TO public
WITH CHECK (
  length(trim(parent_name)) >= 2
  AND length(trim(email)) >= 5
  AND length(trim(phone)) >= 7
  AND length(trim(child_name)) >= 1
);

-- STRICT PRIVACY: Public users have ZERO select permissions on admission enquiries
-- Only authenticated active staff can view enquiries
DROP POLICY IF EXISTS "Admins can view admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Admins can view admission enquiries"
ON public.admission_enquiries FOR SELECT
TO authenticated
USING (public.is_admin());

-- Only authenticated active staff can update enquiry statuses or internal notes
DROP POLICY IF EXISTS "Admins can update admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Admins can update admission enquiries"
ON public.admission_enquiries FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Super admins can delete/archive records
DROP POLICY IF EXISTS "Super admins can delete admission enquiries" ON public.admission_enquiries;
CREATE POLICY "Super admins can delete admission enquiries"
ON public.admission_enquiries FOR DELETE
TO authenticated
USING (public.is_super_admin());

-- =============================================================================
-- 14. contact_enquiries Policies (GENERAL MESSAGES)
-- =============================================================================

-- Anyone can submit a contact message
DROP POLICY IF EXISTS "Public can submit contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Public can submit contact enquiries"
ON public.contact_enquiries FOR INSERT
TO public
WITH CHECK (
  length(trim(name)) >= 2
  AND length(trim(email)) >= 5
  AND length(trim(subject)) >= 2
  AND length(trim(message)) >= 5
);

-- STRICT PRIVACY: Public users cannot read messages
DROP POLICY IF EXISTS "Admins can view contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Admins can view contact enquiries"
ON public.contact_enquiries FOR SELECT
TO authenticated
USING (public.is_admin());

-- Admins can update status and append notes
DROP POLICY IF EXISTS "Admins can update contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Admins can update contact enquiries"
ON public.contact_enquiries FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Super admins can delete messages
DROP POLICY IF EXISTS "Super admins can delete contact enquiries" ON public.contact_enquiries;
CREATE POLICY "Super admins can delete contact enquiries"
ON public.contact_enquiries FOR DELETE
TO authenticated
USING (public.is_super_admin());

