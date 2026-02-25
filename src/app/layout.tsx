import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import MusicPill from "./components/MusicPill"; // ✅ เพิ่มบรรทัดนี้

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
        {children}

        {/* ✅ ฝังเพลงทุกหน้า */}
        <MusicPill
          src="/music/song.mp3"
          title="Love in the Drak"
          cover="/music/cover.jpg"
          volume={0.2}
          loop
        />
      </body>
    </html>
  );
}