"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const px = { fontFamily: '"Press Start 2P", cursive' } as const;

  // Don't show navbar on the home page if we want a clean splash screen
  // Actually, for "Navigation Cleanup", it's usually better to have it available or at least on subpages.
  if (pathname === "/") return null;

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "64px",
        background: "#fff",
        borderBottom: "4px solid #000",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 1000,
        ...px,
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "12px",
          color: "#000",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        PIXEL
      </Link>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          href="/community"
          style={{
            fontSize: "10px",
            color: pathname === "/community" ? "#a855f7" : "#000",
            textDecoration: "none",
          }}
        >
          COMMUNITY
        </Link>
        <Link
          href="/community/write"
          style={{
            fontSize: "10px",
            color: pathname === "/community/write" ? "#a855f7" : "#000",
            textDecoration: "none",
          }}
        >
          WRITE
        </Link>
      </div>
    </nav>
  );
}
