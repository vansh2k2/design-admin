import type { ActivityLogEntry } from "@/lib/activityLogApi";
import type { ApiLimitsData } from "@/lib/apiLimitsApi";

import { STAFF, daysAgo, pick } from "./common";

/* IP block limits and the admin activity log */

export const API_LIMITS: ApiLimitsData = {
  rules: [
    { key: "contact", label: "Contact Form", path: "/api/contact-requests", enabled: true, maxAttempts: 5, blockHours: 24, defaults: { maxAttempts: 5, blockHours: 24 }, attemptsToday: 46, blockedNow: 1 },
    { key: "booking", label: "Book a Meeting", path: "/api/bookings", enabled: true, maxAttempts: 3, blockHours: 24, defaults: { maxAttempts: 3, blockHours: 24 }, attemptsToday: 18, blockedNow: 0 },
    { key: "otp", label: "WhatsApp / Email OTP", path: "/api/otp", enabled: true, maxAttempts: 5, blockHours: 6, defaults: { maxAttempts: 5, blockHours: 6 }, attemptsToday: 72, blockedNow: 2 },
    { key: "career", label: "Career Application (CV upload)", path: "/api/career-applications", enabled: true, maxAttempts: 3, blockHours: 48, defaults: { maxAttempts: 3, blockHours: 48 }, attemptsToday: 9, blockedNow: 0 },
    { key: "chatbot", label: "DH Assist Chatbot", path: "/api/chat", enabled: true, maxAttempts: 60, blockHours: 1, defaults: { maxAttempts: 60, blockHours: 1 }, attemptsToday: 388, blockedNow: 0 },
    { key: "newsletter", label: "Newsletter Subscribe", path: "/api/newsletter", enabled: false, maxAttempts: 3, blockHours: 24, defaults: { maxAttempts: 3, blockHours: 24 }, attemptsToday: 4, blockedNow: 0 },
  ],
  stats: { blockedNow: 3, blocks30d: 27, attemptsToday: 537, ips7d: 1294, protectedOn: 5, protectedTotal: 6 },
  blocks: [
    { id: "blk-1", ip: "45.141.84.12", api: "contact", apiLabel: "Contact Form", path: "/api/contact-requests", attempts: 14, blockedAt: daysAgo(0, 9, 12), blockedUntil: daysAgo(-1, 9, 12), status: "Blocked", liftedAt: null, liftedBy: null },
    { id: "blk-2", ip: "103.88.21.140", api: "otp", apiLabel: "WhatsApp / Email OTP", path: "/api/otp", attempts: 9, blockedAt: daysAgo(0, 7, 40), blockedUntil: daysAgo(0, 13, 40), status: "Blocked", liftedAt: null, liftedBy: null },
    { id: "blk-3", ip: "182.69.14.201", api: "otp", apiLabel: "WhatsApp / Email OTP", path: "/api/otp", attempts: 6, blockedAt: daysAgo(0, 6, 5), blockedUntil: daysAgo(0, 12, 5), status: "Blocked", liftedAt: null, liftedBy: null },
    { id: "blk-4", ip: "157.48.110.33", api: "career", apiLabel: "Career Application (CV upload)", path: "/api/career-applications", attempts: 4, blockedAt: daysAgo(3, 14), blockedUntil: daysAgo(1, 14), status: "Expired", liftedAt: null, liftedBy: null },
    { id: "blk-5", ip: "49.36.201.17", api: "contact", apiLabel: "Contact Form", path: "/api/contact-requests", attempts: 7, blockedAt: daysAgo(5, 16), blockedUntil: daysAgo(4, 16), status: "Unblocked", liftedAt: daysAgo(5, 17), liftedBy: "Neha Kapoor" },
  ],
};

const ACTIONS: { action: string; module: string; method: string; apiPath: string; url: string; details: string; entity?: string }[] = [
  { action: "Login", module: "Auth", method: "POST", apiPath: "/api/auth/login", url: "/login", details: "Signed in to the admin panel" },
  { action: "Updated", module: "Pages & CMS", method: "PUT", apiPath: "/api/settings", url: "/pages/1/edit", details: "Updated Home page — Hero Slider", entity: "page" },
  { action: "Created", module: "Blog & Insights", method: "POST", apiPath: "/api/blogs", url: "/blogs/new", details: "Published blog “Smart Interior Design Ideas for Small Apartments”", entity: "blog" },
  { action: "Updated", module: "Contact Us Messages", method: "PATCH", apiPath: "/api/contact-requests/cr-3/status", url: "/contact-us", details: "Changed status of Amit Khanna’s enquiry to In Progress", entity: "contactRequest" },
  { action: "Created", module: "Job Postings", method: "POST", apiPath: "/api/careers/admin/jobs", url: "/job-postings/create", details: "Created job “BIM Specialist”", entity: "job" },
  { action: "Deleted", module: "Media Library", method: "DELETE", apiPath: "/api/gallery/admin/img-22", url: "/gallery", details: "Deleted image “old-showroom-front.jpg”", entity: "media" },
  { action: "Updated", module: "SEO Audit", method: "PUT", apiPath: "/api/seo-settings", url: "/seo", details: "Updated meta title for /services/retail-interior", entity: "seo" },
  { action: "Updated", module: "Staff Management", method: "PUT", apiPath: "/api/users/admin/staff/st-4", url: "/staff", details: "Changed Rahul Verma’s role to Sales", entity: "staff" },
  { action: "Login", module: "Auth", method: "POST", apiPath: "/api/auth/login", url: "/login", details: "Failed sign-in — wrong password" },
  { action: "Created", module: "FAQs", method: "POST", apiPath: "/api/faqs/admin", url: "/faqs/new", details: "Added FAQ “Do you work outside Delhi NCR?”", entity: "faq" },
];

export const ACTIVITY_LOGS: ActivityLogEntry[] = Array.from({ length: 36 }, (_, index) => {
  const entry = pick(ACTIONS, index);
  const user = pick(STAFF, index % 5 === 0 ? 0 : index);
  const failed = entry.details.startsWith("Failed");
  return {
    _id: `log-${index + 1}`,
    userId: `user-${(index % STAFF.length) + 1}`,
    userName: user.name,
    userEmail: user.email,
    userRole: index % 5 === 0 ? "Super Admin" : user.team === "Management" ? "Super Admin" : "Content Manager",
    action: entry.action,
    module: entry.module,
    url: entry.url,
    method: entry.method,
    apiPath: entry.apiPath,
    ip: `103.21.${58 + (index % 9)}.${10 + index}`,
    userAgent: index % 3 ? "Chrome 141 on Windows" : "Safari on macOS",
    status: failed ? "Failed" : "Success",
    statusCode: failed ? 401 : entry.method === "POST" ? 201 : 200,
    details: entry.details,
    durationMs: 80 + ((index * 37) % 400),
    changes: entry.entity && entry.action === "Updated" ? [{ entity: entry.entity, operation: "updated", before: { status: "New" }, after: { status: "In Progress" } }] : undefined,
    createdAt: daysAgo(Math.floor(index / 4), 18 - (index % 9), (index * 17) % 60),
  };
});
