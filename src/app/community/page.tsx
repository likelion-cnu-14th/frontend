"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/api";
import { PostListItem } from "@/types/post";

export default function CommunityPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError("글을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div style={{ padding: "20px" }}>로딩 중...</div>;
  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div>
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <p className="brand-title" style={{ fontSize: "28px" }}>Five-set</p>
            <p className="brand-subtitle">커뮤니티</p>
          </div>
          <button className="btn btn-primary" onClick={() => router.push("/community/write")}>
            글 작성
          </button>
        </div>
      </header>

      <div className="app-shell">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="surface-card" style={{ padding: "24px", color: "#64748b" }}>
            게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}