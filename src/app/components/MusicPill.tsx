"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
  artist?: string;
  cover: string;
  volume?: number; // 0-1
  loop?: boolean;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MusicPill({
  src,
  title,
  artist = "MEENPRO",
  cover,
  volume = 0.2,
  loop = true,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [dur, setDur] = useState(0);
  const [cur, setCur] = useState(0);

  // UI states
  const [open, setOpen] = useState(false); // เปิดการ์ดใหญ่
  const [minimized, setMinimized] = useState(true); // เริ่มแบบ pill

  // restore basic state
  useEffect(() => {
    try {
      const saved = localStorage.getItem("music_ui_v2");
      if (saved) {
        const j = JSON.parse(saved);
        if (typeof j.playing === "boolean") setPlaying(j.playing);
        if (typeof j.time === "number") setCur(j.time);
        if (typeof j.open === "boolean") setOpen(j.open);
        if (typeof j.minimized === "boolean") setMinimized(j.minimized);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "music_ui_v2",
        JSON.stringify({ playing, time: cur, open, minimized })
      );
    } catch {}
  }, [playing, cur, open, minimized]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = volume;
    a.loop = loop;

    // restore time
    if (Number.isFinite(cur) && cur > 0) {
      try {
        a.currentTime = cur;
      } catch {}
    }

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onLoaded = () => setDur(a.duration || 0);
    const onTime = () => setCur(a.currentTime || 0);
    const onEnded = () => setPlaying(false);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);

    // ถ้าเคยเล่นไว้ จะลองเล่นต่อ (browser บางตัว block autoplay ก็ไม่เป็นไร)
    if (playing) a.play().catch(() => {});

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (a.paused) await a.play();
      else a.pause();
    } catch {}
  };

  const progress = useMemo(() => {
    if (!dur) return 0;
    return Math.min(100, Math.max(0, (cur / dur) * 100));
  }, [cur, dur]);

  // click pill -> open card
  const openCard = () => {
    setMinimized(false);
    setOpen(true);
  };

  // minimize card -> pill
  const minimizeCard = () => {
    setOpen(false);
    setMinimized(true);
  };

  // close overlay (ยังคงเป็น pill)
  const closeOverlayToPill = () => {
    setOpen(false);
    setMinimized(true);
  };

  return (
    <>
      {/* ✅ ซ่อน audio เหมือนที่คุณต้องการ */}
      <audio ref={audioRef} src={src} preload="auto" style={{ display: "none" }} />

      {/* ✅ Overlay เวลาเปิดการ์ดใหญ่ (คลิกพื้นหลังเพื่อปิด) */}
      {open && !minimized ? (
        <div
          className="fixed inset-0 z-[998] bg-black/30 backdrop-blur-[2px]"
          onClick={closeOverlayToPill}
        />
      ) : null}

      {/* ✅ ตัว UI ลอยมุมขวาล่าง */}
      <div className="fixed bottom-6 right-6 z-[999] font-sans select-none w-[92vw] sm:w-auto">
        {/* ===== Pill (ย่อ) ===== */}
        {minimized ? (
          <div className="ml-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={openCard}
              className="bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 p-1.5 md:pl-1 md:pr-5 md:py-1 rounded-full flex items-center gap-3 cursor-pointer group shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-white/20 transition-all w-full sm:w-auto"
              aria-label="open music player"
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
                <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate max-w-[160px]">
                  {title}
                </span>
              </div>

              {/* ปุ่มเล่น/หยุดใน pill (ไม่เปิดการ์ด) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="ml-auto md:ml-2 w-9 h-9 rounded-full bg-white/10 border border-white/10 hover:bg-white/15 grid place-items-center"
                aria-label={playing ? "pause" : "play"}
              >
                {playing ? (
                  <div className="flex gap-1">
                    <span className="w-1 h-4 bg-white rounded" />
                    <span className="w-1 h-4 bg-white rounded" />
                  </div>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
                    <path fill="currentColor" d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </button>
          </div>
        ) : null}

        {/* ===== Expanded Card (เปิด) ===== */}
        {!minimized && open ? (
          <div
            className="ml-auto w-full sm:w-[380px] rounded-3xl bg-white/[0.06] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)] overflow-hidden backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-white/60">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <span>NOW PLAYING</span>
              </div>

              <button
                type="button"
                onClick={minimizeCard}
                className="text-white/40 hover:text-white/70 transition p-2 -m-2"
                aria-label="minimize"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M7 10l5 5l5-5z" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-[56px] h-[56px] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img src={cover} alt="cover" className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <div className="text-[14px] font-semibold tracking-[0.12em] uppercase truncate">
                    {title}
                  </div>
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/55 truncate mt-1">
                    {artist}
                  </div>
                </div>
              </div>

              {/* progress */}
              <div className="mt-5">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/85" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                  <span>{formatTime(cur)}</span>
                  <span>{formatTime(dur)}</span>
                </div>
              </div>

              {/* controls */}
              <div className="mt-4 flex items-center justify-between">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    const a = audioRef.current;
                    if (a) a.volume = v;
                  }}
                  className="w-[150px] accent-white"
                />

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-white text-black grid place-items-center shadow-[0_10px_30px_rgba(255,255,255,0.18)] hover:scale-[1.03] active:scale-[0.98] transition"
                  aria-label={playing ? "pause" : "play"}
                  type="button"
                >
                  {playing ? (
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-6 bg-black rounded" />
                      <span className="w-1.5 h-6 bg-black rounded" />
                    </div>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}