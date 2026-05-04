"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();  // ✅ 앱 시작 시 localStorage에서 인증 상태 복원
  }, []);

  return (
    <>
      <Header />  {/* ✅ 모든 페이지에 헤더 표시 */}
      {children}
    </>
  );
}