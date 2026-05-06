"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchRooms } from "@/lib/api";
import { Room } from "@/types/reservation";

export default function ReservationPage() {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const data = await fetchRooms();
                setRooms(data);
            } catch {
                setError("스터디룸 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);

    if (loading) {
        return <div className="mx-auto max-w-4xl p-4">로딩 중....</div>;
    }

    if (error) {
        return <div className="mx-auto max-w-4xl p-4 text-red-600">{error}</div>;
    }

    return (
        <div className="mx-auto max-w-4xl p-4">
            <button
                onClick={() => router.back()}
                className="mb-4 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
            >
                ← 뒤로가기
            </button>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">스터디룸 예약</h1>
                <button
                    onClick={() => router.push("/reservation/my")}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    내 예약 보기
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="flex flex-col rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
                    >
                        <h2 className="text-lg font-semibold">{room.name}</h2>
                        <p className="text-sm text-gray-600">
                            {room.location} · {room.capacity}인
                        </p>
                        <p className="mt-1 text-sm">{room.description}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {room.amenities.map((amenity) => (
                                <span
                                    key={amenity}
                                    className="rounded bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800 dark:text-gray-200"
                                >
                                    {amenity}
                                </span>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => router.push(`/reservation/${room.id}`)}
                            className="mt-4 w-full rounded-md bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-900"
                        >
                            예약 시간표 보기
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
