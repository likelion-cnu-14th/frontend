"use client";

import { Comment } from "@/types/post";

// 상세 화면에서 댓글 한 건을 보여주기 위한 입력 형식입니다.
interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  // 댓글은 "누가 어떤 의견을 남겼는지"를 보여주는 신뢰 정보입니다.
  // 작성자/시간 표시가 없으면 대화 맥락이 약해져 커뮤니티 경험이 떨어질 수 있습니다.
  // TODO: 댓글 UI를 구현하세요
  // - 작성자, 댓글 내용, 작성 시간 표시
  return (
    <div>
      <p>{comment.content}</p>
      {/* 나머지를 구현하세요 */}
    </div>
  );
}
