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

  // 로딩 상태: 프리미엄 스피너와 메시지
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 animate-in fade-in duration-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-yellow-500" />
        <p className="text-lg font-medium font-outfit">Loading Study Rooms...</p>
      </div>
    );
  }

  // 에러 처리: 시각적으로 명확한 에러 피드백
  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-red-50 rounded-[2rem] border border-red-100 text-center animate-in zoom-in duration-300">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-900 mb-2">오류 발생</h2>
        <p className="text-red-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors"
        >
          다시 시도하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 상단 헤더 영역 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            스터디룸 <span className="text-yellow-500">예약</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl">
            당신의 성장을 위한 최적의 공간을 예약하세요. <br className="hidden md:block" />
            집중과 협업이 공존하는 다양한 룸이 준비되어 있습니다.
          </p>
        </div>

        {/* 내 예약 보기 링크 (요구사항) */}
        <button
          onClick={() => router.push("/reservation/my")}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95"
        >
          <Calendar className="w-5 h-5 text-yellow-400" />
          내 예약 보기
          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* 스터디룸 카드 그리드 (요구사항) */}
      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* RoomCard 내부에서 클릭 시 /reservation/{roomId} 이동 로직 포함 */}
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-[3rem] py-20 text-center border-2 border-dashed border-slate-200">
          <p className="text-xl font-bold text-slate-400">등록된 스터디룸이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
