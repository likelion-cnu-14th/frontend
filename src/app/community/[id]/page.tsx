"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import CommentItem from "@/components/CommentItem";
import { createComment, deletePost, fetchPost, toggleLike } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Post } from "@/types/post";
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Trash2, 
  User, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  Send,
  PenTool,
  LogIn
} from "lucide-react";
import Link from "next/link";

const MAX_COMMENT_LENGTH = 500;

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = use(params);
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const selectedPost = await fetchPost(postId);
        setPost(selectedPost);
      } catch (err) {
        const status = (err as { response?: { status?: number } }).response?.status;
        if (status === 404) {
          setError("존재하지 않는 게시글입니다.");
        } else {
          setError("게시글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postId]);

  const handleLike = async () => {
    if (!post || liking) return;
    setLiking(true);
    try {
      const updated = await toggleLike(post.id);
      setPost(updated);
    } catch {
      alert("좋아요 반영에 실패했습니다.");
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!post || deleting) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    try {
      await deletePost(post.id);
      router.push("/community");
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail?.error || "삭제에 실패했습니다.";
      alert(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  const handleComment = async () => {
    if (!post || !commentInput.trim() || commentSubmitting) {
      alert("내용을 입력해 주세요.");
      return;
    }
    setCommentSubmitting(true);
    try {
      // 6-2. author 제거하고 호출
      const newComment = await createComment(post.id, {
        content: commentInput.trim(),
      });
      setPost((prev) => prev ? ({
        ...prev,
        comments: [...prev.comments, newComment],
      }) : prev);
      setCommentInput("");
    } catch {
      alert("댓글 등록에 실패했습니다.");
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentDeleted = (commentId: string) => {
    setPost((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        comments: prev.comments.filter((c) => c.id !== commentId),
      };
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-500/5 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">오류 발생</h2>
        <p className="text-slate-500 mb-6">{error ?? "게시글을 찾을 수 없습니다."}</p>
        <Link href="/community" className="inline-block px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 6-2. 본인 글 여부 확인
  const isAuthor = isLoggedIn && user?.username === post.author;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      <Link 
        href="/community" 
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        목록으로 돌아가기
      </Link>

      <article className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-2xl shadow-black/5 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <header className="space-y-6 mb-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-100">
              Community Post
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-yellow-400 shadow-lg shadow-slate-900/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{post.author}</div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {formattedDate}
                </div>
              </div>
            </div>
            
            {/* 6-2. 삭제 버튼 권한 처리 */}
            {isAuthor && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                title="글 삭제"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            )}
          </div>
        </header>

        <div className="prose prose-slate max-w-none mb-12">
          <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 ${
              liking ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white shadow-lg shadow-rose-500/10'
            }`}
          >
            <Heart className={`w-5 h-5 ${liking ? '' : 'fill-rose-500/20 group-hover:fill-white'}`} />
            좋아요 {post.likes}
          </button>
          <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold border border-slate-100">
            <MessageSquare className="w-5 h-5 text-slate-400" />
            댓글 {post.comments.length}
          </div>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-yellow-500" />
          댓글 <span className="text-yellow-500">{post.comments.length}</span>
        </h2>

        {/* 6-2. 비로그인 시 댓글 입력 폼 차단 */}
        {isLoggedIn ? (
          <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full -translate-y-16 translate-x-16 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between text-white font-bold mb-2">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-yellow-500" />
                  댓글 남기기
                </div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3" />
                  {user?.username}님으로 작성 중
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
                    placeholder="지식과 의견을 나누어 주세요"
                    rows={1}
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 pr-16 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all min-h-[56px] overflow-hidden"
                  />
                  <button
                    onClick={handleComment}
                    disabled={commentSubmitting || !commentInput.trim()}
                    className="absolute right-2 top-2 p-3 bg-yellow-500 text-slate-900 rounded-xl hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-yellow-500 transition-all active:scale-90"
                  >
                    {commentSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-[10px] font-bold text-slate-500 text-right px-1">
                  {commentInput.length} / {MAX_COMMENT_LENGTH}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-100 rounded-[2.5rem] p-10 border border-dashed border-slate-300 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto shadow-sm">
              <LogIn className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-bold">로그인 후 댓글을 작성할 수 있습니다.</p>
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              로그인하러 가기
            </Link>
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="grid gap-4">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} onDeleted={handleCommentDeleted} />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">아직 댓글이 없습니다. 첫 번째 대화를 시작해 보세요!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}