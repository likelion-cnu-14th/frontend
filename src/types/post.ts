export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface PostBase {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
}

export interface PostListItem extends PostBase {
  commentCount: number;
}

export interface PostDetail extends PostBase {
  comments: Comment[];
}

export interface CreatePostRequest {
  title: string;
  content: string;
  author: string;
}

export interface CreateCommentRequest {
  content: string;
  author: string;
}
