"use client";

import { useEffect, useState } from "react";
import MusicPill from "./components/MusicPill";
import MusicPlayerCard from "./components/MusicPill";

const partners = [
  { name: "GODYOUKNOW", href: "/godyouknow" },
  { name: "KODOMO", href: "/kodomo" },
  { name: "WINTERFELL VEGA", href: "/vega", featured: true },
  { name: "THREETHOUSAND", href: "/threethousand" },
  { name: "WELLESLEY", href: "/wellesley" },
];

export default function Page() {
  // ✅ เพิ่มแค่นี้: typewriter
  const text = "MEENPRO";
  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setTyped((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <main className="flex-1">
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
        {/* Floating music */}
        {/* (เดิมมึงมี / อยู่ตรงนี้ กูเอาออก เพราะมันทำให้ไฟล์พัง) */}

        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 animate-pulse-slow"
            style={{
              backgroundImage:
                "url(https://pub-7827a1beaea74d1bb210e941351e7a23.r2.dev/bg.PNG)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]/90 z-10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)] z-20" />
        </div>

        <div className="relative z-10 flex flex-col items-center w-full max-w-[1600px] px-4 py-6 h-full">
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {/* Title */}
            <div className="flex flex-col items-center text-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/90 mb-3 min-h-[1.2em]">
                {/* ✅ เปลี่ยนแค่ตรงนี้: MEENPRO -> typed */}
                {typed}{" "}
                <span className="inline-block ml-2 w-1 md:w-2 h-10 md:h-16 lg:h-20 bg-white align-bottom mb-2 md:mb-4" />
              </h1>
              <p className="text-xs md:text-sm text-white/40 uppercase tracking-[0.5em] md:tracking-[0.8em]">
                BORN OF MEENPRO
              </p>
            </div>

            {/* Emblem card */}
            <div className="relative w-full max-w-3xl aspect-video md:aspect-[2.5/1] bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden group my-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 transform group-hover:scale-105 transition-transform duration-700">
                {/* ใส่ไฟล์ที่ public/uploads/Vega.png */}
                <img
                  src="/uploads/meenpro.png"
                  alt="WINTERFELL VEGA Emblem"
                  className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                />
              </div>
            </div>

            {/* Partner buttons */}
            <div className="flex flex-col items-center w-full mt-6 mb-2">
              <div className="grid grid-cols-2 md:flex md:flex-nowrap justify-center items-center gap-4 w-full max-w-7xl">
                {partners.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    className={[
                      "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl overflow-hidden transition-all duration-300",
                      p.featured
                        ? "col-span-2 md:w-80 h-24 md:h-32 bg-[#161616] border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] z-10"
                        : "col-span-1 md:w-52 h-20 md:h-24 bg-[#111] border border-white/5 hover:border-white/20 opacity-80 hover:opacity-100",
                    ].join(" ")}
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <span
                        className={[
                          "font-bold uppercase tracking-wider transition-colors text-center px-1 truncate w-full",
                          p.featured
                            ? "text-lg md:text-2xl text-white"
                            : "text-xs md:text-sm text-white/60 group-hover:text-white",
                        ].join(" ")}
                      >
                        {p.name}
                      </span>
                      <span className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-[0.2em] mt-0.5">
                        Partner
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="w-full py-4 border-t border-white/5 text-center mt-auto">
            <p className="text-[10px] text-white/20 uppercase tracking-[0.2em]">
              System Design by{"  "}
              <a
                href="https://www.facebook.com/matoom1123"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 font-bold hover:text-white/60 transition-colors"
              >
                Matoom Wellesley
              </a>
            </p>
          </footer>
        </div>
      </section>

      <div className="fixed right-1 bottom-10 md:right-2 md:bottom-2 z-[9999]">
        <MusicPlayerCard
          audioSrc="/music/song.mp3"
          title="LOVE IN THE DARK"
          artist="ADELE"
          coverUrl="https://lyricsthaiblog.files.wordpress.com/2017/10/hello.jpg"
          defaultVolume={0.25}
        />
      </div>
    </main>
  );
}