"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchRooms, fetchRoom, fetchRoomReservations, createReservation, fetchMyReservations, cancelReservation } from "@/lib/api";
import { Room, Reservation, ReservationCreate } from "@/types/reservation";
import { useAuthStore } from "@/store/authStore";

const [selectedStart, setSelectedStart] = useState<string | null>(null);
const [selectedEnd, setSelectedEnd] = useState<string | null>(null);

// 09:00 ~ 21:00 시간대 생성 (22:00은 종료 시간으로만 사용)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
    const hour = i + 9;
    return `${hour.toString().padStart(2, "0")}:00`;
});
// → ["09:00", "10:00", "11:00", ..., "21:00"]

const getReservationForSlot = (time: string) => {
    return reservations.find((r) => r.startTime <= time && r.endTime > time);
};