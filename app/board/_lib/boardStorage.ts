export type BoardPost = {
  id: string;
  title: string;
  content: string;
  createdAt: number; // epoch ms
  likes: number; // aggregate likes count (single-user local demo)
};

export type BoardComment = {
  id: string;
  postId: string;
  content: string;
  author: string;
  createdAt: number;
};

const POSTS_KEY = "likelion_board_posts_v1";
const COMMENTS_KEY = "likelion_board_comments_v1";
const LIKED_POST_IDS_KEY = "likelion_board_likedPostIds_v1";

function safeParseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPosts(): BoardPost[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(POSTS_KEY);
  const parsed = safeParseJson<BoardPost[]>(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function savePosts(posts: BoardPost[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function loadComments(): BoardComment[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(COMMENTS_KEY);
  const parsed = safeParseJson<BoardComment[]>(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveComments(comments: BoardComment[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
}

export function loadLikedPostIds(): string[] {
  if (!isBrowser()) return [];
  const raw = window.localStorage.getItem(LIKED_POST_IDS_KEY);
  const parsed = safeParseJson<string[]>(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveLikedPostIds(ids: string[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LIKED_POST_IDS_KEY, JSON.stringify(ids));
}

export function createId() {
  // `crypto.randomUUID()` is supported in modern browsers.
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

