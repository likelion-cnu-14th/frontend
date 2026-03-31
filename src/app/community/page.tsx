"use client";
import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>커뮤니티</h1>
      <div style={{ margin: "12px 0 16px" }}>
        <button
          type="button"
          onClick={() => router.push("/community/write")}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #e5e5e5",
            cursor: "pointer",
            background: "white",
          }}
        >
          글 작성
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
