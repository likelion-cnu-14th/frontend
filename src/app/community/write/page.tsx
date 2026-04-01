"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPost } from "@/lib/api";

export default function WritePage() {
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert("작성자, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await createPost({ title, content, author });
      router.push("/community");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "게시글 작성에 실패했습니다."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 목록으로
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">글 작성</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="author" className="block text-sm font-medium mb-2">작성자</label>
          <input
            id="author"
            type="text"
            placeholder="이름을 입력하세요"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">제목</label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">내용</label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-vertical"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/community"
            className="inline-flex items-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            disabled={submitting || !title.trim() || !content.trim() || !author.trim()}
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? "작성 중..." : "작성하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
