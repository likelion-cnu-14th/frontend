"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { fetchMyReservations, cancelReservation } from "@/lib/api";
import { Reservation } from "@/types/reservation";

export default function MyReservationsPage() {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    const isLoggedIn = !!user;
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [pageLoading, setPageLoading] = useState(true);

    // 비로그인 시 리다이렉트
    useEffect(() => {
        if (!loading && !isLoggedIn) {
            router.push("/login");
            return;
        }
        if (isLoggedIn) {
            loadReservations();
        }
    }, [isLoggedIn, loading]);

    const loadReservations = async () => {
        try {
            const data = await fetchMyReservations();
            setReservations(data);
        } catch {
            // 에러 처리
        } finally {
            setPageLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm("예약을 취소하시겠습니까?")) return;
        try {
            await cancelReservation(id);
            setReservations((prev) => prev.filter((r) => r.id !== id));
        } catch {
            alert("예약 취소에 실패했습니다.");
        }
    };

    // 오늘 날짜 기준으로 다가오는/지난 예약 구분
    const today = new Date().toISOString().split("T")[0];
    const upcoming = reservations.filter((r) => r.date >= today);
    const past = reservations.filter((r) => r.date < today);

    if (loading || pageLoading) return <div className="p-8 text-center">로딩 중...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => router.push("/reservation")}
                className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
                &larr; 스터디룸 목록
            </button>

            <h1 className="text-2xl font-bold mb-6">내 예약</h1>

            {/* 다가오는 예약 */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3">다가오는 예약</h2>
                {upcoming.length === 0 ? (
                    <p className="text-muted-foreground text-sm">예약이 없습니다.</p>
                ) : (
                    upcoming.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4 mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{r.roomName}</p>
                                    <p className="text-sm text-muted-foreground">
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
                    <p className="text-muted-foreground text-sm">지난 예약이 없습니다.</p>
                ) : (
                    past.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4 mb-3 opacity-60">
                            <p className="font-semibold">{r.roomName}</p>
                            <p className="text-sm text-muted-foreground">
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
