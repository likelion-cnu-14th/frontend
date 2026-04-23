import axios from "axios";
import type { Post, PostDetail } from "../types/post";
import type {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "../types/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   axios 인터셉터 (JWT 자동 첨부)
========================= */
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/* =========================
   기존 게시글 API
========================= */
export const fetchPosts = async (): Promise<Post[]> => {
  const res = await api.get("/posts");
  return res.data;
};

export const fetchPost = async (id: number): Promise<PostDetail> => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

/* 🔥 author 제거 */
export const createPost = async (data: {
  title: string;
  content: string;
}) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const toggleLike = async (id: number): Promise<PostDetail> => {
  const res = await api.patch(`/posts/${id}/like`);
  return res.data;
};

export const deletePost = async (id: number) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const createComment = async (
  postId: number,
  data: { content: string }
): Promise<PostDetail> => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};

export const deleteComment = async (
  postId: number,
  commentId: number
): Promise<PostDetail> => {
  const res = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return res.data;
};

/* =========================
   인증 API (Step1 핵심)
========================= */
export const register = async (data: RegisterRequest) => {
  const res = await api.post<TokenResponse>("/auth/register", data);
  return res.data;
};

export const login = async (data: LoginRequest) => {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get<User>("/auth/me");
  return res.data;
};

export default api;