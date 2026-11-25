import { api } from "./api";

export type DashboardSourceStatus = "connected" | "not_connected" | "error";

export interface DashboardSource<T> {
  status: DashboardSourceStatus;
  updatedAt: string;
  message?: string;
  data: T | null;
}

export interface LiveDashboardOverview {
  generatedAt: string;
  sources: {
    internal: DashboardSource<{
      totalPages: number;
      totalPosts: number;
      totalEnquiries: number;
      enquiriesMtd: number;
      totalRequests: number;
      growth: { posts: number | null; enquiriesMtd: number | null };
      recentSubmissions: Array<{ id: string; name: string; type: string; city?: string; createdAt: string }>;
      topLocations: Array<{ city: string; count: number }>;

      actionRequired?: {
        exhibitor: number;
        buyer: number;
        sponsor: number;
        visitor: number;
      };
    }>;
    analytics: DashboardSource<{
      users: number;
      sessions: number;
      pageViews: number;
      averageSessionSeconds: number;
      bounceRate: number;
      conversions: number;
      daily: Array<{ date: string; users: number; pageViews: number }>;
      pages: Array<{ path: string; views: number; visitors: number; averageSessionSeconds: number; bounceRate: number }>;
      growth: { users: number | null; sessions: number | null; pageViews: number | null; averageSession: number | null; bounceRate: number | null; conversionRate: number | null };
    }>;
    searchConsole: DashboardSource<{
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
      growth: { clicks: number | null; impressions: number | null; ctr: number | null; position: number | null };
      queries: Array<{ query: string; clicks: number; impressions: number; ctr: number; position: number }>;
    }>;
    pageSpeed: DashboardSource<{
      strategy: "mobile" | "desktop";
      lighthouseAvailable: boolean;
      performanceScore: number;
      seoScore: number;
      lcp: number | null;
      inp: number | null;
      cls: number | null;
      fcp: number | null;
      ttfb: number | null;
      tbt: number | null;
      desktop?: {
        performanceScore: number;
        fcp: number | null;
        lcp: number | null;
        cls: number | null;
        tbt: number | null;
        ttfb: number | null;
        inp: number | null;
      };
      mobile?: {
        performanceScore: number;
        fcp: number | null;
        lcp: number | null;
        cls: number | null;
        tbt: number | null;
        ttfb: number | null;
        inp: number | null;
      };
      seoChecks: Array<{
        key: string;
        label: string;
        status: "good" | "needs_work" | "not_checked";
        score: number | null;
      }>;
    }>;
    indexCoverage: DashboardSource<{
      indexed: number;
      total: number;
      notIndexed: number;
      urls?: Array<{ url: string; indexed: boolean; coverageState?: string }>;
    }>;
    siteStatus: DashboardSource<{
      online: boolean;
      responseTimeMs: number;
      httpStatus: number;
      sslValid: boolean;
      sslExpiresAt: string | null;
      sslIssuer: string | null;
      certificateDaysRemaining: number | null;
      finalUrl: string;
      redirected: boolean;
      ipAddress: string | null;
      securityHeaders: { present: number; total: number };
      nodeVersion: string;
    }>;
  };
}

const statusConnected: DashboardSourceStatus = "connected";

type RecentEnquiry = {
  _id?: string;
  id?: string;
  name?: string;
  organization?: string;
  interest?: string;
  category?: string;
  city?: string;
  createdAt?: string;
};

export const dashboardApi = {
  overview: async (): Promise<LiveDashboardOverview> => {
    try {
      const res = await api.get<LiveDashboardOverview | null>("/dashboard/overview");
      if (res && res.sources && res.sources.internal && res.sources.internal.data) {
        return res;
      }
    } catch {}

    let totalPagesCount = 0;
    let totalBlogsCount = 0;
    let totalEnquiriesCount = 0;
    let dynamicSubmissions: Array<{ id: string; name: string; type: string; city?: string; createdAt: string }> = [];

    try {
      const [pagesRes, blogsRes, enqRes] = await Promise.allSettled([
        api.get<unknown[] | { pages?: unknown[] }>("/seo/pages"),
        api.get<unknown[] | { blogs?: unknown[] }>("/blogs"),
        api.get<RecentEnquiry[]>("/contact-enquiry"),
      ]);

      if (pagesRes.status === "fulfilled" && pagesRes.value) {
        const pagesList = Array.isArray(pagesRes.value) ? pagesRes.value : (pagesRes.value.pages || []);
        totalPagesCount = pagesList.length;
      }

      if (blogsRes.status === "fulfilled" && blogsRes.value) {
        const blogsList = Array.isArray(blogsRes.value) ? blogsRes.value : (blogsRes.value.blogs || []);
        totalBlogsCount = blogsList.length;
      }

      if (enqRes.status === "fulfilled" && enqRes.value) {
        const enqList = Array.isArray(enqRes.value) ? enqRes.value : [];
        totalEnquiriesCount = enqList.length;
        dynamicSubmissions = enqList.slice(0, 5).map((e, index) => ({
          id: e._id || e.id || `enquiry-${index}`,
          name: e.name || e.organization || "Enquiry",
          type: e.interest || e.category || "General Enquiry",
          city: e.city || "Unknown",
          createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString()
        }));
      }
    } catch {}

    const statusError: DashboardSourceStatus = "error";
    const statusNotConnected: DashboardSourceStatus = "not_connected";

    return {
      generatedAt: new Date().toISOString(),
      sources: {
        internal: {
          status: statusConnected,
          updatedAt: new Date().toISOString(),
          data: {
            totalPages: totalPagesCount,
            totalPosts: totalBlogsCount,
            totalEnquiries: totalEnquiriesCount,
            enquiriesMtd: totalEnquiriesCount,
            totalRequests: totalEnquiriesCount,
            growth: { posts: null, enquiriesMtd: null },
            recentSubmissions: dynamicSubmissions,
            topLocations: [],
          }
        },
        analytics: {
          status: statusNotConnected,
          updatedAt: new Date().toISOString(),
          data: null,
          message: "Dashboard backend unreachable",
        },
        searchConsole: {
          status: statusNotConnected,
          updatedAt: new Date().toISOString(),
          data: null,
          message: "Dashboard backend unreachable",
        },
        pageSpeed: {
          status: statusError,
          updatedAt: new Date().toISOString(),
          data: null,
          message: "Dashboard backend unreachable",
        },
        indexCoverage: {
          status: statusError,
          updatedAt: new Date().toISOString(),
          data: null,
          message: "Dashboard backend unreachable",
        },
        siteStatus: {
          status: statusError,
          updatedAt: new Date().toISOString(),
          data: null,
          message: "Dashboard backend unreachable",
        },
      },
    };
  },
  pageSpeed: async (): Promise<LiveDashboardOverview["sources"]["pageSpeed"]> => {
    try {
      const overview = await dashboardApi.overview();
      if (overview?.sources?.pageSpeed) {
        return overview.sources.pageSpeed;
      }
    } catch {}
    return {
      status: "error",
      updatedAt: new Date().toISOString(),
      data: null,
      message: "PageSpeed Insights unavailable",
    };
  },
  indexCoverage: async (): Promise<LiveDashboardOverview["sources"]["indexCoverage"]> => {
    try {
      const overview = await dashboardApi.overview();
      if (overview?.sources?.indexCoverage) {
        return overview.sources.indexCoverage;
      }
    } catch {}
    return {
      status: "error",
      updatedAt: new Date().toISOString(),
      data: null,
      message: "Index coverage unavailable",
    };
  },
  siteStatus: async (): Promise<LiveDashboardOverview["sources"]["siteStatus"]> => {
    try {
      const overview = await dashboardApi.overview();
      if (overview?.sources?.siteStatus) {
        return overview.sources.siteStatus;
      }
    } catch {}
    return {
      status: "error",
      updatedAt: new Date().toISOString(),
      data: null,
      message: "Site status check unavailable",
    };
  },
};
