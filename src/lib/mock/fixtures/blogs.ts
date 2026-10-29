import type { BlogCategory } from "@/lib/blogCategoriesApi";
import type { BlogExpert } from "@/lib/blogExpertsApi";
import type { BlogReport } from "@/lib/blogReportsApi";
import type { BlogUpdate } from "@/lib/blogUpdatesApi";
import type { BlogPostItem } from "@/lib/blogsApi";

import { daysAgo, daysAhead } from "./common";

/* Blog & Insights — the first two posts are live on designhouse.co.in; the rest are sample drafts */

const project = (file: string) => `/images/dh/projects/${file}`;

interface PostSeed {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  status: BlogPostItem["status"];
  days: number;
  views: number;
  featured?: boolean;
}

const POSTS: PostSeed[] = [
  { title: "Smart Interior Design Ideas for Small Apartments That Maximize Space", slug: "smart-small-apartment-interior-design-ideas", excerpt: "Explore smart interior design ideas for small apartments. Learn how to maximize space with modular furniture, smart storage, and modern decor concepts.", category: "Interior Design", image: "/images/dh/blogs/blog-1772432228062-ie4rwkglgxb.jpg", status: "published", days: 236, views: 69, featured: true },
  { title: "Top 10 Modern Interior Design Ideas to Transform Your Home in 2026", slug: "modern-interior-design-ideas-to-transform-your-home-in-2026", excerpt: "Discover the top 10 modern interior design ideas that can instantly transform your home — from minimalist living rooms to luxury bedroom concepts.", category: "Interior Design", image: "/images/dh/blogs/blog-1772432015677-96ygoajvbfg.jpeg", status: "published", days: 236, views: 36, featured: true },
  { title: "How to Plan a Retail Store Rollout Across Multiple Cities", slug: "plan-retail-store-rollout-multiple-cities", excerpt: "A practical checklist for brands opening 5+ stores: master design, modular fixtures, vendor coordination and handover.", category: "Retail Design", image: project("retail-fashion-store.jpg"), status: "published", days: 41, views: 412 },
  { title: "Exhibition Stall Design: 7 Mistakes That Cost You Footfall", slug: "exhibition-stall-design-mistakes", excerpt: "From cluttered graphics to poor lighting — what to avoid when designing your next trade-fair stall.", category: "Exhibitions", image: project("exhibition-stall-custom.png"), status: "published", days: 28, views: 538 },
  { title: "Designing Offices for Hybrid Teams", slug: "designing-offices-for-hybrid-teams", excerpt: "Hot desks, focus pods and collaboration zones: how to plan a workplace people actually want to come to.", category: "Corporate Interiors", image: project("corporate-office-open-plan.jpg"), status: "published", days: 15, views: 286 },
  { title: "Mall Kiosk Design Guide: Size, Materials and Cost", slug: "mall-kiosk-design-guide", excerpt: "Everything brands should know before ordering a retail kiosk for a mall or airport.", category: "Retail Design", image: project("retail-display-gondolas.jpg"), status: "draft", days: 3, views: 0 },
  { title: "Restaurant Lighting Ideas That Lift the Dining Experience", slug: "restaurant-lighting-ideas", excerpt: "Layered lighting, warm tones and focal fixtures — lighting tips from our hospitality projects.", category: "Hospitality", image: project("restaurant-warm-interior.webp"), status: "scheduled", days: -5, views: 0 },
];

const AUTHORS = ["Pooja Malhotra", "Rahul Verma", "Karan Mehta"];

export const BLOG_POSTS: BlogPostItem[] = POSTS.map((p, i) => ({
  _id: `blog-${i + 1}`,
  title: p.title,
  h1Title: p.title,
  slug: p.slug,
  excerpt: p.excerpt,
  content: `<p>${p.excerpt}</p><h2>Key takeaways</h2><ul><li>Start with a clear brief and budget.</li><li>Choose durable, easy-to-maintain materials.</li><li>Work with one turnkey partner from design to handover.</li></ul><p>Talk to the Design House team for a free consultation.</p>`,
  category: p.category,
  author: i < 2 ? "admin" : AUTHORS[i % 3] ?? "admin",
  tags: [p.category.toLowerCase(), "design house"],
  status: p.status,
  showOnHome: p.status === "published" && i < 4,
  featured: Boolean(p.featured),
  scheduledDate: p.status === "scheduled" ? daysAhead(5, 10) : null,
  readTime: `${4 + (i % 4)} min read`,
  image: p.image,
  imageAlt: p.title,
  views: p.views,
  publishDate: p.days >= 0 ? daysAgo(p.days, 11) : daysAhead(-p.days, 10),
  metaTitle: p.title.slice(0, 60),
  metaDescription: p.excerpt.slice(0, 155),
  createdAt: daysAgo(Math.max(p.days, 1), 10),
  updatedAt: daysAgo(Math.max(p.days - 1, 0), 16),
  updatedBy: "Karan Mehta",
}));

const CATEGORY_SEEDS: [string, BlogCategory["icon"], BlogCategory["color"], string][] = [
  ["Interior Design", "lightbulb", "sky", "Ideas and trends for homes and workplaces"],
  ["Retail Design", "package", "orange", "Store design, fixtures and visual merchandising"],
  ["Exhibitions", "megaphone", "violet", "Trade-fair stalls and event experiences"],
  ["Corporate Interiors", "users", "indigo", "Offices, cabins and collaboration spaces"],
  ["Hospitality", "heart", "rose", "Restaurants, cafes and QSR interiors"],
  ["Company News", "newspaper", "slate", "Project launches and announcements"],
];

export const BLOG_CATEGORIES: BlogCategory[] = CATEGORY_SEEDS.map(([name, icon, color, description], i) => ({
  _id: `cat-${i + 1}`,
  name,
  slug: name.toLowerCase().replace(/[^a-z]+/g, "-"),
  description,
  icon,
  color,
  status: i === 5 ? "hidden" : "published",
  order: i + 1,
  postCount: BLOG_POSTS.filter((p) => p.category === name).length,
  createdAt: daysAgo(200),
  updatedAt: daysAgo(20),
}));

export const BLOG_EXPERTS: BlogExpert[] = [
  { name: "Vijay Sharma", role: "Managing Director, Design House", quote: "A great space is planned around how people move, shop and work — not just how it looks.", image: "/images/dh/team/member-1770966833568-905181984.jpg" },
  { name: "Pooja Malhotra", role: "Lead Interior Designer", quote: "Good retail design makes the product the hero and the store effortless to navigate.", image: "/images/dh/projects/team-designer.webp" },
  { name: "Vipin Sharma", role: "Senior Manager — Projects", quote: "On-time handover comes from planning the factory and the site together.", image: "/images/dh/team/member-1770966897670-298975281.jpg" },
].map((e, i) => ({ _id: `exp-${i + 1}`, ...e, status: "published" as const, order: i + 1, createdAt: daysAgo(90), updatedAt: daysAgo(30) }));

export const BLOG_REPORTS: BlogReport[] = [
  { title: "Design House Company Profile 2026", description: "Our services, manufacturing setup and 5000+ project portfolio.", fileName: "dhipl-profile.pdf", fileSize: 4_812_000, downloads: 342 },
  { title: "Retail Display Catalogue", description: "Gondolas, wall bays, kiosks and shop-in-shop counters.", fileName: "retail-display-catalogue.pdf", fileSize: 6_204_000, downloads: 218 },
  { title: "Exhibition Stall Portfolio", description: "Selected custom and island stalls from recent trade fairs.", fileName: "exhibition-portfolio.pdf", fileSize: 8_930_000, downloads: 164 },
].map((r, i) => ({ _id: `rep-${i + 1}`, ...r, fileUrl: `/api/files/pdf?url=/downloads/${r.fileName}`, status: "published" as const, order: i + 1, createdAt: daysAgo(60 - i * 10), updatedAt: daysAgo(10) }));

export const BLOG_UPDATES: BlogUpdate[] = [
  { tag: "Project", title: "6-store fashion rollout completed in NCR", description: "Master design replicated across six stores in eight weeks.", image: project("retail-fashion-store.jpg"), readMinutes: 3, link: "/portfolio" },
  { tag: "Exhibition", title: "12 stalls delivered at IHGF Delhi Fair", description: "Custom stalls designed, fabricated and installed for 12 brands.", image: project("exhibition-hall.png"), readMinutes: 2, link: "/services/exhibitions" },
  { tag: "Hiring", title: "We are hiring designers and project managers", description: "Four new openings on our Careers page.", image: project("team-planning.webp"), readMinutes: 1, link: "/career" },
].map((u, i) => ({ _id: `upd-${i + 1}`, ...u, date: daysAgo(i * 9 + 2), status: "published" as const, order: i + 1, createdAt: daysAgo(i * 9 + 2), updatedAt: daysAgo(i * 9 + 1) }));
