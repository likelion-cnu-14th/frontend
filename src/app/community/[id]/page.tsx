"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchPost, toggleLike, deletePost, createComment, deleteComment } from "@/lib/api";
import { Post } from "@/types/post";
import CommentItem from "@/components/CommentItem";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPost(id);
        setPost(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "게시글을 불러올 수 없습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const updated = await toggleLike(id);
      setPost(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "좋아요 처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deletePost(id);
      router.push("/community");
    } catch (err) {
      alert(err instanceof Error ? err.message : "삭제에 실패했습니다.");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !commentAuthor.trim()) {
      alert("작성자와 댓글 내용을 입력해주세요.");
      return;
    }
    try {
      const newComment = await createComment(id, {
        content: commentText,
        author: commentAuthor,
      });
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
      setCommentText("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteComment(commentId);
      setPost((prev) =>
        prev
          ? { ...prev, comments: prev.comments.filter((c) => c.id !== commentId) }
          : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-destructive mb-4">{error || "게시글을 찾을 수 없습니다."}</p>
        <Link href="/community" className="text-sm text-muted-foreground underline hover:text-foreground">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between">
        <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 목록으로
        </Link>
        <button
          onClick={handleDelete}
          className="text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          삭제
        </button>
      </div>

      {/* 게시글 */}
      <article className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-xs font-medium text-primary">
            {post.author[0]}
          </div>
          <span className="font-medium text-foreground">{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLike}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            좋아요 {post.likes}
          </button>
        </div>
      </article>

      {/* 댓글 */}
      <section className="mt-10 border-t border-border pt-8">
        <h3 className="text-lg font-semibold mb-4">
          댓글 <span className="text-muted-foreground font-normal">{post.comments.length}</span>
        </h3>

        {post.comments.length > 0 ? (
          <div className="mb-6">
            {post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
        )}

        <div className="space-y-3">
          <input
            type="text"
            placeholder="작성자 이름"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) handleComment();
              }}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || !commentAuthor.trim()}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              작성
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
