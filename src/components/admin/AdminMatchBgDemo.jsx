import React, { useState } from "react";

const BG = [
  // ── גיאומטרי ──
  { id:  1, name: 'פסים זהב אלכסוניים',  cat: 'גיאומטרי', bg: 'repeating-linear-gradient(60deg, #0a0800 0px, #0a0800 18px, #1a1500 18px, #1a1500 20px), radial-gradient(ellipse at 50% 50%, rgba(200,160,0,0.2) 0%, transparent 70%)' },
  { id:  2, name: 'שני חצאים אלכסוני',   cat: 'גיאומטרי', bg: 'linear-gradient(135deg, #06101e 0%, #06101e 49%, #1a1000 51%, #1a1000 100%)' },
  { id:  3, name: 'שלושה פאנלים',        cat: 'גיאומטרי', bg: 'linear-gradient(90deg, rgba(0,30,80,0.9) 0%, rgba(0,30,80,0.9) 33%, rgba(5,5,5,0.97) 33%, rgba(5,5,5,0.97) 66%, rgba(80,10,0,0.85) 66%, rgba(80,10,0,0.85) 100%)' },
  { id:  4, name: 'פסים אנכיים כהים',    cat: 'גיאומטרי', bg: 'repeating-linear-gradient(90deg, #080c12 0px, #080c12 28px, #0d1220 28px, #0d1220 30px)' },
  { id:  5, name: 'חץ מהמרכז',           cat: 'גיאומטרי', bg: 'linear-gradient(to right, #0a1020 0%, #0a1020 50%, #06080e 50%, #06080e 100%), radial-gradient(ellipse at 50% 50%, rgba(245,197,24,0.2) 0%, transparent 50%)' },
  { id:  6, name: 'יהלום מרכזי',         cat: 'גיאומטרי', bg: 'conic-gradient(from 45deg at 50% 50%, #06101e 0deg, #06101e 90deg, #0e1a08 90deg, #0e1a08 180deg, #06101e 180deg, #06101e 270deg, #0e1a08 270deg, #0e1a08 360deg)' },
  { id:  7, name: 'פסים כחול-זהב',       cat: 'גיאומטרי', bg: 'repeating-linear-gradient(45deg, #050a15 0px, #050a15 12px, #120f00 12px, #120f00 13px, #050a15 13px, #050a15 25px)' },
  { id:  8, name: 'X אלכסוני',           cat: 'גיאומטרי', bg: 'linear-gradient(45deg, #06101e 0%, #06101e 40%, rgba(200,160,0,0.25) 50%, #06101e 60%, #06101e 100%), linear-gradient(-45deg, #06101e 0%, #06101e 40%, rgba(200,160,0,0.25) 50%, #06101e 60%, #06101e 100%)' },
  { id:  9, name: 'גריד זהב עדין',       cat: 'גיאומטרי', bg: 'linear-gradient(rgba(180,140,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(180,140,0,0.07) 1px, transparent 1px), #060810' },
  { id: 10, name: 'אלכסון שלוש צבעים',   cat: 'גיאומטרי', bg: 'linear-gradient(120deg, #0e0408 0%, #0e0408 30%, #06101e 30%, #06101e 70%, #0a0e04 70%, #0a0e04 100%)' },

  // ── ספוטלייט ──
  { id: 11, name: 'זרקור מרכזי',         cat: 'ספוטלייט', bg: 'radial-gradient(circle at 50% 40%, rgba(255,220,80,0.35) 0%, rgba(200,160,0,0.15) 25%, transparent 55%), #050508' },
  { id: 12, name: 'זרקור כחול',          cat: 'ספוטלייט', bg: 'radial-gradient(circle at 50% 35%, rgba(40,120,255,0.4) 0%, rgba(10,50,150,0.2) 30%, transparent 60%), #030508' },
  { id: 13, name: 'שני זרקורים',         cat: 'ספוטלייט', bg: 'radial-gradient(circle at 25% 50%, rgba(255,160,0,0.3) 0%, transparent 40%), radial-gradient(circle at 75% 50%, rgba(0,100,255,0.3) 0%, transparent 40%), #040608' },
  { id: 14, name: 'זרקור מלמעלה',        cat: 'ספוטלייט', bg: 'radial-gradient(ellipse at 50% -5%, rgba(255,200,60,0.55) 0%, rgba(180,130,0,0.2) 35%, transparent 60%), #060508' },
  { id: 15, name: 'זרקור ירוק אצטדיון',  cat: 'ספוטלייט', bg: 'radial-gradient(circle at 50% 60%, rgba(0,180,80,0.3) 0%, rgba(0,100,40,0.15) 30%, transparent 60%), #030a05' },
  { id: 16, name: 'ויניט כבד',           cat: 'ספוטלייט', bg: 'radial-gradient(ellipse at 50% 50%, rgba(10,15,30,0.2) 0%, rgba(10,15,30,0.2) 30%, rgba(3,5,10,0.98) 100%), #0d1525' },
  { id: 17, name: 'זרקור ורוד זהב',      cat: 'ספוטלייט', bg: 'radial-gradient(circle at 50% 30%, rgba(255,180,120,0.35) 0%, rgba(180,80,60,0.15) 35%, transparent 60%), #080405' },
  { id: 18, name: 'כתר אור',             cat: 'ספוטלייט', bg: 'radial-gradient(ellipse at 50% 0%, rgba(245,197,24,0.6) 0%, rgba(180,120,0,0.25) 25%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(30,60,150,0.4) 0%, transparent 45%), #040508' },
  { id: 19, name: 'אור לבן פרמיום',      cat: 'ספוטלייט', bg: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.12) 0%, rgba(200,200,255,0.05) 40%, transparent 65%), #08090e' },
  { id: 20, name: 'זרקור סגול',          cat: 'ספוטלייט', bg: 'radial-gradient(circle at 50% 40%, rgba(140,0,255,0.35) 0%, rgba(80,0,160,0.15) 30%, transparent 60%), #060408' },

  // ── מארחות 2026 ──
  { id: 21, name: 'USA — אדום+כחול+לבן', cat: '2026',     bg: 'linear-gradient(160deg, rgba(60,0,0,0.9) 0%, rgba(10,10,40,0.95) 50%, rgba(0,0,80,0.85) 100%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)' },
  { id: 22, name: 'Canada — אדום+לבן',   cat: '2026',     bg: 'radial-gradient(circle at 50% 50%, rgba(255,0,0,0.35) 0%, transparent 45%), linear-gradient(160deg, #1a0000 0%, #0e0808 100%)' },
  { id: 23, name: 'Mexico — ירוק+לבן',   cat: '2026',     bg: 'linear-gradient(160deg, rgba(0,100,0,0.7) 0%, rgba(5,12,5,0.95) 50%, rgba(180,0,0,0.5) 100%)' },
  { id: 24, name: 'WC 2026 — שלוש',      cat: '2026',     bg: 'linear-gradient(120deg, rgba(180,0,0,0.6) 0%, rgba(5,8,15,0.97) 40%, rgba(5,8,15,0.97) 60%, rgba(0,0,120,0.6) 100%)' },
  { id: 25, name: 'מארחות — בתים',       cat: '2026',     bg: 'radial-gradient(ellipse at 20% 50%, rgba(180,0,0,0.4) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(0,140,60,0.3) 0%, transparent 40%), radial-gradient(ellipse at 80% 50%, rgba(0,0,160,0.4) 0%, transparent 45%), #040608' },
  { id: 26, name: 'Levi\'s Stadium',      cat: '2026',     bg: 'radial-gradient(ellipse at 30% 70%, rgba(0,120,80,0.4) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(180,140,0,0.3) 0%, transparent 45%), #05090a' },
  { id: 27, name: 'AT&T Stadium',        cat: '2026',     bg: 'linear-gradient(160deg, #060808 0%, #0e1010 60%, #060608 100%), radial-gradient(ellipse at 50% 20%, rgba(100,120,140,0.25) 0%, transparent 50%)' },
  { id: 28, name: 'MetLife Stadium',     cat: '2026',     bg: 'radial-gradient(ellipse at 50% 0%, rgba(20,60,180,0.45) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(180,0,30,0.35) 0%, transparent 50%), #040508' },
  { id: 29, name: 'Azteca Stadium',      cat: '2026',     bg: 'radial-gradient(ellipse at 30% 40%, rgba(0,120,40,0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(180,0,0,0.4) 0%, transparent 50%), #050a05' },
  { id: 30, name: 'BC Place Vancouver',  cat: '2026',     bg: 'radial-gradient(ellipse at 50% 30%, rgba(0,80,180,0.45) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(0,160,100,0.3) 0%, transparent 50%), #030810' },

  // ── פרמיום כהה ──
  { id: 31, name: 'שיש שחור',            cat: 'פרמיום',   bg: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 25%, #1f1f1f 50%, #0a0a0a 75%, #181818 100%), linear-gradient(45deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)' },
  { id: 32, name: 'קטיפה סגולה',         cat: 'פרמיום',   bg: 'radial-gradient(ellipse at 50% 0%, rgba(100,0,180,0.5) 0%, transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(60,0,100,0.4) 0%, transparent 50%), linear-gradient(160deg, #100818 0%, #08040e 100%)' },
  { id: 33, name: 'עור כהה',             cat: 'פרמיום',   bg: 'linear-gradient(160deg, #1a1008 0%, #0e0a04 50%, #1a1208 100%)' },
  { id: 34, name: 'ספיר מלכותי',         cat: 'פרמיום',   bg: 'radial-gradient(ellipse at 40% 30%, rgba(0,50,200,0.55) 0%, transparent 50%), radial-gradient(ellipse at 70% 70%, rgba(0,20,100,0.4) 0%, transparent 50%), #030515' },
  { id: 35, name: 'גרניט',               cat: 'פרמיום',   bg: 'repeating-linear-gradient(30deg, #101214 0px, #101214 8px, #141618 8px, #141618 9px, #101214 9px, #101214 17px), linear-gradient(160deg, #121416 0%, #0a0c0e 100%)' },
  { id: 36, name: 'כסף מוברש',           cat: 'פרמיום',   bg: 'repeating-linear-gradient(90deg, #181c20 0px, #181c20 1px, #141820 1px, #141820 3px), linear-gradient(160deg, #181c22 0%, #0e1218 100%)' },
  { id: 37, name: 'זהב שרוף',            cat: 'פרמיום',   bg: 'radial-gradient(ellipse at 50% 50%, rgba(200,150,0,0.3) 0%, transparent 60%), linear-gradient(160deg, #1a1200 0%, #0c0a00 50%, #1a1400 100%)' },
  { id: 38, name: 'פלדה כהה',            cat: 'פרמיום',   bg: 'linear-gradient(135deg, #1c2028 0%, #0e1218 50%, #181e26 100%), radial-gradient(ellipse at 50% 50%, rgba(80,120,180,0.1) 0%, transparent 70%)' },
  { id: 39, name: 'שחור+זהב מוספג',      cat: 'פרמיום',   bg: 'radial-gradient(ellipse at 10% 90%, rgba(180,140,0,0.3) 0%, transparent 40%), radial-gradient(ellipse at 90% 10%, rgba(180,140,0,0.25) 0%, transparent 40%), linear-gradient(160deg, #0e0c06 0%, #080600 100%)' },
  { id: 40, name: 'אבן ירחית',           cat: 'פרמיום',   bg: 'radial-gradient(ellipse at 50% 30%, rgba(180,190,220,0.2) 0%, transparent 55%), linear-gradient(160deg, #101418 0%, #080c10 100%)' },

  // ── אווירה חדשה ──
  { id: 41, name: 'שקיעה',               cat: 'אווירה',   bg: 'linear-gradient(180deg, rgba(20,0,60,0.9) 0%, rgba(80,20,0,0.8) 50%, rgba(180,60,0,0.6) 100%), #0a0408' },
  { id: 42, name: 'עמק הגון',            cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 100%, rgba(0,180,80,0.45) 0%, transparent 50%), radial-gradient(ellipse at 50% 0%, rgba(0,30,60,0.8) 0%, transparent 60%), #030608' },
  { id: 43, name: 'ריף מעמקים',          cat: 'אווירה',   bg: 'radial-gradient(ellipse at 30% 60%, rgba(0,120,180,0.5) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(0,60,100,0.4) 0%, transparent 45%), #020810' },
  { id: 44, name: 'ענן סופה',            cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 40%, rgba(60,60,80,0.6) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, rgba(20,20,40,0.5) 0%, transparent 50%), #06060c' },
  { id: 45, name: 'ברד',                 cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 0%, rgba(160,200,255,0.35) 0%, transparent 45%), radial-gradient(ellipse at 30% 80%, rgba(80,140,220,0.25) 0%, transparent 50%), #04080e' },
  { id: 46, name: 'לבה',                 cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 100%, rgba(255,60,0,0.7) 0%, rgba(150,20,0,0.4) 35%, transparent 60%), #0a0200' },
  { id: 47, name: 'ערפל בוקר',           cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 50%, rgba(180,160,140,0.15) 0%, transparent 60%), linear-gradient(180deg, #0c0e10 0%, #10120e 100%)' },
  { id: 48, name: 'צמרות עצים',          cat: 'אווירה',   bg: 'radial-gradient(ellipse at 50% 0%, rgba(0,60,20,0.7) 0%, transparent 50%), radial-gradient(ellipse at 20% 100%, rgba(0,80,30,0.4) 0%, transparent 40%), #030806' },
  { id: 49, name: 'קוסמוס',              cat: 'אווירה',   bg: 'radial-gradient(ellipse at 70% 20%, rgba(60,0,120,0.5) 0%, transparent 45%), radial-gradient(ellipse at 30% 80%, rgba(0,40,120,0.4) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(20,0,60,0.3) 0%, transparent 60%), #020308' },
  { id: 50, name: 'פלזמה',               cat: 'אווירה',   bg: 'radial-gradient(ellipse at 20% 30%, rgba(0,200,255,0.35) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(180,0,255,0.35) 0%, transparent 40%), radial-gradient(ellipse at 50% 50%, rgba(0,80,140,0.2) 0%, transparent 55%), #030508' },
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
