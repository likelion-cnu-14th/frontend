"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CommunityPost } from "@/lib/communityTypes";
import {
  loadLikedPostIds,
  loadPosts,
  saveLikedPostIds,
  savePosts,
} from "@/lib/communityStorage";

function formatDate(epochMs: number) {
  return new Date(epochMs).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Home() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setPosts(loadPosts());
    setLikedIds(loadLikedPostIds());
  }, []);

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt);
  }, [posts]);

  const toggleLike = (postId: string) => {
    const all = loadPosts();
    const idx = all.findIndex((p) => p.id === postId);
    if (idx === -1) return;

    const nextLiked = loadLikedPostIds();
    const already = nextLiked.has(postId);
    if (already) {
      nextLiked.delete(postId);
      all[idx].likesCount = Math.max(0, all[idx].likesCount - 1);
    } else {
      nextLiked.add(postId);
      all[idx].likesCount = all[idx].likesCount + 1;
    }

    saveLikedPostIds(nextLiked);
    savePosts(all);
    setLikedIds(nextLiked);
    setPosts(all);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-5 rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold">글 목록</div>
            <div className="mt-1 text-sm text-muted-foreground">
              서버 없이 브라우저 <code>localStorage</code>로만 동작합니다.
            </div>
          </div>
          <Link
            href="/posts/new"
            className="inline-flex items-center justify-center rounded-xl border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            글 작성
          </Link>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border bg-card p-5 text-sm">
          아직 등록된 글이 없습니다.
        </div>
      ) : (
        <div className="grid gap-3">
          {sorted.map((p) => {
            const isLiked = likedIds.has(p.id);
            return (
              <Link
                key={p.id}
                href={`/posts/${p.id}`}
                className="group rounded-2xl border bg-card p-5 hover:border-ring/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-extrabold">
                      {p.title}
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {p.content}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleLike(p.id);
                    }}
                    className={[
                      "shrink-0 rounded-xl border px-3 py-2 text-sm font-semibold transition",
                      isLiked
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-accent",
                    ].join(" ")}
                    aria-pressed={isLiked}
                  >
                    좋아요 {p.likesCount}
                  </button>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  {formatDate(p.createdAt)}
                  {p.comments.length > 0 ? (
                    <span> · 댓글 {p.comments.length}</span>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
