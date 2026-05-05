"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchRooms } from "@/lib/api";
import { Room } from "@/types/reservation";
import RoomCard from "@/components/RoomCard";
import { Calendar, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function ReservationPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (err) {
        setError("스터디룸 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  // 1. 로딩 상태 처리 (요구사항)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in duration-700">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-yellow-500" />
        <p className="text-lg font-medium text-slate-500 font-outfit">최적의 공간을 찾고 있습니다...</p>
      </div>
    );
  }

  // 2. 에러 처리 (요구사항)
  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-500/5 text-center animate-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">공간을 불러올 수 없어요</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      {/* 헤더 섹션 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Available Now
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            성장을 위한<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">완벽한 공간</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            몰입을 위한 개인실부터 협업을 위한 대형룸까지, 당신의 필요에 맞는 최고의 스터디 환경을 제공합니다.
          </p>
        </div>

        {/* 내 예약 보기 링크 (요구사항) */}
        <button
          onClick={() => router.push("/reservation/my")}
          className="group relative flex items-center gap-3 px-8 py-5 bg-slate-900 text-white font-bold rounded-2xl shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0"
        >
          <Calendar className="w-5 h-5 text-yellow-400" />
          <span>내 예약 확인하기</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* 스터디룸 그리드 (요구사항) */}
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {rooms.map((room, index) => (
            <div
              key={room.id}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 스터디룸 카드 (요구사항: 이름, 위치, 수용인원, 편의시설 표시 및 클릭 이동 포함) */}
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[3rem] py-32 text-center border-2 border-dashed border-slate-200">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Loader2 className="w-10 h-10 text-slate-200" />
          </div>
          <p className="text-xl font-bold text-slate-400">현재 예약 가능한 방이 없습니다.</p>
          <p className="text-slate-400 mt-2">잠시 후 다시 확인해 주세요.</p>
        </div>
      )}
    </div>
  );
}

