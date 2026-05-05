"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchRoom, fetchRoomReservations, createReservation } from "@/lib/api";
import { Room, Reservation } from "@/types/reservation";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Loader2, AlertCircle, Clock, MapPin, Users, Info } from "lucide-react";
import Link from "next/link";

// 09:00 ~ 21:00 시간대 생성 (22:00은 종료 시간으로만 사용)
const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 9;
  return `${hour.toString().padStart(2, "0")}:00`;
});

export default function ReservationDetailPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 예약 폼 상태
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 스터디룸 정보 로드
  useEffect(() => {
    const loadRoomInfo = async () => {
      try {
        const data = await fetchRoom(roomId);
        setRoom(data);
      } catch (err) {
        setError("스터디룸 정보를 불러오는데 실패했습니다.");
      }
    };
    loadRoomInfo();
  }, [roomId]);

  // 날짜가 바뀔 때마다 예약 현황 다시 조회
  useEffect(() => {
    const loadReservations = async () => {
      try {
        setLoading(true);
        const data = await fetchRoomReservations(roomId, selectedDate);
        setReservations(data);
      } catch (err) {
        console.error("예약 현황 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    if (roomId && selectedDate) {
      loadReservations();
    }
    // 날짜가 바뀌면 선택 초기화
    setSelectedStart(null);
    setSelectedEnd(null);
  }, [selectedDate, roomId]);

  // 특정 시간이 예약되어 있는지 확인
  const getReservationForSlot = (time: string) => {
    return reservations.find((r) => r.startTime <= time && r.endTime > time);
  };

  // 시간 슬롯 클릭 핸들러
  const handleSlotClick = (time: string) => {
    // 이미 예약된 시간이면 무시
    if (getReservationForSlot(time)) return;
    // 비로그인이면 무시
    if (!isLoggedIn) {
      alert("로그인 후 예약할 수 있습니다.");
      return;
    }

    if (!selectedStart || (selectedStart && selectedEnd)) {
      // 첫 클릭 또는 리셋: 시작 시간 설정
      setSelectedStart(time);
      // 종료 시간은 시작 시간 + 1시간
      const nextHour = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
      setSelectedEnd(nextHour);
    } else {
      // 두 번째 클릭: 종료 시간 설정
      const endTime = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
      if (endTime > selectedStart) {
        // 중간에 예약된 시간이 있는지 검증
        let hasConflict = false;
        let currentHour = parseInt(selectedStart);
        const endHour = parseInt(time);
        
        while (currentHour <= endHour) {
          const slotTime = `${currentHour.toString().padStart(2, "0")}:00`;
          if (getReservationForSlot(slotTime)) {
            hasConflict = true;
            break;
          }
          currentHour++;
        }
        
        if (hasConflict) {
          alert("선택한 시간 사이에 이미 예약된 일정이 있습니다.");
          setSelectedStart(null);
          setSelectedEnd(null);
        } else {
          setSelectedEnd(endTime);
        }
      } else {
        // 시작 시간보다 앞선 시간을 클릭하면 새로운 시작 시간으로 설정
        setSelectedStart(time);
        const nextHour = `${(parseInt(time) + 1).toString().padStart(2, "0")}:00`;
        setSelectedEnd(nextHour);
      }
    }
  };

  // 예약 제출 핸들러
  const handleReserve = async () => {
    if (!selectedStart || !selectedEnd || !purpose.trim()) {
      alert("시간과 예약 목적을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        roomId: roomId,
        date: selectedDate,
        startTime: selectedStart,
        endTime: selectedEnd,
        purpose: purpose,
      });
      alert("예약이 완료되었습니다!");
      // 예약 현황 새로고침
      const updated = await fetchRoomReservations(roomId, selectedDate);
      setReservations(updated);
      // 선택 초기화
      setSelectedStart(null);
      setSelectedEnd(null);
      setPurpose("");
    } catch (err: any) {
      const message = err.response?.data?.detail?.error || "예약에 실패했습니다.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-md mx-auto my-20 p-10 bg-white rounded-[2.5rem] border border-red-100 shadow-xl shadow-red-500/5 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">오류 발생</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
          뒤로 가기
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:py-16">
      {/* 룸 정보 헤더 */}
      <div className="mb-10 bg-white rounded-[2.5rem] p-8 md:p-10 border border-black/5 shadow-xl shadow-black/5 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300">
          <Info className="w-16 h-16 opacity-50" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold uppercase tracking-widest border border-yellow-100">
            {room.capacity}인용
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            {room.name}
          </h1>
          <div className="flex flex-col gap-2 text-slate-600 font-medium">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {room.location}</div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4" /> 최대 {room.capacity}인 수용</div>
          </div>
          <p className="text-slate-500 leading-relaxed pt-2">
            {room.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {room.amenities.map((a) => (
              <span key={a} className="px-3 py-1.5 bg-slate-50 text-xs font-bold text-slate-500 rounded-xl border border-slate-100 uppercase">
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽: 시간표 영역 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 shadow-lg shadow-black/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-500" />
                예약 현황
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
              </div>
            ) : (
              <div className="space-y-2">
                {TIME_SLOTS.map((time) => {
                  const reservation = getReservationForSlot(time);
                  const isSelected =
                    selectedStart &&
                    selectedEnd &&
                    time >= selectedStart &&
                    time < selectedEnd;

                  return (
                    <div
                      key={time}
                      onClick={() => handleSlotClick(time)}
                      className={`flex items-center p-4 rounded-2xl transition-all border ${
                        reservation
                          ? "bg-slate-100 border-slate-100 cursor-not-allowed opacity-70"
                          : isSelected
                          ? "bg-yellow-50 border-yellow-200 cursor-pointer shadow-sm"
                          : "hover:bg-slate-50 border-transparent hover:border-slate-200 cursor-pointer"
                      }`}
                    >
                      <span className={`w-20 font-outfit font-bold ${isSelected ? 'text-yellow-600' : 'text-slate-500'}`}>
                        {time}
                      </span>
                      <div className="flex-1">
                        {reservation ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            <span className="text-sm font-medium text-slate-600">
                              {reservation.purpose} <span className="text-slate-400">({reservation.username})</span>
                            </span>
                          </div>
                        ) : isSelected ? (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-yellow-600">
                              선택됨
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-300">비어있음</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽: 예약 폼 영역 */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 rounded-[2rem] p-6 md:p-8 shadow-2xl shadow-slate-900/20 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6">예약하기</h2>
            
            {!isLoggedIn ? (
              <div className="text-center py-10">
                <p className="text-slate-400 mb-4">예약을 위해 로그인이 필요합니다.</p>
                <Link href="/login" className="inline-block w-full py-3 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors">
                  로그인하기
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">선택된 시간</div>
                  {selectedStart && selectedEnd ? (
                    <div className="text-lg font-outfit font-bold text-white">
                      {selectedStart} - {selectedEnd}
                    </div>
                  ) : (
                    <div className="text-slate-500 text-sm">왼쪽 시간표에서 원하는 시간을 클릭하세요.</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">예약 목적</label>
                  <input
                    type="text"
                    placeholder="예: 프론트엔드 스터디"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
                  />
                </div>

                <button
                  onClick={handleReserve}
                  disabled={!selectedStart || !selectedEnd || !purpose.trim() || submitting}
                  className="w-full py-4 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50 disabled:hover:bg-yellow-500 mt-4 shadow-lg shadow-yellow-500/20"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" /> 처리중...
                    </span>
                  ) : (
                    "예약 완료하기"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}