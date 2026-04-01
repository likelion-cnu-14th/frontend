"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPosts } from "@/lib/mockData";
import { Post } from "@/types/post";
import PostCard from "@/components/PostCard";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

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
      <div className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          아직 게시글이 없습니다. 첫 글을 작성해보세요!
        </div>
      )}
    </div>
  );
}
