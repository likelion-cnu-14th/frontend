export type Comment = {
  id: string | number
  author: string
  content: string
  createdAt: string | Date
}

export type Post = {
  id: string | number
  title: string
  content: string
  author: string
  createdAt: string | Date
  likesCount: number
  comments: Comment[]
}

