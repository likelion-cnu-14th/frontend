"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { getPosts, savePosts } from "@/mockData"
import type { Post } from "@/types/post"

export default function CommunityWritePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSaving) return

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle || !trimmedContent) return

    setIsSaving(true)
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        title: trimmedTitle,
        content: trimmedContent,
        author: "익명",
        createdAt: new Date().toISOString(),
        likesCount: 0,
        comments: [],
      }

      const prev = await getPosts()
      const next = [newPost, ...prev]
      await savePosts(next)
      router.push("/community")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">글 작성</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            제목
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            내용
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            className="w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          />
        </label>

        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            disabled={isSaving || title.trim().length === 0 || content.trim().length === 0}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40 dark:focus-visible:ring-zinc-700"
          >
            {isSaving ? "저장 중..." : "작성 완료"}
          </button>
        </div>
      </form>
    </main>
  )
}

