"use client";

import { Comment } from "../types/post";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="rounded border p-3">
      <div className="text-sm font-semibold">{comment.author}</div>
      <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
      <div className="mt-2 text-xs text-gray-400">{comment.createdAt}</div>
    </div>
  );
}