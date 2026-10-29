import type { MockRoute } from "../http";
import { currentAdmin } from "../fixtures/admin";
import {
  COUNTRIES,
  CUSTOM_CITIES,
  DROPDOWN_OPTIONS,
  EVENTS_LIST,
  GBP_CONNECTION,
  GBP_LOCATIONS,
  GBP_REVIEWS,
  PERMISSIONS,
  ROLES,
  SETTINGS,
  STAFF_MEMBERS,
  STALL_RATES,
  STALLS,
  STATES,
  dropdownLists,
  gbpDashboard,
} from "../fixtures/system";
import { defineCollection } from "../store";

type Rows = Record<string, unknown>[];

defineCollection("/roles/admin", ROLES as unknown as Rows);
const staff = defineCollection("/users/admin/staff", STAFF_MEMBERS as unknown as Rows);
defineCollection("/dropdowns/admin/options", DROPDOWN_OPTIONS as unknown as Rows, {
  list: (items, { query }) => items.filter((o) => !query.get("list") || o.list === query.get("list")).sort((a, b) => Number(a.order) - Number(b.order)),
});
defineCollection("/locations/admin/cities", CUSTOM_CITIES as unknown as Rows);
defineCollection("/events/admin", EVENTS_LIST as unknown as Rows, {
  list: (items) =>
    items.map((event) => {
      const stalls = STALLS.filter((s) => s.event === event._id);
      const count = (status: string) => stalls.filter((s) => s.status === status).length;
      return { ...event, stallCounts: { available: count("available"), reserved: count("reserved"), booked: count("booked"), blocked: count("blocked") } };
    }),
});
defineCollection("/stalls/admin", STALLS as unknown as Rows, { list: (items, { query }) => items.filter((s) => !query.get("eventId") || s.event === query.get("eventId")) });
defineCollection("/stall-rates/admin", STALL_RATES as unknown as Rows, { list: (items, { query }) => items.filter((r) => !query.get("eventId") || r.event === query.get("eventId")) });

/** Users, roles, site settings, dropdowns, locations, Google reviews and the system-records access gate */
export const systemRoutes: MockRoute[] = [
  { method: "GET", match: /^\/roles\/admin\/permissions$/, handle: () => PERMISSIONS },
  {
    method: "POST",
    match: /^\/users\/admin\/staff$/,
    handle: ({ body }) => {
      const input = body as Record<string, string>;
      const roleName = ROLES.find((r) => r._id === input.roleId)?.name;
      const user = { _id: `staff-${Date.now()}`, ...input, roleName, status: "ACTIVE", isEmailVerified: false, createdAt: new Date().toISOString() };
      staff.items.unshift(user);
      return { user, temporaryPassword: "DH@" + Math.random().toString(36).slice(2, 8) };
    },
  },

  {
    match: /^\/settings$/,
    handle: ({ method, body }) => {
      if (method === "PUT" && body && typeof body === "object") Object.assign(SETTINGS, body, { updatedAt: new Date().toISOString() });
      return SETTINGS;
    },
  },
  {
    method: "PATCH",
    match: /^\/settings\/page-status$/,
    handle: ({ body }) => {
      const { configKey, status, updatedBy } = body as { configKey: string; status: string; updatedBy?: string };
      const page = ((SETTINGS[configKey] as Record<string, unknown>) ??= {});
      Object.assign(page, { status, updatedBy: updatedBy ?? currentAdmin().name, lastUpdated: new Date().toISOString() });
      return { configKey, ...page };
    },
  },

  { method: "GET", match: /^\/dropdowns\/admin\/lists$/, handle: () => dropdownLists() },
  {
    method: "PUT",
    match: /^\/dropdowns\/admin\/lists\/([^/]+)\/order$/,
    handle: ({ params, body }) => {
      const ids = (body as { ids?: string[] })?.ids ?? [];
      ids.forEach((id, index) => {
        const option = DROPDOWN_OPTIONS.find((o) => o._id === id);
        if (option) option.order = index + 1;
      });
      return DROPDOWN_OPTIONS.filter((o) => o.list === decodeURIComponent(params[0] ?? ""));
    },
  },
  { method: "GET", match: /^\/crm-countries$/, handle: () => COUNTRIES },
  { method: "GET", match: /^\/crm-states$/, handle: ({ query }) => STATES.filter((s) => s.countryCode === (query.get("countryCode") ?? "IN")) },

  { method: "GET", match: /^\/gbp\/connection$/, handle: () => GBP_CONNECTION },
  { method: "GET", match: /^\/gbp\/oauth\/url$/, handle: () => ({ url: "https://accounts.google.com/" }) },
  { method: "GET", match: /^\/gbp\/locations$/, handle: () => GBP_LOCATIONS },
  { method: "GET", match: /^\/gbp\/dashboard$/, handle: () => gbpDashboard() },
  {
    method: "GET",
    match: /^\/gbp\/reviews$/,
    handle: ({ query }) => {
      const tab = query.get("tab");
      const rows = GBP_REVIEWS.filter((r) => (tab === "pending" ? r.replyStatus === "pending" : tab === "replied" ? r.replyStatus === "replied" : tab === "negative" ? r.rating <= 3 : true));
      return { rows, pagination: { page: 1, limit: 20, total: rows.length, totalPages: 1 }, totalReviews: 186, filteredCount: rows.length };
    },
  },
  { method: "POST", match: /^\/gbp\/reviews\/sync$/, handle: () => ({ status: "success", newReviewsCount: 0, updatedReviewsCount: 0, lastSyncedAt: new Date().toISOString() }) },
  {
    match: /^\/gbp\/reviews\/([^/]+)\/reply$/,
    handle: ({ method, params, body }) => {
      const review = GBP_REVIEWS.find((r) => r.id === decodeURIComponent(params[0] ?? ""));
      if (review) {
        const reply = method === "DELETE" ? null : String((body as { comment?: string })?.comment ?? "");
        Object.assign(review, { replyComment: reply, replyUpdateTime: reply ? new Date().toISOString() : null, replyStatus: reply ? "replied" : "pending" });
      }
      return review;
    },
  },
  { method: "DELETE", match: /^\/gbp\/disconnect$/, handle: () => null },

  {
    method: "GET",
    match: /^\/system-services\/access\/requirements$/,
    handle: () => {
      const admin = currentAdmin();
      return { expiresInMinutes: 60, requiredRoles: ["self"], requester: { id: admin.id, name: admin.name, email: admin.email, phone: admin.phone, twoFactorEnabled: true }, approvers: [] };
    },
  },
  { method: "POST", match: /^\/system-services\/access\/send-otp$/, handle: () => ({ success: true, message: "Code sent on WhatsApp (sample mode: enter any 6 digits)." }) },
];
