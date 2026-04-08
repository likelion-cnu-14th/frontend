"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/api";
import type { PostListItem } from "@/types/post";

export default function CommunityPage() {
  const router = useRouter();
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 첫 화면 진입 시 서버에서 최신 목록을 가져온다.
    // 실패하면 사용자에게 안내 문구를 보여 다시 시도할 수 있게 한다.
    const loadPosts = async () => {
      try {
        setError(null);
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("게시글 목록 조회 실패:", err);
        setError("게시글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <div
      style={{
        ...px,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "48px 24px",
      }}
    >
      {/* 헤더 */}
      {/* 히어로 이미지 */}
      <img
        src="/pixel-banner.png"
        alt="픽셀 아트 배너"
        style={{
          width: "100%",
          maxWidth: "580px",
          border: "3px solid #000",
          boxShadow: "6px 6px 0 #000",
          display: "block",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "720px",
          margin: "0 auto 32px",
        }}
      >
        <h1 style={{ ...px, fontSize: "18px", color: "#000", letterSpacing: "4px" }}>
          커뮤니티
        </h1>
        <button
          type="button"
          onClick={() => router.push("/community/write")}
          style={{
            ...px,
            fontSize: "9px",
            background: "#93c5fd",
            color: "#000",
            border: "3px solid #000",
            boxShadow: "4px 4px 0 #000",
            padding: "12px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "2px 2px 0 #000";
            e.currentTarget.style.transform = "translate(2px,2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "4px 4px 0 #000";
            e.currentTarget.style.transform = "translate(0,0)";
          }}
        >
          ✏ 글 작성
        </button>
      </div>

      {/* 카드 목록 */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {loading ? (
          <p style={{ ...px, fontSize: "9px", color: "#555", gridColumn: "1 / -1" }}>로딩 중...</p>
        ) : error ? (
          <p style={{ ...px, fontSize: "9px", color: "#dc2626", gridColumn: "1 / -1" }}>{error}</p>
        ) : posts.length === 0 ? (
          <p style={{ ...px, fontSize: "9px", color: "#555", gridColumn: "1 / -1" }}>
            아직 글이 없어요. 첫 글을 작성해보세요!
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}