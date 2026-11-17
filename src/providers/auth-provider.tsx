"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { API_URL, clearToken, setToken } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import type { AuthState, SessionUser } from "@/lib/types";

interface AuthContextValue extends AuthState {
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  /** Optimistic local update after a profile edit. */
  patchUser: (patch: Partial<SessionUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSession(): Promise<{ token: string; user: SessionUser } | null> {
  try {
    // Cookie only: attaching an (often empty) Authorization header would force
    // a CORS preflight on every single page load.
    const response = await fetch(`${API_URL}/api/auth/session`, {
      credentials: "include",
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      token: string | null;
      user: SessionUser | null;
    };
    return data?.token && data.user
      ? { token: data.token, user: data.user }
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: null,
    token: null,
  });

  // setState lives inside the .then callback so the mount effect below never
  // runs it synchronously (react-hooks `set-state-in-effect`).
  const refresh = useCallback(
    () =>
      fetchSession().then((session) => {
        if (session) {
          setToken(session.token);
          setState({
            status: "authenticated",
            user: session.user,
            token: session.token,
          });
        } else {
          clearToken();
          setState({ status: "unauthenticated", user: null, token: null });
        }
      }),
    [],
  );

  useEffect(() => {
    void refresh();
    // Re-read on tab focus so a logout in another tab is noticed.
    const onFocus = () => void refresh();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await authClient.signOut();
    } catch {
      // Sign-out is best effort; the local state is cleared either way.
    }
    clearToken();
    setState({ status: "unauthenticated", user: null, token: null });
  }, []);

  const patchUser = useCallback((patch: Partial<SessionUser>) => {
    setState((prev) =>
      prev.user ? { ...prev, user: { ...prev.user, ...patch } } : prev,
    );
  }, []);

  const value = useMemo(
    () => ({ ...state, refresh, logout, patchUser }),
    [state, refresh, logout, patchUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
