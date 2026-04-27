"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { fetchMyReservations, cancelReservation } from "@/lib/api";
import type { Reservation } from "@/types/reservation";

export default function MyReservationsPage() {
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const data = await fetchMyReservations();
      setReservations(data);
    } catch (err) {
      alert("예약 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    loadReservations();
  }, [isLoggedIn]);

  const handleCancel = async (id: string) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;

    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("예약 취소에 실패했습니다.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const upcoming = reservations.filter((r) => r.date >= today);
  const past = reservations.filter((r) => r.date < today);

  if (loading) {
    return <div className="max-w-2xl mx-auto p-4">로딩 중...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">내 예약</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">다가오는 예약</h2>

        {upcoming.length === 0 ? (
          <p className="text-gray-500 text-sm">예약이 없습니다.</p>
        ) : (
          upcoming.map((r) => (
            <div key={r.id} className="border rounded-lg p-4 mb-3">
              <div className="flex justify-between items-start gap-4">
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