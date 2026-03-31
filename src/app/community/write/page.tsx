"use client";

// TODO: 필요한 import를 추가하세요
// - useState (react)
// - useRouter (next/navigation)
// - getPosts, savePosts (lib/mockData)
// - Post 타입 (types/post)

export default function WritePage() {
  // TODO: title, content 상태를 만드세요

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
