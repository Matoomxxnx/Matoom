"use client";

import { useEffect, useMemo, useState } from "react";

type Role = "founder" | "leader" | "member";
type Member = {
  id: string;
  name: string;
  role: Role;
  facebook_url: string | null;
  avatar_url: string | null;
  sort_order: number;
};

const label: Record<Role, string> = {
  founder: "FOUNDER",
  leader: "LEADER",
  member: "MEMBER",
};

export default function WellesleyPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/members", { cache: "no-store" });
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return [...items]
      .filter((m) => (qq ? m.name.toLowerCase().includes(qq) : true))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [items, q]);

  const founders = filtered.filter((m) => m.role === "founder");
  const leaders = filtered.filter((m) => m.role === "leader");
  const members = filtered.filter((m) => m.role === "member");

  return (
    <div className="min-h-screen bg-[#050608] text-white">
      {/* Background pattern + vignette */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.22]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.85)_80%)]" />

      <div className="relative mx-auto max-w-6xl px-5 py-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-4xl font-extrabold tracking-[0.22em]">
            WELLESLEY
          </h1>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.35em] text-white/45">
            <span className="h-px w-10 bg-white/15" />
            <span>WELLESLEY MEMBERS</span>
            <span className="h-px w-10 bg-white/15" />
          </div>
        </div>

        {/* Search */}
        <div className="mt-10 flex justify-end">
          <div className="relative w-full max-w-sm">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="SEARCH MEMBERS..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm outline-none focus:border-white/25"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
              ⌕
            </span>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-white/10" />

        {loading ? (
          <div className="mt-10 text-sm text-white/60">Loading...</div>
        ) : (
          <div className="mt-10 space-y-14">
            <Section title="FOUNDERS" count={founders.length} layout="center">
              {founders.map((m) => (
                <MemberPill key={m.id} m={m} />
              ))}
            </Section>

            <Section title="LEADERS" count={leaders.length} layout="grid">
              {leaders.map((m) => (
                <MemberPill key={m.id} m={m} />
              ))}
            </Section>

            <Section title="MEMBERS" count={members.length} layout="grid">
              {members.map((m) => (
                <MemberPill key={m.id} m={m} />
              ))}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  count,
  layout,
  children,
}: {
  title: string;
  count: number;
  layout: "center" | "grid";
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-extrabold tracking-widest">{title}</h2>
        <div className="text-xs text-white/40">/ {String(count).padStart(2, "0")}</div>
      </div>

      <div className="mt-5">
        {layout === "center" ? (
          <div className="flex flex-wrap justify-center gap-4">{children}</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
        )}
      </div>
    </section>
  );
}

function MemberPill({ m }: { m: any }) {
  const border =
    m.role === "founder"
      ? "border-yellow-500/35 shadow-[0_0_0_1px_rgba(234,179,8,0.15)]"
      : m.role === "leader"
      ? "border-red-500/30 shadow-[0_0_0_1px_rgba(239,68,68,0.10)]"
      : "border-white/12";

  const badge =
    m.role === "founder"
      ? "text-yellow-300 bg-yellow-500/10 border-yellow-500/25"
      : m.role === "leader"
      ? "text-red-300 bg-red-500/10 border-red-500/25"
      : "text-white/70 bg-white/10 border-white/15";

  const crown = m.role === "founder" ? "👑" : m.role === "leader" ? "👑" : "•";

  return (
    <div
      className={[
        "group relative w-full max-w-[420px] rounded-2xl border bg-white/5",
        "px-4 py-3 backdrop-blur-sm transition",
        "hover:bg-white/7 hover:border-white/20",
        border,
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        {/* Left logo/avatar */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          {m.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.avatar_url} alt={m.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-white/40">
              {/* placeholder logo */}
              <span className="text-lg">⛨</span>
            </div>
          )}
          {/* Online dot */}
          <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(0,0,0,0.55)]" />
        </div>

        <div className="min-w-0 flex-1">
          {/* badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide ${badge}`}>
              <span>{crown}</span>
              <span>{label[m.role as Role]}</span>
            </span>
          </div>

          <div className="mt-1 truncate text-sm font-extrabold">{m.name}</div>

          {m.facebook_url ? (
            <a
              href={m.facebook_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs font-semibold text-sky-300 hover:underline"
            >
              Facebook
            </a>
          ) : (
            <div className="mt-1 text-xs text-white/35">—</div>
          )}
        </div>
      </div>
    </div>
  );
}