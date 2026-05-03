"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchRooms } from "@/lib/api";
import type { Room } from "@/types/reservation";

export default function ReservationPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchRooms();
        setRooms(data);
      } catch {
        setError("스터디룸 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    void loadRooms();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa] px-4 py-10 sm:py-12">
      <div className="mx-auto w-full max-w-[960px]">
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gradient-to-r from-blue-50/60 to-white px-6 py-6 sm:px-8">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                스터디룸 예약
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                원하는 스터디룸을 선택해 예약을 진행하세요.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/reservation/my")}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
              >
                내 예약 보기
              </button>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {loading ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                로딩 중...
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
                {error}
              </div>
            ) : rooms.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-600">
                현재 이용 가능한 스터디룸이 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => router.push(`/reservation/${room.id}`)}
                    className="group text-left rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition">
                          {room.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                          {room.location} · {room.capacity}명
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        선택
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-700 line-clamp-3">
                      {room.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {room.amenities?.length ? (
                        room.amenities.map((amenity) => (
                          <span
                            key={`${room.id}-${amenity}`}
                            className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">
                          편의시설 정보 없음
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

