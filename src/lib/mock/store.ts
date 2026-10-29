import type { MockContext } from "./http";

/*
 * In-memory CRUD for list-style endpoints (GET/POST base, GET/PUT/PATCH/DELETE base/:id), so adding,
 * editing and deleting work for the session. Data resets on a full page reload.
 */

type Item = Record<string, unknown>;

interface CollectionOptions {
  /** Shape the GET list response, e.g. wrap it as { items, total } for paginated endpoints */
  list?: (items: Item[], ctx: MockContext) => unknown;
}

interface Collection {
  base: string;
  items: Item[];
  options: CollectionOptions;
  handle: (ctx: MockContext) => unknown;
}

const collections: Collection[] = [];

let seq = 0;
const newId = () => `dh-${Date.now().toString(36)}-${(seq++).toString(36)}`;

const idOf = (item: Item) => String(item._id ?? item.id ?? "");

/** FormData bodies (uploads, multipart forms) become plain objects; files become local preview URLs. */
function toObject(body: unknown): Item {
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const out: Item = {};
    body.forEach((value, key) => {
      out[key] = typeof value === "string" ? value : URL.createObjectURL(value);
    });
    return out;
  }
  return body && typeof body === "object" ? (body as Item) : {};
}

export function defineCollection(base: string, items: Item[], options: CollectionOptions = {}) {
  const collection: Collection = {
    base,
    items: items.map((item) => ({ ...item })),
    options,
    handle(ctx) {
      const rest = ctx.pathname.slice(base.length).split("/").filter(Boolean);
      const id = rest[0];
      const now = new Date().toISOString();

      if (!id) {
        if (ctx.method === "GET") return options.list ? options.list(this.items, ctx) : this.items;
        if (ctx.method === "POST") {
          const created = { _id: newId(), createdAt: now, updatedAt: now, ...toObject(ctx.body) };
          this.items.unshift(created);
          return created;
        }
        return { success: true };
      }

      const index = this.items.findIndex((item) => idOf(item) === id);
      const current = this.items[index];
      if (ctx.method === "GET") return current ?? null;
      if (ctx.method === "DELETE") {
        if (index >= 0) this.items.splice(index, 1);
        return { _id: id, deleted: true };
      }
      // PUT/PATCH on the item or on an action below it (…/:id/status, …/:id/publish)
      const updated = { ...(current ?? { _id: id }), ...toObject(ctx.body), updatedAt: now };
      if (index >= 0) this.items[index] = updated;
      return updated;
    },
  };
  collections.push(collection);
  return collection;
}

export function collectionFor(pathname: string) {
  return collections
    .filter((c) => pathname === c.base || pathname.startsWith(`${c.base}/`))
    .sort((a, b) => b.base.length - a.base.length)[0];
}
