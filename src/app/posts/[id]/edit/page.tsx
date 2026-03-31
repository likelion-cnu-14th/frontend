"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { loadPosts, savePosts } from "@/lib/communityStorage";
import type { CommunityPost } from "@/lib/communityTypes";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params.id;

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const all = loadPosts();
    const found = all.find((p) => p.id === postId) ?? null;
    setPost(found);
    setTitle(found?.title ?? "");
    setContent(found?.content ?? "");
  }, [postId]);

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

    const all = loadPosts();
    const idx = all.findIndex((p) => p.id === postId);
    if (idx === -1) return setError("해당 글을 찾을 수 없습니다.");

    all[idx] = {
      ...all[idx],
      title: t,
      content: c,
      updatedAt: Date.now(),
    };

    savePosts(all);
    router.push(`/posts/${postId}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-5 rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold">글 수정</div>
            <div className="mt-1 text-sm text-muted-foreground">
              수정 내용은 <code>localStorage</code>에 저장됩니다.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${postId}`}
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-accent"
            >
              상세로
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-accent"
            >
              목록
            </Link>
          </div>
        </div>
      </div>

      {!post ? (
        <div className="rounded-2xl border bg-card p-5 text-sm">
          해당 게시글을 찾을 수 없습니다.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="rounded-2xl border bg-card p-5">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="text-sm font-semibold">제목</div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="h-11 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="제목"
              />
            </div>

            <div className="grid gap-2">
              <div className="text-sm font-semibold">본문</div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={5000}
                className="min-h-48 rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="내용"
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
              수정 저장
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

