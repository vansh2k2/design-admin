import { api } from "./api";

export type AdminNotificationType = "DONATION" | "ENQUIRY" | "CASE" | "VOLUNTEER" | "SYSTEM_EXPIRY";

export interface AdminNotificationItem {
  _id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminNotificationsResult {
  notifications: AdminNotificationItem[];
  unreadCount: number;
}

export const adminNotificationsApi = {
  // The backend has no /notifications/admin route yet: the bell shows none, without a 404 on every page
  list: () => Promise.resolve<AdminNotificationsResult>({ notifications: [], unreadCount: 0 }),
  markRead: (id: string) => api.patch(`/notifications/admin/${id}/read`),
  markAllRead: () => api.patch("/notifications/admin/read-all"),
};
