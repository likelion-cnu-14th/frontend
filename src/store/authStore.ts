import { create } from 'zustand';
import { User } from '../types/post';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoggedIn: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  initialize: () => void;
}

// 💡 여기에 있는 create<AuthState>() 이 빈 괄호가 핵심입니다!
export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  isLoggedIn: false,

  setAuth: (token: string, user: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isLoggedIn: false });
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isLoggedIn: true });
      }
    }
  },
}));