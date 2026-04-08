"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  isDeleting?: boolean;
}

export default function CommentItem({
  comment,
  onDelete,
  isDeleting = false,
}: CommentItemProps) {
  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: "#f8fafc",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: "6px", color: "#0f172a" }}>
        작성자: {comment.author}
      </p>
      <p style={{ marginBottom: "6px", color: "#334155" }}>{comment.content}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          작성 시간: {new Date(comment.createdAt).toLocaleString()}
        </p>
        <button
          onClick={() => onDelete(comment.id)}
          disabled={isDeleting}
          style={{
            padding: "6px 10px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: isDeleting ? "#ef9a9a" : "#d32f2f",
            color: "#fff",
            cursor: isDeleting ? "not-allowed" : "pointer",
          }}
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
      </div>
    </div>
  );
}