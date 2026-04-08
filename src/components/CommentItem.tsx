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
  const timeLabel = new Date(comment.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="list-none px-4 py-4 sm:px-5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-gray-500">
        <span className="font-medium text-gray-700">{comment.author}</span>
        <time dateTime={comment.createdAt}>{timeLabel}</time>

        <button
          type="button"
          onClick={() => {
            const ok = confirm("댓글을 삭제하시겠습니까?");
            if (!ok) return;
            onDelete(comment.id);
          }}
          disabled={isDeleting}
          className="ml-auto inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          {isDeleting ? "삭제 중..." : "삭제"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-gray-800">{comment.content}</p>
    </li>
  );
}
