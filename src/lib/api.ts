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