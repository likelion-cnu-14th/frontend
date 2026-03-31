"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/community/${post.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        border: "1px solid #eee",
        borderRadius: 8,
        padding: 16,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: 12,
      }}
    >
      <h2>{post.title}</h2>
      <p>작성자: {post.author}</p>
      <p>작성일: {post.createdAt}</p>
      <p>👍 {post.likes} 💬 {post.comments.length}</p>
    </div>
  );
}