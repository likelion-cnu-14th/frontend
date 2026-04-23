"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

export default function AuthInitializer() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}