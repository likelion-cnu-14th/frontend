"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post, Comment } from "@/types/post";
import CommentItem from "@/components/CommentItem";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
    }
  }, [id]);

  const handleLike = () => {
    if (!post) return;
    const posts = getPosts();
    const updated = posts.map((p) =>
      p.id === post.id ? { ...p, likes: p.likes + 1 } : p
    );
    savePosts(updated);
    setPost({ ...post, likes: post.likes + 1 });
  };

  const handleComment = () => {
    if (!post || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      author: "익명",
      createdAt: new Date().toISOString(),
    };

    const updatedPost = { ...post, comments: [...post.comments, newComment] };
    const posts = getPosts();
    const updated = posts.map((p) => (p.id === post.id ? updatedPost : p));
    savePosts(updated);
    setPost(updatedPost);
    setCommentText("");
  };

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-muted-foreground">
        게시글을 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← 목록으로
      </Link>

      {/* 게시글 */}
      <article className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-3 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-xs font-medium text-primary">
            {post.author[0]}
          </div>
          <span className="font-medium text-foreground">{post.author}</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="mt-6 border-t border-border pt-6">
          <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleLike}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-all hover:bg-red-50 hover:border-red-200 hover:text-red-500 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            좋아요 {post.likes}
          </button>
        </div>
      </article>

      {/* 댓글 */}
      <section className="mt-10 border-t border-border pt-8">
        <h3 className="text-lg font-semibold mb-4">
          댓글 <span className="text-muted-foreground font-normal">{post.comments.length}</span>
        </h3>

        {post.comments.length > 0 ? (
          <div className="mb-6">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-6">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="댓글을 입력하세요"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
            className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
          <button
            onClick={handleComment}
            disabled={!commentText.trim()}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            작성
          </button>
        </div>
      </section>
    </div>
  );
}
