import { api } from "./api";

export type MeetingRequestStatus = "pending" | "contacted" | "resolved";

// One submission of the website's "Book a Meeting" form
export interface MeetingRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  status: MeetingRequestStatus;
  createdAt: string;
  updatedAt: string;
}

interface MeetingRequestListResponse {
  requests: MeetingRequest[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const meetingRequestApi = {
  // Fetched once and filtered/paginated in the browser, like Contact Us Messages
  list: () => api.get<MeetingRequestListResponse>("/meeting-requests?limit=1000"),
  updateStatus: (id: string, status: MeetingRequestStatus) =>
    api.put<MeetingRequest>(`/meeting-requests/${id}`, { status }),
  remove: (id: string) => api.delete<{ id: string }>(`/meeting-requests/${id}`),
};
