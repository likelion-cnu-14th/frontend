import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?limit=1`);
  return NextResponse.json({ ok: res.ok, timestamp: new Date().toISOString() });
}
