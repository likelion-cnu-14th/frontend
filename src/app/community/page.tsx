"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/mockData";
import { Post } from "@/types/post";

// 커뮤니티 게시글 목록 화면입니다.
// 사용자에게 최신 글 현황을 보여주고, 새 글 작성으로 이어지는 시작 지점 역할을 합니다.

export default function CommunityPage() {
  const router = useRouter();

  // 게시글 상태는 화면에 현재 무엇을 보여줄지 결정하는 핵심 데이터입니다.
  const [posts, setPosts] = useState<Post[]>([]);

  // 첫 진입 시 저장소에서 목록을 읽어와야 이전 사용 기록이 화면에 반영됩니다.
  // 이 과정이 없으면 사용자는 작성한 글이 사라졌다고 느낄 수 있습니다.
  useEffect(() => {
    const loadedPosts = getPosts();
    setPosts(loadedPosts);
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">커뮤니티</h1>
        <button
          type="button"
          onClick={() => router.push("/community/write")}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          글 작성
        </button>
      </div>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
