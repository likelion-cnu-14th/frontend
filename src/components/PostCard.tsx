"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR");

  return (
    <button
      type="button"
      onClick={() => router.push(`/community/${post.id}`)}
      style={{
        ...px,
        width: "100%",
        textAlign: "left",
        background: "#fff",
        border: "3px solid #000",
        boxShadow: "4px 4px 0 #000",
        padding: "24px",
        cursor: "pointer",
        transition: "all 0.1s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "2px 2px 0 #000";
        e.currentTarget.style.transform = "translate(2px, 2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "4px 4px 0 #000";
        e.currentTarget.style.transform = "translate(0, 0)";
      }}
    >
      {/* 제목 */}
      <h2
        style={{
          ...px,
          fontSize: "11px",
          color: "#000",
          lineHeight: 2,
          marginBottom: "12px",
          wordBreak: "keep-all",
        }}
      >
        {post.title}
      </h2>

      {/* 구분선 (피그마 점선) */}
      <div
        style={{
          borderTop: "2px dashed #ccc",
          marginBottom: "12px",
        }}
      />

      {/* 좋아요 / 댓글 */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
        <span style={{ ...px, fontSize: "8px", color: "#333", display: "flex", alignItems: "center", gap: "5px" }}>
          ♡ {post.likes}
        </span>
        <span style={{ ...px, fontSize: "8px", color: "#333", display: "flex", alignItems: "center", gap: "5px" }}>
          □ {post.comments.length}
        </span>
      </div>

      {/* 구분선 */}
      <div style={{ borderTop: "2px dashed #ccc", marginBottom: "12px" }} />

      {/* 작성자 */}
      <p style={{ ...px, fontSize: "7px", color: "#888" }}>
        by&nbsp;&nbsp;{post.author}
      </p>
    </button>
  );
}