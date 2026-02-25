import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";

// ✅ แนะนำให้ import แบบ dynamic เพื่อกัน SSR/กันซ้อนแปลก ๆ
import dynamic from "next/dynamic";
const MusicPill = dynamic(() => import("./components/MusicPill"), { ssr: false });

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MEENPRO",
  description: "BORN OF MEENPRO",
  openGraph: {
    title: "MEENPRO",
    description: "BORN OF MEENPRO",
    images: ["/uploads/meenpro.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png", // ถ้ามีไฟล์นี้
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body
        className={`${orbitron.className} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        {/* เนื้อหาหน้า */}
        {children}

        {/* ✅ ฝังเพลงทุกหน้า (ตัวเดียวพอ ห้ามไปใส่ซ้ำใน page อื่น) */}
        <MusicPill
          src="/music/song.mp3"
          title="LOVE IN THE DARK"
          artist="KINGMEENPRO"
          cover="/music/cover.jpg"
          volume={0.2}
          loop
        />
      </body>
    </html>
  );
}