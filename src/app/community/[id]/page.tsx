"use client";

// 게시글 상세 화면입니다.
// 사용자는 여기서 글 내용을 읽고 좋아요/댓글로 반응합니다.
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentItem from "@/components/CommentItem";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

export default function PostDetailPage() {
  // URL의 id로 어떤 글을 보여줄지 결정합니다.
  // id 매칭이 실패하면 잘못된 게시글을 보여주거나 빈 화면이 될 수 있습니다.
  const params = useParams<{ id: string }>();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 선택된 게시글 상태를 보관해 화면에 상세 내용을 표시합니다.
  const [post, setPost] = useState<Post | null>(null);
  const [commentInput, setCommentInput] = useState("");

  // id 변경 시 해당 게시글을 다시 찾아 화면을 갱신합니다.
  useEffect(() => {
    const posts = getPosts();
    const selectedPost = posts.find((item) => item.id === postId) ?? null;
    setPost(selectedPost);
  }, [postId]);

  // 좋아요는 사용자 반응을 수치로 남기는 기능입니다.
  // 화면만 바꾸고 저장하지 않으면 새로고침 후 값이 사라져 신뢰가 떨어집니다.
  // 1. post의 likes +1
  // 2. savePosts()로 저장
  // 3. useState로 화면 업데이트
  const handleLike = () => {
    if (!post) {
      return;
    }

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id ? { ...item, likes: item.likes + 1 } : item,
    );
    savePosts(updatedPosts);

    const updatedPost = updatedPosts.find((item) => item.id === post.id) ?? null;
    setPost(updatedPost);
  };

  // 댓글 작성은 대화 기록을 남기는 기능입니다.
  // 저장과 화면 갱신이 함께 이뤄져야 방금 입력한 댓글이 즉시 보이고 유지됩니다.
  // 1. 새 Comment 객체 생성
  // 2. post.comments에 추가
  // 3. savePosts()로 저장
  // 4. useState로 화면 업데이트
  const handleComment = () => {
    if (!post || !commentInput.trim()) {
      return;
    }

    const newComment = {
      id: Date.now().toString(),
      content: commentInput.trim(),
      author: "익명",
      createdAt: new Date().toISOString(),
    };

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id
        ? { ...item, comments: [...item.comments, newComment] }
        : item,
    );
    savePosts(updatedPosts);

    const updatedPost = updatedPosts.find((item) => item.id === post.id) ?? null;
    setPost(updatedPost);
    setCommentInput("");
  };

  if (!post) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="text-2xl font-bold text-gray-900">게시글 상세</h1>
        <p className="mt-4 text-sm text-gray-600">게시글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR");

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-900">게시글 상세</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {post.author} | {formattedDate}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-800">
          {post.content}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLike}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          좋아요
        </button>
        <span className="text-sm text-gray-700">좋아요 {post.likes}</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          댓글 {post.comments.length}
        </h3>
        {post.comments.length > 0 ? (
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600">아직 댓글이 없습니다.</p>
        )}
      </div>

      <div className="space-y-2">
        <textarea
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
          placeholder="댓글을 입력하세요"
          rows={4}
          className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={handleComment}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          댓글 작성
        </button>
      </div>
    </div>
  );
}
