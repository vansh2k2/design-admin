import { DH_PAGE_DEFINITIONS } from "./designHouseCmsContent";

export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.designhouse.co.in").replace(/\/$/, "");

export type PageStatus = "Published" | "Draft";

export type PageType = "home" | "page" | "people";

export interface CmsPage {
  configKey?: string;
  id: number;
  title: string;
  slug: string;
  author: string;
  status: PageStatus;
  visibility?: "Public" | "Private";
  publishedAt?: string;
  lastUpdated?: string;
  seoScore: number;
  rating: "Excellent" | "Good" | "Needs Work";
  updated: string;
  updatedBy: string;
  type: PageType;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    h1Tag?: string;
    breadcrumbName?: string;
    schemaMarkup?: string;
    robotsIndex?: boolean;
    robotsFollow?: boolean;
    canonicalTag?: string;
    openGraphTags?: string;
    isActive?: boolean;
  };
}
export function getCmsPageRouteKey(page: Pick<CmsPage, "title">): string {
  return page.title
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const routeAliases: Record<string, string> = {
  "home": "landingPage",
  "homepage": "landingPage",
  "about": "aboutPage",
  "about-us": "aboutPage",
  "team": "teamPage",
  "our-team": "teamPage",
  "associates": "associatesPage",
  "brand-approach": "brandApproachPage",
  "infrastructure": "infrastructurePage",
  "services": "servicesPage",
  "our-services": "servicesPage",
  "retail-interior": "retailInteriorPage",
  "corporate-interior": "corporateInteriorPage",
  "restaurant-interior": "restaurantInteriorPage",
  "shop-in-shop": "shopInShopPage",
  "retail-display": "retailDisplayPage",
  "retail-kiosk": "retailKioskPage",
  "exhibitions": "exhibitionsPage",
  "signage": "signagePage",
  "office-interior": "officeInteriorPage",
  "portfolio": "portfolioPage",
  "projects": "portfolioPage",
  "our-projects": "portfolioPage",
  "portfoliopage": "portfolioPage",
  "gallery": "galleryPage",
  "clients": "clientsPage",
  "testimonials": "testimonialsPage",
  "blog": "blogPage",
  "blogs": "blogPage",
  "career": "careersPage",
  "careers": "careersPage",
  "contact": "contactPage",
  "contact-us": "contactPage",
  "privacy": "privacyPolicyPage",
  "privacy-policy": "privacyPolicyPage",
  "terms": "termsAndConditionsPage",
  "terms-and-conditions": "termsAndConditionsPage",
};

export function findCmsPageByRouteKey(pages: CmsPage[], routeKey?: string): CmsPage | undefined {
  if (!routeKey) return undefined;
  const decoded = decodeURIComponent(routeKey).toLowerCase().trim();
  const numericId = Number(decoded);

  // 1. Numeric ID
  if (Number.isInteger(numericId)) {
    const byId = pages.find((p) => p.id === numericId);
    if (byId) return byId;
  }

  // 2. Direct alias mapping
  const aliasConfigKey = routeAliases[decoded];
  if (aliasConfigKey) {
    const byAlias = pages.find((p) => p.configKey?.toLowerCase() === aliasConfigKey.toLowerCase());
    if (byAlias) return byAlias;
  }

  // 3. Exact route key from title
  const byTitleRouteKey = pages.find((p) => getCmsPageRouteKey(p) === decoded);
  if (byTitleRouteKey) return byTitleRouteKey;

  // 4. Exact configKey
  const byConfigKey = pages.find((p) => p.configKey && p.configKey.toLowerCase() === decoded);
  if (byConfigKey) return byConfigKey;

  // 5. Full slug match (e.g. /participate/why-exhibit or participate/why-exhibit)
  const bySlug = pages.find((p) => {
    const cleanSlug = p.slug.replace(/^\//, "").toLowerCase();
    return cleanSlug && cleanSlug === decoded;
  });
  if (bySlug) return bySlug;

  // 6. Last segment of slug (e.g. "why-exhibit" matches "/participate/why-exhibit")
  const byLastSegment = pages.find((p) => {
    const cleanSlug = p.slug.replace(/^\//, "").toLowerCase();
    const lastPart = cleanSlug.split("/").pop()?.toLowerCase();
    return lastPart && lastPart === decoded;
  });
  if (byLastSegment) return byLastSegment;

  // 7. Slug with slashes converted to hyphens
  const byHyphenatedSlug = pages.find((p) => {
    const cleanSlug = p.slug.replace(/^\//, "").toLowerCase().replace(/\//g, "-");
    return cleanSlug && cleanSlug === decoded;
  });
  if (byHyphenatedSlug) return byHyphenatedSlug;

  // 8. Loose / partial search on routeKey or title
  const byPartial = pages.find((p) => {
    const pageRouteKey = getCmsPageRouteKey(p);
    return pageRouteKey.includes(decoded) || decoded.includes(pageRouteKey);
  });
  if (byPartial) return byPartial;

  return undefined;
}

type SettingsPageConfig = {
  publishedAt?: string;
  lastUpdated?: string;
  updatedBy?: string;
  status?: PageStatus;
  visibility?: "Public" | "Private";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    canonicalUrl?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    h1Tag?: string;
    breadcrumbName?: string;
    schemaMarkup?: string;
    robotsIndex?: boolean;
    robotsFollow?: boolean;
    canonicalTag?: string;
    openGraphTags?: string;
    isActive?: boolean;
  };
  sections?: Array<{ enabled?: boolean }>;
};

export function formatPublishDate(dateString?: string | Date): string {
  if (!dateString) return "Not published";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);
  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
}

const pageDefinitions = DH_PAGE_DEFINITIONS;

function seoScore(config: SettingsPageConfig): number {
  const seo = config.seo ?? {};
  const checks = [
    Boolean(seo.metaTitle?.trim()),
    Boolean(seo.metaDescription?.trim()),
    Boolean(seo.h1Tag?.trim()),
    Boolean(seo.schemaMarkup?.trim()),
    seo.robotsIndex !== false,
    Boolean(config.sections?.length),
    Boolean(config.sections?.some((section) => section.enabled !== false)),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function cmsPagesFromSettings(settings: Record<string, unknown>): CmsPage[] {
  const globalUpdatedAt = typeof settings.updatedAt === "string" ? new Date(settings.updatedAt) : new Date();
  const globalCreatedAt = typeof settings.createdAt === "string" ? new Date(settings.createdAt) : globalUpdatedAt;

  return pageDefinitions.map(([key, title, slug, type], index) => {
    const config = (settings[key] as SettingsPageConfig | undefined) ?? {};
    const score = seoScore(config);
    const status: PageStatus = config.status
      ? config.status
      : (config.sections && config.sections.length > 0
        ? (config.sections.some((section) => section.enabled !== false) ? "Published" : "Draft")
        : "Published");

    const publishedDateStr = config.publishedAt || globalCreatedAt.toISOString();
    const updatedDateStr = config.lastUpdated || (config.publishedAt ? config.publishedAt : globalUpdatedAt.toISOString());
    const authorName = config.updatedBy || "Admin User";

    return {
      id: index + 1,
      configKey: key,
      title,
      slug,
      author: authorName,
      status,
      visibility: config.visibility || "Public",
      publishedAt: publishedDateStr,
      lastUpdated: updatedDateStr,
      seoScore: score,
      rating: score >= 90 ? "Excellent" : score >= 75 ? "Good" : "Needs Work",
      updated: formatPublishDate(updatedDateStr),
      updatedBy: authorName,
      type,
      seo: config.seo,
    };
  });
}

export function getCmsPageDefinition(id: number) {
  const definition = pageDefinitions[id - 1];
  if (!definition) return null;
  const [configKey, title, slug, type] = definition;
  return { configKey, title, slug, type };
}

export const cmsPages: CmsPage[] = cmsPagesFromSettings({});
