"use client";

// 게시글 상세 화면입니다.
// 사용자는 여기서 글 내용을 읽고 좋아요/댓글로 반응합니다.
// TODO: 필요한 import를 추가하세요
// - useState, useEffect (react)
// - useParams (next/navigation)
// - getPosts, savePosts (lib/mockData)
// - Post 타입 (types/post)
// - CommentItem 컴포넌트 (components/CommentItem)

export default function PostDetailPage() {
  // URL의 id로 어떤 글을 보여줄지 결정합니다.
  // id 매칭이 실패하면 잘못된 게시글을 보여주거나 빈 화면이 될 수 있습니다.
  // TODO: useParams()로 id 가져오기

  // 선택된 게시글 상태를 보관해 화면에 상세 내용을 표시합니다.
  // TODO: post 상태를 만드세요 (useState)

  // id 변경 시 해당 게시글을 다시 찾아 화면을 갱신합니다.
  // TODO: useEffect로 id에 해당하는 게시글 찾기

  // 좋아요는 사용자 반응을 수치로 남기는 기능입니다.
  // 화면만 바꾸고 저장하지 않으면 새로고침 후 값이 사라져 신뢰가 떨어집니다.
  // TODO: handleLike 함수 구현
  // 1. post의 likes +1
  // 2. savePosts()로 저장
  // 3. useState로 화면 업데이트

  // 댓글 작성은 대화 기록을 남기는 기능입니다.
  // 저장과 화면 갱신이 함께 이뤄져야 방금 입력한 댓글이 즉시 보이고 유지됩니다.
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
