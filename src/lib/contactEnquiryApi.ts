import { api } from "./api";

export type ContactEnquiryStatus = "pending" | "contacted" | "resolved";

// One submission of the website Contact page's "Enquire Now" form
export interface ContactEnquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  subService?: string;
  location?: string;
  // "Project Details / Your Requirement"
  message: string;
  status: ContactEnquiryStatus;
  source?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactEnquiryListResponse {
  enquiries: ContactEnquiry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const contactEnquiryApi = {
  // A large limit keeps this in line with how the rest of the admin (e.g.
  // Job Postings) fetches once and filters/paginates client-side, instead of
  // round-tripping to the server on every keystroke.
  list: () => api.get<ContactEnquiryListResponse>("/contact-enquiry?limit=1000"),
  updateStatus: (id: string, status: ContactEnquiryStatus) =>
    api.put<ContactEnquiry>(`/contact-enquiry/${id}`, { status }),
  remove: (id: string) => api.delete<{ id: string }>(`/contact-enquiry/${id}`),
};
