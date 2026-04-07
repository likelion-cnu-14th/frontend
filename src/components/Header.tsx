"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { LogOut, User } from "lucide-react";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const loading = useAuthStore((s) => s.loading);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          스터디 커뮤니티
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/study-room"
            className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            스터디룸 예약
          </Link>
          {loading ? null : user ? (
            <>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                {user.username}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
