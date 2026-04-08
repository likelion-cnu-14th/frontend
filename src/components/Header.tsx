'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();

  return (
    <header style={{ padding: '1rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Link href="/community" style={{ fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none', color: 'black' }}>
        멋사 커뮤니티
      </Link>
      
      <nav>
        {isLoggedIn ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>반갑습니다, <strong>{user?.username}</strong>님!</span>
            <button 
              onClick={logout} 
              style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login" style={{ textDecoration: 'none', color: '#0070f3' }}>로그인</Link>
            <Link href="/signup" style={{ textDecoration: 'none', color: '#0070f3' }}>회원가입</Link>
          </div>
        )}
      </nav>
    </header>
  );
}