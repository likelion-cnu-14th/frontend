export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author?: string;
  likeCount: number;
  commentCount: number;
}

export interface PostDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author?: string;
  likeCount: number;
  comments: Comment[];
}