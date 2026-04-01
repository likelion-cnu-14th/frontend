"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function CommunityWritePage() {
  const router = useRouter();
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const posts = getPosts();
    const newPost: Post = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      author: author.trim() || "익명",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    router.push(`/community/${newPost.id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#fde047",
        padding: "32px 24px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "720px" }}>
        <button
          type="button"
          onClick={() => router.push("/community")}
          style={{
            ...px, fontSize: "9px", background: "transparent",
            border: "none", cursor: "pointer", color: "#000",
            marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          ← 목록으로
        </button>

        <div
          style={{
            background: "#fff",
            border: "3px solid #000",
            boxShadow: "6px 6px 0 #000",
            padding: "28px",
            marginBottom: "32px",
            maxWidth: "720px",
          }}
        >
        <h1 style={{ ...px, fontSize: "12px", color: "#000", marginBottom: "24px", letterSpacing: "2px" }}>
          새 글 작성
        </h1>

        <p style={{ ...px, fontSize: "8px", color: "#444", marginBottom: "8px" }}>작성자</p>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름을 입력하세요 (비우면 익명)"
          maxLength={20}
          style={{
            ...px,
            width: "100%",
            fontSize: "8px",
            border: "2px solid #000",
            padding: "12px",
            marginBottom: "16px",
            outline: "none",
          }}
        />

        <p style={{ ...px, fontSize: "8px", color: "#444", marginBottom: "8px" }}>제목</p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          maxLength={100}
          style={{
            ...px,
            width: "100%",
            fontSize: "8px",
            border: "2px solid #000",
            padding: "12px",
            marginBottom: "16px",
            outline: "none",
          }}
        />

        <p style={{ ...px, fontSize: "8px", color: "#444", marginBottom: "8px" }}>내용</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          maxLength={2000}
          rows={8}
          style={{
            ...px,
            width: "100%",
            fontSize: "8px",
            border: "2px solid #000",
            padding: "12px",
            resize: "vertical",
            outline: "none",
            lineHeight: 2,
            marginBottom: "8px",
          }}
        />
        <div style={{ ...px, fontSize: "7px", color: "#888", textAlign: "right", marginBottom: "20px" }}>
          {content.length} / 2000
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            ...px,
            fontSize: "8px",
            background: "#93c5fd",
            color: "#000",
            border: "3px solid #000",
            boxShadow: "3px 3px 0 #000",
            padding: "12px 20px",
            cursor: "pointer",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "1px 1px 0 #000";
            e.currentTarget.style.transform = "translate(2px,2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "3px 3px 0 #000";
            e.currentTarget.style.transform = "translate(0,0)";
          }}
        >
          등록하기
        </button>
        </div>
      </div>
    </div>
  );
}