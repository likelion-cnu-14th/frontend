"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { fetchRoom, fetchRoomReservations, createReservation } from "@/lib/api";
import { Room, Reservation } from "@/types/reservation";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { ChevronLeft, MapPin, Users, Info, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomDetailPage({ params }: PageProps) {
  const { roomId } = use(params);
  const router = useRouter();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [bookedSlots, setBookedSlots] = useState<{ start: string; end: string }[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [roomData, reservations] = await Promise.all([
          fetchRoom(roomId),
          fetchRoomReservations(roomId, selectedDate),
        ]);
        setRoom(roomData);
        setBookedSlots(reservations.map(r => ({ start: r.startTime, end: r.endTime })));
      } catch (error) {
        console.error("Failed to load room details:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [roomId, selectedDate]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime || !purpose) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        roomId,
        date: selectedDate,
        startTime,
        endTime,
        purpose,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/reservation/my");
      }, 2000);
    } catch (error) {
      console.error("Reservation failed:", error);
      alert("예약에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-medium">룸 정보를 불러오고 있습니다...</p>
      </div>
    );
  }

  if (!room) return <div className="p-12 text-center">방을 찾을 수 없습니다.</div>;

  if (success) {
    return (
      <div className="max-w-md mx-auto py-24 px-6 text-center animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">예약 완료!</h2>
        <p className="text-slate-600 mb-8">
          예약이 정상적으로 접수되었습니다.<br />
          잠시 후 내 예약 목록으로 이동합니다.
        </p>
        <Link 
          href="/reservation/my"
          className="inline-block w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
        >
          내 예약 확인하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link 
        href="/reservation"
        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
        목록으로 돌아가기
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: Info */}
        <div className="lg:col-span-3 space-y-8">
          <header>
            <div className="flex items-center gap-2 text-yellow-600 mb-3">
              <span className="px-2 py-1 bg-yellow-100 rounded text-[10px] font-black uppercase tracking-widest">Available Now</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {room.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-slate-500">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                <span className="font-medium">{room.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-slate-400" />
                <span className="font-medium">최대 {room.capacity}명</span>
              </div>
            </div>
          </header>

          <div className="aspect-video relative rounded-3xl bg-slate-100 overflow-hidden border border-black/5">
             <div className="w-full h-full flex items-center justify-center text-slate-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M13 13h4"/><path d="M13 17h4"/><path d="M7 13h2v4H7z"/></svg>
             </div>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
              <Info className="w-6 h-6 mr-2 text-yellow-500" />
              공간 설명
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {room.description}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">편의 시설</h2>
            <div className="flex flex-wrap gap-3">
              {room.amenities.map((item) => (
                <div 
                  key={item}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Sticky Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-xl sticky top-24">
            <h2 className="text-2xl font-black text-slate-900 mb-8">예약하기</h2>
            
            <form onSubmit={handleReserve} className="space-y-8">
              <TimeSlotPicker 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                startTime={startTime}
                endTime={endTime}
                onTimeChange={(s, e) => {
                  setStartTime(s);
                  setEndTime(e);
                }}
                bookedSlots={bookedSlots}
              />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  예약 목적
                </label>
                <textarea
                  required
                  placeholder="예: 프로젝트 팀 회의, 코딩 테스트 준비 등"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all resize-none h-24"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !startTime || !endTime}
                className="w-full py-5 bg-yellow-400 text-slate-900 font-black rounded-2xl shadow-lg shadow-yellow-400/20 hover:bg-yellow-500 hover:shadow-yellow-400/40 active:scale-[0.98] transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none disabled:active:scale-100"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    예약 처리 중...
                  </span>
                ) : (
                  "예약 완료하기"
                )}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 uppercase tracking-tighter font-bold">
                예약 완료 시 내 예약 목록에서 확인하실 수 있습니다
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
