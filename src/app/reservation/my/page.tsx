"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { cancelReservation, fetchMyReservations } from "@/lib/api";
import { Reservation } from "@/types/reservation";

export default function MyReservationsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReservations = async () => {
    try {
      const data = await fetchMyReservations();
      setReservations(data);
      setError("");
    } catch {
      setError("예약 목록을 불러오지 못했습니다.");
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
  }, [isLoggedIn, router]);

  const handleCancel = async (id: string) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((reservation) => reservation.id !== id));
    } catch {
      alert("예약 취소에 실패했습니다.");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const { upcoming, past } = useMemo(() => {
    const upcomingReservations = reservations.filter((reservation) => {
      return reservation.date >= today;
    });
    const pastReservations = reservations.filter((reservation) => {
      return reservation.date < today;
    });

    return {
      upcoming: upcomingReservations,
      past: pastReservations,
    };
  }, [reservations, today]);

  if (loading) return <div className="mx-auto max-w-2xl p-4">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-2xl p-4">
      <button
        onClick={() => router.push("/reservation")}
        className="mb-4 rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
      >
        ← 목록으로
      </button>
      <h1 className="mb-6 text-2xl font-bold">내 예약</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {reservations.length === 0 ? (
        <p className="text-sm text-gray-500">예약 내역이 없습니다.</p>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">다가오는 예약</h2>
            {upcoming.length === 0 ? (
              <p className="text-sm text-gray-500">예약이 없습니다.</p>
            ) : (
              upcoming.map((reservation) => (
                <div key={reservation.id} className="mb-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {reservation.roomName ?? "스터디룸"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {reservation.date} {reservation.startTime} ~{" "}
                        {reservation.endTime}
                      </p>
                      <p className="mt-1 text-sm">{reservation.purpose}</p>
                    </div>
                    <button
                      onClick={() => handleCancel(reservation.id)}
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
            <h2 className="mb-3 text-lg font-semibold">지난 예약</h2>
            {past.length === 0 ? (
              <p className="text-sm text-gray-500">지난 예약이 없습니다.</p>
            ) : (
              past.map((reservation) => (
                <div
                  key={reservation.id}
                  className="mb-3 rounded-lg border p-4 opacity-60"
                >
                  <p className="font-semibold">{reservation.roomName ?? "스터디룸"}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.date} {reservation.startTime} ~ {reservation.endTime}
                  </p>
                  <p className="mt-1 text-sm">{reservation.purpose}</p>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
