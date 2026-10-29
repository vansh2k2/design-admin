import type { MockRoute } from "../http";
import { currentAdmin } from "../fixtures/admin";

/** Auth and uploads */
export const coreRoutes: MockRoute[] = [
  // ---- Auth -------------------------------------------------------------------------------
  { method: "GET", match: /^\/auth\/me$/, handle: () => ({ user: currentAdmin() }) },
  { match: /^\/auth\/logout$/, handle: () => ({ success: true }) },
  { match: /^\/auth\/change-password$/, handle: () => ({ success: true }) },
  { method: "POST", match: /^\/auth\/refresh-token$/, handle: () => ({ accessToken: "demo-access-token", refreshToken: "demo-refresh-token" }) },

  // ---- Uploads: hand back a local preview URL for the chosen file --------------------------
  {
    method: "POST",
    match: /^\/uploads?(\/.*)?$/,
    handle: ({ body }) => {
      const file = typeof FormData !== "undefined" && body instanceof FormData ? body.get("file") ?? body.get("image") : null;
      const url = file instanceof Blob ? URL.createObjectURL(file) : "/images/demo/office.webp";
      return { url, secure_url: url, publicId: `demo/${Date.now()}` };
    },
  },
];
