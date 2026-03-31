export type CommunityComment = {
  id: string;
  text: string;
  createdAt: number; // epoch ms
  updatedAt?: number; // epoch ms
};

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
  comments: CommunityComment[];
  likesCount: number;
};

