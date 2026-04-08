import axios from "axios";

import type {
  Comment,
  CreateCommentRequest,
  CreatePostRequest,
  PostDetail,
  PostListItem,
  TokenResponse,
  User,
} from "@/types/post";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function register(data: RegisterRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/register", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>("/auth/login", data);
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/auth/me");
  return response.data;
}

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
): Promise<Comment> {
  const response = await api.post<Comment>(`/posts/${postId}/comments`, data);
  return response.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}
