"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CommunityComment, CommunityPost } from "@/lib/communityTypes";
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

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `c_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params.id;

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const isLiked = useMemo(() => likedIds.has(postId), [likedIds, postId]);

  useEffect(() => {
    const all = loadPosts();
    setPost(all.find((p) => p.id === postId) ?? null);
    setLikedIds(loadLikedPostIds());
  }, [postId]);

  const refreshPost = () => {
    const all = loadPosts();
    setPost(all.find((p) => p.id === postId) ?? null);
  };

  const toggleLike = () => {
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
    setPost(all[idx]);
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const text = commentText.trim();
    if (!text) return setError("댓글 내용을 입력해주세요.");
    if (text.length > 500) return setError("댓글은 500자를 넘길 수 없습니다.");

    const all = loadPosts();
    const idx = all.findIndex((p) => p.id === postId);
    if (idx === -1) return setError("해당 글을 찾을 수 없습니다.");

    const comment: CommunityComment = { id: createId(), text, createdAt: Date.now() };
    all[idx].comments = [...all[idx].comments, comment];
    all[idx].updatedAt = Date.now();

    savePosts(all);
    setCommentText("");
    setPost(all[idx]);
  };

  const startEditComment = (c: CommunityComment) => {
    setEditingCommentId(c.id);
    setEditingCommentText(c.text);
    setError(null);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText("");
  };

  const saveEditComment = (commentId: string) => {
    const text = editingCommentText.trim();
    if (!text) return setError("댓글 내용을 입력해주세요.");
    if (text.length > 500) return setError("댓글은 500자를 넘길 수 없습니다.");

    const all = loadPosts();
    const pIdx = all.findIndex((p) => p.id === postId);
    if (pIdx === -1) return setError("해당 글을 찾을 수 없습니다.");

    const cIdx = all[pIdx].comments.findIndex((c) => c.id === commentId);
    if (cIdx === -1) return setError("해당 댓글을 찾을 수 없습니다.");

    all[pIdx].comments[cIdx] = {
      ...all[pIdx].comments[cIdx],
      text,
      updatedAt: Date.now(),
    };
    all[pIdx].updatedAt = Date.now();

    savePosts(all);
    setPost(all[pIdx]);
    cancelEditComment();
  };

  const deleteComment = (commentId: string) => {
    const all = loadPosts();
    const pIdx = all.findIndex((p) => p.id === postId);
    if (pIdx === -1) return;

    all[pIdx].comments = all[pIdx].comments.filter((c) => c.id !== commentId);
    all[pIdx].updatedAt = Date.now();
    savePosts(all);
    setPost(all[pIdx]);

    if (editingCommentId === commentId) cancelEditComment();
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="mb-5 rounded-2xl border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-extrabold">게시글 상세</div>
            <div className="mt-1 text-sm text-muted-foreground">
              서버 없이 <code>localStorage</code>로만 동작합니다.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-accent"
            >
              목록
            </Link>
            {post ? (
              <>
                <Link
                  href={`/posts/${postId}/edit`}
                  className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-accent"
                >
                  글 수정
                </Link>
                <button
                  type="button"
                  onClick={toggleLike}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition",
                    isLiked
                      ? "bg-primary text-primary-foreground"
                      : "bg-background hover:bg-accent",
                  ].join(" ")}
                  aria-pressed={isLiked}
                >
                  좋아요 {post.likesCount}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {!post ? (
        <div className="rounded-2xl border bg-card p-5 text-sm">
          해당 게시글을 찾을 수 없습니다.
          <div className="mt-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-accent"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="rounded-2xl border bg-card p-5">
            <div className="text-2xl font-extrabold">{post.title}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              작성일 {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt ? (
                <span> · 수정 {formatDate(post.updatedAt)}</span>
              ) : null}
            </div>

            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-7">
              {post.content}
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-5">
            <div className="mb-3 text-base font-extrabold">
              댓글 {post.comments.length}
            </div>

            {post.comments.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
              </div>
            ) : (
              <div className="grid gap-3">
                {[...post.comments]
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((c) => {
                    const isEditing = editingCommentId === c.id;
                    return (
                      <div key={c.id} className="rounded-2xl border bg-background p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">익명</div>
                            <div className="mt-1 text-xs text-muted-foreground">
                              {formatDate(c.createdAt)}
                              {c.updatedAt ? (
                                <span> · 수정 {formatDate(c.updatedAt)}</span>
                              ) : null}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => saveEditComment(c.id)}
                                  className="inline-flex h-9 items-center justify-center rounded-xl border bg-primary px-3 text-xs font-semibold text-primary-foreground hover:opacity-90"
                                >
                                  저장
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEditComment}
                                  className="inline-flex h-9 items-center justify-center rounded-xl border bg-background px-3 text-xs font-semibold hover:bg-accent"
                                >
                                  취소
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditComment(c)}
                                  className="inline-flex h-9 items-center justify-center rounded-xl border bg-background px-3 text-xs font-semibold hover:bg-accent"
                                >
                                  수정
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteComment(c.id)}
                                  className="inline-flex h-9 items-center justify-center rounded-xl border bg-background px-3 text-xs font-semibold hover:bg-accent"
                                >
                                  삭제
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {isEditing ? (
                          <textarea
                            value={editingCommentText}
                            onChange={(e) => setEditingCommentText(e.target.value)}
                            maxLength={500}
                            className="mt-3 min-h-24 w-full rounded-xl border bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                          />
                        ) : (
                          <div className="mt-3 whitespace-pre-wrap text-sm leading-6">
                            {c.text}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}

            <form onSubmit={submitComment} className="mt-5 grid gap-3">
              <div className="text-sm font-semibold">댓글 작성</div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                maxLength={500}
                className="min-h-28 w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                placeholder="댓글을 입력하세요"
              />

              {error ? (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
                  {error}
                </div>
              ) : null}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    cancelEditComment();
                    refreshPost();
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl border bg-background px-4 text-sm font-semibold hover:bg-accent"
                >
                  새로고침
                </button>
                <button
                  type="submit"
                  disabled={commentText.trim().length === 0}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition",
                    commentText.trim().length === 0
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:opacity-90",
                  ].join(" ")}
                >
                  댓글 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

