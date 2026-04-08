"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
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
        border: "1px solid #dfdfdf",
        borderRadius: "10px",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: "#fafafa",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: "6px", color: "#222" }}>
        작성자: {comment.author}
      </p>
      <p style={{ marginBottom: "6px", color: "#333" }}>{comment.content}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
          작성 시간: {new Date(comment.createdAt).toLocaleString()}
        </p>
        {onDelete ? (
          <button
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            style={{
              padding: "6px 10px",
              border: "none",
              borderRadius: "6px",
              backgroundColor: isDeleting ? "#9a9a9a" : "#2a2a2a",
              color: "#fff",
              cursor: isDeleting ? "not-allowed" : "pointer",
            }}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        ) : null}
      </div>
    </div>
  );
}