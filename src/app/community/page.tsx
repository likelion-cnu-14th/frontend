"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { getPosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>커뮤니티</h1>
        <button
          onClick={() => router.push("/community/write")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: "#0070f3",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          글 작성
        </button>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div>게시글이 없습니다.</div>
      )}
    </div>
  );
}