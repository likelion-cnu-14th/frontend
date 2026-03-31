# 2주차 과제: 커뮤니티 게시판 만들기

## 과제 목표

Next.js (App Router) + localStorage를 활용하여 **서버 없이 동작하는 커뮤니티 게시판**을 구현합니다.

---

## 완성 시 구현되어야 할 기능

| 기능         | 페이지             | 설명                        |
| ------------ | ------------------ | --------------------------- |
| 글 목록 보기 | `/community`       | 게시글 리스트 표시          |
| 글 작성      | `/community/write` | 새 게시글 작성              |
| 글 상세 보기 | `/community/[id]`  | 게시글 내용 + 댓글 + 좋아요 |

---

## Next.js 페이지 이동 (Navigation) 가이드

이번 과제에서는 페이지 간 이동이 자주 필요합니다. Next.js App Router에서 페이지를 이동하는 방법 2가지를 알아두세요.

### 방법 1: `useRouter` (이벤트 핸들러에서 이동)

버튼 클릭, 폼 제출 등 **JS 로직 안에서** 이동할 때 사용합니다.

```typescript
"use client";
import { useRouter } from "next/navigation";  // ⚠️ next/router가 아닙니다!

export default function MyComponent() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/community");       // 해당 페이지로 이동
  };

  return <button onClick={handleClick}>목록으로</button>;
}
```

| 메서드                 | 설명                               |
| ---------------------- | ---------------------------------- |
| `router.push("/경로")` | 해당 경로로 이동 (히스토리에 추가) |
| `router.back()`        | 뒤로 가기                          |

### 방법 2: `<Link>` 컴포넌트 (클릭으로 이동)

단순히 **클릭하면 이동**하는 링크/버튼에 사용합니다. `<a>` 태그 대신 사용한다고 생각하면 됩니다.

```typescript
import Link from "next/link";

export default function MyComponent() {
  return (
    <div>
      <Link href="/community">목록으로</Link>
      <Link href="/community/write">글 작성</Link>
      <Link href={`/community/${post.id}`}>상세 보기</Link>
    </div>
  );
}
```

### 언제 뭘 쓰나요?

| 상황                           | 추천        |
| ------------------------------ | ----------- |
| 단순 링크 (클릭하면 바로 이동) | `<Link>`    |
| 폼 제출 후 이동, 조건부 이동   | `useRouter` |

> **이번 과제 기준:**
>
> - PostCard 클릭 → `<Link>` 또는 `useRouter` 둘 다 가능
> - "글 작성" 버튼 → `<Link>`가 간편
> - 글 작성 완료 후 목록으로 이동 → `useRouter` (savePosts 후 이동해야 하므로)

### URL 파라미터 읽기: `useParams`

`/community/[id]` 같은 동적 경로에서 `id` 값을 가져올 때 사용합니다.

```typescript
"use client";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
    const params = useParams();
    const id = params.id as string; // URL이 /community/3 이면 id = "3"

    // id를 이용해 해당 게시글 찾기
}
```

---

## 시작하기 전에

### 1. 포크한 레포지토리 클론

```bash
git clone https://github.com/[본인계정]/[레포명].git
cd [레포명]
npm install
npm run dev
```

### 2. 이미 제공된 파일 확인

아래 파일들은 **이미 만들어져 있습니다**. 직접 만들 필요 없이 바로 사용하면 됩니다.

| 파일                  | 설명                                                  |
| --------------------- | ----------------------------------------------------- |
| `src/types/post.ts`   | `Post`, `Comment` 타입 정의 (완성)                    |
| `src/lib/mockData.ts` | 초기 데이터 + `getPosts()`, `savePosts()` 함수 (완성) |

아래 파일들은 **껍데기만 제공**됩니다. TODO 주석을 따라 직접 구현해야 합니다.

| 파일                               | 설명                           |
| ---------------------------------- | ------------------------------ |
| `src/components/PostCard.tsx`      | 게시글 카드 컴포넌트           |
| `src/components/CommentItem.tsx`   | 댓글 아이템 컴포넌트           |
| `src/app/community/page.tsx`       | 커뮤니티 메인 (글 목록)        |
| `src/app/community/write/page.tsx` | 글 작성 페이지                 |
| `src/app/community/[id]/page.tsx`  | 글 상세 페이지 (좋아요 + 댓글) |

---

## 과제 진행 순서

아래 순서대로 진행하는 것을 권장합니다. 각 단계를 완료한 뒤 `npm run dev`로 확인하면서 진행하세요.

```
[제공됨] 타입 정의 (post.ts) ─── 먼저 읽어보기
    │
    ▼
[제공됨] 데이터 함수 (mockData.ts) ─── 먼저 읽어보기
    │
    ▼
[Step 1] PostCard 컴포넌트 ─── 카드 UI 만들기
    │
    ▼
[Step 2] 커뮤니티 메인 페이지 ─── 목록 불러와서 PostCard로 보여주기
    │                               ✅ 여기서 중간 확인! 브라우저에서 /community 접속
    ▼
[Step 3] 글 작성 페이지 ─── 폼 만들고 localStorage에 저장
    │                        ✅ 여기서 중간 확인! 글 작성 후 목록에 나타나는지
    ▼
[Step 4] CommentItem 컴포넌트 ─── 댓글 UI 만들기
    │
    ▼
[Step 5] 글 상세 페이지 ─── 상세 보기 + 좋아요 + 댓글 기능
                             ✅ 최종 확인! 모든 기능 동작하는지
```

---

## Step 1: PostCard 컴포넌트 구현

> 파일: `src/components/PostCard.tsx` (껍데기 제공됨)

게시글 목록에서 각 게시글 하나를 보여주는 카드 컴포넌트입니다.

**표시할 정보:**

- 제목
- 작성자
- 작성일
- 좋아요 수
- 댓글 수 (`post.comments.length`)

**동작:**

- 카드 클릭 시 `/community/[id]`로 이동

**힌트:**

```typescript
// Next.js에서 페이지 이동
import { useRouter } from "next/navigation";

const router = useRouter();
router.push(`/community/${post.id}`);
```

---

## Step 2: 커뮤니티 메인 페이지 (글 목록)

> 파일: `src/app/community/page.tsx` (껍데기 제공됨)

**요구사항:**

- `"use client"` 선언 필수 (이미 되어있음)
- 페이지 진입 시 `getPosts()`로 게시글 목록 불러오기
- `PostCard` 컴포넌트를 사용해 게시글 렌더링
- "글 작성" 버튼 → `/community/write`로 이동

**핵심 개념:**

```typescript
"use client";
import { useState, useEffect } from "react";

// 컴포넌트 안에서:
const [posts, setPosts] = useState<Post[]>([]);

useEffect(() => {
    setPosts(getPosts());
}, []);
```

> **왜 `useEffect`를 쓰나요?**
> localStorage는 브라우저에서만 동작합니다. `useEffect`는 컴포넌트가 브라우저에 마운트된 후 실행되므로 안전하게 localStorage에 접근할 수 있습니다.

**여기까지 완료하면:** 브라우저에서 `http://localhost:3000/community`에 접속해서 mock 데이터(5개 게시글)가 카드로 보이는지 확인하세요!

---

## Step 3: 글 작성 페이지

> 파일: `src/app/community/write/page.tsx` (껍데기 제공됨)

**요구사항:**

- 제목 입력 (`input`)
- 내용 입력 (`textarea`)
- "작성" 버튼 클릭 시:
    1. 새로운 `Post` 객체 생성 (id는 `Date.now().toString()` 사용)
    2. `getPosts()`로 기존 목록 가져오기
    3. 새 글을 배열에 추가
    4. `savePosts()`로 저장
    5. `/community`로 이동

**힌트:**

```typescript
const newPost: Post = {
    id: Date.now().toString(),
    title: title,
    content: content,
    author: "익명", // 또는 입력받기
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
};
```

**여기까지 완료하면:** 글을 작성한 뒤 목록 페이지에 새 글이 나타나는지 확인하세요! 새로고침해도 유지되어야 합니다.

---

## Step 4: CommentItem 컴포넌트 구현

> 파일: `src/components/CommentItem.tsx` (껍데기 제공됨)

댓글 하나를 보여주는 컴포넌트입니다.

**표시할 정보:**

- 작성자
- 댓글 내용
- 작성 시간

---

## Step 5: 글 상세 페이지

> 파일: `src/app/community/[id]/page.tsx` (껍데기 제공됨)

이번 과제에서 가장 기능이 많은 페이지입니다. 아래 순서대로 하나씩 구현하세요.

### 5-1. 게시글 표시

- URL의 `id` 파라미터로 해당 게시글 찾기
- 게시글 제목, 내용, 작성자, 작성일 표시

```typescript
// App Router에서 동적 라우트 파라미터 가져오기
import { useParams } from "next/navigation";

const params = useParams();
const id = params.id as string;
```

### 5-2. 좋아요 기능 추가

- 좋아요 버튼 클릭 시:
    1. 해당 게시글의 `likes` +1
    2. `savePosts()`로 localStorage 업데이트
    3. `useState`로 화면 즉시 반영

### 5-3. 댓글 기능 추가

- 댓글 목록을 `CommentItem` 컴포넌트로 렌더링
- 댓글 입력창 + "댓글 작성" 버튼
- 버튼 클릭 시:
    1. 새 `Comment` 객체 생성
    2. 해당 게시글의 `comments` 배열에 추가
    3. `savePosts()`로 저장
    4. 화면 즉시 반영

**여기까지 완료하면:** 모든 기능이 동작하는지 최종 확인하세요!

---

## 폴더 구조 최종 형태

```
src/
├── app/
│   ├── community/
│   │   ├── page.tsx          ← 글 목록 (Step 2)
│   │   ├── write/
│   │   │   └── page.tsx      ← 글 작성 (Step 3)
│   │   └── [id]/
│   │       └── page.tsx      ← 글 상세 (Step 5)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── PostCard.tsx           ← 게시글 카드 (Step 1)
│   └── CommentItem.tsx        ← 댓글 아이템 (Step 4)
├── lib/
│   └── mockData.ts            ← [제공됨] localStorage 유틸 + 초기 데이터
└── types/
    └── post.ts                ← [제공됨] 타입 정의
```

---

## 상태 관리 요약

```
localStorage  ←→  useState
(영구 저장)       (화면 반영)
```

- **데이터를 읽을 때:** localStorage → useState에 저장 → 화면에 표시
- **데이터를 변경할 때:** useState 업데이트 (화면 반영) + localStorage 저장 (영구 보관)
- 이 두 가지를 **항상 같이** 해줘야 합니다!

---

## 체크리스트

구현을 완료했다면 아래 항목을 확인하세요.

- [ ] `/community` 접속 시 게시글 목록이 보인다
- [ ] 게시글 카드에 제목, 작성자, 작성일, 좋아요 수, 댓글 수가 표시된다
- [ ] 게시글 카드를 클릭하면 상세 페이지로 이동한다
- [ ] "글 작성" 버튼으로 작성 페이지에 진입할 수 있다
- [ ] 글 작성 후 목록에 새 글이 나타난다
- [ ] 새로고침해도 작성한 글이 유지된다 (localStorage)
- [ ] 상세 페이지에서 좋아요 버튼을 누르면 숫자가 올라간다
- [ ] 댓글을 작성하면 즉시 화면에 표시된다
- [ ] 댓글 수가 목록 페이지에서도 반영된다

---

## 제출 방법

1. 구현을 완료합니다
2. 변경한 파일들을 커밋합니다
3. 포크한 레포지토리에 push합니다
4. 원본 레포지토리로 Pull Request를 생성합니다
    - PR 제목: `[학번_이름] 2주차 과제 제출`

---

## 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [React useState](https://react.dev/reference/react/useState)
- [React useEffect](https://react.dev/reference/react/useEffect)
- [MDN localStorage](https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage)

---

## 막히면?

1. **`localStorage is not defined` 에러** → `"use client"` 선언했는지, `useEffect` 안에서 호출하는지 확인
2. **페이지 이동이 안 됨** → `useRouter`를 `next/navigation`에서 import했는지 확인
3. **새로고침하면 데이터가 사라짐** → `savePosts()` 호출을 빼먹지 않았는지 확인
4. **타입 에러** → `Post[]`나 `Comment[]` 타입을 제대로 import했는지 확인
5. **mock 데이터가 안 보임** → localStorage에 이전 데이터가 남아있을 수 있음. 브라우저 개발자 도구 > Application > Local Storage에서 "posts" 항목을 삭제하고 새로고침
