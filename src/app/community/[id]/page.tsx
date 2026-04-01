"use client";

// 이 파일은 브라우저에서만 동작하는 커뮤니티 게시글 상세 페이지입니다.
// 사용자는 여기서 글 내용을 읽고, 좋아요를 누르고, 댓글을 작성할 수 있습니다.
import { useEffect, useState } from "react";
// 현재 URL의 게시글 id를 읽고, 다른 페이지로 이동할 때 사용합니다.
import { useParams, useRouter } from "next/navigation";
// 댓글 하나를 보기 좋게 표시해 주는 재사용 컴포넌트입니다.
import CommentItem from "@/components/CommentItem";
// 게시글 목록을 불러오고 저장하는 로컬 저장소 헬퍼입니다.
import { getPosts, savePosts } from "@/lib/mockData";
// 게시글 데이터 구조(타입)를 가져와 상태를 안전하게 다룹니다.
import { Post } from "@/types/post";

// 픽셀 폰트 스타일을 여러 곳에서 재사용하기 위해 묶어 둡니다.
const px = { fontFamily: '"Press Start 2P", monospace' } as const;

// 댓글 입력 글자 수 제한(너무 긴 댓글 방지)입니다.
const MAX_COMMENT_LENGTH = 500;
// 사용자가 좋아요 누른 게시글 id를 저장할 localStorage 키입니다.
const LIKED_POSTS_KEY = "likedPostIds";

// 게시글 상세 페이지의 메인 컴포넌트입니다.
export default function PostDetailPage() {
  // 뒤로가기/목록 이동 같은 화면 전환에 사용합니다.
  const router = useRouter();
  // URL에서 게시글 id 파라미터를 가져옵니다.
  const params = useParams<{ id: string }>();
  // id가 배열로 들어올 수도 있어 첫 값을 안전하게 사용합니다.
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 현재 보고 있는 게시글 정보를 상태로 보관합니다.
  const [post, setPost] = useState<Post | null>(null);
  // 현재 사용자가 이 글에 좋아요를 눌렀는지 상태입니다.
  const [isLiked, setIsLiked] = useState(false);
  // 댓글 입력창의 현재 텍스트 상태입니다.
  const [commentInput, setCommentInput] = useState("");

  // 페이지 진입 시(또는 게시글 id 변경 시) 게시글과 좋아요 상태를 초기화합니다.
  useEffect(() => {
    // 저장된 게시글 목록을 읽어옵니다.
    const posts = getPosts();
    // URL id와 일치하는 게시글 하나를 찾고, 없으면 null 처리합니다.
    const selectedPost = posts.find((item) => item.id === postId) ?? null;
    // 화면에 보여줄 게시글 상태를 반영합니다.
    setPost(selectedPost);

    // 이전에 누른 좋아요 목록을 불러와 새로고침 후에도 사용자 선택을 유지합니다.
    const likedPostIds = localStorage.getItem(LIKED_POSTS_KEY);
    // 저장값이 없으면 아직 좋아요를 누르지 않은 상태로 처리합니다.
    if (!likedPostIds) {
      // 좋아요 버튼을 기본(미선택) 상태로 둡니다.
      setIsLiked(false);
      // 더 볼 데이터가 없으므로 여기서 종료합니다.
      return;
    }

    // 저장된 문자열을 배열로 파싱해 현재 글이 포함됐는지 확인합니다.
    try {
      // localStorage 문자열을 배열로 변환합니다.
      const parsed = JSON.parse(likedPostIds) as string[];
      // 배열 안에 현재 postId가 있으면 좋아요 상태를 true로 반영합니다.
      setIsLiked(Array.isArray(parsed) && parsed.includes(postId));
    } catch {
      // 저장값이 손상된 경우 화면 오류를 막기 위해 값을 지우고 초기 상태로 복구합니다.
      localStorage.removeItem(LIKED_POSTS_KEY);
      // 잘못된 데이터가 있었으므로 좋아요 상태를 기본값(false)로 둡니다.
      setIsLiked(false);
    }
    // postId가 바뀔 때마다 다시 실행해 다른 게시글에도 정확히 대응합니다.
  }, [postId]);

  // 좋아요 버튼 클릭 시 좋아요/취소를 토글하고 저장합니다.
  const handleLike = () => {
    // 게시글이 아직 로드되지 않았다면 아무 동작도 하지 않습니다.
    if (!post) return;

    // 기존 좋아요 목록을 localStorage에서 꺼냅니다.
    const likedPostIdsRaw = localStorage.getItem(LIKED_POSTS_KEY);
    // 파싱 실패를 대비해 빈 배열로 시작합니다.
    let likedPostIds: string[] = [];
    // 저장값이 있을 때만 파싱을 시도합니다.
    if (likedPostIdsRaw) {
      // 문자열을 배열로 안전하게 변환합니다.
      try {
        // JSON 문자열을 배열로 변환합니다.
        const parsed = JSON.parse(likedPostIdsRaw) as string[];
        // 배열 형태가 맞을 때만 사용하고, 아니면 빈 배열을 사용합니다.
        likedPostIds = Array.isArray(parsed) ? parsed : [];
      } catch {
        // 데이터가 깨졌으면 새 배열로 복구해 기능 중단을 막습니다.
        likedPostIds = [];
      }
    }
    // 현재 글 id가 좋아요 목록에 있는지 확인합니다.
    const alreadyLiked = likedPostIds.includes(post.id);
    // 이미 눌렀다면 제거, 아니면 추가해 다음 상태 목록을 만듭니다.
    const nextLikedPostIds = alreadyLiked
      ? likedPostIds.filter((id) => id !== post.id)
      : [...likedPostIds, post.id];

    // 최신 게시글 목록을 읽어 좋아요 수를 함께 갱신합니다.
    const posts = getPosts();
    // 대상 글의 likes 값을 +1 또는 -1(최소 0)로 업데이트합니다.
    const updatedPosts = posts.map((item) =>
      item.id === post.id
        ? { ...item, likes: Math.max(0, item.likes + (alreadyLiked ? -1 : 1)) }
        : item,
    );
    // 변경된 게시글 목록을 저장합니다.
    savePosts(updatedPosts);
    // 사용자 개인의 좋아요 이력도 localStorage에 저장합니다.
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(nextLikedPostIds));
    // 화면의 게시글 상태를 최신 데이터로 교체합니다.
    setPost(updatedPosts.find((item) => item.id === post.id) ?? null);
    // 버튼 색상/문구를 위해 좋아요 상태를 즉시 토글합니다.
    setIsLiked(!alreadyLiked);
  };

  // 댓글 등록 버튼 클릭 시 새 댓글을 만들어 게시글에 추가합니다.
  const handleComment = () => {
    // 게시글이 없거나 입력이 공백이면 저장하지 않습니다.
    if (!post || !commentInput.trim()) return;
    // 새 댓글 객체를 생성합니다(임시 id, 본문, 작성자, 작성시각).
    const newComment = {
      // 간단한 고유 id로 현재 시간을 문자열로 사용합니다.
      id: Date.now().toString(),
      // 앞뒤 공백을 제거해 깔끔한 본문만 저장합니다.
      content: commentInput.trim(),
      // 현재 UI 정책상 익명 작성자로 고정합니다.
      author: "익명",
      // 댓글 작성 시점을 ISO 형식으로 저장합니다.
      createdAt: new Date().toISOString(),
    };
    // 기존 게시글 목록을 읽어옵니다.
    const posts = getPosts();
    // 대상 게시글의 comments 배열 끝에 새 댓글을 추가합니다.
    const updatedPosts = posts.map((item) =>
      item.id === post.id
        ? { ...item, comments: [...item.comments, newComment] }
        : item,
    );
    // 댓글이 반영된 목록을 저장합니다.
    savePosts(updatedPosts);
    // 화면 상태를 최신 게시글 데이터로 동기화합니다.
    setPost(updatedPosts.find((item) => item.id === post.id) ?? null);
    // 등록 후 입력창을 비워 다음 댓글을 바로 작성할 수 있게 합니다.
    setCommentInput("");
  };

  // 게시글을 찾지 못한 경우 안내 메시지와 목록 이동 버튼을 보여줍니다.
  if (!post) {
    // 없는 게시글 접근 시의 예외 화면 UI입니다.
    return (
      /* 전체 배경/여백을 담당하는 바깥 래퍼입니다. */
      <div style={styles.pageWrapper}>
        {/* 내용 박스(카드) 영역입니다. */}
        <div style={styles.card}>
          {/* 사용자에게 게시글이 없음을 알리는 문구입니다. */}
          <p style={{ ...px, fontSize: "8px", color: "#444" }}>게시글을 찾을 수 없습니다.</p>
          {/* 커뮤니티 목록 화면으로 이동시키는 버튼입니다. */}
          <button type="button" onClick={() => router.push("/community")} style={styles.blueBtn}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  // 작성일을 한국어 로케일 형식으로 보기 쉽게 변환합니다.
  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // 게시글 상세 본문 UI를 렌더링합니다.
  return (
    /* 페이지 전체 래퍼(배경색/기본 폰트/여백)입니다. */
    <div style={styles.pageWrapper}>
      {/* 콘텐츠 최대 너비를 제한해 가독성을 높입니다. */}
      <div style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}>

        {/* 목록 화면으로 돌아가는 버튼입니다. */}
        <button
          type="button"
          onClick={() => router.push("/community")}
          style={styles.backBtn}
        >
          ← 목록으로
        </button>

        {/* 게시글 본문을 담는 카드 영역입니다. */}
        <div style={styles.card}>
          {/* 게시글 제목 텍스트입니다. */}
          <h1 style={{ ...px, fontSize: "13px", color: "#000", margin: "0 0 12px", lineHeight: 1.6 }}>
            {post.title}
          </h1>

          {/* 작성자와 작성일을 한 줄에 나란히 보여줍니다. */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ ...px, fontSize: "7px", color: "#2563eb" }}>{post.author}</span>
            <span style={{ ...px, fontSize: "7px", color: "#555" }}>{formattedDate}</span>
          </div>

          {/* 본문 구역을 나누는 점선 구분선입니다. */}
          <div style={styles.dashedDivider} />

          {/* 게시글 본문 내용입니다(줄바꿈 유지). */}
          <p style={{ ...px, fontSize: "8px", color: "#222", lineHeight: 2, whiteSpace: "pre-wrap", margin: "20px 0" }}>
            {post.content}
          </p>

          {/* 반응 영역(좋아요/댓글 수) 앞의 구분선입니다. */}
          <div style={styles.dashedDivider} />

          {/* 좋아요 버튼과 댓글 개수 요약 영역입니다. */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
            {/* 사용자가 좋아요를 누르거나 취소하는 버튼입니다. */}
            <button
              type="button"
              onClick={handleLike}
              style={{ ...styles.likeBtn, background: isLiked ? "#ef4444" : "#9ca3af" }}
            >
              <span style={{ marginRight: "6px" }}>♥</span>
              <span style={{ ...px, fontSize: "8px" }}>
                {isLiked ? "좋아요 취소" : "좋아요"} {post.likes}
              </span>
            </button>

            {/* 댓글 아이콘과 댓글 수를 표시합니다. */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px", color: "#555" }}>💬</span>
              <span style={{ ...px, fontSize: "8px", color: "#444" }}>댓글 {post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 제목입니다. */}
        <h2 style={{ ...px, fontSize: "10px", color: "#000", margin: "28px 0 14px" }}>
          댓글 〈{post.comments.length}〉
        </h2>

         {/* 댓글이 하나 이상일 때 목록을 렌더링합니다. */}
         {post.comments.length > 0 && (
          <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
            {/* 각 댓글을 CommentItem으로 순회 렌더링합니다. */}
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {/* 댓글이 없을 때는 빈 상태 안내 문구를 보여줍니다. */}
        {post.comments.length === 0 && (
          <p style={{ ...px, fontSize: "8px", color: "#666", marginTop: "12px" }}>
            아직 댓글이 없습니다.
          </p>
        )}

        {/* 새 댓글을 입력하고 등록하는 카드입니다. */}
        <div style={styles.card}>
          {/* 현재 익명으로 작성된다는 안내 문구입니다. */}
          <p style={{ ...px, fontSize: "7px", color: "#444", marginBottom: "10px" }}>
            댓글 작성 〈as 익명〉
          </p>
          {/* 댓글 본문 입력창입니다. */}
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="댓글을 입력하세요"
            rows={4}
            style={styles.textarea}
          />
          {/* 현재 입력 글자 수와 최대 제한을 함께 표시합니다. */}
          <div style={{ ...px, fontSize: "7px", color: "#888", textAlign: "right", marginBottom: "12px" }}>
            {commentInput.length} / {MAX_COMMENT_LENGTH}
          </div>
          {/* 댓글 등록 실행 버튼입니다. */}
          <button type="button" onClick={handleComment} style={styles.blueBtn}>
            댓글 달기
          </button>
        </div>

       
      </div>
    </div>
  );
}

// 아래는 화면에서 재사용하는 스타일 모음입니다.
const styles = {
  // 페이지 전체 배경과 기본 여백을 정의합니다.
  pageWrapper: {
    fontFamily: '"Press Start 2P", monospace',
    minHeight: "100vh",
    width: "100%",
    background: "#fde047",
    padding: "32px 24px",
  } as React.CSSProperties,

  // 흰색 카드(본문/입력창)에 공통으로 쓰는 스타일입니다.
  card: {
    background: "#fff",
    border: "3px solid #000",
    boxShadow: "6px 6px 0 #000",
    padding: "28px",
    marginBottom: "12px",
  } as React.CSSProperties,

  // "목록으로" 텍스트 버튼 스타일입니다.
  backBtn: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "9px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#000",
    marginBottom: "20px",
    padding: 0,
  } as React.CSSProperties,

  // 콘텐츠 블록 사이를 나누는 점선 스타일입니다.
  dashedDivider: {
    borderTop: "2px dashed #ccc",
    margin: "0",
  } as React.CSSProperties,

  // 좋아요 버튼의 기본 외형 스타일입니다.
  likeBtn: {
    fontFamily: '"Press Start 2P", monospace',
    display: "flex",
    alignItems: "center",
    background: "#ef4444",
    color: "#fff",
    border: "3px solid #000",
    boxShadow: "3px 3px 0 #000",
    padding: "10px 16px",
    cursor: "pointer",
    fontSize: "13px",
  } as React.CSSProperties,

  // 기본 파란색 액션 버튼 스타일입니다(목록 이동/댓글 등록 등).
  blueBtn: {
    fontFamily: '"Press Start 2P", monospace',
    fontSize: "8px",
    background: "#93c5fd",
    color: "#000",
    border: "3px solid #000",
    boxShadow: "3px 3px 0 #000",
    padding: "10px 16px",
    cursor: "pointer",
  } as React.CSSProperties,

  // 댓글 입력 textarea의 공통 스타일입니다.
  textarea: {
    fontFamily: '"Press Start 2P", monospace',
    width: "100%",
    fontSize: "8px",
    border: "2px solid #000",
    padding: "12px",
    outline: "none",
    resize: "vertical" as const,
    marginBottom: "8px",
    boxSizing: "border-box" as const,
    lineHeight: 1.8,
  } as React.CSSProperties,
};