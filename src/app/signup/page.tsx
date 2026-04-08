"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { register } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUsernameValid = username.trim().length >= 2;
  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.length >= 6;

  const isFormInvalid =
    !isUsernameValid || !isEmailValid || !isPasswordValid || isSubmitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormInvalid) {
      if (!isUsernameValid) {
        setErrorMessage("유저네임은 2자 이상 입력해주세요.");
        return;
      }

      if (!isEmailValid) {
        setErrorMessage("올바른 이메일 형식을 입력해주세요.");
        return;
      }

      if (!isPasswordValid) {
        setErrorMessage("비밀번호는 6자 이상 입력해주세요.");
      }

      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setAuth(response.access_token, response.user);
      router.push("/community");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          (error.response?.data as { error?: string; message?: string } | undefined)
            ?.error ??
          (error.response?.data as { error?: string; message?: string } | undefined)
            ?.message;

        setErrorMessage(serverMessage ?? "회원가입에 실패했습니다.");
      } else {
        setErrorMessage("회원가입에 실패했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[520px]">
        <section className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              회원가입
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              계정을 만들고 커뮤니티를 바로 이용해보세요.
            </p>
          </div>

          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
          >
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                유저네임
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="유저네임을 입력하세요"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:bg-gray-100"
              />
              {username.length > 0 && !isUsernameValid && (
                <p className="text-sm text-red-500">2자 이상 입력해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:bg-gray-100"
              />
              {email.length > 0 && !isEmailValid && (
                <p className="text-sm text-red-500">이메일 형식을 확인해주세요.</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                disabled={isSubmitting}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:bg-gray-100"
              />
              {password.length > 0 && !isPasswordValid && (
                <p className="text-sm text-red-500">6자 이상 입력해주세요.</p>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isFormInvalid}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting ? "회원가입 중..." : "회원가입"}
            </button>

            <div className="text-center text-sm text-gray-500">
              이미 계정이 있나요?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                로그인
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
