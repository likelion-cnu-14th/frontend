"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { 
  ArrowLeft, 
  PenTool, 
  Type, 
  AlignLeft, 
  Send, 
  Loader2, 
  Sparkles 
} from "lucide-react";
import Link from "next/link";

export default function CommunityWritePage() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 6-1. 비로그인 차단 logic
  useEffect(() => {
    // initialize()가 AppShell에서 실행되므로, 여기서 isLoggedIn이 확실히 결정될 때까지 기다릴 필요가 있을 수 있음.
    // 하지만 store 상태가 로컬 스토리지에서 즉시 복구되므로 바로 체크 가능.
    const token = localStorage.getItem("access_token");
    if (!token && !isLoggedIn) {
      alert("로그인이 필요한 서비스입니다.");
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      // 6-1. author 제거하고 호출
      await createPost({
        title: title.trim(),
        content: content.trim(),
      });
      router.push("/community");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail?.error || "게시글 작성에 실패했습니다.";
      alert(errorMsg);
      setSubmitting(false);
    }
  };

  const isSubmitDisabled = submitting || !title.trim() || !content.trim();

  // 비로그인 상태에서 잠깐이라도 화면이 보이는 것을 방지
  if (!isLoggedIn) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <Link 
        href="/community" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        목록으로 돌아가기
      </Link>

      <header className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-100">
          <Sparkles className="w-3 h-3" />
          Create New Post
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          지식을 <span className="text-yellow-500">나누어 보세요</span>
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          안녕하세요, <span className="text-slate-900 font-bold">{user?.username}</span>님! 오늘 어떤 이야기를 들려주실 건가요?
        </p>
      </header>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="space-y-8">
          {/* 제목 섹션 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              <Type className="w-4 h-4" />
              게시글 제목
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="흥미로운 제목을 지어보세요"
              maxLength={100}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold text-lg"
            />
          </div>

          {/* 본문 섹션 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              <AlignLeft className="w-4 h-4" />
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 자유롭게 작성해 주세요 (마크다운은 지원하지 않지만, 줄바꿈은 유지됩니다)"
              maxLength={2000}
              rows={10}
              className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-6 py-6 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all leading-relaxed text-lg resize-none"
            />
            <div className="text-[10px] font-bold text-slate-400 text-right px-2">
              {content.length} / 2000 characters
            </div>
          </div>

          {/* 하단 액션 버튼 */}
          <div className="pt-6 border-t border-slate-50">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="w-full md:w-auto px-10 py-5 bg-yellow-500 text-slate-900 font-black rounded-2xl shadow-xl shadow-yellow-500/20 hover:bg-yellow-400 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  작성 중...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  게시글 등록하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 justify-between border border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="text-white font-bold">커뮤니티 가이드라인</div>
            <div className="text-slate-400 text-sm">따뜻하고 배려 넘치는 언어를 사용해 주세요.</div>
          </div>
        </div>
        <Link href="/community" className="text-slate-400 hover:text-white transition-colors text-sm font-bold">
          작성 취소하고 돌아가기
        </Link>
      </div>
    </div>
  );
}