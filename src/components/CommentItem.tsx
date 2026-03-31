"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  // TODO: 댓글 UI를 구현하세요
  // - 작성자, 댓글 내용, 작성 시간 표시
  return (
    <div>
      <p>{comment.content}</p>
      {/* 나머지를 구현하세요 */}
    </div>
  );
}
