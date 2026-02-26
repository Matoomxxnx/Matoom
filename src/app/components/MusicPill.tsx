"use client";

import { useEffect, useMemo, useState } from "react";

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

export default function MeenproPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((json) => setMembers(Array.isArray(json?.data) ? json.data : []))
      .catch(() => setMembers([]));
  }, []);

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
    const accentColor =
      accent === "gold" ? "#FFD700" : accent === "red" ? "#FF2D2D" : "#FFFFFF";

    return (
      <section className="w-full mt-14">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="text-xs font-bold px-2 py-1"
            style={{
              background: accentColor,
              color: "#000",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: "0.2em",
            }}
          >
            {indexLabel}
          </div>
          <h2
            className="text-3xl md:text-4xl font-black uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.15em",
              color: accentColor,
            }}
          >
            {title}
          </h2>
          <div className="flex-1 h-px" style={{ background: `${accentColor}33` }} />
          <span
            className="text-xs tracking-widest"
            style={{ color: `${accentColor}55`, fontFamily: "'Space Mono', monospace" }}
          >
            {items.length} TOTAL
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-white/30 text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
            — NO MEMBERS YET —
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {items.map((m) => (
              <div
                key={m.id}
                className="group relative overflow-hidden transition-all duration-200"
                style={{
                  background: "#0a0a0a",
                  border: `1px solid rgba(255,255,255,0.08)`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${accentColor}55`;
                  (e.currentTarget as HTMLDivElement).style.background = "#111";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.background = "#0a0a0a";
                }}
              >
                {/* Accent left bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: accentColor, opacity: 0.75 }}
                />

                {/* Corner tag */}
                <div
                  className="absolute top-0 right-0 text-[8px] font-bold px-2 py-0.5 tracking-widest"
                  style={{
                    background: `${accentColor}15`,
                    color: accentColor,
                    fontFamily: "'Space Mono', monospace",
                    borderLeft: `1px solid ${accentColor}33`,
                    borderBottom: `1px solid ${accentColor}33`,
                  }}
                >
                  {title.slice(0, -1)}
                </div>

                <div className="p-4 pl-6 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={m.avatar_url || "/uploads/meenpro.png"}
                      alt={safeText(m.name) || "member"}
                      className="w-12 h-12 object-cover"
                      style={{ border: `2px solid ${accentColor}44` }}
                    />
                    <span
                      className="absolute -bottom-1 -right-1 w-2.5 h-2.5"
                      style={{
                        background: "#00FF88",
                        boxShadow: "0 0 8px rgba(0,255,136,0.9)",
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <h3
                      className="font-black uppercase truncate text-white leading-tight"
                      style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: "0.1em",
                        fontSize: "1.1rem",
                      }}
                    >
                      {safeText(m.name) || "UNNAMED"}
                    </h3>
                    {m.facebook_url ? (
                      <a
                        href={m.facebook_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] transition-opacity"
                        style={{
                          color: accentColor,
                          fontFamily: "'Space Mono', monospace",
                          opacity: 0.65,
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.65")}
                      >
                        FACEBOOK ↗
                      </a>
                    ) : (
                      <p
                        className="text-[11px]"
                        style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Space Mono', monospace" }}
                      >
                        NO LINK
                      </p>
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');

        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scanline {
          0%   { top: -80px; }
          100% { top: 100vh; }
        }
        @keyframes blink {
          0%,49%  { opacity: 1; }
          50%,99% { opacity: 0; }
          100%    { opacity: 1; }
        }
        .marquee-inner { animation: marquee 22s linear infinite; display: flex; width: max-content; }
        .scanline-anim { animation: scanline 7s linear infinite; }
        .blink         { animation: blink 1.1s step-end infinite; }
      `}</style>

      <main
        className="flex-1 flex flex-col text-white relative overflow-hidden"
        style={{ background: "#000000" }}
      >
        {/* ── BG: Noise / grain texture ── */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "160px 160px",
            opacity: 0.045,
            mixBlendMode: "screen",
          }}
        />

        {/* ── BG: Soft vignette ── */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 110% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* ── Top border + marquee ── */}
        <div className="fixed top-0 inset-x-0 pointer-events-none" style={{ zIndex: 50 }}>
          <div className="h-[2px] bg-white w-full" />
          <div
            className="overflow-hidden"
            style={{ background: "#000", borderBottom: "1px solid rgba(255,255,255,0.1)", height: "20px" }}
          >
            <div className="marquee-inner">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="text-[9px] font-bold mr-10"
                  style={{
                    color: "rgba(255,255,255,0.22)",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.5em",
                    lineHeight: "20px",
                  }}
                >
                  KINGMEENPRO ✦ KMP IN MY HEART ✦ MEENPRO MEMBERS ✦
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="relative z-10 pt-12 flex-1 flex flex-col">
          <div className="max-w-6xl mx-auto px-6 pt-10 pb-6">

            {/* Title */}
            <h1
              className="text-center uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 10vw, 7rem)",
                letterSpacing: "0.35em",
                color: "#FFFFFF",
                lineHeight: 1,
                textShadow: "0 0 60px rgba(255,255,255,0.1)",
              }}
            >
              MEENPRO
            </h1>

            {/* Subtitle */}
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.18)" }} />
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.6rem",
                  letterSpacing: "0.65em",
                  color: "rgba(255,255,255,0.28)",
                }}
              >
                MEMBERS DIRECTORY
              </p>
              <div className="h-px w-16" style={{ background: "rgba(255,255,255,0.18)" }} />
            </div>

            {/* Search */}
            <div className="mt-10 flex justify-center">
              <div className="w-full max-w-xl relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="SEARCH_"
                  className="w-full outline-none text-white placeholder:text-white/20 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderLeft: "3px solid rgba(255,255,255,0.6)",
                    padding: "12px 16px",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.1em",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.4)";
                    (e.currentTarget as HTMLInputElement).style.borderLeftColor = "#fff";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor = "rgba(255,255,255,0.12)";
                    (e.currentTarget as HTMLInputElement).style.borderLeftColor = "rgba(255,255,255,0.6)";
                  }}
                />
                {!q && (
                  <span
                    className="blink absolute right-4 top-1/2 -translate-y-1/2 text-white/25"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    █
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="max-w-6xl mx-auto px-6 pb-8">
            <Section title="FOUNDERS" indexLabel="01" items={groups.FOUNDERS} accent="gold" />
            <Section title="LEADERS"  indexLabel="02" items={groups.LEADERS}  accent="red"  />
            <Section title="MEMBERS"  indexLabel="03" items={groups.MEMBERS}  accent="white" />
          </div>

          {/* ── Footer credit ── */}
          <div className="mt-auto">
            <div
              className="flex items-center justify-center"
              style={{ background: "#000", borderTop: "1px solid rgba(255,255,255,0.1)", height: "42px" }}
            >
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>
                SYSTEM DESIGN BY <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>MATOOM WELLESLEY</span>
              </p>
            </div>
            <div className="h-[2px] bg-white w-full" />
          </div>
        </div>
      </main>
    </>
  );
}