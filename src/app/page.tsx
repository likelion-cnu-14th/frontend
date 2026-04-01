import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold tracking-tight">스터디 커뮤니티</h1>
      <p className="mt-3 text-muted-foreground">자유롭게 소통하는 공간입니다</p>
      <Link
        href="/community"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
      >
        커뮤니티 바로가기 →
      </Link>
    </div>
  );
}
