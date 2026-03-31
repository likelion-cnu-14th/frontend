"use client";

// 커뮤니티 글 작성 화면입니다.
// 사용자가 입력한 제목/내용을 저장하고 목록으로 복귀시키는 것이 핵심 목적입니다.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function WritePage() {
  const router = useRouter();

  // 입력 상태는 사용자가 폼에 적은 내용을 임시로 보관합니다.
  // 이 값이 없으면 저장 시 빈 글이 만들어져 사용자 경험이 나빠질 수 있습니다.
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 제출 로직은 "새 글 생성 -> 기존 목록에 추가 -> 로컬 저장 -> 목록 화면 이동" 순서가 중요합니다.
  // 저장 전에 이동하면 작성 내용이 사라져 사용자 입장에서 글 작성이 실패한 것처럼 보일 수 있습니다.
  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      author: "익명",
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    };

    const currentPosts = getPosts();
    savePosts([...currentPosts, newPost]);
    router.push("/community");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">글 작성</h1>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="제목을 입력하세요"
        className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="내용을 입력하세요"
        rows={8}
        className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        작성
      </button>
    </div>
  );
}
