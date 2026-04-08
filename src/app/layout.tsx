'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/Header';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 앱이 켜질 때 로컬스토리지에서 로그인 정보를 가져옵니다.
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize(); 
  }, [initialize]);

  return (
    <html lang="ko">
      <body>
        {/* 이 부분에 Header가 들어가야 화면 맨 위에 나타납니다! */}
        <Header />
        <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}