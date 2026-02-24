"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const j = await r.json().catch(() => ({}));

      if (!r.ok) {
        alert(j?.message ?? `Login failed (${r.status})`);
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch (e: any) {
      alert(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold">Admin Login</h1>

        <input
          type="password"
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLogin()}
        />

        <button
          onClick={onLogin}
          disabled={loading}
          className="w-full px-4 py-2 rounded bg-white text-black font-bold disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </div>
    </div>
  );
}