"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  title: string;
  artist: string;
  cover: string;
  volume?: number;
  loop?: boolean;
};

export default function MusicPill({ src, title, artist, cover, volume = 0.5, loop = false }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });

    audio.addEventListener("ended", () => {
      if (!loop) setPlaying(false);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [src, volume, loop]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      setPlaying(true);
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* Expanded panel */}
      {expanded && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-none"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.12)",
            borderLeft: "3px solid rgba(255,255,255,0.6)",
            minWidth: "240px",
          }}
        >
          {/* Cover */}
          <img
            src={cover}
            alt={title}
            className="w-10 h-10 object-cover flex-shrink-0"
            style={{ border: "1px solid rgba(255,255,255,0.15)", filter: "grayscale(30%)" }}
          />

          {/* Info + progress */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-bold uppercase tracking-widest truncate">{title}</p>
            <p className="text-white/40 text-[9px] uppercase tracking-widest truncate">{artist}</p>

            {/* Progress bar */}
            <div
              className="mt-2 h-[2px] w-full cursor-pointer"
              style={{ background: "rgba(255,255,255,0.1)" }}
              onClick={seek}
            >
              <div
                className="h-full"
                style={{ width: `${progress * 100}%`, background: "rgba(255,255,255,0.7)", transition: "width 0.1s linear" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Pill button */}
      <div className="flex items-center gap-2">
        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white/70 transition-colors px-2 py-1"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#000" }}
        >
          {expanded ? "HIDE" : "NOW PLAYING"}
        </button>

        {/* Play/Pause */}
        <button
          onClick={toggle}
          className="flex items-center justify-center transition-all"
          style={{
            width: "40px",
            height: "40px",
            background: playing ? "rgba(255,255,255,0.08)" : "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            color: playing ? "#fff" : "#000",
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            // Pause icon
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="2" width="4" height="10" />
              <rect x="8" y="2" width="4" height="10" />
            </svg>
          ) : (
            // Play icon
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <polygon points="3,1 13,7 3,13" />
            </svg>
          )}
        </button>
      </div>

      {/* Playing indicator dots */}
      {playing && (
        <div className="flex items-end gap-[3px] h-3 pr-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[2px] rounded-full"
              style={{
                background: "rgba(255,255,255,0.4)",
                height: "100%",
                animation: `musicBar 0.8s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
          <style>{`
            @keyframes musicBar {
              from { height: 30%; }
              to   { height: 100%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}