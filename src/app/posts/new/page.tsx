"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import type { CommunityPost } from "@/lib/communityTypes";
import { loadPosts, savePosts } from "@/lib/communityStorage";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `p_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => title.trim().length > 0 && content.trim().length > 0,
    [title, content]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const c = content.trim();
    if (t.length < 2) return setError("제목은 최소 2글자 이상 입력해주세요.");
    if (t.length > 100) return setError("제목은 100자를 넘길 수 없습니다.");
    if (c.length < 5) return setError("본문은 최소 5글자 이상 입력해주세요.");
    if (c.length > 5000) return setError("본문은 5000자를 넘길 수 없습니다.");

    const now = Date.now();
    const post: CommunityPost = {
      id: createId(),
      title: t,
      content: c,
      createdAt: now,
      updatedAt: now,
      comments: [],
      likesCount: 0,
    };

    const existing = loadPosts();
    savePosts([post, ...existing]);
    router.push(`/posts/${post.id}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-5 rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold">글 작성</div>
            <div className="mt-1 text-sm text-muted-foreground">
              입력한 글은 서버 없이 <code>localStorage</code>에 저장됩니다.
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            목록
          </Link>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border bg-card p-5"
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="text-sm font-semibold">제목</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="h-11 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="예: 안녕하세요! 처음 글입니다"
            />
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-semibold">본문</div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              className="min-h-48 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              placeholder="내용을 입력하세요"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition",
              canSubmit
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "bg-muted text-muted-foreground cursor-not-allowed",
            ].join(" ")}
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}

