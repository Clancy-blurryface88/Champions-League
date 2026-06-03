import React, { useState } from 'react';

const BACKGROUNDS = [
  { id: 1,  name: 'Current (Blue Gradient)', style: { background: 'linear-gradient(145deg, rgba(30,58,138,0.45) 0%, rgba(8,15,45,0.92) 45%, rgba(15,25,70,0.5) 100%)', backdropFilter: 'blur(36px) saturate(180%)', boxShadow: '0 8px 40px rgba(0,0,20,0.6), inset 0 1px 0 rgba(147,197,253,0.12)' } },
  { id: 2,  name: 'Glassmorphism White', style: { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.4)' } },
  { id: 3,  name: 'Radial Blue Glow', style: { background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.3) 0%, rgba(8,15,45,0.97) 70%)', boxShadow: '0 0 40px rgba(59,130,246,0.15)' } },
  { id: 4,  name: 'Radial Purple Glow', style: { background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.35) 0%, rgba(10,5,30,0.97) 70%)', boxShadow: '0 0 40px rgba(139,92,246,0.2)' } },
  { id: 5,  name: 'Aurora', style: { background: 'linear-gradient(135deg, rgba(76,29,149,0.55) 0%, rgba(8,15,45,0.9) 50%, rgba(6,78,59,0.35) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' } },
  { id: 6,  name: 'Solid Minimal', style: { background: 'rgba(8,12,28,0.97)', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 0 30px rgba(99,102,241,0.1)' } },
  { id: 7,  name: 'Deep Navy', style: { background: 'linear-gradient(180deg, rgba(15,23,60,0.98) 0%, rgba(5,10,35,1) 100%)', boxShadow: '0 4px 24px rgba(0,0,0,0.7)' } },
  { id: 8,  name: 'Midnight Black', style: { background: 'rgba(5,5,10,0.98)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' } },
  { id: 9,  name: 'Gold Luxury', style: { background: 'linear-gradient(145deg, rgba(120,80,5,0.5) 0%, rgba(8,12,28,0.95) 50%, rgba(80,55,5,0.3) 100%)', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.15)' } },
  { id: 10, name: 'Rose Red', style: { background: 'linear-gradient(145deg, rgba(136,19,55,0.45) 0%, rgba(15,5,15,0.95) 60%, rgba(80,10,30,0.3) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 11, name: 'Forest Green', style: { background: 'linear-gradient(145deg, rgba(6,78,59,0.5) 0%, rgba(5,15,10,0.95) 60%, rgba(10,50,30,0.3) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 12, name: 'Teal Ocean', style: { background: 'linear-gradient(145deg, rgba(19,78,74,0.55) 0%, rgba(5,15,20,0.95) 60%, rgba(8,50,55,0.3) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 13, name: 'Royal Purple', style: { background: 'linear-gradient(145deg, rgba(88,28,135,0.55) 0%, rgba(10,5,25,0.95) 60%, rgba(55,10,100,0.3) 100%)', boxShadow: '0 0 40px rgba(88,28,135,0.2)' } },
  { id: 14, name: 'Sunset Orange', style: { background: 'linear-gradient(135deg, rgba(154,52,18,0.5) 0%, rgba(15,5,5,0.95) 55%, rgba(120,30,5,0.25) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 15, name: 'Neon Blue', style: { background: 'rgba(5,8,20,0.97)', border: '1px solid rgba(59,130,246,0.4)', boxShadow: '0 0 20px rgba(59,130,246,0.2), inset 0 0 30px rgba(59,130,246,0.05)' } },
  { id: 16, name: 'Neon Purple', style: { background: 'rgba(5,5,15,0.97)', border: '1px solid rgba(168,85,247,0.4)', boxShadow: '0 0 20px rgba(168,85,247,0.2), inset 0 0 30px rgba(168,85,247,0.05)' } },
  { id: 17, name: 'Neon Green', style: { background: 'rgba(2,8,5,0.97)', border: '1px solid rgba(34,197,94,0.4)', boxShadow: '0 0 20px rgba(34,197,94,0.2), inset 0 0 30px rgba(34,197,94,0.05)' } },
  { id: 18, name: 'Neon Cyan', style: { background: 'rgba(2,8,10,0.97)', border: '1px solid rgba(6,182,212,0.4)', boxShadow: '0 0 20px rgba(6,182,212,0.2), inset 0 0 30px rgba(6,182,212,0.05)' } },
  { id: 19, name: 'Neon Pink', style: { background: 'rgba(10,3,8,0.97)', border: '1px solid rgba(236,72,153,0.4)', boxShadow: '0 0 20px rgba(236,72,153,0.2), inset 0 0 30px rgba(236,72,153,0.05)' } },
  { id: 20, name: 'Neon Gold', style: { background: 'rgba(8,6,2,0.97)', border: '1px solid rgba(234,179,8,0.4)', boxShadow: '0 0 20px rgba(234,179,8,0.2), inset 0 0 30px rgba(234,179,8,0.05)' } },
  { id: 21, name: 'Space Nebula', style: { background: 'linear-gradient(135deg, rgba(49,10,101,0.6) 0%, rgba(5,8,30,0.95) 40%, rgba(10,50,100,0.4) 100%)', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' } },
  { id: 22, name: 'Northern Lights', style: { background: 'linear-gradient(160deg, rgba(5,100,80,0.4) 0%, rgba(8,15,40,0.95) 45%, rgba(50,5,120,0.4) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 23, name: 'Deep Sea', style: { background: 'linear-gradient(180deg, rgba(7,89,133,0.45) 0%, rgba(3,15,35,0.97) 60%, rgba(2,60,100,0.3) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' } },
  { id: 24, name: 'Volcanic', style: { background: 'linear-gradient(145deg, rgba(100,15,5,0.6) 0%, rgba(10,5,5,0.97) 50%, rgba(60,10,2,0.3) 100%)', boxShadow: '0 0 30px rgba(200,50,10,0.15)' } },
  { id: 25, name: 'Storm Gray', style: { background: 'linear-gradient(145deg, rgba(55,65,81,0.6) 0%, rgba(15,20,25,0.97) 60%)', border: '1px solid rgba(156,163,175,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 26, name: 'Ice Crystal', style: { background: 'linear-gradient(135deg, rgba(186,230,253,0.08) 0%, rgba(8,20,40,0.95) 50%, rgba(147,197,253,0.06) 100%)', border: '1px solid rgba(186,230,253,0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)' } },
  { id: 27, name: 'Top Light', style: { background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(8,15,40,0.97) 40%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 28, name: 'Bottom Glow Blue', style: { background: 'linear-gradient(0deg, rgba(59,130,246,0.2) 0%, rgba(8,15,40,0.97) 50%)', boxShadow: '0 0 30px rgba(59,130,246,0.12)' } },
  { id: 29, name: 'Bottom Glow Purple', style: { background: 'linear-gradient(0deg, rgba(139,92,246,0.25) 0%, rgba(8,8,25,0.97) 55%)', boxShadow: '0 0 30px rgba(139,92,246,0.15)' } },
  { id: 30, name: 'Diagonal Split', style: { background: 'linear-gradient(120deg, rgba(30,58,138,0.5) 0%, rgba(5,8,20,0.97) 50%, rgba(88,28,135,0.35) 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 31, name: 'Cobalt', style: { background: 'linear-gradient(145deg, rgba(37,99,235,0.4) 0%, rgba(5,10,30,0.97) 55%)', border: '1px solid rgba(37,99,235,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 32, name: 'Indigo Deep', style: { background: 'linear-gradient(145deg, rgba(67,56,202,0.45) 0%, rgba(8,8,30,0.97) 55%)', border: '1px solid rgba(67,56,202,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 33, name: 'Emerald', style: { background: 'linear-gradient(145deg, rgba(16,185,129,0.3) 0%, rgba(5,12,10,0.97) 55%)', border: '1px solid rgba(16,185,129,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 34, name: 'Copper Bronze', style: { background: 'linear-gradient(145deg, rgba(120,80,40,0.45) 0%, rgba(12,8,5,0.97) 55%)', border: '1px solid rgba(180,120,60,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 35, name: 'Silver Platinum', style: { background: 'linear-gradient(145deg, rgba(148,163,184,0.12) 0%, rgba(10,12,18,0.97) 55%)', border: '1px solid rgba(148,163,184,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' } },
  { id: 36, name: 'Wine Dark', style: { background: 'linear-gradient(145deg, rgba(88,28,65,0.55) 0%, rgba(10,3,8,0.97) 55%)', border: '1px solid rgba(136,40,90,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' } },
  { id: 37, name: 'Warm Charcoal', style: { background: 'linear-gradient(145deg, rgba(40,32,25,0.97) 0%, rgba(20,15,12,0.99) 100%)', border: '1px solid rgba(255,200,100,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' } },
  { id: 38, name: 'Cool Slate', style: { background: 'linear-gradient(145deg, rgba(30,41,59,0.9) 0%, rgba(10,15,25,0.99) 100%)', border: '1px solid rgba(100,130,180,0.12)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 39, name: 'Radial Gold', style: { background: 'radial-gradient(ellipse at top, rgba(180,140,20,0.25) 0%, rgba(8,6,2,0.98) 65%)', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' } },
  { id: 40, name: 'Radial Teal', style: { background: 'radial-gradient(ellipse at top, rgba(20,184,166,0.25) 0%, rgba(2,10,12,0.98) 65%)', border: '1px solid rgba(20,184,166,0.18)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' } },
  { id: 41, name: 'Mesh: Blue+Purple', style: { background: 'radial-gradient(at 20% 30%, rgba(59,130,246,0.3) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(139,92,246,0.3) 0px, transparent 50%), rgba(5,8,20,0.97)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 42, name: 'Mesh: Green+Blue', style: { background: 'radial-gradient(at 20% 30%, rgba(16,185,129,0.25) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(59,130,246,0.25) 0px, transparent 50%), rgba(3,8,15,0.97)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 43, name: 'Mesh: Purple+Pink', style: { background: 'radial-gradient(at 20% 30%, rgba(139,92,246,0.3) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(236,72,153,0.25) 0px, transparent 50%), rgba(8,3,12,0.97)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 44, name: 'Mesh: Gold+Red', style: { background: 'radial-gradient(at 20% 20%, rgba(234,179,8,0.25) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(220,38,38,0.25) 0px, transparent 50%), rgba(8,5,3,0.97)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 45, name: 'Mesh: Teal+Purple', style: { background: 'radial-gradient(at 20% 30%, rgba(20,184,166,0.25) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(88,28,135,0.3) 0px, transparent 50%), rgba(3,6,12,0.97)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 46, name: 'Frosted Dark', style: { background: 'rgba(15,20,35,0.7)', backdropFilter: 'blur(60px) saturate(200%) brightness(0.8)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' } },
  { id: 47, name: 'Stripe Subtle', style: { background: 'repeating-linear-gradient(135deg, rgba(30,58,138,0.25) 0px, rgba(30,58,138,0.25) 1px, transparent 1px, transparent 12px), rgba(6,10,28,0.97)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
  { id: 48, name: 'Carbon Dark', style: { background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 8px), rgba(8,10,14,0.99)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' } },
  { id: 49, name: 'Blue + Gold Accent', style: { background: 'linear-gradient(145deg, rgba(30,58,138,0.5) 0%, rgba(8,15,45,0.95) 60%)', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 8px 40px rgba(0,0,20,0.6), inset 0 1px 0 rgba(212,175,55,0.12)' } },
  { id: 50, name: 'Pure Black Glass', style: { background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 40px rgba(0,0,0,0.9)' } },
];

function MiniCard({ bg, selected, onClick, index }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-2xl p-[2px] transition-all duration-200 ${selected ? 'ring-2 ring-yellow-400 scale-105' : 'hover:scale-102 hover:ring-1 hover:ring-white/30'}`}
    >
      <div
        className="rounded-2xl p-3 h-full flex flex-col gap-2 relative overflow-hidden"
        style={bg.style}
      >
        {/* noise overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '150px' }} />

        {/* number badge */}
        <div className="absolute top-2 left-2 text-[10px] font-bold text-white/40">#{index}</div>

        {/* group badge */}
        <div className="flex justify-center mt-1">
          <span className="text-[9px] font-semibold text-yellow-400 border border-yellow-400/40 rounded-full px-2 py-0.5">Group A</span>
        </div>

        {/* teams row */}
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[10px]">🇨🇿</div>
            <span className="text-[8px] text-white/70 font-medium">CZE</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-7 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
            <span className="text-white/50 text-xs font-bold">-</span>
            <div className="w-7 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>0</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[10px]">🇿🇦</div>
            <span className="text-[8px] text-white/70 font-medium">RSA</span>
          </div>
        </div>

        {/* date */}
        <div className="text-center text-[8px] text-white/40 pb-0.5">18/06/2026 · 19:00</div>

        {/* name */}
        <div className="text-center text-[9px] font-semibold text-white/80 leading-tight">{bg.name}</div>
      </div>
    </div>
  );
}

export default function AdminCardBgDemo() {
  const [selected, setSelected] = useState(1);
  const current = BACKGROUNDS.find(b => b.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Card Background Demo</h2>
        <p className="text-slate-400 text-sm">לחץ על כרטיסייה לבחור. הבחירה הנוכחית מסומנת בצהוב.</p>
      </div>

      {/* Selected large preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-2xl overflow-hidden w-72" style={current.style}>
          <div className="p-5 flex flex-col gap-3 relative">
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />
            <div className="flex justify-center">
              <span className="text-xs font-semibold text-yellow-400 border border-yellow-400/50 rounded-full px-3 py-1">Group A</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">🇨🇿</div>
                <span className="text-[11px] text-white/80 font-medium">Czechia</span>
                <span className="text-[9px] text-white/40">(Home)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-16 rounded-xl bg-white/10 flex items-center justify-center text-4xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>2</div>
                <span className="text-white/50 text-xl font-bold">-</span>
                <div className="w-12 h-16 rounded-xl bg-white/10 flex items-center justify-center text-4xl font-bold text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>0</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">🇿🇦</div>
                <span className="text-[11px] text-white/80 font-medium">South Africa</span>
                <span className="text-[9px] text-white/40">(Away)</span>
              </div>
            </div>
            <div className="text-center text-xs text-white/40">18/06/2026 · 19:00 · Atlanta Stadium</div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-yellow-400 font-bold">#{selected}</span>
          <span className="text-white/70 ml-2">{current.name}</span>
        </div>
      </div>

      {/* Grid of 50 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {BACKGROUNDS.map(bg => (
          <MiniCard
            key={bg.id}
            bg={bg}
            index={bg.id}
            selected={selected === bg.id}
            onClick={() => setSelected(bg.id)}
          />
        ))}
      </div>

      {/* CSS to apply */}
      {selected && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-2 font-mono">style object לאפשרות הנבחרת:</p>
          <pre className="text-green-400 text-xs font-mono overflow-auto whitespace-pre-wrap">
            {JSON.stringify(current.style, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
