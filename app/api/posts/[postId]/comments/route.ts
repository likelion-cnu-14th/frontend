import { NextResponse } from "next/server";

type Comment = {
  id: string;
  postId: string;
  content: string;
  createdAt: number;
};

let comments: Comment[] = [];

export async function GET(
  _request: Request,
  { params }: { params: { postId: string } }
) {
  const postComments = comments.filter((c) => c.postId === params.postId);
  return NextResponse.json(postComments);
}

export async function POST(
  request: Request,
  { params }: { params: { postId: string } }
) {
  const body = await request.json();
  const content = String(body.content ?? "").trim();

  if (!content) {
    return NextResponse.json({ message: "댓글 내용을 입력해주세요." }, { status: 400 });
  }

  const newComment: Comment = {
    id: crypto.randomUUID(),
    postId: params.postId,
    content,
    createdAt: Date.now(),
  };

  comments.push(newComment);

  return NextResponse.json(newComment, { status: 201 });
}