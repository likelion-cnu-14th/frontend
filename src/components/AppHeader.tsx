"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AppHeader() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-4">
          <Link
            href="/community"
            className="text-sm font-medium text-foreground/90 hover:text-foreground"
          >
            커뮤니티
          </Link>
          <Link
            href="/reservation"
            className="text-sm font-medium text-foreground/90 hover:text-foreground"
          >
            스터디룸 예약
          </Link>
        </nav>

        {!isLoggedIn ? (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-md border border-border/70 bg-card/40 px-3 py-1.5 text-sm text-foreground transition hover:bg-card/80"
          >
            로그인
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground/90">
              {user?.username ?? "사용자"}님
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-border/70 bg-card/40 px-3 py-1.5 text-sm text-foreground transition hover:bg-card/80"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
