"use client";

import { useRouter } from "next/navigation";
import type { Post, PostListItem } from "@/types/post";

interface PostCardProps {
  post: Post | PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;
  // 목록 API와 상세 API의 댓글 필드 모양이 달라도 카드에서 같은 숫자를 보여주기 위한 보정이다.
  // 사용자는 언제나 댓글 수를 일관되게 보게 되고, 일부 응답 형태가 달라도 화면이 깨지지 않는다.
  const commentCount = "commentCount" in post ? post.commentCount : post.comments.length;

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
          □ {commentCount}
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