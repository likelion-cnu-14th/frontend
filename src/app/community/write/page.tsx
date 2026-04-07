"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createPost } from "@/lib/api";

export default function WritePage() {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmedAuthor = author.trim();
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedAuthor || !trimmedTitle || !trimmedContent) {
      alert("작성자, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createPost({
        author: trimmedAuthor,
        title: trimmedTitle,
        content: trimmedContent,
      });
      router.push("/community");
    } catch {
      alert("글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = !!author.trim() && !!title.trim() && !!content.trim();

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900">
      <Navbar />

      <main className="mx-auto flex w-full max-w-3xl flex-col px-5 py-8 sm:px-8 sm:py-10">
        <button
          type="button"
          onClick={() => router.push("/community")}
          className="mb-4 inline-flex w-fit items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <span aria-hidden>←</span>
          <span>목록으로</span>
        </button>

        <section className="rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:px-8 sm:py-7">
          <header className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                글 작성
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                생각을 정리하고 다른 사람들과 공유해보세요.
              </p>
            </div>
          </header>

          <div className="space-y-6">
            {/* 제목 입력 */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full border-0 border-b border-slate-200 bg-transparent pb-3 text-2xl font-semibold tracking-tight text-slate-900 outline-none transition focus:border-indigo-400 focus:ring-0 placeholder:text-slate-300"
              />
            </div>

            {/* 본문 입력 */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                className="min-h-[260px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-base leading-relaxed text-slate-800 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
              />
            </div>

            {/* 작성자 입력 */}
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-slate-500">
                  작성자 이름
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="작성자 이름을 입력하세요"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300"
                />
              </div>

              {/* 버튼 영역 */}
              <div className="mt-4 flex justify-end gap-2 sm:mt-0 sm:w-auto">
                <button
                  type="button"
                  onClick={() => router.push("/community")}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isValid || isSubmitting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(79,70,229,0.25)] transition-all hover:-translate-y-0.5 hover:bg-indigo-500 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "작성 중…" : "작성하기"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
