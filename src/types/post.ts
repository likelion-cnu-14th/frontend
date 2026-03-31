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
  createdAt: string;
  likes: number;
  comments: Comment[];
}
