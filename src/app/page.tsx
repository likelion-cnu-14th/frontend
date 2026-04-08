import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          커뮤니티에 오신 것을 환영합니다
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          게시글을 둘러보고, 글을 작성하고, 댓글로 소통해보세요.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/community"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            커뮤니티 바로가기
          </Link>
          <Link
            href="/community/write"
            className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            글 작성하러 가기
          </Link>
        </div>

        <div className="mt-6 rounded-lg bg-gray-50 px-4 py-3 text-left text-xs text-gray-600">
          <p className="font-medium text-gray-800">이동 흐름</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>목록 → 글 작성</li>
            <li>목록 → 글 상세</li>
            <li>글 작성 → 목록</li>
            <li>글 상세 → 목록</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
