"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff", // Changed from yellow to white for modern look
      }}
    >
      <Header />
      <main 
        style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          paddingTop: "80px" // Adjusted for new header height
        }}
      >
        {children}
      </main>
    </div>
  );
}



