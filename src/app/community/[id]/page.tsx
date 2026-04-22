"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { PostDetail } from "../../../types/post";
import { fetchPost, toggleLike, deletePost } from "../../../lib/api";
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
            </div>
          ))
        )}
      </section>
    </main>
  );
}