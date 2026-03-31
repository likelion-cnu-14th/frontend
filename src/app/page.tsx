import Link from "next/link";

// 서비스 첫 화면입니다.
// 방문자가 "글 작성, 글 읽기, 댓글 참여" 흐름을 바로 이해하도록 핵심 기능을 안내합니다.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-3xl flex-col justify-center gap-8 px-6 py-12">
      <section className="space-y-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          글을 쓰고, 읽고, 댓글로 소통하는 커뮤니티
        </h1>
        <p className="text-base text-gray-600 sm:text-lg">
          게시글을 작성하고 다른 사람의 글을 읽은 뒤 댓글로 대화에 참여할 수 있는
          공간입니다.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">글 작성</h2>
          <p className="mt-2 text-sm text-gray-600">
            새 글을 올려 내 생각과 정보를 커뮤니티에 공유하세요.
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">글 읽기</h2>
          <p className="mt-2 text-sm text-gray-600">
            최신 게시글을 둘러보고 다양한 사람들의 이야기를 확인하세요.
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">댓글 달기</h2>
          <p className="mt-2 text-sm text-gray-600">
            게시글 상세 화면에서 댓글을 남겨 대화에 참여할 수 있습니다.
          </p>
        </article>
      </section>

      <section className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/community/write"
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
        >
          글 작성하러 가기
        </Link>
        <Link
          href="/community"
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-800 transition hover:bg-gray-50 sm:w-auto"
        >
          글 읽으러 가기
        </Link>
      </section>
    </main>
  );
}
