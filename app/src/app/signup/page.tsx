"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { register } from "../../lib/api";
import { useAuthStore } from "../../store/authStore";

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isUsernameValid = username.trim().length >= 2;
  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;

  const isFormValid =
    isUsernameValid && isEmailValid && isPasswordValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setIsLoading(true);
      setError("");

      const data = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setAuth(data.access_token, data.user);
      router.push("/community");
    } catch (err: any) {
      setError(
        err?.response?.data?.detail?.error || "회원가입에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
      <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">회원가입</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              유저네임
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="2자 이상 입력"
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
            {username.length > 0 && !isUsernameValid && (
              <p className="mt-1 text-sm text-red-500">
                유저네임은 2자 이상이어야 합니다.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
            {email.length > 0 && !isEmailValid && (
              <p className="mt-1 text-sm text-red-500">
                올바른 이메일 형식을 입력하세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-zinc-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6자 이상 입력"
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
            />
            {password.length > 0 && !isPasswordValid && (
              <p className="mt-1 text-sm text-red-500">
                비밀번호는 6자 이상이어야 합니다.
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full rounded-xl bg-black px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}