"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type MusicPillProps = {
  title: string;
  artist: string;
  coverSrc: string;   // เช่น `/covers/meeninmyheart.jpg`
  audioSrc: string;   // เช่น `/music/meeninmyheart.mp3`
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MusicPill({ title, artist, coverSrc, audioSrc }: MusicPillProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.7);

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (current / duration) * 100));
  }, [current, duration]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (isPlaying) {
        a.pause();
        setIsPlaying(false);
      } else {
        await a.play();
        setIsPlaying(true);
      }
    } catch {
      // autoplay ถูกบล็อก หรือไฟล์ไม่พร้อม
    }
  };

  const onLoaded = () => {
    const a = audioRef.current;
    if (!a) return;
    setDuration(a.duration || 0);
  };

  const onTime = () => {
    const a = audioRef.current;
    if (!a) return;
    setCurrent(a.currentTime || 0);
  };

  const seek = (clientX: number, bar: HTMLDivElement) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const next = Math.min(duration, Math.max(0, ratio * duration));
    a.currentTime = next;
    setCurrent(next);
  };

  return (
    <div className="w-[340px] max-w-[92vw] rounded-3xl bg-white/[0.06] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)] overflow-hidden">
      {/* top */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-white/60">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
          <span>NOW PLAYING</span>
        </div>

        <button
          className="p-2 rounded-full hover:bg-white/10 transition"
          aria-label="more"
          onClick={() => {}}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
            <path fill="currentColor" d="M7 10l5 5l5-5z" />
          </svg>
        </button>
      </div>

      {/* body */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-[58px] h-[58px] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
            <img src={coverSrc} alt="cover" className="w-full h-full object-cover" />
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
          <div
            className="h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer"
            onMouseDown={(e) => {
              const bar = e.currentTarget;
              seek(e.clientX, bar);
            }}
          >
            <div
              className="h-full bg-white/85"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* controls */}
        <div className="mt-4 flex items-center justify-between">
          {/* volume */}
          <div className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/60">
              <path
                fill="currentColor"
                d="M14 3.23v17.54c0 .62-.7.98-1.2.63L7.5 17H4c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h3.5l5.3-4.4c.5-.35 1.2.01 1.2.63z"
              />
            </svg>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-[120px] accent-white"
            />
          </div>

          {/* play */}
          <button
            onClick={toggle}
            className="w-14 h-14 rounded-full bg-white text-black grid place-items-center shadow-[0_10px_30px_rgba(255,255,255,0.18)] hover:scale-[1.03] active:scale-[0.98] transition"
            aria-label={isPlaying ? "pause" : "play"}
            type="button"
          >
            {isPlaying ? (
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

      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTime}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}