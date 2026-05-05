"use client";

import { useEffect, useState } from "react";
import { fetchRooms } from "@/lib/api";
import { Room } from "@/types/reservation";
import RoomCard from "@/components/RoomCard";
import { Search, Loader2 } from "lucide-react";

export default function ReservationListPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    loadRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
          스터디룸 <span className="text-yellow-500">예약</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          집중이 필요한 순간, 당신을 위한 최적의 공간을 예약하세요. 
          회의, 스터디, 개인 작업 등 목적에 맞는 다양한 룸이 준비되어 있습니다.
        </p>
      </header>

      {/* Search & Filters */}
      <div className="relative mb-10 group">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-yellow-500 transition-colors">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="룸 이름이나 위치로 검색해보세요"
          className="w-full pl-14 pr-6 py-5 bg-white border border-black/5 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-medium">공간을 불러오는 중입니다...</p>
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => (
            <div key={room.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 rounded-3xl py-20 text-center border-2 border-dashed border-slate-200">
          <p className="text-xl font-bold text-slate-400">검색 결과가 없습니다.</p>
          <button 
            onClick={() => setSearchTerm("")}
            className="mt-4 text-yellow-600 font-bold hover:underline"
          >
            검색어 초기화
          </button>
        </div>
      )}
    </div>
  );
}
