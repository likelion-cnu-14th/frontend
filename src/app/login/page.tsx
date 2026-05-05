"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { 
  LogIn, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  LayoutDashboard
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || loading) return;

    setLoading(true);
    setError(null);

    try {
      // 1. 로그인 API 호출
      const response = await login({ email, password });
      
      // 2. 성공 시 스토어에 저장
      setAuth(response.access_token, response.user);
      
      // 3. 커뮤니티 페이지로 이동
      router.push("/community");
    } catch (err: any) {
      // 4. 실패 시 에러 메시지 표시
      const serverError = err.response?.data?.detail?.error || "이메일 또는 비밀번호가 올바르지 않습니다.";
      setError(serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      {/* 로고 섹션 */}
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-400/20 group-hover:rotate-6 transition-transform">
          <LayoutDashboard className="w-7 h-7 text-slate-900" />
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tighter">
          STUDY<span className="text-yellow-500">ROOM</span>
        </span>
      </Link>

      <div className="w-full max-w-[480px] bg-white rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-2xl shadow-black/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-100 mb-4">
            <LogIn className="w-3 h-3" />
            Welcome Back
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">로그인</h1>
          <p className="text-slate-500 font-medium mt-2">오늘도 지식과 함께 성장해 보세요.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold animate-in shake duration-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이메일 필드 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
              <Mail className="w-4 h-4" />
              이메일 주소
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
              required
            />
          </div>

          {/* 비밀번호 필드 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Lock className="w-4 h-4" />
                비밀번호
              </label>
              <button type="button" className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors">
                비밀번호를 잊으셨나요?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all font-bold"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!email || !password || loading}
            className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                로그인 중...
              </>
            ) : (
              <>
                로그인하기
                <ArrowRight className="w-6 h-6 text-yellow-400" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 font-bold text-sm">
            계정이 없으신가요?{" "}
            <Link 
              href="/signup" 
              className="text-yellow-600 hover:text-yellow-700 underline underline-offset-4 decoration-2 decoration-yellow-600/20"
            >
              회원가입하기
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-12 text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
        © 2026 StudyRoom Reservation System
      </p>
    </div>
  );
}
