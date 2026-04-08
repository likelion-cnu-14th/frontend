"use client";

import { useRouter } from "next/navigation";

import type { PostListItem } from "@/types/post";

interface PostCardProps {
  post: PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <button
      type="button"
      onClick={() => router.push(`/community/${post.id}`)}
      className="w-full rounded-lg border border-gray-200 bg-white px-5 py-5 text-left shadow-sm"
    >
      <h2 className="text-lg font-bold leading-snug text-gray-900">
        {post.title}
      </h2>

      <p className="mt-2 overflow-hidden text-sm leading-relaxed text-gray-600 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
        {post.content}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
        <span>{post.author}</span>
        <span className="text-gray-300" aria-hidden>
          ·
        </span>
        <time dateTime={post.createdAt}>{formattedDate}</time>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span>좋아요 {post.likes}</span>
        <span className="text-gray-300" aria-hidden>
          ·
        </span>
        <span>댓글 {post.commentCount}</span>
      </div>
    </button>
  );
}
