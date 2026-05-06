"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { PageContainer } from "@/components/PageContainer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = emailRegex.test(email.trim()) && password.length > 0;

  const handleSubmit = async () => {
    if (submitting) return;
    if (!isFormValid) return;

    setErrorMessage("");
    setSubmitting(true);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      if (!result?.access_token || !result?.user) {
        setErrorMessage("토큰이 올바르게 전달되지 않았습니다. 다시 로그인해 주세요.");
        setSubmitting(false);
        return;
      }

      setAuth(result.access_token, result.user);
      router.push("/community");
    } catch {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다");
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card/35 p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">로그인</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          계정으로 로그인하고 커뮤니티를 이용해보세요.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !isFormValid}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "로그인 중..." : "로그인"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
            회원가입
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
