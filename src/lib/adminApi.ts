import axios from "axios";
import { Room } from "@/types/reservation";

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

// 스터디룸 생성 요청 타입
export interface RoomCreate {
    name: string;
    location: string;
    capacity: number;
    description: string;
    amenities: string[];
}

// 스터디룸 수정 요청 타입
export interface RoomUpdate {
    name?: string;
    location?: string;
    capacity?: number;
    description?: string;
    amenities?: string[];
}

// === Admin 스터디룸 관리 API ===

// 스터디룸 생성
export const createRoom = async (data: RoomCreate): Promise<Room> => {
    const res = await api.post<Room>("/admin/rooms", data);
    return res.data;
};

// 스터디룸 수정
export const updateRoom = async (
    roomId: string,
    data: RoomUpdate,
): Promise<Room> => {
    const res = await api.put<Room>(`/admin/rooms/${roomId}`, data);
    return res.data;
};

// 스터디룸 삭제
export const deleteRoom = async (
    roomId: string,
): Promise<{ message: string }> => {
    const res = await api.delete<{ message: string }>(
        `/admin/rooms/${roomId}`,
    );
    return res.data;
};
