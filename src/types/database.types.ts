/**
 * OM OPEN MINDS — Database Entity Types & Supabase Schema Mapping
 * Generated in accordance with PostgreSQL migrations.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = 'super_admin' | 'staff' | 'editor';
export type FacilityCategory = 'Sensory' | 'Therapy' | 'Learning' | 'Recreation';
export type TeamDepartment = 'Leadership' | 'Special Education' | 'Therapy' | 'Support';
export type ActivityType = 'Regular Activity' | 'Upcoming Event' | 'Past Milestone';
export type AnnouncementCategory = 'general' | 'urgent' | 'admissions' | 'calendar';
export type ResourceCategory = 'Calendar' | 'Parent Guide' | 'Sensory Tip Sheet' | 'Policy';
export type AdmissionEnquiryStatus = 'pending' | 'in_review' | 'contacted' | 'consultation_scheduled' | 'archived';
export type ContactEnquiryStatus = 'unread' | 'read' | 'replied' | 'archived';

// =============================================================================
// Entity Row Types
// =============================================================================

export type AdminProfile = {
  id: string; // Foreign key referencing auth.users.id
  full_name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteSetting = {
  id: string;
  setting_key: string;
  setting_value: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CorePillar = {
  id: string;
  title: string;
  description: string;
  icon_key: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Programme = {
  id: string;
  title: string;
  slug: string;
  stage_description: string;
  description: string;
  curriculum_highlights: string[];
  educator_ratio: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Facility = {
  id: string;
  title: string;
  slug: string;
  category: FacilityCategory;
  description: string;
  accessibility_features: string[];
  image_url: string;
  image_alt: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMember = {
  id: string;
  full_name: string;
  role_title: string;
  department: TeamDepartment;
  qualifications: string;
  bio: string;
  photo_url: string | null;
  photo_alt: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Activity = {
  id: string;
  title: string;
  slug: string;
  activity_type: ActivityType;
  description: string;
  event_date: string | null;
  frequency: string | null;
  image_url: string | null;
  image_alt: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  category: AnnouncementCategory;
  summary: string | null;
  link_url: string | null;
  publish_date: string;
  expiration_date: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  category_id: string | null;
  title: string;
  image_url: string;
  alt_text: string;
  has_parental_consent: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ParentResource = {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  file_url: string | null;
  external_url: string | null;
  file_format: string | null;
  file_size_kb: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdmissionsFaq = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdmissionEnquiry = {
  id: string;
  parent_name: string;
  email: string;
  phone: string;
  child_name: string;
  child_age: number | null;
  preferred_program: string | null;
  notes: string | null;
  status: AdmissionEnquiryStatus;
  internal_admin_notes: string | null;
  assigned_staff_id: string | null;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactEnquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactEnquiryStatus;
  internal_admin_notes: string | null;
  assigned_staff_id: string | null;
  ip_hash: string | null;
  created_at: string;
  updated_at: string;
};

// =============================================================================
// Supabase Database Interface
// =============================================================================

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: AdminProfile;
        Insert: {
          id: string;
          full_name: string;
          role?: AdminRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<AdminProfile>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSetting;
        Insert: {
          id?: string;
          setting_key: string;
          setting_value: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<SiteSetting>;
        Relationships: [];
      };
      core_pillars: {
        Row: CorePillar;
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon_key: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<CorePillar>;
        Relationships: [];
      };
      programmes: {
        Row: Programme;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          stage_description: string;
          description: string;
          curriculum_highlights?: string[];
          educator_ratio?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Programme>;
        Relationships: [];
      };
      facilities: {
        Row: Facility;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          category: FacilityCategory;
          description: string;
          accessibility_features?: string[];
          image_url: string;
          image_alt: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Facility>;
        Relationships: [];
      };
      team_members: {
        Row: TeamMember;
        Insert: {
          id?: string;
          full_name: string;
          role_title: string;
          department: TeamDepartment;
          qualifications: string;
          bio: string;
          photo_url?: string | null;
          photo_alt?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<TeamMember>;
        Relationships: [];
      };
      activities: {
        Row: Activity;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          activity_type: ActivityType;
          description: string;
          event_date?: string | null;
          frequency?: string | null;
          image_url?: string | null;
          image_alt?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Activity>;
        Relationships: [];
      };
      announcements: {
        Row: Announcement;
        Insert: {
          id?: string;
          title: string;
          category: AnnouncementCategory;
          summary?: string | null;
          link_url?: string | null;
          publish_date?: string;
          expiration_date?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Announcement>;
        Relationships: [];
      };
      gallery_categories: {
        Row: GalleryCategory;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: Partial<GalleryCategory>;
        Relationships: [];
      };
      gallery_items: {
        Row: GalleryItem;
        Insert: {
          id?: string;
          category_id?: string | null;
          title: string;
          image_url: string;
          alt_text: string;
          has_parental_consent?: boolean;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<GalleryItem>;
        Relationships: [];
      };
      parent_resources: {
        Row: ParentResource;
        Insert: {
          id?: string;
          title: string;
          category: ResourceCategory;
          description: string;
          file_url?: string | null;
          external_url?: string | null;
          file_format?: string | null;
          file_size_kb?: number | null;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ParentResource>;
        Relationships: [];
      };
      admissions_faqs: {
        Row: AdmissionsFaq;
        Insert: {
          id?: string;
          question: string;
          answer: string;
          display_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<AdmissionsFaq>;
        Relationships: [];
      };
      admission_enquiries: {
        Row: AdmissionEnquiry;
        Insert: {
          id?: string;
          parent_name: string;
          email: string;
          phone: string;
          child_name: string;
          child_age?: number | null;
          preferred_program?: string | null;
          notes?: string | null;
          status?: AdmissionEnquiryStatus;
          internal_admin_notes?: string | null;
          assigned_staff_id?: string | null;
          ip_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<AdmissionEnquiry>;
        Relationships: [];
      };
      contact_enquiries: {
        Row: ContactEnquiry;
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          status?: ContactEnquiryStatus;
          internal_admin_notes?: string | null;
          assigned_staff_id?: string | null;
          ip_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ContactEnquiry>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      get_admin_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      admin_role: AdminRole;
      facility_category: FacilityCategory;
      team_department: TeamDepartment;
      activity_type: ActivityType;
      announcement_category: AnnouncementCategory;
      resource_category: ResourceCategory;
      admission_enquiry_status: AdmissionEnquiryStatus;
      contact_enquiry_status: ContactEnquiryStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
