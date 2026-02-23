import { notFound } from "next/navigation";
import { gangs } from "../../lib/gangs";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug: rawSlug } = await params;
  const slug = (rawSlug || "").toLowerCase().trim();

  const gang = gangs.find((g) => g.slug.toLowerCase().trim() === slug);

  if (!gang) return notFound();

  const people = gang.members ?? [];

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-10 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-[0.22em] text-white/90 truncate">
            {gang.name}
          </h1>
          <p className="text-[10px] md:text-xs text-white/45 uppercase tracking-[0.35em] mt-2">
            {gang.description}
          </p>

          {/* MEMBERS */}
          <div className="mt-10">
            <h2 className="text-sm md:text-base font-bold tracking-[0.28em] text-white/70 uppercase mb-4">
              MEMBERS
            </h2>

            {people.length === 0 ? (
              <div className="text-white/40 text-sm">No members yet.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {people.map((p, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-3 hover:border-white/20 transition"
                  >
                    <div className="font-extrabold text-white uppercase tracking-wide text-sm truncate">
                      {p.name}
                    </div>
                    {p.role ? (
                      <div className="text-[10px] text-white/45 uppercase tracking-[0.22em] truncate mt-1">
                        {p.role}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}