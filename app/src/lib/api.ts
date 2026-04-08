import axios from "axios";
import type { Post, PostDetail } from "../types/post";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchPosts = async (): Promise<Post[]> => {
  const res = await api.get("/posts");
  return res.data;
};

export const fetchPost = async (id: number): Promise<PostDetail> => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

export default api;

export const createPost = async (data: {
  title: string;
  content: string;
  author: string;
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