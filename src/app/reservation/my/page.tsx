"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchMyReservations, cancelReservation } from "@/lib/api";
import { Reservation } from "@/types/reservation";
import { Calendar, Clock, MapPin, Trash2, History, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function MyReservationsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 비로그인 시 리다이렉트
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    loadReservations();
  }, [isLoggedIn, router]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchMyReservations();
      // 최신 날짜가 위로 오도록 정렬
      const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReservations(sorted);
    } catch (err) {
      console.error("예약 목록 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("예약을 취소하시겠습니까?")) return;
    try {
      await cancelReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
      alert("예약이 취소되었습니다.");
    } catch (err) {
      alert("예약 취소에 실패했습니다.");
    }
  };

  // 오늘 날짜 기준으로 다가오는/지난 예약 구분
  const today = new Date().toISOString().split("T")[0];
  const upcoming = reservations.filter((r) => r.date >= today);
  const past = reservations.filter((r) => r.date < today);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-yellow-500" />
        <p className="text-lg font-medium text-slate-500 font-outfit">예약 내역을 가져오고 있습니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
      {/* 상단 헤더 */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <Link 
            href="/reservation" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            나의 <span className="text-yellow-500">예약 내역</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            신청하신 스터디룸 예약 현황을 한눈에 확인하세요.
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-3xl flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900">{upcoming.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upcoming</div>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-center">
            <div className="text-2xl font-black text-slate-400">{past.length}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Past</div>
          </div>
        </div>
      </header>

      <div className="space-y-16">
        {/* 다가오는 예약 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
              <Calendar className="w-5 h-5 text-slate-900" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">다가오는 예약</h2>
          </div>

          {upcoming.length === 0 ? (
            <div className="bg-slate-50 rounded-[2.5rem] py-16 px-6 text-center border-2 border-dashed border-slate-200">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-400">다가오는 예약이 없습니다.</p>
              <Link href="/reservation" className="text-yellow-600 font-bold text-sm mt-4 inline-block hover:underline">
                지금 스터디룸 예약하기 &rarr;
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {upcoming.map((r, index) => (
                <div 
                  key={r.id} 
                  className="group bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                        <CheckCircle2 className="w-3 h-3" />
                        예약 확정
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-yellow-600 transition-colors">
                        {r.roomName || "스터디룸"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-500 font-medium text-sm">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /> {r.date}</div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {r.startTime} ~ {r.endTime}</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 text-sm border border-slate-100">
                        <span className="font-bold text-slate-400 mr-2">목적:</span>
                        {r.purpose}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="flex items-center justify-center gap-2 px-6 py-3 text-red-500 font-bold bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>예약 취소</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 지난 예약 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">지난 예약</h2>
          </div>

          {past.length === 0 ? (
            <p className="text-slate-400 font-medium text-center py-10">지난 예약 내역이 없습니다.</p>
          ) : (
            <div className="grid gap-4">
              {past.map((r) => (
                <div key={r.id} className="bg-white rounded-2xl p-6 border border-slate-100 opacity-60 hover:opacity-100 transition-opacity flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{r.roomName || "스터디룸"}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{r.date}</span>
                      <span>{r.startTime} ~ {r.endTime}</span>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-400 px-3 py-1 bg-slate-50 rounded-lg">
                    이용 완료
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}