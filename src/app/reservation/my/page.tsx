"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { fetchMyReservations, cancelReservation } from "@/lib/api";
import { Reservation } from "@/types/reservation";

export default function MyReservationsPage() {
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    // 비로그인 시 리다이렉트
    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/login");
            return;
        }
        loadReservations();
    }, [isLoggedIn]);

    const loadReservations = async () => {
        try {
            const data = await fetchMyReservations();
            setReservations(data);
        } catch (err) {
            // 에러 처리
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("예약을 취소하시겠습니까?")) return;
        try {
            await cancelReservation(id);
            // 취소된 예약을 목록에서 즉시 제거
            setReservations((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            alert("예약 취소에 실패했습니다.");
        }
    };

    // 오늘 날짜 기준으로 다가오는/지난 예약 구분
    const today = new Date().toISOString().split("T")[0];
    const upcoming = reservations.filter((r) => r.date >= today);
    const past = reservations.filter((r) => r.date < today);

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">내 예약</h1>

            {/* 다가오는 예약 */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3">다가오는 예약</h2>
                {upcoming.length === 0 ? (
                    <p className="text-gray-500 text-sm">예약이 없습니다.</p>
                ) : (
                    upcoming.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4 mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{r.roomName}</p>
                                    <p className="text-sm text-gray-600">
                                        {r.date} {r.startTime} ~ {r.endTime}
                                    </p>
                                    <p className="text-sm mt-1">{r.purpose}</p>
                                </div>
                                <button
                                    onClick={() => handleCancel(r.id)}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* 지난 예약 */}
            <section>
                <h2 className="text-lg font-semibold mb-3">지난 예약</h2>
                {past.length === 0 ? (
                    <p className="text-gray-500 text-sm">지난 예약이 없습니다.</p>
                ) : (
                    past.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4 mb-3 opacity-60">
                            <p className="font-semibold">{r.roomName}</p>
                            <p className="text-sm text-gray-600">
                                {r.date} {r.startTime} ~ {r.endTime}
                            </p>
                            <p className="text-sm mt-1">{r.purpose}</p>
                        </div>
                    ))
                )}
            </section>
        </div>
    );
}