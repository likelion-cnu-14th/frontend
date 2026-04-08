"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import CommentItem from "@/components/CommentItem";
import { fetchPost } from "@/lib/api";
import type { PostDetail } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPost(id);
        setPost(data);
      } catch {
        setPost(null);
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void loadPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-4 py-12">
        <div className="mx-auto max-w-[760px]">
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">
            로딩 중...
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] px-4 py-12">
        <div className="mx-auto max-w-[760px]">
          <div className="rounded-lg border border-red-200 bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-red-600">
              {error ?? "존재하지 않는 게시글입니다."}
            </p>
            <Link
              href="/community"
              className="mt-4 inline-flex text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              ← 목록으로
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <article className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
            <Link
              href="/community"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← 목록으로
            </Link>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              <span>{post.author}</span>
              <span className="text-gray-300" aria-hidden>
                ·
              </span>
              <time dateTime={post.createdAt}>{formattedDate}</time>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-800">
                {post.content}
              </div>
            </div>

            <div className="mt-8 text-sm text-gray-600">좋아요 {post.likes}</div>
          </div>

          <div className="border-t border-gray-200 bg-gray-50/50 px-6 py-6 sm:px-8">
            <h2 className="text-base font-semibold text-gray-900">댓글</h2>

            <div className="mt-4">
              {post.comments.length === 0 ? (
                <p className="py-4 text-sm text-gray-500">아직 댓글이 없습니다.</p>
              ) : (
                <ul className="list-none divide-y divide-gray-200 rounded-md border border-gray-100 bg-white p-0">
                  {post.comments.map((comment) => (
                    <CommentItem key={comment.id} comment={comment} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
