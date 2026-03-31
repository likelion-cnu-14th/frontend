"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert("제목, 작성자, 내용을 모두 입력해주세요.");
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: title,
      content: content,
      author: author,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    const posts = getPosts();
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);

    router.push("/community");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>글 작성</h1>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>작성자</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자를 입력하세요"
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px" }}>내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={10}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            resize: "none",
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: "10px 18px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        작성
      </button>
    </div>
  );
}