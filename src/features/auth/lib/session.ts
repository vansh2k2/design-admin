"use client";

import { useAppSelector } from "@/store/hooks";
import { store } from "@/store/store";
import { AUTH_STORAGE_KEY } from "@/store/middleware/authSyncMiddleware";
import { logout, setCredentials, type AdminUser as StoreAdmin } from "@/store/slices/authSlice";

import type { AdminUser } from "../types";

/*
 * The dashboard (ported from the Bharat admin) keeps the signed-in admin in the Redux auth slice,
 * persisted to localStorage by authSyncMiddleware. The login screen writes into that same store so
 * there is a single session. Until the backend exists the tokens are placeholders.
 */

const DEMO_TOKENS = { accessToken: "demo-access-token", refreshToken: "demo-refresh-token" };

// "Keep me signed in" unticked → the session must end when the browser closes
const REMEMBER_KEY = "dh_admin_remember";
const ACTIVE_KEY = "dh_admin_active";

function toStoreAdmin(user: AdminUser): StoreAdmin {
  return {
    id: "admin-1",
    name: user.name,
    email: user.email,
    phone: "+91 98100 00000",
    userType: "INTERNAL",
    roleSlug: "SUPER_ADMIN",
    permissions: ["*"],
  };
}

export function saveSession(user: AdminUser, remember: boolean) {
  localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
  sessionStorage.setItem(ACTIVE_KEY, "1");
  const accessToken = user.accessToken || DEMO_TOKENS.accessToken;
  const refreshToken = user.refreshToken || DEMO_TOKENS.refreshToken;
  store.dispatch(setCredentials({ admin: toStoreAdmin(user), accessToken, refreshToken }));
}

export function clearSession() {
  store.dispatch(logout());
}

/** Drops a session that was not "kept signed in" once a new browser session starts. Call before hydration. */
export function expireUnrememberedSession() {
  try {
    if (localStorage.getItem(REMEMBER_KEY) !== "0" || sessionStorage.getItem(ACTIVE_KEY)) return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    document.cookie = "ms_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
  } catch {
    // Storage blocked: nothing persisted, nothing to expire
  }
}

/** Current admin, `null` when signed out, or `undefined` until the store has read storage. */
export function useSession(): AdminUser | null | undefined {
  const { admin, hydrated } = useAppSelector(state => state.auth);
  if (!hydrated) return undefined;
  return admin ? { name: admin.name, email: admin.email ?? "", role: "Super Admin" } : null;
}
