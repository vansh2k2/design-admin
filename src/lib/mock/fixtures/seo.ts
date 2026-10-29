import type { BacklinkItem } from "@/lib/backlinkApi";
import type { Redirect } from "@/lib/redirectsApi";
import type { SeoRecord } from "@/lib/seoApi";
import type { SeoBrokenLink, SeoCompetitor, SeoCompetitorComparison, SeoInsights, SeoOverview, SeoPageDetail, SeoPageRow, SeoPagesResponse } from "@/lib/seoAuditApi";
import type { CheckupGroup, CheckupIssue, RouteSummary, SeoCheckupReportData } from "@/lib/seoCheckupData";

import { daysAgo } from "./common";

/* Sample SEO audit of www.designhouse.co.in */

const ORIGIN = "https://www.designhouse.co.in";

interface RouteSeed {
  path: string;
  label: string;
  title: string;
  description: string;
  h1: string;
  words: number;
  score: number;
  clicks: number;
  impressions: number;
  position: number;
}

export const SEO_ROUTES: RouteSeed[] = [
  { path: "/", label: "Home Page", title: "Design House India | Turnkey Interior & Exhibition Solutions", description: "India's leading turnkey interior, retail display and exhibition solutions company — 5000+ projects delivered across India since 2004.", h1: "India's Leading Turnkey Interior & Exhibition Solutions Company", words: 1240, score: 94, clicks: 1980, impressions: 26400, position: 3.1 },
  { path: "/about", label: "About Us", title: "About Design House India Pvt. Ltd. | Crafting Exceptional Spaces", description: "Premier manufacturer of retail display solutions with nationwide reach. Display merchandising, events, exhibitions, retail kiosks and turnkey projects.", h1: "About Us", words: 860, score: 91, clicks: 312, impressions: 7400, position: 8.4 },
  { path: "/about/team", label: "Our Team", title: "Our Team | Design House India", description: "Meet the leadership guiding Design House — decades of expertise in premium interiors and architectural excellence.", h1: "Guiding Visionary Spaces", words: 420, score: 84, clicks: 74, impressions: 2100, position: 12.6 },
  { path: "/about/infrastructure", label: "Infrastructure", title: "Manufacturing Infrastructure | Design House India", description: "In-house manufacturing for retail fixtures, kiosks, furniture and exhibition stalls.", h1: "Facility & Infrastructure", words: 510, score: 82, clicks: 41, impressions: 1650, position: 15.2 },
  { path: "/services", label: "Services", title: "Interior Design & Retail Display Services | Design House", description: "Retail, corporate and restaurant interiors, shop-in-shops, retail kiosks, display merchandising, signage and exhibition stalls.", h1: "Our Services", words: 980, score: 92, clicks: 540, impressions: 12800, position: 6.9 },
  { path: "/services/retail-interior", label: "Retail Interior", title: "Retail Interior Designers in Delhi NCR | Design House", description: "Retail store interior design and turnkey execution for brands — showrooms, malls, high-street stores and brand outlets.", h1: "Retail Interior", words: 1120, score: 95, clicks: 612, impressions: 9840, position: 4.1 },
  { path: "/services/corporate-interior", label: "Corporate Interior", title: "Corporate Office Interior Design | Design House India", description: "Functional, future-ready workspaces — space planning, workstations, cabins, meeting rooms and breakout zones.", h1: "Corporate Interior", words: 1040, score: 93, clicks: 401, impressions: 8760, position: 7.2 },
  { path: "/services/restaurant-interior", label: "Restaurant Interior", title: "Restaurant & Cafe Interior Design | Design House", description: "Immersive dining environments for restaurants, cafes, QSRs, fine dining and food courts.", h1: "Restaurant Interior", words: 930, score: 90, clicks: 188, impressions: 5120, position: 9.4 },
  { path: "/services/shop-in-shop", label: "Shop in Shop", title: "Shop in Shop Display Fabrication | Design House", description: "Branded shop-in-shop counters and displays for department stores and multi-brand outlets.", h1: "Shop in Shop", words: 760, score: 87, clicks: 212, impressions: 4380, position: 8.9 },
  { path: "/services/retail-kiosk", label: "Retail Kiosk", title: "Retail Kiosk Manufacturer | Mall Kiosks | Design House", description: "Industry-leading retail kiosk solutions blending innovation with functionality for malls and airports.", h1: "Retail Kiosk", words: 820, score: 91, clicks: 344, impressions: 6120, position: 5.4 },
  { path: "/services/retail-display", label: "Retail Display", title: "Retail Display Merchandising | Design House India", description: "Strategic visual merchandising, gondolas, wall bays and custom fixtures that drive sales.", h1: "Retail Display Merchandising", words: 790, score: 86, clicks: 156, impressions: 3920, position: 10.8 },
  { path: "/services/exhibitions", label: "Exhibitions & Events", title: "Exhibition Stall Design Company | Design House India", description: "Custom exhibition stalls and event setups — concept, fabrication, graphics and on-site installation.", h1: "Exhibition & Events", words: 1010, score: 94, clicks: 538, impressions: 12210, position: 6.3 },
  { path: "/services/signage", label: "Signage", title: "Branding & Signage Solutions | Design House", description: "LED and backlit signboards, wayfinding, 3D acrylic and metal lettering.", h1: "Branding & Signages", words: 640, score: 79, clicks: 64, impressions: 2210, position: 14.1 },
  { path: "/portfolio", label: "Portfolio", title: "Our Projects | Interior & Exhibition Portfolio | Design House", description: "Explore retail, corporate, restaurant, kiosk and exhibition projects delivered by Design House across India.", h1: "Our Portfolio", words: 380, score: 81, clicks: 296, impressions: 6540, position: 9.8 },
  { path: "/clients", label: "Our Clients", title: "Our Clients | Brands That Trust Design House", description: "Leading brands across retail, QSR, FMCG and lifestyle that trust Design House.", h1: "Trusted By Premium Brands", words: 260, score: 76, clicks: 58, impressions: 1980, position: 16.4 },
  { path: "/testimonials", label: "Testimonials", title: "Client Testimonials | Design House India", description: "What our clients say about our interiors, kiosks and exhibition stalls.", h1: "Testimonials", words: 520, score: 83, clicks: 31, impressions: 940, position: 18.7 },
  { path: "/career", label: "Career", title: "Careers at Design House India | Current Openings", description: "Join Design House — openings for architectural designers, project managers, construction managers and BIM specialists.", h1: "Join Our Team", words: 690, score: 92, clicks: 248, impressions: 5260, position: 6.1 },
  { path: "/blogs", label: "Blogs", title: "Interior Design Blog | Ideas & Trends | Design House", description: "Interior design ideas, retail trends and project insights from the Design House team.", h1: "Our Blogs", words: 340, score: 85, clicks: 122, impressions: 4410, position: 11.3 },
  { path: "/downloads", label: "Downloads", title: "Downloads | Company Profile & Brochures | Design House", description: "Download the Design House company profile, e-brochures and newsletters.", h1: "Downloads", words: 160, score: 68, clicks: 12, impressions: 610, position: 22.9 },
  { path: "/contact", label: "Contact Us", title: "Contact Design House | Ghaziabad, Delhi & Mumbai Offices", description: "Get a free consultation. Head office in Ghaziabad with branches in Kalkaji (New Delhi) and Lower Parel (Mumbai).", h1: "Contact Us", words: 410, score: 89, clicks: 384, impressions: 6980, position: 5.8 },
  { path: "/privacy-policy", label: "Privacy Policy", title: "Privacy Policy | Design House India", description: "How Design House India Pvt. Ltd. collects, uses and protects your information.", h1: "Privacy Policy", words: 1460, score: 80, clicks: 6, impressions: 220, position: 31.2 },
  { path: "/terms-and-conditions", label: "Terms & Conditions", title: "Terms & Conditions | Design House India", description: "Terms that apply to using the Design House website and services.", h1: "Terms & Conditions", words: 1380, score: 80, clicks: 4, impressions: 190, position: 33.5 },
];

const idFor = (path: string) => (path === "/" ? "home" : path.replace(/^\//, ""));
const lenStatus = (len: number, min: number, max: number) => (len === 0 ? "missing" : len < min ? "too_short" : len > max ? "too_long" : "ok") as "missing" | "too_short" | "too_long" | "ok";

export function seoPageRow(seed: RouteSeed, index: number): SeoPageRow {
  const missingAlt = seed.score < 85 ? 3 : seed.score < 90 ? 1 : 0;
  const warnings = seed.score < 85 ? 3 : seed.score < 92 ? 1 : 0;
  return {
    id: idFor(seed.path),
    url: `${ORIGIN}${seed.path}`,
    path: seed.path,
    title: seed.title,
    titleLength: seed.title.length,
    titleStatus: lenStatus(seed.title.length, 30, 65),
    metaDescription: seed.description,
    metaDescriptionLength: seed.description.length,
    descriptionStatus: lenStatus(seed.description.length, 70, 160),
    httpStatus: 200,
    indexable: true,
    indexabilityReason: null,
    canonical: `${ORIGIN}${seed.path}`,
    canonicalStatus: "self",
    score: seed.score,
    issueCounts: { critical: 0, warning: warnings, notice: 2, total: warnings + 2 },
    issueCategories: warnings ? ["images", "content"] : ["content"],
    h1: [seed.h1],
    h1Status: "ok",
    hierarchyStatus: "ok",
    headingCounts: { h1: 1, h2: 4 + (index % 4), h3: 6 + (index % 5) },
    wordCount: seed.words,
    inLinks: seed.path === "/" ? 0 : 6 + (index % 9),
    outLinks: 28 + (index % 12),
    brokenLinks: seed.path === "/downloads" ? 1 : 0,
    depth: seed.path === "/" ? 0 : seed.path.split("/").length - 1,
    isOrphan: false,
    inSitemap: true,
    schemaTypes: seed.path === "/" ? ["Organization", "WebSite"] : ["BreadcrumbList"],
    schemaStatus: seed.path === "/" ? "valid" : "valid_with_breadcrumb",
    imageCount: 8 + (index % 14),
    imagesMissingAlt: missingAlt,
    responseTimeMs: 280 + (index * 37) % 260,
    keywordStatus: "ok",
    openGraphStatus: "valid",
    twitterStatus: index % 4 === 3 ? "incomplete" : "valid",
    consoleErrorCount: 0,
    failedRequestCount: 0,
    renderBlockingCount: 2,
    cdnStatus: "likely",
    performance: { score: 74 + (index % 20), lcpMs: 2100 + (index * 90) % 900, cls: 0.03, isFieldData: false, fetchedAt: daysAgo(1, 4) },
    search: { clicks: seed.clicks, impressions: seed.impressions, ctr: +((seed.clicks / seed.impressions) * 100).toFixed(1), position: seed.position, updatedAt: daysAgo(1, 4) },
    analytics: { views: seed.clicks * 4, users: seed.clicks * 3, engagementRate: 0.58 },
    lastCrawledAt: daysAgo(1, 3),
  };
}

export const SEO_PAGE_ROWS: SeoPageRow[] = SEO_ROUTES.map(seoPageRow);

export function seoPagesResponse(): SeoPagesResponse {
  return { pages: SEO_PAGE_ROWS, message: null, meta: { page: 1, limit: SEO_PAGE_ROWS.length, total: SEO_PAGE_ROWS.length, totalPages: 1 } };
}

const avg = (values: number[]) => Math.round(values.reduce((a, b) => a + b, 0) / values.length);

export const SEO_TOP_ISSUES = [
  { ruleId: "image-alt-missing", severity: "warning" as const, category: "images", title: "Images missing ALT text", affectedPages: 6 },
  { ruleId: "thin-content", severity: "warning" as const, category: "content", title: "Thin content (under 300 words)", affectedPages: 3 },
  { ruleId: "twitter-card-incomplete", severity: "notice" as const, category: "social", title: "Twitter card tags incomplete", affectedPages: 5 },
  { ruleId: "broken-internal-link", severity: "warning" as const, category: "links", title: "Broken internal link", affectedPages: 1 },
  { ruleId: "render-blocking", severity: "notice" as const, category: "performance", title: "Render-blocking stylesheets", affectedPages: 22 },
];

export function seoOverview(): SeoOverview {
  const scores = { overall: 88, technical: 92, onPage: 90, content: 84, performance: 81, visibility: 86 };
  return {
    site: { id: "design-house", url: ORIGIN, label: "Design House", type: "production", crawlSettings: { maxPages: 200 }, schedule: { frequency: "weekly" }, lastCrawlAt: daysAgo(1, 3), lastScore: scores.overall, searchConsoleConnected: true, analyticsConnected: true },
    hasData: true,
    runningCrawl: null,
    crawl: { id: "crawl-42", status: "completed", trigger: "schedule", startedAt: daysAgo(1, 3), completedAt: daysAgo(1, 3, 6), durationMs: 352_000, stats: { pages: SEO_PAGE_ROWS.length, links: 912, images: 286 }, robotsFound: true, sitemapFound: true, sitemapUrlCount: 71 },
    scores,
    previousScores: { overall: 85, technical: 90, onPage: 88, content: 81, performance: 78, visibility: 83 },
    counts: { pages: SEO_PAGE_ROWS.length, indexable: SEO_PAGE_ROWS.length, critical: 0, warning: 11, notice: 44, brokenLinks: 1 },
    performance: { score: 82, lcpMs: 2400, clsScore: 0.04, inpMs: 168, fieldDataAvailable: false },
    search: { available: false, message: "Search metrics are shown on the Dashboard." },
    analytics: { available: false, message: "Analytics metrics are shown on the Dashboard." },
    alerts: [{ id: "seo-al-1", type: "broken_link", severity: "warning", title: "Broken link on /downloads", message: "The brochure link /downloads/ebrochures/retail-2024.pdf returns 404.", createdAt: daysAgo(1, 4) }],
    topIssues: SEO_TOP_ISSUES,
    history: Array.from({ length: 8 }, (_, i) => ({
      capturedAt: daysAgo((7 - i) * 7, 3),
      scores: { overall: 80 + i, technical: 86 + i / 2, onPage: 84 + i / 2, content: 78 + i, performance: 75 + i, visibility: 80 + i },
      counts: { warning: 18 - i, notice: 50 - i },
      performance: { score: 74 + i, lcpMs: 2900 - i * 60, clsScore: 0.05 },
      search: { available: true, clicks: 6400 + i * 280, impressions: 168000 + i * 6000, position: 17.2 - i * 0.3 },
    })),
  };
}

export function seoPageDetail(id: string): SeoPageDetail | null {
  const index = SEO_PAGE_ROWS.findIndex((p) => p.id === id || p.path === id || p.path === `/${id}`);
  const row = SEO_PAGE_ROWS[index];
  const seed = SEO_ROUTES[index];
  if (!row || !seed) return null;
  return {
    page: {
      ...row,
      metaRobots: "index, follow",
      canonicalNormalized: row.canonical,
      canonicalCount: 1,
      ogTitle: seed.title,
      ogDescription: seed.description,
      ogImage: `${ORIGIN}/og-banner.webp`,
      ogType: "website",
      ogUrl: row.url,
      twitterCard: "summary_large_image",
      twitterTitle: row.twitterStatus === "valid" ? seed.title : null,
      twitterDescription: row.twitterStatus === "valid" ? seed.description : null,
      twitterImage: row.twitterStatus === "valid" ? `${ORIGIN}/og-banner.webp` : null,
      metaKeywords: `${seed.label.toLowerCase()}, design house, interior design delhi`,
      metaKeywordCount: 3,
      socialStatus: { openGraph: "valid", twitter: row.twitterStatus },
      keywordAnalysis: { available: true, targets: [{ keyword: seed.label.toLowerCase(), source: "title", presentInTitle: true, presentInMetaDescription: true, presentInH1: true, presentInHeadings: true, presentInOpeningContent: true, presentInImageAlt: row.imagesMissingAlt === 0, presentInInternalAnchor: true, exactMentions: 6, totalWordCount: seed.words, densityPercent: +((6 / seed.words) * 100).toFixed(2) }] },
      browserHealth: { consoleErrors: [], consoleWarnings: [], jsExceptions: [], failedRequests: [] },
      cdn: { status: "likely", provider: "Cloudflare", evidence: ["cf-ray header"], cacheControl: "public, max-age=0, must-revalidate", server: "cloudflare" },
      lang: "en",
      viewport: "width=device-width, initial-scale=1",
      hreflang: [],
      headingSequence: [{ level: 1, text: seed.h1 }, { level: 2, text: "Why Choose Design House" }, { level: 2, text: "Our Process" }],
      headingIssues: [],
      h2: ["Why Choose Design House", "Our Process", "Featured Projects"],
      h3: ["Initial Consultation", "Design & Planning", "Implementation", "Project Handover"],
      images: Array.from({ length: Math.min(6, row.imageCount) }, (_, i) => ({ src: `${ORIGIN}/images/${seed.label.toLowerCase().replace(/\s+/g, "-")}-${i + 1}.webp`, alt: i < row.imagesMissingAlt ? null : `${seed.label} project ${i + 1}`, hasAlt: i >= row.imagesMissingAlt, isDecorative: false, loading: "lazy", width: 1200, height: 800 })),
      imagesEmptyAlt: 0,
      imagesLazyLoaded: row.imageCount - 1,
      imagesWithoutDimensions: 0,
      schemas: [{ types: row.schemaTypes, valid: true, errors: [], warnings: [] }],
      breadcrumbIssues: [],
      scoreBreakdown: [{ category: "Technical", score: 92, weight: 0.3 }, { category: "On-page", score: row.score ?? 85, weight: 0.3 }, { category: "Content", score: 84, weight: 0.2 }, { category: "Performance", score: row.performance.score ?? 80, weight: 0.2 }],
      contentType: "text/html; charset=utf-8",
      finalUrl: row.url,
      redirected: false,
      fetchError: null,
      renderedWithJs: true,
      internalLinkCount: row.outLinks - 4,
      externalLinkCount: 4,
      nofollowLinkCount: 0,
      mixedContentLinkCount: 0,
    },
    issues: row.imagesMissingAlt
      ? [{ id: `iss-${id}-alt`, ruleId: "image-alt-missing", category: "images", severity: "warning", title: "Images missing ALT text", detail: `${row.imagesMissingAlt} images have no alt attribute.`, evidence: {}, url: row.url, scope: "page", firstSeenAt: daysAgo(20), lastSeenAt: daysAgo(1) }]
      : [],
    links: { incoming: [{ source: `${ORIGIN}/`, anchorText: seed.label, isNofollow: false }], outgoing: [{ target: "/contact", normalizedTarget: `${ORIGIN}/contact`, anchorText: "Get Free Consultation", rel: null, isInternal: true, isNofollow: false, httpStatus: 200, statusClass: "2xx", isBroken: false, redirectsTo: null, redirectHops: 0 }], brokenOutgoing: row.brokenLinks, redirectingOutgoing: 0 },
    redirectChain: null,
    performance: { audits: [], labNote: "Lab data from the latest PageSpeed run.", fieldNote: "Field data needs more Chrome UX Report traffic." },
    search: { available: true, rangeStart: daysAgo(28), rangeEnd: daysAgo(1), metric: "web", totals: row.search ? { clicks: row.search.clicks, impressions: row.search.impressions, ctr: row.search.ctr, position: row.search.position } : null, topQueries: [{ query: `${seed.label.toLowerCase()} design`, clicks: Math.round(seed.clicks * 0.4), impressions: Math.round(seed.impressions * 0.3), ctr: 4.2, position: seed.position }] },
    history: Array.from({ length: 6 }, (_, i) => ({ capturedAt: daysAgo((5 - i) * 7, 3), score: (row.score ?? 85) - 5 + i, issueCounts: row.issueCounts, wordCount: seed.words, httpStatus: 200, performanceScore: 72 + i * 2, lcpMs: 2800 - i * 60, cls: 0.04, clicks: Math.round(seed.clicks * (0.7 + i * 0.06)), impressions: Math.round(seed.impressions * (0.7 + i * 0.06)), position: seed.position + 2 - i * 0.4 })),
    recommendation: null,
  };
}

function routeSummary(row: SeoPageRow, seed: RouteSeed): RouteSummary {
  return {
    id: row.id,
    path: row.path,
    label: seed.label,
    url: row.url,
    title: row.title,
    titleLength: row.titleLength,
    metaDescription: row.metaDescription,
    metaDescriptionLength: row.metaDescriptionLength,
    httpStatus: 200,
    ok: true,
    indexable: true,
    canonical: row.canonical,
    canonicalStatus: "self",
    score: row.score ?? 85,
    words: seed.words,
    internalLinks: row.outLinks - 4,
    externalLinks: 4,
    h1Count: 1,
    h2Count: row.headingCounts.h2 ?? 4,
    imageCount: row.imageCount,
    imagesMissingAlt: row.imagesMissingAlt,
    domNodes: 1150 + seed.words / 2,
    htmlKb: 48,
    ttfbMs: row.responseTimeMs,
    loadMs: 1800 + (row.responseTimeMs ?? 300),
    failedChecks: row.issueCounts.critical,
    warningChecks: row.issueCounts.warning,
    passedChecks: 38 - row.issueCounts.warning,
    searchConsole: { available: true, clicks: seed.clicks, impressions: seed.impressions, ctr: row.search?.ctr ?? null, position: seed.position },
  };
}

export const ROUTE_SUMMARIES: RouteSummary[] = SEO_PAGE_ROWS.map((row, i) => routeSummary(row, SEO_ROUTES[i]!));

export function checkupReport(route: string): SeoCheckupReportData {
  const site = !route || route === "site" || route === "all";
  const summary = ROUTE_SUMMARIES.find((r) => r.path === route || r.id === route || `/${r.id}` === route) ?? ROUTE_SUMMARIES[0]!;
  const score = site ? 88 : summary.score;
  const issues: CheckupIssue[] = [
    { priority: "MEDIUM", title: "Add ALT text to project images", detail: "Some portfolio images have no alt attribute, which hurts image search and accessibility.", fix: "Describe each image, e.g. “Retail store interior by Design House, Gurugram”.", status: "warning", route: summary.path, group: "Images" },
    { priority: "LOW", title: "Complete Twitter card tags", detail: "twitter:title and twitter:description are missing on a few pages.", fix: "Reuse the Open Graph title and description for Twitter cards.", status: "warning", route: summary.path, group: "Social" },
    { priority: "HIGH", title: "Fix broken brochure link on /downloads", detail: "/downloads/ebrochures/retail-2024.pdf returns 404.", fix: "Upload the brochure again or remove the link.", status: "failed", route: "/downloads", group: "Links" },
  ];
  const groups: CheckupGroup[] = [
    {
      id: "meta",
      name: "Meta Tags",
      score: 96,
      tests: [
        { id: "title", name: "Title tag", status: "passed" as const, level: "page" as const, source: "crawl" as const, summary: `${summary.titleLength} characters — within 30–65.`, meta: [{ label: "Title", value: summary.title ?? "" }] },
        { id: "description", name: "Meta description", status: "passed" as const, level: "page" as const, source: "crawl" as const, summary: `${summary.metaDescriptionLength} characters — within 70–160.`, meta: [{ label: "Description", value: summary.metaDescription ?? "" }] },
        { id: "canonical", name: "Canonical URL", status: "passed" as const, level: "page" as const, source: "crawl" as const, summary: "Self-referencing canonical present." },
      ],
    },
    {
      id: "content",
      name: "Content & Headings",
      score: 88,
      tests: [
        { id: "h1", name: "Single H1", status: "passed" as const, level: "page" as const, source: "crawl" as const, summary: "Exactly one H1 found." },
        { id: "words", name: "Content length", status: summary.words < 300 ? ("warning" as const) : ("passed" as const), level: "page" as const, source: "crawl" as const, summary: `${summary.words} words on the page.` },
        { id: "alt", name: "Image ALT text", status: summary.imagesMissingAlt ? ("warning" as const) : ("passed" as const), level: "page" as const, source: "crawl" as const, summary: `${summary.imagesMissingAlt} of ${summary.imageCount} images missing ALT text.`, fix: "Add descriptive alt text to every content image." },
      ],
    },
    {
      id: "technical",
      name: "Technical",
      score: 93,
      tests: [
        { id: "https", name: "HTTPS & SSL", status: "passed" as const, level: "site" as const, source: "measured" as const, summary: "Valid certificate (Let's Encrypt), 54 days remaining." },
        { id: "robots", name: "robots.txt", status: "passed" as const, level: "site" as const, source: "measured" as const, summary: "robots.txt found and allows crawling." },
        { id: "sitemap", name: "XML sitemap", status: "passed" as const, level: "site" as const, source: "measured" as const, summary: "sitemap.xml lists 71 URLs." },
        { id: "ttfb", name: "Server response time", status: "passed" as const, level: "page" as const, source: "measured" as const, summary: `${summary.ttfbMs} ms time to first byte.` },
      ],
    },
  ];
  const tests = groups.flatMap((g) => g.tests);
  const failed = tests.filter((t) => t.status === "failed").length;
  const warnings = tests.filter((t) => t.status === "warning").length;
  return {
    scope: site ? "site" : "page",
    route: site ? "site" : summary.path,
    url: site ? ORIGIN : summary.url,
    pageTitle: site ? "Design House India | Turnkey Interior & Exhibition Solutions" : summary.title ?? summary.label,
    pageDesc: site ? SEO_ROUTES[0]!.description : summary.metaDescription,
    titleLen: summary.titleLength,
    descLen: summary.metaDescriptionLength,
    seoScore: score,
    aiScore: score - 4,
    scoreSource: "derived",
    aiSource: "derived",
    telemetrySource: "measured",
    failedCount: failed,
    warningCount: warnings,
    passedCount: tests.length - failed - warnings,
    totalCount: tests.length,
    summary: site
      ? "designhouse.co.in is in good SEO health. Main gaps: missing ALT text on some portfolio images, incomplete Twitter cards and one broken brochure link."
      : `${summary.label} is well optimised. Fix the items below to push the score above 95.`,
    categories: groups.map((g) => ({ name: g.name, score: g.score, failed: g.tests.filter((t) => t.status === "failed").length, warnings: g.tests.filter((t) => t.status === "warning").length, passed: g.tests.filter((t) => t.status === "passed").length })),
    inputs: [
      { label: "Website", value: ORIGIN, source: "measured" },
      { label: "Pages crawled", value: String(ROUTE_SUMMARIES.length), source: "crawl" },
      { label: "Search Console", value: "Connected", source: "measured", status: "passed" },
    ],
    issues,
    groups,
    generatedAt: daysAgo(1, 3),
    pageSpeed: null,
    routeSummaries: ROUTE_SUMMARIES,
    site: { origin: ORIGIN, routesCrawled: ROUTE_SUMMARIES.length, avgWords: avg(ROUTE_SUMMARIES.map((r) => r.words)), avgTtfbMs: avg(ROUTE_SUMMARIES.map((r) => r.ttfbMs ?? 300)), searchConsoleConfigured: true, llmKeysConfigured: [] },
  };
}

export const BROKEN_LINKS: SeoBrokenLink[] = [
  { target: "/downloads/ebrochures/retail-2024.pdf", targetUrl: `${ORIGIN}/downloads/ebrochures/retail-2024.pdf`, httpStatus: 404, statusClass: "4xx", isInternal: true, error: null, firstSeenAt: daysAgo(6), lastCheckedAt: daysAgo(1, 3), affectedPages: 1, sources: [{ sourceUrl: `${ORIGIN}/downloads`, anchorText: "Retail Display Brochure 2024" }] },
];

export const SEO_INSIGHTS: SeoInsights = {
  available: true,
  message: null,
  rangeStart: daysAgo(28),
  rangeEnd: daysAgo(1),
  windowDays: 28,
  cannibalization: [
    { query: "retail interior design", totalClicks: 214, totalImpressions: 6120, pages: [{ url: `${ORIGIN}/services/retail-interior`, title: "Retail Interior Designers in Delhi NCR", clicks: 168, impressions: 4210, ctr: 4.0, position: 5.2, wordCount: 1120 }, { url: `${ORIGIN}/services`, title: "Interior Design & Retail Display Services", clicks: 46, impressions: 1910, ctr: 2.4, position: 9.8, wordCount: 980 }] },
  ],
  contentGaps: [
    { query: "mall kiosk price", clicks: 22, impressions: 2140, ctr: 1.0, position: 12.4, bestPage: `${ORIGIN}/services/retail-kiosk`, bestPageTitle: "Retail Kiosk Manufacturer", reason: "Page has no pricing section for kiosks." },
    { query: "exhibition stall cost per sqm", clicks: 18, impressions: 1880, ctr: 1.0, position: 13.1, bestPage: `${ORIGIN}/services/exhibitions`, bestPageTitle: "Exhibition Stall Design Company", reason: "Add a cost guide or FAQ answering per-sqm pricing." },
  ],
  risingQueries: [{ query: "exhibition stall design company", clicks: 538, clicksChange: 124 }, { query: "retail kiosk manufacturer", clicks: 344, clicksChange: 61 }],
  fallingQueries: [{ query: "office interior noida", clicks: 112, clicksChange: -38 }],
  highImpressionLowCtr: [{ query: "interior designer near me", impressions: 18420, clicks: 92, ctr: 0.5, position: 19.6, bestPage: `${ORIGIN}/` }],
  strikingDistance: [{ query: "restaurant interior designer delhi", position: 11.2, impressions: 3120 }, { query: "shop in shop fabrication", position: 10.6, impressions: 2210 }],
};

export const COMPETITORS: SeoCompetitor[] = [
  { id: "cmp-1", url: "https://www.example-interiors.in", label: "Competitor A (interiors)", isActive: true, lastCrawlAt: daysAgo(5), lastScore: 79 },
  { id: "cmp-2", url: "https://www.example-exhibits.in", label: "Competitor B (exhibitions)", isActive: true, lastCrawlAt: daysAgo(5), lastScore: 74 },
];

export const COMPETITOR_COMPARISON: SeoCompetitorComparison = {
  primary: { label: "Design House", url: ORIGIN, observed: { score: 88, pagesCrawled: ROUTE_SUMMARIES.length, averageWordCount: avg(ROUTE_SUMMARIES.map((r) => r.words)), averageTtfbMs: 330, imagesMissingAlt: 14 } },
  competitors: COMPETITORS.map((c, i) => ({ siteId: c.id, label: c.label, url: c.url, observed: { score: c.lastScore, pagesCrawled: 30 + i * 12, averageWordCount: 640 - i * 80, averageTtfbMs: 520 + i * 90, imagesMissingAlt: 40 + i * 15 } })),
};

const BACKLINK_SOURCES = [
  { source: "https://www.justdial.com/Delhi/Design-House", anchor: "Design House India", da: 78 },
  { source: "https://www.indiamart.com/designhouse-india/", anchor: "retail display manufacturer", da: 74 },
  { source: "https://www.houzz.in/pro/designhouseindia", anchor: "Design House", da: 81 },
  { source: "https://www.sulekha.com/interior-designers/delhi", anchor: "interior designers delhi", da: 66 },
  { source: "https://www.tradeindia.com/designhouse/", anchor: "kiosk manufacturer", da: 69 },
  { source: "https://medium.com/@retailtrends/store-design-2026", anchor: "turnkey retail interiors", da: 92 },
  { source: "https://www.linkedin.com/pulse/exhibition-stall-trends", anchor: "exhibition stall design", da: 98 },
  { source: "https://www.archdaily.com/", anchor: "Design House", da: 89 },
];

export const BACKLINKS: BacklinkItem[] = BACKLINK_SOURCES.map((b, i) => ({
  _id: `bl-${i + 1}`,
  targetUrl: i % 3 === 1 ? `${ORIGIN}/services/retail-kiosk` : `${ORIGIN}/`,
  sourceUrl: b.source,
  anchorText: b.anchor,
  type: i % 4 === 3 ? "nofollow" : "dofollow",
  daScore: b.da,
  status: i === 7 ? "lost" : "active",
  notes: i === 0 ? "Business listing" : undefined,
  createdBy: "Karan Mehta",
  createdAt: daysAgo(90 - i * 9),
  updatedAt: daysAgo(10 - i),
}));

export const SEO_RECORDS: SeoRecord[] = SEO_ROUTES.map((r) => ({
  _id: `seo-${idFor(r.path)}`,
  page: idFor(r.path),
  metaTitle: r.title,
  metaDescription: r.description,
  metaKeywords: `${r.label.toLowerCase()}, design house, interior design`,
  canonicalUrl: `${ORIGIN}${r.path}`,
  ogTitle: r.title,
  ogDescription: r.description,
  ogImage: `${ORIGIN}/og-banner.webp`,
  h1Tag: r.h1,
  breadcrumbName: r.label,
  robotsIndex: true,
  robotsFollow: true,
  isActive: true,
  updatedBy: "Karan Mehta",
  createdAt: daysAgo(120),
  updatedAt: daysAgo(4),
}));

export const ADVANCED_SEO = {
  headerScripts: "",
  footerScripts: "",
  seoFiles: [
    { name: "robots.txt", url: `${ORIGIN}/robots.txt`, size: "312 B", uploadedAt: daysAgo(40) },
    { name: "sitemap.xml", url: `${ORIGIN}/sitemap.xml`, size: "9.4 KB", uploadedAt: daysAgo(2) },
    { name: "llms.txt", url: `${ORIGIN}/llms.txt`, size: "2.1 KB", uploadedAt: daysAgo(20) },
  ],
  ga4MeasurementId: "",
  gtmContainerId: "",
  googleSearchConsoleVerification: "",
  socialLinks: { facebook: "", instagram: "", twitter: "", youtube: "https://www.youtube.com/@designhouseindia", linkedin: "" },
};

export const REDIRECTS: Redirect[] = [
  { _id: "rd-1", source: "/projects-list", destination: "/portfolio", permanent: true, isActive: true, createdAt: daysAgo(60), updatedAt: daysAgo(60) },
  { _id: "rd-2", source: "/contact-list", destination: "/contact", permanent: true, isActive: true, createdAt: daysAgo(60), updatedAt: daysAgo(60) },
  { _id: "rd-3", source: "/careers", destination: "/career", permanent: true, isActive: true, createdAt: daysAgo(30), updatedAt: daysAgo(30) },
  { _id: "rd-4", source: "/services/kiosk", destination: "/services/retail-kiosk", permanent: true, isActive: true, createdAt: daysAgo(25), updatedAt: daysAgo(25) },
  { _id: "rd-5", source: "/blog", destination: "/blogs", permanent: true, isActive: false, createdAt: daysAgo(12), updatedAt: daysAgo(12) },
];
