"use client";

import { useRouter } from "next/navigation";
import { PostSummary } from "@/lib/api";
import { Heart, MessageCircle } from "lucide-react";

interface PostCardProps {
  post: PostSummary;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      onClick={() => router.push(`/community/${post.id}`)}
      className="cursor-pointer rounded-lg border border-border bg-card p-5 transition-colors hover:bg-accent"
    >
      <h2 className="mb-2 text-lg font-semibold">{post.title}</h2>
      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
        {post.content}
      </p>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span>{post.author}</span>
          <span>·</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {post.commentCount}
          </span>
        </div>
      </div>
    </div>
  );
}
