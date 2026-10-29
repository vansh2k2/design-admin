"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store, AUTH_STORAGE_KEY } from "./store";
import { hydrate } from "./slices/authSlice";
import { setTokens } from "@/lib/api";
import { expireUnrememberedSession } from "@/features/auth/lib/session";

// "Keep me signed in" unticked → that session ends with the browser (runs before the first render)
if (typeof window !== "undefined") expireUnrememberedSession();

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.accessToken && parsed?.admin) {
          setTokens({ accessToken: parsed.accessToken, refreshToken: parsed.refreshToken });
          if (typeof document !== "undefined") {
            document.cookie = `ms_admin_token=${encodeURIComponent(parsed.accessToken)}; path=/; max-age=604800; SameSite=Lax`;
          }
          store.dispatch(hydrate(parsed));
          return;
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    if (typeof document !== "undefined") {
      document.cookie = "ms_admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
    store.dispatch(hydrate(null));
     
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
