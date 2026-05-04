"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import Header from "@/components/Header";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}