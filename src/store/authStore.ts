import { create } from "zustand";

import type { User } from "@/types/post";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "user";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  setAuth: (token, user) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    set({
      token,
      user,
      isLoggedIn: true,
    });
  },
  logout: () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);
    }

    set({
      token: null,
      user: null,
      isLoggedIn: false,
    });
  },
  initialize: () => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_KEY);

    if (!token || !storedUser) {
      set({
        token: null,
        user: null,
        isLoggedIn: false,
      });
      return;
    }

    try {
      const user = JSON.parse(storedUser) as User;

      set({
        token,
        user,
        isLoggedIn: true,
      });
    } catch {
      window.localStorage.removeItem(ACCESS_TOKEN_KEY);
      window.localStorage.removeItem(USER_KEY);

      set({
        token: null,
        user: null,
        isLoggedIn: false,
      });
    }
  },
}));
