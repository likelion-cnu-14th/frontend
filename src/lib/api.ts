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
import { Room, Reservation, ReservationCreate } from "@/types/reservation";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function getStoredUsername(): string | null {
  if (typeof window === "undefined") return null;

  const storedUser = window.localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as User;
    return user.username ?? null;
  } catch {
    return null;
  }
}

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
  const author = getStoredUsername();

  if (!author) {
    throw new Error("로그인한 사용자 정보를 찾을 수 없습니다.");
  }

  const response = await api.post<PostDetail>("/posts", {
    ...data,
    author,
  });
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
  const author = getStoredUsername();

  if (!author) {
    throw new Error("로그인한 사용자 정보를 찾을 수 없습니다.");
  }

  const response = await api.post<Comment>(`/posts/${postId}/comments`, {
    ...data,
    author,
  });
  return response.data;
}

export async function deleteComment(commentId: string): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

export async function fetchRooms(): Promise<Room[]> {
  const response = await api.get<Room[]>("/rooms");
  return response.data;
}

export async function fetchRoom(roomId: string): Promise<Room> {
  const response = await api.get<Room>(`/rooms/${roomId}`);
  return response.data;
}

export async function fetchRoomReservations(
  roomId: string,
  date: string
): Promise<Reservation[]> {
  const response = await api.get<Reservation[]>(
    `/rooms/${roomId}/reservations`,
    {
      params: { date },
    }
  );
  return response.data;
}

export async function createReservation(
  data: ReservationCreate
): Promise<Reservation> {
  const response = await api.post<Reservation>("/reservations", data);
  return response.data;
}

export async function fetchMyReservations(): Promise<Reservation[]> {
  const response = await api.get<Reservation[]>("/reservations/me");
  return response.data;
}

export async function cancelReservation(reservationId: string): Promise<void> {
  await api.delete(`/reservations/${reservationId}`);
}
