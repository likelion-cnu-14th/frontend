"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    const newPost = {
      id: Date.now().toString(),
      title: title,
      content: content,
      author: "익명",
      createdAt: new Date().toISOString().slice(0, 10),
      likes: 0,
      comments: [],
    };

    const savedPosts = localStorage.getItem("posts");
    const posts = savedPosts ? JSON.parse(savedPosts) : [];

    const updatedPosts = [newPost, ...posts];
    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    router.push("/community");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>글 작성</h1>

      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "12px", padding: "8px" }}
      />

      <textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{ display: "block", width: "100%", height: "150px", marginBottom: "12px", padding: "8px" }}
      />

      <button onClick={handleSubmit}>작성</button>
    </div>
  );
}