"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { register } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { PageContainer } from "@/components/PageContainer";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const usernameValid = username.trim().length >= 2;
  const emailValid = emailRegex.test(email.trim());
  const passwordValid = password.length >= 6;

  const isFormValid = useMemo(
    () => usernameValid && emailValid && passwordValid,
    [usernameValid, emailValid, passwordValid]
  );

  const handleSubmit = async () => {
    if (submitting) return;
    setErrorMessage("");

    if (!isFormValid) {
      setErrorMessage("입력값을 다시 확인해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (!result?.access_token || !result?.user) {
        setErrorMessage("토큰이 올바르게 전달되지 않았습니다. 다시 회원가입해 주세요.");
        setSubmitting(false);
        return;
      }

      setAuth(result.access_token, result.user);
      router.push("/community");
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setErrorMessage(serverMessage);
      setSubmitting(false);
    }
  };

  return (
    <PageContainer className="max-w-md">
      <div className="rounded-2xl border border-border/60 bg-card/35 p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">회원가입</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          계정을 만들고 커뮤니티를 이용해보세요.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">유저네임</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="2자 이상 입력"
              className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
            />
            {!usernameValid && username.length > 0 ? (
              <p className="mt-1 text-xs text-red-400">유저네임은 2자 이상이어야 합니다.</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
            />
            {!emailValid && email.length > 0 ? (
              <p className="mt-1 text-xs text-red-400">올바른 이메일 형식을 입력해주세요.</p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상 입력"
              className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
            />
            {!passwordValid && password.length > 0 ? (
              <p className="mt-1 text-xs text-red-400">비밀번호는 6자 이상이어야 합니다.</p>
            ) : null}
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
            {submitting ? "회원가입 중..." : "회원가입"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            로그인
          </Link>
        </p>
      </div>
    </PageContainer>
  );
}
