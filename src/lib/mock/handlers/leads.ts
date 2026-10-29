import type { MockRoute } from "../http";
import { defineCollection } from "../store";
import { dashboardOverview, NOTIFICATIONS } from "../fixtures/dashboard";
import { MSME_APPLICATIONS } from "../fixtures/msme";
import {
  ADVISORY_NOMINATIONS,
  AWARD_NOMINATIONS,
  BUYER_ENQUIRIES,
  CONTACT_ENQUIRIES,
  ENQUIRIES,
  EXHIBITOR_REGISTRATIONS,
  FEEDBACK,
  NEWSLETTER,
  PARTNERSHIP_ENQUIRIES,
  VISITOR_REGISTRATIONS,
} from "../fixtures/leads";

type Rows = Record<string, unknown>[];

/** List responses wrapped the way each backend endpoint returns them */
const wrap = (key: string, paged = false) => (items: Rows) =>
  paged ? { [key]: items, total: items.length, page: 1, limit: 1000, totalPages: 1 } : { [key]: items, total: items.length };

/** Registrations are listed per category (?category=domestic|international|group) */
const byCategory = (key: string) => (items: Rows, ctx: { query: URLSearchParams }) => {
  const category = ctx.query.get("category");
  const rows = category ? items.filter((item) => item.category === category) : items;
  return { [key]: rows, total: rows.length };
};

defineCollection("/enquiries/admin", ENQUIRIES as unknown as Rows);
defineCollection("/contact-enquiry", CONTACT_ENQUIRIES as unknown as Rows, { list: wrap("enquiries", true) });
defineCollection("/buyer-enquiries/admin", BUYER_ENQUIRIES as unknown as Rows, { list: wrap("enquiries") });
defineCollection("/partnership-enquiry", PARTNERSHIP_ENQUIRIES as unknown as Rows, { list: wrap("enquiries", true) });
defineCollection("/feedback/admin", FEEDBACK as unknown as Rows, { list: wrap("items") });
defineCollection("/newsletter/admin", NEWSLETTER as unknown as Rows);
defineCollection("/exhibitor-registrations/admin", EXHIBITOR_REGISTRATIONS as unknown as Rows, { list: byCategory("registrations") });
defineCollection("/visitor-registrations/admin", VISITOR_REGISTRATIONS as unknown as Rows, { list: byCategory("registrations") });
defineCollection("/advisory-nominations", ADVISORY_NOMINATIONS as unknown as Rows, { list: wrap("nominations") });
defineCollection("/website/awards/nominations", AWARD_NOMINATIONS as unknown as Rows, { list: wrap("nominations") });
defineCollection("/msme/admin/applications", MSME_APPLICATIONS as unknown as Rows, {
  list: (items, { query }) => {
    const status = query.get("status");
    const search = (query.get("search") ?? "").toLowerCase();
    return items.filter((item) => {
      const app = item as unknown as (typeof MSME_APPLICATIONS)[number];
      if (status && app.status !== status) return false;
      return !search || [app.applicationId, app.enterprise.enterpriseName].some((v) => v?.toLowerCase().includes(search));
    });
  },
});

/** Dashboard, notifications and the leftovers of the old case-management module */
export const leadRoutes: MockRoute[] = [
  { method: "GET", match: /^\/dashboard\/overview$/, handle: () => dashboardOverview() },
  { method: "GET", match: /^\/notifications\/admin$/, handle: () => NOTIFICATIONS },
  {
    method: "PATCH",
    match: /^\/notifications\/admin\/read-all$/,
    handle: () => {
      NOTIFICATIONS.notifications.forEach((n) => (n.isRead = true));
      NOTIFICATIONS.unreadCount = 0;
      return NOTIFICATIONS;
    },
  },
  {
    method: "PATCH",
    match: /^\/notifications\/admin\/([^/]+)\/read$/,
    handle: ({ params }) => {
      const item = NOTIFICATIONS.notifications.find((n) => n._id === params[0]);
      if (item && !item.isRead) {
        item.isRead = true;
        NOTIFICATIONS.unreadCount = Math.max(0, NOTIFICATIONS.unreadCount - 1);
      }
      return item;
    },
  },
  // Case management belonged to the previous project; Design House has no SLA cases
  { method: "GET", match: /^\/cases\/admin\/sla-breaches$/, handle: () => [] },
];
