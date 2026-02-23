"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("รหัสผ่านไม่ถูกต้อง");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-white font-black uppercase tracking-widest text-xl">ADMIN</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-white/30"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-white text-black font-bold uppercase tracking-widest rounded-xl py-3 hover:bg-white/90 transition disabled:opacity-50"
        >
          {loading ? "..." : "เข้าสู่ระบบ"}
        </button>
      </div>
    </main>
  );
}