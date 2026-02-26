import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import MusicPill from "./components/MusicPill";
import PageEnterLoader from "./components/PageEnterLoader";

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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body
        className={`${orbitron.className} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        {/* ✅ ครอบ children ด้วย Loader */}
        <PageEnterLoader>
          {children}
        </PageEnterLoader>

        {/* ✅ เพลงทุกหน้า (มีตัวเดียวพอ) */}
        <MusicPill
          src="/music/song.mp3"
          title="One Of The Girls"
          artist="The Weeknd"
          cover="/music/cover.jpg"
          volume={0.2}
          loop
        />

        {/* ✅ Footer แบบติดล่าง ไม่เลื่อน */}
        <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
          <div className="mx-auto w-[80%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="py-4 text-center">
            <p className="text-[11px] tracking-[0.45em] uppercase text-white/25 pointer-events-auto">
              SYSTEM DESIGN BY{" "}
              <a
                href="https://www.facebook.com/matoom1123"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/45 font-semibold hover:text-white transition"
              >
                Matoom Wellesley
              </a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}