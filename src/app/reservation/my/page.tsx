"use client";

import { useEffect, useState } from "react";
import { fetchMyReservations, cancelReservation } from "@/lib/api";
import { Reservation } from "@/types/reservation";
import ReservationItem from "@/components/ReservationItem";
import { CalendarDays, Loader2, Plus } from "lucide-react";
import Link from "next/link";

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    try {
      const data = await fetchMyReservations();
      // 최신 예약이 위로 오도록 정렬
      const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReservations(sorted);
    } catch (error) {
      console.error("Failed to fetch my reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("정말 예약을 취소하시겠습니까?")) return;

    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      alert("예약이 취소되었습니다.");
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      alert("취소에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            내 <span className="text-yellow-500">예약</span> 내역
          </h1>
          <p className="text-slate-500 font-medium">
            신청하신 스터디룸 예약 현황을 확인하고 관리하세요.
          </p>
        </div>
        <Link 
          href="/reservation"
          className="hidden md:flex items-center gap-2 px-6 py-3 bg-yellow-400 text-slate-900 font-bold rounded-2xl shadow-sm hover:bg-yellow-500 transition-all"
        >
          <Plus className="w-5 h-5" />
          새 예약하기
        </Link>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">예약 목록을 불러오고 있습니다...</p>
        </div>
      ) : reservations.length > 0 ? (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <ReservationItem 
                reservation={reservation} 
                onCancel={handleCancel} 
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[2.5rem] py-24 px-6 text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">예약 내역이 없습니다</h3>
          <p className="text-slate-500 mb-10 max-w-xs mx-auto">
            아직 예약하신 스터디룸이 없네요.<br />
            지금 바로 공간을 찾아보세요!
          </p>
          <Link 
            href="/reservation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-slate-900 font-black rounded-2xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 hover:shadow-yellow-400/30 transition-all active:scale-[0.98]"
          >
            스터디룸 둘러보기
          </Link>
        </div>
      )}

      {/* Mobile Floating Button */}
      <Link 
        href="/reservation"
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-yellow-400 text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:bg-yellow-500 active:scale-90 transition-all z-50"
      >
        <Plus className="w-8 h-8" />
      </Link>
    </div>
  );
}
