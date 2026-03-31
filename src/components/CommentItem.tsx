"use client"

import type { Comment } from "@/types/post"
import { cn } from "@/lib/utils"

function formatDate(value: Comment["createdAt"]) {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d)
}

type CommentItemProps = {
  comment: Comment
  className?: string
}

export function CommentItem({ comment, className }: CommentItemProps) {
  return (
    <article
      className={cn(
        "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {comment.author}
        </span>
        <time
          className="text-xs text-zinc-500 dark:text-zinc-400"
          dateTime={comment.createdAt instanceof Date ? comment.createdAt.toISOString() : comment.createdAt}
        >
          {formatDate(comment.createdAt)}
        </time>
      </div>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
        {comment.content}
      </p>
    </article>
  )
}

