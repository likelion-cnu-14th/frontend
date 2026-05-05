"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, MessageSquare, ArrowRight, Calendar } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-yellow-400/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-yellow-400/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Study Room & Community
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            LEARN.<br />
            CONNECT.<br />
            <span className="text-yellow-500 underline decoration-yellow-400/30 underline-offset-8">GROW.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            최고의 학습 환경과 커뮤니티가 여러분을 기다립니다.<br />
            스터디룸 예약부터 정보 공유까지 한곳에서 해결하세요.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in zoom-in duration-1000 delay-500">
          <Link
            href="/reservation"
            className="group w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white font-black rounded-[2rem] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Users className="w-6 h-6 text-yellow-400" />
            스터디룸 예약하기
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/community"
            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white text-slate-900 font-black rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95"
          >
            <MessageSquare className="w-6 h-6 text-slate-400" />
            커뮤니티 입장
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 animate-in fade-in duration-1000 delay-700">
          {[
            { label: "활발한 커뮤니티", icon: MessageSquare },
            { label: "스마트 예약", icon: Calendar },
            { label: "쾌적한 공간", icon: LayoutDashboard },
            { label: "성장하는 모임", icon: Users },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}