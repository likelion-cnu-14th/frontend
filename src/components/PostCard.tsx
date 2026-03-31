"use client"

import { useRouter } from "next/navigation"
import { Heart, MessageCircle } from "lucide-react"

import type { Post } from "@/types/post"
import { cn } from "@/lib/utils"

function formatDate(value: Post["createdAt"]) {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(d)
}

type PostCardProps = {
  post: Post
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const router = useRouter()

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/community/${post.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(`/community/${post.id}`)
      }}
      className={cn(
        "cursor-pointer rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:focus-visible:ring-zinc-700",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h3>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
        <span className="font-medium text-zinc-800 dark:text-zinc-200">{post.author}</span>
        <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
          ·
        </span>
        <time dateTime={post.createdAt instanceof Date ? post.createdAt.toISOString() : post.createdAt}>
          {formatDate(post.createdAt)}
        </time>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="inline-flex items-center gap-1.5">
          <Heart className="h-4 w-4" aria-hidden />
          <span className="tabular-nums">{post.likesCount}</span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <MessageCircle className="h-4 w-4" aria-hidden />
          <span className="tabular-nums">{post.comments.length}</span>
        </div>
      </div>
    </article>
  )
}

