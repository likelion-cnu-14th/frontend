"use client";

import { useRouter } from "next/navigation";
import { Post } from "@/types/post";

// 목록 화면에서 게시글 한 건을 요약해 보여주는 카드용 속성입니다.
interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR");

  // 이 컴포넌트는 사용자가 어떤 글을 눌러야 할지 빠르게 판단하도록
  // 핵심 정보(제목/작성자/반응 수)를 짧게 전달하는 역할을 합니다.
  // 카드 클릭 이동이 빠지면 상세 내용 진입이 어려워져 사용 흐름이 끊길 수 있습니다.
  return (
    <button
      type="button"
      onClick={() => router.push(`/community/${post.id}`)}
      className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-300 hover:shadow"
    >
      <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>

      <p className="mt-2 text-sm text-gray-600">
        {post.author} | {formattedDate}
      </p>

      <div className="mt-3 flex gap-4 text-sm text-gray-700">
        <span>좋아요 {post.likes}</span>
        <span>댓글 {post.comments.length}</span>
      </div>
    </button>
  );
}
