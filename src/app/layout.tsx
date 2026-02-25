"use client";

import "./globals.css";
import { ReactNode, useRef, useState, useEffect } from "react";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      await a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <html lang="th" className="dark">
      <body className={`${orbitron.className} bg-black text-white min-h-screen`}>
        {children}

        {/* 🎵 audio */}
        <audio ref={audioRef} src="/music/song.mp3" loop />

        {/* 🎧 UI เพลงแบบง่าย ติดมุมขวาล่าง */}
        <div className="fixed bottom-24 right-6 z-50">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
            <div className="flex items-center gap-4">
              <img
                src="/music/cover.jpg"
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide">
                  KMP IN MY HEART
                </p>
                <p className="text-xs text-white/50">KINGMEENPRO</p>
              </div>
              <button
                onClick={toggle}
                className="w-10 h-10 rounded-full bg-white text-black grid place-items-center"
              >
                {playing ? "❚❚" : "▶"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer แบบไม่เลื่อน */}
        <div className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
          <div className="mx-auto w-[80%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="py-4 text-center">
            <p className="text-[11px] tracking-[0.45em] uppercase text-white/25">
              SYSTEM DESIGN BY{" "}
              <span className="text-white/45 font-semibold">MALI CLOUD</span>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}