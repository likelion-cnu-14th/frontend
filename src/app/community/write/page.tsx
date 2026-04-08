'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { isLoggedIn } = useAuthStore();

  // 로그인 체크
  useEffect(() => {
    // initialize가 늦게 될 수 있으니 체크
    const token = localStorage.getItem('access_token');
    if (!token && !isLoggedIn) {
      alert('로그인이 필요한 서비스입니다.');
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      // ✅ 4주차 핵심: title과 content만 보냅니다 (author는 서버가 토큰에서 추출함)
      await createPost({ title, content });
      alert('글이 성공적으로 등록되었습니다!');
      router.push('/community');
    } catch (error: any) {
      console.error('글 작성 실패:', error);
      // 서버에서 보내주는 구체적인 에러 메시지를 띄워줍니다.
      const errorMsg = error.response?.data?.detail?.error || '글 작성에 실패했습니다.';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoggedIn && typeof window !== 'undefined' && !localStorage.getItem('access_token')) {
    return null;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem' }}>새 글 작성하기</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold' }}>제목</label>
          <input 
            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
            type="text" 
            placeholder="제목을 입력하세요" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ fontWeight: 'bold' }}>내용</label>
          <textarea 
            style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '300px' }}
            placeholder="내용을 입력하세요" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            onClick={() => router.back()}
            style={{ padding: '0.8rem 1.5rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            취소
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              padding: '0.8rem 1.5rem', 
              background: '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? '등록 중...' : '등록하기'}
          </button>
        </div>
      </form>
    </div>
  );
}