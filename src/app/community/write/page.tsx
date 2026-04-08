"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";

export default function WritePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!title.trim() || !content.trim() || !author.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPost({ title, content, author });
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
          <h1 style={{ marginTop: 0, marginBottom: "20px", color: "#0f172a" }}>글 작성</h1>

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
        <label className="field-label">작성자</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="작성자를 입력하세요"
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
            border: "1px solid #cbd5e1",
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