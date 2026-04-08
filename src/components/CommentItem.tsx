"use client";

import { Comment } from "@/types/post";

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
  isDeleting?: boolean;
  canDelete?: boolean;
}

export default function CommentItem({
  comment,
  onDelete,
  isDeleting = false,
  canDelete = false,
}: CommentItemProps) {
  const timeLabel = new Date(comment.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="list-none rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4 transition hover:bg-white sm:px-5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{comment.author}</span>
        <time dateTime={comment.createdAt}>{timeLabel}</time>

        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            className="ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        )}
      </div>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
        {comment.content}
      </p>
    </li>
  );
}
