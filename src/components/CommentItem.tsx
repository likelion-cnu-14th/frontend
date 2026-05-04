"use client";

import { Comment } from "@/types/post";
import { useAuthStore } from "@/store/authStore";  // ✅ Zustand 스토어 추가

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => void;
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { user } = useAuthStore();  // ✅ 로그인한 유저 정보 가져오기

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return isoString;
    return date.toLocaleString("ko-KR");
  };

  const handleDelete = () => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (!ok) return;
    onDelete(comment.id);
  };

  return (
    <div className="p-3 border border-gray-200 rounded-lg">
      <p className="m-0 text-xs text-gray-500">
        작성자: {comment.author} | 작성일: {formatDate(comment.createdAt)}
      </p>
      <p className="mt-1">{comment.content}</p>

      {/* ✅ 본인 댓글에만 삭제 버튼 표시 */}
      {user?.username === comment.author && (
        <button
          type="button"
          onClick={handleDelete}
          className="mt-1 px-2 py-1 text-sm rounded-lg border border-gray-200 cursor-pointer bg-white hover:bg-red-50 hover:text-red-500"
        >
          삭제
        </button>
      )}
    </div>
  );
}