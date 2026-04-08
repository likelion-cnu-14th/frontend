"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { fetchRooms } from "@/lib/api";
import { deleteRoom } from "@/lib/adminApi";
import { Room } from "@/types/reservation";
import RoomFormModal from "@/components/RoomFormModal";

export default function AdminPage() {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    const router = useRouter();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    // 모달 상태
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    // 접근 제어: 관리자가 아니면 홈으로
    useEffect(() => {
        if (!loading && (!user || user.role !== "admin")) {
            router.push("/");
        }
    }, [user, loading, router]);

    // 스터디룸 목록 로드
    useEffect(() => {
        if (user?.role === "admin") {
            loadRooms();
        }
    }, [user]);

    const loadRooms = async () => {
        try {
            const data = await fetchRooms();
            setRooms(data);
        } catch {
            setError("스터디룸 목록을 불러오는데 실패했습니다.");
        } finally {
            setPageLoading(false);
        }
    };

    const handleDelete = async (roomId: string, roomName: string) => {
        if (!confirm(`"${roomName}" 스터디룸을 삭제하시겠습니까?\n관련 예약도 모두 삭제됩니다.`)) return;
        try {
            await deleteRoom(roomId);
            setRooms((prev) => prev.filter((r) => r.id !== roomId));
        } catch {
            alert("스터디룸 삭제에 실패했습니다.");
        }
    };

    const handleAdd = () => {
        setEditingRoom(null);
        setShowModal(true);
    };

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingRoom(null);
    };

    const handleModalSuccess = () => {
        setShowModal(false);
        setEditingRoom(null);
        loadRooms();
    };

    if (loading || pageLoading) return <div className="p-8 text-center">로딩 중...</div>;
    if (!user || user.role !== "admin") return null;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">스터디룸 관리</h1>
                <button
                    onClick={handleAdd}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                >
                    스터디룸 추가
                </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-accent">
                        <tr>
                            <th className="text-left p-3">이름</th>
                            <th className="text-left p-3">위치</th>
                            <th className="text-left p-3">수용인원</th>
                            <th className="text-left p-3">편의시설</th>
                            <th className="text-right p-3">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rooms.map((room) => (
                            <tr key={room.id} className="border-t">
                                <td className="p-3 font-medium">{room.name}</td>
                                <td className="p-3 text-muted-foreground">{room.location}</td>
                                <td className="p-3">{room.capacity}인</td>
                                <td className="p-3">
                                    <div className="flex flex-wrap gap-1">
                                        {room.amenities.map((a) => (
                                            <span key={a} className="text-xs bg-accent px-1.5 py-0.5 rounded">
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => handleEdit(room)}
                                        className="text-blue-500 hover:text-blue-700 mr-3"
                                    >
                                        수정
                                    </button>
                                    <button
                                        onClick={() => handleDelete(room.id, room.name)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rooms.length === 0 && (
                    <p className="p-8 text-center text-muted-foreground">
                        등록된 스터디룸이 없습니다.
                    </p>
                )}
            </div>

            {showModal && (
                <RoomFormModal
                    room={editingRoom}
                    onClose={handleModalClose}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
}
