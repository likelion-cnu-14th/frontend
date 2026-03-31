import type { CommunityPost } from "./communityTypes";

const KEYS = {
  posts: "community.posts",
  likedPostIds: "community.likedPostIds",
} as const;

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function seedPosts(): CommunityPost[] {
  const now = Date.now();
  const makePost = (title: string, content: string, minutesAgo: number) => {
    const createdAt = now - minutesAgo * 60_000;
    return {
      id: `p_${createdAt}_${Math.random().toString(16).slice(2)}`,
      title,
      content,
      createdAt,
      updatedAt: createdAt,
      comments: [],
      likesCount: 0,
    };
  };

  return [
    makePost(
      "첫 글에 오신 걸 환영합니다",
      "이 게시판은 Next.js(App Router) + localStorage만으로 동작합니다. 서버 없이 글 목록/작성/상세(댓글/좋아요)까지 가능합니다.",
      45
    ),
    makePost(
      "목록에서 바로 좋아요도 가능해요",
      "글 카드에서 좋아요 버튼을 눌러 토글할 수 있어요. (버튼 클릭은 상세 페이지 이동을 막습니다.)",
      120
    ),
  ];
}

function normalizePosts(posts: CommunityPost[]): CommunityPost[] {
  // localStorage에 예전 형태로 저장된 데이터가 있어도 최소 필드를 보정해줍니다.
  return posts
    .filter((p) => !!p && typeof p === "object")
    .map((p) => {
      const createdAt = typeof p.createdAt === "number" ? p.createdAt : Date.now();
      const updatedAt = typeof p.updatedAt === "number" ? p.updatedAt : createdAt;
      const title = typeof p.title === "string" ? p.title : "";
      const content = typeof p.content === "string" ? p.content : "";
      const likesCount = typeof p.likesCount === "number" ? p.likesCount : 0;
      const comments = Array.isArray(p.comments) ? p.comments : [];

      return {
        ...p,
        id: typeof p.id === "string" ? p.id : `p_${createdAt}_${Math.random().toString(16).slice(2)}`,
        title,
        content,
        createdAt,
        updatedAt,
        likesCount,
        comments: comments
          .filter((c) => !!c && typeof c === "object")
          .map((c) => ({
            ...c,
            id: typeof c.id === "string" ? c.id : `c_${Math.random().toString(16).slice(2)}_${Date.now()}`,
            text: typeof c.text === "string" ? c.text : "",
            createdAt: typeof c.createdAt === "number" ? c.createdAt : Date.now(),
            updatedAt: typeof c.updatedAt === "number" ? c.updatedAt : undefined,
          })),
      };
    });
}

export function loadPosts(): CommunityPost[] {
  if (typeof window === "undefined") return [];

  const existing = safeParseJSON<CommunityPost[]>(window.localStorage.getItem(KEYS.posts));
  if (existing && Array.isArray(existing) && existing.length > 0) {
    const normalized = normalizePosts(existing);
    // 정규화 결과가 원본과 다를 수 있으니 저장까지 갱신
    window.localStorage.setItem(KEYS.posts, JSON.stringify(normalized));
    return normalized;
  }

  const seeded = seedPosts();
  window.localStorage.setItem(KEYS.posts, JSON.stringify(seeded));
  return seeded;
}

export function savePosts(posts: CommunityPost[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.posts, JSON.stringify(posts));
}

export function loadLikedPostIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = safeParseJSON<string[]>(window.localStorage.getItem(KEYS.likedPostIds));
  if (!raw) return new Set();
  return new Set(raw);
}

export function saveLikedPostIds(ids: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEYS.likedPostIds, JSON.stringify(Array.from(ids)));
}

