"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;          // ไฟล์เพลง เช่น "/music/song.mp3"
  title: string;        // ชื่อเพลง
  cover: string;        // รูปปก (URL หรือไฟล์ใน public)
  volume?: number;      // 0-1
  loop?: boolean;
};

export default function MusicPill({
  src,
  title,
  cover,
  volume = 0.2,
  loop = true,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // ✅ จำสถานะเล่น/ไม่เล่น + เวลาเล่น (optional แต่ช่วยให้ต่อเนื่องแม้รีเฟรชบางกรณี)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("music_pill_v1");
      if (saved) {
        const j = JSON.parse(saved);
        if (typeof j.playing === "boolean") setPlaying(j.playing);
        if (typeof j.time === "number" && audioRef.current) audioRef.current.currentTime = j.time;
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = volume;
    a.loop = loop;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      try {
        localStorage.setItem(
          "music_pill_v1",
          JSON.stringify({ playing: !a.paused, time: a.currentTime || 0 })
        );
      } catch {}
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("timeupdate", onTime);

    // ถ้าเคยเล่นไว้ก่อนหน้า ให้ลอง play (ถ้า browser block ก็ไม่เป็นไร)
    if (playing) a.play().catch(() => {});

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("timeupdate", onTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) await a.play();
      else a.pause();
    } catch {}
  };

  return (
    <>
      {/* ✅ ซ่อน audio เหมือนใน HTML ที่คุณแปะ */}
      <audio ref={audioRef} src={src} preload="auto" style={{ display: "none" }} />

      {/* ✅ Pill ลอยมุมขวาล่าง */}
      <div className="fixed bottom-6 right-6 z-[999] font-sans select-none">
        <button
          type="button"
          onClick={toggle}
          className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-1.5 md:pl-1 md:pr-5 md:py-1 rounded-full flex items-center gap-3 cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all"
          aria-label={playing ? "pause music" : "play music"}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full relative overflow-hidden ring-2 ring-white/5 group-hover:ring-white/20 transition-all">
              <img
                src={cover}
                alt={title}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                {playing ? (
                  <div className="flex gap-1">
                    <span className="w-1 h-4 bg-white rounded" />
                    <span className="w-1 h-4 bg-white rounded" />
                  </div>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" className="text-white">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col text-left">
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">
              Music
            </span>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate max-w-[140px]">
              {title}
            </span>
          </div>
        </button>
      </div>
    </>
  );
}