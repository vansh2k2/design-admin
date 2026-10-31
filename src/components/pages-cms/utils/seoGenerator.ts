import type { CmsPage } from "@/lib/cmsPages";

// Builds a page's canonical URL, Open Graph tags and JSON-LD schema from its title, description and URL
// ("Auto Generate" in the SEO panel). Runs in the browser; nothing is saved until the page is saved.

const LIVE_SITE_URL = "https://www.designhouse.co.in";
const LOCAL_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3010").replace(/\/$/, "");

const COMPANY = {
  name: "Design House India Pvt. Ltd.",
  shortName: "Design House India",
  email: "info@designhouse.co.in",
  phone: "+91 9654900525",
  address: {
    streetAddress: "Plot No. 12/29, Site-II Industrial Area, Loni Road, Mohan Nagar",
    addressLocality: "Ghaziabad",
    addressRegion: "Uttar Pradesh",
    postalCode: "201007",
    addressCountry: "IN",
  },
};

// Shown in link previews (WhatsApp, Facebook…) when the page has no OG image of its own: the office
// photo on Cloudinary, cropped to the 1200×630 size share previews expect
export const DEFAULT_SHARE_IMAGE =
  "https://res.cloudinary.com/dqbjxbk6m/image/upload/c_fill,w_1200,h_630,q_auto,f_jpg/v1793442065/design-house/home-hero/hero-2.webp";
const LOGO = "/logobg.png";

export interface GeneratedSeo {
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  openGraphTags: string;
  schemaMarkup: string;
}

const escapeAttr = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pagePath = (page: CmsPage) => {
  const slug = (page.slug || "/").trim();
  if (!slug || slug === "/") return "/";
  return (slug.startsWith("/") ? slug : `/${slug}`).replace(/\/+$/, "");
};

// schema.org page type by URL
const pageType = (path: string) => {
  if (path === "/contact") return "ContactPage";
  if (path === "/about") return "AboutPage";
  if (path === "/blogs" || path === "/projects" || path === "/clients" || path === "/downloads") return "CollectionPage";
  return "WebPage";
};

export function generatePageSeo(
  page: CmsPage,
  current: { metaTitle?: string; metaDescription?: string; ogImage?: string },
  envType: "local" | "live",
): GeneratedSeo {
  const base = envType === "live" ? LIVE_SITE_URL : LOCAL_SITE_URL;
  const path = pagePath(page);
  const url = `${base}${path === "/" ? "/" : path}`;

  const metaTitle = (current.metaTitle || "").trim() || (path === "/" ? COMPANY.shortName : `${page.title} | ${COMPANY.shortName}`);
  const metaDescription =
    (current.metaDescription || "").trim() ||
    `${page.title} — ${COMPANY.shortName}: interiors, retail display and exhibition solutions with in-house manufacturing and pan-India execution.`;
  const image = (current.ogImage || "").trim() || DEFAULT_SHARE_IMAGE;

  const openGraphTags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeAttr(COMPANY.shortName)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${escapeAttr(metaTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(metaDescription)}" />`,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(metaTitle)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(metaTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(metaDescription)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ].join("\n");

  const organization = {
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: COMPANY.name,
    url: `${base}/`,
    logo: `${base}${LOGO}`,
    email: COMPANY.email,
    telephone: COMPANY.phone,
    address: { "@type": "PostalAddress", ...COMPANY.address },
  };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      ...(path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: page.title, item: url }]),
    ],
  };

  const webPage = {
    "@type": pageType(path),
    "@id": `${url}#webpage`,
    url,
    name: metaTitle,
    description: metaDescription,
    inLanguage: "en-IN",
    isPartOf: { "@type": "WebSite", "@id": `${base}/#website`, url: `${base}/`, name: COMPANY.shortName },
    about: { "@id": `${base}/#organization` },
    primaryImageOfPage: { "@type": "ImageObject", url: image },
  };

  // Service detail pages also describe the service itself
  const service = path.startsWith("/services/")
    ? [{ "@type": "Service", name: page.title, description: metaDescription, url, provider: { "@id": `${base}/#organization` }, areaServed: "IN" }]
    : [];

  const schema = { "@context": "https://schema.org", "@graph": [organization, webPage, breadcrumb, ...service] };
  const schemaMarkup = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;

  return { canonicalUrl: url, metaTitle, metaDescription, openGraphTags, schemaMarkup };
}
