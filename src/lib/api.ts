import axios from "axios";

import type {
  CreateCommentRequest,
  CreatePostRequest,
  PostDetail,
  PostListItem,
} from "@/types/post";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchPosts(): Promise<PostListItem[]> {
  const response = await api.get<PostListItem[]>("/posts");
  return response.data;
}

export async function fetchPost(id: string): Promise<PostDetail> {
  const response = await api.get<PostDetail>(`/posts/${id}`);
  return response.data;
}

export async function createPost(data: CreatePostRequest): Promise<PostDetail> {
  const response = await api.post<PostDetail>("/posts", data);
  return response.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}`);
}

export async function toggleLike(id: string): Promise<PostDetail> {
  const response = await api.patch<PostDetail>(`/posts/${id}/like`);
  return response.data;
}

export async function createComment(
  postId: string,
  data: CreateCommentRequest
): Promise<PostDetail> {
  const response = await api.post<PostDetail>(`/posts/${postId}/comments`, data);
  return response.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}
