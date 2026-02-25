"use client";

import { useEffect, useState } from "react";

const partners = [{ name: "MEENPRO", href: "/meenpro", featured: true }];

export default function Page() {
  const text = "MEENPRO";
  const [typed, setTyped] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = 140;
    const deleteSpeed = 80;
    const pauseAfterType = 900;
    const pauseAfterDel = 300;

    let timeout: any;

    if (!deleting) {
      if (index < text.length) {
        timeout = setTimeout(() => {
          setTyped((prev) => prev + text[index]);
          setIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setDeleting(true), pauseAfterType);
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => {
          setTyped((prev) => prev.slice(0, -1));
        }, deleteSpeed);
      } else {
        timeout = setTimeout(() => {
          setDeleting(false);
          setIndex(0);
        }, pauseAfterDel);
      }
    }

    return () => clearTimeout(timeout);
  }, [index, deleting, typed]);

  return (
    <main className="flex-1">
      <section className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-sans selection:bg-white/20">
        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 animate-pulse-slow"
            style={{
              backgroundImage:
                "url(https://img2.pic.in.th/96d43ace-5695-4dd5-a501-2f20a44ecae4.jpg)",
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
                {typed}
                <span className="inline-block ml-2 w-1 md:w-2 h-10 md:h-16 lg:h-20 bg-white align-bottom mb-2 md:mb-4 animate-pulse" />
              </h1>

              <p className="text-xs md:text-sm text-white/40 uppercase tracking-[0.5em] md:tracking-[0.8em]">
                BORN OF MEENPRO
              </p>
            </div>

            {/* Emblem card */}
            <div className="relative w-full max-w-3xl aspect-video md:aspect-[2.5/1] bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm flex items-center justify-center overflow-hidden group my-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50 group-hover:opacity-80 transition-opacity duration-700" />
              <div className="relative w-40 h-40 md:w-56 md:h-56 lg:w-72 lg:h-72 transform group-hover:scale-105 transition-transform duration-700">
                <img
                  src="/uploads/meenpro.png"
                  alt="MEENPRO Emblem"
                  className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                />
              </div>
            </div>

            {/* ✅ ปุ่มเดียว */}
            <div className="flex flex-col items-center w-full mt-6 mb-2">
              <div className="flex justify-center items-center w-full max-w-7xl">
                {partners.map((p) => (
                  <a
                    key={p.name}
                    href={p.href}
                    className={[
                      "group relative flex flex-col items-center justify-center gap-1.5 rounded-xl overflow-hidden transition-all duration-300",
                      "w-full max-w-md md:max-w-xl h-24 md:h-32 bg-[#161616] border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:border-white/50 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] z-10",
                    ].join(" ")}
                  >
                    <div className="relative z-10 flex flex-col items-center">
                      <span className="font-bold uppercase tracking-wider text-center px-2 truncate w-full text-lg md:text-2xl text-white">
                        {p.name}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}