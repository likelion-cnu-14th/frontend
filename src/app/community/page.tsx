"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPosts, PostSummary } from "@/lib/api";
import PostCard from "@/components/PostCard";

export default function CommunityPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "게시글을 불러올 수 없습니다."
        );
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted-foreground">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">커뮤니티</h1>
          <p className="text-muted-foreground mt-1">자유롭게 이야기를 나눠보세요</p>
        </div>
        <Link
          href="/community/write"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          글 작성
        </Link>
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          아직 게시글이 없습니다. 첫 글을 작성해보세요!
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
