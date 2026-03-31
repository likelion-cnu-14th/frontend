"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

import { getPosts, savePosts } from "@/mockData"
import type { Comment, Post } from "@/types/post"
import { CommentItem } from "@/components/CommentItem"

export default function CommunityDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const postId = useMemo(() => String(params?.id ?? ""), [params])

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingLike, setIsSavingLike] = useState(false)
  const [commentContent, setCommentContent] = useState("")
  const [isSavingComment, setIsSavingComment] = useState(false)

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const posts = await getPosts()
        const found = posts.find((p) => String(p.id) === postId) ?? null
        if (!isMounted) return
        setPost(found)
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [postId])

  async function handleLike() {
    if (!post || isSavingLike) return
    setIsSavingLike(true)
    try {
      const posts = await getPosts()
      const idx = posts.findIndex((p) => String(p.id) === String(post.id))
      if (idx < 0) return

      const updated: Post = { ...posts[idx], likesCount: posts[idx].likesCount + 1 }
      const next = [...posts]
      next[idx] = updated
      await savePosts(next)
      setPost(updated)
    } finally {
      setIsSavingLike(false)
    }
  }

  async function handleAddComment() {
    if (!post || isSavingComment) return
    const trimmed = commentContent.trim()
    if (!trimmed) return

    setIsSavingComment(true)
    try {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: "익명",
        content: trimmed,
        createdAt: new Date().toISOString(),
      }
      const posts = await getPosts()
      const idx = posts.findIndex((p) => String(p.id) === String(post.id))
      if (idx < 0) return

      const updated: Post = { ...posts[idx], comments: [...posts[idx].comments, newComment] }
      const next = [...posts]
      next[idx] = updated
      await savePosts(next)
      setPost(updated)
      setCommentContent("")
    } finally {
      setIsSavingComment(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          불러오는 중...
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            게시글을 찾을 수 없어요.
          </h1>
          <button
            type="button"
            onClick={() => router.push("/community")}
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40 dark:focus-visible:ring-zinc-700"
          >
            목록으로
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="font-medium text-zinc-800 dark:text-zinc-200">{post.author}</span>
          <span aria-hidden className="mx-2 text-zinc-300 dark:text-zinc-700">
            ·
          </span>
          <span>
            {new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(
              post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt),
            )}
          </span>
        </div>

        <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-zinc-800 dark:text-zinc-200">
          {post.content}
        </p>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleLike}
            disabled={isSavingLike}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40 dark:focus-visible:ring-zinc-700"
          >
            {isSavingLike ? "좋아요..." : `좋아요 ${post.likesCount}`}
          </button>
          <button
            type="button"
            onClick={() => router.push("/community")}
            className="text-sm font-semibold text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            목록으로
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          댓글 ({post.comments.length})
        </h2>

        <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={3}
            className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleAddComment}
              disabled={isSavingComment || commentContent.trim().length === 0}
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40 dark:focus-visible:ring-zinc-700"
            >
              {isSavingComment ? "작성 중..." : "댓글 작성"}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {post.comments.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              아직 댓글이 없어요.
            </div>
          ) : (
            post.comments.map((c) => <CommentItem key={c.id} comment={c} />)
          )}
        </div>
      </section>
    </main>
  )
}

