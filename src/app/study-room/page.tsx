"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { CalendarDays, Clock3, DoorOpen, Trash2 } from "lucide-react";

type StudyRoomReservation = {
  id: string;
  room: string;
  date: string;
  startHour: number;
  endHour: number;
  purpose: string;
  reserver: string;
  createdAt: string;
};

const STORAGE_KEY = "study-room-reservations";
const ROOMS = [
  "스터디룸 A",
  "스터디룸 B",
  "스터디룸 C",
  "스터디룸 D",
  "스터디룸 E",
];
const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => i + 9);

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function formatRange(startHour: number, endHour: number) {
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

function isOverlapped(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
) {
  return aStart < bEnd && bStart < aEnd;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

export default function StudyRoomPage() {
  const user = useAuthStore((s) => s.user);
  const [reservations, setReservations] = useState<StudyRoomReservation[]>([]);
  const [room, setRoom] = useState(ROOMS[0]);
  const [date, setDate] = useState(getToday());
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(11);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartHour, setDragStartHour] = useState<number | null>(null);
  const [purpose, setPurpose] = useState("");
  const [reserver, setReserver] = useState("");

  useEffect(() => {
    if (user?.username) {
      setReserver(user.username);
    }
  }, [user?.username]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as StudyRoomReservation[];
      setReservations(parsed);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (endHour <= startHour) {
      setEndHour(startHour + 1);
    }
  }, [startHour, endHour]);

  useEffect(() => {
    const handlePointerUp = () => {
      setIsDragging(false);
      setDragStartHour(null);
    };
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, []);

  const selectedDateReservations = useMemo(
    () =>
      reservations
        .filter((item) => item.date === date)
        .sort((a, b) => a.startHour - b.startHour),
    [reservations, date],
  );

  const selectedRoomDateReservations = useMemo(
    () =>
      reservations.filter((item) => item.date === date && item.room === room),
    [reservations, date, room],
  );

  const occupiedStartHours = useMemo(() => {
    const occupied = new Set<number>();
    selectedRoomDateReservations.forEach((reservation) => {
      for (let hour = reservation.startHour; hour < reservation.endHour; hour++) {
        occupied.add(hour);
      }
    });
    return occupied;
  }, [selectedRoomDateReservations]);

  const handleSlotPointerDown = (hour: number) => {
    setIsDragging(true);
    setDragStartHour(hour);
    setStartHour(hour);
    setEndHour(hour + 1);
  };

  const handleSlotPointerEnter = (hour: number) => {
    if (!isDragging || dragStartHour === null) return;

    const nextStart = Math.min(dragStartHour, hour);
    const nextEnd = Math.max(dragStartHour, hour) + 1;
    setStartHour(nextStart);
    setEndHour(nextEnd);
  };

  const isHourSelected = (hour: number) => hour >= startHour && hour < endHour;
  const selectedRangeHasConflict = useMemo(
    () => TIME_SLOTS.some((hour) => isHourSelected(hour) && occupiedStartHours.has(hour)),
    [startHour, endHour, occupiedStartHours],
  );

  const handleReserve = () => {
    if (!reserver.trim()) {
      alert("예약자 이름을 입력해주세요.");
      return;
    }
    if (!purpose.trim()) {
      alert("사용 목적을 입력해주세요.");
      return;
    }

    const hasConflict = reservations.some(
      (item) =>
        item.room === room &&
        item.date === date &&
        isOverlapped(item.startHour, item.endHour, startHour, endHour),
    );

    if (hasConflict) {
      alert("해당 시간에는 이미 예약이 있습니다. 다른 시간을 선택해주세요.");
      return;
    }

    const next: StudyRoomReservation[] = [
      ...reservations,
      {
        id: `${Date.now()}`,
        room,
        date,
        startHour,
        endHour,
        purpose: purpose.trim(),
        reserver: reserver.trim(),
        createdAt: new Date().toISOString(),
      },
    ];

    setReservations(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setPurpose("");
    alert("스터디룸 예약이 완료되었습니다.");
  };

  const handleDelete = (id: string) => {
    const next = reservations.filter((item) => item.id !== id);
    setReservations(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">스터디룸 예약</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          필요한 시간대를 선택해서 스터디룸을 예약하세요.
        </p>
      </section>

      <section className="rounded-xl border border-border p-5">
        <h2 className="mb-4 font-semibold">예약 신청</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="text-sm sm:col-span-2">
            <span className="mb-1.5 flex items-center gap-1.5 font-medium">
              <DoorOpen className="h-4 w-4" />
              방 선택
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ROOMS.map((item) => {
                const isSelectedRoom = room === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setRoom(item)}
                    className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                      isSelectedRoom
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <p className="text-sm font-medium">{item}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {isSelectedRoom ? "선택됨" : "클릭해서 선택"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="text-sm">
            <span className="mb-1.5 flex items-center gap-1.5 font-medium">
              <CalendarDays className="h-4 w-4" />
              날짜
            </span>
            <input
              type="date"
              min={getToday()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>

          <div className="text-sm sm:col-span-2">
            <span className="mb-1.5 flex items-center gap-1.5 font-medium">
              <Clock3 className="h-4 w-4" />
              시간 선택 (타임라인 드래그)
            </span>
            <div className="mb-2 rounded-md border border-input bg-muted/20 p-2">
              {TIME_SLOTS.map((hour) => {
                const selected = isHourSelected(hour);
                const occupied = occupiedStartHours.has(hour);
                const isStart = selected && hour === startHour;
                const isEnd = selected && hour === endHour - 1;

                return (
                  <div key={hour} className="grid grid-cols-[64px_1fr] items-stretch">
                    <div className="pr-2 pt-3 text-right text-xs text-muted-foreground">
                      {formatHour(hour)}
                    </div>
                    <button
                      type="button"
                      onPointerDown={() => handleSlotPointerDown(hour)}
                      onPointerEnter={() => handleSlotPointerEnter(hour)}
                      className={`mb-1 h-12 border px-3 pt-3 text-left text-sm transition-colors select-none ${
                        selected && occupied
                          ? "border-red-300 bg-red-50 text-red-700"
                          : selected
                            ? "border-primary bg-primary/15 text-foreground"
                            : occupied
                              ? "border-orange-300 bg-orange-50 text-orange-800"
                              : "border-border bg-background hover:bg-accent"
                      } ${
                        isStart && isEnd
                          ? "rounded-md"
                          : isStart
                            ? "rounded-t-md rounded-b-sm"
                            : isEnd
                              ? "rounded-b-md rounded-t-sm"
                              : selected
                                ? "rounded-sm"
                                : "rounded-md"
                      }`}
                    >
                      {formatHour(hour)} - {formatHour(hour + 1)}
                      {isStart && (
                        <span className="ml-2 inline-block rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium">
                          시작
                        </span>
                      )}
                      {isEnd && (
                        <span className="ml-2 inline-block rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium">
                          끝
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {room} 기준 타임라인입니다. 마우스로 눌러서 위/아래로 드래그해 시간 범위를 선택하세요.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              주황색은 기존 예약, 파란색은 현재 선택, 빨간색은 기존 예약과 겹치는 구간입니다.
            </p>
            {selectedRangeHasConflict && (
              <p className="mt-1 text-xs font-medium text-red-600">
                현재 선택 구간에 기존 예약이 포함되어 있습니다.
              </p>
            )}
          </div>

          <label className="text-sm">
            <span className="mb-1.5 block font-medium">예약자</span>
            <input
              type="text"
              placeholder="이름"
              value={reserver}
              onChange={(e) => setReserver(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>

          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block font-medium">사용 목적</span>
            <input
              type="text"
              placeholder="예: 알고리즘 문제풀이 스터디"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            선택 시간: {formatRange(startHour, endHour)}
          </p>
          <button
            onClick={handleReserve}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            예약하기
          </button>
        </div>

        {!user && (
          <p className="mt-3 text-xs text-muted-foreground">
            로그인하면 예약자 이름이 자동 입력됩니다.{" "}
            <Link href="/login" className="underline-offset-4 hover:underline">
              로그인하기
            </Link>
          </p>
        )}
      </section>

      <section className="rounded-xl border border-border p-5">
        <h2 className="mb-3 font-semibold">{date} 예약 현황</h2>
        {selectedDateReservations.length === 0 ? (
          <p className="text-sm text-muted-foreground">아직 예약이 없습니다.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {selectedDateReservations.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {item.room} · {formatRange(item.startHour, item.endHour)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    예약자: {item.reserver}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    목적: {item.purpose}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="예약 삭제"
                  title="예약 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
