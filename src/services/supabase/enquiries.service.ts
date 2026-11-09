import { supabase } from './client';
import { env } from '@/config/env';
import {
  AdmissionEnquiry,
  ContactEnquiry,
  Database,
  AdmissionEnquiryStatus,
  ContactEnquiryStatus,
} from '@/types/database.types';

export type CreateAdmissionEnquiryInput = Database['public']['Tables']['admission_enquiries']['Insert'];
export type CreateContactEnquiryInput = Database['public']['Tables']['contact_enquiries']['Insert'];

export interface SubmissionResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

/**
 * Service for handling Admission Enquiries and Contact Enquiries.
 * Enforces client-side validation, zero-friction honeypot spam protection,
 * and secure interaction with Supabase RLS protected endpoints.
 */
export const enquiriesService = {
  /**
   * Submit an Admission Enquiry (Public Action).
   * Note: Public anonymous users are strictly granted INSERT permissions only;
   * they cannot read or mutate records once submitted.
   */
  async submitAdmissionEnquiry(
    input: CreateAdmissionEnquiryInput,
    honeypotValue?: string
  ): Promise<SubmissionResponse<AdmissionEnquiry>> {
    // 1. Zero-friction spam prevention: detect populated honeypot trap
    if (honeypotValue && honeypotValue.trim().length > 0) {
      console.warn('[Enquiries] Bot detection triggered via honeypot trap.');
      // Return synthetic success to frustrate automated bots without alerting them
      return { data: null, error: null, success: true };
    }

    // 2. Client-side field validations
    if (!input.parent_name || input.parent_name.trim().length < 2) {
      return { data: null, error: new Error('Parent/guardian name is required (min 2 characters).'), success: false };
    }
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
      return { data: null, error: new Error('A valid email address is required.'), success: false };
    }
    if (!input.phone || input.phone.trim().length < 7) {
      return { data: null, error: new Error('A valid phone number is required.'), success: false };
    }
    if (!input.child_name || input.child_name.trim().length < 1) {
      return { data: null, error: new Error("Child's first name is required."), success: false };
    }

    // 3. Child Safeguarding Validation: Enforce that no medical files or clinical reports are submitted
    const sanitizedPayload: CreateAdmissionEnquiryInput = {
      parent_name: input.parent_name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      child_name: input.child_name.trim(),
      child_age: input.child_age || null,
      preferred_program: input.preferred_program || null,
      notes: input.notes ? input.notes.trim().slice(0, 1500) : null,
      status: 'pending',
    };

    if (!env.isSupabaseConfigured) {
      return {
        data: null,
        error: new Error('Supabase is not configured with live credentials in .env.'),
        success: false,
      };
    }

    try {
      const { error } = await supabase
        .from('admission_enquiries')
        .insert(sanitizedPayload);

      if (error) throw error;
      return { data: null, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to submit admission enquiry. Please call our office directly.'),
        success: false,
      };
    }
  },

  /**
   * Submit a General Contact Message (Public Action).
   */
  async submitContactEnquiry(
    input: CreateContactEnquiryInput,
    honeypotValue?: string
  ): Promise<SubmissionResponse<ContactEnquiry>> {
    // 1. Honeypot check
    if (honeypotValue && honeypotValue.trim().length > 0) {
      console.warn('[Contact] Bot detection triggered via honeypot trap.');
      return { data: null, error: null, success: true };
    }

    // 2. Validation
    if (!input.name || input.name.trim().length < 2) {
      return { data: null, error: new Error('Full name is required (min 2 characters).'), success: false };
    }
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
      return { data: null, error: new Error('A valid email address is required.'), success: false };
    }
    if (!input.subject || input.subject.trim().length < 2) {
      return { data: null, error: new Error('Subject is required.'), success: false };
    }
    if (!input.message || input.message.trim().length < 5) {
      return { data: null, error: new Error('Message is required (min 5 characters).'), success: false };
    }

    const sanitizedPayload: CreateContactEnquiryInput = {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone ? input.phone.trim() : null,
      subject: input.subject.trim(),
      message: input.message.trim().slice(0, 2000),
      status: 'unread',
    };

    if (!env.isSupabaseConfigured) {
      return {
        data: null,
        error: new Error('Supabase is not configured with live credentials in .env.'),
        success: false,
      };
    }

    try {
      const { error } = await supabase
        .from('contact_enquiries')
        .insert(sanitizedPayload);

      if (error) throw error;
      return { data: null, error: null, success: true };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to send contact enquiry.'),
        success: false,
      };
    }
  },

  // ===========================================================================
  // Administrative Operations (Requires Authenticated Session & Active Admin Role)
  // ===========================================================================

  /**
   * Retrieve admission enquiries with optional status filter (Admin Only).
   */
  async getAdmissionEnquiries(statusFilter?: AdmissionEnquiryStatus): Promise<{
    data: AdmissionEnquiry[] | null;
    error: Error | null;
  }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('admission_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as AdmissionEnquiry[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch admission enquiries.'),
      };
    }
  },

  /**
   * Update the status and internal notes of an admission enquiry (Admin Only).
   */
  async updateAdmissionEnquiryStatus(
    id: string,
    status: AdmissionEnquiryStatus,
    internalNotes?: string
  ): Promise<{ data: AdmissionEnquiry | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const updatePayload: Partial<AdmissionEnquiry> = { status };
      if (internalNotes !== undefined) {
        updatePayload.internal_admin_notes = internalNotes;
      }

      const { data, error } = await supabase
        .from('admission_enquiries')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as AdmissionEnquiry, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update admission enquiry status.'),
      };
    }
  },

  /**
   * Delete an admission enquiry (Super Admin Only).
   */
  async deleteAdmissionEnquiry(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('admission_enquiries').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete admission enquiry.'),
      };
    }
  },

  /**
   * Retrieve general contact messages with optional status filter (Admin Only).
   */
  async getContactEnquiries(statusFilter?: ContactEnquiryStatus): Promise<{
    data: ContactEnquiry[] | null;
    error: Error | null;
  }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      let query = supabase
        .from('contact_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { data: data as unknown as ContactEnquiry[], error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to fetch contact enquiries.'),
      };
    }
  },

  /**
   * Update contact message status (e.g., mark as read/replied) (Admin Only).
   */
  async updateContactEnquiryStatus(
    id: string,
    status: ContactEnquiryStatus,
    internalNotes?: string
  ): Promise<{ data: ContactEnquiry | null; error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { data: null, error: new Error('Supabase is not configured.') };
    }

    try {
      const updatePayload: Partial<ContactEnquiry> = { status };
      if (internalNotes !== undefined) {
        updatePayload.internal_admin_notes = internalNotes;
      }

      const { data, error } = await supabase
        .from('contact_enquiries')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: data as unknown as ContactEnquiry, error: null };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Failed to update contact enquiry status.'),
      };
    }
  },

  /**
   * Delete a contact enquiry (Super Admin Only).
   */
  async deleteContactEnquiry(id: string): Promise<{ error: Error | null }> {
    if (!env.isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') };
    }

    try {
      const { error } = await supabase.from('contact_enquiries').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error('Failed to delete contact enquiry.'),
      };
    }
  },
};

