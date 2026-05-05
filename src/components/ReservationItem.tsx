"use client";

import { Reservation } from "@/types/reservation";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";

interface ReservationItemProps {
  reservation: Reservation;
  onCancel?: (id: string) => void;
}

export default function ReservationItem({ reservation, onCancel }: ReservationItemProps) {
  // 날짜 포맷팅
  const dateObj = new Date(reservation.date);
  const formattedDate = dateObj.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="bg-white rounded-3xl p-6 border border-black/5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {reservation.roomName || "스터디룸"}
            </h3>
            <div className="flex items-center text-sm text-slate-500">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              예약번호: {reservation.id.slice(0, 8)}
            </div>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-6">
            <div className="flex items-center text-slate-700">
              <Calendar className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-sm font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center text-slate-700">
              <Clock className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-sm font-medium">
                {reservation.startTime} ~ {reservation.endTime}
              </span>
            </div>
          </div>
          
          <div className="pt-2">
            <div className="inline-flex items-center px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600 border border-slate-200">
              목적: {reservation.purpose}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onCancel && (
            <button
              onClick={() => onCancel(reservation.id)}
              className="flex items-center justify-center w-12 h-12 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
              title="예약 취소"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
