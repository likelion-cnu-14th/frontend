import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f7fa] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
          <div className="relative flex items-center justify-center">
            <div className="pointer-events-none absolute -top-3 left-1/2 h-[220px] w-[220px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="pointer-events-none absolute top-0 left-1/2 h-[140px] w-[140px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-xl" />
            <Image
              src="/fish.png"
              alt="커뮤니티 로고"
              width={677}
              height={369}
              priority
              className="relative w-[220px] sm:w-[320px] h-auto object-contain"
              sizes="(min-width: 640px) 320px, 220px"
            />
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-wide text-gray-900 sm:text-5xl">
            WELCOME!
          </h1>
          <p className="mt-3 text-base font-semibold text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
            커뮤니티에 오신 것을 환영합니다
          </p>

          <div className="mt-8">
            <Link
              href="/community"
              className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              커뮤니티 바로가기
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
