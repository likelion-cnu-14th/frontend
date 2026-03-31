"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "8px",
        padding: "12px",
        marginBottom: "10px",
        backgroundColor: "#fafafa",
      }}
    >
      <p style={{ fontWeight: "bold", marginBottom: "6px" }}>
        작성자: {comment.author}
      </p>
      <p style={{ marginBottom: "6px" }}>{comment.content}</p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        작성 시간: {comment.createdAt}
      </p>
    </div>
  );
}