"use client";

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
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
        background: "#fde047",
      }}
    >
      <Navbar />
      <main 
        style={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          paddingTop: isHome ? 0 : "64px" 
        }}
      >
        {children}
      </main>
    </div>
  );
}



