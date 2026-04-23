"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/useAuthStore";

export default function AuthHeader() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/community" className="text-lg font-bold text-zinc-900">
          Study Community
        </Link>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              로그인
            </Link>
          ) : (
            <>
              <span className="text-sm text-zinc-700">
                {user?.username}님
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}