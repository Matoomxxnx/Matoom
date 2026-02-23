"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, ChevronDown, Volume2 } from "lucide-react";

type Props = {
  audioSrc: string;
  title: string;
  artist: string;
  coverUrl: string;
  defaultVolume?: number;
  className?: string;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayerCard({
  audioSrc,
  title,
  artist,
  coverUrl,
  defaultVolume = 0.25,
  className = "",
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(defaultVolume);

  const currentLabel = useMemo(() => formatTime(current), [current]);
  const durationLabel = useMemo(() => formatTime(duration), [duration]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.preload = "auto";
    a.loop = true;
    a.volume = defaultVolume;

    const onLoaded = () => {
      setDuration(a.duration || 0);
      setReady(true);
    };
    const onTime = () => setCurrent(a.currentTime || 0);

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
    };
  }, [defaultVolume]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      if (playing) {
        a.pause();
        setPlaying(false);
      } else {
        await a.play();
        setPlaying(true);
      }
    } catch {
      alert("เบราว์เซอร์บล็อกการเล่นอัตโนมัติ กรุณากด Play อีกครั้ง");
      setPlaying(false);
    }
  };

  const progressPct = duration ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
  const volumePct = Math.min(100, Math.max(0, volume * 100));

  const seekToPct = (pct: number) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const t = (pct / 100) * duration;
    a.currentTime = t;
    setCurrent(t);
  };

  return (
    <div className={className}>
      <audio ref={audioRef} src={audioSrc} playsInline />

      <div
        className={[
          "w-[320px] md:w-[340px] max-w-[92vw]",
          "rounded-[26px]",
          "border border-white/10",
          "bg-[#0a0a0a]/70",
          "backdrop-blur-2xl",
          "shadow-[0_24px_90px_rgba(0,0,0,0.75)]",
          "ring-1 ring-white/5",
          "overflow-hidden",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.25)]" />
            <span className="text-[11px] tracking-[0.28em] font-semibold text-white/50">
              NOW PLAYING
            </span>
          </div>

          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded-full hover:bg-white/5 transition"
            aria-label="Toggle"
          >
            <ChevronDown
              className={[
                "h-4 w-4 text-white/55 transition-transform",
                collapsed ? "rotate-180" : "rotate-0",
              ].join(" ")}
            />
          </button>
        </div>

        {/* Collapsed */}
        {collapsed ? (
          <button
            onClick={togglePlay}
            className="w-full px-5 py-4 flex items-center gap-3 hover:bg-white/5 transition"
          >
            <div className="h-11 w-11 rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
            </div>

            <div className="min-w-0 flex-1 text-left">
              <div className="text-[12px] font-bold tracking-wide text-white truncate uppercase">
                {title}
              </div>
              <div className="text-[10px] font-semibold tracking-[0.18em] text-white/45 truncate uppercase">
                {artist}
              </div>
            </div>

            <div className="h-11 w-11 rounded-full bg-white text-black grid place-items-center">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </div>
          </button>
        ) : (
          <div className="px-5 pb-5">
            {/* Track row */}
            <div className="mt-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img src={coverUrl} alt={title} className="h-full w-full object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-extrabold tracking-[0.08em] text-white truncate uppercase">
                  {title}
                </div>
                <div className="mt-1 text-[11px] font-semibold tracking-[0.22em] text-white/45 truncate uppercase">
                  {artist}
                </div>
              </div>

              <button
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-white text-black grid place-items-center hover:scale-[1.04] active:scale-[0.98] transition"
                aria-label={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </button>
            </div>

            {/* Progress */}
            <div className="mt-4">
              <input
                className="sp-range"
                type="range"
                min={0}
                max={100}
                value={progressPct}
                onChange={(e) => seekToPct(Number(e.target.value))}
                disabled={!ready}
                style={{ ["--p" as any]: `${progressPct}%` }}
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-white/30 font-medium">
                <span>{currentLabel}</span>
                <span>{durationLabel}</span>
              </div>
            </div>

            {/* Volume */}
            <div className="mt-3 flex items-center gap-3">
              <Volume2 className="h-4 w-4 text-white/35" />
              <input
                className="sp-range"
                type="range"
                min={0}
                max={100}
                value={volumePct}
                onChange={(e) => setVolume(Number(e.target.value) / 100)}
                style={{ ["--p" as any]: `${volumePct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
