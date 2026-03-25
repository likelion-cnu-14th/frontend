import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Web tutorials",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", geist.variable)}>
      <body>
        <h1>
          <Link href="/">WEB</Link>
        </h1>
        <ol>
          <li>
            <Link href="/read/1">html</Link>
          </li>
          <li>
            <Link href="/read/2">css</Link>
          </li>
        </ol>
        {children}
        <ul>
          <li>
            <Link href="/create">Create</Link>
          </li>
          <li>
            <Link href="/update">Update</Link>
          </li>
          <li>
            <input type="button" value="delete" />
          </li>
        </ul>
      </body>
    </html>
  );
}
