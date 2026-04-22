"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../../lib/api";
import { useAuthStore } from "../../../stores/useAuthStore";


export default function WritePage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 입력 검증
    if (!title.trim() || !content.trim() ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      await createPost({ title, content });
      router.push("/community"); // 작성 후 목록으로 이동
    } catch (err) {
      alert("게시글 작성에 실패했습니다.");
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>글 작성</h1>

      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? "작성 중..." : "작성하기"}
      </button>

      <button onClick={() => router.push("/community")}>
        ← 목록으로
      </button>
    </main>
  );
}