"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PostDetail } from "../../../types/post";
import {
  fetchPost,
  toggleLike,
  deletePost,
  createComment,
  deleteComment,
} from "../../../lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/useAuthStore";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PostDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentContent, setCommentContent] = useState("");

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postId = Number(params.id);
        const data = await fetchPost(postId);
        setPost(data);
      } catch (err) {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id]);

  const handleLike = async () => {
    if (!post) return;

    try {
      const updatedPost = await toggleLike(post.id);
      setPost(updatedPost);
    } catch (err) {
      alert("좋아요 처리에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!post) return;

    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    try {
      await deletePost(post.id);
      alert("게시글이 삭제되었습니다.");
      router.push("/community");
    } catch (err) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post) return;

    if (!commentContent.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      const updatedPost = await createComment(post.id, {
        content: commentContent,
      });
      setPost(updatedPost);
      setCommentContent("");
    } catch (err) {
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!post) return;

    const ok = confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      const updatedPost = await deleteComment(post.id, commentId);
      setPost(updatedPost);
    } catch (err) {
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <main>
        <p>{error || "존재하지 않는 게시글입니다."}</p>
        <Link href="/community">← 목록으로</Link>
      </main>
    );
  }

  return (
    <main>
      <Link href="/community">← 목록으로</Link>

      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>작성자: {post.author ?? "익명"}</p>
      <p>좋아요: {post.likeCount}</p>
      <button onClick={handleLike}>좋아요</button>

      {user?.username === post.author && (
        <button onClick={handleDelete}>삭제</button>
      )}

      <section>
        <h2>댓글</h2>

        {post.comments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          post.comments.map((comment) => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <p>작성자: {comment.author ?? "익명"}</p>

              {user?.username === comment.author && (
                <button onClick={() => handleDeleteComment(comment.id)}>
                  댓글 삭제
                </button>
              )}
            </div>
          ))
        )}

        {isLoggedIn ? (
          <form onSubmit={handleSubmitComment}>
            <textarea
              placeholder="댓글을 입력하세요"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button type="submit">댓글 작성</button>
          </form>
        ) : (
          <div>
            <p>로그인 후 댓글을 작성할 수 있습니다.</p>
            <Link href="/login">로그인</Link>
          </div>
        )}
      </section>
    </main>
  );
}