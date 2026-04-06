import axios from "axios";
import { Post, Comment } from "@/types/post";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
    headers: { "Content-Type": "application/json" },
});

// 요청 시 토큰 자동 첨부
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Auth 타입
export interface AuthUser {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

interface TokenResponse {
    access_token: string;
    token_type: string;
    user: AuthUser;
}

// Auth API
export const authApi = {
    register: async (
        username: string,
        email: string,
        password: string,
    ): Promise<TokenResponse> => {
        const res = await api.post<TokenResponse>("/auth/register", {
            username,
            email,
            password,
        });
        return res.data;
    },
    login: async (email: string, password: string): Promise<TokenResponse> => {
        const res = await api.post<TokenResponse>("/auth/login", {
            email,
            password,
        });
        return res.data;
    },
    getMe: async (token: string): Promise<AuthUser> => {
        const res = await api.get<AuthUser>("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    },
};

export interface PostSummary {
    id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    likes: number;
    commentCount: number;
}

// 게시글 목록 조회
export const fetchPosts = async (): Promise<PostSummary[]> => {
    const res = await api.get<PostSummary[]>("/posts");
    return res.data;
};

// 게시글 상세 조회
export const fetchPost = async (id: string): Promise<Post> => {
    const res = await api.get<Post>(`/posts/${id}`);
    return res.data;
};

// 게시글 작성
export const createPost = async (data: {
    title: string;
    content: string;
    author: string;
}): Promise<Post> => {
    const res = await api.post<Post>("/posts", data);
    return res.data;
};

// 좋아요 토글
export const toggleLike = async (id: string): Promise<Post> => {
    const res = await api.patch<Post>(`/posts/${id}/like`);
    return res.data;
};

// 게시글 삭제
export const deletePost = async (id: string): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/posts/${id}`);
    return res.data;
};

// 댓글 목록 조회
export const fetchComments = async (postId: string): Promise<Comment[]> => {
    const res = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return res.data;
};

// 댓글 작성
export const createComment = async (
    postId: string,
    data: { content: string; author: string },
): Promise<Comment> => {
    const res = await api.post<Comment>(`/posts/${postId}/comments`, data);
    return res.data;
};

// 댓글 삭제
export const deleteComment = async (
    commentId: string,
): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(`/comments/${commentId}`);
    return res.data;
};
