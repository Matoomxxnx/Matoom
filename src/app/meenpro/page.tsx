"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  role: string;
  facebook_url: string;
  avatar_url: string;
};

export default function MeenproPage() {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetch("/api/gangs") // ใช้ API เดิมของมึง
      .then((res) => res.json())
      .then((data) => setMembers(data.data || []));
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-20">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-[0.3em] mb-16 text-center">
          MEENPRO MEMBERS
        </h1>

        {/* Member Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={m.avatar_url || "/uploads/meenpro.png"}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-bold text-lg uppercase">{m.name}</h2>
                  <p className="text-sm text-white/50">{m.role}</p>
                </div>
              </div>

              {m.facebook_url && (
                <a
                  href={m.facebook_url}
                  target="_blank"
                  className="text-blue-400 text-sm hover:underline"
                >
                  Facebook
                </a>
              )}
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}