"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CommentItem from "@/components/CommentItem";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;

  const [post, setPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const posts = getPosts();
    const selectedPost = posts.find((item) => item.id === postId) ?? null;
    setPost(selectedPost);
  }, [postId]);

  const handleLike = () => {
    if (!post) return;
    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id ? { ...item, likes: item.likes + 1 } : item,
    );
    savePosts(updatedPosts);
    setPost(updatedPosts.find((item) => item.id === post.id) ?? null);
  };

  const handleComment = () => {
    if (!post || !commentInput.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      content: commentInput.trim(),
      author: "익명",
      createdAt: new Date().toISOString(),
    };
    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id
        ? { ...item, comments: [...item.comments, newComment] }
        : item,
    );
    savePosts(updatedPosts);
    setPost(updatedPosts.find((item) => item.id === post.id) ?? null);
    setCommentInput("");
  };

  if (!post) {
    return (
      <div style={{ ...px, minHeight: "100vh", background: "#fde047", padding: "32px 24px" }}>
        <p style={{ fontSize: "9px" }}>게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR");

  return (
    <div style={{ minHeight: "100vh", background: "#fde047", padding: "32px 24px" }}>

      {/* 목록으로 */}
      <button
        type="button"
        onClick={() => router.push("/community")}
        style={{
          ...px, fontSize: "9px", background: "transparent",
          border: "none", cursor: "pointer", color: "#000",
          marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px",
        }}
      >
        ← 목록으로
      </button>

      {/* 게시글 카드 */}
      <div
        style={{
          background: "#fff",
          border: "3px solid #000",
          boxShadow: "6px 6px 0 #000",
          padding: "28px",
          marginBottom: "32px",
          maxWidth: "720px",
        }}
      >
        {/* 제목 */}
        <h1 style={{ ...px, fontSize: "12px", color: "#000", lineHeight: 2, marginBottom: "16px", wordBreak: "keep-all" }}>
          {post.title}
        </h1>

        {/* 작성자 / 날짜 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <span style={{ ...px, fontSize: "8px", color: "#a855f7" }}>{post.author}</span>
          <span style={{ ...px, fontSize: "7px", color: "#888" }}>{formattedDate}</span>
        </div>

        {/* 점선 */}
        <div style={{ borderTop: "2px dashed #ccc", marginBottom: "20px" }} />

        {/* 본문 */}
        <p style={{ ...px, fontSize: "8px", color: "#333", lineHeight: 2.6, whiteSpace: "pre-wrap", marginBottom: "24px" }}>
          {post.content}
        </p>

        {/* 점선 */}
        <div style={{ borderTop: "2px dashed #ccc", marginBottom: "20px" }} />

        {/* 좋아요 / 댓글 수 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            type="button"
            onClick={handleLike}
            style={{
              ...px, fontSize: "8px",
              background: "#ef4444", color: "#fff",
              border: "3px solid #000",
              boxShadow: "3px 3px 0 #000",
              padding: "10px 16px",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "8px",
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "1px 1px 0 #000";
              e.currentTarget.style.transform = "translate(2px,2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "3px 3px 0 #000";
              e.currentTarget.style.transform = "translate(0,0)";
            }}
          >
            ♥ 좋아요 {post.likes}
          </button>
          <span style={{ ...px, fontSize: "8px", color: "#555", display: "flex", alignItems: "center", gap: "6px" }}>
            □ 댓글 {post.comments.length}
          </span>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div style={{ maxWidth: "720px" }}>
        <h2 style={{ ...px, fontSize: "11px", color: "#000", marginBottom: "20px", letterSpacing: "2px" }}>
          댓글&nbsp;&nbsp;《{post.comments.length}》
        </h2>

        {/* 댓글 작성 카드 */}
        <div
          style={{
            background: "#fff",
            border: "3px solid #000",
            boxShadow: "4px 4px 0 #000",
            padding: "24px",
            marginBottom: "20px",
          }}
        >
          <p style={{ ...px, fontSize: "8px", color: "#888", marginBottom: "12px" }}>
            댓글 작성 《as 익명》
          </p>
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력하세요"
            maxLength={500}
            rows={3}
            style={{
              ...px, fontSize: "8px",
              width: "100%",
              border: "2px solid #000",
              padding: "12px",
              resize: "none",
              outline: "none",
              lineHeight: 2,
              marginBottom: "8px",
            }}
          />
          <div style={{ ...px, fontSize: "7px", color: "#888", textAlign: "right", marginBottom: "16px" }}>
            {commentInput.length} / 500
          </div>
          <button
            type="button"
            onClick={handleComment}
            style={{
              ...px, fontSize: "8px",
              background: "#93c5fd",
              color: "#000",
              border: "3px solid #000",
              boxShadow: "3px 3px 0 #000",
              padding: "12px 20px",
              cursor: "pointer",
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "1px 1px 0 #000";
              e.currentTarget.style.transform = "translate(2px,2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "3px 3px 0 #000";
              e.currentTarget.style.transform = "translate(0,0)";
            }}
          >
            댓글 달기
          </button>
        </div>

        {/* 댓글 목록 */}
        {post.comments.length === 0 ? (
          <p style={{ ...px, fontSize: "8px", color: "#888" }}>아직 댓글이 없습니다.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}