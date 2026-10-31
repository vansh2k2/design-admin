import { api } from "@/lib/api";
import { MOCK_API } from "@/lib/mock/router";

import type { AdminUser } from "../types";

/*
 * Sign-in goes to the backend's /api/auth/login (username or email). With NEXT_PUBLIC_USE_MOCK_API on,
 * the demo versions below are used instead.
 */

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthError extends Error { }

type BackendLogin = {
  accessToken?: string;
  refreshToken?: string;
  admin?: { id?: string; name?: string; username?: string; email?: string; role?: string; roleName?: string };
};

export async function login(email: string, password: string): Promise<AdminUser> {
  if (!MOCK_API) {
    if (!email) throw new AuthError("Enter your username or email.");
    if (!password) throw new AuthError("Enter your password.");
    try {
      const res = await api.post<BackendLogin>("/auth/login", { email, password });
      if (!res?.accessToken || !res.admin) throw new AuthError("Could not sign in. Please try again.");
      return {
        id: res.admin.id || "",
        name: res.admin.name || res.admin.username || email,
        email: res.admin.email || "",
        role: res.admin.role || "Admin",
        roleSlug: res.admin.roleName,
        tokens: { accessToken: res.accessToken, refreshToken: res.refreshToken || "" },
      };
    } catch (err) {
      if (err instanceof AuthError) throw err;
      throw new AuthError(err instanceof Error && err.message ? err.message : "Could not sign in. Please try again.");
    }
  }

  await wait(600);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("Enter a valid email address.");
  if (password.length < 6) throw new AuthError("Password must be at least 6 characters.");
  const name = email
    .split("@")[0]!
    .split(/[._-]/)
    .filter(Boolean)
    .map(part => part[0]!.toUpperCase() + part.slice(1))
    .join(" ");
  return { name: name || "Admin", email, role: "Super Admin" };
}

export async function requestPasswordReset(email: string): Promise<void> {
  await wait(600);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("Enter a valid email address.");
}

export async function changePassword(current: string, next: string): Promise<void> {
  await wait(600);
  if (!current) throw new AuthError("Enter your current password.");
  if (next.length < 8) throw new AuthError("New password must be at least 8 characters.");
  if (next === current) throw new AuthError("New password must be different from the current one.");
}
