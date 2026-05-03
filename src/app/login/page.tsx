"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormInvalid = !email.trim() || !password || isSubmitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isFormInvalid) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await login({
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

        setErrorMessage(serverMessage ?? "로그인에 실패했습니다.");
      } else {
        setErrorMessage("로그인에 실패했습니다.");
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
              로그인
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              계정으로 로그인하고 커뮤니티를 이어서 이용해보세요.
            </p>
          </div>

          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
          >
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
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>

            <div className="text-center text-sm text-gray-500">
              아직 계정이 없나요?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                회원가입
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
