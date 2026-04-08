"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { fetchRoom, fetchRoomReservations, createReservation } from "@/lib/api";
import { Room, Reservation } from "@/types/reservation";

// 09:00 ~ 21:00 시간대 생성 (22:00은 종료 시간으로만 사용)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
});

export default function RoomDetailPage() {
    const params = useParams();
    const router = useRouter();
    const roomId = params.roomId as string;
    const user = useAuthStore((s) => s.user);
    const isLoggedIn = !!user;

    const [room, setRoom] = useState<Room | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0],
    );
    const [selectedStart, setSelectedStart] = useState<string | null>(null);
    const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
    const [purpose, setPurpose] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 스터디룸 정보 로드
    useEffect(() => {
        const loadRoom = async () => {
            try {
                const data = await fetchRoom(roomId);
                setRoom(data);
            } catch {
                setError("스터디룸 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadRoom();
    }, [roomId]);

    // 날짜가 바뀔 때마다 예약 현황 다시 조회
    useEffect(() => {
        const loadReservations = async () => {
            try {
                const data = await fetchRoomReservations(roomId, selectedDate);
                setReservations(data);
            } catch {
                // 에러 처리
            }
        };
        loadReservations();
        // 날짜가 바뀌면 선택 초기화
        setSelectedStart(null);
        setSelectedEnd(null);
    }, [selectedDate, roomId]);

    const getReservationForSlot = (time: string) => {
        return reservations.find((r) => r.startTime <= time && r.endTime > time);
    };

    const handleSlotClick = (time: string) => {
        if (getReservationForSlot(time)) return;
        if (!isLoggedIn) return;

        if (!selectedStart) {
            // 첫 클릭: 시작 시간 설정 (종료는 아직 미정)
            setSelectedStart(time);
            setSelectedEnd(null);
        } else if (!selectedEnd) {
            // 두 번째 클릭: 종료 시간 설정
            const endTime = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
            if (time < selectedStart) {
                // 시작 시간보다 앞을 클릭하면 시작 시간 재설정
                setSelectedStart(time);
            } else {
                // 시작~종료 사이에 예약된 슬롯이 있으면 선택 불가
                const hasConflict = TIME_SLOTS.some(
                    (t) => t >= selectedStart && t < endTime && getReservationForSlot(t),
                );
                if (hasConflict) {
                    alert("선택한 범위에 이미 예약된 시간이 포함되어 있습니다.");
                    return;
                }
                setSelectedEnd(endTime);
            }
        } else {
            // 세 번째 클릭: 리셋 후 새로 시작
            setSelectedStart(time);
            setSelectedEnd(null);
        }
    };

    const handleReserve = async () => {
        if (!selectedStart || !selectedEnd || !purpose.trim()) {
            alert("시간과 예약 목적을 입력해주세요.");
            return;
        }

        setSubmitting(true);
        try {
            await createReservation({
                roomId,
                date: selectedDate,
                startTime: selectedStart,
                endTime: selectedEnd,
                purpose,
            });
            alert("예약이 완료되었습니다!");
            const updated = await fetchRoomReservations(roomId, selectedDate);
            setReservations(updated);
            setSelectedStart(null);
            setSelectedEnd(null);
            setPurpose("");
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { detail?: { error?: string } } } };
            const message =
                axiosErr.response?.data?.detail?.error || "예약에 실패했습니다.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">로딩 중...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!room) return null;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <button
                onClick={() => router.push("/reservation")}
                className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
                &larr; 목록으로
            </button>

            {/* 스터디룸 정보 */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{room.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    {room.location} · {room.capacity}인
                </p>
                <p className="text-sm mt-2">{room.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                    {room.amenities.map((a) => (
                        <span
                            key={a}
                            className="text-xs bg-accent px-2 py-1 rounded"
                        >
                            {a}
                        </span>
                    ))}
                </div>
            </div>

            {/* 날짜 선택 */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">날짜 선택</label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-3 py-2"
                />
            </div>

            {/* 시간표 */}
            <div className="border rounded-lg overflow-hidden mb-4">
                <div className="bg-accent px-3 py-2 text-sm font-medium">
                    시간표 ({selectedDate})
                </div>
                {TIME_SLOTS.map((time) => {
                    const reservation = getReservationForSlot(time);
                    const isSelected =
                        selectedStart &&
                        selectedEnd &&
                        time >= selectedStart &&
                        time < selectedEnd;
                    const isStartMarker =
                        selectedStart && !selectedEnd && time === selectedStart;

                    return (
                        <div
                            key={time}
                            onClick={() => handleSlotClick(time)}
                            className={`flex items-center border-b p-3 ${
                                reservation
                                    ? "bg-gray-200 cursor-not-allowed"
                                    : isSelected || isStartMarker
                                    ? "bg-blue-100 cursor-pointer"
                                    : "hover:bg-gray-50 cursor-pointer"
                            }`}
                        >
                            <span className="w-16 font-mono text-sm">{time}</span>
                            <span className="flex-1 text-sm">
                                {reservation
                                    ? `${reservation.purpose} (${reservation.username})`
                                    : isStartMarker
                                    ? "시작 (종료 시간을 선택하세요)"
                                    : isSelected
                                    ? "선택됨"
                                    : ""}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* 예약 폼 */}
            {isLoggedIn ? (
                <div className="space-y-3">
                    {selectedStart && selectedEnd && (
                        <p className="text-sm">
                            선택한 시간: {selectedStart} ~ {selectedEnd}
                        </p>
                    )}
                    <input
                        type="text"
                        placeholder="예약 목적을 입력하세요"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />
                    <button
                        onClick={handleReserve}
                        disabled={
                            !selectedStart ||
                            !selectedEnd ||
                            !purpose.trim() ||
                            submitting
                        }
                        className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
                    >
                        {submitting ? "예약 중..." : "예약하기"}
                    </button>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    <Link href="/login" className="underline">
                        로그인
                    </Link>{" "}
                    후 예약할 수 있습니다.
                </p>
            )}
        </div>
    );
}
