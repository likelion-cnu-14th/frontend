import { NextResponse } from "next/server";

type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  createdAt: number;
};

let posts: Post[] = [
  {
    id: "1",
    title: "첫 번째 글",
    content: "게시글 내용입니다.",
    likes: 0,
    createdAt: Date.now(),
  },
];

export async function GET(
  _request: Request,
  { params }: { params: { postId: string } }
) {
  const post = posts.find((p) => p.id === params.postId);

  if (!post) {
    return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { postId: string } }
) {
  const index = posts.findIndex((p) => p.id === params.postId);

  if (index === -1) {
    return NextResponse.json({ message: "게시글을 찾을 수 없습니다." }, { status: 404 });
  }

  posts.splice(index, 1);

  return NextResponse.json({ success: true });
}