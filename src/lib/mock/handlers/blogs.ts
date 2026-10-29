import type { MockRoute } from "../http";
import { BLOG_CATEGORIES, BLOG_EXPERTS, BLOG_POSTS, BLOG_REPORTS, BLOG_UPDATES } from "../fixtures/blogs";
import { defineCollection } from "../store";

type Rows = Record<string, unknown>[];

const posts = defineCollection("/blogs", BLOG_POSTS as unknown as Rows, {
  list: (items, { query }) => {
    const search = (query.get("search") ?? "").toLowerCase();
    const rows = items.filter((p) => {
      if (query.get("status") && p.status !== query.get("status")) return false;
      if (query.get("category") && p.category !== query.get("category")) return false;
      if (query.get("featured") === "true" && !p.featured) return false;
      if (query.get("showOnHome") === "true" && !p.showOnHome) return false;
      return !search || String(p.title).toLowerCase().includes(search);
    });
    return { posts: rows, total: rows.length, page: 1, totalPages: 1 };
  },
});
defineCollection("/blog-categories", BLOG_CATEGORIES as unknown as Rows);
defineCollection("/blog-experts", BLOG_EXPERTS as unknown as Rows);
defineCollection("/blog-reports", BLOG_REPORTS as unknown as Rows);
defineCollection("/blog-updates", BLOG_UPDATES as unknown as Rows);

/** Lists of the blog sub-modules live at /<module>/admin; a post can also be opened by its slug */
export const blogRoutes: MockRoute[] = [
  { method: "GET", match: /^\/blog-categories\/admin$/, handle: () => BLOG_CATEGORIES },
  { method: "GET", match: /^\/blog-experts\/admin$/, handle: () => BLOG_EXPERTS },
  { method: "GET", match: /^\/blog-reports\/admin$/, handle: () => BLOG_REPORTS },
  { method: "GET", match: /^\/blog-updates\/admin$/, handle: () => BLOG_UPDATES },
  {
    method: "GET",
    match: /^\/blogs\/([^/]+)$/,
    handle: ({ params }) => posts.items.find((p) => p._id === params[0] || p.slug === params[0]) ?? null,
  },
];
