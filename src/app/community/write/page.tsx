"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;

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
    savePosts([newPost, ...posts]);
    router.push("/community");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 목록으로
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">글 작성</h1>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">제목</label>
          <input
            id="title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">내용</label>
          <textarea
            id="content"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-vertical"
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/community"
            className="inline-flex items-center rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent"
          >
            취소
          </Link>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
            disabled={!title.trim() || !content.trim()}
          >
            작성하기
          </button>
        </div>
      </div>
    </div>
  );
}
