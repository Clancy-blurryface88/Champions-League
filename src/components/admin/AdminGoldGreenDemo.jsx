import React, { useState } from 'react';

const CARDS = [
  // ── 1-5: The original 5 ─────────────────────────────────────────────────────
  {
    id: 1, name: 'Emerald Aurora',
    desc: 'זוהר אמרלד רדיאלי מלמעלה + זהב מהפינה התחתונה',
    style: {
      background: 'radial-gradient(ellipse at top, rgba(16,185,129,0.55) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(180,138,12,0.45) 0%, transparent 55%), rgba(4,12,8,0.97)',
      border: '1px solid rgba(16,185,129,0.25)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 60px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.07)',
    }
  },
  {
    id: 2, name: 'Royal Forest Gold',
    desc: 'ירוק יער כהה עמוק עם זהב זורם + מסגרת זהב זוהרת',
    style: {
      background: 'linear-gradient(145deg, rgba(6,50,30,0.97) 0%, rgba(3,20,12,0.99) 45%, rgba(60,40,2,0.85) 80%, rgba(140,100,5,0.6) 100%)',
      border: '1px solid rgba(212,175,55,0.35)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 0 40px rgba(180,138,12,0.12), inset 0 1px 0 rgba(212,175,55,0.2)',
    }
  },
  {
    id: 3, name: 'Mesh Glow',
    desc: '3 נקודות אור: אמרלד, jade, זהב — רקע שחור',
    style: {
      background: 'radial-gradient(at 15% 20%, rgba(16,185,129,0.5) 0px, transparent 50%), radial-gradient(at 85% 80%, rgba(212,175,55,0.45) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(0,95,80,0.3) 0px, transparent 55%), rgba(3,8,5,0.97)',
      border: '1px solid rgba(16,185,129,0.2)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 0 50px rgba(16,185,129,0.08), 0 0 50px rgba(212,175,55,0.08)',
    }
  },
  {
    id: 4, name: 'Liquid Gold on Green',
    desc: 'ירוק כהה בסיס עם זהב נוזלי אלכסוני + זכוכית',
    style: {
      background: 'linear-gradient(135deg, rgba(4,25,15,0.95) 0%, rgba(8,40,20,0.9) 35%, rgba(80,58,4,0.75) 65%, rgba(160,120,8,0.6) 100%)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      border: '1px solid rgba(212,175,55,0.3)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(212,175,55,0.25), inset 0 -1px 0 rgba(0,0,0,0.2)',
    }
  },
  {
    id: 5, name: 'Dark Jewel',
    desc: 'אבן חן — ירוק עמוק עם ברקי זהב פנימיים',
    style: {
      background: 'radial-gradient(ellipse at 30% 25%, rgba(16,185,129,0.3) 0%, transparent 50%), rgba(3,14,8,0.98)',
      border: '1px solid rgba(212,175,55,0.4)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.1), inset 0 1px 0 rgba(212,175,55,0.3), inset 0 0 30px rgba(16,185,129,0.05)',
    }
  },

  // ── 6-30: 25 more gold+green variations ─────────────────────────────────────
  {
    id: 6, name: 'Gold Trim Green',
    style: {
      background: 'linear-gradient(160deg, rgba(5,30,15,0.97) 0%, rgba(3,12,8,0.99) 100%)',
      borderTop: '2px solid rgba(212,175,55,0.7)',
      borderLeft: '1px solid rgba(212,175,55,0.2)',
      borderRight: '1px solid rgba(212,175,55,0.2)',
      borderBottom: '1px solid rgba(212,175,55,0.1)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 -2px 20px rgba(212,175,55,0.15)',
    }
  },
  {
    id: 7, name: 'Emerald Glass',
    style: {
      background: 'rgba(16,185,129,0.1)',
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      border: '1px solid rgba(16,185,129,0.25)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 40px rgba(16,185,129,0.1)',
    }
  },
  {
    id: 8, name: 'Gold Glass',
    style: {
      background: 'rgba(212,175,55,0.08)',
      backdropFilter: 'blur(40px) saturate(180%)',
      WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      border: '1px solid rgba(212,175,55,0.3)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 40px rgba(212,175,55,0.1)',
    }
  },
  {
    id: 9, name: 'Forest Canopy',
    style: {
      background: 'linear-gradient(180deg, rgba(6,60,30,0.9) 0%, rgba(3,25,12,0.98) 50%, rgba(2,10,5,1) 100%)',
      border: '1px solid rgba(34,197,94,0.2)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), inset 0 1px 0 rgba(34,197,94,0.15)',
    }
  },
  {
    id: 10, name: 'Champagne on Green',
    style: {
      background: 'linear-gradient(145deg, rgba(5,35,18,0.95) 0%, rgba(3,15,8,0.98) 50%, rgba(100,80,10,0.5) 100%)',
      border: '1px solid rgba(255,215,100,0.25)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,215,100,0.2)',
    }
  },
  {
    id: 11, name: 'Radial Gold Center',
    style: {
      background: 'radial-gradient(ellipse at center, rgba(180,138,12,0.3) 0%, rgba(6,40,20,0.8) 50%, rgba(2,10,5,0.99) 100%)',
      border: '1px solid rgba(180,138,12,0.3)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 0 50px rgba(180,138,12,0.12)',
    }
  },
  {
    id: 12, name: 'Radial Emerald Center',
    style: {
      background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.35) 0%, rgba(3,20,12,0.85) 55%, rgba(2,8,5,0.99) 100%)',
      border: '1px solid rgba(16,185,129,0.22)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 0 50px rgba(16,185,129,0.12)',
    }
  },
  {
    id: 13, name: 'Stripe Gold',
    style: {
      background: 'repeating-linear-gradient(135deg, rgba(212,175,55,0.06) 0px, rgba(212,175,55,0.06) 1px, transparent 1px, transparent 16px), linear-gradient(145deg, rgba(5,28,14,0.97) 0%, rgba(3,12,6,0.99) 100%)',
      border: '1px solid rgba(212,175,55,0.2)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75)',
    }
  },
  {
    id: 14, name: 'Neon Emerald Dark',
    style: {
      background: 'rgba(2,8,4,0.98)',
      border: '1px solid rgba(16,185,129,0.5)',
      boxShadow: '0 0 20px rgba(16,185,129,0.25), 0 0 40px rgba(16,185,129,0.1), inset 0 0 20px rgba(16,185,129,0.05)',
    }
  },
  {
    id: 15, name: 'Neon Gold Dark',
    style: {
      background: 'rgba(5,4,2,0.98)',
      border: '1px solid rgba(212,175,55,0.5)',
      boxShadow: '0 0 20px rgba(212,175,55,0.25), 0 0 40px rgba(212,175,55,0.1), inset 0 0 20px rgba(212,175,55,0.05)',
    }
  },
  {
    id: 16, name: 'Dual Neon G+G',
    style: {
      background: 'rgba(3,6,4,0.98)',
      border: '1px solid rgba(100,200,130,0.35)',
      boxShadow: '0 0 20px rgba(16,185,129,0.2), 0 0 20px rgba(212,175,55,0.15), inset 0 1px 0 rgba(212,175,55,0.1)',
    }
  },
  {
    id: 17, name: 'Velvet Green',
    style: {
      background: 'linear-gradient(145deg, rgba(10,45,22,0.98) 0%, rgba(5,22,10,0.99) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.3)',
    }
  },
  {
    id: 18, name: 'Gold Horizon',
    style: {
      background: 'linear-gradient(0deg, rgba(140,100,5,0.6) 0%, rgba(60,40,2,0.4) 25%, rgba(4,18,8,0.97) 60%, rgba(4,18,8,0.99) 100%)',
      border: '1px solid rgba(212,175,55,0.25)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 4px 30px rgba(180,138,12,0.2)',
    }
  },
  {
    id: 19, name: 'Green Horizon',
    style: {
      background: 'linear-gradient(180deg, rgba(16,120,60,0.5) 0%, rgba(8,50,25,0.6) 30%, rgba(3,12,6,0.98) 70%)',
      border: '1px solid rgba(16,185,129,0.2)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 -4px 30px rgba(16,185,129,0.15)',
    }
  },
  {
    id: 20, name: 'Carbon Green',
    style: {
      background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 8px), linear-gradient(145deg, rgba(8,40,20,0.95) 0%, rgba(3,12,6,0.99) 100%)',
      border: '1px solid rgba(16,185,129,0.15)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.8)',
    }
  },
  {
    id: 21, name: 'Emerald + Gold Specular',
    style: {
      background: 'linear-gradient(145deg, rgba(6,50,25,0.92) 0%, rgba(3,18,8,0.98) 50%, rgba(50,35,2,0.8) 100%)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), inset 0 1.5px 0 rgba(212,175,55,0.4), inset 0 -1px 0 rgba(0,0,0,0.25)',
    }
  },
  {
    id: 22, name: 'Malachite',
    style: {
      background: 'linear-gradient(135deg, rgba(0,105,60,0.7) 0%, rgba(0,60,35,0.8) 35%, rgba(2,20,10,0.98) 70%, rgba(2,10,5,1) 100%)',
      border: '1px solid rgba(0,160,90,0.3)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), 0 0 40px rgba(0,130,70,0.1)',
    }
  },
  {
    id: 23, name: 'Peridot Gold',
    style: {
      background: 'linear-gradient(145deg, rgba(80,120,10,0.5) 0%, rgba(30,50,5,0.8) 40%, rgba(4,12,2,0.98) 65%, rgba(60,44,2,0.7) 100%)',
      border: '1px solid rgba(150,190,30,0.25)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75), inset 0 1px 0 rgba(180,220,50,0.15)',
    }
  },
  {
    id: 24, name: '4-point Mesh',
    style: {
      background: 'radial-gradient(at 0% 0%, rgba(16,185,129,0.45) 0px, transparent 45%), radial-gradient(at 100% 0%, rgba(180,138,12,0.35) 0px, transparent 45%), radial-gradient(at 100% 100%, rgba(16,185,129,0.35) 0px, transparent 45%), radial-gradient(at 0% 100%, rgba(180,138,12,0.4) 0px, transparent 45%), rgba(3,10,5,0.97)',
      border: '1px solid rgba(16,185,129,0.18)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75)',
    }
  },
  {
    id: 25, name: 'Frosted Gold Green',
    style: {
      background: 'linear-gradient(145deg, rgba(16,185,129,0.12) 0%, rgba(212,175,55,0.08) 100%)',
      backdropFilter: 'blur(60px) saturate(180%)',
      WebkitBackdropFilter: 'blur(60px) saturate(180%)',
      border: '1px solid rgba(212,175,55,0.2)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
    }
  },
  {
    id: 26, name: 'Conic Aurora',
    style: {
      background: 'conic-gradient(from 180deg at 40% 40%, rgba(16,185,129,0.4) 0deg, rgba(180,138,12,0.35) 120deg, rgba(3,15,8,0.95) 240deg, rgba(16,185,129,0.3) 360deg)',
      border: '1px solid rgba(16,185,129,0.2)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.75)',
    }
  },
  {
    id: 27, name: 'Sunken Jewel',
    style: {
      background: 'radial-gradient(ellipse at 40% 35%, rgba(16,185,129,0.25) 0%, rgba(3,12,6,0.99) 60%)',
      border: '1px solid rgba(16,185,129,0.18)',
      boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.5), inset 0 -2px 8px rgba(16,185,129,0.08), 0 4px 16px rgba(0,0,0,0.4)',
    }
  },
  {
    id: 28, name: 'Deep Emerald Glow',
    style: {
      background: 'linear-gradient(145deg, rgba(5,40,20,0.97) 0%, rgba(2,12,6,1) 100%)',
      border: '1px solid rgba(16,185,129,0.3)',
      boxShadow: '0 8px 50px rgba(0,0,0,0.8), 0 0 60px rgba(16,185,129,0.15), 0 0 100px rgba(16,185,129,0.06), inset 0 1px 0 rgba(16,185,129,0.2)',
    }
  },
  {
    id: 29, name: 'Deep Gold Glow',
    style: {
      background: 'linear-gradient(145deg, rgba(30,22,2,0.97) 0%, rgba(8,6,1,1) 100%)',
      border: '1px solid rgba(212,175,55,0.35)',
      boxShadow: '0 8px 50px rgba(0,0,0,0.8), 0 0 60px rgba(212,175,55,0.15), 0 0 100px rgba(212,175,55,0.06), inset 0 1px 0 rgba(212,175,55,0.25)',
    }
  },
  {
    id: 30, name: 'Jungle & Amber',
    style: {
      background: 'linear-gradient(160deg, rgba(8,55,25,0.92) 0%, rgba(4,22,10,0.97) 40%, rgba(40,28,2,0.85) 75%, rgba(100,72,5,0.55) 100%)',
      border: '1px solid rgba(180,138,12,0.3)',
      boxShadow: '0 8px 48px rgba(0,0,0,0.75), 0 0 40px rgba(180,138,12,0.1), inset 0 1px 0 rgba(212,175,55,0.18)',
    }
  },
];

function MiniCard({ card, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-[2px] transition-all duration-200 ${selected ? 'ring-2 ring-yellow-400 scale-105' : 'hover:ring-1 hover:ring-white/20 hover:scale-[1.02]'}`}
    >
      <div className="rounded-xl overflow-hidden flex flex-col relative h-full" style={card.style}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '150px' }} />
        <div className="p-2.5 flex flex-col gap-1.5 relative">
          {selected && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-yellow-400 flex items-center justify-center z-10"><span className="text-[7px] text-black font-black">✓</span></div>}
          <div className="flex justify-center">
            <span className="text-[8px] font-semibold text-yellow-400 border border-yellow-400/40 rounded-full px-1.5 py-0.5">Group A</span>
          </div>
          <div className="flex items-center justify-between px-1">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px]">🇨🇿</div>
              <span className="text-[7px] text-white/60">CZE</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-7 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily: "'Bebas Neue',sans-serif" }}>2</div>
              <span className="text-white/30 text-[9px]">-</span>
              <div className="w-6 h-7 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily: "'Bebas Neue',sans-serif" }}>0</div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[10px]">🇿🇦</div>
              <span className="text-[7px] text-white/60">RSA</span>
            </div>
          </div>
          <div className="text-center text-[7px] text-white/30">18/06 · 19:00</div>
          <div className="text-center text-[8px] font-semibold text-white/75 leading-tight px-1 truncate">{card.name}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminGoldGreenDemo() {
  const [selected, setSelected] = useState(null);
  const cur = CARDS.find(c => c.id === selected);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold">🌿 Gold + Green Card BG — 30 קונספטים</h2>
        <p className="text-slate-400 text-sm mt-1">5 מקוריים + 25 וריאציות נוספות. לחץ לבחירה.</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {['1-5: המקוריים','6-10: עיצובי גבול','11-16: ניאון & זוהר','17-22: מרקמים','23-30: מש & מיוחדים'].map(t => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">{t}</span>
          ))}
        </div>
      </div>

      {/* Large preview */}
      {cur && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-72 rounded-2xl overflow-hidden relative" style={cur.style}>
            <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />
            <div className="p-5 flex flex-col gap-3 relative">
              <div className="flex justify-center">
                <span className="text-xs font-semibold text-yellow-400 border border-yellow-400/50 rounded-full px-3 py-1">Group A</span>
              </div>
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">🇨🇿</div>
                  <span className="text-xs text-white/80 font-medium">Czechia</span>
                  <span className="text-[9px] text-white/40">(Home)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-16 rounded-xl bg-white/10 flex items-center justify-center text-4xl font-bold text-white" style={{ fontFamily: "'Bebas Neue',sans-serif" }}>2</div>
                  <span className="text-white/40 text-xl">-</span>
                  <div className="w-12 h-16 rounded-xl bg-white/10 flex items-center justify-center text-4xl font-bold text-white" style={{ fontFamily: "'Bebas Neue',sans-serif" }}>0</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">🇿🇦</div>
                  <span className="text-xs text-white/80 font-medium">South Africa</span>
                  <span className="text-[9px] text-white/40">(Away)</span>
                </div>
              </div>
              <div className="text-center text-xs text-white/40">18/06/2026 · 19:00 · Atlanta</div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm"><span className="text-yellow-400 font-bold">#{cur.id} {cur.name}</span></p>
            {cur.desc && <p className="text-white/40 text-xs mt-0.5">{cur.desc}</p>}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CARDS.map(c => (
          <MiniCard key={c.id} card={c} selected={selected === c.id} onClick={() => setSelected(c.id === selected ? null : c.id)} />
        ))}
      </div>

      {/* CSS output */}
      {cur && (
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <p className="text-slate-400 text-xs mb-2 font-mono">style — #{cur.id} {cur.name}</p>
          <pre className="text-green-400 text-xs font-mono overflow-auto whitespace-pre-wrap">{JSON.stringify(cur.style, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
