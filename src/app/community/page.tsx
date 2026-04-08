"use client";

import { useEffect, useState } from "react";
import { fetchPosts } from "../../lib/api";
import type { Post } from "../../types/post";

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError("게시글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (posts.length === 0) return <div>게시글이 없습니다.</div>;

  return (
    <main>
      <h1>커뮤니티</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>좋아요: {post.likeCount}</p>
          <p>댓글: {post.commentCount}</p>
        </div>
      ))}
    </main>
  );
}