export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
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
}

export interface CreateCommentRequest {
  content: string;
}
