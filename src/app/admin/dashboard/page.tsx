"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Member = { name: string; role?: string; image?: string };
type Gang = { slug: string; name: string; description: string; members: Member[] };

export default function Dashboard() {
  const [gangs, setGangs] = useState<Gang[]>([]);
  const [selected, setSelected] = useState<Gang | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchGangs(); }, []);

  async function fetchGangs() {
    const res = await fetch("/api/gangs");
    if (res.status === 401) { router.push("/admin"); return; }
    const json = await res.json();
    setGangs(json.data ?? []);
    setLoading(false);
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin");
  }

  async function saveMember(gangSlug: string, members: Member[]) {
    const gang = gangs.find(g => g.slug === gangSlug)!;
    await fetch("/api/gangs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...gang, members }),
    });
    fetchGangs();
  }

  async function uploadImage(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    return url;
  }

  if (loading) return <main className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</main>;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-black uppercase tracking-widest text-2xl">ADMIN DASHBOARD</h1>
          <button onClick={logout} className="text-white/40 hover:text-white text-sm uppercase tracking-widest transition">Logout</button>
        </div>

        <div className="grid gap-4">
          {gangs.map(gang => (
            <div key={gang.slug} className="border border-white/10 rounded-2xl p-5 bg-white/5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-black uppercase tracking-widest">{gang.name}</h2>
                  <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{gang.description}</p>
                </div>
                <button
                  onClick={() => setSelected(selected?.slug === gang.slug ? null : gang)}
                  className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition border border-white/10 px-3 py-1.5 rounded-lg"
                >
                  {selected?.slug === gang.slug ? "ปิด" : "จัดการ"}
                </button>
              </div>

              {selected?.slug === gang.slug && (
                <MemberEditor
                  gang={gang}
                  onSave={(members) => saveMember(gang.slug, members)}
                  onUpload={uploadImage}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function MemberEditor({ gang, onSave, onUpload }: {
  gang: Gang;
  onSave: (members: Member[]) => void;
  onUpload: (file: File) => Promise<string>;
}) {
  const [members, setMembers] = useState<Member[]>(gang.members ?? []);
  const [saving, setSaving] = useState(false);

  function update(i: number, field: keyof Member, value: string) {
    const m = [...members];
    m[i] = { ...m[i], [field]: value };
    setMembers(m);
  }

  function addMember() {
    setMembers([...members, { name: "" }]);
  }

  function removeMember(i: number) {
    setMembers(members.filter((_, idx) => idx !== i));
  }

  async function handleImage(i: number, file: File) {
    const url = await onUpload(file);
    update(i, "image", url);
  }

  async function save() {
    setSaving(true);
    await onSave(members);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      {members.map((m, i) => (
        <div key={i} className="flex gap-2 items-center bg-white/5 rounded-xl p-3">
          {m.image && <img src={m.image} className="w-10 h-10 rounded-full object-cover" />}
          <input
            value={m.name}
            onChange={e => update(i, "name", e.target.value)}
            placeholder="ชื่อ"
            className="bg-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none flex-1"
          />
          <input
            value={m.role ?? ""}
            onChange={e => update(i, "role", e.target.value)}
            placeholder="Role"
            className="bg-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none w-28"
          />
          <label className="cursor-pointer text-white/40 hover:text-white transition text-xs uppercase tracking-widest border border-white/10 px-2 py-2 rounded-lg">
            รูป
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImage(i, e.target.files[0])} />
          </label>
          <button onClick={() => removeMember(i)} className="text-red-400 hover:text-red-300 text-xs px-2 py-2 border border-red-400/20 rounded-lg">ลบ</button>
        </div>
      ))}
      <div className="flex gap-2 mt-1">
        <button onClick={addMember} className="text-xs uppercase tracking-widest text-white/40 hover:text-white border border-white/10 px-4 py-2 rounded-lg transition">+ เพิ่มสมาชิก</button>
        <button onClick={save} disabled={saving} className="text-xs uppercase tracking-widest bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition disabled:opacity-50">{saving ? "..." : "บันทึก"}</button>
      </div>
    </div>
  );
}