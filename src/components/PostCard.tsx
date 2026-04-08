"use client";

import { useRouter } from "next/navigation";
import { PostListItem } from "@/types/post";

interface PostCardProps {
  post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/community/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #dbe2ea",
        borderRadius: "14px",
        padding: "18px",
        marginBottom: "14px",
        cursor: "pointer",
        backgroundColor: "#fff",
        boxShadow: "0 8px 20px rgba(15, 23, 42, 0.05)",
      }}
    >
      <h2 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#0f172a" }}>{post.title}</h2>

      <p style={{ margin: "0 0 10px 0", color: "#475569", lineHeight: 1.5 }}>{post.content}</p>

      <div style={{ fontSize: "14px", color: "#64748b" }}>
        <span>작성자: {post.author}</span>
        <span style={{ marginLeft: "12px" }}>좋아요: {post.likes}</span>
        <span style={{ marginLeft: "12px" }}>댓글: {post.commentCount}</span>
      </div>
    </div>
  );
}