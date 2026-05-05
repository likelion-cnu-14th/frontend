"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/api";
import type { PostListItem } from "@/types/post";
import { MessageSquare, Plus, Loader2, Search, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setError(null);
        const data = await fetchPosts();
        // 최신 글이 위로 오도록 정렬
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(sorted);
      } catch (err) {
        console.error("게시글 목록 조회 실패:", err);
        setError("게시글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
      {/* 히어로 섹션 */}
      <header className="relative mb-16 rounded-[3rem] overflow-hidden bg-slate-900 p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-slate-900/20 animate-in fade-in zoom-in-95 duration-1000">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-2xl text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Users className="w-4 h-4" />
            Study Community
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            함께 성장하는 <br />
            <span className="text-yellow-500">지식 공유의 장</span>
          </h1>
          <p className="text-lg text-slate-400 font-medium">
            스터디룸 예약부터 정보 공유까지, 우리들의 이야기를 나누어 보세요.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <Link
              href="/community/write"
              className="px-8 py-4 bg-yellow-500 text-slate-900 font-black rounded-2xl shadow-lg shadow-yellow-500/20 hover:bg-yellow-400 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              새로운 글 작성하기
            </Link>
          </div>
        </div>

        <div className="relative w-full md:w-1/3 aspect-square bg-slate-800 rounded-[2.5rem] p-8 border border-slate-700 flex flex-col justify-center gap-6 group hover:border-yellow-500/30 transition-colors">
          <div className="space-y-2">
            <TrendingUp className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="text-xl font-bold text-white">Today's Topic</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              가장 인기 있는 스터디 주제와 팁을 확인해 보세요.
            </p>
          </div>
          <div className="h-px bg-slate-700 w-full" />
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-600 flex items-center justify-center text-[10px] text-white font-bold">U{i}</div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">120+ active users</span>
          </div>
        </div>
      </header>

      {/* 검색 및 필터 (UI 전용) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="관심 있는 글을 검색해 보세요" 
            className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {["전체", "공지사항", "질문", "후기", "스터디원 모집"].map((tab, i) => (
            <button 
              key={tab} 
              className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50 border border-black/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 게시글 목록 */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 animate-pulse">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="text-lg font-bold">게시글을 불러오고 있습니다...</p>
        </div>
      ) : error ? (
        <div className="text-center py-32 bg-red-50 rounded-[3rem] border border-red-100">
          <p className="text-red-500 font-bold mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
          >
            다시 시도하기
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-black/5">
          <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">아직 게시글이 없습니다</h3>
          <p className="text-slate-500 mb-8">첫 번째 지식의 씨앗을 심어보세요!</p>
          <Link
            href="/community/write"
            className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
          >
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}