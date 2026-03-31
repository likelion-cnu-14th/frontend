"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      const defaultPosts = [
        {
          id: "1",
          title: "첫 번째 글",
          author: "익명",
          createdAt: "2024-01-01",
          likes: 3,
          comments: [],
        },
        {
          id: "2",
          title: "두 번째 글",
          author: "익명",
          createdAt: "2024-01-02",
          likes: 5,
          comments: [],
        },
      ];

      localStorage.setItem("posts", JSON.stringify(defaultPosts));
      setPosts(defaultPosts);
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>커뮤니티</h1>

      <button onClick={() => (window.location.href = "/community/write")}>
        글 작성
      </button>

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}