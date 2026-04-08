"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import CommentItem from "@/components/CommentItem";
import { createComment, deletePost, fetchPost, toggleLike } from "@/lib/api";
import type { Comment, PostDetail } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

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

  const handleDelete = async () => {
    if (!post || isDeleting) return;

    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      router.push("/community");
    } catch {
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const canSubmitComment =
    commentAuthor.trim().length > 0 &&
    commentContent.trim().length > 0 &&
    !isCommenting;

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) {
      alert("게시글 정보를 불러오지 못했습니다.");
      return;
    }

    const author = commentAuthor.trim();
    const content = commentContent.trim();

    if (!author || !content) {
      alert("작성자와 댓글 내용을 입력해주세요.");
      return;
    }

    if (!canSubmitComment) return;

    try {
      setIsCommenting(true);

      const updated = await createComment(post.id, { author, content });

      setPost((prev) => {
        if (!prev) return prev;

        const prevIds = new Set(prev.comments.map((c) => c.id));
        const updatedAny = updated as unknown as {
          comments?: Comment[];
          id?: unknown;
          content?: unknown;
          author?: unknown;
          createdAt?: unknown;
        };

        // API가 PostDetail 전체를 주는 경우(comments 배열 포함)
        if (Array.isArray(updatedAny.comments)) {
          const newlyAdded = updatedAny.comments.filter((c) => !prevIds.has(c.id));
          if (newlyAdded.length === 0) return prev;
          return { ...prev, comments: [...prev.comments, ...newlyAdded] };
        }

        // API가 댓글 1개 객체만 주는 경우( comments 없음 )
        const maybeComment = updatedAny;
        const looksLikeComment =
          typeof maybeComment.id === "string" &&
          typeof maybeComment.content === "string" &&
          typeof maybeComment.author === "string" &&
          typeof maybeComment.createdAt === "string";

        if (looksLikeComment) {
          const nextComment = maybeComment as unknown as Comment;
          if (prevIds.has(nextComment.id)) return prev;
          return { ...prev, comments: [...prev.comments, nextComment] };
        }

        // 응답 형태를 못 맞추면 UI는 기존 상태 유지
        return prev;
      });

      setCommentAuthor("");
      setCommentContent("");
    } catch {
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-4 py-12">
        <div className="mx-auto max-w-[760px]">
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
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
          <div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-red-600">
              {error ?? "존재하지 않는 게시글입니다."}
            </p>
            <Link
              href="/community"
              className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← 목록으로
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
        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <Link
              href="/community"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← 목록으로
            </Link>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <span>{post.author}</span>
              <span className="text-gray-300" aria-hidden>
                ·
              </span>
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                {post.content}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => void handleLike()}
                disabled={isLiking}
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {isLiking ? "처리 중..." : "좋아요"}
              </button>
              <span className="text-sm text-gray-600">{post.likes}</span>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="ml-auto rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-6 sm:px-8">
            <h2 className="text-base font-semibold text-gray-900">댓글</h2>

            <form
              onSubmit={(e) => void handleCreateComment(e)}
              className="mt-4 rounded-md border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex-1">
                  <span className="sr-only">작성자</span>
                  <input
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="작성자"
                    disabled={isCommenting}
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300 disabled:bg-gray-100"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!canSubmitComment}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
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
                  className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-300 disabled:bg-gray-100"
                />
              </label>
            </form>

            <div className="mt-4">
              {post.comments.length === 0 ? (
                <p className="py-4 text-sm text-gray-500">아직 댓글이 없습니다.</p>
              ) : (
                <ul className="list-none divide-y divide-gray-200 rounded-md border border-gray-100 bg-white p-0">
                  {post.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
