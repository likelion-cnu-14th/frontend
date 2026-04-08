"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../../../lib/api";
import type { Post } from "../../../types/post";
import { fetchPosts } from "../../../lib/api";

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (posts.length === 0) {
    return <div>게시글이 없습니다.</div>;
  }

  return (
    <main>
      <h1>커뮤니티</h1>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/community/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.content}</p>
            <div>좋아요 {post.likeCount}</div>
            <div>댓글 {post.commentCount}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}