import type { AdminNotificationsResult } from "@/lib/adminNotificationsApi";
import type { LiveDashboardOverview } from "@/lib/dashboardApi";

import { CONTACTS, daysAgo, daysAhead, pick } from "./common";

/* Dashboard overview for designhouse.co.in — sample analytics, Search Console and site health */

const SUBMISSION_TYPES = [
  "Exhibition Stall Design",
  "Retail Interior",
  "Corporate Interior",
  "Showroom Visit",
  "Restaurant Interior",
  "Retail Kiosk",
  "Exhibition Stall Design",
  "Corporate Interior",
];

const PAGES = [
  { path: "/", views: 18420, visitors: 9870, averageSessionSeconds: 142, bounceRate: 38.2 },
  { path: "/services/retail-interior", views: 6210, visitors: 4120, averageSessionSeconds: 168, bounceRate: 34.1 },
  { path: "/portfolio", views: 5480, visitors: 3390, averageSessionSeconds: 201, bounceRate: 29.4 },
  { path: "/services/exhibitions", views: 4370, visitors: 2950, averageSessionSeconds: 154, bounceRate: 36.8 },
  { path: "/services/corporate-interior", views: 3920, visitors: 2610, averageSessionSeconds: 149, bounceRate: 37.5 },
  { path: "/contact", views: 3110, visitors: 2480, averageSessionSeconds: 96, bounceRate: 41.2 },
  { path: "/career", views: 2640, visitors: 1980, averageSessionSeconds: 133, bounceRate: 39.9 },
  { path: "/blogs", views: 1870, visitors: 1420, averageSessionSeconds: 187, bounceRate: 44.6 },
];

const SEO_CHECKS = [
  { key: "meta-title", label: "Meta Title", status: "good" as const, score: 100 },
  { key: "meta-description", label: "Meta Description", status: "good" as const, score: 92 },
  { key: "headings", label: "Headings", status: "good" as const, score: 88 },
  { key: "content", label: "Content Quality", status: "needs_work" as const, score: 74 },
  { key: "internal-links", label: "Internal Linking", status: "good" as const, score: 86 },
  { key: "images", label: "Images (ALT Text)", status: "needs_work" as const, score: 68 },
  { key: "schema", label: "Schema Markup", status: "good" as const, score: 90 },
  { key: "mobile", label: "Mobile Friendliness", status: "good" as const, score: 96 },
];

export function dashboardOverview(): LiveDashboardOverview {
  const now = new Date().toISOString();
  const connected = <T,>(data: T) => ({ status: "connected" as const, updatedAt: now, data });
  return {
    generatedAt: now,
    sources: {
      internal: connected({
        totalPages: 18,
        totalPosts: 24,
        totalEnquiries: 486,
        enquiriesMtd: 63,
        totalRequests: 512,
        growth: { posts: 12.5, enquiriesMtd: 18.4 },
        recentSubmissions: Array.from({ length: 8 }, (_, i) => {
          const contact = pick(CONTACTS, i);
          return { id: `sub-${i + 1}`, name: contact.company, type: pick(SUBMISSION_TYPES, i), city: contact.city, createdAt: daysAgo(0, 18 - i, (i * 7) % 60) };
        }),
        topLocations: [
          { city: "New Delhi", count: 142 },
          { city: "Gurugram", count: 88 },
          { city: "Noida", count: 71 },
          { city: "Mumbai", count: 64 },
          { city: "Bengaluru", count: 39 },
        ],
        actionRequired: { exhibitor: 4, buyer: 6, sponsor: 3, visitor: 5 },
      }),
      analytics: connected({
        users: 24860,
        sessions: 31940,
        pageViews: 72180,
        averageSessionSeconds: 156,
        bounceRate: 37.4,
        conversions: 486,
        daily: Array.from({ length: 30 }, (_, i) => ({ date: daysAgo(29 - i).slice(0, 10), users: 690 + ((i * 53) % 260), pageViews: 2050 + ((i * 97) % 640) })),
        pages: PAGES,
        growth: { users: 14.2, sessions: 11.8, pageViews: 16.5, averageSession: 4.1, bounceRate: -2.3, conversionRate: 6.7 },
      }),
      searchConsole: connected({
        clicks: 8420,
        impressions: 214600,
        ctr: 3.9,
        position: 14.6,
        growth: { clicks: 12.1, impressions: 18.7, ctr: -0.4, position: -1.8 },
        queries: [
          { query: "retail interior designers in delhi", clicks: 612, impressions: 9840, ctr: 6.2, position: 4.1 },
          { query: "exhibition stall design company", clicks: 538, impressions: 12210, ctr: 4.4, position: 6.3 },
          { query: "corporate office interior noida", clicks: 401, impressions: 8760, ctr: 4.6, position: 7.2 },
          { query: "retail kiosk manufacturer", clicks: 344, impressions: 6120, ctr: 5.6, position: 5.4 },
          { query: "shop in shop display fabrication", clicks: 212, impressions: 4380, ctr: 4.8, position: 8.9 },
          { query: "design house india", clicks: 1980, impressions: 5240, ctr: 37.8, position: 1.2 },
        ],
      }),
      pageSpeed: connected({
        strategy: "mobile" as const,
        lighthouseAvailable: true,
        performanceScore: 82,
        seoScore: 94,
        lcp: 2400,
        inp: 168,
        cls: 0.04,
        fcp: 1300,
        ttfb: 420,
        tbt: 190,
        seoChecks: SEO_CHECKS,
      }),
      indexCoverage: connected({
        indexed: 64,
        total: 71,
        notIndexed: 7,
        urls: [
          { url: "https://www.designhouse.co.in/", indexed: true, coverageState: "Submitted and indexed" },
          { url: "https://www.designhouse.co.in/services/retail-interior", indexed: true, coverageState: "Submitted and indexed" },
          { url: "https://www.designhouse.co.in/portfolio", indexed: true, coverageState: "Submitted and indexed" },
          { url: "https://www.designhouse.co.in/downloads", indexed: false, coverageState: "Crawled - currently not indexed" },
        ],
      }),
      siteStatus: connected({
        online: true,
        responseTimeMs: 312,
        httpStatus: 200,
        sslValid: true,
        sslExpiresAt: daysAhead(54),
        sslIssuer: "Let's Encrypt (R11)",
        certificateDaysRemaining: 54,
        finalUrl: "https://www.designhouse.co.in/",
        redirected: true,
        ipAddress: "13.234.118.20",
        securityHeaders: { present: 5, total: 6 },
        nodeVersion: "v22.11.0",
      }),
    },
  };
}

export const NOTIFICATIONS: AdminNotificationsResult = {
  unreadCount: 3,
  notifications: [
    { _id: "ntf-1", type: "ENQUIRY", title: "New enquiry — Retail Interior", message: "Rohit Mehta (UrbanCart Retail) wants a 6-store rollout in NCR.", link: "/contact-us", isRead: false, createdAt: daysAgo(0, 9, 40) },
    { _id: "ntf-2", type: "ENQUIRY", title: "Stall quotation request", message: "Aroma Organic Foods asked for a 36 sqm stall at Aahar 2027.", link: "/book-a-stand/domestic", isRead: false, createdAt: daysAgo(0, 8, 15) },
    { _id: "ntf-3", type: "SYSTEM_EXPIRY", title: "Hosting renewal due in 12 days", message: "Production Server (AWS Mumbai) renews soon.", link: "/system-services", isRead: false, createdAt: daysAgo(1, 10) },
    { _id: "ntf-4", type: "ENQUIRY", title: "New job application", message: "A candidate applied for Architectural Designer (match 82%).", link: "/applications-ai-response", isRead: true, createdAt: daysAgo(1, 16, 20) },
    { _id: "ntf-5", type: "SYSTEM_EXPIRY", title: "Domain renewal due in 18 days", message: "designhouse.co.in renews automatically with GoDaddy.", link: "/system-services", isRead: true, createdAt: daysAgo(2, 11) },
  ],
};
