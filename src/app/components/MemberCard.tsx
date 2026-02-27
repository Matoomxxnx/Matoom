// src/components/MemberCard.tsx
interface MemberProps {
  name: string;
  gang: string;
  status: 'active' | 'missing' | 'unknown';
  image?: string;
}

export default function MemberCard({ name, gang, status, image }: MemberProps) {
  const statusColor = {
    active: 'bg-green-500',
    missing: 'bg-red-500',
    unknown: 'bg-gray-500'
  };

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 p-4 rounded-none transition-all hover:border-white/50 hover:bg-zinc-800/50">
      <div className="flex items-center gap-4">
        {/* Profile Image Space */}
        <div className="w-16 h-16 bg-zinc-800 grayscale group-hover:grayscale-0 transition-all border border-zinc-700 overflow-hidden">
           {image ? <img src={image} alt={name} className="object-cover w-full h-full" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">ID</div>}
        </div>

        <div className="flex-1">
          <h3 className="text-white font-medium tracking-wider uppercase text-sm mb-1">{name}</h3>
          <p className="text-zinc-500 text-xs font-mono">{gang}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor[status]} animate-pulse`} />
          <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">{status}</span>
        </div>
      </div>
      
      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
    </div>
  );
}