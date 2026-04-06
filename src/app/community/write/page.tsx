"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WritePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">글을 작성하려면 로그인이 필요합니다.</p>
        <Link
          href="/login"
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          로그인하기
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await createPost({ title, content, author: user.username });
      router.push("/community");
    } catch (err) {
      alert(err instanceof Error ? err.message : "게시글 작성에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.push("/community")}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </button>
      </div>

      <h1 className="mb-6 text-2xl font-bold">글 작성</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">작성자</label>
          <p className="rounded-md border border-input bg-muted px-3 py-2 text-sm">
            {user.username}
          </p>
        </div>
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
            제목
          </label>
          <input
            id="title"
            type="text"
            placeholder="게시글 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label htmlFor="content" className="mb-1.5 block text-sm font-medium">
            내용
          </label>
          <textarea
            id="content"
            placeholder="게시글 내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? "작성 중..." : "작성하기"}
        </button>
      </div>
    </div>
  );
}
