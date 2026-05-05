"use client";

import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimeSlot {
  time: string;
  isBooked: boolean;
}

interface TimeSlotPickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  startTime: string;
  endTime: string;
  onTimeChange: (start: string, end: string) => void;
  bookedSlots?: { start: string; end: string }[];
}

export default function TimeSlotPicker({
  selectedDate,
  onDateChange,
  startTime,
  endTime,
  onTimeChange,
  bookedSlots = [],
}: TimeSlotPickerProps) {
  // 09:00 ~ 22:00, 1시간 단위
  const slots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 9;
    const time = `${hour.toString().padStart(2, "0")}:00`;
    const isBooked = bookedSlots.some(
      (slot) => time >= slot.start && time < slot.end
    );
    return { time, isBooked };
  });

  const handleSlotClick = (time: string, isBooked: boolean) => {
    if (isBooked) return;

    if (!startTime || (startTime && endTime)) {
      onTimeChange(time, "");
    } else {
      // 시작 시간보다 이전 시간을 클릭하면 시작 시간 변경
      if (time < startTime) {
        onTimeChange(time, "");
      } else {
        // 종료 시간 설정 (시작 시간부터 클릭한 시간까지)
        // 실제로는 종료 시간은 클릭한 시간 + 1시간 등으로 처리할 수 있음
        // 여기서는 간단히 클릭한 시간을 종료 시간으로 설정
        const endHour = parseInt(time.split(":")[0]) + 1;
        const endStr = `${endHour.toString().padStart(2, "0")}:00`;
        onTimeChange(startTime, endStr);
      }
    }
  };

  const isSelected = (time: string) => {
    if (!startTime) return false;
    if (!endTime) return time === startTime;
    return time >= startTime && time < endTime;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
          날짜 선택
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
          시간 선택 (최소 1시간)
        </label>
        <div className="grid grid-cols-4 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.time}
              onClick={() => handleSlotClick(slot.time, slot.isBooked)}
              disabled={slot.isBooked}
              className={cn(
                "py-3 rounded-xl text-sm font-semibold transition-all border",
                slot.isBooked
                  ? "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed"
                  : isSelected(slot.time)
                  ? "bg-yellow-400 text-slate-900 border-yellow-400 shadow-md scale-105 z-10"
                  : "bg-white text-slate-600 border-slate-200 hover:border-yellow-400 hover:bg-yellow-50"
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
      
      {(startTime && endTime) && (
        <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center text-yellow-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span className="font-bold">{startTime} ~ {endTime}</span>
          </div>
          <span className="text-xs font-bold text-yellow-600 uppercase">선택됨</span>
        </div>
      )}
    </div>
  );
}
