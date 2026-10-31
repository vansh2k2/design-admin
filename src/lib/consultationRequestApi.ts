import { api } from "./api";

export type ConsultationRequestStatus = "pending" | "contacted" | "resolved";

// One submission of the home page's "Request a Free Consultation" form (Get In Touch section)
export interface ConsultationRequest {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  projectType?: string;
  message: string;
  status: ConsultationRequestStatus;
  createdAt: string;
  updatedAt: string;
}

interface ConsultationRequestListResponse {
  requests: ConsultationRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const consultationRequestApi = {
  // Fetched once and filtered/paginated in the browser, like Contact Us Messages
  list: () => api.get<ConsultationRequestListResponse>("/consultation-requests?limit=1000"),
  updateStatus: (id: string, status: ConsultationRequestStatus) =>
    api.put<ConsultationRequest>(`/consultation-requests/${id}`, { status }),
  remove: (id: string) => api.delete<{ id: string }>(`/consultation-requests/${id}`),
};
