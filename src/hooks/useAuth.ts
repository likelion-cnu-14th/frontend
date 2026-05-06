"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const useAuth = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    isLoggedIn,
    user,
  };
};
