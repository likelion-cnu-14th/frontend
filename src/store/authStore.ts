import { create } from "zustand";
import { User } from "@/types/auth";
import { getMe } from "@/lib/api";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,

  // 로그인/회원가입 성공 시 호출하여 상태와 로컬스토리지를 업데이트합니다.
  setAuth: (token: string, user: User) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ token, user, isLoggedIn: true });
  },

  // 로그아웃 시 상태를 초기화하고 로컬스토리지의 데이터를 제거합니다.
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ token: null, user: null, isLoggedIn: false });
  },

  // 앱이 처음 로드될 때 로컬스토리지를 확인하고 상태를 복원합니다.
  initialize: async () => {
    const token = localStorage.getItem("access_token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ token, user, isLoggedIn: true });
      } catch (error) {
        console.error("인증 데이터 복원 실패:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    }
  },
}));
