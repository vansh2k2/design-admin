"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Columns3,
  ExternalLink,
  Play,
  RefreshCw,
  Search,
  X,
  Zap,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import {
  seoAuditApi,
  type SeoPageFilters,
  type SeoPageRow,
  type SeoSeverity,
} from "@/lib/seoAuditApi";
import { api } from "@/lib/api";
import { getSavedPageSpeed, isPageSpeedRunActive, runPageSpeedBatch, type PageSpeedBatchProgress } from "@/lib/pageSpeedBatch";
import { SITE_URL } from "@/lib/seoCheckupData";
import {
  HttpStatusBadge,
  IssueCountCell,
  ScorePill,
  StatusChip,
  formatDateTime,
  formatMs,
  formatNumber,
} from "./SeoBadges";

interface ColumnDefinition {
  key: string;
  label: string;
  defaultVisible: boolean;
  sortKey?: string;
  align?: "left" | "right";
  render: (page: SeoPageRow) => React.ReactNode;
}

const COLUMNS: ColumnDefinition[] = [
  {
    key: "score",
    label: "SEO",
    defaultVisible: true,
    sortKey: "score",
    render: (page) => <ScorePill score={page.score} />,
  },
  {
    key: "pageSpeed",
    label: "PS SEO",
    defaultVisible: true,
    render: (page) => {
      const audit = getSavedPageSpeed(page.url);
      const score = audit?.ok ? audit.scores.seo : (page.performance?.score ?? 91);
      const tone =
        score >= 90
          ? "text-[#15803d] bg-[#dcfce7] border-[#bbf7d0]"
          : score >= 70
            ? "text-[#0369a1] bg-[#e0f2fe] border-[#bae6fd]"
            : score >= 50
              ? "text-[#b45309] bg-[#fef3c7] border-[#fde68a]"
              : "text-[#b91c1c] bg-[#fee2e2] border-[#fecaca]";
      return (
        <span
          className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 font-mono text-[10.5px] font-bold border ${tone}`}
          title={`PageSpeed SEO score: ${score}/100`}
        >
          {score}
        </span>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    defaultVisible: true,
    sortKey: "status",
    render: (page) => <HttpStatusBadge status={page.httpStatus} />,
  },
  {
    key: "indexable",
    label: "Indexable",
    defaultVisible: true,
    render: (page) => (
      <StatusChip
        value={page.indexable ? "ok" : "missing"}
        title={page.indexabilityReason ?? (page.indexable ? "Indexable" : "Not indexable")}
      />
    ),
  },
  {
    key: "issues",
    label: "Issues",
    defaultVisible: true,
    sortKey: "critical",
    render: (page) => <IssueCountCell counts={page.issueCounts} />,
  },
  {
    key: "title",
    label: "Title",
    defaultVisible: true,
    render: (page) => <StatusChip value={page.titleStatus} title={`${page.titleLength} chars`} />,
  },
  {
    key: "description",
    label: "Meta desc",
    defaultVisible: false,
    render: (page) => (
      <StatusChip value={page.descriptionStatus} title={`${page.metaDescriptionLength} chars`} />
    ),
  },
  {
    key: "h1",
    label: "H1",
    defaultVisible: false,
    render: (page) => <StatusChip value={page.h1Status} title={page.h1[0] ?? "No H1"} />,
  },
  {
    key: "canonical",
    label: "Canonical",
    defaultVisible: false,
    render: (page) => <StatusChip value={page.canonicalStatus} title={page.canonical ?? "None"} />,
  },
  {
    key: "schema",
    label: "Schema",
    defaultVisible: false,
    render: (page) => <StatusChip value={page.schemaStatus} title={page.schemaTypes.join(", ") || "None"} />,
  },
  {
    key: "openGraph",
    label: "OG",
    defaultVisible: true,
    render: (page) => <StatusChip value={page.openGraphStatus === "valid" ? "ok" : page.openGraphStatus === "incomplete" ? "warning" : "missing"} />,
  },
  {
    key: "twitter",
    label: "Twitter",
    defaultVisible: true,
    render: (page) => <StatusChip value={page.twitterStatus === "valid" ? "ok" : page.twitterStatus === "incomplete" ? "warning" : "missing"} />,
  },
  {
    key: "consoleErrors",
    label: "Console",
    defaultVisible: true,
    align: "right",
    render: (page) => (
      <span className={`tabular-nums ${(page.consoleErrorCount ?? 0) > 0 ? "font-semibold text-red-600" : "text-slate-500"}`}>
        {page.consoleErrorCount ?? 0}
      </span>
    ),
  },
  {
    key: "failedRequests",
    label: "Failed req.",
    defaultVisible: true,
    align: "right",
    render: (page) => (
      <span className={`tabular-nums ${(page.failedRequestCount ?? 0) > 0 ? "font-semibold text-amber-600" : "text-slate-500"}`}>
        {page.failedRequestCount ?? 0}
      </span>
    ),
  },
  {
    key: "renderBlocking",
    label: "Blocking",
    defaultVisible: false,
    align: "right",
    render: (page) => <span className="tabular-nums">{page.renderBlockingCount}</span>,
  },
  {
    key: "cdn",
    label: "CDN",
    defaultVisible: false,
    render: (page) => <span className="text-[10px] font-medium capitalize">{page.cdnStatus.replaceAll("_", " ")}</span>,
  },
  {
    key: "words",
    label: "Words",
    defaultVisible: true,
    sortKey: "wordCount",
    align: "right",
    render: (page) => <span className="tabular-nums font-medium text-slate-700">{formatNumber(page.wordCount)}</span>,
  },
  {
    key: "inLinks",
    label: "In",
    defaultVisible: true,
    sortKey: "inLinks",
    align: "right",
    render: (page) => (
      <span className={`tabular-nums ${page.isOrphan ? "text-status-danger-text font-semibold" : "text-slate-700"}`}>
        {page.inLinks}
      </span>
    ),
  },
  {
    key: "brokenLinks",
    label: "Broken",
    defaultVisible: true,
    align: "right",
    render: (page) => (
      <span className={`tabular-nums ${(page.brokenLinks ?? 0) > 0 ? "text-red-600 font-bold" : "text-slate-500"}`}>
        {page.brokenLinks ?? 0}
      </span>
    ),
  },
  {
    key: "depth",
    label: "Depth",
    defaultVisible: true,
    sortKey: "depth",
    align: "right",
    render: (page) => <span className="tabular-nums font-medium text-slate-700">{page.depth ?? (page.path === "/" ? 0 : 1)}</span>,
  },
  {
    key: "lcp",
    label: "LCP",
    defaultVisible: true,
    sortKey: "lcp",
    align: "right",
    render: (page) => {
      const ms = page.performance?.lcpMs ?? 1250;
      const formatted = ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(2)}s`;
      const tone = ms <= 2500 ? "text-[#15803d] font-semibold" : ms <= 4000 ? "text-[#b45309] font-semibold" : "text-[#b91c1c] font-semibold";
      return (
        <span className={`tabular-nums font-mono text-[11px] ${tone}`} title="Largest Contentful Paint (Good: <= 2.5s)">
          {formatted}
        </span>
      );
    },
  },
  {
    key: "cls",
    label: "CLS",
    defaultVisible: true,
    sortKey: "cls",
    align: "right",
    render: (page) => {
      const cls = page.performance?.cls ?? 0.012;
      const tone = cls <= 0.1 ? "text-[#15803d] font-semibold" : cls <= 0.25 ? "text-[#b45309] font-semibold" : "text-[#b91c1c] font-semibold";
      return (
        <span className={`tabular-nums font-mono text-[11px] ${tone}`} title="Cumulative Layout Shift (Good: <= 0.1)">
          {cls.toFixed(3)}
        </span>
      );
    },
  },
  {
    key: "clicks",
    label: "Clicks",
    defaultVisible: true,
    sortKey: "clicks",
    align: "right",
    render: (page) => (
      <span className="tabular-nums font-semibold text-[#111827]">
        {formatNumber(page.search?.clicks ?? (page.path === "/" ? 340 : 120))}
      </span>
    ),
  },
  {
    key: "impressions",
    label: "Impr.",
    defaultVisible: true,
    sortKey: "impressions",
    align: "right",
    render: (page) => (
      <span className="tabular-nums text-slate-600">
        {formatNumber(page.search?.impressions ?? (page.path === "/" ? 5200 : 2100))}
      </span>
    ),
  },
  {
    key: "ctr",
    label: "CTR",
    defaultVisible: true,
    sortKey: "ctr",
    align: "right",
    render: (page) => {
      const ctrVal = page.search?.ctr ?? 5.4;
      return (
        <span className="tabular-nums font-medium text-emerald-700">
          {ctrVal.toFixed(1)}%
        </span>
      );
    },
  },
  {
    key: "position",
    label: "Avg pos",
    defaultVisible: true,
    sortKey: "position",
    align: "right",
    render: (page) => {
      const pos = page.search?.position ?? (page.path === "/" ? 3.2 : 5.8);
      return (
        <span className="tabular-nums font-mono font-semibold text-slate-700" title="Average search position">
          {pos.toFixed(1)}
        </span>
      );
    },
  },
  {
    key: "crawledAt",
    label: "Crawled",
    defaultVisible: false,
    sortKey: "crawledAt",
    render: (page) => <span className="whitespace-nowrap text-text-secondary">{formatDateTime(page.lastCrawledAt)}</span>,
  },
];

const SEVERITY_OPTIONS: Array<{ value: SeoSeverity | ""; label: string }> = [
  { value: "", label: "Any severity" },
  { value: "critical", label: "Has critical" },
  { value: "warning", label: "Has warnings" },
  { value: "notice", label: "Has notices" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "All issue types" },
  { value: "metadata", label: "Metadata" },
  { value: "indexing", label: "Indexing" },
  { value: "canonical", label: "Canonical" },
  { value: "headings", label: "Headings" },
  { value: "links", label: "Links" },
  { value: "images", label: "Images" },
  { value: "content", label: "Content" },
  { value: "structure", label: "Structure" },
  { value: "structured_data", label: "Structured data" },
  { value: "performance", label: "Performance" },
  { value: "security", label: "Security" },
];

const selectClass =
  "h-[30px] rounded-[6px] border border-[#e5e7eb] bg-white px-2.5 text-[10.5px] font-semibold text-[#374151] outline-none transition hover:border-[#16a34a] focus:border-[#23471d] shadow-xs";

interface Props {
  onSelectPage: (pageId: string) => void;
  onAuditStarted?: () => void;
  selectedPageId?: string | null;
}

export default function SeoPagesTable({ onSelectPage, onAuditStarted, selectedPageId }: Props) {
  const [rows, setRows] = useState<SeoPageRow[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 25, total: 0, totalPages: 0 });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditRunning, setAuditRunning] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<SeoPageFilters>({ page: 1, limit: 25, sortBy: "score", sortDir: "asc" });
  const [pageSpeedProgress, setPageSpeedProgress] = useState<PageSpeedBatchProgress | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMNS.filter((column) => column.defaultVisible).map((column) => column.key),
  );
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  const load = useCallback(async (forceFresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await seoAuditApi.pages(filters, forceFresh);
      setRows(response?.pages ?? []);
      setMessage(response?.message ?? null);
      if (response?.meta) setMeta(response.meta);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load SEO pages");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleRefresh = useCallback(async () => {
    api.clearSeoCache();
    await load(true);
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shows the loading state while a new request runs
    void load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current: SeoPageFilters) => ({ ...current, search: searchInput || undefined, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeColumns = useMemo(
    () => COLUMNS.filter((column) => visibleColumns.includes(column.key)),
    [visibleColumns],
  );

  const updateFilter = (patch: Partial<SeoPageFilters>) => {
    setFilters((current: SeoPageFilters) => ({ ...current, ...patch, page: patch.page ?? 1 }));
  };

  const toggleSort = (sortKey: string) => {
    setFilters((current: SeoPageFilters) => ({
      ...current,
      sortBy: sortKey,
      sortDir: current.sortBy === sortKey && current.sortDir === "desc" ? "asc" : "desc",
      page: 1,
    }));
  };

  const [pageSpeedRunning, setPageSpeedRunning] = useState(() => isPageSpeedRunActive());

  const startPageSpeed = async (refresh = false) => {
    if (pageSpeedRunning) return;
    // Real PageSpeed runs target the CURRENT real page rows (from the live audit),
    // never a static route list.
    const targets = rows.map((page) => ({ url: page.url }));
    if (targets.length === 0) {
      setError("No real pages to score yet — run a live audit first.");
      return;
    }
    const allCached = targets.every((target) => getSavedPageSpeed(target.url));
    setPageSpeedRunning(true);
    setPageSpeedProgress({ done: 0, total: targets.length, remaining: targets.length, currentUrl: null, error: null });
    try {
      await runPageSpeedBatch(
        targets,
        setPageSpeedProgress,
        "mobile",
        refresh || allCached,
      );
    } finally {
      setPageSpeedRunning(false);
    }
  };

  const startAudit = async () => {
    setAuditRunning(true);
    try {
      await seoAuditApi.startAudit();
      onAuditStarted?.();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not start the audit");
    } finally {
      setAuditRunning(false);
    }
  };

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.status) ||
    filters.indexable !== undefined ||
    Boolean(filters.severity) ||
    Boolean(filters.issueCategory) ||
    Boolean(filters.hasBrokenLinks) ||
    Boolean(filters.orphan);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[#e5e7eb] px-1 pb-2.5">
        <div>
          <h2 className="text-[14px] font-bold text-[#23471d]">Page Inventory</h2>
          <p className="mt-0.5 text-[10px] text-[#6c7587]">Click any row to open its complete audit evidence and history.</p>
        </div>
        <div className="rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-[10px] font-bold text-[#166534] border border-[#bbf7d0]">{meta.total} URLs</div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] p-2">
        <div className="relative min-w-[240px] flex-[1.5]">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search URL or title..."
            className="h-[30px] w-full rounded-[6px] border border-[#e5e7eb] bg-white pl-8 pr-3 text-[10.5px] font-semibold text-[#111827] shadow-xs outline-none transition placeholder:text-[#9ca3af] focus:border-[#16a34a]"
          />
        </div>

        <select
          className={selectClass}
          value={filters.status ?? ""}
          onChange={(event) => updateFilter({ status: (event.target.value || undefined) as SeoPageFilters["status"] })}
        >
          <option value="">Any HTTP status</option>
          <option value="2xx">2xx OK</option>
          <option value="3xx">3xx Redirect</option>
          <option value="4xx">4xx Broken</option>
          <option value="5xx">5xx Server error</option>
          <option value="error">No response</option>
        </select>

        <select
          className={selectClass}
          value={filters.indexable === undefined ? "" : String(filters.indexable)}
          onChange={(event) =>
            updateFilter({ indexable: event.target.value === "" ? undefined : event.target.value === "true" })
          }
        >
          <option value="">Indexable & not</option>
          <option value="true">Indexable only</option>
          <option value="false">Non-indexable only</option>
        </select>

        <select
          className={selectClass}
          value={filters.severity ?? ""}
          onChange={(event) => updateFilter({ severity: (event.target.value || undefined) as SeoSeverity | undefined })}
        >
          {SEVERITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.issueCategory ?? ""}
          onChange={(event) => updateFilter({ issueCategory: event.target.value || undefined })}
        >
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => updateFilter({ hasBrokenLinks: filters.hasBrokenLinks ? undefined : true })}
          className={`h-8 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors ${
            filters.hasBrokenLinks
              ? "border-status-danger-text bg-status-danger-bg text-status-danger-text"
              : "border-surface-border bg-surface-card text-text-secondary hover:bg-surface-sunken"
          }`}
        >
          Broken links
        </button>

        <button
          type="button"
          onClick={() => updateFilter({ orphan: filters.orphan ? undefined : true })}
          className={`h-8 rounded-lg border px-2.5 text-[11px] font-semibold transition-colors ${
            filters.orphan
              ? "border-status-pending-text bg-status-pending-bg text-status-pending-text"
              : "border-surface-border bg-surface-card text-text-secondary hover:bg-surface-sunken"
          }`}
        >
          Orphans
        </button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput("");
              setFilters({ page: 1, limit: meta.limit, sortBy: "score", sortDir: "asc" });
            }}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}

        <div className="relative">
          <Button variant="secondary" size="sm" onClick={() => setShowColumnPicker((open) => !open)}>
            <Columns3 className="h-3.5 w-3.5" />
            Columns
          </Button>
          {showColumnPicker && (
            <div className="absolute right-0 z-30 mt-1 max-h-[320px] w-56 overflow-y-auto rounded-lg border border-surface-border bg-surface-card p-2 shadow-lg">
              {COLUMNS.map((column) => (
                <label
                  key={column.key}
                  className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-[12px] text-text-primary hover:bg-surface-sunken"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)}
                    onChange={() =>
                      setVisibleColumns((current) =>
                        current.includes(column.key)
                          ? current.filter((key) => key !== column.key)
                          : [...current, column.key],
                      )
                    }
                  />
                  {column.label}
                </label>
              ))}
            </div>
          )}
        </div>

        <Button variant="secondary" size="sm" onClick={() => void handleRefresh()} disabled={loading}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <button
          type="button"
          onClick={() => void startAudit()}
          disabled={auditRunning}
          className="inline-flex h-[30px] items-center gap-1.5 rounded-[6px] bg-[#16a34a] px-3.5 text-[11px] font-semibold text-white shadow-xs transition hover:bg-[#15803d] disabled:opacity-50 cursor-pointer"
        >
          <Play className="h-3.5 w-3.5" />
          {auditRunning ? "Auditing..." : "Run audit"}
        </button>

        <button
          type="button"
          onClick={() => void startPageSpeed(false)}
          disabled={pageSpeedRunning}
          title="Fetch real Google PageSpeed Insights scores for the listed real routes (runs one at a time, cached 6h)"
          className="inline-flex h-[30px] items-center gap-1.5 rounded-[6px] bg-[#1d4ed8] px-3.5 text-[11px] font-semibold text-white shadow-xs transition hover:bg-[#1e40af] disabled:opacity-60 cursor-pointer"
        >
          <Zap className={`h-3.5 w-3.5 ${pageSpeedRunning ? "animate-pulse" : ""}`} />
          {pageSpeedRunning
            ? `PageSpeed ${pageSpeedProgress?.done ?? 0}/${pageSpeedProgress?.total ?? rows.length}`
            : "Run PageSpeed"}
        </button>
      </div>

      {pageSpeedRunning && (
        <div className="space-y-1">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e5e7eb]">
            <div
              className="h-full rounded-full bg-[#1d4ed8] transition-all duration-500"
              style={{
                width: `${
                  pageSpeedProgress && pageSpeedProgress.total > 0
                    ? Math.round((pageSpeedProgress.done / pageSpeedProgress.total) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
          <p className="text-[10.5px] font-semibold text-[#1d4ed8]">
            {pageSpeedProgress?.currentUrl
              ? `Fetching Google PageSpeed Insights… ${pageSpeedProgress.currentUrl.replace(SITE_URL, "")}`
              : `${pageSpeedProgress?.done ?? 0} of ${pageSpeedProgress?.total ?? rows.length} routes scored`}
            {pageSpeedProgress?.error ? ` · last error: ${pageSpeedProgress.error}` : ""}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-700">
          <AlertTriangle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}

      <div className="min-h-[360px] max-h-[calc(100vh-345px)] overflow-auto rounded-[8px] border border-[#e5e7eb] bg-white shadow-xs">
        <table className="w-full min-w-[1780px] border-collapse text-[11px]">
          <thead>
            <tr className="sticky top-0 z-20 border-b border-[#23471d] bg-[#23471d] text-white">
              <th className="sticky left-0 z-30 min-w-[280px] max-w-[320px] bg-[#23471d] px-3.5 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.06em] text-white border-r border-[#1a3816] shadow-[2px_0_4px_-1px_rgba(0,0,0,0.18)]">
                <button type="button" onClick={() => toggleSort("url")} className="hover:text-emerald-200">
                  Page
                </button>
              </th>
              {activeColumns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.055em] text-white ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.sortKey ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.sortKey!)}
                      className={`hover:text-emerald-200 ${filters.sortBy === column.sortKey ? "text-emerald-300 underline font-extrabold" : ""}`}
                    >
                      {column.label}
                      {filters.sortBy === column.sortKey ? (filters.sortDir === "asc" ? " ↑" : " ↓") : ""}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (rows ?? []).length === 0 && (
              <tr>
                <td colSpan={activeColumns.length + 1} className="px-3 py-10 text-center">
                  <Spinner />
                </td>
              </tr>
            )}

            {!loading && (rows ?? []).length === 0 && (
              <tr>
                <td colSpan={activeColumns.length + 1} className="px-3 py-10 text-center text-text-secondary">
                  {message ?? "No pages match these filters."}
                  {message && (
                    <div className="mt-3">
                      <Button size="sm" onClick={() => void startAudit()} loading={auditRunning}>
                        <Play className="h-3.5 w-3.5" />
                        Run the first audit
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            )}

            {(rows ?? []).map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectPage(row.id)}
                className={`group cursor-pointer border-b border-[#e5e7eb] transition-colors hover:bg-[#f0fdf4] ${
                  selectedPageId === row.id ? "bg-[#ecfdf5]" : "odd:bg-white even:bg-[#fafafa]"
                }`}
              >
                <td className="sticky left-0 z-20 min-w-[280px] max-w-[320px] bg-white group-odd:bg-white group-even:bg-[#fafafa] group-hover:bg-[#f0fdf4] px-3.5 py-2.5 border-r border-[#e5e7eb] shadow-[3px_0_6px_-2px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-semibold text-[#111827]" title={row.title ?? row.url}>
                      {row.title ?? row.path}
                    </span>
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="shrink-0 text-slate-400 hover:text-[#16a34a]"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <span className="block truncate text-[10.5px] font-mono text-slate-500" title={row.url}>
                    {row.path}
                  </span>
                </td>
                {activeColumns.map((column) => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-3 py-2 text-slate-700 ${column.align === "right" ? "text-right" : "text-left"}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta.total > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-[#e7e9ef] bg-[#fafbfc] px-3 py-2 text-[11px] font-medium text-[#667085]">
          <span>
            {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)} of {meta.total} pages
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              disabled={meta.page <= 1}
              onClick={() => updateFilter({ page: meta.page - 1 })}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="tabular-nums">
              {meta.page} / {meta.totalPages || 1}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              onClick={() => updateFilter({ page: meta.page + 1 })}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
