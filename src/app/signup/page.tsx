"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    // ✅ 입력값 검증
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (username.length < 2) {
      setError("유저네임은 2자 이상이어야 합니다.");
      return;
    }
    if (!email.includes("@")) {
      setError("이메일 형식이 올바르지 않습니다.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const data = await register({ username, email, password });
      setAuth(data.access_token, data.user);  // ✅ 가입 즉시 로그인
      router.push("/community");
    } catch (err: any) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");  // ✅ 서버 에러 메시지
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-6">회원가입</h1>

      <div className="grid gap-3">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="유저네임 (2자 이상)"
          className="px-3 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-blue-200"
        />
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
          placeholder="비밀번호 (6자 이상)"
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
          {submitting ? "가입 중..." : "회원가입"}
        </button>
      </div>

      {/* ✅ 로그인 링크 */}
      <p className="mt-4 text-sm text-gray-500 text-center">
        이미 계정이 있으신가요?{" "}
        <a href="/login" className="text-blue-500 hover:underline">
          로그인
        </a>
      </p>
    </div>
  );
}