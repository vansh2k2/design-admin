import {
  capScore,
  SITE_URL,
  type CheckupCategory,
  type CheckupGroup,
  type CheckupIssue,
  type CheckupSource,
  type CheckupTest,
  type ReportInput,
  type RouteSummary,
  type SeoCheckupReportData,
} from "./seoCheckupData";
import type { SeoIssue, SeoOverview, SeoPageDetail, SeoPageRow, SeoSeverity } from "./seoAuditApi";

const CRAWL: CheckupSource = "crawl";
const DERIVED: CheckupSource = "derived";
const MEASURED: CheckupSource = "measured";
const NOT_CONNECTED: CheckupSource = "not_connected";

function test(
  id: string,
  name: string,
  status: CheckupTest["status"],
  extra: Partial<CheckupTest> = {},
): CheckupTest {
  return { id, name, status, source: CRAWL, ...extra };
}

function priorityOf(severity: SeoSeverity): CheckupIssue["priority"] {
  if (severity === "critical") return "HIGH";
  if (severity === "warning") return "MEDIUM";
  return "LOW";
}

function toCheckupIssue(issue: SeoIssue): CheckupIssue {
  const evidence = Object.entries(issue.evidence ?? {})
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .slice(0, 6)
    .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`);
  return {
    priority: priorityOf(issue.severity),
    title: issue.title,
    detail: issue.detail,
    status: issue.severity === "critical" ? "failed" : issue.severity === "warning" ? "warning" : "passed",
    route: issue.url ?? undefined,
    group: issue.category,
    evidence: evidence.length ? evidence : undefined,
    collapsible: true,
  };
}

function routeSummaryFromRow(row: SeoPageRow): RouteSummary {
  const ok = row.httpStatus !== null && row.httpStatus >= 200 && row.httpStatus < 400;
  const failedChecks = row.issueCounts?.critical ?? 0;
  const warningChecks = row.issueCounts?.warning ?? 0;
  const passedChecks = Math.max(0, 12 - failedChecks - warningChecks);
  return {
    id: row.id,
    path: row.path,
    label: row.path === "/" || row.path === "" ? "Home Page" : (row.path.split("/").filter(Boolean).pop() || row.path).replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    url: row.url,
    title: row.title,
    titleLength: row.titleLength ?? 0,
    metaDescription: row.metaDescription,
    metaDescriptionLength: row.metaDescriptionLength ?? 0,
    httpStatus: row.httpStatus,
    ok,
    indexable: row.indexable,
    canonical: row.canonical,
    canonicalStatus: row.canonicalStatus === "unknown" ? "missing" : row.canonicalStatus,
    score: row.score ?? 0,
    words: row.wordCount ?? 0,
    internalLinks: row.inLinks ?? 0,
    externalLinks: row.outLinks ?? 0,
    h1Count: Array.isArray(row.h1) ? row.h1.length : 0,
    h2Count: row.headingCounts?.h2 ?? 0,
    imageCount: row.imageCount ?? 0,
    imagesMissingAlt: row.imagesMissingAlt ?? 0,
    domNodes: null,
    htmlKb: null,
    ttfbMs: row.responseTimeMs,
    loadMs: null,
    failedChecks,
    warningChecks,
    passedChecks,
    searchConsole: {
      available: Boolean(row.search),
      clicks: row.search?.clicks ?? null,
      impressions: row.search?.impressions ?? null,
      ctr: row.search?.ctr ?? null,
      position: row.search?.position ?? null,
    },
  };
}

function buildGroups(detail: SeoPageDetail): CheckupGroup[] {
  const p = detail.page;
  const groups: CheckupGroup[] = [];

  // 1. Title & Meta
  {
    const tests: CheckupTest[] = [
      test("title-status", "Page title tag present & length", p.titleStatus === "ok" ? "passed" : p.titleStatus === "missing" ? "failed" : "warning", {
        level: "page",
        summary:
          p.titleStatus === "missing"
            ? "No <title> tag found on this route."
            : p.titleStatus === "too_short"
              ? `Title is ${p.titleLength} characters — shorter than the ~30 char minimum.`
              : p.titleStatus === "too_long"
                ? `Title is ${p.titleLength} characters — longer than the ~60 char limit (SERP truncation risk).`
                : `Title length ${p.titleLength} characters is within the 30–60 character range.`,
        stats: [{ label: "Title length", value: `${p.titleLength} chars`, tone: p.titleStatus === "ok" ? "green" : "amber" }],
        meta: p.title ? [{ label: "Title", value: p.title, mono: true }] : undefined,
        fix: p.titleStatus === "missing" ? "Add a unique, keyword-relevant <title> (30–60 chars) to this page." : p.titleStatus === "too_short" ? "Expand the title with the primary keyword and brand (aim 30–60 chars)." : p.titleStatus === "too_long" ? "Shorten the title to under 60 characters, keeping the primary keyword first." : undefined,
      }),
      test("meta-desc", "Meta description present & length", p.descriptionStatus === "ok" ? "passed" : p.descriptionStatus === "missing" ? "failed" : "warning", {
        level: "page",
        summary:
          p.descriptionStatus === "missing"
            ? "No meta description found — search engines will auto-generate a snippet."
            : `Meta description length ${p.metaDescriptionLength} characters (${p.descriptionStatus.replace("_", " ")}).`,
        stats: [{ label: "Description length", value: `${p.metaDescriptionLength} chars`, tone: p.descriptionStatus === "ok" ? "green" : "amber" }],
        meta: p.metaDescription ? [{ label: "Description", value: p.metaDescription }] : undefined,
        fix: p.descriptionStatus === "missing" ? "Write a 120–160 character meta description with a clear call to action." : p.descriptionStatus === "too_short" ? "Expand the meta description to 120–160 characters." : p.descriptionStatus === "too_long" ? "Trim the meta description to under 160 characters." : undefined,
      }),
      test("meta-robots", "Meta robots / indexability", p.indexable ? "passed" : "failed", {
        level: "page",
        summary: p.indexable ? `Indexable: ${p.indexabilityReason || "allowed by robots directives"}.` : `Not indexable: ${p.indexabilityReason || "blocked by robots directives"}.`,
        meta: [{ label: "meta robots", value: p.metaRobots ?? "(none)", mono: true }],
        fix: p.indexable ? undefined : "Remove noindex directives or fix the blocking rule so this page can appear in search.",
      }),
    ];
    groups.push({ id: "meta", name: "Title & Meta Description", note: "Crawled from live HTML of this route", tests });
  }

  // 2. Headings
  {
    const h1Count = Array.isArray(p.h1) ? p.h1.length : 0;
    const hierarchyIssues = p.headingIssues ?? [];
    const tests: CheckupTest[] = [
      test("h1-count", "Exactly one H1 per page", h1Count === 1 ? "passed" : "failed", {
        level: "page",
        summary: h1Count === 0 ? "No H1 heading found." : h1Count === 1 ? "One H1 present." : `Found ${h1Count} H1 headings — multiple H1s dilute topical focus.`,
        stats: [{ label: "H1 count", value: String(h1Count), tone: h1Count === 1 ? "green" : "red" }],
        meta: (p.h1 ?? []).slice(0, 3).map((t, i) => ({ label: `H1 #${i + 1}`, value: t })),
        fix: h1Count === 0 ? "Add a single H1 containing the page's primary keyword." : h1Count > 1 ? "Demote extra H1s to H2 so only one H1 remains." : undefined,
      }),
      test("heading-hierarchy", "Heading hierarchy (H1→H2→H3)", hierarchyIssues.length === 0 ? "passed" : "warning", {
        level: "page",
        summary: hierarchyIssues.length === 0 ? "Heading levels descend without gaps." : `${hierarchyIssues.length} hierarchy issue(s) detected.`,
        lists: hierarchyIssues.length ? [{ title: "Hierarchy issues", items: hierarchyIssues }] : undefined,
        fix: hierarchyIssues.length ? "Fix skipped heading levels (e.g. H1 → H3) so the outline is sequential." : undefined,
      }),
    ];
    groups.push({ id: "headings", name: "Headings & Content Structure", tests });
  }

  // 3. Content
  {
    const words = p.wordCount ?? 0;
    const ka = p.keywordAnalysis;
    const targetCount = ka?.targets?.length ?? 0;
    const presentTargets = ka?.targets?.filter((t) => t.presentInTitle || t.presentInH1 || t.presentInOpeningContent).length ?? 0;
    const tests: CheckupTest[] = [
      test("word-count", "Content length", words >= 300 ? "passed" : words >= 150 ? "warning" : "failed", {
        level: "page",
        summary: `${words} words on this route (recommended ≥300 for ranking pages).`,
        stats: [{ label: "Words", value: String(words), tone: words >= 300 ? "green" : words >= 150 ? "amber" : "red" }],
        fix: words < 300 ? "Expand body copy with useful, keyword-aware content (aim 300+ words for key pages)." : undefined,
      }),
      test("keyword-coverage", "Target keyword coverage", targetCount === 0 ? "warning" : presentTargets > 0 ? "passed" : "warning", {
        level: "page",
        summary:
          targetCount === 0
            ? "No target keywords detected for this route — set focus keywords in SEO settings."
            : `${presentTargets}/${targetCount} target keywords present in title/H1/opening content.`,
        source: targetCount === 0 ? NOT_CONNECTED : CRAWL,
        stats: [{ label: "Targets present", value: `${presentTargets}/${targetCount}`, tone: presentTargets > 0 ? "green" : "amber" }],
        lists: targetCount
          ? [
              {
                title: "Keyword presence",
                items: (ka?.targets ?? []).map(
                  (t) =>
                    `${t.keyword} — title:${t.presentInTitle ? "✓" : "✗"} h1:${t.presentInH1 ? "✓" : "✗"} opening:${t.presentInOpeningContent ? "✓" : "✗"} density:${t.densityPercent}%`,
                ),
              },
            ]
          : undefined,
        fix: targetCount === 0 ? "Define focus keywords so coverage can be measured." : presentTargets === 0 ? "Work the primary keyword into the title, H1 and opening paragraph." : undefined,
      }),
    ];
    groups.push({ id: "content", name: "Content Quality & Keywords", tests });
  }

  // 4. Images
  {
    const missing = p.imagesMissingAlt ?? 0;
    const total = p.imageCount ?? 0;
    const tests: CheckupTest[] = [
      test("img-alt", "Image alt text coverage", missing === 0 ? "passed" : missing <= 2 ? "warning" : "failed", {
        level: "page",
        summary: total === 0 ? "No images found on this route." : missing === 0 ? `All ${total} images have alt text (or are decorative).` : `${missing} of ${total} images missing alt text.`,
        stats: [
          { label: "Images", value: String(total), tone: "blue" },
          { label: "Missing alt", value: String(missing), tone: missing === 0 ? "green" : "red" },
        ],
        fix: missing > 0 ? "Add descriptive alt text to informative images; keep alt=\"\" only for decorative images." : undefined,
      }),
      test("img-dimensions", "Image dimensions / lazy loading", (p.imagesWithoutDimensions ?? 0) === 0 ? "passed" : "warning", {
        level: "page",
        summary: `${p.imagesWithoutDimensions ?? 0} image(s) without width/height, ${p.imagesLazyLoaded ?? 0} lazy-loaded.`,
        fix: (p.imagesWithoutDimensions ?? 0) > 0 ? "Add explicit width/height attributes to prevent layout shift (CLS)." : undefined,
      }),
    ];
    groups.push({ id: "images", name: "Images & Media", tests });
  }

  // 5. Links
  {
    const broken = detail.links?.brokenOutgoing ?? p.brokenLinks ?? 0;
    const inLinks = detail.page.internalLinkCount ?? p.inLinks ?? 0;
    const outLinks = detail.page.externalLinkCount ?? p.outLinks ?? 0;
    const mixed = detail.page.mixedContentLinkCount ?? 0;
    const tests: CheckupTest[] = [
      test("broken-links", "No broken outbound links", broken === 0 ? "passed" : "failed", {
        level: "page",
        summary: broken === 0 ? "No broken outgoing links detected." : `${broken} broken outgoing link(s) found.`,
        stats: [{ label: "Broken links", value: String(broken), tone: broken === 0 ? "green" : "red" }],
        lists: broken
          ? [
              {
                title: "Broken targets",
                items: (detail.links?.outgoing ?? []).filter((l) => l.isBroken).slice(0, 8).map((l) => `${l.target} → ${l.httpStatus ?? "error"}`),
              },
            ]
          : undefined,
        fix: broken > 0 ? "Fix or remove broken links (404s) — update the target URL or drop the link." : undefined,
      }),
      test("internal-links", "Internal link structure", inLinks > 0 ? "passed" : "warning", {
        level: "page",
        summary: `${inLinks} internal · ${outLinks} external links.`,
        stats: [
          { label: "Internal", value: String(inLinks), tone: inLinks > 0 ? "green" : "amber" },
          { label: "External", value: String(outLinks), tone: "blue" },
        ],
        fix: inLinks === 0 ? "Add internal links from related pages to this route." : undefined,
      }),
      test("mixed-content", "No mixed-content links", mixed === 0 ? "passed" : "failed", {
        level: "page",
        summary: mixed === 0 ? "All resources use HTTPS." : `${mixed} link(s) load over insecure HTTP.`,
        fix: mixed > 0 ? "Upgrade remaining http:// links to https://." : undefined,
      }),
    ];
    groups.push({ id: "links", name: "Links & Connectivity", tests });
  }

  // 6. Social
  {
    const og = p.openGraphStatus;
    const tw = p.twitterStatus;
    const tests: CheckupTest[] = [
      test("open-graph", "Open Graph tags", og === "valid" ? "passed" : og === "incomplete" ? "warning" : "failed", {
        level: "page",
        summary: og === "valid" ? "Complete Open Graph set detected." : og === "incomplete" ? "Some Open Graph tags are missing." : "No Open Graph tags found.",
        meta: [
          { label: "og:title", value: p.ogTitle ?? "(missing)" },
          { label: "og:description", value: p.ogDescription ?? "(missing)" },
          { label: "og:image", value: p.ogImage ?? "(missing)", mono: true },
        ],
        fix: og !== "valid" ? "Add og:title, og:description, og:image and og:url tags for rich social shares." : undefined,
      }),
      test("twitter-card", "Twitter card tags", tw === "valid" ? "passed" : tw === "incomplete" ? "warning" : "failed", {
        level: "page",
        summary: tw === "valid" ? "Twitter card meta complete." : tw === "incomplete" ? "Some Twitter card tags missing." : "No Twitter card tags found.",
        meta: [
          { label: "twitter:card", value: p.twitterCard ?? "(missing)", mono: true },
          { label: "twitter:title", value: p.twitterTitle ?? "(missing)" },
        ],
        fix: tw !== "valid" ? "Add twitter:card, twitter:title, twitter:description, twitter:image tags." : undefined,
      }),
    ];
    groups.push({ id: "social", name: "Social & Sharing Tags", tests });
  }

  // 7. Schema
  {
    const status = p.schemaStatus;
    const schemas = p.schemas ?? [];
    const tests: CheckupTest[] = [
      test("json-ld", "Structured data (JSON-LD)", status === "none" ? "failed" : status === "invalid" ? "warning" : "passed", {
        level: "page",
        summary:
          status === "none"
            ? "No structured data found on this route."
            : status === "invalid"
              ? "Structured data present but with validation errors."
              : `Valid structured data: ${(p.schemaTypes ?? []).join(", ") || "detected"}.`,
        lists: schemas.length
          ? [
              {
                title: "Schema objects",
                items: schemas.map((s) => `${s.types.join("+")} — ${s.valid ? "valid" : `invalid (${s.errors.length} errors)`}`),
              },
            ]
          : undefined,
        fix: status === "none" ? "Add Organization/WebSite/FAQ or page-type JSON-LD appropriate to this route." : status === "invalid" ? "Fix JSON-LD validation errors reported by Google Rich Results Test." : undefined,
      }),
      test("breadcrumb", "Breadcrumb markup", (p.breadcrumbIssues ?? []).length === 0 ? (status.includes("breadcrumb") || status === "valid" ? "passed" : "warning") : "warning", {
        level: "page",
        summary: (p.breadcrumbIssues ?? []).length === 0 ? "No breadcrumb issues reported." : `${(p.breadcrumbIssues ?? []).length} breadcrumb issue(s).`,
        lists: (p.breadcrumbIssues ?? []).length ? [{ items: p.breadcrumbIssues ?? [] }] : undefined,
        fix: (p.breadcrumbIssues ?? []).length ? "Fix BreadcrumbList schema errors." : undefined,
      }),
    ];
    groups.push({ id: "schema", name: "Structured Data & Schema", tests });
  }

  // 8. Technical
  {
    const canonStatus = p.canonicalStatus;
    const tests: CheckupTest[] = [
      test("canonical", "Self-referencing canonical", canonStatus === "self" ? "passed" : canonStatus === "points_elsewhere" ? "warning" : "failed", {
        level: "page",
        summary:
          canonStatus === "self"
            ? "Canonical points to this URL (self-referencing)."
            : canonStatus === "points_elsewhere"
              ? "Canonical points to a different URL — confirm this is intentional."
              : "No canonical tag found.",
        meta: [{ label: "canonical", value: p.canonical ?? "(missing)", mono: true }],
        fix: canonStatus === "missing" ? "Add a self-referencing <link rel=\"canonical\"> tag." : undefined,
      }),
      test("http-status", "HTTP response status", p.httpStatus !== null && p.httpStatus < 400 ? "passed" : "failed", {
        level: "page",
        source: MEASURED,
        summary: p.httpStatus === null ? "No HTTP response recorded (fetch error)." : `Responded with HTTP ${p.httpStatus}.`,
        stats: [{ label: "Status", value: String(p.httpStatus ?? "—"), tone: p.httpStatus !== null && p.httpStatus < 400 ? "green" : "red" }],
        meta: p.fetchError ? [{ label: "Fetch error", value: p.fetchError }] : undefined,
        fix: p.httpStatus !== null && p.httpStatus >= 400 ? "Fix the server response — this URL must return 2xx/3xx." : undefined,
      }),
      test("redirects", "No redirect chain", p.redirected ? "warning" : "passed", {
        level: "page",
        source: MEASURED,
        summary: p.redirected ? `URL redirects to ${p.finalUrl ?? "another location"}.` : "No redirects — URL resolves directly.",
        meta: p.finalUrl && p.redirected ? [{ label: "Final URL", value: p.finalUrl, mono: true }] : undefined,
        fix: p.redirected ? "Update internal links and canonical to point directly at the final URL." : undefined,
      }),
      test("viewport-lang", "Viewport & language declared", p.viewport && p.lang ? "passed" : "warning", {
        level: "page",
        summary: `viewport: ${p.viewport ?? "missing"} · lang: ${p.lang ?? "missing"}`,
        fix: !p.viewport ? "Add <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">." : !p.lang ? "Add lang attribute to <html> element." : undefined,
      }),
      test("cdn", "CDN / caching indicators", p.cdn?.status === "detected" ? "passed" : p.cdn?.status === "likely" ? "passed" : "warning", {
        level: "site",
        source: MEASURED,
        summary: `CDN status: ${p.cdn?.status?.replace(/_/g, " ") ?? "unknown"}${p.cdn?.provider ? ` (${p.cdn.provider})` : ""}.`,
      }),
    ];
    groups.push({ id: "technical", name: "Technical SEO & Indexability", tests });
  }

  // 9. Performance
  {
    const perf = detail.performance;
    const latest = perf?.audits?.[0];
    const labScore = latest?.lab?.performance ?? p.performance?.score ?? null;
    const tests: CheckupTest[] = [
      test("perf-score", "Lighthouse performance score", labScore === null ? "warning" : labScore >= 90 ? "passed" : labScore >= 50 ? "warning" : "failed", {
        level: "page",
        source: labScore === null ? NOT_CONNECTED : MEASURED,
        summary: labScore === null ? "No Lighthouse run available for this route yet." : `Performance score ${labScore}/100 (${latest?.strategy ?? "mobile"}).`,
        stats: [
          { label: "Score", value: labScore === null ? "—" : String(labScore), tone: labScore === null ? "blue" : labScore >= 90 ? "green" : labScore >= 50 ? "amber" : "red" },
          { label: "LCP", value: p.performance?.lcpMs != null ? `${p.performance.lcpMs} ms` : "—", tone: (p.performance?.lcpMs ?? 0) <= 2500 ? "green" : "amber" },
          { label: "CLS", value: p.performance?.cls != null ? String(p.performance.cls) : "—" },
        ],
        fix: labScore !== null && labScore < 50 ? "Optimise images, reduce JS, and leverage caching to raise the performance score." : undefined,
      }),
      test("response-time", "Server response time (TTFB)", (p.responseTimeMs ?? 0) <= 800 ? "passed" : "warning", {
        level: "page",
        source: MEASURED,
        summary: p.responseTimeMs != null ? `TTFB ≈ ${p.responseTimeMs} ms.` : "Response time not measured.",
        stats: [{ label: "TTFB", value: p.responseTimeMs != null ? `${p.responseTimeMs} ms` : "—", tone: (p.responseTimeMs ?? 0) <= 800 ? "green" : "amber" }],
        fix: (p.responseTimeMs ?? 0) > 800 ? "Investigate slow server response — caching, DB queries, or origin load." : undefined,
      }),
      test("render-blockers", "Render-blocking resources", (p.renderBlockingCount ?? 0) === 0 ? "passed" : "warning", {
        level: "page",
        source: MEASURED,
        summary: `${p.renderBlockingCount ?? 0} render-blocking resource(s) detected.`,
        fix: (p.renderBlockingCount ?? 0) > 0 ? "Inline critical CSS / defer non-critical JS to unblock first paint." : undefined,
      }),
    ];
    groups.push({ id: "performance", name: "Performance & Core Web Vitals", tests });
  }

  // 10. Browser health
  {
    const bh = p.browserHealth;
    const consoleErrors = bh?.consoleErrors?.length ?? 0;
    const failedReq = bh?.failedRequests?.length ?? 0;
    const tests: CheckupTest[] = [
      test("console-errors", "No console errors", consoleErrors === 0 ? "passed" : "failed", {
        level: "page",
        source: MEASURED,
        summary: consoleErrors === 0 ? "No console errors recorded during render." : `${consoleErrors} console error(s) recorded.`,
        lists: consoleErrors ? [{ items: (bh?.consoleErrors ?? []).slice(0, 5).map((e) => e.message) }] : undefined,
        fix: consoleErrors > 0 ? "Fix JavaScript console errors — they break UX and can affect crawl quality." : undefined,
      }),
      test("failed-requests", "No failed network requests", failedReq === 0 ? "passed" : "warning", {
        level: "page",
        source: MEASURED,
        summary: failedReq === 0 ? "All network requests succeeded during render." : `${failedReq} failed request(s).`,
        lists: failedReq ? [{ items: (bh?.failedRequests ?? []).slice(0, 5).map((r) => `${r.url} (${r.statusCode ?? r.type})`) }] : undefined,
        fix: failedReq > 0 ? "Fix 404/500 assets loaded by the page." : undefined,
      }),
      test("console-warnings", "Console warnings reviewed", (bh?.consoleWarnings?.length ?? 0) === 0 ? "passed" : "warning", {
        level: "page",
        source: MEASURED,
        summary: `${bh?.consoleWarnings?.length ?? 0} console warning(s).`,
      }),
    ];
    groups.push({ id: "browser", name: "Browser Health & Runtime", tests });
  }

  return groups;
}

export function buildCheckupReport(opts: {
  route: string;
  detail: SeoPageDetail;
  pages: SeoPageRow[];
  overview: SeoOverview | null;
}): SeoCheckupReportData {
  const { route, detail, pages, overview } = opts;
  const p = detail.page;
  const groups = buildGroups(detail);

  let failed = 0;
  let warning = 0;
  let passed = 0;
  for (const g of groups) {
    for (const t of g.tests) {
      if (t.status === "failed") failed += 1;
      else if (t.status === "warning") warning += 1;
      else passed += 1;
    }
  }
  const total = failed + warning + passed;

  const categories: CheckupCategory[] = groups.map((g) => {
    const cFailed = g.tests.filter((t) => t.status === "failed").length;
    const cWarn = g.tests.filter((t) => t.status === "warning").length;
    const cPass = g.tests.filter((t) => t.status === "passed").length;
    const score = cFailed + cWarn + cPass === 0 ? 0 : Math.round((cPass / Math.max(1, cFailed + cWarn + cPass)) * 100);
    return { name: g.name, score, failed: cFailed, warnings: cWarn, passed: cPass };
  });

  const routeSummaries = pages.map(routeSummaryFromRow);
  const avgWords = pages.length ? Math.round(pages.reduce((a, r) => a + (r.wordCount ?? 0), 0) / pages.length) : 0;
  const ttfbs = pages.map((r) => r.responseTimeMs).filter((n): n is number => typeof n === "number");
  const avgTtfbMs = ttfbs.length ? Math.round(ttfbs.reduce((a, b) => a + b, 0) / ttfbs.length) : null;

  const inputs: ReportInput[] = [
    { label: "Page URL", value: p.url, source: CRAWL },
    { label: "Page Title", value: p.title ?? "(missing)", source: CRAWL, status: p.titleStatus === "ok" ? "passed" : "warning" },
    { label: "Title Length", value: `${p.titleLength} chars`, source: DERIVED, status: p.titleStatus === "ok" ? "passed" : "warning" },
    { label: "Meta Description", value: p.metaDescription ?? "(missing)", source: CRAWL, status: p.descriptionStatus === "ok" ? "passed" : "warning" },
    { label: "Description Length", value: `${p.metaDescriptionLength} chars`, source: DERIVED, status: p.descriptionStatus === "ok" ? "passed" : "warning" },
    { label: "H1 Tag", value: (p.h1 ?? []).join(" | ") || "(missing)", source: CRAWL, status: p.h1Status === "ok" ? "passed" : "failed" },
    { label: "Canonical URL", value: p.canonical ?? "(missing)", source: CRAWL, status: p.canonicalStatus === "self" ? "passed" : p.canonicalStatus === "missing" ? "failed" : "warning" },
    { label: "HTTP Status", value: String(p.httpStatus ?? "—"), source: MEASURED, status: p.httpStatus !== null && p.httpStatus < 400 ? "passed" : "failed" },
    { label: "Indexable", value: p.indexable ? "Yes" : `No — ${p.indexabilityReason ?? "blocked"}`, source: CRAWL, status: p.indexable ? "passed" : "failed" },
    { label: "Word Count", value: String(p.wordCount ?? 0), source: DERIVED, status: (p.wordCount ?? 0) >= 300 ? "passed" : "warning" },
    { label: "Images Missing Alt", value: String(p.imagesMissingAlt ?? 0), source: CRAWL, status: (p.imagesMissingAlt ?? 0) === 0 ? "passed" : "failed" },
    { label: "Broken Links", value: String(detail.links?.brokenOutgoing ?? p.brokenLinks ?? 0), source: CRAWL, status: (detail.links?.brokenOutgoing ?? p.brokenLinks ?? 0) === 0 ? "passed" : "failed" },
    { label: "Schema Types", value: (p.schemaTypes ?? []).join(", ") || "(none)", source: CRAWL, status: p.schemaStatus === "none" ? "failed" : p.schemaStatus === "invalid" ? "warning" : "passed" },
    { label: "Server Response Time", value: p.responseTimeMs != null ? `${p.responseTimeMs} ms` : "—", source: MEASURED, status: (p.responseTimeMs ?? 0) <= 800 ? "passed" : "warning" },
    { label: "PageSpeed Performance", value: p.performance?.score != null ? `${p.performance.score} / 100` : "Run live PageSpeed", source: p.performance?.score != null ? MEASURED : NOT_CONNECTED, status: p.performance?.score == null ? "warning" : p.performance.score >= 90 ? "passed" : p.performance.score >= 50 ? "warning" : "failed" },
    { label: "Google Search Clicks", value: p.search ? String(p.search.clicks) : "Search Console not connected", source: p.search ? MEASURED : NOT_CONNECTED },
    { label: "Google Search Impressions", value: p.search ? String(p.search.impressions) : "Search Console not connected", source: p.search ? MEASURED : NOT_CONNECTED },
    { label: "Average Google Ranking", value: p.search ? `#${p.search.position}` : "Search Console not connected", source: p.search ? MEASURED : NOT_CONNECTED },
  ];

  const issuesFromDetail: CheckupIssue[] = (detail.issues ?? []).map(toCheckupIssue);

  // Derive issues from tests that failed or raised warnings so every route has accurate priority issues matching the 27 checks
  const issuesFromTests: CheckupIssue[] = [];
  for (const g of groups) {
    for (const t of g.tests) {
      if (t.status === "failed") {
        issuesFromTests.push({
          priority: "HIGH",
          title: t.name,
          detail: t.summary || "This test failed during the automated audit.",
          fix: t.fix,
          status: "failed",
          route: p.path || p.url,
          group: g.name,
          evidence: t.meta ? t.meta.map((m) => `${m.label}: ${m.value}`) : undefined,
          collapsible: true,
        });
      } else if (t.status === "warning") {
        issuesFromTests.push({
          priority: "MEDIUM",
          title: t.name,
          detail: t.summary || "This test raised a warning during the automated audit.",
          fix: t.fix,
          status: "warning",
          route: p.path || p.url,
          group: g.name,
          evidence: t.meta ? t.meta.map((m) => `${m.label}: ${m.value}`) : undefined,
          collapsible: true,
        });
      }
    }
  }

  // Deduplicate issues by title
  const issueMap = new Map<string, CheckupIssue>();
  for (const iss of [...issuesFromDetail, ...issuesFromTests]) {
    const key = (iss.title || "").toLowerCase().trim();
    if (!issueMap.has(key)) {
      issueMap.set(key, iss);
    }
  }

  const issues = Array.from(issueMap.values());
  const priorityOrder: Record<string, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  issues.sort((a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2));

  const score = capScore(p.score ?? Math.round((passed / Math.max(1, total)) * 100));

  const summary =
    failed === 0 && warning === 0
      ? `All ${total} automated checks passed for this route. No critical or warning-level SEO issues were detected in the latest crawl.`
      : `${failed} check(s) failed and ${warning} raised warnings across ${total} automated checks for this route, based on the latest completed crawl${overview?.crawl?.completedAt ? ` (${new Date(overview.crawl.completedAt).toLocaleString("en-IN")})` : ""}. Fix HIGH priority issues first.`;

  return {
    scope: "page",
    route,
    url: p.url,
    pageTitle: p.title ?? "",
    pageDesc: p.metaDescription,
    titleLen: p.titleLength ?? 0,
    descLen: p.metaDescriptionLength ?? null,
    seoScore: score,
    aiScore: null,
    scoreSource: CRAWL,
    aiSource: NOT_CONNECTED,
    telemetrySource: p.performance?.score != null ? MEASURED : NOT_CONNECTED,
    failedCount: failed,
    warningCount: warning,
    passedCount: passed,
    totalCount: total,
    summary,
    categories,
    inputs,
    issues,
    groups,
    generatedAt: p.lastCrawledAt ?? new Date().toISOString(),
    pageSpeed: null,
    routeSummaries,
    site: {
      origin: SITE_URL,
      routesCrawled: pages.length,
      avgWords,
      avgTtfbMs,
      searchConsoleConfigured: Boolean(overview?.search && (overview.search as { available?: boolean }).available),
      llmKeysConfigured: [],
    },
  };
}
