import { enquiriesService, CreateContactEnquiryInput } from './enquiries.service';
import { ContactEnquiry } from '@/types/database.types';

export type { CreateContactEnquiryInput };

/**
 * Backward-compatible adapter forwarding to the unified enquiriesService.
 */
export const contactService = {
  async sendMessage(input: CreateContactEnquiryInput): Promise<{
    data: ContactEnquiry | null;
    error: Error | null;
  }> {
    const res = await enquiriesService.submitContactEnquiry(input);
    return { data: res.data, error: res.error };
  },

  async getMessages(): Promise<{
    data: ContactEnquiry[] | null;
    error: Error | null;
  }> {
    return enquiriesService.getContactEnquiries();
  },
};
