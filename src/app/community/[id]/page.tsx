"use client";

// 게시글 상세 화면입니다.
// 사용자는 여기서 글 내용을 읽고 좋아요/댓글로 반응합니다.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CommentItem from "@/components/CommentItem";
import { getPosts, savePosts } from "@/lib/mockData";
import { Post } from "@/types/post";

const px = { fontFamily: '"Press Start 2P", monospace' } as const;

const MAX_COMMENT_LENGTH = 500;
const LIKED_POSTS_KEY = "likedPostIds";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");

  useEffect(() => {
    const posts = getPosts();
    const selectedPost = posts.find((item) => item.id === postId) ?? null;
    setPost(selectedPost);

    // 사용자가 이미 누른 좋아요를 다시 보여줘, 화면 진입 시 상태가 흔들리지 않게 합니다.
    const likedPostIds = localStorage.getItem(LIKED_POSTS_KEY);
    if (!likedPostIds) {
      setIsLiked(false);
      return;
    }

    try {
      const parsed = JSON.parse(likedPostIds) as string[];
      setIsLiked(Array.isArray(parsed) && parsed.includes(postId));
    } catch {
      // 저장값이 깨져 있어도 화면이 멈추지 않게 기본값으로 복구합니다.
      localStorage.removeItem(LIKED_POSTS_KEY);
      setIsLiked(false);
    }
  }, [postId]);

  const handleLike = () => {
    if (!post) return;

    const likedPostIdsRaw = localStorage.getItem(LIKED_POSTS_KEY);
    let likedPostIds: string[] = [];
    if (likedPostIdsRaw) {
      try {
        const parsed = JSON.parse(likedPostIdsRaw) as string[];
        likedPostIds = Array.isArray(parsed) ? parsed : [];
      } catch {
        likedPostIds = [];
      }
    }
    const alreadyLiked = likedPostIds.includes(post.id);
    const nextLikedPostIds = alreadyLiked
      ? likedPostIds.filter((id) => id !== post.id)
      : [...likedPostIds, post.id];

    const posts = getPosts();
    const updatedPosts = posts.map((item) =>
      item.id === post.id
        ? { ...item, likes: Math.max(0, item.likes + (alreadyLiked ? -1 : 1)) }
        : item,
    );
    savePosts(updatedPosts);
    localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(nextLikedPostIds));
    setPost(updatedPosts.find((item) => item.id === post.id) ?? null);
    setIsLiked(!alreadyLiked);
  };

  const handleComment = () => {
    if (!post || !commentInput.trim()) return;
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
    setPost(updatedPosts.find((item) => item.id === post.id) ?? null);
    setCommentInput("");
  };

  // ─── 게시글 없음 ───────────────────────────────────────────────────────────
  if (!post) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.card}>
          <p style={{ ...px, fontSize: "8px", color: "#444" }}>게시글을 찾을 수 없습니다.</p>
          <button type="button" onClick={() => router.push("/community")} style={styles.blueBtn}>
            목록으로
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  // ─── 본문 ──────────────────────────────────────────────────────────────────
  return (
    <div style={styles.pageWrapper}>
      <div style={{ width: "100%", maxWidth: "720px", margin: "0 auto" }}>

        {/* 목록으로 */}
        <button
          type="button"
          onClick={() => router.push("/community")}
          style={styles.backBtn}
        >
          ← 목록으로
        </button>

        {/* ── 본문 카드 ── */}
        <div style={styles.card}>
          {/* 제목 */}
          <h1 style={{ ...px, fontSize: "13px", color: "#000", margin: "0 0 12px", lineHeight: 1.6 }}>
            {post.title}
          </h1>

          {/* 작성자 / 날짜 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ ...px, fontSize: "7px", color: "#2563eb" }}>{post.author}</span>
            <span style={{ ...px, fontSize: "7px", color: "#555" }}>{formattedDate}</span>
          </div>

          {/* dashed 구분선 */}
          <div style={styles.dashedDivider} />

          {/* 본문 내용 */}
          <p style={{ ...px, fontSize: "8px", color: "#222", lineHeight: 2, whiteSpace: "pre-wrap", margin: "20px 0" }}>
            {post.content}
          </p>

          {/* dashed 구분선 */}
          <div style={styles.dashedDivider} />

          {/* 좋아요 / 댓글 수 */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginTop: "20px" }}>
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

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "14px", color: "#555" }}>💬</span>
              <span style={{ ...px, fontSize: "8px", color: "#444" }}>댓글 {post.comments.length}</span>
            </div>
          </div>
        </div>

        {/* ── 댓글 섹션 ── */}
        <h2 style={{ ...px, fontSize: "10px", color: "#000", margin: "28px 0 14px" }}>
          댓글 〈{post.comments.length}〉
        </h2>

         {/* 댓글 목록 */}
         {post.comments.length > 0 && (
          <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}

        {post.comments.length === 0 && (
          <p style={{ ...px, fontSize: "8px", color: "#666", marginTop: "12px" }}>
            아직 댓글이 없습니다.
          </p>
        )}

        {/* 댓글 입력 */}
        <div style={styles.card}>
          <p style={{ ...px, fontSize: "7px", color: "#444", marginBottom: "10px" }}>
            댓글 작성 〈as 익명〉
          </p>
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="댓글을 입력하세요"
            rows={4}
            style={styles.textarea}
          />
          {/* 글자 수 */}
          <div style={{ ...px, fontSize: "7px", color: "#888", textAlign: "right", marginBottom: "12px" }}>
            {commentInput.length} / {MAX_COMMENT_LENGTH}
          </div>
          <button type="button" onClick={handleComment} style={styles.blueBtn}>
            댓글 달기
          </button>
        </div>

       
      </div>
    </div>
  );
}

// ─── 스타일 ──────────────────────────────────────────────────────────────────
const styles = {
  pageWrapper: {
    fontFamily: '"Press Start 2P", monospace',
    minHeight: "100vh",
    width: "100%",
    background: "#fde047",
    padding: "32px 24px",
  } as React.CSSProperties,

  card: {
    background: "#fff",
    border: "3px solid #000",
    boxShadow: "6px 6px 0 #000",
    padding: "28px",
    marginBottom: "12px",
  } as React.CSSProperties,

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

  dashedDivider: {
    borderTop: "2px dashed #ccc",
    margin: "0",
  } as React.CSSProperties,

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