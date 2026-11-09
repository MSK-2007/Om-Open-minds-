-- =============================================================================
-- OM OPEN MINDS — Migration 01: Core Database Schema
-- Description: Normalized schema, tables, constraints, foreign keys, indexes, triggers
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- Reusable Trigger: Automatic Updated Timestamp
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- Table 1: admin_profiles
-- Extends auth.users with staff roles and permission states
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'staff', 'editor')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_admin_profiles_updated_at ON public.admin_profiles;
CREATE TRIGGER trg_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 2: site_settings
-- Global configuration, hero text, contact info, accessibility notes
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 3: core_pillars
-- "Why OM OPEN MINDS" differentiators (IEPs, low ratios, sensory spaces)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.core_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_key TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_core_pillars_active_order ON public.core_pillars (is_active, display_order);

DROP TRIGGER IF EXISTS trg_core_pillars_updated_at ON public.core_pillars;
CREATE TRIGGER trg_core_pillars_updated_at
BEFORE UPDATE ON public.core_pillars
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 4: programmes
-- Developmental learning pathways (Early Intervention, Foundation, Life Skills, etc.)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  stage_description TEXT NOT NULL,
  description TEXT NOT NULL,
  curriculum_highlights TEXT[] NOT NULL DEFAULT '{}',
  educator_ratio TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_programmes_slug ON public.programmes (slug);
CREATE INDEX IF NOT EXISTS idx_programmes_active_order ON public.programmes (is_active, display_order);

DROP TRIGGER IF EXISTS trg_programmes_updated_at ON public.programmes;
CREATE TRIGGER trg_programmes_updated_at
BEFORE UPDATE ON public.programmes
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 5: facilities
-- Campus sensory rooms, therapy units, adaptive learning spaces
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Sensory', 'Therapy', 'Learning', 'Recreation')),
  description TEXT NOT NULL,
  accessibility_features TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_facilities_slug ON public.facilities (slug);
CREATE INDEX IF NOT EXISTS idx_facilities_active_cat ON public.facilities (is_active, category, display_order);

DROP TRIGGER IF EXISTS trg_facilities_updated_at ON public.facilities;
CREATE TRIGGER trg_facilities_updated_at
BEFORE UPDATE ON public.facilities
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 6: team_members
-- Leadership, licensed special educators, allied developmental therapists
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  department TEXT NOT NULL CHECK (department IN ('Leadership', 'Special Education', 'Therapy', 'Support')),
  qualifications TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo_url TEXT,
  photo_alt TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_team_members_active_dept ON public.team_members (is_active, department, display_order);

DROP TRIGGER IF EXISTS trg_team_members_updated_at ON public.team_members;
CREATE TRIGGER trg_team_members_updated_at
BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 7: activities
-- Extracurricular enrichment, adaptive sports, campus milestone events
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('Regular Activity', 'Upcoming Event', 'Past Milestone')),
  description TEXT NOT NULL,
  event_date DATE,
  frequency TEXT,
  image_url TEXT,
  image_alt TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_slug ON public.activities (slug);
CREATE INDEX IF NOT EXISTS idx_activities_active_date ON public.activities (is_active, event_date DESC, display_order);

DROP TRIGGER IF EXISTS trg_activities_updated_at ON public.activities;
CREATE TRIGGER trg_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 8: announcements
-- Urgent parent notices, term dates, holiday alerts, admission tickers
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'urgent', 'admissions', 'calendar')),
  summary TEXT,
  link_url TEXT,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiration_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_announcements_active_dates ON public.announcements (is_active, publish_date DESC, display_order);

DROP TRIGGER IF EXISTS trg_announcements_updated_at ON public.announcements;
CREATE TRIGGER trg_announcements_updated_at
BEFORE UPDATE ON public.announcements
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 9: gallery_categories
-- Album classification for accessible media (Facilities, Classroom, Celebrations)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_categories_slug ON public.gallery_categories (slug);

-- =============================================================================
-- Table 10: gallery_items
-- Media items with mandatory descriptive alt text and parental consent verification
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  has_parental_consent BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT false,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gallery_items_published ON public.gallery_items (is_published, has_parental_consent, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items (category_id);

DROP TRIGGER IF EXISTS trg_gallery_items_updated_at ON public.gallery_items;
CREATE TRIGGER trg_gallery_items_updated_at
BEFORE UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 11: parent_resources
-- Downloadable academic calendars, parent handbooks, home sensory tip sheets
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.parent_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Calendar', 'Parent Guide', 'Sensory Tip Sheet', 'Policy')),
  description TEXT NOT NULL,
  file_url TEXT,
  external_url TEXT,
  file_format TEXT DEFAULT 'PDF',
  file_size_kb INT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_parent_resources_active ON public.parent_resources (is_active, category, display_order);

DROP TRIGGER IF EXISTS trg_parent_resources_updated_at ON public.parent_resources;
CREATE TRIGGER trg_parent_resources_updated_at
BEFORE UPDATE ON public.parent_resources
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 12: admissions_faqs
-- Frequently asked questions regarding admissions, consultations, and campus routines
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.admissions_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admissions_faqs_active ON public.admissions_faqs (is_active, display_order);

DROP TRIGGER IF EXISTS trg_admissions_faqs_updated_at ON public.admissions_faqs;
CREATE TRIGGER trg_admissions_faqs_updated_at
BEFORE UPDATE ON public.admissions_faqs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 13: admission_enquiries
-- Confidential parent admissions consultation requests (Zero medical reports requested)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.admission_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age INT CHECK (child_age IS NULL OR (child_age >= 1 AND child_age <= 30)),
  preferred_program TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'contacted', 'consultation_scheduled', 'archived')),
  internal_admin_notes TEXT,
  assigned_staff_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admission_enquiries_status ON public.admission_enquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admission_enquiries_assigned ON public.admission_enquiries (assigned_staff_id);

DROP TRIGGER IF EXISTS trg_admission_enquiries_updated_at ON public.admission_enquiries;
CREATE TRIGGER trg_admission_enquiries_updated_at
BEFORE UPDATE ON public.admission_enquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Table 14: contact_enquiries
-- General communication messages (vendors, media, community, inquiries)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  internal_admin_notes TEXT,
  assigned_staff_id UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_enquiries_status ON public.contact_enquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_assigned ON public.contact_enquiries (assigned_staff_id);

DROP TRIGGER IF EXISTS trg_contact_enquiries_updated_at ON public.contact_enquiries;
CREATE TRIGGER trg_contact_enquiries_updated_at
BEFORE UPDATE ON public.contact_enquiries
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

