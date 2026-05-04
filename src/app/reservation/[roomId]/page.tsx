"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRooms, fetchRoom, fetchRoomReservations, createReservation, fetchMyReservations, cancelReservation } from "@/lib/api";
import { Room, Reservation, ReservationCreate } from "@/types/reservation";
import { useAuthStore } from "@/store/authStore";

const [selectedStart, setSelectedStart] = useState<string | null>(null);
const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0], // 오늘 날짜
);
const [reservations, setReservations] = useState<Reservation[]>([]);
const [purpose, setPurpose] = useState("");
const [submitting, setSubmitting] = useState(false);

// 09:00 ~ 21:00 시간대 생성 (22:00은 종료 시간으로만 사용)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
});
// → ["09:00", "10:00", "11:00", ..., "21:00"]

const getReservationForSlot = (time: string) => {
    return reservations.find((r) => r.startTime <= time && r.endTime > time);
};

const handleSlotClick = (time: string) => {
    // 이미 예약된 시간이면 무시
    if (getReservationForSlot(time)) return;
    // 비로그인이면 무시
    if (!isLoggedIn) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
        // 첫 클릭 또는 리셋: 시작 시간 설정
        setSelectedStart(time);
        // 종료 시간은 시작 시간 + 1시간
        const nextHour = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
        setSelectedEnd(nextHour);
    } else {
        // 두 번째 클릭: 종료 시간 설정
        const endTime = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
        if (endTime > selectedStart) {
            setSelectedEnd(endTime);
        }
    }
};

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
            className={`flex items-center border-b p-3 ${
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

// 날짜가 바뀔 때마다 예약 현황 다시 조회
useEffect(() => {
    const loadReservations = async () => {
        try {
            const data = await fetchRoomReservations(roomId, selectedDate);
            setReservations(data);
        } catch (err) {
            // 에러 처리
        }
    };
    loadReservations();
    // 날짜가 바뀌면 선택 초기화
    setSelectedStart(null);
    setSelectedEnd(null);
}, [selectedDate, roomId]);

const handleReserve = async () => {
    if (!selectedStart || !selectedEnd || !purpose.trim()) {
        alert("시간과 예약 목적을 입력해주세요.");
        return;
    }

    setSubmitting(true);
    try {
        await createReservation({
            roomId: roomId,
            date: selectedDate,
            startTime: selectedStart,
            endTime: selectedEnd,
            purpose: purpose,
        });
        alert("예약이 완료되었습니다!");
        // 예약 현황 새로고침
        const updated = await fetchRoomReservations(roomId, selectedDate);
        setReservations(updated);
        // 선택 초기화
        setSelectedStart(null);
        setSelectedEnd(null);
        setPurpose("");
    } catch (err: any) {
        const message =
            err.response?.data?.detail?.error || "예약에 실패했습니다.";
        alert(message);
    } finally {
        setSubmitting(false);
    }
};