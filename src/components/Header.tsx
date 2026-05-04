"use client";
import { useRouter } from "next/navigation";
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
      <a href="/" className="font-bold text-lg no-underline text-black">
        커뮤니티
      </a>

      <div>
        {isLoggedIn ? (
          // ✅ 로그인 상태
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
          // ✅ 비로그인 상태
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