"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Member = {
  id: string;
  name: string | null;
  role: string | null;
  facebook_url: string | null;
  avatar_url: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

function normalizeRole(role?: string | null) {
  const r = (role ?? "").trim().toLowerCase();
  if (["founder", "founders", "owner", "boss", "admin"].includes(r)) return "FOUNDERS";
  if (["leader", "leaders", "mod", "manager"].includes(r)) return "LEADERS";
  if (["member", "members", "user"].includes(r)) return "MEMBERS";
  return "MEMBERS";
}

function safeText(v?: string | null) {
  return (v ?? "").toString();
}

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MeenproPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");

  // ✅ เพลง (แก้ชื่อไฟล์ได้ตามจริงใน public/music)
  const SONG = {
    title: "KMP IN MY HEART",
    artist: "KINGMEENPRO",
    audioSrc: "/music/song.mp3",
    coverSrc: "/music/cover.jpg",
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((json) => setMembers(Array.isArray(json?.data) ? json.data : []))
      .catch(() => setMembers([]));
  }, []);

  // ✅ ตั้ง volume ให้ audio
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ✅ กัน state เพี้ยนตอนเปลี่ยนหน้า/รีเฟรช
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onLoaded = () => setDuration(a.duration || 0);
    const onTime = () => setCurrent(a.currentTime || 0);
    const onEnded = () => setIsPlaying(false);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;

    try {
      if (a.paused) {
        await a.play();
      } else {
        a.pause();
      }
    } catch {
      // ถ้า browser block autoplay หรือไฟล์ไม่เจอ จะเงียบไว้
    }
  };

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min(100, Math.max(0, (current / duration) * 100));
  }, [current, duration]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return members
      .filter((m) => (m.is_active === undefined || m.is_active === null ? true : !!m.is_active))
      .filter((m) => {
        if (!query) return true;
        const hay = `${safeText(m.name)} ${safeText(m.role)}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => {
        const ao = a.sort_order ?? 999999;
        const bo = b.sort_order ?? 999999;
        if (ao !== bo) return ao - bo;

        const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
        return ad - bd;
      });
  }, [members, q]);

  const groups = useMemo(() => {
    const g: Record<"FOUNDERS" | "LEADERS" | "MEMBERS", Member[]> = {
      FOUNDERS: [],
      LEADERS: [],
      MEMBERS: [],
    };

    for (const m of filtered) {
      const key = normalizeRole(m.role) as "FOUNDERS" | "LEADERS" | "MEMBERS";
      g[key].push(m);
    }
    return g;
  }, [filtered]);

  const Section = ({
    title,
    indexLabel,
    items,
    accent,
  }: {
    title: string;
    indexLabel: string;
    items: Member[];
    accent: "gold" | "red" | "white";
  }) => {
    const border =
      accent === "gold"
        ? "border-yellow-500/30 hover:border-yellow-500/60"
        : accent === "red"
        ? "border-red-500/25 hover:border-red-500/60"
        : "border-white/10 hover:border-white/25";

    const badge =
      accent === "gold"
        ? "text-yellow-400/90"
        : accent === "red"
        ? "text-red-400/90"
        : "text-white/70";

    return (
      <section className="w-full mt-12">
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.15em]">
            {title}
          </h2>
          <span className="text-xs text-white/30 uppercase tracking-[0.25em]">
            / {indexLabel}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-white/30 text-sm">No members yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((m) => (
              <div
                key={m.id}
                className={[
                  "group rounded-2xl bg-white/[0.03] backdrop-blur-sm border transition-all duration-300 overflow-hidden",
                  border,
                ].join(" ")}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={m.avatar_url || "/uploads/meenpro.png"}
                      alt={safeText(m.name) || "member"}
                      className="w-14 h-14 rounded-full object-cover border border-white/10"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={["text-[11px] uppercase tracking-[0.2em]", badge].join(" ")}>
                        {title.slice(0, -1)}
                      </span>
                    </div>

                    <h3 className="font-bold uppercase tracking-wide text-white truncate">
                      {safeText(m.name) || "Unnamed"}
                    </h3>

                    {m.facebook_url ? (
                      <a
                        href={m.facebook_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Facebook
                      </a>
                    ) : (
                      <p className="text-sm text-white/30">No link</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* ✅ Audio (ซ่อนไว้ แต่เล่นได้) */}
      <audio ref={audioRef} src={SONG.audioSrc} preload="metadata" />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-6">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-[0.35em] text-center text-white/90">
          MEENPRO
        </h1>
        <p className="text-xs md:text-sm text-white/35 uppercase tracking-[0.6em] text-center mt-3">
          MEENPRO MEMBERS
        </p>

        {/* ✅ Now Playing Card (แบบตัวอย่าง) */}
        <div className="mt-10 flex justify-center">
          <div className="w-[360px] max-w-[92vw] rounded-3xl bg-white/[0.06] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.65)] overflow-hidden">
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] tracking-[0.22em] text-white/60">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                <span>NOW PLAYING</span>
              </div>
              <span className="text-white/30 text-xs">⌄</span>
            </div>

            <div className="px-5 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-[56px] h-[56px] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                  <img src={SONG.coverSrc} alt="cover" className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0">
                  <div className="text-[14px] font-semibold tracking-[0.12em] uppercase truncate">
                    {SONG.title}
                  </div>
                  <div className="text-[11px] tracking-[0.28em] uppercase text-white/55 truncate mt-1">
                    {SONG.artist}
                  </div>
                </div>
              </div>

              {/* progress */}
              <div className="mt-5">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-white/85" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                  <span>{formatTime(current)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* controls */}
              <div className="mt-4 flex items-center justify-between">
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
                    className="w-[130px] accent-white"
                  />
                </div>

                <button
                  onClick={togglePlay}
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
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-xl">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/25 text-white/90 placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <Section title="FOUNDERS" indexLabel="01" items={groups.FOUNDERS} accent="gold" />
        <Section title="LEADERS" indexLabel="02" items={groups.LEADERS} accent="red" />
        <Section title="MEMBERS" indexLabel="03" items={groups.MEMBERS} accent="white" />
      </div>
    </main>
  );
}