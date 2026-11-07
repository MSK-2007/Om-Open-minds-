import { enquiriesService, CreateAdmissionEnquiryInput } from './enquiries.service';
import { AdmissionEnquiry } from '@/types/database.types';

export type { CreateAdmissionEnquiryInput };

/**
 * Backward-compatible adapter forwarding to the unified enquiriesService.
 */
export const admissionsService = {
  async submitInquiry(input: CreateAdmissionEnquiryInput): Promise<{
    data: AdmissionEnquiry | null;
    error: Error | null;
  }> {
    const res = await enquiriesService.submitAdmissionEnquiry(input);
    return { data: res.data, error: res.error };
  },

  async getInquiries(): Promise<{
    data: AdmissionEnquiry[] | null;
    error: Error | null;
  }> {
    return enquiriesService.getAdmissionEnquiries();
  },
};
