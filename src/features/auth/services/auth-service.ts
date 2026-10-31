import type { AdminUser } from "../types";
import { getApiBaseUrl } from "@/lib/api";

export class AuthError extends Error {}

export async function login(identifier: string, password: string): Promise<AdminUser> {
  const cleanId = String(identifier || "").trim();
  if (!cleanId) throw new AuthError("Enter your username or email address.");
  if (!password) throw new AuthError("Password is required.");

  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanId,
        username: cleanId,
        password,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      throw new AuthError(data?.message || "Invalid email or password. Please try again.");
    }

    const admin = data.admin || data.data?.admin || {};
    const accessToken = data.accessToken || data.token || data.data?.accessToken;
    const refreshToken = data.refreshToken || data.data?.refreshToken || accessToken;

    return {
      name: admin.name || admin.username || cleanId.split("@")[0] || "Admin User",
      email: admin.email || cleanId,
      role: admin.role || "Super Admin",
      accessToken,
      refreshToken,
    };
  } catch (err: any) {
    if (err instanceof AuthError) throw err;
    throw new AuthError(err.message || "Could not connect to authentication server.");
  }
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
