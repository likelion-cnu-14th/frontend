'use client';
import { Comment } from '@/types/post';
import { useAuthStore } from '@/store/authStore';

interface Props {
  comment: Comment;
  onDelete: (id: string) => void;
}

export default function CommentItem({ comment, onDelete }: Props) {
  // 로그인한 유저 정보 가져오기
  const { user } = useAuthStore();

  return (
    <div style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
      <p><strong>{comment.author}</strong> <span style={{ fontSize: '0.8rem', color: '#888' }}>({comment.createdAt})</span></p>
      <p>{comment.content}</p>
      
      {/* 내 댓글일 때만 삭제 버튼 보여주기! */}
      {comment.author === user?.username && (
        <button onClick={() => onDelete(comment.id)} style={{ fontSize: '0.8rem', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>
          삭제
        </button>
      )}
    </div>
  );
}

