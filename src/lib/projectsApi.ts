export type ProjectStatus = "Published" | "Draft" | "Scheduled";

export interface ProjectItem {
  id: string | number;
  _id?: string;
  title: string;
  category: string;
  location: string;
  image: string;
  imageAlt?: string;
  href: string;
  status: ProjectStatus;
  views: number;
  date: string;
  dateTime?: string;
  author: string;
  description: string;
  content?: string;
  featured?: boolean;
  galleryImages?: Array<{ image: string; altText?: string }>;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export const DEFAULT_PROJECT_CATEGORIES = [
  "Corporate Interiors",
  "Retail Showrooms",
  "Restaurant Interiors",
  "Exhibition Stalls",
  "Retail Kiosks",
  "Signage & Branding",
  "Commercial Fit-Outs",
  "Hospitality Interiors",
  "Residential Interiors",
];

export const DEFAULT_PROJECT_LOCATIONS = [
  "Gurugram, Haryana",
  "Noida, Uttar Pradesh",
  "Delhi NCR",
  "Pragati Maidan, New Delhi",
  "Various Locations",
  "New Delhi",
];

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "proj-1",
    _id: "proj-1",
    title: "DLF Corporate Office",
    category: "Corporate Interiors",
    location: "Gurugram, Haryana",
    image: "/newproject/p3.png",
    imageAlt: "DLF Corporate Office interior lounge and reception",
    href: "/portfolio/interior/corporate-interior",
    status: "Published",
    views: 1420,
    date: "28 Oct 2026",
    dateTime: "28 Oct 2026, 11:30 AM",
    author: "Design House Team",
    description: "Modern executive office interior and corporate lounge executed with premium acoustic finishes, ergonomic workstations, and bespoke reception desk.",
    featured: true,
  },
  {
    id: "proj-2",
    _id: "proj-2",
    title: "Trends – Retail Store",
    category: "Retail Showrooms",
    location: "Noida, Uttar Pradesh",
    image: "/newproject/p4.png",
    imageAlt: "Trends Retail Store showroom layout and display units",
    href: "/portfolio/interior/retail-interior",
    status: "Published",
    views: 2180,
    date: "24 Oct 2026",
    dateTime: "24 Oct 2026, 04:15 PM",
    author: "Design House Team",
    description: "Full turnkey flagship retail store design with custom display fixtures, high-efficiency directional lighting, and intuitive customer circulation paths.",
    featured: true,
  },
  {
    id: "proj-3",
    _id: "proj-3",
    title: "The Palate Restaurant",
    category: "Restaurant Interiors",
    location: "Delhi NCR",
    image: "/newproject/p5.png",
    imageAlt: "The Palate Restaurant fine dining interior and ambient lighting",
    href: "/portfolio/interior/restaurant-interior",
    status: "Published",
    views: 1890,
    date: "19 Oct 2026",
    dateTime: "19 Oct 2026, 02:00 PM",
    author: "Design House Team",
    description: "Fine dining restaurant ambiance crafted with custom acoustic ceiling baffles, warm architectural lighting, and luxurious hospitality booth seating.",
    featured: true,
  },
  {
    id: "proj-4",
    _id: "proj-4",
    title: "Bharat Organic Expo",
    category: "Exhibition Stalls",
    location: "Pragati Maidan, New Delhi",
    image: "/newproject/p6.png",
    imageAlt: "Bharat Organic Expo large exhibition stall and branding",
    href: "/portfolio/signage/exhibition-events-portfolio",
    status: "Published",
    views: 3200,
    date: "15 Oct 2026",
    dateTime: "15 Oct 2026, 10:45 AM",
    author: "Design House Team",
    description: "Large format custom exhibition pavilion built with tension fabric graphics, 3D suspended branding elements, and interactive demonstration counters.",
    featured: false,
  },
  {
    id: "proj-5",
    _id: "proj-5",
    title: "Mall Kiosk",
    category: "Retail Kiosks",
    location: "Delhi NCR",
    image: "/newproject/p7.png",
    imageAlt: "High-end commercial Mall Kiosk structure and retail counter",
    href: "/portfolio/kiosk/kiosk-images",
    status: "Published",
    views: 950,
    date: "10 Oct 2026",
    dateTime: "10 Oct 2026, 12:20 PM",
    author: "Design House Team",
    description: "High footfall commercial shopping mall kiosk fabricated with robust high-gloss acrylics, concealed lockable storage, and integrated POS spotlighting.",
    featured: false,
  },
  {
    id: "proj-6",
    _id: "proj-6",
    title: "Corporate Signage",
    category: "Signage & Branding",
    location: "Various Locations",
    image: "/newproject/p8.png",
    imageAlt: "Corporate Signage reception logo and architectural letterings",
    href: "/portfolio/signage/signage-portfolio",
    status: "Published",
    views: 1640,
    date: "04 Oct 2026",
    dateTime: "04 Oct 2026, 03:10 PM",
    author: "Design House Team",
    description: "Precision-engineered LED illuminated architectural signage, stainless steel 3D logos, and exterior pylon wayfinding monuments for corporate campuses.",
    featured: false,
  },
  {
    id: "proj-7",
    _id: "proj-7",
    title: "Office Fit-Out",
    category: "Commercial Fit-Outs",
    location: "Noida, Uttar Pradesh",
    image: "/newproject/p9.png",
    imageAlt: "Corporate Office Fit-Out workstations and glass partition cabins",
    href: "/portfolio/office-interior/modular-images",
    status: "Published",
    views: 1120,
    date: "29 Sep 2026",
    dateTime: "29 Sep 2026, 05:00 PM",
    author: "Design House Team",
    description: "Turnkey commercial office fit-out with ergonomic workstations, collaborative meeting pods, glass partition conference rooms, and integrated MEP services.",
    featured: false,
  },
  {
    id: "proj-8",
    _id: "proj-8",
    title: "Hotel Interiors",
    category: "Hospitality Interiors",
    location: "Delhi NCR",
    image: "/newproject/p10.png",
    imageAlt: "Luxury Hotel Interiors lobby and executive lounge suites",
    href: "/portfolio/interior/restaurant-interior",
    status: "Published",
    views: 2430,
    date: "22 Sep 2026",
    dateTime: "22 Sep 2026, 01:15 PM",
    author: "Design House Team",
    description: "5-star luxury hotel lobby and guest suite interior fit-out featuring bespoke Italian marble paneling, decorative chandeliers, and custom millwork.",
    featured: false,
  },
  {
    id: "proj-9",
    _id: "proj-9",
    title: "Luxury Residence",
    category: "Residential Interiors",
    location: "New Delhi",
    image: "/newproject/p11.png",
    imageAlt: "Luxury Residence master bedroom and bespoke wardrobes",
    href: "/portfolio/furniture/wardrobes-images",
    status: "Published",
    views: 1780,
    date: "14 Sep 2026",
    dateTime: "14 Sep 2026, 11:00 AM",
    author: "Design House Team",
    description: "High-end private residence interior with custom modular wardrobes, acoustic wall paneling, Italian veneer finishes, and smart home lighting scenes.",
    featured: false,
  },
];

const STORAGE_KEY = "admin_projects_data";

export const projectsApi = {
  list: async (): Promise<ProjectItem[]> => {
    if (typeof window === "undefined") return INITIAL_PROJECTS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error reading projects from storage:", e);
    }
    // Initialize storage with defaults
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    } catch {}
    return INITIAL_PROJECTS;
  },

  get: async (idOrSlug: string | number): Promise<ProjectItem | null> => {
    const list = await projectsApi.list();
    const str = String(idOrSlug).toLowerCase();
    const found = list.find(
      (p) =>
        String(p.id).toLowerCase() === str ||
        String(p._id).toLowerCase() === str ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") === str ||
        p.href.toLowerCase().endsWith(str)
    );
    return found || null;
  },

  saveAll: async (items: ProjectItem[]): Promise<void> => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Error saving projects:", e);
    }
  },

  create: async (data: Partial<ProjectItem>): Promise<ProjectItem> => {
    const list = await projectsApi.list();
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

    const newProject: ProjectItem = {
      id: `proj-${Date.now()}`,
      _id: `proj-${Date.now()}`,
      title: data.title || "New Project",
      category: data.category || "Corporate Interiors",
      location: data.location || "Delhi NCR",
      image: data.image || "/newproject/p1.png",
      imageAlt: data.imageAlt || `${data.title || "New Project"} image`,
      href: data.href || `/portfolio/interior/${(data.title || "new-project").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      status: data.status || "Published",
      views: data.views ?? 0,
      date: dateFormatted,
      dateTime: `${dateFormatted}, ${timeFormatted}`,
      author: data.author || "Design House Admin",
      description: data.description || "",
      content: data.content || "",
      featured: Boolean(data.featured),
      galleryImages: data.galleryImages || [],
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.description,
      metaKeywords: data.metaKeywords || "",
    };

    const updated = [newProject, ...list];
    await projectsApi.saveAll(updated);
    return newProject;
  },

  update: async (id: string | number, data: Partial<ProjectItem>): Promise<ProjectItem> => {
    const list = await projectsApi.list();
    const index = list.findIndex(
      (p) => String(p.id) === String(id) || String(p._id) === String(id)
    );
    if (index === -1) {
      throw new Error(`Project ${id} not found`);
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

    const updatedItem: ProjectItem = {
      ...list[index],
      ...data,
      date: dateFormatted,
      dateTime: `${dateFormatted}, ${timeFormatted}`,
    };

    list[index] = updatedItem;
    await projectsApi.saveAll(list);
    return updatedItem;
  },

  delete: async (id: string | number): Promise<boolean> => {
    const list = await projectsApi.list();
    const filtered = list.filter(
      (p) => String(p.id) !== String(id) && String(p._id) !== String(id)
    );
    await projectsApi.saveAll(filtered);
    return true;
  },

  resetDefaults: async (): Promise<ProjectItem[]> => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
      } catch {}
    }
    return INITIAL_PROJECTS;
  },
};
