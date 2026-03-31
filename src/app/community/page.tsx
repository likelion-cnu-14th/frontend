"use client";

// 커뮤니티 게시글 목록 화면입니다.
// 사용자에게 최신 글 현황을 보여주고, 새 글 작성으로 이어지는 시작 지점 역할을 합니다.
// TODO: 필요한 import를 추가하세요
// - useState, useEffect (react)
// - useRouter (next/navigation)
// - getPosts (lib/mockData)
// - Post 타입 (types/post)
// - PostCard 컴포넌트 (components/PostCard)

export default function CommunityPage() {
  // 게시글 상태는 화면에 현재 무엇을 보여줄지 결정하는 핵심 데이터입니다.
  // TODO: useState로 posts 상태를 만드세요

  // 첫 진입 시 저장소에서 목록을 읽어와야 이전 사용 기록이 화면에 반영됩니다.
  // 이 과정이 없으면 사용자는 작성한 글이 사라졌다고 느낄 수 있습니다.
  // TODO: useEffect로 localStorage에서 게시글 목록을 불러오세요

  return (
    <div>
      <h1>커뮤니티</h1>
      {/* TODO: "글 작성" 버튼 → /community/write로 이동 */}
      {/* TODO: posts 배열을 map으로 돌면서 PostCard 렌더링 */}
    </div>
  );
}
