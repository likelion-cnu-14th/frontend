"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CommentItem from "@/components/CommentItem";
import {
  createComment,
  deleteComment,
  deletePost,
  fetchPost,
  toggleLike,
} from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { PostDetail } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<
    | { kind: "post"; id: string }
    | { kind: "comment"; id: string }
    | null
  >(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPost(id);
        setPost(data);
      } catch {
        setPost(null);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void loadPost();
    }
  }, [id]);

  const handleLike = async () => {
    if (!post || isLiking) return;

    try {
      setIsLiking(true);

      const updatedPost = await toggleLike(post.id);
      setPost(updatedPost);
    } catch {
      alert("좋아요 처리에 실패했습니다.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = () => {
    if (!post || isDeleting || confirmDelete) return;
    setConfirmDelete({ kind: "post", id: post.id });
  };

  const canSubmitComment = commentContent.trim().length > 0 && !isCommenting;
  const canDeletePost = Boolean(user && post && user.username === post.author);

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) {
      alert("게시글 정보를 불러오지 못했습니다.");
      return;
    }

    const content = commentContent.trim();

    if (!content) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (!canSubmitComment) return;

    try {
      setIsCommenting(true);

      await createComment(post.id, { content });

      const updatedPost = await fetchPost(post.id);
      setPost(updatedPost);
      setCommentContent("");
    } catch {
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (!post) return;
    if (deletingCommentId === commentId) return;
    if (confirmDelete) return;

    setConfirmDelete({ kind: "comment", id: commentId });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const target = confirmDelete;
    setConfirmDelete(null);

    if (target.kind === "post") {
      try {
        setIsDeleting(true);
        await deletePost(target.id);
        router.push("/community");
      } catch {
        alert("게시글 삭제에 실패했습니다.");
      } finally {
        setIsDeleting(false);
      }
      return;
    }

    try {
      setDeletingCommentId(target.id);
      await deleteComment(target.id);
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments.filter((comment) => comment.id !== target.id),
        };
      });
    } catch {
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-4 py-12">
        <div className="mx-auto max-w-[760px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-4 py-12">
        <div className="mx-auto max-w-[760px]">
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-red-600">
              {error ?? "존재하지 않는 게시글입니다."}
            </p>
            <Link
              href="/community"
              className="mt-4 inline-flex text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white px-6 py-6 sm:px-8">
            <Link
              href="/community"
              className="text-sm font-semibold text-gray-600 transition hover:text-gray-900"
            >
              목록으로
            </Link>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              {post.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <span>{post.author}</span>
              <span className="text-gray-300" aria-hidden>
                ·
              </span>
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <div className="whitespace-pre-wrap text-base leading-8 text-gray-800">
                {post.content}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleLike()}
                disabled={isLiking}
                className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isLiking ? "처리 중..." : "좋아요"}
              </button>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {post.likes}
              </span>

              {canDeletePost && (
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isDeleting}
                  className="ml-auto rounded-full border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-6 sm:px-8">
            <h2 className="text-base font-bold text-gray-900">댓글</h2>

            {isLoggedIn ? (
              <form
                onSubmit={(e) => void handleCreateComment(e)}
                className="mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={!canSubmitComment}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {isCommenting ? "작성 중..." : "댓글 작성"}
                  </button>
                </div>
                <label className="mt-3 block">
                  <span className="sr-only">댓글 내용</span>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    disabled={isCommenting}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-100"
                  />
                </label>
              </form>
            ) : (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-5 text-sm text-gray-600 shadow-sm">
                로그인 후 댓글을 작성할 수 있습니다.{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  로그인하기
                </Link>
              </div>
            )}

            <div className="mt-4">
              {post.comments.length === 0 ? (
                <p className="py-4 text-sm text-gray-500">아직 댓글이 없습니다.</p>
              ) : (
                <ul className="list-none space-y-2 rounded-xl bg-white p-3 ring-1 ring-gray-100">
                  {post.comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      onDelete={(commentId) => void handleDeleteComment(commentId)}
                      isDeleting={deletingCommentId === comment.id}
                      canDelete={user?.username === comment.author}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-xl border border-gray-100 bg-white p-5 shadow-xl">
            <p className="text-sm text-gray-900">
              {confirmDelete.kind === "post"
                ? "게시글을 삭제하시겠습니까?"
                : "댓글을 삭제하시겠습니까?"}
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleConfirmDelete()}
                disabled={isDeleting || deletingCommentId !== null}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
