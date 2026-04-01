"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = () => {
    if (!title || !content) return;

    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author: "익명",
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
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">글 작성</h1>

      {/* 제목 */}
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 w-full rounded border p-2"
      />

      {/* 내용 */}
      <textarea
        placeholder="내용을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mb-4 w-full rounded border p-2 h-40"
      />

      {/* 버튼 */}
      <button
        onClick={handleSubmit}
        className="rounded bg-black px-4 py-2 text-white"
      >
        작성
      </button>
    </div>
  );
}