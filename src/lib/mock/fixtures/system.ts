import type { DropdownListInfo, DropdownOption, LocationItem, CustomCity } from "@/lib/dropdownsApi";
import type { ExpoEvent, Stall, StallRate } from "@/lib/expoApi";
import type { Connection, GbpDashboard, GbpLocation, GbpReview } from "@/lib/gbpApi";
import type { Permission, Role, StaffMember } from "@/lib/types";

import { COMPANY, SERVICES, STAFF, daysAgo, daysAhead, pick } from "./common";

/* Users, roles, site settings, dropdowns, events/stalls and Google reviews for Design House */

// ---- Roles & permissions ----
const MODULES = ["Dashboard", "Enquiries", "Chatbot", "Registrations", "Pages & CMS", "Blogs", "Media Library", "Careers", "SEO", "Reviews", "Staff", "Roles", "Settings", "System Services"];
const ACTIONS = ["view", "create", "edit", "delete"];

export const PERMISSIONS: Permission[] = MODULES.flatMap((module) =>
  ACTIONS.map((action) => {
    const key = `${module.toLowerCase().replace(/[^a-z]+/g, "_")}.${action}`;
    return { _id: `perm-${key}`, module, action, key, label: `${action[0]!.toUpperCase()}${action.slice(1)} ${module}` };
  }),
);

const permsFor = (modules: string[], actions = ACTIONS) => PERMISSIONS.filter((p) => modules.includes(p.module) && actions.includes(p.action));

const role = (id: string, name: string, slug: string, description: string, perms: Permission[], isSystem = false, status: Role["status"] = "ACTIVE"): Role => ({
  _id: id,
  name,
  slug,
  description,
  permissionIds: perms.map((p) => p._id),
  permissions: perms,
  isSystem,
  status,
  createdAt: daysAgo(400),
});

export const ROLES: Role[] = [
  role("role-1", "Super Admin", "SUPER_ADMIN", "Full access to every module", PERMISSIONS, true),
  role("role-2", "Content Manager", "CONTENT_MANAGER", "Pages & CMS, blogs, media library and SEO", permsFor(["Dashboard", "Pages & CMS", "Blogs", "Media Library", "SEO", "Reviews"])),
  role("role-3", "Sales Manager", "SALES_MANAGER", "Enquiries, chatbot leads and registrations", permsFor(["Dashboard", "Enquiries", "Chatbot", "Registrations"])),
  role("role-4", "HR Manager", "HR_MANAGER", "Job postings and applications", permsFor(["Dashboard", "Careers"])),
  role("role-5", "Editor", "EDITOR", "Can edit content only", permsFor(["Pages & CMS", "Blogs", "Media Library"], ["view", "edit"])),
  role("role-6", "Viewer", "VIEWER", "Read-only access", PERMISSIONS.filter((p) => p.action === "view"), false, "INACTIVE"),
];

const ROLE_FOR_TEAM: Record<string, Role> = {
  Management: ROLES[0]!,
  Sales: ROLES[2]!,
  Design: ROLES[1]!,
  Projects: ROLES[4]!,
  HR: ROLES[3]!,
  Marketing: ROLES[1]!,
};

export const STAFF_MEMBERS: StaffMember[] = STAFF.map((s, i) => {
  const r = ROLE_FOR_TEAM[s.team] ?? ROLES[4]!;
  return {
    _id: `staff-${i + 1}`,
    name: s.name,
    email: s.email,
    phone: `+91 98${String(11000000 + i * 734521).slice(0, 8)}`,
    employeeId: `DH-${String(1001 + i)}`,
    avatarUrl: i < 3 ? ["/images/dh/team/member-1770966833568-905181984.jpg", "/images/dh/team/member-1770966868628-771484728.jpg", "/images/dh/team/member-1770966897670-298975281.jpg"][i] : undefined,
    roleId: r._id,
    roleName: r.name,
    status: i === 7 ? "INACTIVE" : "ACTIVE",
    lockUntil: null,
    isEmailVerified: i !== 6,
    lastLoginAt: daysAgo(i % 4, 9 + i),
    createdAt: daysAgo(300 - i * 20),
  };
});

// ---- Site settings (also holds per-page CMS state, keyed by the page's configKey) ----
export const SETTINGS: Record<string, unknown> = {
  _id: "settings-dh",
  siteName: COMPANY.name,
  helplineNumber: COMPANY.phone,
  whatsappNumber: COMPANY.whatsapp,
  supportEmail: COMPANY.email,
  address: COMPANY.headOffice,
  maxImageUploadSizeKB: 2048,
  organisation: { legalName: COMPANY.legalName, panNumber: "AABCD1234F", registeredAddress: COMPANY.headOffice },
  notifications: { quietHoursStart: "21:00", quietHoursEnd: "08:00" },
  systemAlerts: { popupReminderDays: 15, emailReminderDays: 30, notifyEmails: ["it.support@designhouse.co.in"] },
  banners: [],
  socialLinks: [
    { platform: "youtube", url: "https://www.youtube.com/@designhouseindia" },
    { platform: "website", url: COMPANY.website },
  ],
  createdAt: daysAgo(400),
  updatedAt: daysAgo(2, 12),
};

// ---- Dropdown lists used by the website forms ----
const LISTS: { key: string; name: string; group: string; usedIn: string[]; values: string[] }[] = [
  { key: "service_interest", name: "Service Interested In", group: "Contact", usedIn: ["Contact Us", "Book a Meeting"], values: [...SERVICES] },
  { key: "project_budget", name: "Project Budget", group: "Contact", usedIn: ["Contact Us"], values: ["Under ₹5 lakh", "₹5–15 lakh", "₹15–50 lakh", "₹50 lakh–1 crore", "Above ₹1 crore"] },
  { key: "project_timeline", name: "Project Timeline", group: "Contact", usedIn: ["Contact Us"], values: ["Immediately", "Within 1 month", "1–3 months", "3–6 months"] },
  { key: "stall_type", name: "Stall Type", group: "Book a Stand", usedIn: ["Book a Stand"], values: ["Bare Space — Custom Stall", "Island Stall", "Corner Stall", "Double-Decker Stall", "Shell Scheme Upgrade"] },
  { key: "industry_sector", name: "Industry Sector", group: "Shared", usedIn: ["Book a Stand", "Visitor Registration", "Buyer Enquiry"], values: ["Retail", "QSR & Restaurants", "FMCG", "Consumer Electronics", "Fashion & Lifestyle", "Automotive", "Real Estate", "Hospitality"] },
  { key: "buyer_type", name: "Buyer Type", group: "Buyer Enquiry", usedIn: ["Buyer Enquiry"], values: ["Retail Chain", "Franchise Owner", "Distributor", "Brand Marketing Team", "Mall Developer"] },
  { key: "partner_category", name: "Partner Category", group: "Partnership", usedIn: ["Partnership / Collaboration"], values: ["Fabrication Vendor", "Lighting Supplier", "Architect / Consultant", "Channel Partner", "Signage Manufacturer", "Logistics Partner"] },
  { key: "how_did_you_hear", name: "How Did You Hear About Us", group: "Shared", usedIn: ["Contact Us", "Careers"], values: ["Google Search", "Instagram", "LinkedIn", "Referral", "Exhibition", "Existing Client"] },
];

export const DROPDOWN_OPTIONS: DropdownOption[] = LISTS.flatMap((list) =>
  list.values.map((label, i) => ({
    _id: `opt-${list.key}-${i + 1}`,
    list: list.key,
    label,
    value: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    parentValue: "",
    order: i + 1,
    isActive: !(list.key === "project_budget" && i === 4),
    createdAt: daysAgo(120),
    updatedAt: daysAgo(10),
  })),
);

export function dropdownLists(): DropdownListInfo[] {
  return LISTS.map((list) => {
    const options = DROPDOWN_OPTIONS.filter((o) => o.list === list.key);
    return { key: list.key, name: list.name, group: list.group, usedIn: list.usedIn, total: options.length, active: options.filter((o) => o.isActive).length, updatedBy: "Karan Mehta", updatedAt: daysAgo(10, 15) };
  });
}

export const COUNTRIES: LocationItem[] = [
  { _id: "IN", name: "India", countryCode: "IN" },
  { _id: "AE", name: "United Arab Emirates", countryCode: "AE" },
  { _id: "NP", name: "Nepal", countryCode: "NP" },
  { _id: "LK", name: "Sri Lanka", countryCode: "LK" },
  { _id: "SG", name: "Singapore", countryCode: "SG" },
];

export const STATES: LocationItem[] = [
  ["DL", "Delhi"], ["HR", "Haryana"], ["UP", "Uttar Pradesh"], ["MH", "Maharashtra"], ["KA", "Karnataka"], ["RJ", "Rajasthan"], ["GJ", "Gujarat"], ["PB", "Punjab"], ["TG", "Telangana"], ["WB", "West Bengal"], ["TN", "Tamil Nadu"],
].map(([code, name]) => ({ _id: `IN-${code}`, name: name!, countryCode: "IN", stateCode: code }));

export const CUSTOM_CITIES: CustomCity[] = [
  { _id: "city-1", countryCode: "IN", stateCode: "UP", name: "Ghaziabad", isActive: true },
  { _id: "city-2", countryCode: "IN", stateCode: "UP", name: "Greater Noida", isActive: true },
  { _id: "city-3", countryCode: "IN", stateCode: "HR", name: "Faridabad", isActive: true },
  { _id: "city-4", countryCode: "IN", stateCode: "HR", name: "Sonipat", isActive: false },
];

// ---- Events where Design House builds stalls, with their stall inventory ----
export const EVENTS_LIST: ExpoEvent[] = [
  { _id: "evt-1", name: "IHGF Delhi Fair (Autumn) 2026", startDate: daysAhead(9), endDate: daysAhead(13), venue: "India Expo Centre & Mart", city: "Greater Noida", isActive: true, paymentPlans: [{ id: "full", label: "100% advance", percentage: 100 }, { id: "half", label: "50% advance, 50% before installation", percentage: 50 }] },
  { _id: "evt-2", name: "India International Trade Fair 2026", startDate: daysAhead(21), endDate: daysAhead(34), venue: "Bharat Mandapam, Pragati Maidan", city: "New Delhi", isActive: true, paymentPlans: [{ id: "full", label: "100% advance", percentage: 100 }] },
  { _id: "evt-3", name: "Aahar International Food Fair 2027", startDate: daysAhead(140), endDate: daysAhead(144), venue: "Bharat Mandapam, Pragati Maidan", city: "New Delhi", isActive: false, paymentPlans: [{ id: "full", label: "100% advance", percentage: 100 }] },
];

const STALL_TYPES = ["Bare Space — Custom Stall", "Island Stall", "Corner Stall", "Double-Decker Stall"];
export const STALLS: Stall[] = EVENTS_LIST.slice(0, 2).flatMap((event, e) =>
  Array.from({ length: 10 }, (_, i): Stall => {
    const length = [6, 9, 6, 12, 6][i % 5] ?? 6;
    const width = [6, 6, 3, 6, 9][i % 5] ?? 6;
    return {
      _id: `stl-${e + 1}-${i + 1}`,
      event: event._id,
      stallNumber: `H${1 + (i % 4)}-${String.fromCharCode(65 + i)}${10 + i}`,
      hall: `Hall ${1 + (i % 4)}`,
      stallType: pick(STALL_TYPES, i),
      length,
      width,
      area: length * width,
      plScheme: "Design + Fabrication + Installation",
      incrementPercentage: i % 4 === 1 ? 10 : 0,
      discountPercentage: 0,
      status: (["booked", "available", "reserved", "available", "booked", "blocked", "available", "booked", "available", "reserved"] as const)[i] ?? "available",
      notes: "",
    };
  }),
);

export const STALL_RATES: StallRate[] = EVENTS_LIST.flatMap((event) => [
  ...STALL_TYPES.map((type, i) => ({ _id: `rate-${event._id}-${i}`, event: event._id, stallType: type, currency: "INR" as const, ratePerSqm: 9500 + i * 1500 })),
  { _id: `rate-${event._id}-usd`, event: event._id, stallType: STALL_TYPES[0]!, currency: "USD" as const, ratePerSqm: 130 },
]);

// ---- Google Business Profile reviews ----
export const GBP_CONNECTION: Connection = { connected: true, googleEmail: "marketing@designhouse.co.in", oauthHealth: "healthy", selectedAccountId: "accounts/108742", locationCount: 3, lastSuccessfulSync: daysAgo(0, 6), notifications: "enabled" };

export const GBP_LOCATIONS: GbpLocation[] = COMPANY.offices.map((office, i) => ({ locationId: `loc-${i + 1}`, name: `Design House India — ${office.title}`, city: office.city, address: `${office.address}, ${office.city}`, profileUrl: "https://maps.google.com/" }));

const REVIEW_TEXT = [
  "Excellent work on our showroom. Finishing quality is top class and the team was very professional.",
  "They designed our exhibition stall at Pragati Maidan — got a lot of compliments from visitors.",
  "Good experience overall. Delivery was a week late but the final result was worth it.",
  "Very responsive team, transparent pricing and neat execution of our office interior.",
  "Kiosk was delivered and installed overnight at the mall. Highly recommend.",
  "Average experience; communication could be better during the project.",
  "Our restaurant looks amazing after the redesign. Thank you Design House!",
  "Great factory setup and quality control. Will work with them again.",
];

export const GBP_REVIEWS: GbpReview[] = REVIEW_TEXT.map((comment, i) => {
  const loc = GBP_LOCATIONS[i % GBP_LOCATIONS.length]!;
  const rating = i === 5 ? 3 : i === 2 ? 4 : 5;
  const created = daysAgo(i * 6 + 1, 12);
  return {
    id: `rev-${i + 1}`,
    googleReviewId: `AbFvOq${1000 + i}`,
    reviewerName: ["Ankit Bansal", "Shweta Kulkarni", "Rahul Gupta", "Meera Iyer", "Kavita Reddy", "Arjun Singh", "Simran Kaur", "Deepak Chauhan"][i] ?? "Google User",
    reviewerPhoto: null,
    rating,
    comment,
    locationId: loc.locationId,
    locationName: loc.name,
    createTime: created,
    updateTime: created,
    replyComment: i % 3 === 0 ? "Thank you for your kind words! We look forward to working with you again. — Team Design House" : null,
    replyUpdateTime: i % 3 === 0 ? daysAgo(i * 6, 15) : null,
    replyStatus: i % 3 === 0 ? "replied" : "pending",
    lastSyncedAt: daysAgo(0, 6),
  };
});

export function gbpDashboard(): GbpDashboard {
  const total = 186;
  return {
    metrics: { overallRating: 4.7, totalReviews: total, newReviews: 8, pendingReplies: GBP_REVIEWS.filter((r) => r.replyStatus === "pending").length },
    tabCounts: { all: total, new: 8, pending: 5, replied: 181, negative: 4 },
    ratingBreakdown: [
      { stars: 5, count: 148, percentage: 79.6 },
      { stars: 4, count: 26, percentage: 14 },
      { stars: 3, count: 8, percentage: 4.3 },
      { stars: 2, count: 2, percentage: 1.1 },
      { stars: 1, count: 2, percentage: 1.1 },
    ],
    trend: Array.from({ length: 6 }, (_, i) => ({ label: daysAgo((5 - i) * 30).slice(0, 7), averageRating: 4.5 + i * 0.04, count: 18 + i * 3 })),
    byLocation: GBP_LOCATIONS.map((l, i) => ({ locationId: l.locationId, name: l.name, averageRating: [4.8, 4.6, 4.7][i] ?? 4.7, totalReviews: [96, 58, 32][i] ?? 20 })),
    negativeReviews: GBP_REVIEWS.filter((r) => r.rating <= 3).map((r) => ({ id: r.id, reviewerName: r.reviewerName, rating: r.rating, comment: r.comment, locationName: r.locationName, createTime: r.createTime, replyStatus: r.replyStatus })),
    lastSyncedAt: daysAgo(0, 6),
  };
}
