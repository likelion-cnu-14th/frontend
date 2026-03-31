"use client";

import { Post } from "@/types/post";

// 목록 화면에서 게시글 한 건을 요약해 보여주는 카드용 속성입니다.
interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // 이 컴포넌트는 사용자가 어떤 글을 눌러야 할지 빠르게 판단하도록
  // 핵심 정보(제목/작성자/반응 수)를 짧게 전달하는 역할을 합니다.
  // 카드 클릭 이동이 빠지면 상세 내용 진입이 어려워져 사용 흐름이 끊길 수 있습니다.
  // TODO: 게시글 카드 UI를 구현하세요
  // - 제목, 작성자, 작성일, 좋아요 수, 댓글 수 표시
  // - 카드 클릭 시 /community/[id]로 이동 (useRouter 사용)
  return (
    <div>
      <h2>{post.title}</h2>
      {/* 나머지를 구현하세요 */}
    </div>
  );
}
