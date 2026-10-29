import { AUTH_STORAGE_KEY } from "@/store/middleware/authSyncMiddleware";

/** The signed-in admin as /auth/me returns it — read back from the session the login screen saved. */
export function currentAdmin() {
  let stored: { name?: string; email?: string; phone?: string } = {};
  try {
    stored = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? "{}").admin ?? {};
  } catch {
    // no session yet
  }
  return {
    id: "admin-1",
    _id: "admin-1",
    name: stored.name ?? "Design House Admin",
    email: stored.email ?? "admin@designhouse.co.in",
    phone: stored.phone ?? "+91 98100 00000",
    role: "superadmin",
    roleName: "SUPER_ADMIN",
    isTwoFactorEnabled: true,
  };
}
