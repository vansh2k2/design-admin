import { getMockDataForPath } from "./legacy";
import { ROUTES } from "./routes";
import { collectionFor } from "./store";
import { MockHttpError, type MockContext } from "./http";

export { MockHttpError };
export type { MockContext, MockHandler, MockRoute } from "./http";

/*
 * Frontend-only mode: every backend call is answered here with Design House sample data, so all
 * screens work before the API exists. Turn it off with NEXT_PUBLIC_USE_MOCK_API=false once the
 * backend is running; lib/api.ts then talks to NEXT_PUBLIC_API_URL as usual.
 */
export const MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

const LATENCY_MS = 120;

function parseBody(body: BodyInit | null | undefined): unknown {
  if (body == null) return undefined;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  return body;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function mockRequest<T>(path: string, method = "GET", body?: BodyInit | null): Promise<T> {
  await wait(LATENCY_MS);
  // Dev aid: window.__mockLog lists every request the current screen made
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    const log = ((window as unknown as { __mockLog?: string[] }).__mockLog ??= []);
    log.push(`${method.toUpperCase()} ${path}`);
  }
  const [pathname = "/", search = ""] = path.split("?");
  const upper = method.toUpperCase();
  const ctx: Omit<MockContext, "params"> = { method: upper, pathname, query: new URLSearchParams(search), body: parseBody(body) };

  for (const route of ROUTES) {
    if (route.method && ![route.method].flat().includes(upper)) continue;
    const found = route.match.exec(pathname);
    if (found) return route.handle({ ...ctx, params: found.slice(1) }) as T;
  }

  const collection = collectionFor(pathname);
  if (collection) return collection.handle({ ...ctx, params: [] }) as T;

  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    (window as unknown as { __mockLog?: string[] }).__mockLog?.push(`LEGACY ${upper} ${path}`);
  }
  return getMockDataForPath(path, upper) as T;
}

/** Same answer wrapped in the backend's {success, message, data} envelope, for code that calls fetch() directly. */
export async function mockFetchResponse(url: URL, init?: RequestInit): Promise<Response> {
  const path = url.pathname.replace(/^\/api(?=\/)/, "") + url.search;
  try {
    const data = await mockRequest(path, init?.method ?? "GET", init?.body);
    return Response.json({ success: true, message: "OK", data });
  } catch (error) {
    const status = error instanceof MockHttpError ? error.status : 500;
    return Response.json({ success: false, message: (error as Error).message }, { status });
  }
}
