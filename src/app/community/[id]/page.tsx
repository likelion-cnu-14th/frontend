"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPost, toggleLike, deletePost, createComment, deleteComment } from "@/lib/api";
import { Post } from "@/types/post";
import CommentItem from "@/components/CommentItem";
import { Heart, ArrowLeft, Trash2, Send } from "lucide-react";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPost(id);
        setPost(data);
        const likedPosts: string[] = JSON.parse(localStorage.getItem("likedPosts") || "[]");
        setIsLiked(likedPosts.includes(id));
      } catch (err) {
        setError(err instanceof Error ? err.message : "게시글을 불러올 수 없습니다.");
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
      const likedPosts: string[] = JSON.parse(localStorage.getItem("likedPosts") || "[]");
      if (isLiked) {
        localStorage.setItem("likedPosts", JSON.stringify(likedPosts.filter((pid) => pid !== id)));
      } else {
        localStorage.setItem("likedPosts", JSON.stringify([...likedPosts, id]));
      }
      setIsLiked(!isLiked);
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
    if (!commentContent.trim() || !commentAuthor.trim()) {
      alert("작성자와 댓글 내용을 입력해주세요.");
      return;
    }
    try {
      const newComment = await createComment(id, {
        content: commentContent,
        author: commentAuthor,
      });
      setPost((prev) =>
        prev ? { ...prev, comments: [...prev.comments, newComment] } : prev
      );
      setCommentContent("");
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "게시글을 찾을 수 없습니다."}</p>
        <button
          onClick={() => router.push("/community")}
          className="text-sm text-muted-foreground underline"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/community")}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          목록으로
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 rounded px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          삭제
        </button>
      </div>

      {/* 게시글 */}
      <article className="mb-8">
        <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{post.author}</span>
          <span>·</span>
          <span>{formattedDate}</span>
        </div>
        <div className="mb-6 whitespace-pre-wrap leading-relaxed">{post.content}</div>
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
            isLiked
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-border text-muted-foreground hover:bg-accent"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          좋아요 {post.likes}
        </button>
      </article>

      {/* 댓글 섹션 */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          댓글 {post.comments.length}개
        </h2>

        {/* 댓글 입력 */}
        <div className="mb-6 rounded-lg border border-border p-4">
          <div className="mb-3">
            <input
              type="text"
              placeholder="작성자"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="댓글을 입력하세요..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing) handleComment();
              }}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleComment}
              className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
              작성
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        {post.comments.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
          </p>
        ) : (
          <div>
            {post.comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
