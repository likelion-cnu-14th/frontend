 "use client";

import Link from "next/link";

export default function Home() {
  const px = { fontFamily: '"Press Start 2P", monospace' } as const;

  return (
    <main
      style={{
        ...px,
        minHeight: "100vh",
        background: "#fde047",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "48px",
        padding: "48px 24px",
      }}
    >
      {/* 히어로 이미지 */}
      <img
        src="/pixel-banner.png"
        alt="픽셀 아트 배너"
        style={{
          width: "100%",
          maxWidth: "580px",
          border: "3px solid #000",
          boxShadow: "6px 6px 0 #000",
          display: "block",
        }}
      />

      {/* 기능 카드 3개 */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          width: "100%",
          maxWidth: "720px",
        }}
      >
        {[
          { title: "글 작성", desc: "새 글을 올려 내 생각과 정보를 커뮤니티에 공유하세요.", bg: "#fff" },
          { title: "글 읽기", desc: "최신 게시글을 둘러보고 다양한 사람들의 이야기를 확인하세요.", bg: "#fff" },
          { title: "댓글 달기", desc: "게시글 상세 화면에서 댓글을 남겨 대화에 참여할 수 있습니다.", bg: "#fff" },
        ].map((card) => (
          <article
            key={card.title}
            style={{
              background: card.bg,
              border: "3px solid #000",
              boxShadow: "4px 4px 0 #000",
              padding: "20px",
            }}
          >
            <h2 style={{ ...px, fontSize: "10px", color: "#000", marginBottom: "14px" }}>
              {card.title}
            </h2>
            <p style={{ ...px, fontSize: "7px", color: "#555", lineHeight: 2.4 }}>
              {card.desc}
            </p>
          </article>
        ))}
      </section>

      {/* 버튼 */}
      <section style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/community/write"
          style={{
            ...px,
            fontSize: "10px",
            background: "#93c5fd",  // 피그마 파란색
            color: "#000",
            border: "3px solid #000",
            boxShadow: "4px 4px 0 #000",
            padding: "16px 28px",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "2px 2px 0 #000";
            e.currentTarget.style.transform = "translate(2px,2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "4px 4px 0 #000";
            e.currentTarget.style.transform = "translate(0,0)";
          }}
        >
          ✏ 글쓰기
        </Link>
        <Link
          href="/community"
          style={{
            ...px,
            fontSize: "10px",
            background: "#a855f7",  // 피그마 보라색
            color: "#fff",
            border: "3px solid #000",
            boxShadow: "4px 4px 0 #000",
            padding: "16px 28px",
            textDecoration: "none",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "2px 2px 0 #000";
            e.currentTarget.style.transform = "translate(2px,2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "4px 4px 0 #000";
            e.currentTarget.style.transform = "translate(0,0)";
          }}
        >
          커뮤니티 입장
        </Link>
      </section>
    </main>
  );
}