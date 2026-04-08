"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function WritePage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const initialize = useAuthStore((state) => state.initialize);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initialize();
    setIsReady(true);
  }, [initialize]);

  useEffect(() => {
    if (isReady && !isLoggedIn) {
      router.push("/login");
    }
  }, [isReady, isLoggedIn, router]);

  const handleSubmit = async () => {
    if (isSubmitting || !isLoggedIn) {
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({ title, content });
      router.push("/community");
    } catch {
      alert("게시글 작성에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="app-header">
        <div className="app-header-inner">
          <div>
            <p className="brand-title">Five-set</p>
            <p className="brand-subtitle">새 글 작성</p>
          </div>
        </div>
      </header>

      <div className="app-shell">
        <div className="surface-card" style={{ padding: "20px" }}>
          <h1 style={{ marginTop: 0, marginBottom: "20px", color: "#222" }}>글 작성</h1>
          {user ? (
            <p style={{ marginTop: 0, marginBottom: "16px", color: "#666" }}>
              작성자: {user.username}
            </p>
          ) : null}

      <div style={{ marginBottom: "16px" }}>
        <label className="field-label">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="field-input"
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label className="field-label">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="내용을 입력하세요"
          rows={10}
          style={{
            width: "100%",
            padding: "11px 12px",
            border: "1px solid #cfcfcf",
            borderRadius: "10px",
            resize: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button className="btn btn-muted" onClick={() => router.push("/community")}>
          ← 목록으로
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn btn-primary"
        >
          {isSubmitting ? "작성 중..." : "작성"}
        </button>
      </div>
      </div>
      </div>
    </div>
  );
}