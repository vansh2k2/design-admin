import { MockHttpError, type MockRoute } from "../http";
import { defineCollection } from "../store";
import {
  ADVANCED_SEO,
  BACKLINKS,
  BROKEN_LINKS,
  COMPETITOR_COMPARISON,
  COMPETITORS,
  REDIRECTS,
  SEO_INSIGHTS,
  SEO_RECORDS,
  SEO_ROUTES,
  checkupReport,
  seoOverview,
  seoPageDetail,
  seoPagesResponse,
} from "../fixtures/seo";

type Rows = Record<string, unknown>[];

defineCollection("/redirects", REDIRECTS as unknown as Rows);
const backlinks = defineCollection("/seo/backlinks", BACKLINKS as unknown as Rows, {
  list: (items, { query }) => {
    const search = (query.get("search") ?? "").toLowerCase();
    const rows = items.filter((b) => {
      if (query.get("status") && b.status !== query.get("status")) return false;
      if (query.get("type") && b.type !== query.get("type")) return false;
      return !search || [b.sourceUrl, b.targetUrl, b.anchorText].some((v) => String(v ?? "").toLowerCase().includes(search));
    });
    const count = (key: string, value: string) => items.filter((b) => b[key] === value).length;
    return {
      items: rows,
      meta: { total: rows.length, page: 1, limit: 50, totalPages: 1 },
      stats: { total: items.length, active: count("status", "active"), lost: count("status", "lost"), broken: count("status", "broken"), dofollow: count("type", "dofollow"), nofollow: count("type", "nofollow") },
    };
  },
});
void backlinks;

const pageKey = (raw: string) => decodeURIComponent(raw).replace(/^\/+|\/+$/g, "") || "home";

/** SEO audit, page meta records, insights, competitors, backlinks and redirects */
export const seoRoutes: MockRoute[] = [
  { method: "GET", match: /^\/seo-audit\/overview$/, handle: () => seoOverview() },
  { method: "GET", match: /^\/seo-audit\/pages$/, handle: () => seoPagesResponse() },
  {
    method: "GET",
    match: /^\/seo-audit\/pages\/(.+)$/,
    handle: ({ params }) => {
      const detail = seoPageDetail(decodeURIComponent(params[0] ?? ""));
      if (!detail) throw new MockHttpError(404, "No audit data for this route yet.");
      return detail;
    },
  },
  { method: "GET", match: /^\/seo-audit\/report$/, handle: ({ query }) => checkupReport(query.get("route") ?? "site") },
  { method: "GET", match: /^\/seo-audit\/routes$/, handle: () => ({ routes: SEO_ROUTES.map((r) => ({ path: r.path, lastmod: new Date(Date.now() - 4 * 86_400_000).toISOString() })) }) },
  { method: "POST", match: /^\/seo-audit\/.*$/, handle: () => ({ success: true, message: "Audit queued", data: { generatedAt: new Date().toISOString() } }) },

  { method: "GET", match: /^\/seo\/broken-links$/, handle: () => ({ links: BROKEN_LINKS }) },
  { method: "GET", match: /^\/seo\/insights$/, handle: () => SEO_INSIGHTS },
  { method: "GET", match: /^\/seo\/competitors\/comparison$/, handle: () => COMPETITOR_COMPARISON },
  { method: "GET", match: /^\/seo\/competitors$/, handle: () => COMPETITORS },
  {
    method: "POST",
    match: /^\/seo\/competitors$/,
    handle: ({ body }) => {
      const { url, label } = body as { url: string; label: string };
      const row = { id: `cmp-${Date.now()}`, url, label, isActive: true, lastCrawlAt: null, lastScore: null };
      COMPETITORS.push(row);
      return row;
    },
  },
  { method: "POST", match: /^\/seo\/recommendations\/.*$/, handle: () => ({ status: "not_configured", message: "AI recommendations need an API key on the server.", recommendation: null }) },
  { method: "GET", match: /^\/seo\/fixes$/, handle: () => [] },
  { method: ["POST", "DELETE"], match: /^\/seo\/fixes.*$/, handle: () => ({ success: true }) },

  { method: "GET", match: /^\/seo$/, handle: () => SEO_RECORDS },
  { method: "GET", match: /^\/seo\/pages$/, handle: () => SEO_RECORDS },
  {
    match: /^\/seo\/page\/(.+)$/,
    handle: ({ method, params, body }) => {
      const key = pageKey(params[0] ?? "");
      let record = SEO_RECORDS.find((r) => r.page === key);
      if (method === "GET") return record ?? { page: key };
      if (!record) {
        record = { _id: `seo-${key}`, page: key };
        SEO_RECORDS.push(record);
      }
      Object.assign(record, body, { updatedAt: new Date().toISOString() });
      return record;
    },
  },
  { method: "POST", match: /^\/seo\/(generate|update)$/, handle: ({ body }) => SEO_RECORDS.find((r) => r.page === (body as { page?: string })?.page) ?? body },

  {
    match: /^\/seo-settings\/advanced$/,
    handle: ({ method, body }) => {
      if (method !== "GET" && body && typeof body === "object") Object.assign(ADVANCED_SEO, body);
      return ADVANCED_SEO;
    },
  },
  { method: ["POST", "PUT", "PATCH", "DELETE"], match: /^\/seo-settings\/.*$/, handle: () => ADVANCED_SEO },
];
