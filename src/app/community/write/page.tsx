"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { createPost } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function WritePage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const initialize = useAuthStore((state) => state.initialize);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = window.localStorage.getItem("access_token");
    if (!storedToken) {
      router.replace("/login");
    }
  }, [router]);

  const isAuthenticated = Boolean(token && user);
  const isFormInvalid = !isAuthenticated || !title.trim() || !content.trim() || submitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setErrorMessage("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");

      await createPost({
        title: title.trim(),
        content: content.trim(),
      });

      router.push("/community");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverMessage =
          (error.response?.data as { error?: string; message?: string } | undefined)
            ?.error ??
          (error.response?.data as { error?: string; message?: string } | undefined)
            ?.message;

        setErrorMessage(serverMessage ?? "게시글 작성에 실패했습니다.");
      } else {
        setErrorMessage("게시글 작성에 실패했습니다.");
      }
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
        <div className="mx-auto w-full max-w-[760px]">
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm ring-1 ring-gray-100">
            로그인 상태를 확인하는 중입니다...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  글 작성
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  제목과 내용을 입력해 게시글을 작성해보세요.
                </p>
              </div>
              <Link
                href="/community"
                className="text-sm font-semibold text-gray-600 transition hover:text-gray-900"
              >
                목록으로
              </Link>
            </div>
          </div>

          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
          >
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">
                제목
              </label>
              <input
                id="title"
                type="text"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="content"
                className="text-sm font-medium text-gray-700"
              >
                내용
              </label>
              <textarea
                id="content"
                placeholder="내용을 입력하세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isFormInvalid}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {submitting ? "작성 중..." : "작성"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
