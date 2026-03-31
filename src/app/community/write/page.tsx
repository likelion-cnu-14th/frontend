"use client";

// 커뮤니티 글 작성 화면입니다.
// 사용자가 입력한 제목/내용을 저장하고 목록으로 복귀시키는 것이 핵심 목적입니다.
// TODO: 필요한 import를 추가하세요
// - useState (react)
// - useRouter (next/navigation)
// - getPosts, savePosts (lib/mockData)
// - Post 타입 (types/post)

export default function WritePage() {
  // 입력 상태는 사용자가 폼에 적은 내용을 임시로 보관합니다.
  // 이 값이 없으면 저장 시 빈 글이 만들어져 사용자 경험이 나빠질 수 있습니다.
  // TODO: title, content 상태를 만드세요

  // 제출 로직은 "새 글 생성 -> 기존 목록에 추가 -> 로컬 저장 -> 목록 화면 이동" 순서가 중요합니다.
  // 저장 전에 이동하면 작성 내용이 사라져 사용자 입장에서 글 작성이 실패한 것처럼 보일 수 있습니다.
  // TODO: handleSubmit 함수를 구현하세요
  // 1. 새로운 Post 객체 생성 (id는 Date.now().toString())
  // 2. getPosts()로 기존 목록 가져오기
  // 3. 새 글을 배열에 추가
  // 4. savePosts()로 저장
  // 5. router.push("/community")로 이동

  return (
    <div>
      <h1>글 작성</h1>
      {/* TODO: 제목 input */}
      {/* TODO: 내용 textarea */}
      {/* TODO: 작성 버튼 (클릭 시 handleSubmit 호출) */}
    </div>
  );
}
