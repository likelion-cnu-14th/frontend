import { create } from "zustand";
import { User } from "@/types/auth";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  token: null,
  user: null,
  isLoggedIn: false,

  // 로그인 성공 시 호출
  setAuth: (token, user) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isLoggedIn: true });
  },

  // 로그아웃 시 호출
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isLoggedIn: false });
  },

  // 앱 시작 시 localStorage에서 복원
  initialize: () => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      set({ token, user: JSON.parse(userStr), isLoggedIn: true });
    }
  },
}));