"use client";


import { useRouter } from "next/navigation";

type Post = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: any[];
};

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      style={{
        border: "1px solid #ccc",
        padding: "16px",
        marginBottom: "12px",
        cursor: "pointer",
      }}
    >
      <h3>{post.title}</h3>
      <p>작성자: {post.author}</p>
      <p>작성일: {post.createdAt}</p>
      <p>👍 {post.likes} | 💬 {post.comments.length}</p>
    </div>
  );
}