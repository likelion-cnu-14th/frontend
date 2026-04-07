import axios from "axios";
import { PostDetail, PostListItem } from "@/types/post";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export type ApiId = number | string;
export type RequestBody = Record<string, unknown>;

export const fetchPosts = async (): Promise<PostListItem[]> => {
  const res = await api.get<PostListItem[]>("/posts");
  return res.data;
};

export const fetchPost = async (id: ApiId): Promise<PostDetail> => {
  const res = await api.get<PostDetail>(`/posts/${id}`);
  return res.data;
};

export const createPost = async (data: RequestBody) => {
  const res = await api.post("/posts", data);
  return res.data;
};

export const deletePost = async (id: ApiId) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

export const toggleLike = async (id: ApiId) => {
  const res = await api.patch(`/posts/${id}/like`);
  return res.data;
};

export const createComment = async (postId: ApiId, data: RequestBody) => {
  const res = await api.post(`/posts/${postId}/comments`, data);
  return res.data;
};

export const deleteComment = async (commentId: ApiId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};