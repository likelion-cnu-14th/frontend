import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return { isLoggedIn, user, logout };
}

