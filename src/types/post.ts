// 댓글 한 건을 저장하는 기본 형식입니다.
// 이 형식이 맞아야 화면에서 작성자/내용/시간을 안정적으로 표시할 수 있습니다.
export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// 게시글 한 건의 데이터 형식입니다.
// 커뮤니티 목록/상세 화면이 이 구조를 기준으로 동작하므로,
// 필드가 빠지거나 이름이 바뀌면 사용자 화면에서 정보가 보이지 않을 수 있습니다.
export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: Comment[];
}
