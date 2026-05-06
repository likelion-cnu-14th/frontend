import { create } from "zustand";
import { User } from "@/types/post";

/** localStorage 저장 시 Bearer 접두사·따옴표 등 제거 (axios 헤더와 동일 규칙) */
function normalizeStoredToken(raw: string) {
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s.replace(/^Bearer\s+/i, "").trim();
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,

  setAuth: (token, user) => {
    const normalized = normalizeStoredToken(token);
    set({
      token: normalized,
      user,
      isLoggedIn: true,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", normalized);
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  logout: () => {
    set({
      token: null,
      user: null,
      isLoggedIn: false,
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },

  initialize: () => {
    if (typeof window === "undefined") return;

    const rawToken = localStorage.getItem("access_token");
    const userRaw = localStorage.getItem("user");

    const token = rawToken ? normalizeStoredToken(rawToken) : "";
    if (rawToken && token !== rawToken) {
      localStorage.setItem("access_token", token);
    }

    if (!token || !userRaw) {
      set({
        token: null,
        user: null,
        isLoggedIn: false,
      });
      return;
    }

    try {
      const user = JSON.parse(userRaw) as User;
      set({
        token,
        user,
        isLoggedIn: true,
      });
    } catch {
      set({
        token: null,
        user: null,
        isLoggedIn: false,
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }
  },
}));
