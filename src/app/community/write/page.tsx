"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostSection } from "@/types/post";
import { createPost } from "@/lib/api";
import { PageContainer } from "@/components/PageContainer";
import { useAuthStore } from "@/store/authStore";

export default function WritePage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const initialize = useAuthStore((state) => state.initialize);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [section, setSection] = useState<PostSection>("free");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async () => {
    // 이미 제출 중이면 중복 클릭 방지
    if (submitting) return;

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요!");
      return;
    }
    setSubmitting(true);
    try {
      await createPost({
        title: title.trim(),
        content: content.trim(),
        section,
      });
      router.push("/community");
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { detail?: unknown; error?: string; message?: string } };
        code?: string;
      };
      const detail = ax.response?.data?.detail;
      const detailMsg =
        detail && typeof detail === "object" && detail !== null && "error" in detail
          ? String((detail as { error?: string }).error)
          : undefined;
      const message =
        detailMsg ||
        ax.response?.data?.error ||
        ax.response?.data?.message ||
        (ax.code === "ERR_NETWORK"
          ? "서버에 연결할 수 없습니다. NEXT_PUBLIC_API_URL 또는 네트워크를 확인하세요."
          : null) ||
        "글 저장 중 오류가 발생했습니다.";
      alert(message);
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <button
        type="button"
        onClick={() => router.push("/community")}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      >
        ← 목록으로
      </button>

      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        새 글 쓰기
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        제목과 본문을 작성한 뒤 등록하세요.
      </p>

      <div className="mt-8 space-y-4">
        <select
          value={section}
          onChange={(e) => setSection(e.target.value as PostSection)}
          className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition focus:border-ring focus:ring-1 focus:ring-ring"
        >
          <option value="notice">공지</option>
          <option value="free">자유게시판</option>
        </select>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
        />
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full resize-y rounded-lg border border-input bg-card/40 px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground/70 focus:border-ring focus:ring-1 focus:ring-ring"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "저장 중..." : "작성 완료"}
        </button>
      </div>
    </PageContainer>
  );
}