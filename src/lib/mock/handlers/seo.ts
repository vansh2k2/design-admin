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
  SEO_TOP_ISSUES,
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
  { method: "GET", match: /^\/(?:seo|seo-audit)\/overview$/, handle: () => seoOverview() },
  {
    method: "GET",
    match: /^\/seo\/score$/,
    handle: () => ({
      available: true,
      overall: 88,
      scores: { technical: 92, onPage: 90, content: 84, performance: 81, visibility: 86 },
      formula: {
        severityPenalty: { critical: 10, warning: 3, notice: 1 },
        sensitivity: 1,
        weights: { technical: 0.3, onPage: 0.3, content: 0.2, performance: 0.2 },
        pagesConsidered: 15,
        description: "Weighted score across automated technical, on-page, content and performance checks.",
      },
    }),
  },
  {
    method: "GET",
    match: /^\/seo\/history$/,
    handle: () => seoOverview().history ?? [],
  },
  {
    method: "GET",
    match: /^\/seo\/issues$/,
    handle: () => ({
      issues: SEO_TOP_ISSUES.map((issue, idx) => ({
        id: `issue-${idx}`,
        ruleId: issue.ruleId,
        category: issue.category,
        severity: issue.severity,
        title: issue.title,
        detail: "Automated SEO audit check result for Design House India.",
        evidence: { details: "Observed live page metrics" },
        url: "https://www.designhouse.co.in",
        firstSeenAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      })),
    }),
  },
  {
    method: "GET",
    match: /^\/seo\/alerts$/,
    handle: () => seoOverview().alerts ?? [],
  },
  {
    method: "POST",
    match: /^\/seo\/alerts\/(.+)\/acknowledge$/,
    handle: () => ({ success: true, acknowledgedAt: new Date().toISOString() }),
  },
  {
    method: "GET",
    match: /^\/seo\/site$/,
    handle: () => ({
      ...seoOverview().site,
      thresholds: { titleMin: 20, titleMax: 60, descMin: 120, descMax: 220 },
    }),
  },
  {
    method: "PATCH",
    match: /^\/seo\/site$/,
    handle: ({ body }) => ({ success: true, ...(body as object) }),
  },
  {
    method: "GET",
    match: /^\/seo\/audits$/,
    handle: () => [seoOverview().crawl],
  },
  {
    method: "GET",
    match: /^\/seo\/audits\/(.+)$/,
    handle: () => seoOverview().crawl,
  },
  {
    method: "POST",
    match: /^\/seo\/audits$/,
    handle: () => ({ crawlId: "crawl-demo-run", status: "completed" }),
  },
  {
    method: "GET",
    match: /^\/seo\/pages$/,
    handle: () => seoPagesResponse(),
  },
  {
    method: "GET",
    match: /^\/(?:seo|seo-audit)\/pages\/(.+)$/,
    handle: ({ params }) => {
      const detail = seoPageDetail(decodeURIComponent(params[0] ?? ""));
      if (!detail) return seoPageDetail("home");
      return detail;
    },
  },
  { method: "GET", match: /^\/seo-audit\/pages$/, handle: () => seoPagesResponse() },
  { method: "GET", match: /^\/seo-audit\/report$/, handle: ({ query }) => checkupReport(query.get("route") ?? "site") },
  { method: "GET", match: /^\/seo-audit\/routes$/, handle: () => ({ routes: SEO_ROUTES.map((r) => ({ path: r.path, lastmod: new Date(Date.now() - 4 * 86_400_000).toISOString() })) }) },
  { method: "POST", match: /^\/seo-audit\/.*$/, handle: () => ({ success: true, message: "Audit queued", data: { generatedAt: new Date().toISOString() } }) },

  { method: "GET", match: /^\/seo\/broken-links$/, handle: () => ({ links: BROKEN_LINKS }) },
  { method: "GET", match: /^\/seo\/redirect-chains$/, handle: () => REDIRECTS },
  { method: "GET", match: /^\/seo\/insights$/, handle: () => SEO_INSIGHTS },
  { method: "GET", match: /^\/seo\/competitors\/comparison$/, handle: () => COMPETITOR_COMPARISON },
  { method: "GET", match: /^\/seo\/competitors$/, handle: () => COMPETITORS },
  {
    method: "POST",
    match: /^\/seo\/competitors$/,
    handle: ({ body }) => {
      const { url, label } = body as { url: string; label: string };
      const row = { id: `cmp-${Date.now()}`, url, label, isActive: true, lastCrawlAt: new Date().toISOString(), lastScore: 82 };
      COMPETITORS.push(row);
      return row;
    },
  },
  {
    method: "POST",
    match: /^\/seo\/competitors\/(.+)\/audit$/,
    handle: ({ params }) => ({ crawlId: params[0], status: "completed" }),
  },
  {
    method: "DELETE",
    match: /^\/seo\/competitors\/(.+)$/,
    handle: ({ params }) => {
      const idx = COMPETITORS.findIndex((c) => c.id === params[0]);
      if (idx !== -1) COMPETITORS.splice(idx, 1);
      return { id: params[0] };
    },
  },
  {
    method: "POST",
    match: /^\/seo\/content-audit$/,
    handle: ({ body }) => {
      const targetKeyword = (body as { targetKeyword?: string })?.targetKeyword || "";
      return {
        aiLikelihood: 12,
        originalityScore: 92,
        isAiDetected: false,
        flaggedPhrases: [],
        verdict: "Original & Human-Written",
        keywordDensity: targetKeyword ? 2.1 : 0,
        suggestions: [
          "Add localized schema markup for Delhi NCR service coverage.",
          "Highlight turnkey office fit-outs and kiosk fabrication in intro paragraph.",
        ],
      };
    },
  },
  {
    method: "POST",
    match: /^\/seo\/keyword-planner$/,
    handle: ({ body }) => {
      const seed = (body as { seedKeyword?: string })?.seedKeyword || "interior design";
      return {
        keywords: [
          { keyword: `${seed} in delhi ncr`, searchVolume: 14800, difficulty: 28, cpc: 35.5, intent: "Commercial", competition: "LOW" },
          { keyword: `commercial ${seed} turnkey contractor`, searchVolume: 9200, difficulty: 42, cpc: 45.0, intent: "Commercial", competition: "MEDIUM" },
          { keyword: `best ${seed} company india`, searchVolume: 6700, difficulty: 36, cpc: 40.0, intent: "Commercial", competition: "MEDIUM" },
          { keyword: `exhibition stall and ${seed}`, searchVolume: 4200, difficulty: 22, cpc: 28.0, intent: "Transactional", competition: "LOW" },
        ],
        primaryRecommendation: `commercial ${seed} turnkey contractor`,
        lsiKeywords: [`${seed} company`, "office interior fit-out", "retail fixture manufacturer", "exhibition booth fabrication"],
      };
    },
  },
  {
    method: "GET",
    match: /^\/seo\/recommendations$/,
    handle: () => [
      { id: "rec-1", title: "Add BreadcrumbList JSON-LD", description: "Enables rich breadcrumbs on Google search results.", priority: "high", effort: "quick" },
      { id: "rec-2", title: "Improve LCP on Commercial Interior route", description: "Compress hero banner image.", priority: "medium", effort: "quick" },
    ],
  },
  {
    method: "POST",
    match: /^\/seo\/recommendations\/site$/,
    handle: () => ({
      status: "ok",
      recommendation: {
        summary: "Design House site has high indexing health and strong meta coverage. Focus on schema and image alt completeness.",
        items: [
          { id: "r1", title: "Add BreadcrumbList schema", description: "Improves search snippet display.", priority: "high", effort: "quick" },
          { id: "r2", title: "Add image alt tags to portfolio thumbnails", description: "Ensures Google Image Search indexing.", priority: "medium", effort: "quick" },
        ],
      },
    }),
  },
  {
    method: "POST",
    match: /^\/seo\/recommendations\/pages\/(.+)$/,
    handle: () => ({
      status: "ok",
      recommendation: {
        summary: "Target page is indexable. Title and meta description match search intent.",
        items: [
          { id: "pr1", title: "Optimize H2 headings for primary keywords", description: "Include commercial fit-out terms.", priority: "medium", effort: "quick" },
        ],
      },
    }),
  },
  {
    method: "POST",
    match: /^\/seo\/recommendations\/(?:cannibalization|content-gap)$/,
    handle: () => ({ status: "ok", recommendation: null }),
  },
  { method: "GET", match: /^\/seo\/fixes$/, handle: () => [] },
  { method: ["POST", "DELETE"], match: /^\/seo\/fixes.*$/, handle: () => ({ success: true }) },

  { method: "GET", match: /^\/seo$/, handle: () => SEO_RECORDS },
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
    match: /^\/seo-settings\/(?:advanced|scripts)$/,
    handle: ({ method, body }) => {
      if (method !== "GET" && body && typeof body === "object") Object.assign(ADVANCED_SEO, body);
      return ADVANCED_SEO;
    },
  },
  {
    match: /^\/seo-settings\/social-links$/,
    handle: ({ method, body }) => {
      if (method !== "GET" && body && typeof body === "object") Object.assign(ADVANCED_SEO.socialLinks, body);
      return ADVANCED_SEO.socialLinks;
    },
  },
  { method: ["POST", "PUT", "PATCH", "DELETE"], match: /^\/seo-settings\/.*$/, handle: () => ADVANCED_SEO },
];
