import {
  DETAIL_SEEDS,
  emptyServiceDetail,
  type ServiceDetailData,
} from "./servicesDetailSeed";

export type { ServiceDetailData };

export type ServiceStatus = "Published" | "Draft" | "Scheduled";

const withDetail = (s: ServiceItem): ServiceItem => ({
  ...s,
  detail:
    s.detail ||
    DETAIL_SEEDS[String(s._id || s.id)] ||
    emptyServiceDetail(s.title.replace(/\n/g, " ")),
});

export interface ServiceItem {
  id: string | number;
  _id?: string;
  title: string;
  desc: string;
  image: string;
  imageAlt?: string;
  logo?: string;
  href: string;
  status: ServiceStatus;
  views: number;
  date: string;
  dateTime?: string;
  author: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  detail?: ServiceDetailData;
}

export const DEFAULT_SERVICE_LINKS = [
  "/services/corporate-interiors",
  "/services/retail-showrooms",
  "/services/restaurant-interiors",
  "/services/exhibition-stalls",
  "/services/retail-kiosks",
  "/services/display-fixtures",
  "/services/signage-branding",
  "/services/manufacturing-execution",
  "/services/residential-interiors",
  "/services/ensis",
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "svc-1",
    _id: "svc-1",
    title: "Corporate Interiors",
    desc: "Workspaces designed for\nproductivity, brand identity\nand growth.",
    image: "/services/os1.webp",
    imageAlt: "Corporate Interiors workspace",
    href: "/services/corporate-interiors",
    status: "Published",
    views: 2450,
    date: "28 Oct 2026",
    dateTime: "28 Oct 2026, 11:30 AM",
    author: "Design House Team",
    metaTitle: "Corporate Interiors | Design House India",
    metaDescription: "Workspaces designed for productivity, brand identity and growth.",
  },
  {
    id: "svc-2",
    _id: "svc-2",
    title: "Retail Showroom\nInteriors",
    desc: "Elegant and engaging\nshowrooms that bring your\nbrand to life.",
    image: "/services/os2.webp",
    imageAlt: "Retail Showroom Interiors",
    href: "/services/retail-showrooms",
    status: "Published",
    views: 1980,
    date: "24 Oct 2026",
    dateTime: "24 Oct 2026, 04:15 PM",
    author: "Design House Team",
    metaTitle: "Retail Showroom Interiors | Design House India",
    metaDescription: "Elegant and engaging showrooms that bring your brand to life.",
  },
  {
    id: "svc-3",
    _id: "svc-3",
    title: "Restaurant\nInteriors",
    desc: "Inviting dining spaces with\nthe perfect balance of\nambience and functionality.",
    image: "/services/os3.webp",
    imageAlt: "Restaurant Interiors dining space",
    href: "/services/restaurant-interiors",
    status: "Published",
    views: 1760,
    date: "19 Oct 2026",
    dateTime: "19 Oct 2026, 02:00 PM",
    author: "Design House Team",
    metaTitle: "Restaurant Interiors | Design House India",
    metaDescription: "Inviting dining spaces with the perfect balance of ambience and functionality.",
  },
  {
    id: "svc-4",
    _id: "svc-4",
    title: "Exhibition Stall\nDesign & Build",
    desc: "Creative and high-impact\nstalls that make your brand\nstand out at every event.",
    image: "/services/os4.webp",
    imageAlt: "Exhibition Stall Design and Build",
    href: "/services/exhibition-stalls",
    status: "Published",
    views: 3120,
    date: "15 Oct 2026",
    dateTime: "15 Oct 2026, 10:45 AM",
    author: "Design House Team",
    metaTitle: "Exhibition Stall Design & Build | Design House India",
    metaDescription: "Creative and high-impact stalls that make your brand stand out at every event.",
  },
  {
    id: "svc-5",
    _id: "svc-5",
    title: "Retail Kiosks",
    desc: "Compact, stylish and\nfunctional kiosks designed\nto maximise visibility\nand sales.",
    image: "/services/os5.webp",
    imageAlt: "Retail Kiosks",
    href: "/services/retail-kiosks",
    status: "Published",
    views: 1340,
    date: "10 Oct 2026",
    dateTime: "10 Oct 2026, 12:20 PM",
    author: "Design House Team",
    metaTitle: "Retail Kiosks | Design House India",
    metaDescription: "Compact, stylish and functional kiosks designed to maximise visibility and sales.",
  },
  {
    id: "svc-6",
    _id: "svc-6",
    title: "Retail Display\nFixtures",
    desc: "Custom display fixtures that\nhighlight your products and\nenhance the shopping\nexperience.",
    image: "/services/os6.webp",
    imageAlt: "Retail Display Fixtures",
    href: "/services/display-fixtures",
    status: "Published",
    views: 1120,
    date: "04 Oct 2026",
    dateTime: "04 Oct 2026, 03:10 PM",
    author: "Design House Team",
    metaTitle: "Retail Display Fixtures | Design House India",
    metaDescription: "Custom display fixtures that highlight your products and enhance the shopping experience.",
  },
  {
    id: "svc-7",
    _id: "svc-7",
    title: "Signage &\nBranding",
    desc: "Impactful signage and\nbranding solutions that\nstrengthen your brand\nidentity.",
    image: "/services/os7.webp",
    imageAlt: "Signage and Branding solutions",
    href: "/services/signage-branding",
    status: "Published",
    views: 1590,
    date: "29 Sep 2026",
    dateTime: "29 Sep 2026, 05:00 PM",
    author: "Design House Team",
    metaTitle: "Signage & Branding | Design House India",
    metaDescription: "Impactful signage and branding solutions that strengthen your brand identity.",
  },
  {
    id: "svc-8",
    _id: "svc-8",
    title: "Manufacturing\n& Execution",
    desc: "In-house manufacturing\nand professional execution\nto ensure quality and\ntimely delivery.",
    image: "/services/os8.webp",
    imageAlt: "Manufacturing and Execution",
    href: "/services/manufacturing-execution",
    status: "Published",
    views: 980,
    date: "22 Sep 2026",
    dateTime: "22 Sep 2026, 01:15 PM",
    author: "Design House Team",
    metaTitle: "Manufacturing & Execution | Design House India",
    metaDescription: "In-house manufacturing and professional execution to ensure quality and timely delivery.",
  },
  {
    id: "svc-9",
    _id: "svc-9",
    title: "Residential\nInteriors",
    desc: "Beautiful, functional and\ntimeless homes designed\nto reflect your lifestyle.",
    image: "/services/os9.webp",
    imageAlt: "Residential Interiors",
    href: "/services/residential-interiors",
    status: "Published",
    views: 2210,
    date: "14 Sep 2026",
    dateTime: "14 Sep 2026, 11:00 AM",
    author: "Design House Team",
    metaTitle: "Residential Interiors | Design House India",
    metaDescription: "Beautiful, functional and timeless homes designed to reflect your lifestyle.",
  },
  {
    id: "svc-10",
    _id: "svc-10",
    title: "Spa & Panchkarma\nFurniture",
    desc: "Premium spa and panchkarma\nfurniture that blends traditional\nwellness practices with\nmodern design.",
    image: "/services/os10.webp",
    imageAlt: "Spa and Panchkarma Furniture",
    logo: "/services/ensis.jpeg",
    href: "/services/ensis",
    status: "Published",
    views: 870,
    date: "08 Sep 2026",
    dateTime: "08 Sep 2026, 02:40 PM",
    author: "Design House Team",
    metaTitle: "Spa & Panchkarma Furniture | Design House India",
    metaDescription: "Premium spa and panchkarma furniture that blends traditional wellness practices with modern design.",
  },
];

const STORAGE_KEY = "admin_services_data";

export const servicesApi = {
  list: async (): Promise<ServiceItem[]> => {
    if (typeof window === "undefined") return INITIAL_SERVICES.map(withDetail);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return (parsed as ServiceItem[]).map(withDetail);
        }
      }
    } catch (e) {
      console.warn("Error reading services from storage:", e);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
    } catch {}
    return INITIAL_SERVICES.map(withDetail);
  },

  get: async (idOrSlug: string | number): Promise<ServiceItem | null> => {
    const list = await servicesApi.list();
    const str = String(idOrSlug).toLowerCase();
    const found = list.find(
      (s) =>
        String(s.id).toLowerCase() === str ||
        String(s._id).toLowerCase() === str ||
        s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === str ||
        s.href.toLowerCase().endsWith(str)
    );
    return found ? withDetail(found) : null;
  },

  saveAll: async (items: ServiceItem[]): Promise<void> => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Error saving services:", e);
    }
  },

  create: async (data: Partial<ServiceItem>): Promise<ServiceItem> => {
    const list = await servicesApi.list();
    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeFormatted = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newService: ServiceItem = {
      id: `svc-${Date.now()}`,
      _id: `svc-${Date.now()}`,
      title: data.title || "New Service",
      desc: data.desc || "",
      image: data.image || "/services/os1.webp",
      imageAlt: data.imageAlt || `${(data.title || "New Service").replace(/\n/g, " ")} image`,
      logo: data.logo || "",
      href: data.href || `/services/${(data.title || "new-service").replace(/\n/g, " ").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
      status: data.status || "Published",
      views: data.views ?? 0,
      date: dateFormatted,
      dateTime: `${dateFormatted}, ${timeFormatted}`,
      author: data.author || "Design House Admin",
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.desc,
      metaKeywords: data.metaKeywords || "",
      detail: data.detail || emptyServiceDetail((data.title || "New Service").replace(/\n/g, " ")),
    };

    const updated = [newService, ...list];
    await servicesApi.saveAll(updated);
    return newService;
  },

  update: async (id: string | number, data: Partial<ServiceItem>): Promise<ServiceItem> => {
    const list = await servicesApi.list();
    const index = list.findIndex(
      (s) => String(s.id) === String(id) || String(s._id) === String(id)
    );
    if (index === -1) {
      throw new Error(`Service ${id} not found`);
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const timeFormatted = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updatedItem: ServiceItem = {
      ...list[index],
      ...data,
      date: dateFormatted,
      dateTime: `${dateFormatted}, ${timeFormatted}`,
    };

    list[index] = updatedItem;
    await servicesApi.saveAll(list);
    return updatedItem;
  },

  delete: async (id: string | number): Promise<boolean> => {
    const list = await servicesApi.list();
    const filtered = list.filter(
      (s) => String(s.id) !== String(id) && String(s._id) !== String(id)
    );
    await servicesApi.saveAll(filtered);
    return true;
  },

  resetDefaults: async (): Promise<ServiceItem[]> => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SERVICES));
      } catch {}
    }
    return INITIAL_SERVICES.map(withDetail);
  },
};
