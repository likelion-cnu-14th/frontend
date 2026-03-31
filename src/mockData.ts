import type { Post } from "@/types/post"

const STORAGE_KEY = "likelion-community-posts"

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

function safeParsePosts(raw: string | null): Post[] | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return null
    return parsed as Post[]
  } catch {
    return null
  }
}

let POSTS: Post[] = [
  {
    id: 1,
    title: "첫 번째 게시글",
    content: "첫 번째 게시글 내용입니다.",
    author: "홍길동",
    createdAt: new Date().toISOString(),
    likesCount: 12,
    comments: [
      {
        id: 1,
        author: "익명",
        content: "좋은 글이네요!",
        createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        id: 2,
        author: "익명",
        content: "저도 같은 생각이에요.",
        createdAt: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
      },
      {
        id: 3,
        author: "익명",
        content: "정보 공유 감사합니다.",
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ],
  },
  {
    id: 2,
    title: "두 번째 게시글",
    content: "두 번째 게시글 내용입니다.",
    author: "김철수",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    likesCount: 3,
    comments: [
      {
        id: 1,
        author: "익명",
        content: "궁금한 점이 있어요!",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: 3,
    title: "세 번째 게시글",
    content: "세 번째 게시글 내용입니다.",
    author: "이영희",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    likesCount: 27,
    comments: [],
  },
]

export async function getPosts(): Promise<Post[]> {
  // mock async API
  await new Promise((r) => setTimeout(r, 150))

  if (isBrowser()) {
    const stored = safeParsePosts(window.localStorage.getItem(STORAGE_KEY))
    if (stored) {
      POSTS = stored
    } else if (!window.localStorage.getItem(STORAGE_KEY)) {
      // first run: seed storage with initial mock data
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(POSTS))
    }
  }

  return POSTS
}

export async function savePosts(posts: Post[]): Promise<void> {
  await new Promise((r) => setTimeout(r, 150))
  POSTS = posts

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  }
}

