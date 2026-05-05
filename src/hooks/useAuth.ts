import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { isLoggedIn, user, token, logout } = useAuthStore();
  
  return {
    isLoggedIn,
    user,
    token,
    logout
  };
}
