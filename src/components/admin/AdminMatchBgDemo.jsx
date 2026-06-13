import React, { useState } from "react";

const BG = [
  // ── יוקרה ──
  { id:  1, name: 'נוכחי — כחול+זהב',   cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 15% 20%, rgba(30,136,229,0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(251,191,36,0.35) 0%, transparent 45%), rgba(5,10,18,0.75)' },
  { id:  2, name: 'שחור+זהב אלכסוני',   cat: 'יוקרה',    bg: 'linear-gradient(135deg, #0a0a0a 0%, #1a1400 50%, #0d0900 100%), radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.4) 0%, transparent 60%)' },
  { id:  3, name: 'נייבי+שמפניה',        cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 80% 80%, rgba(200,170,110,0.35) 0%, transparent 50%), radial-gradient(ellipse at 20% 20%, rgba(20,40,80,0.9) 0%, transparent 60%), #06101e' },
  { id:  4, name: 'אובסידיאן+רוז גולד',  cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 75% 25%, rgba(183,110,121,0.45) 0%, transparent 55%), radial-gradient(ellipse at 25% 75%, rgba(80,60,70,0.5) 0%, transparent 50%), #0c0810' },
  { id:  5, name: 'שחור+פלטינה',         cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 60% 20%, rgba(200,210,220,0.3) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, rgba(150,160,170,0.2) 0%, transparent 45%), #080b0e' },
  { id:  6, name: 'כהה+ברונזה',          cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 20% 30%, rgba(140,90,40,0.5) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(80,50,20,0.4) 0%, transparent 50%), #0a0704' },
  { id:  7, name: 'חצות+ענבר',           cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 50% 0%, rgba(255,160,30,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(20,15,5,0.8) 0%, transparent 60%), #07080f' },
  { id:  8, name: 'כהה+נחושת',           cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 80% 20%, rgba(184,115,51,0.45) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(100,60,20,0.35) 0%, transparent 50%), #090604' },
  { id:  9, name: 'שחור+אמרלד',          cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 15% 80%, rgba(0,168,107,0.4) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(0,80,50,0.3) 0%, transparent 50%), #040d08' },
  { id: 10, name: 'כהה+רובי',            cat: 'יוקרה',    bg: 'radial-gradient(ellipse at 80% 20%, rgba(200,30,60,0.4) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(100,10,20,0.45) 0%, transparent 50%), #0e0408' },

  // ── סולידי ──
  { id: 11, name: 'נייבי עמוק',          cat: 'סולידי',   bg: 'linear-gradient(160deg, #0b1b3a 0%, #071020 100%)' },
  { id: 12, name: 'שחור עשיר',           cat: 'סולידי',   bg: 'linear-gradient(160deg, #111418 0%, #060809 100%)' },
  { id: 13, name: 'טיל כהה',             cat: 'סולידי',   bg: 'linear-gradient(160deg, #0a2028 0%, #051015 100%)' },
  { id: 14, name: 'סלייט עמוק',          cat: 'סולידי',   bg: 'linear-gradient(160deg, #1a2230 0%, #0d1520 100%)' },
  { id: 15, name: 'ירוק יער כהה',        cat: 'סולידי',   bg: 'linear-gradient(160deg, #0d1f10 0%, #060e07 100%)' },
  { id: 16, name: 'בורדו כהה',           cat: 'סולידי',   bg: 'linear-gradient(160deg, #1e0810 0%, #0e0408 100%)' },
  { id: 17, name: 'סגול לילה',           cat: 'סולידי',   bg: 'linear-gradient(160deg, #150d25 0%, #0a0614 100%)' },
  { id: 18, name: 'אינדיגו כהה',         cat: 'סולידי',   bg: 'linear-gradient(160deg, #0e0f30 0%, #080918 100%)' },
  { id: 19, name: 'פחם+כחול',            cat: 'סולידי',   bg: 'linear-gradient(160deg, #161c24 0%, #0a1018 100%)' },
  { id: 20, name: 'חום מריר',            cat: 'סולידי',   bg: 'linear-gradient(160deg, #1a1006 0%, #0d0804 100%)' },

  // ── מונדיאל ──
  { id: 21, name: 'קטאר 2022',           cat: 'מונדיאל',  bg: 'radial-gradient(ellipse at 30% 30%, rgba(128,0,32,0.7) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(180,140,60,0.4) 0%, transparent 50%), #0d0408' },
  { id: 22, name: 'ברזיל 2014',          cat: 'מונדיאל',  bg: 'radial-gradient(ellipse at 20% 80%, rgba(0,130,60,0.55) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(220,180,0,0.45) 0%, transparent 50%), #060d06' },
  { id: 23, name: 'צרפת כחול+אדום',      cat: 'מונדיאל',  bg: 'linear-gradient(135deg, rgba(0,35,149,0.85) 0%, rgba(20,20,40,0.9) 50%, rgba(237,41,57,0.75) 100%)' },
  { id: 24, name: 'גרמניה שחור+זהב',     cat: 'מונדיאל',  bg: 'linear-gradient(160deg, #0e0c08 0%, #1a1500 60%, #1a1200 100%), radial-gradient(ellipse at 70% 30%, rgba(220,180,0,0.35) 0%, transparent 55%)' },
  { id: 25, name: 'ספרד אדום+כתום',      cat: 'מונדיאל',  bg: 'radial-gradient(ellipse at 50% 0%, rgba(200,16,46,0.7) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(170,100,0,0.5) 0%, transparent 55%), #150408' },
  { id: 26, name: 'ארגנטינה כחול+לבן',   cat: 'מונדיאל',  bg: 'linear-gradient(160deg, rgba(116,172,223,0.7) 0%, rgba(255,255,255,0.05) 50%, rgba(116,172,223,0.5) 100%), #080f18' },
  { id: 27, name: 'הולנד כתום+שחור',     cat: 'מונדיאל',  bg: 'radial-gradient(ellipse at 70% 20%, rgba(255,110,0,0.6) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(80,40,0,0.5) 0%, transparent 50%), #0d0800' },
  { id: 28, name: 'פורטוגל ירוק+אדום',   cat: 'מונדיאל',  bg: 'linear-gradient(135deg, rgba(6,111,44,0.7) 0%, rgba(15,15,15,0.9) 50%, rgba(200,16,46,0.65) 100%)' },
  { id: 29, name: 'אנגליה אדום+לבן',     cat: 'מונדיאל',  bg: 'radial-gradient(ellipse at 50% 30%, rgba(220,30,30,0.5) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(180,180,180,0.15) 0%, transparent 50%), #120404' },
  { id: 30, name: 'FIFA Trophy',          cat: 'מונדיאל',  bg: 'radial-gradient(ellipse at 50% 0%, rgba(220,190,80,0.6) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(140,100,0,0.4) 0%, transparent 55%), #0c0900' },

  // ── 2-3 צבעים ──
  { id: 31, name: 'כחול→סגול',           cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(30,60,200,0.8) 0%, rgba(10,10,30,0.95) 50%, rgba(100,20,180,0.7) 100%)' },
  { id: 32, name: 'ירוק→כחול→שחור',      cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(0,120,80,0.75) 0%, rgba(5,10,30,0.9) 55%, rgba(20,50,120,0.65) 100%)' },
  { id: 33, name: 'אדום→שחור',           cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(180,20,20,0.8) 0%, rgba(8,4,4,0.97) 60%, rgba(60,5,5,0.85) 100%)' },
  { id: 34, name: 'זהב→שחור→זהב',        cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(180,140,0,0.6) 0%, rgba(6,5,2,0.97) 50%, rgba(160,120,0,0.5) 100%)' },
  { id: 35, name: 'טיל→נייבי',           cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(0,140,140,0.7) 0%, rgba(4,10,20,0.95) 55%, rgba(0,30,80,0.8) 100%)' },
  { id: 36, name: 'סגול→ורוד',           cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(80,0,140,0.75) 0%, rgba(10,4,18,0.95) 50%, rgba(160,20,100,0.6) 100%)' },
  { id: 37, name: 'כתום→אדום→שחור',      cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(220,100,0,0.7) 0%, rgba(160,20,20,0.6) 50%, rgba(8,4,2,0.97) 100%)' },
  { id: 38, name: 'כחול→טיל→שחור',       cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(20,80,200,0.7) 0%, rgba(0,120,140,0.5) 50%, rgba(5,8,12,0.97) 100%)' },
  { id: 39, name: 'זהב→כתום→שחור',       cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(210,170,0,0.65) 0%, rgba(180,80,0,0.55) 50%, rgba(8,5,2,0.97) 100%)' },
  { id: 40, name: 'נייבי→סגול→שחור',     cat: '2-3 צבעים', bg: 'linear-gradient(135deg, rgba(10,30,100,0.8) 0%, rgba(60,10,100,0.6) 55%, rgba(6,4,10,0.97) 100%)' },

  // ── אווירה ──
  { id: 41, name: 'אורות אצטדיון',       cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% -10%, rgba(255,220,100,0.5) 0%, transparent 50%), radial-gradient(ellipse at 50% 110%, rgba(30,80,180,0.4) 0%, transparent 55%), #060810' },
  { id: 42, name: 'משחק לילה',           cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 50%, rgba(20,40,90,0.6) 0%, transparent 70%), linear-gradient(180deg, #030608 0%, #060c18 100%)' },
  { id: 43, name: 'גביע מנצנץ',          cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 20%, rgba(255,210,60,0.55) 0%, transparent 45%), radial-gradient(ellipse at 30% 80%, rgba(180,140,0,0.3) 0%, transparent 50%), #09080000' },
  { id: 44, name: 'סיבי פחמן',           cat: 'אווירה',   bg: 'repeating-linear-gradient(45deg, #0e1014 0px, #0e1014 2px, #12151a 2px, #12151a 4px)' },
  { id: 45, name: 'חלל עמוק',            cat: 'אווירה',   bg: 'radial-gradient(ellipse at 30% 40%, rgba(80,0,160,0.35) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0,40,120,0.3) 0%, transparent 50%), #03040c' },
  { id: 46, name: 'אורורה בורליס',       cat: 'אווירה',   bg: 'radial-gradient(ellipse at 20% 50%, rgba(0,200,140,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(100,0,200,0.4) 0%, transparent 50%), #030a0e' },
  { id: 47, name: 'גחלים',               cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 100%, rgba(220,80,0,0.6) 0%, transparent 50%), radial-gradient(ellipse at 50% 60%, rgba(120,30,0,0.4) 0%, transparent 45%), #0a0402' },
  { id: 48, name: 'זכוכית כחולה',        cat: 'אווירה',   bg: 'linear-gradient(135deg, rgba(30,60,120,0.55) 0%, rgba(10,20,50,0.85) 50%, rgba(20,40,100,0.5) 100%), rgba(8,12,25,0.9)' },
  { id: 49, name: 'קרח כחול-לבן',        cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 0%, rgba(180,220,255,0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(40,80,160,0.5) 0%, transparent 55%), #05080f' },
  { id: 50, name: 'חשמל ניאון',          cat: 'אווירה',   bg: 'radial-gradient(ellipse at 20% 50%, rgba(0,100,255,0.5) 0%, transparent 45%), radial-gradient(ellipse at 80% 50%, rgba(0,200,255,0.35) 0%, transparent 45%), radial-gradient(ellipse at 50% 100%, rgba(0,50,120,0.4) 0%, transparent 50%), #020508' },
];

const CATS = ['הכל', 'יוקרה', 'סולידי', 'מונדיאל', '2-3 צבעים', 'אווירה'];

function MiniCard({ bg, selected, onClick, id, name }) {
  return (
    <button
      onClick={onClick}
      className="relative rounded-xl overflow-hidden transition-all duration-150 flex flex-col"
      style={{
        background: bg,
        border: selected ? '2px solid #f5c518' : '2px solid rgba(255,255,255,0.06)',
        aspectRatio: '3/4',
        boxShadow: selected ? '0 0 12px rgba(245,197,24,0.5)' : 'none',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
        <span className="text-white/40 text-[9px] font-black leading-none">{id}</span>
        <div className="w-4/5 h-0.5 rounded-full bg-white/20" />
        <div className="flex gap-1 mt-0.5">
          <div className="w-4 h-4 rounded bg-white/15" />
          <div className="w-4 h-4 rounded bg-white/15" />
        </div>
        <div className="w-4/5 h-0.5 rounded-full bg-white/10 mt-0.5" />
      </div>
      {selected && (
        <div className="absolute bottom-0 inset-x-0 bg-amber-400 text-black text-[7px] font-black text-center py-0.5">✓</div>
      )}
    </button>
  );
}

function FullPreview({ bg }) {
  return (
    <div className="rounded-2xl overflow-hidden relative" style={{ background: bg, border: '1px solid rgba(255,255,255,0.1)' }}>
      {/* noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />

      <div className="relative p-5" dir="rtl">
        {/* countdown */}
        <div className="flex justify-center mb-4">
          <div className="flex rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}>
            {[['3','ימים'],['3','שעות'],['52','דקות'],['2','שניות']].map(([v,l],i) => (
              <div key={i} className="flex flex-col items-center px-3 py-2">
                <span className="text-white font-black text-sm">{v}</span>
                <span className="text-white/40 text-[9px]">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* group */}
        <div className="flex justify-center mb-4">
          <div className="px-5 py-1 rounded-full" style={{ background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.35)' }}>
            <span className="text-amber-400 text-xs font-bold">Group I</span>
          </div>
        </div>

        {/* teams */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-xl" style={{ background: 'rgba(0,35,149,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div className="w-full h-full flex items-center justify-center text-xl">🇫🇷</div>
            </div>
            <span className="text-white text-xs font-semibold">France</span>
            <span className="text-white/35 text-[9px]">(Home)</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span className="text-white font-black text-lg">2</span>
              </div>
            </div>
            <span className="text-white/30 font-bold">-</span>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span className="text-white font-black text-lg">0</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-14 rounded-xl" style={{ background: 'rgba(0,100,0,0.8)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div className="w-full h-full flex items-center justify-center text-xl">🇸🇳</div>
            </div>
            <span className="text-white text-xs font-semibold">Senegal</span>
            <span className="text-white/35 text-[9px]">(Away)</span>
          </div>
        </div>

        {/* תחזית */}
        <div className="text-center mb-3">
          <span className="text-white/50 text-[10px] font-semibold tracking-widest uppercase">תחזית המשחק</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[['France','60%'],['תיקו','21%'],['Senegal','19%']].map(([l,v],i) => (
            <div key={i} className="rounded-xl py-2 flex flex-col items-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-white/50 text-[9px]">{l}</span>
              <span className="text-white font-bold text-sm">{v}</span>
            </div>
          ))}
        </div>

        {/* odds chips */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-4">
          {[['1:0','11%'],['2:0','11%'],['1:1','9%'],['2:1','9%'],['3:0','8%']].map(([s,p],i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-blue-300 text-[10px] font-bold">{s}</span>
              <span className="text-white/40 text-[9px]">{p}</span>
            </div>
          ))}
        </div>

        {/* date */}
        <div className="flex flex-col items-center gap-1 mb-4">
          <span className="text-white/40 text-[10px]">📅 16/06/2026 · 22:00</span>
          <span className="text-white/30 text-[10px]">📍 New York/New Jersey Stadium</span>
        </div>

        {/* tabs */}
        <div className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="py-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <span className="text-white/50 text-xs font-semibold">1 X 2</span>
          </div>
          <div className="py-2 text-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <span className="text-white text-xs font-semibold">ניחושים</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMatchBgDemo() {
  const [sel, setSel] = useState(1);
  const [cat, setCat] = useState('הכל');

  const filtered = cat === 'הכל' ? BG : BG.filter(b => b.cat === cat);
  const selected = BG.find(b => b.id === sel);

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">50 רקעים לכרטיס משחק</h2>
        <p className="text-slate-400 text-sm mt-1">בחר קטגוריה וסגנון — #1 הוא הנוכחי</p>
      </div>

      {/* קטגוריות */}
      <div className="flex flex-wrap gap-2">
        {CATS.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: cat === c ? 'rgba(245,197,24,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${cat === c ? 'rgba(245,197,24,0.5)' : 'rgba(255,255,255,0.1)'}`,
              color: cat === c ? '#f5c518' : '#94a3b8',
            }}>
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* גריד בחירה */}
        <div className="flex-1">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))' }}>
            {filtered.map(b => (
              <MiniCard key={b.id} id={b.id} name={b.name} bg={b.bg} selected={sel === b.id} onClick={() => setSel(b.id)} />
            ))}
          </div>
        </div>

        {/* תצוגה מקדימה */}
        <div className="w-full lg:w-72 shrink-0 space-y-3">
          <div>
            <p className="text-white font-semibold text-sm">{selected?.id}. {selected?.name}</p>
            <p className="text-slate-500 text-xs">{selected?.cat}</p>
          </div>
          {selected && <FullPreview bg={selected.bg} />}
        </div>
      </div>
    </div>
  );
}
