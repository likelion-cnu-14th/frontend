"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CommentItem from "@/components/CommentItem";
import { getPosts, savePosts } from "@/lib/mockData";
import { Comment, Post } from "@/types/post";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    if (!id) return;
    const posts = getPosts();
    const foundPost = posts.find((item) => item.id === id) ?? null;
    setPost(foundPost);
  }, [id]);

  const handleLike = () => {
    if (!post) return;
    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id ? { ...item, likes: item.likes + 1 } : item
    );
    savePosts(updatedPosts);
    const updatedPost = updatedPosts.find((item) => item.id === post.id) ?? null;
    setPost(updatedPost);
  };

  const handleComment = () => {
    // 상세 페이지가 비정상 상태(게시글 없음)일 수 있으므로 방어 코드로 즉시 종료
    if (!post) return;

    // 사용자가 공백만 입력한 경우를 막기 위해 trim()으로 실제 텍스트가 있는지 확인
    if (!commentInput.trim()) {
      alert("댓글 내용을 입력해주세요!");
      return;
    }

    // 댓글 1개를 새로 생성한다.
    // - id: 댓글 고유 식별자(현재 시간값 사용)
    // - content: 앞뒤 공백 제거한 실제 입력 내용
    // - author: 현재는 로그인 기능이 없어서 고정 닉네임 사용
    // - createdAt: 댓글 작성 시각(문자열) 저장
    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentInput.trim(),
      author: "익명 사자",
      createdAt: new Date().toISOString(),
    };

    // localStorage에 저장된 전체 게시글 목록을 가져온다.
    const posts = getPosts();

    // 전체 게시글을 순회하면서 "현재 보고 있는 게시글(post.id)"만 댓글을 추가해 새 배열 생성
    // 불변성(원본 직접 수정 금지)을 지키기 위해 map + spread 문법으로 새 객체를 만든다.
    const updatedPosts = posts.map((item) =>
      item.id === post.id ? { ...item, comments: [...item.comments, newComment] } : item
    );

    // 수정된 전체 게시글 목록을 localStorage에 다시 저장
    savePosts(updatedPosts);

    // 방금 저장한 최신 데이터에서 현재 게시글을 다시 찾아 화면 상태를 갱신
    // -> 댓글 개수가 즉시 UI에 반영됨
    const updatedPost = updatedPosts.find((item) => item.id === post.id) ?? null;
    setPost(updatedPost);

    // 댓글 작성이 완료됐으므로 입력창 비우기
    setCommentInput("");
  };

  if (!post) {
    return (
      <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
        <h1>게시글을 찾을 수 없습니다.</h1>
        <button onClick={() => router.push("/community")} style={{ marginTop: "12px", padding: "8px 14px", cursor: "pointer" }}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
      <button onClick={() => router.push("/community")} style={{ marginBottom: "16px", padding: "8px 14px", cursor: "pointer" }}>
        ← 목록으로
      </button>

      <h1 style={{ marginBottom: "8px" }}>{post.title}</h1>
      <p style={{ color: "#666", marginBottom: "12px" }}>
        작성자: {post.author} | 작성일: {new Date(post.createdAt).toLocaleString()}
      </p>
      <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6", marginBottom: "16px" }}>{post.content}</p>

      <button onClick={handleLike} style={{ padding: "8px 14px", cursor: "pointer", marginBottom: "24px" }}>
        👍 좋아요 {post.likes}
      </button>

      <h2 style={{ marginBottom: "10px" }}>댓글 {post.comments.length}개</h2>
      <div style={{ marginBottom: "14px" }}>
        {post.comments.length === 0 ? (
          <p style={{ color: "#888" }}>아직 댓글이 없습니다. 첫 댓글을 작성해보세요!</p>
        ) : (
          post.comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="댓글을 입력하세요"
          style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
        />
        <button onClick={handleComment} style={{ padding: "10px 16px", cursor: "pointer" }}>
          작성
        </button>
      </div>
    </div>
  );
}
