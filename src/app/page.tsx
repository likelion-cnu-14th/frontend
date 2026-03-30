import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <MessageCircle className="mb-4 h-12 w-12 text-primary" />
      <h1 className="mb-2 text-3xl font-bold">스터디 커뮤니티</h1>
      <p className="mb-8 text-muted-foreground">
        자유롭게 소통하고, 함께 성장하는 공간입니다.
      </p>
      <Link
        href="/community"
        className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        커뮤니티 입장하기
      </Link>
    </div>
  );
}
