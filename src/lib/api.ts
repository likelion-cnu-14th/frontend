import { Post, Comment } from "@/types/post";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface PostSummary {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  commentCount: number;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `요청 실패 (${res.status})`);
  }
  return res.json();
}

// 게시글 목록 조회
export const fetchPosts = () => request<PostSummary[]>("/posts");

// 게시글 상세 조회
export const fetchPost = (id: string) => request<Post>(`/posts/${id}`);

// 게시글 작성
export const createPost = (data: { title: string; content: string; author: string }) =>
  request<Post>("/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });

// 좋아요 토글
export const toggleLike = (id: string) =>
  request<Post>(`/posts/${id}/like`, { method: "PATCH" });

// 게시글 삭제
export const deletePost = (id: string) =>
  request<{ message: string }>(`/posts/${id}`, { method: "DELETE" });

// 댓글 목록 조회
export const fetchComments = (postId: string) =>
  request<Comment[]>(`/posts/${postId}/comments`);

// 댓글 작성
export const createComment = (postId: string, data: { content: string; author: string }) =>
  request<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });

// 댓글 삭제
export const deleteComment = (commentId: string) =>
  request<{ message: string }>(`/comments/${commentId}`, { method: "DELETE" });
