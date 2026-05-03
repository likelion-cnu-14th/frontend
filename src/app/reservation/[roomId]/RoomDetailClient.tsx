"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createReservation,
  fetchRoom,
  fetchRoomReservations,
} from "@/lib/api";
import type { Reservation, Room } from "@/types/reservation";
import { useAuth } from "@/hooks/useAuth";

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function addOneHour(time: string) {
  const [h] = time.split(":").map(Number);
  return formatHour(h + 1);
}

function kstTodayString() {
  const today = new Date();
  const kstOffset = 9 * 60;
  const kstDate = new Date(today.getTime() + kstOffset * 60 * 1000);
  return kstDate.toISOString().split("T")[0];
}

export default function RoomDetailClient({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const todayStr = useMemo(() => kstTodayString(), []);

  const [room, setRoom] = useState<Room | null>(null);
  const [date, setDate] = useState(todayStr);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const slots = useMemo(() => {
    const hours = Array.from({ length: 13 }, (_, i) => 9 + i); // 09:00 ~ 21:00
    return hours.map((hour) => formatHour(hour));
  }, []);

  const reservedByStartTime = useMemo(() => {
    const map = new Map<string, Reservation>();
    for (const r of reservations) {
      map.set(r.startTime, r);
    }
    return map;
  }, [reservations]);

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRoom(roomId);
        setRoom(data);
      } catch {
        setError("스터디룸 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void loadRoom();
  }, [roomId]);

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRoomReservations(roomId, date);
        setReservations(data);
      } catch {
        setError("예약 현황을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void loadReservations();
  }, [roomId, date]);

  const startHour = selectedStart ? Number(selectedStart.split(":")[0]) : null;
  const endHour = selectedEnd ? Number(selectedEnd.split(":")[0]) : null;

  const isSelectedSlot = (slot: string) => {
    if (!selectedStart || !selectedEnd) return false;
    const hour = Number(slot.split(":")[0]);
    if (startHour === null || endHour === null) return false;
    return hour >= startHour && hour < endHour;
  };

  const handleDateChange = (value: string) => {
    setDate(value < todayStr ? todayStr : value);
    setSelectedStart(null);
    setSelectedEnd(null);
  };

  const handleSlotClick = (slot: string) => {
    if (!isLoggedIn) return;
    if (reservedByStartTime.has(slot)) return;

    if (!selectedStart) {
      setSelectedStart(slot);
      setSelectedEnd(addOneHour(slot));
      return;
    }

    if (slot === selectedStart) {
      setSelectedStart(null);
      setSelectedEnd(null);
      return;
    }

    const clickedHour = Number(slot.split(":")[0]);
    const currentStartHour = Number(selectedStart.split(":")[0]);

    if (clickedHour > currentStartHour) {
      setSelectedEnd(addOneHour(slot));
    }
  };

  const canSubmit =
    isLoggedIn &&
    !!selectedStart &&
    !!selectedEnd &&
    purpose.trim().length > 0 &&
    !submitting;

  const refreshReservations = async () => {
    const data = await fetchRoomReservations(roomId, date);
    setReservations(data);
  };

  const handleSubmit = async () => {
    if (!selectedStart || !selectedEnd) return;
    if (!purpose.trim()) return;

    try {
      setSubmitting(true);

      await createReservation({
        roomId,
        date,
        startTime: selectedStart,
        endTime: selectedEnd,
        purpose: purpose.trim(),
      });

      alert("예약이 완료되었습니다.");
      await refreshReservations();
      setSelectedStart(null);
      setSelectedEnd(null);
      setPurpose("");
    } catch (err: unknown) {
      const message =
        (err as any)?.response?.data?.detail?.error ?? "예약에 실패했습니다.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[960px]">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 to-white px-6 py-6 sm:px-8">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => router.push("/reservation")}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                ← 목록으로
              </button>

              <h1 className="mt-3 truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {room?.name ?? "스터디룸"}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {room ? `${room.location} · ${room.capacity}명` : ""}
              </p>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                로딩 중...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
                {error}
              </div>
            ) : (
              <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        날짜 선택
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        날짜를 바꾸면 예약 현황이 다시 조회됩니다.
                      </p>
                    </div>
                    <input
                      type="date"
                      value={date}
                      min={todayStr}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        시간표
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        09:00 ~ 21:00 (1시간 단위)
                      </p>
                    </div>
                    {!isLoggedIn ? (
                      <span className="text-sm font-semibold text-gray-600">
                        로그인 후 선택 가능
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
                    <div className="flex-1 space-y-2">
                      {slots.slice(0, 7).map((slot) => {
                        const reserved = reservedByStartTime.get(slot);
                        const selected = isSelectedSlot(slot);

                        if (reserved) {
                          return (
                            <div
                              key={slot}
                              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-700"
                            >
                              <span className="font-semibold">{slot}</span>
                              <span className="min-w-0 truncate text-gray-600">
                                {reserved.purpose} ({reserved.username})
                              </span>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!isLoggedIn}
                            onClick={() => handleSlotClick(slot)}
                            className={[
                              "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                              selected
                                ? "border-blue-200 bg-blue-600 text-white"
                                : "border-gray-200 bg-white text-gray-900 hover:bg-blue-50 disabled:hover:bg-white disabled:opacity-60",
                            ].join(" ")}
                          >
                            <span className="font-semibold">{slot}</span>
                            <span
                              className={[
                                "min-w-0 truncate font-semibold",
                                selected ? "text-white" : "text-gray-600",
                              ].join(" ")}
                            >
                              {selected ? "선택됨" : "비어있음"}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex-1 space-y-2">
                      {slots.slice(7).map((slot) => {
                        const reserved = reservedByStartTime.get(slot);
                        const selected = isSelectedSlot(slot);

                        if (reserved) {
                          return (
                            <div
                              key={slot}
                              className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-700"
                            >
                              <span className="font-semibold">{slot}</span>
                              <span className="min-w-0 truncate text-gray-600">
                                {reserved.purpose} ({reserved.username})
                              </span>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!isLoggedIn}
                            onClick={() => handleSlotClick(slot)}
                            className={[
                              "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                              selected
                                ? "border-blue-200 bg-blue-600 text-white"
                                : "border-gray-200 bg-white text-gray-900 hover:bg-blue-50 disabled:hover:bg-white disabled:opacity-60",
                            ].join(" ")}
                          >
                            <span className="font-semibold">{slot}</span>
                            <span
                              className={[
                                "min-w-0 truncate font-semibold",
                                selected ? "text-white" : "text-gray-600",
                              ].join(" ")}
                            >
                              {selected ? "선택됨" : "비어있음"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                {isLoggedIn ? (
                  <section className="rounded-2xl border border-gray-200 bg-white p-5">
                    <h2 className="text-base font-bold text-gray-900">
                      예약하기
                    </h2>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <p className="text-xs font-semibold text-gray-500">
                          선택 시간
                        </p>
                        <p className="mt-1 text-sm font-bold text-gray-900">
                          {selectedStart && selectedEnd
                            ? `${selectedStart} ~ ${selectedEnd}`
                            : "시간을 선택해주세요"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <input
                          value={purpose}
                          onChange={(e) => setPurpose(e.target.value)}
                          placeholder="예약 목적을 입력하세요"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!canSubmit}
                          className="shrink-0 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                        >
                          {submitting ? "예약 중..." : "예약하기"}
                        </button>
                      </div>
                    </div>
                  </section>
                ) : (
                  <section className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
                    <p className="text-sm font-semibold text-gray-700">
                      로그인 후 예약할 수 있습니다.
                    </p>
                    <Link
                      href="/login"
                      className="mt-3 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                    >
                      로그인 하러가기
                    </Link>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

