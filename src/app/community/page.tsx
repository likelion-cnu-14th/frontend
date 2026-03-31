"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { getPosts } from "@/mockData"
import { PostCard } from "@/components/PostCard"
import type { Post } from "@/types/post"

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    ;(async () => {
      try {
        const data = await getPosts()
        if (!isMounted) return
        setPosts(data)
      } finally {
        if (!isMounted) return
        setIsLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">커뮤니티</h1>
        <Link
          href="/community/write"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900/40 dark:focus-visible:ring-zinc-700"
        >
          글 작성
        </Link>
      </div>

      <section className="mt-6 space-y-3">
        {isLoading ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            불러오는 중...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            게시글이 없어요.
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </main>
  )
}

