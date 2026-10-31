import { adminPageHeaders } from "./adminPage";
import { getMockDataForPath } from "./mock/legacy";
import { MOCK_API, MockHttpError, mockRequest } from "./mock/router";

// Every backend route lives under /api; add it if the configured URL leaves it out
const withApiPrefix = (url: string): string => {
  const clean = url.replace(/\/+$/, "");
  return clean.endsWith("/api") ? clean : `${clean}/api`;
};

export const getApiBaseUrl = (): string => {
  // If running in browser on production domain
  if (typeof window !== "undefined") {
    if (window.location.hostname.includes("designhouse.co.in")) {
      return "https://api.designhouse.co.in/api";
    }
  }

  // If env var is set and not accidentally pointing to localhost while on live site
  if (process.env.NEXT_PUBLIC_API_URL) {
    if (
      typeof window !== "undefined" &&
      window.location.hostname.includes("designhouse.co.in") &&
      process.env.NEXT_PUBLIC_API_URL.includes("localhost")
    ) {
      return "https://api.designhouse.co.in/api";
    }
    return withApiPrefix(process.env.NEXT_PUBLIC_API_URL);
  }

  // If running on local network / custom IP in browser
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return `http://${window.location.hostname}:4001/api`;
  }

  return "http://localhost:4001/api";
};

export const getBackendUrl = (): string => {
  if (typeof window !== "undefined" && window.location.hostname.includes("designhouse.co.in")) {
    return "https://api.designhouse.co.in";
  }
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    if (
      typeof window !== "undefined" &&
      window.location.hostname.includes("designhouse.co.in") &&
      process.env.NEXT_PUBLIC_BACKEND_URL.includes("localhost")
    ) {
      return "https://api.designhouse.co.in";
    }
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }
  return "http://localhost:4001";
};

export const API_BASE_URL = getApiBaseUrl();
const REQUEST_TIMEOUT_MS = 10_000;
const GET_CACHE_TTL_MS = 2_000;
const getInFlight = new Map<string, Promise<unknown>>();
const getCache = new Map<string, { expiresAt: number; value: unknown }>();

export class ApiRequestError extends Error {
  status: number;
  isApiRequestError = true;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
}
let accessToken: string | null = null;
let refreshToken: string | null = null;
let onTokensRefreshed: ((tokens: { accessToken: string; refreshToken: string }) => void) | null = null;
let onRefreshFailed: (() => void) | null = null;
const AUTH_STORAGE_KEY = "ms_admin_auth";

function syncTokensFromStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return;
    const stored = JSON.parse(raw) as { accessToken?: string; refreshToken?: string };
    if (!accessToken && stored.accessToken) accessToken = stored.accessToken;
    if (!refreshToken && stored.refreshToken) refreshToken = stored.refreshToken;
  } catch {
    // A malformed persisted session is handled by StoreProvider/logout; requests simply proceed
    // without a token and receive the normal 401 response.
  }
}

export function getAccessToken(): string | null {
  syncTokensFromStorage();
  return accessToken;
}

export function setTokens(tokens: { accessToken: string | null; refreshToken: string | null }): void {
  accessToken = tokens.accessToken;
  refreshToken = tokens.refreshToken;
}

export function setTokenRefreshHandlers(handlers: {
  onRefreshed: (tokens: { accessToken: string; refreshToken: string }) => void;
  onFailed: () => void;
}): void {
  onTokensRefreshed = handlers.onRefreshed;
  onRefreshFailed = handlers.onFailed;
}
let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  syncTokensFromStorage();
  if (!refreshToken) return false;
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const body: ApiEnvelope<{ accessToken: string; refreshToken: string }> = await res.json();
      if (!res.ok || !body.success) return false;

      setTokens(body.data);
      onTokensRefreshed?.(body.data);
      return true;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

// Modules already connected to the real backend: they skip the demo data even while
// NEXT_PUBLIC_USE_MOCK_API is on
const LIVE_API_PREFIXES = ["/contact-enquiry", "/whatsapp-templates", "/topbar", "/contact-page", "/uploads", "/page-seo"];
export const isLivePath = (path: string) => LIVE_API_PREFIXES.some((prefix) => path.startsWith(prefix));

async function request<T>(path: string, options?: ApiRequestOptions, isRetry = false): Promise<T> {
  if (MOCK_API && !isLivePath(path)) {
    try {
      return await mockRequest<T>(path, options?.method ?? "GET", options?.body);
    } catch (error) {
      throw new ApiRequestError(error instanceof MockHttpError ? error.status : 500, (error as Error).message);
    }
  }
  syncTokensFromStorage();
  const isFormData = options?.body instanceof FormData;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    // Page and menu name, for the Activity Log
    ...adminPageHeaders(),
    ...(options?.headers as Record<string, string> | undefined),
  };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (typeof window !== "undefined" && (path.startsWith("/system-services/admin") || path === "/system-services/access/status")) {
    const grant = window.sessionStorage.getItem("design_house_system_services_grant");
    if (grant) headers["X-System-Services-Grant"] = grant;
  }

  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), options?.timeoutMs ?? REQUEST_TIMEOUT_MS);
  const { timeoutMs: _timeoutMs, ...fetchOptions } = options ?? {};
  let res: Response;
  const isWrite = (options?.method ?? "GET").toUpperCase() !== "GET";
  // Paths that have real backends — errors should be thrown, not mocked.
  // Writes to settings/uploads/website content must never report a fake success.
  const isRealBackendPath =
    isLivePath(path) ||
    path.includes("/staff") ||
    path.includes("/roles") ||
    path.includes("/auth") ||
    path.includes("/system-services") ||
    path.includes("/seo-settings") ||
    path.includes("/careers") ||
    path.includes("/msme") ||
    path.includes("/awards/nominations") ||
    path.startsWith("/advisory-nominations") ||
    path.startsWith("/blog-categories") ||
    path.startsWith("/blog-experts") ||
    path.startsWith("/blog-updates") ||
    path.startsWith("/blog-reports") ||
    path.startsWith("/newsletter") ||
    path.startsWith("/feedback") ||
    path.startsWith("/partnership-enquiry") ||
    path.includes("/contact-enquiry") ||
    path.startsWith("/buyer-enquiries") ||
    path.startsWith("/visitor-registrations") ||
    path.startsWith("/exhibitor-registrations") ||
    path.startsWith("/admin/chats") ||
    path.startsWith("/dropdowns") ||
    path.startsWith("/activity-logs") ||
    path.startsWith("/api-limits") ||
    path.startsWith("/locations") ||
    path.startsWith("/crm-") ||
    path.startsWith("/events/") ||
    path.startsWith("/stalls/") ||
    path.startsWith("/stall-rates/") ||
    (isWrite && (path.startsWith("/settings") || path.startsWith("/uploads") || path.startsWith("/website")));

  try {
    res = await fetch(`${getApiBaseUrl()}${path}`, {
      ...fetchOptions,
      headers,
      signal: options?.signal ?? timeoutController.signal,
    });
  } catch (_error) {
    clearTimeout(timeoutId);
    if (isRealBackendPath) {
      throw new ApiRequestError(0, "Cannot connect to the server. Please make sure the backend is running.");
    }
    return getMockDataForPath(path, options?.method ?? "GET") as T;
  } finally {
    clearTimeout(timeoutId);
  }

  // Only refresh token on 401 for authenticated endpoints (exclude public login/auth routes)
  const isPublicAuthPath =
    path.startsWith("/auth/login") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/reset-password") ||
    path === "/auth/refresh-token";

  if (res.status === 401 && !isRetry && !isPublicAuthPath) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return request<T>(path, options, true);
    onRefreshFailed?.();
  }

  let body: { success?: boolean; message?: string; data?: unknown } | null = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON response
  }

  if (!res.ok || (body && body.success === false)) {
    const errorMessage = body?.message || (res.status === 401 ? "Invalid email, staff ID, or password" : `Request failed with status ${res.status}`);
    if (isRealBackendPath) {
      throw new ApiRequestError(res.status, errorMessage);
    }
    return getMockDataForPath(path, options?.method ?? "GET") as T;
  }

  if (body !== null) {
    return (body.data !== undefined ? body.data : body) as T;
  }

  if (isRealBackendPath) {
    throw new ApiRequestError(res.status, "An unexpected server error occurred.");
  }
  return getMockDataForPath(path, options?.method ?? "GET") as T;
}

/** For endpoints that return raw HTML (not the {success,message,data} envelope) — e.g. the
 * receipt view, which needs the Authorization header a plain <a href> navigation can't send. */
async function requestHtml(path: string): Promise<string> {
  if (MOCK_API) return "<div style=\"font-family:sans-serif;padding:24px\">Sample document — Design House India Pvt. Ltd.</div>";
  try {
    syncTokensFromStorage();
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const res = await fetch(`${getApiBaseUrl()}${path}`, { headers });
    if (!res.ok) throw new ApiRequestError(res.status, "Could not load this document.");
    return res.text();
  } catch {
    return "<div>Mock HTML Document for Design House</div>";
  }
}

async function requestBlob(path: string): Promise<Blob> {
  if (MOCK_API) return new Blob(["Sample document - Design House India Pvt. Ltd."], { type: "text/plain" });
  try {
    syncTokensFromStorage();
    const headers: Record<string, string> = {};
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
    const res = await fetch(`${getApiBaseUrl()}${path}`, { headers });
    if (!res.ok) throw new ApiRequestError(res.status, "Could not download this document.");
    return res.blob();
  } catch {
    return new Blob(["Mock Document Data"], { type: "text/plain" });
  }
}

export const api = {
  get: <T>(path: string): Promise<T> => {
    const cached = getCache.get(path);
    if (cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.value as T);
    if (cached) getCache.delete(path);

    const pending = getInFlight.get(path);
    if (pending) return pending as Promise<T>;

    const next = request<T>(path)
      .then((value) => {
        getCache.set(path, { value, expiresAt: Date.now() + GET_CACHE_TTL_MS });
        return value;
      })
      .finally(() => getInFlight.delete(path));
    getInFlight.set(path, next);
    return next;
  },
  post: <T>(path: string, payload?: unknown, options?: Pick<ApiRequestOptions, "timeoutMs">) =>
    request<T>(path, {
      method: "POST",
      body: payload !== undefined ? JSON.stringify(payload) : undefined,
      ...options,
    }),
  put: <T>(path: string, payload?: unknown) =>
    request<T>(path, { method: "PUT", body: payload !== undefined ? JSON.stringify(payload) : undefined }),
  patch: <T>(path: string, payload?: unknown, options?: Pick<ApiRequestOptions, "timeoutMs">) =>
    request<T>(path, { method: "PATCH", body: payload !== undefined ? JSON.stringify(payload) : undefined, ...options }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  postForm: <T>(path: string, formData: FormData, options?: Pick<ApiRequestOptions, "timeoutMs">) =>
    request<T>(path, { method: "POST", body: formData, ...options }),
  putForm: <T>(path: string, formData: FormData) => request<T>(path, { method: "PUT", body: formData }),
  getHtml: requestHtml,
  getBlob: requestBlob,
};
