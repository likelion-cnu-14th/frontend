import type { Metadata } from "next";
import "./globals.css";
import AppShell from "./AppShell";

// 사이트 기본 정보입니다. 브라우저 탭 제목/검색 요약에 사용됩니다.
export const metadata: Metadata = {
  title: "App",
  description: "",
};

// 모든 페이지에 공통으로 적용되는 바깥 레이아웃입니다.
// 상단/하단 이동 링크를 한곳에서 관리해 사용자가 어디서든 주요 기능으로 이동할 수 있게 합니다.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
