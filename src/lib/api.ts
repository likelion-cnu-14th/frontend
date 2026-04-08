import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://study-community-backend.vercel.app/api',
});

// ✅ 4주차: 토큰 자동 첨부 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ✅ 4주차: 신규 인증 API
export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// 🔄 3주차: 기존 게시글/댓글 API (+ 4주차 규칙에 맞게 일부 수정)
export const fetchPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const fetchPost = async (id: string) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

// 글 작성 시 author 파라미터 제거 (서버가 알아서 처리함)
export const createPost = async (data: { title: string; content: string }) => {
  const response = await api.post('/posts', data);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// 댓글 작성 시 author 파라미터 제거
export const createComment = async (postId: string, data: { content: string }) => {
  const response = await api.post(`/posts/${postId}/comments`, data);
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

export const toggleLike = async (id: string) => {
  const response = await api.patch(`/posts/${id}/like`);
  return response.data;
};