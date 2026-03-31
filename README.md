# 커뮤니티 게시판 프로젝트

Next.js App Router 기반의 커뮤니티 게시판입니다. 서버 없이 **localStorage**만으로 데이터를 관리합니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS 4 |
| UI 컴포넌트 | shadcn/ui (Radix UI) |
| 데이터 저장 | localStorage (클라이언트 전용) |

---

## 시스템 구조

```
┌─────────────────────────────────────────────────────┐
│                     브라우저                          │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │              Next.js App Router                │  │
│  │                                               │  │
│  │   /community ──────► 글 목록 페이지            │  │
│  │       │                  │                    │  │
│  │       │             PostCard x N              │  │
│  │       │                  │                    │  │
│  │       ▼                  ▼                    │  │
│  │   /community/write   /community/[id]          │  │
│  │   글 작성 페이지      글 상세 페이지            │  │
│  │                          │                    │  │
│  │                     ┌────┴────┐               │  │
│  │                     │         │               │  │
│  │                  좋아요   댓글 기능             │  │
│  │                          │                    │  │
│  │                     CommentItem x N           │  │
│  └──────────┬────────────────────────────────────┘  │
│             │                                       │
│             ▼                                       │
│  ┌─────────────────────┐                            │
│  │    localStorage      │  ◄── 모든 데이터 저장소    │
│  │   key: "posts"       │                           │
│  │   value: Post[] JSON │                           │
│  └─────────────────────┘                            │
└─────────────────────────────────────────────────────┘
```

---

## 데이터 흐름

```
[사용자 액션]
     │
     ▼
[useState 업데이트] ──► 화면 즉시 반영
     │
     ▼
[savePosts()] ──► localStorage에 JSON 저장
     │
     ▼
[새로고침 / 재방문]
     │
     ▼
[getPosts()] ──► localStorage에서 읽기 ──► useState에 세팅 ──► 화면 표시
                    │
                    └── 데이터 없으면 → initialPosts (mock 데이터) 반환
```

---

## 폴더 구조

```
src/
├── app/                          # 페이지 (App Router)
│   ├── layout.tsx                #   루트 레이아웃
│   ├── page.tsx                  #   홈 페이지 (/)
│   ├── globals.css               #   전역 스타일
│   └── community/                #   커뮤니티 기능
│       ├── page.tsx              #     글 목록 (/community)
│       ├── write/
│       │   └── page.tsx          #     글 작성 (/community/write)
│       └── [id]/
│           └── page.tsx          #     글 상세 (/community/[id])
│
├── components/                   # 재사용 컴포넌트
│   ├── ui/                       #   shadcn/ui 컴포넌트
│   ├── PostCard.tsx              #   게시글 카드
│   └── CommentItem.tsx           #   댓글 아이템
│
├── lib/                          # 유틸리티
│   ├── utils.ts                  #   cn() 등 공용 유틸
│   └── mockData.ts               #   초기 데이터 + localStorage 함수
│
├── types/                        # 타입 정의
│   └── post.ts                   #   Post, Comment 인터페이스
│
└── hooks/                        # 커스텀 훅 (필요 시)
```

---

## 페이지별 기능

### `/community` - 글 목록

- localStorage에서 게시글 배열 불러오기
- PostCard 컴포넌트로 각 글 렌더링 (제목, 작성자, 날짜, 좋아요 수, 댓글 수)
- 카드 클릭 → 상세 페이지 이동
- "글 작성" 버튼 → 작성 페이지 이동

### `/community/write` - 글 작성

- 제목 + 내용 입력 폼
- 작성 시 새 Post 객체 생성 → localStorage 저장 → 목록으로 이동

### `/community/[id]` - 글 상세

- URL 파라미터로 게시글 조회
- 게시글 내용 표시
- 좋아요 버튼 (클릭 시 +1, localStorage 동기화)
- 댓글 목록 표시 (CommentItem 컴포넌트)
- 댓글 작성 (입력 → 추가 → localStorage 동기화)

---

## 핵심 타입

```typescript
interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}
```

---

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

---

## 과제 안내

| 주차 | 과제 | 문서 |
|------|------|------|
| 2주차 | 커뮤니티 게시판 만들기 | [week2-community.md](docs/assignments/week2-community.md) |
