"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BoardHeader } from "../_components/BoardHeader";
import { useBoardStore } from "../_lib/useBoardStore";
import Link from "next/link";

type ApiPost = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
};

type ApiComment = {
  id: string;
  postId: string;
  content: string;
  createdAt: number;
};

export default function PostDetailPage() {
  const params = useParams<{ postId: string }>();
  const router = useRouter();
  const postId = params.postId;

  const {
    isReady,
    getPostById,
    getCommentsForPost,
    toggleLike,
    isLiked,
    addComment,
    // 있으면 사용, 없으면 아래 fallback 코드만 쓰면 됩니다.
    deletePost,
  } = useBoardStore();

  const [commentText, setCommentText] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // API에서 가져온 데이터
  const [apiPost, setApiPost] = useState<ApiPost | null>(null);
  const [apiComments, setApiComments] = useState<ApiComment[]>([]);
  const [useApiData, setUseApiData] = useState(false);

  const storePost = useMemo(() => {
    if (!postId) return null;
    return getPostById(postId);
  }, [getPostById, postId]);

  const storeComments = useMemo(() => {
    if (!postId) return [];
    return getCommentsForPost(postId).sort((a, b) => a.createdAt - b.createdAt);
  }, [getCommentsForPost, postId]);

  const post = useApiData ? apiPost : storePost;
  const comments = useApiData ? apiComments : storeComments;

  useEffect(() => {
    if (!postId) return;

    let ignore = false;

    const fetchPostDetail = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/api/posts/${postId}`, { cache: "no-store" }),
          fetch(`/api/posts/${postId}/comments`, { cache: "no-store" }),
        ]);

        if (!postRes.ok) {
          throw new Error("게시글 조회 실패");
        }

        const postData = await postRes.json();
        const commentsData = commentsRes.ok ? await commentsRes.json() : [];

        if (!ignore) {
          setApiPost(postData);
          setApiComments(
            Array.isArray(commentsData)
              ? commentsData.sort((a, b) => a.createdAt - b.createdAt)
              : []
          );
          setUseApiData(true);
        }
      } catch {
        if (!ignore) {
          setUseApiData(false);
        }
      }
    };

    fetchPostDetail();

    return () => {
      ignore = true;
    };
  }, [postId]);

  const handleDelete = async () => {
    if (!postId || !post) return;

    const ok = window.confirm("이 게시글을 삭제하시겠습니까?");
    if (!ok) return;

    setDeleteLoading(true);

    try {
      if (useApiData) {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("게시글 삭제 실패");
        }
      } else {
        if (typeof deletePost === "function") {
          deletePost(postId);
        } else {
          throw new Error("store에 deletePost가 없습니다.");
        }
      }

      alert("게시글이 삭제되었습니다.");
      router.push("/board");
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("게시글 삭제에 실패했습니다.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const trimmed = commentText.trim();
    const trimmedAuthor = author.trim();

    if (!trimmed || !trimmedAuthor) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    addComment(post.id, { content: trimmed, author: trimmedAuthor });

    setCommentText("");
    setAuthor("");

    setSubmitLoading(true);

    try {
      if (useApiData) {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: trimmed }),
        });

        if (!res.ok) {
          throw new Error("댓글 등록 실패");
        }

        const newComment = await res.json();
        setApiComments((prev) =>
          [...prev, newComment].sort((a, b) => a.createdAt - b.createdAt)
        );
      } else {
        addComment(postId, { content: trimmed });
      }

      setCommentText("");
    } catch (e) {
      console.error(e);
      setError("댓글 등록에 실패했습니다.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isReady && !useApiData) {
    return (
      <div className="min-h-screen bg-white">
        <BoardHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-zinc-600">로딩 중...</p>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <BoardHeader />
        <main className="mx-auto max-w-3xl px-4 py-10">
          <div className="rounded-xl border border-black/10 p-6">
            <p className="text-sm text-zinc-600">해당 글을 찾을 수 없습니다.</p>
            <div className="mt-4 flex gap-3">
              <Link
                href="/board"
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
              >
                목록으로
              </Link>
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
              >
                뒤로
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <BoardHeader />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/board" className="text-sm font-medium text-zinc-600 hover:text-black">
              ← 목록
            </Link>
            <span className="text-xs text-zinc-500">
              {new Date(post.createdAt).toLocaleString()}
            </span>
            <span className="rounded-full bg-zinc-100 px-2 py-1 text-[11px] text-zinc-600">
              {useApiData ? "API 모드" : "Store 모드"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleLike(post.id)}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-sm font-medium hover:bg-zinc-100"
              aria-pressed={isLiked(post.id)}
              title="좋아요"
            >
              <span aria-hidden="true">{isLiked(post.id) ? "♥" : "♡"}</span>
              {post.likes}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {deleteLoading ? "삭제 중..." : "삭제"}
            </button>
          </div>
        </div>

        <article className="rounded-xl border border-black/10 bg-white p-5">
          <h1 className="text-lg font-bold tracking-tight">{post.title}</h1>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-900">
            {post.content}
          </p>
        </article>

        <section className="mt-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-sm font-semibold text-zinc-800">댓글</h2>
            <div className="text-xs text-zinc-500">{comments.length}개</div>
          </div>

          <form
            className="mt-3 flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4"
            onSubmit={handleSubmitComment}
          >
            <label className="text-xs font-medium text-zinc-600" htmlFor="comment">
              댓글 작성
            </label>

            <input
             value={author}
             onChange={(e) => setAuthor(e.target.value)}
             placeholder="작성자 이름"
             className="h-10 rounded-lg border border-black/10 px-3 text-sm focus:border-black/30"
            />

            <textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[90px] resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30"
              placeholder="댓글을 입력하세요"
            />
            {error ? <p className="text-xs text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={submitLoading}
              className="h-10 rounded-lg bg-black px-4 text-sm font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitLoading ? "등록 중..." : "댓글 등록"}
            </button>
          </form>

          {comments.length === 0 ? (
            <div className="mt-4 rounded-xl border border-black/10 bg-white p-4 text-sm text-zinc-600">
              아직 댓글이 없습니다.
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {comments.map((c) => (
                <li
                  key={c.id}
                  className="rounded-xl border border-black/10 bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-zinc-800">
                      {c.author || "익명"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-900">
                    {c.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}