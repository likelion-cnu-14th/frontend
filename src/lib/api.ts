import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://study-community-backend.vercel.app/api',
});

// ✅ 하이패스(인터셉터) 설정: 토큰 이름을 'access_token'으로 통일!
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // ⚠️ 'access_token' 스펠링이 틀리면 안 됩니다!
    const token = localStorage.getItem('access_token'); 
    if (token) {
      // ⚠️ Authorization, Bearer 오타 주의!
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// --- 인증 API ---
export const register = async (data: any) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: any) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

// --- 게시글/댓글 API ---
export const fetchPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const fetchPost = async (id: string) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (data: { title: string; content: string }) => {
  // ⚠️ 주소가 '/posts' 가 맞는지 확인하세요!
  const response = await api.post('/posts', data);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

// 💡 [여기가 중요!] 댓글 주소에 오타가 없는지 다시 확인
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