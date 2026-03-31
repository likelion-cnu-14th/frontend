"use client";


import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import CommentItem from "@/components/CommentItem";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const savedPosts = localStorage.getItem("posts");

    if (savedPosts) {
      const posts = JSON.parse(savedPosts);
      const foundPost = posts.find((p: any) => p.id === id);
      setPost(foundPost);
    }
  }, [id]);

  const handleLike = () => {
    const savedPosts = localStorage.getItem("posts");
    if (!savedPosts || !post) return;

    const posts = JSON.parse(savedPosts);

    const updatedPosts = posts.map((p: any) =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    );

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    const updatedPost = updatedPosts.find((p: any) => p.id === id);
    setPost(updatedPost);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    const savedPosts = localStorage.getItem("posts");
    if (!savedPosts || !post) return;

    const posts = JSON.parse(savedPosts);

    const newComment = {
      id: Date.now().toString(),
      author: "익명",
      content: comment,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updatedPosts = posts.map((p: any) =>
      p.id === id
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
    );

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    const updatedPost = updatedPosts.find((p: any) => p.id === id);
    setPost(updatedPost);
    setComment("");
  };

  if (!post) return <div>로딩중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{post.title}</h1>
      <p>작성자: {post.author}</p>
      <p>작성일: {post.createdAt}</p>
      <p>내용: {post.content}</p>
      <p>좋아요: {post.likes}</p>

      <button onClick={handleLike}>좋아요 누르기</button>

      <hr style={{ margin: "20px 0" }} />

      <h2>댓글</h2>

      

      {post.comments && post.comments.length > 0 ? (
  post.comments.map((c: any) => (
    <CommentItem key={c.id} comment={c} />
  ))
) : (
  <p>아직 댓글이 없습니다.</p>
)}

      <textarea
        placeholder="댓글을 입력하세요"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          height: "100px",
          marginTop: "10px",
          marginBottom: "10px",
        }}
      />

      <button onClick={handleCommentSubmit}>댓글 작성</button>
    </div>
  );
}