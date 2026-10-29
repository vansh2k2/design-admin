import type { MockRoute } from "../http";
import { defineCollection } from "../store";
import {
  ADVISORY_GRID_HEADER,
  ADVISORY_MEMBERS,
  EXHIBITION_TESTIMONIALS,
  EXHIBITOR_LIST_HEADER,
  EXHIBITOR_LIST_ITEMS,
  GALLERY_CATEGORIES,
  GALLERY_ITEMS,
  GALLERY_YEARS,
  HOME_TESTIMONIALS,
  PARTNERS_AND_BRANDS,
  VIDEO_ITEMS,
} from "../fixtures/content";

type Rows = Record<string, unknown>[];

const gallery = defineCollection("/website/gallery/items", GALLERY_ITEMS as unknown as Rows);
const videos = defineCollection("/website/gallery/video-highlights/items", VIDEO_ITEMS as unknown as Rows);
const exhibitors = defineCollection("/website/participate/exhibitor-list/items", EXHIBITOR_LIST_ITEMS as unknown as Rows);
defineCollection("/website/advisoryboardgridmember", ADVISORY_MEMBERS as unknown as Rows);

/** Single-document endpoints: GET returns the document, PUT/POST/PATCH merge into it */
function documentRoute(path: RegExp, doc: Record<string, unknown>): MockRoute {
  return {
    match: path,
    handle: ({ method, body }) => {
      if (method !== "GET" && body && typeof body === "object") Object.assign(doc, body);
      return doc;
    },
  };
}

function removeByIds(rows: Rows, ids: unknown) {
  const wanted = new Set(Array.isArray(ids) ? ids.map(String) : []);
  for (let i = rows.length - 1; i >= 0; i--) if (wanted.has(String(rows[i]?._id))) rows.splice(i, 1);
  return { deleted: wanted.size };
}

const homeTestimonials = { testimonials: HOME_TESTIMONIALS as unknown as Rows };
const exhibitionTestimonials = { testimonials: EXHIBITION_TESTIMONIALS as unknown as Rows };

/** Media library, videos, logo strips, leadership grid and testimonials (website content) */
export const contentRoutes: MockRoute[] = [
  documentRoute(/^\/website\/gallery\/meta$/, { categories: GALLERY_CATEGORIES, years: GALLERY_YEARS }),
  { method: "POST", match: /^\/website\/gallery\/items\/bulk-delete$/, handle: ({ body }) => removeByIds(gallery.items, (body as { ids?: unknown })?.ids) },
  {
    method: ["POST", "PUT", "PATCH"],
    match: /^\/website\/gallery\/items\/reorder$/,
    handle: ({ body }) => {
      for (const change of (body as { items?: { _id: string; order: number }[] })?.items ?? []) {
        const row = gallery.items.find((item) => item._id === change._id);
        if (row) row.order = change.order;
      }
      return gallery.items;
    },
  },
  { method: "POST", match: /^\/website\/gallery\/video-highlights\/items\/bulk-delete$/, handle: ({ body }) => removeByIds(videos.items, (body as { ids?: unknown })?.ids) },

  documentRoute(/^\/website\/participate\/exhibitor-list\/header$/, EXHIBITOR_LIST_HEADER),
  {
    method: "POST",
    match: /^\/website\/participate\/exhibitor-list\/items\/bulk$/,
    handle: ({ body }) => {
      const created: Rows = [];
      if (body instanceof FormData) {
        body.forEach((value) => {
          if (typeof value === "string") return;
          const name = (value as File).name?.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ") || "New brand";
          const row = { _id: `exl-${Date.now()}-${created.length}`, name, category: "RETAIL", location: "India", order: exhibitors.items.length + created.length + 1, logo: URL.createObjectURL(value), altText: `${name} logo`, status: "Published", updatedAt: new Date().toISOString() };
          created.push(row);
        });
      }
      exhibitors.items.push(...created);
      return created;
    },
  },

  {
    match: /^\/v1\/website\/home\/partners-brands$/,
    handle: ({ method, body }) => {
      if (method !== "GET" && body && typeof body === "object") Object.assign(PARTNERS_AND_BRANDS, body);
      return PARTNERS_AND_BRANDS;
    },
  },
  documentRoute(/^\/website\/advisoryboardgrid$/, ADVISORY_GRID_HEADER),
  documentRoute(/^\/website\/home\/testimonials-carousel$/, homeTestimonials),
  documentRoute(/^\/website\/participate\/why-exhibit\/testimonials$/, exhibitionTestimonials),
];
