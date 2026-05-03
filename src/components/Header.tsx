"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:gap-10 sm:px-6">
        <Link
          href="/community"
          className="text-lg font-bold tracking-tight text-gray-900 transition hover:text-blue-600"
        >
          Community
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 sm:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-gray-700 transition hover:text-blue-600"
          >
            홈으로
          </Link>
          <Link
            href="/reservation"
            className="text-sm font-semibold text-gray-700 transition hover:text-blue-600"
          >
            스터디룸 예약
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <span className="text-sm font-medium text-gray-700">
                {user.username}님
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
