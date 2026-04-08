// 댓글 한 건을 저장하는 기본 형식입니다.
// 이 형식이 맞아야 화면에서 작성자/내용/시간을 안정적으로 표시할 수 있습니다.
export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// 목록과 상세가 공유하는 게시글 본문·메타 정보입니다.
// 필드가 빠지면 목록·상세 어디서든 정보가 비거나 깨질 수 있습니다.
export interface PostBase {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

// GET /posts 목록 한 건입니다. 서버는 댓글 전체 목록 대신 개수만 내려줍니다(목록 부담·용량 절감).
// 화면에서는 commentCount로 댓글 수만 보여주면 됩니다.
export interface PostListItem extends PostBase {
  commentCount: number;
}

// GET /posts/:id 상세 한 건입니다. 댓글을 읽고 달 수 있게 comments 배열이 포함됩니다.
export interface Post extends PostBase {
  comments: Comment[];
}
