"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/api";
import type { PostListItem } from "@/types/post";

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchPosts();
        setPosts(data);
      } catch {
        setError("게시글 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[760px]">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 to-white px-6 py-6 sm:px-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                커뮤니티
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                최신 게시글을 확인하고 자유롭게 소통해보세요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                홈으로
              </Link>
              <button
                type="button"
                onClick={() => router.push("/community/write")}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
              >
                글 작성
              </button>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                로딩 중...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
                {error}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                게시글이 없습니다.
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
