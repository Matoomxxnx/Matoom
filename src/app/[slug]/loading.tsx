export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div
        className="fixed inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'url("/snowflake-icon.svg")',
          backgroundSize: "40px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white/30 text-xs uppercase tracking-widest">Loading...</p>
      </div>
    </div>
  );
}