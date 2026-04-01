"use client";

import { useRouter } from "next/navigation";
import { Post } from "../types/post";

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
      className="cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md"
    >
      <h2 className="text-lg font-bold">{post.title}</h2>

      <div className="mt-2 text-sm text-gray-500">
        <span>작성자: {post.author}</span>
        <span className="ml-3">작성일: {post.createdAt}</span>
      </div>

      <div className="mt-3 flex gap-4 text-sm text-gray-600">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments.length}</span>
      </div>
    </div>
  );
}