import { create } from "zustand";
import { authApi, AuthUser } from "@/lib/api";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  initialize: async () => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const user = await authApi.getMe(savedToken);
        set({ user, token: savedToken, loading: false });
      } catch {
        localStorage.removeItem("token");
        set({ user: null, token: null, loading: false });
      }
    } else {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("token", res.access_token);
    set({ user: res.user, token: res.access_token });
  },

  register: async (username, email, password) => {
    const res = await authApi.register(username, email, password);
    localStorage.setItem("token", res.access_token);
    set({ user: res.user, token: res.access_token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
