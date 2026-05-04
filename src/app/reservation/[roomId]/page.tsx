"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchRoom, fetchRoomReservations, createReservation } from "@/lib/api";
import { Room, Reservation } from "@/types/reservation";
import { useAuthStore } from "@/store/authStore";

const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
});

export default function RoomDetailPage() {
    const params = useParams();
    const roomId = params.roomId as string;
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();

    // ✅ 스터디룸 정보 상태 추가
    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedStart, setSelectedStart] = useState<string | null>(null);
    const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
    const [purpose, setPurpose] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");  // ✅ 에러 상태 추가

    // ✅ 스터디룸 정보 로드
    useEffect(() => {
        const loadRoom = async () => {
            try {
                const data = await fetchRoom(roomId);
                setRoom(data);
            } catch (err) {
                setError("스터디룸 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId]);

    // 날짜 변경 시 예약 현황 로드
    useEffect(() => {
        const loadReservations = async () => {
            try {
                const data = await fetchRoomReservations(roomId, selectedDate);
                setReservations(data);
            } catch (err) {
                setReservations([]);
            }
        };
        loadReservations();
        setSelectedStart(null);
        setSelectedEnd(null);
    }, [selectedDate, roomId]);

    const getReservationForSlot = (time: string) => {
        return reservations.find((r) => r.startTime <= time && r.endTime > time);
    };

    const handleSlotClick = (time: string) => {
        if (getReservationForSlot(time)) return;
        if (!isLoggedIn) return;

        if (!selectedStart || (selectedStart && selectedEnd)) {
            setSelectedStart(time);
            const nextHour = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
            setSelectedEnd(nextHour);
        } else {
            const endTime = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
            if (endTime > selectedStart) {
                setSelectedEnd(endTime);
            }
        }
    };

    const handleReserve = async () => {
        if (!selectedStart || !selectedEnd || !purpose.trim()) {
            setSubmitError("시간과 예약 목적을 입력해주세요.");
            return;
        }

        setSubmitting(true);
        setSubmitError("");
        try {
            await createReservation({
                roomId,
                date: selectedDate,
                startTime: selectedStart,
                endTime: selectedEnd,
                purpose,
            });
            const updated = await fetchRoomReservations(roomId, selectedDate);
            setReservations(updated);
            setSelectedStart(null);
            setSelectedEnd(null);
            setPurpose("");
        } catch (err: any) {
            // ✅ alert 대신 화면에 에러 표시
            setSubmitError(err.response?.data?.detail?.error || "예약에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4">로딩 중...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => router.push("/reservation")}
                className="mb-4 text-sm text-gray-500 hover:underline"
            >
                ← 목록으로
            </button>

            {/* ✅ 스터디룸 정보 표시 */}
            {room && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <h1 className="text-2xl font-bold">{room.name}</h1>
                    <p className="text-gray-500 mt-1">
                        {room.location} · {room.capacity}인
                    </p>
                </div>
            )}

            {/* 날짜 선택 */}
            <div className="mb-4">
                <label className="text-sm font-medium">날짜 선택</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="mt-1 block px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>

            {/* 시간표 */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                {TIME_SLOTS.map((time) => {
                    const reservation = getReservationForSlot(time);
                    const isSelected =
                        selectedStart &&
                        selectedEnd &&
                        time >= selectedStart &&
                        time < selectedEnd;

                    return (
                        <div
                            key={time}
                            onClick={() => handleSlotClick(time)}
                            className={`flex items-center border-b border-gray-100 last:border-0 p-3 ${
                                reservation
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-blue-100 cursor-pointer"
                                    : "hover:bg-gray-50 cursor-pointer"
                            }`}
                        >
                            <span className="w-16 font-mono text-sm">{time}</span>
                            <span className="flex-1 text-sm">
                                {reservation
                                    ? `${reservation.purpose} (${reservation.username})`
                                    : isSelected
                                    ? "선택됨"
                                    : ""}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* 비로그인 처리 / 예약 폼 */}
            {!isLoggedIn ? (
                <p className="text-sm text-gray-500">
                    <Link href="/login" className="text-blue-500 hover:underline">
                        로그인
                    </Link>
                    {" "}후 예약할 수 있습니다.
                </p>
            ) : (
                <div className="grid gap-3">
                    {selectedStart && selectedEnd && (
                        <p className="text-sm text-gray-600">
                            선택한 시간: {selectedStart} ~ {selectedEnd}
                        </p>
                    )}
                    <input
                        type="text"
                        placeholder="예약 목적을 입력하세요"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-200"
                    />

                    {/* ✅ 에러 화면에 표시 */}
                    {submitError && (
                        <p className="text-red-500 text-sm">{submitError}</p>
                    )}

                    <button
                        onClick={handleReserve}
                        disabled={!selectedStart || !selectedEnd || !purpose.trim() || submitting}
                        className={`px-3 py-2 rounded-lg border border-gray-200 bg-white ${
                            !selectedStart || !selectedEnd || !purpose.trim() || submitting
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer hover:bg-gray-50"
                        }`}
                    >
                        {submitting ? "예약 중..." : "예약하기"}
                    </button>
                </div>
            )}
        </div>
    );
}