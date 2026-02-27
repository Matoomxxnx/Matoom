import gangsData from '../data/gangs.json';
import MemberCard from '../components/MemberCard'; // อย่าลืมสร้างไฟล์นี้ตามที่ผมเขียนให้ก่อนหน้านะครับ

export default function WellesleyPage() {
  const members = gangsData.wellesley;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-10">
      {/* Header เฉพาะของแก๊ง */}
      <div className="mb-12 border-l-4 border-white pl-6">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Wellesley</h1>
        <p className="text-zinc-500 font-mono text-sm mt-2">FACTION_ARCHIVE // DATABASE_01</p>
      </div>

      {/* Grid รายชื่อ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={member.id} className="bg-zinc-900/50 border border-zinc-800 p-6 hover:bg-zinc-800 transition-all cursor-crosshair">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-zinc-500 font-mono mb-1">{member.id}</p>
                <h2 className="text-xl font-bold uppercase tracking-wide">{member.name}</h2>
                <p className="text-zinc-400 text-xs mt-1 uppercase italic">{member.role}</p>
              </div>
              <div className={`px-2 py-1 text-[9px] font-bold uppercase border ${
                member.status === 'active' ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
              }`}>
                {member.status}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* ลายน้ำเท่ๆ ตามโลโก้คุณ */}
      <div className="fixed bottom-5 right-5 opacity-20 text-[10px] font-mono tracking-[0.5em] uppercase">
        Where Are You?
      </div>
    </div>
  );
}