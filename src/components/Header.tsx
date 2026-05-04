"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";  // ✅ Link import 추가
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      
      {/* ✅ 로고 + 네비게이션 */}
      <nav className="flex items-center gap-4">
        <Link href="/" className="font-bold text-lg text-black no-underline">
          커뮤니티
        </Link>
        <Link href="/community" className="text-sm text-gray-600 hover:text-black">
          커뮤니티
        </Link>
        <Link href="/reservation" className="text-sm text-gray-600 hover:text-black">
          스터디룸 예약
        </Link>
      </nav>

      <div>
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user?.username}님</span>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg border border-gray-200 text-sm cursor-pointer bg-white hover:bg-gray-50"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="px-3 py-1 rounded-lg border border-gray-200 text-sm cursor-pointer bg-white hover:bg-gray-50"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
}