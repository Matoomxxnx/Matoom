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

const roleLabel: Record<Role, string> = {
  founder: "Founder",
  leader: "Leader",
  member: "Member",
};

const roleBadge: Record<Role, string> = {
  founder: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  leader: "bg-red-500/15 text-red-300 border-red-500/40",
  member: "bg-white/10 text-white/80 border-white/20",
};

export default function AdminDashboard() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // form
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  // ui state
  const [q, setQ] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/members", { cache: "no-store" });
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  async function add() {
    const n = name.trim();
    if (!n) return alert("กรอกชื่อสมาชิกก่อน");

    setSaving(true);
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: n,
        role,
        facebook_url: facebookUrl.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        sort_order: Number(sortOrder) || 0,
      }),
    });
    const json = await res.json();
    setSaving(false);

    if (!res.ok) return alert(json?.message ?? "เพิ่มไม่สำเร็จ");

    setName("");
    setFacebookUrl("");
    setAvatarUrl("");
    setSortOrder(0);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("ลบสมาชิกคนนี้ใช่ไหม?")) return;

    const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok) return alert(json?.message ?? "ลบไม่สำเร็จ");
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return items
      .filter((m) => (filterRole === "all" ? true : m.role === filterRole))
      .filter((m) => (qq ? m.name.toLowerCase().includes(qq) : true))
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  }, [items, q, filterRole]);

  const preview: Omit<Member, "id"> = {
    name: name || "Preview Name",
    role,
    facebook_url: facebookUrl || "https://facebook.com/",
    avatar_url: avatarUrl || null,
    sort_order: sortOrder || 0,
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">
              Admin Dashboard
            </h1>
            <p className="text-sm text-white/60">
              จัดการรายชื่อสมาชิกที่โชว์หน้า <span className="font-semibold">/wellesley</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหาชื่อสมาชิก..."
                className="w-full md:w-72 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-white/25"
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/35">
                ⌕
              </div>
            </div>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-white/25"
            >
              <option value="all">ทุกตำแหน่ง</option>
              <option value="founder">Founder</option>
              <option value="leader">Leader</option>
              <option value="member">Member</option>
            </select>

            <button
              onClick={load}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10"
            >
              รีเฟรช
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">เพิ่มสมาชิก</h2>
                <span className="text-xs text-white/50">
                  ใช้ sort_order จัดลำดับ (น้อยมาก่อน)
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">ชื่อ</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น Matoom Wellesley"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-white/25"
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">ตำแหน่ง</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm outline-none focus:border-white/25"
                  >
                    <option value="founder">Founder</option>
                    <option value="leader">Leader</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60">sort_order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-white/25"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Facebook URL</label>
                  <input
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-white/25"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-white/60">Avatar URL</label>
                  <input
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="ลิงก์รูปโปรไฟล์ (ถ้ามี)"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-sm outline-none focus:border-white/25"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={add}
                  disabled={saving}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-white/90 disabled:opacity-60"
                >
                  {saving ? "กำลังบันทึก..." : "เพิ่มสมาชิก"}
                </button>
                <button
                  onClick={() => {
                    setName("");
                    setRole("member");
                    setFacebookUrl("");
                    setAvatarUrl("");
                    setSortOrder(0);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm hover:bg-white/10"
                >
                  ล้างฟอร์ม
                </button>
              </div>
            </div>

            {/* List */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">รายชื่อทั้งหมด</h2>
                <div className="text-xs text-white/60">
                  {loading ? "กำลังโหลด..." : `${filtered.length} รายการ`}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {loading ? (
                  <div className="text-sm text-white/60">กำลังโหลดข้อมูล...</div>
                ) : filtered.length === 0 ? (
                  <div className="text-sm text-white/60">ยังไม่มีข้อมูลสมาชิก</div>
                ) : (
                  filtered.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-white/10 bg-white/5">
                          {m.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.avatar_url}
                              alt={m.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-white/40">
                              👤
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(0,0,0,0.5)]" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-bold">{m.name}</div>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs ${roleBadge[m.role]}`}
                            >
                              {roleLabel[m.role]}
                            </span>
                          </div>
                          <div className="text-xs text-white/55">
                            sort_order: {m.sort_order ?? 0}
                            {m.facebook_url ? (
                              <>
                                {" • "}
                                <a
                                  href={m.facebook_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-300 hover:underline"
                                >
                                  Facebook
                                </a>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => remove(m.id)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/15"
                      >
                        ลบ
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-bold">Preview การ์ดหน้า /wellesley</h2>
              <p className="mt-1 text-xs text-white/60">
                ปรับข้อมูลในฟอร์มด้านซ้ายแล้วดูตัวอย่างตรงนี้
              </p>

              <div className="mt-4">
                <MemberCardPreview m={preview} />
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/60">
                Tip: Founder = กรอบทอง / Leader = กรอบแดง / Member = กรอบขาว
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-xs text-white/40">
          ถ้าต้องการ “แก้ไขสมาชิก” (edit) เดี๋ยวผมเพิ่มปุ่มแก้ไข + modal ให้ได้เลย
        </div>
      </div>
    </div>
  );
}

function MemberCardPreview({ m }: { m: Omit<Member, "id"> }) {
  const ring =
    m.role === "founder"
      ? "border-yellow-500/40"
      : m.role === "leader"
      ? "border-red-500/40"
      : "border-white/15";

  const tag =
    m.role === "founder"
      ? "bg-yellow-500/15 text-yellow-300"
      : m.role === "leader"
      ? "bg-red-500/15 text-red-300"
      : "bg-white/10 text-white/70";

  return (
    <div className={`rounded-2xl border ${ring} bg-black/30 p-4`}>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-white/5">
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
              {roleLabel[m.role]} • sort {m.sort_order ?? 0}
            </span>
          </div>
          <div className="mt-1 truncate font-extrabold">{m.name}</div>
          <div className="mt-1 text-xs text-sky-300">
            {m.facebook_url ? "Facebook" : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}