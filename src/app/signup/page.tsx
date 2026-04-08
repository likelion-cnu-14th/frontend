'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await register({ username, email, password });
      setAuth(data.access_token, data.user); // 성공하면 상태 저장
      router.push('/community'); // 게시판으로 이동
    } catch (err: any) {
      setError(err.response?.data?.detail?.error || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>회원가입</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="유저네임 (2자 이상)" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          minLength={2} 
        />
        <input 
          type="email" 
          placeholder="이메일" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="비밀번호 (6자 이상)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          minLength={6} 
        />
        {error && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{error}</p>}
        <button type="submit" disabled={isLoading} style={{ padding: '0.5rem', cursor: 'pointer' }}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '14px' }}>
        이미 계정이 있으신가요? <Link href="/login" style={{ color: 'blue' }}>로그인</Link>
      </p>
    </div>
  );
}