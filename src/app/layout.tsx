import type { Metadata } from "next";
import { Noto_Sans_KR, Outfit } from "next/font/google";
import "./globals.css";
import AppShell from "./AppShell";

const notoLinesKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

// 사이트 기본 정보입니다. 브라우저 탭 제목/검색 요약에 사용됩니다.
export const metadata: Metadata = {
  title: "STUDYROOM | 스터디룸 예약 시스템",
  description: "최고의 스터디 공간을 예약하세요.",
};

// 모든 페이지에 공통으로 적용되는 바깥 레이아웃입니다.
// 상단/하단 이동 링크를 한곳에서 관리해 사용자가 어디서든 주요 기능으로 이동할 수 있게 합니다.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoLinesKR.variable} ${outfit.variable}`}>
      <body className="antialiased" style={{ margin: 0, fontFamily: "var(--font-noto-sans-kr), sans-serif" }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
