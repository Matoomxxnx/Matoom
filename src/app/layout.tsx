import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Orbitron } from "next/font/google";
import dynamic from "next/dynamic";
import PageEnterLoader from "./components/PageEnterLoader";

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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className="dark">
      <body className={`${orbitron.className} antialiased bg-black text-white min-h-screen flex flex-col`}>
        <PageEnterLoader>{children}</PageEnterLoader>

        <MusicPill
          src="/music/song.mp3"
          title="One Of The Girls"
          artist="The Weeknd"
          cover="/music/cover.jpg"
          volume={0.2}
          loop
        />
      </body>
    </html>
  );
}