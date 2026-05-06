"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  createReservation,
  fetchRoom,
  fetchRoomReservations,
} from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Reservation, Room } from "@/types/reservation";

// 09:00 ~ 21:00 시간대 생성 (22:00은 종료 시간으로만 사용)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function ReservationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [room, setRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const roomData = await fetchRoom(roomId);
        setRoom(roomData);
      } catch {
        setError("스터디룸 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [roomId]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const reservationData = await fetchRoomReservations(roomId, selectedDate);
        setReservations(reservationData);
        setError("");
      } catch {
        setError("예약 현황을 불러오지 못했습니다.");
      }
    };

    if (roomId) {
      loadReservations();
    }
    setSelectedStart(null);
    setSelectedEnd(null);
  }, [roomId, selectedDate]);

  // 특정 시간이 예약되어 있는지 확인
  const getReservationForSlot = (time: string) => {
    return reservations.find((r) => r.startTime <= time && r.endTime > time);
  };

  const selectedRangeLabel = useMemo(() => {
    if (!selectedStart) return "";
    if (!selectedEnd) return `${selectedStart} ~ (종료 시간 선택)`;
    return `${selectedStart} ~ ${selectedEnd}`;
  }, [selectedEnd, selectedStart]);

  const getNextHour = (time: string) => {
    const hour = parseInt(time, 10);
    return `${(hour + 1).toString().padStart(2, "0")}:00`;
  };

  const handleSlotClick = (time: string) => {
    if (getReservationForSlot(time)) return;
    if (!isLoggedIn) return;

    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(time);
      setSelectedEnd(getNextHour(time));
      return;
    }

    const endTime = getNextHour(time);
    if (endTime <= selectedStart) return;

    const hasConflict = TIME_SLOTS.some(
      (slot) =>
        selectedStart <= slot &&
        endTime > slot &&
        Boolean(getReservationForSlot(slot))
    );

    if (hasConflict) {
      setError("선택한 시간에 이미 예약된 구간이 포함되어 있습니다.");
      return;
    }

    setError("");
    setSelectedEnd(endTime);
  };

  const handleReserve = async () => {
    if (!selectedStart || !selectedEnd || !purpose.trim()) {
      alert("시간과 예약 목적을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
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
    } catch (err: any) {
      const message =
        err?.response?.data?.detail?.error || "예약에 실패했습니다.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-4xl p-4">로딩 중...</div>;
  }

  if (!room) {
    return (
      <div className="mx-auto max-w-4xl p-4">
        <p className="text-red-600">스터디룸 정보를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push("/reservation")}
          className="mt-3 rounded-md border px-3 py-2 text-sm"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <button
        onClick={() => router.push("/reservation")}
        className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
      >
        ← 목록으로
      </button>

      <div className="rounded-lg border p-4">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {room.location} · 수용인원 {room.capacity}명
        </p>
        <p className="mt-2 text-sm">{room.description}</p>
      </div>

      <div className="rounded-lg border p-4">
        <label className="mb-2 block text-sm font-medium">예약 날짜</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">시간표 (09:00 ~ 22:00)</h2>
        <div className="overflow-hidden rounded-md border border-slate-600 bg-slate-800 shadow-sm">
          {TIME_SLOTS.map((time, index) => {
            const reservation = getReservationForSlot(time);
            const isSelected =
              selectedStart &&
              selectedEnd &&
              time >= selectedStart &&
              time < selectedEnd;
            const isLast = index === TIME_SLOTS.length - 1;

            return (
              <div
                key={time}
                onClick={() => handleSlotClick(time)}
                className={`flex items-center p-3 ${
                  !isLast ? "border-b border-slate-600/80" : ""
                } ${
                  reservation
                    ? "cursor-not-allowed bg-slate-600 text-slate-200"
                    : isSelected
                    ? "cursor-pointer bg-blue-700 text-white"
                    : "cursor-pointer bg-slate-800 text-slate-100 hover:bg-slate-700"
                }`}
              >
                <span className="w-16 font-mono text-sm tabular-nums">{time}</span>
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
      </div>

      <div className="rounded-lg border p-4">
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {isLoggedIn ? (
          <div className="mt-4 space-y-3">
            {selectedStart && selectedEnd && (
              <p className="text-sm">
                선택한 시간: {selectedStart} ~ {selectedEnd}
              </p>
            )}
            {!selectedRangeLabel && (
              <p className="text-sm text-gray-500">시작 시간부터 선택해주세요.</p>
            )}
            <input
              type="text"
              placeholder="예약 목적을 입력하세요"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
            <button
              onClick={handleReserve}
              disabled={!selectedStart || !selectedEnd || !purpose.trim() || submitting}
              className="w-full rounded bg-blue-500 py-2 text-white disabled:opacity-50"
            >
              {submitting ? "예약 중..." : "예약하기"}
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500">
            <Link href="/login" className="underline">
              로그인
            </Link>{" "}
            후 예약할 수 있습니다.
          </p>
        )}
      </div>
    </div>
  );
}
