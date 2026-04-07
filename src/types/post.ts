export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  likes: number;
  createdAt: string;
  // 서버 규칙: 목록을 볼 때는 '댓글 개수(commentCount)'만 주고,
  // 상세 페이지를 볼 때는 '진짜 댓글들(comments)'을 줍니다!
  commentCount?: number; 
  comments?: Comment[];
}

