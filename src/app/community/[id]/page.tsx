"use client";

// TODO: 필요한 import를 추가하세요
// - useState, useEffect (react)
// - useParams (next/navigation)
// - getPosts, savePosts (lib/mockData)
// - Post 타입 (types/post)
// - CommentItem 컴포넌트 (components/CommentItem)

export default function PostDetailPage() {
  // TODO: useParams()로 id 가져오기

  // TODO: post 상태를 만드세요 (useState)

  // TODO: useEffect로 id에 해당하는 게시글 찾기

  // TODO: handleLike 함수 구현
  // 1. post의 likes +1
  // 2. savePosts()로 저장
  // 3. useState로 화면 업데이트

  // TODO: handleComment 함수 구현
  // 1. 새 Comment 객체 생성
  // 2. post.comments에 추가
  // 3. savePosts()로 저장
  // 4. useState로 화면 업데이트

  return (
    <div>
      <h1>게시글 상세</h1>
      {/* TODO: 게시글 제목, 내용, 작성자, 작성일 표시 */}
      {/* TODO: 좋아요 버튼 + 좋아요 수 */}
      {/* TODO: 댓글 목록 (CommentItem 사용) */}
      {/* TODO: 댓글 입력창 + 작성 버튼 */}
    </div>
  );
}
