"use client";

import { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
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
