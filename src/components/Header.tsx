"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Calendar, MessageSquare, PlusSquare } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "커뮤니티", href: "/community", icon: MessageSquare },
    { name: "글쓰기", href: "/community/write", icon: PlusSquare },
    { name: "스터디룸", href: "/reservation", icon: Users },
    { name: "내 예약", href: "/reservation/my", icon: Calendar },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-xl border-b border-black/5 z-[1000] px-6 flex items-center justify-between">
      <Link 
        href="/" 
        className="flex items-center gap-2 group"
      >
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20 group-hover:rotate-6 transition-transform">
          <LayoutDashboard className="w-6 h-6 text-slate-900" />
        </div>
        <span className="text-xl font-black text-slate-900 tracking-tighter">
          STUDY<span className="text-yellow-500">ROOM</span>
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          // 현재 경로가 메뉴 항목의 경로와 완전히 일치하거나, 
          // 하위 경로이면서 더 구체적인 매칭 항목이 없을 때 활성화합니다.
          const isActive = pathname === item.href || (
            item.href !== "/" && 
            pathname.startsWith(item.href + "/") && 
            !navItems.some(other => other.href !== item.href && other.href.startsWith(item.href) && pathname.startsWith(other.href))
          );
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all",
                isActive 
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-yellow-400" : "text-slate-400")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Icon (Placeholder for simplicity) */}
      <div className="md:hidden w-10 h-10 flex items-center justify-center text-slate-900">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </div>
    </header>
  );
}
