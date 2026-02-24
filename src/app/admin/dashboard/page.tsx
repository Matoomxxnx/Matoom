"use client";
import { useEffect, useState } from "react";

type Role = "founder" | "leader" | "member";
type Member = {
  id: string;
  name: string;
  role: Role;
  facebook_url: string | null;
  avatar_url: string | null;
  sort_order: number;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/members", { cache: "no-store" });
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  async function add() {
    const n = name.trim();
    if (!n) return alert("กรอกชื่อก่อน");

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
    if (!confirm("ลบคนนี้ใช่ไหม?")) return;

    const res = await fetch(`/api/members?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return alert(json?.message ?? "ลบไม่สำเร็จ");

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Admin Dashboard — จัดการสมาชิกหน้า /wellesley</h1>

      <div style={{ marginTop: 14, display: "grid", gap: 10, padding: 14, border: "1px solid #333", borderRadius: 12 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อสมาชิก" />

        <div style={{ display: "flex", gap: 10 }}>
          <select value={role} onChange={(e) => setRole(e.target.value as Role)} style={{ flex: 1 }}>
            <option value="founder">Founder</option>
            <option value="leader">Leader</option>
            <option value="member">Member</option>
          </select>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="sort_order (ลำดับ)"
            style={{ width: 180 }}
          />
        </div>

        <input value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} placeholder="Facebook URL (ถ้ามี)" />
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="Avatar URL (ถ้ามี)" />

        <button onClick={add} disabled={saving} style={{ padding: "10px 14px" }}>
          {saving ? "กำลังบันทึก..." : "เพิ่มสมาชิก"}
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : items.length === 0 ? (
          <p>ยังไม่มีข้อมูลสมาชิก</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {items.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                  border: "1px solid #222",
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800 }}>{m.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
                    role: {m.role} • sort_order: {m.sort_order}
                  </div>
                </div>
                <button onClick={() => remove(m.id)} style={{ padding: "8px 12px" }}>
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}