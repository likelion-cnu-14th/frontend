"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchPost, toggleLike, deletePost, createComment, deleteComment } from "@/lib/api";
import { Post } from "@/types/post";
import CommentItem from "@/components/CommentItem";

export default function PostDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 댓글 입력 상태
    const [commentAuthor, setCommentAuthor] = useState("");
    const [commentContent, setCommentContent] = useState("");
// 1. 게시글 데이터 불러오기
useEffect(() => {
  // ✨ 핵심 추가: id가 아직 준비 안 됐으면 서버에 요청하지 말고 기다려라!
  if (!id) return; 

  const loadPost = async () => {
      try {
          console.log("요청하는 게시글 ID:", id); // 확인용 1
          const data = await fetchPost(id);
          console.log("서버에서 준 데이터:", data); // 확인용 2
          setPost(data);
      } catch (err) {
          console.error("에러 진짜 원인:", err); // 에러가 나면 콘솔에 빨간 글씨로 범인을 알려줌!
          setError("존재하지 않는 게시글이거나 불러오는데 실패했습니다.");
      } finally {
          setLoading(false);
      }
  };
  loadPost();
}, [id]);
    

    // 2. 좋아요 기능
    const handleLike = async () => {
        try {
            const updatedPost = await toggleLike(id);
            setPost(updatedPost); // 서버에서 바뀐 데이터로 즉시 화면 업데이트!
        } catch (err) {
            alert("좋아요 처리에 실패했습니다.");
        }
    };

    // 3. 게시글 삭제 기능
    const handleDeletePost = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await deletePost(id);
                router.push("/community"); // 성공하면 목록으로 도망가기
            } catch (err) {
                alert("게시글 삭제에 실패했습니다.");
            }
        }
    };

    // 4. 댓글 작성 기능
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentAuthor.trim() || !commentContent.trim()) {
            alert("작성자와 댓글 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const newComment = await createComment(id, { author: commentAuthor, content: commentContent });
            // 기존 데이터에 새 댓글 끼워넣기 (화면 즉시 반영)
            setPost((prev) => prev ? { ...prev, comments: [...(prev.comments || []), newComment] } : null);
            setCommentAuthor("");
            setCommentContent("");
        } catch (err) {
            alert("댓글 작성에 실패했습니다.");
        }
    };

    // 5. 댓글 삭제 기능
    const handleDeleteComment = async (commentId: string) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            try {
                await deleteComment(commentId);
                // 화면에서 지워진 댓글 빼고 다시 보여주기
                setPost((prev) => prev ? { ...prev, comments: prev.comments?.filter(c => c.id !== commentId) } : null);
            } catch (err) {
                alert("댓글 삭제에 실패했습니다.");
            }
        }
    };

    if (loading) return <div className="p-10 text-center">로딩 중...</div>;
    if (error || !post) {
        return (
            <div className="p-10 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <Link href="/community" className="text-blue-500 underline">목록으로 돌아가기</Link>
            </div>
        );
    }

    return (
        <main className="max-w-4xl mx-auto p-4">
            <div className="mb-6">
                <Link href="/community" className="text-gray-500 hover:text-gray-800 transition-colors">
                    &larr; 목록으로
                </Link>
            </div>

            {/* 본문 영역 */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">{post.title}</h1>
                    <button onClick={handleDeletePost} className="text-red-500 hover:text-red-700 text-sm">삭제</button>
                </div>
                <div className="text-gray-500 text-sm mb-6 pb-4 border-b">
                    <span className="mr-4">작성자: {post.author}</span>
                    <span>작성일: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="min-h-[200px] mb-8 whitespace-pre-wrap">{post.content}</div>
                <div className="flex items-center">
                    <button onClick={handleLike} className="flex items-center space-x-2 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full transition-colors">
                        <span>❤️</span>
                        <span className="font-semibold text-pink-600">{post.likes}</span>
                    </button>
                </div>
            </div>

            {/* 댓글 영역 */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">댓글 ({post.comments?.length || 0})</h3>
                
                <div className="space-y-4 mb-8">
                    {post.comments?.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} onDelete={() => handleDeleteComment(comment.id)} />
                    ))}
                </div>

                <form onSubmit={handleCommentSubmit} className="bg-white p-4 rounded border">
                    <div className="mb-4">
                        <input 
                            type="text" placeholder="작성자" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)}
                            className="w-1/3 border p-2 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <input 
                            type="text" placeholder="댓글을 남겨보세요..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)}
                            className="flex-1 border p-2 rounded focus:outline-none focus:border-blue-500"
                        />
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors">
                            등록
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}