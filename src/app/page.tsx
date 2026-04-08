 "use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const px = { fontFamily: '"Press Start 2P", cursive' } as const;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main
      style={{
        ...px,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fde047 0%, #facc15 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "40px",
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          animation: "float 3s ease-in-out infinite",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <img
          src="/pixel-banner.png"
          alt="픽셀 아트 배너"
          style={{
            width: "100%",
            maxWidth: "500px",
            border: "4px solid #000",
            boxShadow: "8px 8px 0 #000",
            imageRendering: "pixelated",
          }}
        />
        
        <h1 
          style={{ 
            fontSize: "24px", 
            color: "#000", 
            lineHeight: "1.5",
            textShadow: "2px 2px 0 #fff",
            margin: "20px 0 10px"
          }}
        >
          PIXEL<br />COMMUNITY
        </h1>
        
        <p style={{ fontSize: "10px", color: "#444", maxWidth: "400px", lineHeight: "2" }}>
          환영합니다! 이곳에서 여러분의 일상을<br />
          픽셀처럼 아름답게 공유해보세요.
        </p>
      </div>

      <Link
        href="/community"
        style={{
          ...px,
          fontSize: "14px",
          background: "#a855f7",
          color: "#fff",
          border: "4px solid #000",
          boxShadow: "6px 6px 0 #000",
          padding: "20px 40px",
          textDecoration: "none",
          transition: "all 0.1s",
          marginTop: "20px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "3px 3px 0 #000";
          e.currentTarget.style.transform = "translate(3px,3px)";
          e.currentTarget.style.background = "#9333ea";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "6px 6px 0 #000";
          e.currentTarget.style.transform = "translate(0,0)";
          e.currentTarget.style.background = "#a855f7";
        }}
      >
        커뮤니티 입장하기
      </Link>
    </main>
  );
}
