"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post, Comment } from "@/types/post";
import CommentItem from "@/components/CommentItem";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const posts = getPosts();
    const foundPost = posts.find((item) => item.id === id) || null;
    setPost(foundPost);
  }, [id]);

  const handleLike = () => {
    if (!post) return;

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    );

    savePosts(updatedPosts);

    const updatedPost = updatedPosts.find((item) => item.id === id) || null;
    setPost(updatedPost);
  };

  const handleCommentSubmit = () => {
    if (!post) return;

    if (!author.trim() || !content.trim()) {
      alert("작성자와 댓글 내용을 입력해주세요.");
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: author,
      content: content,
      createdAt: new Date().toISOString(),
    };

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === id
        ? { ...item, comments: [...item.comments, newComment] }
        : item
    );

    savePosts(updatedPosts);

    const updatedPost = updatedPosts.find((item) => item.id === id) || null;
    setPost(updatedPost);

    setAuthor("");
    setContent("");
  };

  if (!post) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>게시글을 찾을 수 없습니다.</h1>
        <button onClick={() => router.push("/community")}>목록으로 가기</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button
        onClick={() => router.push("/community")}
        style={{
          marginBottom: "20px",
          padding: "8px 14px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#ddd",
          cursor: "pointer",
        }}
      >
        목록으로
      </button>

      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ marginBottom: "12px" }}>{post.title}</h1>
        <p style={{ marginBottom: "8px" }}>작성자: {post.author}</p>
        <p style={{ marginBottom: "8px" }}>작성일: {post.createdAt}</p>
        <p style={{ marginBottom: "16px" }}>{post.content}</p>

        <button
          onClick={handleLike}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          👍 좋아요 {post.likes}
        </button>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "12px" }}>댓글</h2>

        {post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <p>아직 댓글이 없습니다.</p>
        )}
      </div>

      <div
        style={{
          border: "1px solid #e5e5e5",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: "12px" }}>댓글 작성</h2>

        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="작성자"
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글 내용을 입력하세요"
            rows={4}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              resize: "none",
            }}
          />
        </div>

        <button
          onClick={handleCommentSubmit}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#0070f3",
            color: "white",
            cursor: "pointer",
          }}
        >
          댓글 작성
        </button>
      </div>
    </div>
  );
}