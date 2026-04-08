"use client";

// 화면 상태를 기억하기 위한 React 훅을 사용한다.
import { useState } from "react";
// 글 저장 후 상세 페이지로 이동하기 위해 라우터를 사용한다.
import { useRouter } from "next/navigation";
// 임시 저장소(목업 데이터)에서 글 목록을 읽고 저장하는 함수를 사용한다.
import { getPosts, savePosts } from "@/lib/mockData";
// 게시글 데이터 형식을 맞추기 위해 타입을 가져온다.
import { Post } from "@/types/post";

export default function CommunityWritePage() {
  // 등록 완료 후 원하는 화면으로 이동시키기 위한 라우터 객체다.
  const router = useRouter();
  // 레트로 스타일 폰트를 재사용하기 위해 공통 스타일 객체를 만든다.
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;

  // 사용자가 입력한 제목을 저장한다.
  const [title, setTitle] = useState("");
  // 사용자가 입력한 본문 내용을 저장한다.
  const [content, setContent] = useState("");
  // 작성자 이름을 저장하며, 비워두면 익명 처리된다.
  const [author, setAuthor] = useState("");

  // "등록하기"를 눌렀을 때 입력값 검사, 저장, 이동을 한 번에 처리한다.
  const handleSubmit = () => {
    // 제목 또는 내용이 비어 있으면 게시글 품질이 떨어지므로 등록을 막는다.
    if (!title.trim() || !content.trim()) {
      // 왜 등록이 안 되는지 즉시 알려 사용자가 바로 수정할 수 있게 한다.
      alert("제목과 내용을 입력해주세요.");
      // 유효하지 않은 데이터가 저장되지 않도록 여기서 종료한다.
      return;
    }

    // 기존 글 목록을 가져와 새 글을 맨 앞에 붙일 준비를 한다.
    const posts = getPosts();
    // 실제 저장에 사용할 새 게시글 객체를 만든다.
    const newPost: Post = {
      // 고유 식별자를 생성해 상세 페이지 주소와 목록 구분에 사용한다.
      id: Date.now().toString(),
      // 공백만 입력한 경우를 방지하기 위해 앞뒤 공백을 제거한다.
      title: title.trim(),
      // 본문도 같은 방식으로 정리해 저장한다.
      content: content.trim(),
      // 작성자 이름이 없으면 익명으로 표기해 등록 실패를 막는다.
      author: author.trim() || "익명",
      // 작성 시각을 기록해 시간순 정렬/표시에 활용한다.
      createdAt: new Date().toISOString(),
      // 새 글은 좋아요 0개에서 시작한다.
      likes: 0,
      // 새 글은 댓글이 없으므로 빈 배열로 시작한다.
      comments: [],
    };

    // 새 글을 맨 앞에 두어 목록 화면에서 방금 작성한 글이 바로 보이게 한다.
    const updatedPosts = [newPost, ...posts];
    // 업데이트된 목록 전체를 임시 저장소에 저장한다.
    savePosts(updatedPosts);
    // 저장 직후 새 글 상세 페이지로 이동해 작성 결과를 바로 확인시킨다.
    router.push(`/community/${newPost.id}`);
  };

  return (
    // 화면 전체 배경과 중앙 정렬을 담당하는 바깥 컨테이너다.
    <div
      style={{
        // 화면 높이를 꽉 채워 빈 공간 없이 표시한다.
        minHeight: "100vh",
        // 가로 전체를 사용한다.
        width: "100%",
        // 커뮤니티 테마 배경색이다.
        background: "#fde047",
        // 바깥 여백으로 콘텐츠가 화면 끝에 붙지 않게 한다.
        padding: "32px 24px",
        // 내부 요소를 유연하게 정렬하기 위해 flex를 사용한다.
        display: "flex",
        // 가로 중앙 정렬.
        justifyContent: "center",
        // 세로 중앙 정렬.
        alignItems: "center",
      }}
    >
      {/* 실제 입력 폼의 최대 너비를 제한하는 래퍼다. */}
      <div style={{ width: "100%", maxWidth: "720px" }}>
        {/* 목록으로 돌아가는 뒤로가기 버튼이다. */}
        <button
          type="button"
          /* 취소 의도를 반영해 글 목록 페이지로 이동한다. */
          onClick={() => router.push("/community")}
          style={{
            // 공통 폰트를 적용하고 버튼 텍스트 크기를 지정한다.
            ...px, fontSize: "9px", background: "transparent",
            // 버튼 기본 테두리를 제거해 텍스트 링크처럼 보이게 한다.
            border: "none", cursor: "pointer", color: "#000",
            // 아래 카드와의 간격 및 아이콘 정렬을 맞춘다.
            marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          ← 목록으로
        </button>

        {/* 게시글 입력 필드를 담는 카드 영역이다. */}
        <div
          style={{
            // 카드 배경을 흰색으로 지정해 입력 영역을 분리한다.
            background: "#fff",
            // 레트로 스타일의 굵은 외곽선.
            border: "3px solid #000",
            // 입체감 있는 그림자.
            boxShadow: "6px 6px 0 #000",
            // 카드 내부 여백.
            padding: "28px",
            // 아래 요소와 간격.
            marginBottom: "32px",
            // 카드 최대 너비 제한.
            maxWidth: "720px",
          }}
        >
        {/* 화면 제목: 사용자가 현재 "글 작성" 단계임을 인지하게 한다. */}
        <h1 style={{ ...px, fontSize: "12px", color: "#000", marginBottom: "24px", letterSpacing: "2px" }}>
          새 글 작성
        </h1>

        {/* 작성자 입력 라벨 */}
        <p style={{ ...px, fontSize: "8px", color: "#444", marginBottom: "8px" }}>작성자</p>
        <input
          /* 입력값과 화면을 동기화한다. */
          value={author}
          /* 사용자가 입력한 작성자 이름을 상태에 반영한다. */
          onChange={(e) => setAuthor(e.target.value)}
          /* 비워두면 익명 처리된다는 안내 문구. */
          placeholder="이름을 입력하세요 (비우면 익명)"
          /* 과도하게 긴 이름 입력을 제한해 UI 깨짐을 방지한다. */
          maxLength={20}
          style={{
            ...px,
            width: "100%",
            boxSizing: "border-box",
            fontSize: "8px",
            border: "2px solid #000",
            padding: "12px",
            marginBottom: "16px",
            outline: "none",
          }}
        />

        {/* 제목 입력 라벨 */}
        <p style={{ ...px, fontSize: "8px", color: "#444", marginBottom: "8px" }}>제목</p>
        <input
          /* 제목 입력값을 상태와 연결한다. */
          value={title}
          /* 제목 변경 시 즉시 상태를 업데이트한다. */
          onChange={(e) => setTitle(e.target.value)}
          /* 제목 입력 안내 문구. */
          placeholder="제목을 입력하세요"
          /* 지나치게 긴 제목을 제한한다. */
          maxLength={100}
          style={{
            ...px,
            width: "100%",
            boxSizing: "border-box",
            fontSize: "8px",
            border: "2px solid #000",
            padding: "12px",
            marginBottom: "16px",
            outline: "none",
          }}
        />

        {/* 본문 입력 라벨 */}
        <p style={{ ...px, fontSize: "8px", color: "#444", marginBottom: "8px" }}>내용</p>
        <textarea
          /* 본문 입력값을 상태와 연결한다. */
          value={content}
          /* 본문 변경 시 즉시 상태를 업데이트한다. */
          onChange={(e) => setContent(e.target.value)}
          /* 본문 입력 안내 문구. */
          placeholder="내용을 입력하세요"
          /* 저장 성능과 가독성을 위해 본문 길이를 제한한다. */
          maxLength={2000}
          /* 초기 표시 줄 수. */
          rows={8}
          style={{
            ...px,
            width: "100%",
            boxSizing: "border-box",
            fontSize: "8px",
            border: "2px solid #000",
            padding: "12px",
            // 필요 시 세로로만 크기 조절을 허용한다.
            resize: "vertical",
            outline: "none",
            // 긴 문장 가독성을 높이는 줄 간격.
            lineHeight: 2,
            // 글자수 표시 영역과의 간격.
            marginBottom: "8px",
          }}
        />
        {/* 현재 입력한 글자 수를 보여줘 제한 초과를 미리 방지한다. */}
        <div style={{ ...px, fontSize: "7px", color: "#888", textAlign: "right", marginBottom: "20px" }}>
          {content.length} / 2000
        </div>

        {/* 실제 등록 액션을 실행하는 버튼 */}
        <button
          type="button"
          /* 클릭 시 검증-저장-이동 로직을 실행한다. */
          onClick={handleSubmit}
          style={{
            ...px,
            fontSize: "8px",
            background: "#93c5fd",
            color: "#000",
            border: "3px solid #000",
            boxShadow: "3px 3px 0 #000",
            padding: "12px 20px",
            cursor: "pointer",
            transition: "all 0.1s",
          }}
          /* 버튼에 마우스를 올렸을 때 눌린 느낌을 주어 상호작용을 명확히 한다. */
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "1px 1px 0 #000";
            e.currentTarget.style.transform = "translate(2px,2px)";
          }}
          /* 마우스가 벗어나면 원래 모양으로 복원한다. */
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "3px 3px 0 #000";
            e.currentTarget.style.transform = "translate(0,0)";
          }}
        >
          등록하기
        </button>
        </div>
      </div>
    </div>
  );
}