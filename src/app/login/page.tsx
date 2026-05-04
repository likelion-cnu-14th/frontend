"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const data = await login({ email, password });
      setAuth(data.access_token, data.user);  // ✅ Zustand에 저장
      router.push("/community");               // ✅ 커뮤니티로 이동
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");  // ✅ 에러 메시지
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">로그인</h1>

      <div className="grid gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        />

        {/* ✅ 에러 메시지 */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-3 py-2 rounded-lg border border-gray-200 bg-white ${
            submitting ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-gray-50"
          }`}
        >
          {submitting ? "로그인 중..." : "로그인"}
        </button>
      </div>

      {/* ✅ 회원가입 링크 */}
      <p className="mt-4 text-sm text-gray-500 text-center">
        계정이 없으신가요?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          회원가입
        </a>
      </p>
    </div>
  );
}