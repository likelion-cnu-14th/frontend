'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchPost, deletePost, toggleLike, createComment, deleteComment } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import CommentItem from '@/components/CommentItem';

export default function PostDetailPage() {
  const params = useParams(); // URL 파라미터 가져오기
  const id = params.id as string; // 게시글 ID
  const router = useRouter();
  
  const [post, setPost] = useState<any>(null);
  const [commentContent, setCommentContent] = useState('');
  const { user, isLoggedIn } = useAuthStore();

  const loadPost = async () => {
    if (!id) return;
    try {
      const data = await fetchPost(id);
      setPost(data);
    } catch (error) {
      console.error('Failed to load post', error);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  // 댓글 작성 함수
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (!commentContent.trim()) return;

    try {
      // 💡 여기서 id(게시글 번호)와 데이터({content})를 정확히 보냅니다.
      await createComment(id, { content: commentContent });
      setCommentContent(''); // 입력칸 비우기
      loadPost(); // 목록 새로고침
    } catch (error: any) {
      console.error('댓글 작성 에러:', error);
      alert('댓글 작성에 실패했습니다. (서버 에러)');
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(commentId);
      loadPost();
    } catch (error) {
      alert('본인의 댓글만 삭제할 수 있습니다.');
    }
  };

  if (!post) return <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{post.title}</h2>
      <p style={{ color: '#666' }}>작성자: {post.author}</p>
      <div style={{ minHeight: '150px', margin: '2rem 0', whiteSpace: 'pre-wrap' }}>{post.content}</div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={async () => { await toggleLike(id); loadPost(); }}>❤️ {post.likes}</button>
        {post.author === user?.username && (
          <button onClick={async () => { if(confirm('삭제?')){ await deletePost(id); router.push('/community'); } }}>삭제</button>
        )}
      </div>

      <hr />
      <h3>댓글</h3>
      
      {isLoggedIn ? (
        <form onSubmit={handleCommentSubmit} style={{ display: 'flex', gap: '10px', margin: '1rem 0' }}>
          <input 
            style={{ flex: 1, padding: '8px' }}
            type="text" 
            value={commentContent} 
            onChange={(e) => setCommentContent(e.target.value)} 
            placeholder="댓글 내용 입력" 
          />
          <button type="submit">작성</button>
        </form>
      ) : (
        <p><Link href="/login">로그인</Link> 후 댓글을 작성하세요.</p>
      )}

      {post.comments?.map((c: any) => (
        <CommentItem key={c.id} comment={c} onDelete={handleCommentDelete} />
      ))}
    </div>
  );
}