import type { AdminUser } from "../types";

/*
 * Demo implementation — the backend isn't connected yet. Replace these bodies with calls to
 * `${process.env.NEXT_PUBLIC_API_URL}/api/auth/...`; the screens only depend on these signatures.
 */

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthError extends Error {}

export async function login(email: string, password: string): Promise<AdminUser> {
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
