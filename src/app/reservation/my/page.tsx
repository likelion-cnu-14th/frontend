"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cancelReservation, fetchMyReservations } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import type { Reservation } from "@/types/reservation";

function todayISODate() {
  const now = new Date();
  const kstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = kstDate.toISOString().split("T")[0];
  return today;
}

export default function MyReservationsPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => todayISODate(), []);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const load = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        const data = await fetchMyReservations();
        setReservations(data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [isLoggedIn]);

  const upcoming = useMemo(
    () => reservations.filter((r) => r.date >= today),
    [reservations, today]
  );
  const past = useMemo(
    () => reservations.filter((r) => r.date < today),
    [reservations, today]
  );

  const handleCancel = async (reservationId: string) => {
    const ok = confirm("예약을 취소하시겠습니까?");
    if (!ok) return;

    try {
      await cancelReservation(reservationId);
      setReservations((prev) => prev.filter((r) => r.id !== reservationId));
    } catch {
      alert("예약 취소에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[960px]">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 to-white px-6 py-6 sm:px-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                내 예약
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                다가오는 예약과 지난 예약을 확인할 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/reservation")}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              예약 목록으로
            </button>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                로딩 중...
              </div>
            ) : (
              <div className="space-y-8">
                <section>
                  <h2 className="text-base font-bold text-gray-900">
                    다가오는 예약
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {today} 이후 예약입니다.
                  </p>

                  <div className="mt-4 space-y-3">
                    {upcoming.length === 0 ? (
                      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
                        다가오는 예약이 없습니다.
                      </div>
                    ) : (
                      upcoming.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-bold text-gray-900">
                                {r.roomName ?? "스터디룸"}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600">
                                {r.date} · {r.startTime} ~ {r.endTime}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCancel(r.id)}
                              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              취소
                            </button>
                          </div>
                          <p className="mt-3 text-sm text-gray-700">
                            목적: {r.purpose}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-base font-bold text-gray-900">
                    지난 예약
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {today} 이전 예약입니다.
                  </p>

                  <div className="mt-4 space-y-3">
                    {past.length === 0 ? (
                      <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
                        지난 예약이 없습니다.
                      </div>
                    ) : (
                      past.map((r) => (
                        <div
                          key={r.id}
                          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm opacity-60"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <h3 className="text-base font-bold text-gray-900">
                                {r.roomName ?? "스터디룸"}
                              </h3>
                              <p className="mt-1 text-sm text-gray-600">
                                {r.date} · {r.startTime} ~ {r.endTime}
                              </p>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-700">
                            목적: {r.purpose}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

