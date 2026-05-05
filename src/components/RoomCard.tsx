"use client";

import Image from "next/image";
import Link from "next/link";
import { Room } from "@/types/reservation";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/reservation/${room.id}`} className="group block h-full">
      <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-black/5">
        {/* Placeholder Image or Generate one */}
        <div className="aspect-[4/3] relative bg-slate-100 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 border border-black/5 shadow-sm">
            최대 {room.capacity}인
          </div>
          <div className="w-full h-full flex items-center justify-center text-slate-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"/><path d="M13 13h4"/><path d="M13 17h4"/><path d="M7 13h2v4H7z"/></svg>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-yellow-600 transition-colors">
              {room.name}
            </h3>
          </div>
          
          <div className="flex items-center text-sm text-slate-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {room.location}
          </div>
          
          <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1">
            {room.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span 
                key={amenity}
                className="px-2.5 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100 uppercase tracking-wider"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="px-2.5 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg border border-slate-100 uppercase tracking-wider">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
