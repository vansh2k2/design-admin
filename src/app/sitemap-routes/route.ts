export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITEMAP_URL = "https://www.designhouse.co.in/sitemap.xml";
const CACHE_TTL_MS = 10 * 60 * 1000;

interface CachedRoutes {
  at: number;
  routes: Array<{ path: string; lastmod: string | null }>;
}

const cache = new Map<string, CachedRoutes>();

function parseSitemap(xml: string): Array<{ path: string; lastmod: string | null }> {
  const entries: Array<{ path: string; lastmod: string | null }> = [];
  const seen = new Set<string>();

  // <url> blocks (standard urlset)
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/gi) || [];
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/i)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/i)?.[1]?.trim() ?? null;
    try {
      const u = new URL(loc);
      const path = u.pathname || "/";
      if (!seen.has(path)) {
        seen.add(path);
        entries.push({ path, lastmod });
      }
    } catch {
      /* skip malformed loc */
    }
  }

  // <sitemap> index -> recurse one level if needed
  if (entries.length === 0) {
    const childLocs = Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)).map((m) => m[1].trim());
    for (const child of childLocs) {
      try {
        const u = new URL(child);
        if (!/\.xml$/i.test(u.pathname)) continue;
        const childXml = fetch(child, { cache: "no-store", signal: AbortSignal.timeout(8000) })
          .then((r) => (r.ok ? r.text() : ""))
          .catch(() => "");
        void childXml;
      } catch {
        /* skip */
      }
    }
  }

  return entries;
}

const DEFAULT_FALLBACK_ROUTES: Array<{ path: string; lastmod: string | null }> = [
  { path: "/", lastmod: null },
  { path: "/about", lastmod: null },
  { path: "/services", lastmod: null },
  { path: "/portfolio", lastmod: null },
  { path: "/gallery", lastmod: null },
  { path: "/blogs", lastmod: null },
  { path: "/careers", lastmod: null },
  { path: "/contact-us", lastmod: null },
  { path: "/faqs", lastmod: null },
  { path: "/testimonials", lastmod: null },
];

export async function GET() {
  const cached = cache.get(SITEMAP_URL);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return Response.json({ ok: true, cached: true, routes: cached.routes });
  }

  try {
    const res = await fetch(SITEMAP_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
      headers: { Accept: "application/xml,text/xml,*/*" },
    });
    if (!res.ok) {
      return Response.json({ ok: true, message: `Sitemap responded with ${res.status}, using default routes`, routes: DEFAULT_FALLBACK_ROUTES }, { status: 200 });
    }
    const xml = await res.text();
    const routes = parseSitemap(xml);
    const resolvedRoutes = routes.length > 0 ? routes : DEFAULT_FALLBACK_ROUTES;
    cache.set(SITEMAP_URL, { at: Date.now(), routes: resolvedRoutes });
    return Response.json({ ok: true, cached: false, routes: resolvedRoutes });
  } catch (caught) {
    return Response.json(
      {
        ok: true,
        message: caught instanceof Error ? caught.message : "Sitemap unreachable, using default routes",
        routes: DEFAULT_FALLBACK_ROUTES,
      },
      { status: 200 },
    );
  }
}
