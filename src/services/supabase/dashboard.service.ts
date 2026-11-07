import { supabase } from './client';
import { env } from '@/config/env';
import { AdmissionEnquiry, ContactEnquiry, Announcement } from '@/types/database.types';

export interface DashboardMetrics {
  totalAdmissions: number;
  newAdmissions: number;
  scheduledAdmissions: number;
  totalContacts: number;
  unreadContacts: number;
  publishedProgrammes: number;
  publishedEvents: number;
  publishedAnnouncements: number;
  publishedGallery: number;
}

export const dashboardService = {
  /**
   * Fetch real database metrics using count queries.
   * Fulfills Requirement 3 (real Supabase data, no fabricated statistics).
   */
  async getMetrics(): Promise<{ data: DashboardMetrics | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return {
        data: {
          totalAdmissions: 0,
          newAdmissions: 0,
          scheduledAdmissions: 0,
          totalContacts: 0,
          unreadContacts: 0,
          publishedProgrammes: 0,
          publishedEvents: 0,
          publishedAnnouncements: 0,
          publishedGallery: 0,
        },
        error: null,
      };
    }

    try {
      const [
        totalAdmissionsRes,
        newAdmissionsRes,
        scheduledAdmissionsRes,
        totalContactsRes,
        unreadContactsRes,
        programmesRes,
        eventsRes,
        announcementsRes,
        galleryRes,
      ] = await Promise.all([
        supabase.from('admission_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('admission_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('admission_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'consultation_scheduled'),
        supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('contact_enquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
        supabase.from('programmes').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('activities').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('announcements').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('gallery_items').select('*', { count: 'exact', head: true }).eq('is_published', true).eq('has_parental_consent', true),
      ]);

      const metrics: DashboardMetrics = {
        totalAdmissions: totalAdmissionsRes.count || 0,
        newAdmissions: newAdmissionsRes.count || 0,
        scheduledAdmissions: scheduledAdmissionsRes.count || 0,
        totalContacts: totalContactsRes.count || 0,
        unreadContacts: unreadContactsRes.count || 0,
        publishedProgrammes: programmesRes.count || 0,
        publishedEvents: eventsRes.count || 0,
        publishedAnnouncements: announcementsRes.count || 0,
        publishedGallery: galleryRes.count || 0,
      };

      return { data: metrics, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to load dashboard metrics.'),
      };
    }
  },

  /**
   * Retrieve recent admission enquiries for dashboard feed.
   */
  async getRecentAdmissions(limit = 5): Promise<{ data: AdmissionEnquiry[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('admission_enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data: data as unknown as AdmissionEnquiry[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch recent admission enquiries.'),
      };
    }
  },

  /**
   * Retrieve recent contact messages for dashboard feed.
   */
  async getRecentContacts(limit = 5): Promise<{ data: ContactEnquiry[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('contact_enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data: data as unknown as ContactEnquiry[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch recent contact enquiries.'),
      };
    }
  },

  /**
   * Retrieve recent announcements for dashboard feed.
   */
  async getRecentAnnouncements(limit = 5): Promise<{ data: Announcement[] | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: [], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('publish_date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data: data as unknown as Announcement[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch recent announcements.'),
      };
    }
  },
};
