"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchPosts, PostSummary } from "@/lib/api";
import PostCard from "@/components/PostCard";
import { PenLine } from "lucide-react";

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">커뮤니티</h1>
        <button
          onClick={() => router.push("/community/write")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <PenLine className="h-4 w-4" />
          글 작성
        </button>
      </div>
      {posts.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          아직 게시글이 없습니다. 첫 글을 작성해보세요!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
