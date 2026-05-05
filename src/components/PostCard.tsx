"use client";

import { useRouter } from "next/navigation";
import type { Post, PostListItem } from "@/types/post";
import { Heart, MessageSquare, User, Clock, ChevronRight } from "lucide-react";

interface PostCardProps {
  post: Post | PostListItem;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  
  // 목록 API와 상세 API의 댓글 필드 모양이 달라도 카드에서 같은 숫자를 보여주기 위한 보정
  const commentCount = "commentCount" in post ? post.commentCount : post.comments.length;
  
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    <button
      type="button"
      onClick={() => router.push(`/community/${post.id}`)}
      className="group w-full text-left bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div className="flex flex-col h-full justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              {formattedDate}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
          </div>
          
          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight group-hover:text-yellow-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
          
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" />
              {post.likes}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 border border-slate-100">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
              {commentCount}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-slate-900">
            <User className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-slate-600">{post.author}</span>
        </div>
      </div>
    </button>
  );
}