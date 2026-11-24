export const seoRoutes = [
  {
    path: "/",
    label: "Home",
    title: "Design House India - Premier Turnkey Interior Design, Exhibition Stalls & Retail Fixtures",
    description: "Design House India is a leading turnkey interior design, commercial office fit-out, retail kiosk manufacturer, and exhibition stall fabrication company in Delhi NCR, Mumbai, and pan-India.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Design House India", "Turnkey Interior Design", "Commercial Office Interiors", "Exhibition Stall Fabrication", "Retail Kiosks India"],
  },
  {
    path: "/about",
    label: "About Us",
    title: "About Design House India - Premier Interior Architecture & Fit-Out Contractors",
    description: "Learn about Design House India, our end-to-end turnkey interior design capabilities, in-house manufacturing facilities, and award-winning architectural craftsmanship.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["About Design House India", "Interior Fit-Out Contractor", "Commercial Architects India", "Turnkey Interior Solutions"],
  },
  {
    path: "/services",
    label: "Services",
    title: "Interior Design, Fit-Outs & Fabrication Services - Design House India",
    description: "Explore our comprehensive services: commercial office interiors, exhibition stall design & fabrication, retail display kiosks, and modular restaurant furniture.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Interior Design Services", "Turnkey Fit-Outs", "Exhibition Design Services", "Retail Fixtures", "Office Interiors Delhi"],
  },
  {
    path: "/portfolio",
    label: "Portfolio",
    title: "Our Work & Completed Projects - Design House India",
    description: "Browse our turnkey project portfolio featuring premium corporate offices, retail mall kiosks, luxury restaurant interiors, and bespoke exhibition pavilions.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Design House Portfolio", "Office Interior Case Studies", "Exhibition Stall Photos", "Retail Store Projects"],
  },
  {
    path: "/gallery",
    label: "Gallery",
    title: "Project Photo Gallery - Design House India",
    description: "Explore high-resolution photography of our manufactured retail kiosks, exhibition stalls at Pragati Maidan, and modern workplace interior fit-outs.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Design House Gallery", "Interior Design Photos", "Exhibition Stall Pictures", "Retail Kiosk Designs"],
  },
  {
    path: "/blogs",
    label: "Blog & Insights",
    title: "Interior Architecture & Exhibition Insights - Design House India",
    description: "Read latest articles on corporate workplace design, retail visual merchandising trends, trade fair stall ROI, and sustainable architectural materials.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Interior Design Blog", "Commercial Fit-Out Trends", "Exhibition Stall Advice", "Retail Merchandising Guide"],
  },
  {
    path: "/careers",
    label: "Careers",
    title: "Careers & Job Opportunities - Design House India",
    description: "Join our talented team of 3D visualizers, interior architects, project managers, and fabrication engineers at Design House India.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Interior Design Careers", "Architect Jobs Delhi NCR", "Exhibition Designer Vacancies", "Turnkey Project Manager"],
  },
  {
    path: "/contact-us",
    label: "Contact Us",
    title: "Contact Design House India - Turnkey Interior Design & Stalls",
    description: "Get in touch with Design House India for your upcoming office interior fit-out, retail kiosk rollout, or exhibition stall fabrication requirements.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Contact Design House", "Interior Design Quotation", "Exhibition Stall Fabricator Contact", "Delhi NCR Office Designers"],
  },
  {
    path: "/faqs",
    label: "FAQs",
    title: "Frequently Asked Questions - Design House India",
    description: "Find answers to common questions about our turnkey interior design timelines, pricing, exhibition stall fabrication process, and warranties.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Design House FAQs", "Interior Fit-Out Cost FAQ", "Exhibition Stall Fabrication Questions"],
  },
  {
    path: "/testimonials",
    label: "Client Testimonials",
    title: "Client Reviews & Testimonials - Design House India",
    description: "Discover what leading corporate enterprises, retail brands, and exhibitors say about partnering with Design House India.",
    ogImage: "https://www.designhouse.co.in/og-banner.webp",
    keywords: ["Design House Reviews", "Interior Contractor Testimonials", "Exhibition Fabricator Ratings"],
  },
];

export const pageKeyToPathMap: Record<string, string> = {
  landing: "/",
  home: "/",
  about: "/about",
  services: "/services",
  portfolio: "/portfolio",
  gallery: "/gallery",
  blogs: "/blogs",
  blog: "/blogs",
  careers: "/careers",
  "contact-us": "/contact-us",
  contact: "/contact-us",
  faqs: "/faqs",
  testimonials: "/testimonials",
};

export function getFallbackSeo(pageKey: string) {
  const cleanKey = (pageKey || "").replace(/^\//, "");
  const path = pageKeyToPathMap[cleanKey] || `/${cleanKey}`;
  const route = seoRoutes.find((r) => r.path === path) || seoRoutes[0];
  if (!route) return null;

  return {
    metaTitle: route.title,
    metaDescription: route.description,
    metaKeywords: route.keywords.join(", "),
    ogTitle: route.title,
    ogDescription: route.description,
    ogImage: route.ogImage,
    canonicalUrl: `https://www.designhouse.co.in${route.path}`,
    breadcrumbName: route.label,
  };
}
