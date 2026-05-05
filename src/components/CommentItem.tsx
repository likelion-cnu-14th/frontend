"use client";

import { useState } from "react";
import { deleteComment } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Comment } from "@/types/post";
import { User, Trash2, Clock } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
  onDeleted: (commentId: string) => void;
}

export default function CommentItem({ comment, onDeleted }: CommentItemProps) {
  const { isLoggedIn, user } = useAuthStore();
  
  const formattedCreatedAt = new Date(comment.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    const ok = confirm("정말 댓글을 삭제하시겠습니까?");
    if (!ok) return;

    setDeleting(true);
    try {
      await deleteComment(comment.id);
      onDeleted(comment.id);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail?.error || "댓글 삭제에 실패했어요.";
      alert(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  // 6-2. 본인 댓글 여부 확인
  const isAuthor = isLoggedIn && user?.username === comment.author;

  return (
    <div className="group bg-white rounded-2xl p-6 border border-slate-100 hover:border-yellow-200 transition-all hover:shadow-lg hover:shadow-yellow-500/5 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-yellow-50 group-hover:text-yellow-600 group-hover:border-yellow-100 transition-colors">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-900 leading-tight mb-0.5">{comment.author}</div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <Clock className="w-3 h-3" />
              {formattedCreatedAt}
            </div>
          </div>
        </div>
        
        {/* 6-2. 본인 댓글일 때만 삭제 버튼 노출 */}
        {isAuthor && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-90"
            title="댓글 삭제"
          >
            {deleting ? (
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent animate-spin rounded-full" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      
      <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  );
}
