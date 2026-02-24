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

const sectionTitle: Record<Role, string> = {
  founder: "FOUNDERS",
  leader: "LEADERS",
  member: "MEMBERS",
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
    return items
      .filter((m) => (qq ? m.name.toLowerCase().includes(qq) : true))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [items, q]);

  const founders = filtered.filter((m) => m.role === "founder");
  const leaders = filtered.filter((m) => m.role === "leader");
  const members = filtered.filter((m) => m.role === "member");

  return (
    <div className="min-h-screen bg-[#07080c] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-3xl font-extrabold tracking-[0.25em]">WELLESLEY</div>
            <div className="mt-1 text-xs tracking-[0.35em] text-white/45">
              WELLESLEY MEMBERS
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-80">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="SEARCH MEMBER..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-white/25"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                ⌕
              </div>
            </div>
            <button
              onClick={load}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10"
              title="Refresh"
            >
              ↻
            </button>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-white/10" />

        {loading ? (
          <div className="mt-8 text-sm text-white/60">กำลังโหลด...</div>
        ) : (
          <div className="mt-10 space-y-12">
            <Section role="founder" items={founders} />
            <Section role="leader" items={leaders} />
            <Section role="member" items={members} />
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ role, items }: { role: Role; items: Member[] }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="text-lg font-extrabold tracking-widest">{sectionTitle[role]}</div>
        <div className="text-xs text-white/40">/ {String(items.length).padStart(2, "0")}</div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="text-sm text-white/45">No members yet.</div>
        ) : (
          items.map((m) => <MemberCard key={m.id} m={m} />)
        )}
      </div>
    </div>
  );
}

function MemberCard({ m }: { m: Member }) {
  const border =
    m.role === "founder"
      ? "border-yellow-500/35 hover:border-yellow-400/55"
      : m.role === "leader"
      ? "border-red-500/35 hover:border-red-400/55"
      : "border-white/12 hover:border-white/25";

  const tag =
    m.role === "founder"
      ? "bg-yellow-500/15 text-yellow-200"
      : m.role === "leader"
      ? "bg-red-500/15 text-red-200"
      : "bg-white/10 text-white/70";

  return (
    <div className={`group rounded-2xl border ${border} bg-white/5 p-4 transition`}>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/20">
          {m.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={m.avatar_url} alt={m.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-white/40">👤</div>
          )}
          <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(0,0,0,0.55)]" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[10px] ${tag}`}>
              {m.role.toUpperCase()} • {m.sort_order ?? 0}
            </span>
          </div>
          <div className="mt-1 truncate font-bold">{m.name}</div>
          {m.facebook_url ? (
            <a
              href={m.facebook_url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs text-sky-300 hover:underline"
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