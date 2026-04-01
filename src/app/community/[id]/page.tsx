"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
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
    const foundPost = posts.find((item) => item.id === id) || null;
    setPost(foundPost);
  }, [id]);

  const handleLike = () => {
    if (!post) return;

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id ? { ...item, likes: item.likes + 1 } : item
    );

    savePosts(updatedPosts);

    const updatedPost =
      updatedPosts.find((item) => item.id === post.id) || null;
    setPost(updatedPost);
  };

  const handleComment = () => {
    if (!post || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentText,
      author: "익명",
      createdAt: new Date().toLocaleString(),
    };

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id
        ? { ...item, comments: [...item.comments, newComment] }
        : item
    );

    savePosts(updatedPosts);

    const updatedPost =
      updatedPosts.find((item) => item.id === post.id) || null;
    setPost(updatedPost);
    setCommentText("");
  };

  if (!post) {
    return <div className="p-6">게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>

      <div className="mt-2 text-sm text-gray-500">
        <span>작성자: {post.author}</span>
        <span className="ml-3">작성일: {post.createdAt}</span>
      </div>

      <p className="mt-6 whitespace-pre-wrap text-gray-800">{post.content}</p>

      <button
        onClick={handleLike}
        className="mt-6 rounded bg-pink-500 px-4 py-2 text-white"
      >
        ❤️ 좋아요 {post.likes}
      </button>

      <div className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">댓글</h2>

        <div className="space-y-3">
          {post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <p className="text-sm text-gray-500">아직 댓글이 없습니다.</p>
          )}
        </div>

        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="mt-4 w-full rounded border p-3"
          rows={4}
        />

        <button
          onClick={handleComment}
          className="mt-3 rounded bg-black px-4 py-2 text-white"
        >
          댓글 작성
        </button>
      </div>
    </div>
  );
}