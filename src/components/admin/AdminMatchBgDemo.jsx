import React, { useState } from "react";

const BG = [
  // ── זוג זרקורים ── שני אורות צבעוניים, אחד משמאל ואחד מימין, כמו צבעי הקבוצות
  { id:  1, name: 'כחול + זהב',           cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 12% 50%, rgba(28,115,255,0.62) 0%, rgba(10,55,180,0.20) 38%, transparent 55%), radial-gradient(ellipse at 88% 50%, rgba(245,197,24,0.58) 0%, rgba(160,120,0,0.18) 38%, transparent 55%), #030508' },
  { id:  2, name: 'אדום + כחול',          cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 12% 15%, rgba(220,30,55,0.68) 0%, rgba(140,15,25,0.22) 38%, transparent 56%), radial-gradient(ellipse at 88% 85%, rgba(20,80,225,0.62) 0%, rgba(10,40,140,0.20) 38%, transparent 56%), #080306' },
  { id:  3, name: 'ירוק + כתום',          cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 12% 85%, rgba(0,185,80,0.62) 0%, rgba(0,100,40,0.20) 38%, transparent 54%), radial-gradient(ellipse at 88% 15%, rgba(248,112,0,0.60) 0%, rgba(160,60,0,0.18) 38%, transparent 54%), #030806' },
  { id:  4, name: 'סגול + טורקיז',        cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 12% 50%, rgba(118,0,228,0.62) 0%, rgba(60,0,140,0.20) 38%, transparent 55%), radial-gradient(ellipse at 88% 50%, rgba(0,188,165,0.58) 0%, rgba(0,100,90,0.18) 38%, transparent 55%), #040308' },
  { id:  5, name: 'כתום למעלה + כחול למטה', cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 50% 8%, rgba(255,118,0,0.65) 0%, rgba(180,60,0,0.20) 38%, transparent 56%), radial-gradient(ellipse at 50% 92%, rgba(18,82,208,0.62) 0%, rgba(8,40,140,0.20) 38%, transparent 56%), #060408' },
  { id:  6, name: 'ציאן + מג׳נטה',        cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 85% 12%, rgba(0,205,248,0.62) 0%, rgba(0,110,180,0.20) 38%, transparent 55%), radial-gradient(ellipse at 15% 88%, rgba(228,0,182,0.60) 0%, rgba(140,0,110,0.18) 38%, transparent 55%), #030508' },
  { id:  7, name: 'זהב + ארגמן',          cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 12% 50%, rgba(228,178,0,0.65) 0%, rgba(148,108,0,0.22) 38%, transparent 55%), radial-gradient(ellipse at 88% 50%, rgba(202,20,42,0.62) 0%, rgba(120,10,20,0.20) 38%, transparent 55%), #080402' },
  { id:  8, name: 'אמרלד + שמיים',        cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 12% 18%, rgba(0,188,102,0.62) 0%, rgba(0,100,52,0.20) 38%, transparent 56%), radial-gradient(ellipse at 88% 82%, rgba(38,168,248,0.60) 0%, rgba(15,85,180,0.18) 38%, transparent 56%), #030807' },
  { id:  9, name: 'ורוד + נייבי',         cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 85% 15%, rgba(228,72,122,0.62) 0%, rgba(148,35,72,0.20) 38%, transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(8,28,148,0.70) 0%, rgba(4,14,80,0.28) 38%, transparent 55%), #050308' },
  { id: 10, name: 'אור + אדום',           cat: 'זוג זרקורים', bg: 'radial-gradient(ellipse at 50% 5%, rgba(248,242,255,0.30) 0%, rgba(185,162,255,0.10) 28%, transparent 48%), radial-gradient(ellipse at 50% 95%, rgba(208,18,42,0.68) 0%, rgba(128,8,20,0.25) 38%, transparent 55%), #080305' },

  // ── מש גרדיאנט ── 4 פינות שמתמזגות למרכז — אורגני ועשיר
  { id: 11, name: 'כחול–סגול–ירוק–ורוד',  cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 5%, rgba(28,102,255,0.58) 0%, transparent 58%), radial-gradient(ellipse at 95% 5%, rgba(118,0,208,0.52) 0%, transparent 58%), radial-gradient(ellipse at 5% 95%, rgba(0,168,98,0.52) 0%, transparent 58%), radial-gradient(ellipse at 95% 95%, rgba(208,38,122,0.48) 0%, transparent 58%), #040508' },
  { id: 12, name: 'זהב–אדום–כחול–ירוק',   cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 5%, rgba(208,168,0,0.58) 0%, transparent 58%), radial-gradient(ellipse at 95% 5%, rgba(208,28,28,0.52) 0%, transparent 58%), radial-gradient(ellipse at 5% 95%, rgba(18,82,208,0.52) 0%, transparent 58%), radial-gradient(ellipse at 95% 95%, rgba(0,148,58,0.48) 0%, transparent 58%), #060504' },
  { id: 13, name: 'מש חם',                cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 95%, rgba(255,118,0,0.62) 0%, transparent 56%), radial-gradient(ellipse at 95% 5%, rgba(228,0,38,0.58) 0%, transparent 56%), radial-gradient(ellipse at 95% 95%, rgba(188,0,118,0.48) 0%, transparent 54%), radial-gradient(ellipse at 5% 5%, rgba(118,38,0,0.42) 0%, transparent 52%), #080402' },
  { id: 14, name: 'מש קר',                cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 5%, rgba(0,208,228,0.55) 0%, transparent 58%), radial-gradient(ellipse at 95% 95%, rgba(78,0,208,0.52) 0%, transparent 58%), radial-gradient(ellipse at 95% 5%, rgba(0,78,208,0.48) 0%, transparent 54%), radial-gradient(ellipse at 5% 95%, rgba(0,168,168,0.45) 0%, transparent 54%), #030508' },
  { id: 15, name: 'מש שקיעה',             cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 95%, rgba(208,0,78,0.62) 0%, transparent 56%), radial-gradient(ellipse at 95% 5%, rgba(248,102,0,0.55) 0%, transparent 56%), radial-gradient(ellipse at 5% 5%, rgba(98,0,168,0.48) 0%, transparent 54%), radial-gradient(ellipse at 95% 95%, rgba(182,18,58,0.40) 0%, transparent 52%), #080306' },
  { id: 16, name: 'מש חלל',               cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 5%, rgba(18,58,208,0.58) 0%, transparent 58%), radial-gradient(ellipse at 95% 95%, rgba(98,0,188,0.55) 0%, transparent 58%), radial-gradient(ellipse at 95% 5%, rgba(0,28,118,0.48) 0%, transparent 52%), radial-gradient(ellipse at 5% 95%, rgba(58,0,148,0.42) 0%, transparent 54%), #020308' },
  { id: 17, name: 'מש טבע',               cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 95%, rgba(0,142,58,0.58) 0%, transparent 56%), radial-gradient(ellipse at 95% 5%, rgba(0,82,188,0.52) 0%, transparent 56%), radial-gradient(ellipse at 50% 0%, rgba(182,142,0,0.40) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(0,102,28,0.40) 0%, transparent 50%), #030806' },
  { id: 18, name: 'מש ים',                cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 5%, rgba(0,168,188,0.55) 0%, transparent 58%), radial-gradient(ellipse at 95% 5%, rgba(0,102,228,0.52) 0%, transparent 58%), radial-gradient(ellipse at 5% 95%, rgba(0,82,148,0.50) 0%, transparent 56%), radial-gradient(ellipse at 95% 95%, rgba(0,148,148,0.45) 0%, transparent 56%), #020810' },
  { id: 19, name: 'מש אש',                cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 95%, rgba(255,58,0,0.65) 0%, transparent 54%), radial-gradient(ellipse at 95% 95%, rgba(248,158,0,0.58) 0%, transparent 54%), radial-gradient(ellipse at 50% 8%, rgba(188,0,0,0.48) 0%, transparent 52%), radial-gradient(ellipse at 50% 52%, rgba(118,28,0,0.32) 0%, transparent 58%), #080302' },
  { id: 20, name: 'מש ניאון',              cat: 'מש גרדיאנט', bg: 'radial-gradient(ellipse at 5% 5%, rgba(0,255,122,0.48) 0%, transparent 54%), radial-gradient(ellipse at 95% 5%, rgba(0,122,255,0.48) 0%, transparent 54%), radial-gradient(ellipse at 5% 95%, rgba(255,0,182,0.42) 0%, transparent 52%), radial-gradient(ellipse at 95% 95%, rgba(202,228,0,0.40) 0%, transparent 52%), #030505' },

  // ── פרמיום מבטא ── אור יחיד ממוקד, רקע עמוק, תחושת יוקרה
  { id: 21, name: 'ספיר',                 cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 35% 38%, rgba(0,78,225,0.70) 0%, rgba(0,38,128,0.30) 42%, transparent 65%), #030510' },
  { id: 22, name: 'אמרלד',                cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 35% 42%, rgba(0,172,90,0.70) 0%, rgba(0,90,42,0.28) 42%, transparent 65%), #030905' },
  { id: 23, name: 'ארגמן',                cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 65% 38%, rgba(188,0,38,0.72) 0%, rgba(102,0,18,0.30) 42%, transparent 65%), #080205' },
  { id: 24, name: 'זהב מלכותי',           cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 50% 32%, rgba(222,178,0,0.68) 0%, rgba(142,108,0,0.28) 42%, transparent 65%), #080700' },
  { id: 25, name: 'טורקיז',               cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 62% 42%, rgba(0,188,172,0.65) 0%, rgba(0,90,82,0.28) 42%, transparent 65%), #030908' },
  { id: 26, name: 'פורפל',                cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 40% 38%, rgba(128,0,218,0.68) 0%, rgba(62,0,112,0.28) 42%, transparent 65%), #050308' },
  { id: 27, name: 'ספיר + זהב עדין',      cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 28% 40%, rgba(18,68,188,0.62) 0%, transparent 58%), radial-gradient(ellipse at 72% 65%, rgba(198,152,0,0.38) 0%, transparent 46%), #030510' },
  { id: 28, name: 'בורדו + פלטינה',       cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 30% 42%, rgba(130,0,28,0.68) 0%, transparent 56%), radial-gradient(ellipse at 76% 62%, rgba(198,208,218,0.22) 0%, transparent 42%), #080206' },
  { id: 29, name: 'נחושת שחורה',          cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 65% 40%, rgba(188,90,28,0.60) 0%, transparent 54%), radial-gradient(ellipse at 28% 65%, rgba(102,48,8,0.38) 0%, transparent 46%), #080402' },
  { id: 30, name: 'ג׳ט + כסף',            cat: 'פרמיום מבטא', bg: 'radial-gradient(ellipse at 50% 35%, rgba(168,178,198,0.22) 0%, rgba(102,115,138,0.10) 36%, transparent 60%), linear-gradient(160deg, #101418 0%, #080c10 100%)' },

  // ── ניאון ── אור ריכוזי עם ציפת זוהר, כמו שלט ניאון
  { id: 31, name: 'ניאון כחול',           cat: 'ניאון', bg: 'radial-gradient(circle at 50% 48%, rgba(0,112,255,0.58) 0%, rgba(0,68,202,0.28) 24%, rgba(0,28,102,0.12) 48%, transparent 68%), radial-gradient(circle at 50% 48%, rgba(102,182,255,0.18) 0%, transparent 34%), #020408' },
  { id: 32, name: 'ניאון ירוק',           cat: 'ניאון', bg: 'radial-gradient(circle at 50% 48%, rgba(0,228,102,0.55) 0%, rgba(0,148,58,0.26) 24%, rgba(0,58,22,0.12) 48%, transparent 68%), radial-gradient(circle at 50% 48%, rgba(122,255,178,0.16) 0%, transparent 34%), #020804' },
  { id: 33, name: 'ניאון ורוד',           cat: 'ניאון', bg: 'radial-gradient(circle at 50% 48%, rgba(255,0,162,0.55) 0%, rgba(188,0,98,0.26) 24%, rgba(78,0,38,0.12) 48%, transparent 68%), radial-gradient(circle at 50% 48%, rgba(255,138,208,0.16) 0%, transparent 34%), #080205' },
  { id: 34, name: 'ניאון כתום',           cat: 'ניאון', bg: 'radial-gradient(circle at 50% 48%, rgba(255,118,0,0.58) 0%, rgba(202,58,0,0.28) 24%, rgba(80,22,0,0.12) 48%, transparent 68%), radial-gradient(circle at 50% 48%, rgba(255,178,92,0.18) 0%, transparent 34%), #080403' },
  { id: 35, name: 'ניאון סגול',           cat: 'ניאון', bg: 'radial-gradient(circle at 50% 48%, rgba(162,0,255,0.55) 0%, rgba(90,0,178,0.26) 24%, rgba(35,0,68,0.12) 48%, transparent 68%), radial-gradient(circle at 50% 48%, rgba(202,122,255,0.16) 0%, transparent 34%), #050208' },
  { id: 36, name: 'ניאון כחול + ורוד',    cat: 'ניאון', bg: 'radial-gradient(circle at 26% 50%, rgba(0,112,255,0.55) 0%, rgba(0,58,188,0.22) 28%, transparent 50%), radial-gradient(circle at 74% 50%, rgba(255,0,162,0.55) 0%, rgba(178,0,98,0.22) 28%, transparent 50%), #030308' },
  { id: 37, name: 'ניאון ציאן + סגול',    cat: 'ניאון', bg: 'radial-gradient(circle at 26% 50%, rgba(0,218,242,0.55) 0%, rgba(0,115,168,0.22) 28%, transparent 50%), radial-gradient(circle at 74% 50%, rgba(152,0,242,0.55) 0%, rgba(80,0,148,0.22) 28%, transparent 50%), #030508' },
  { id: 38, name: 'ניאון ירוק + ורוד',    cat: 'ניאון', bg: 'radial-gradient(circle at 26% 50%, rgba(0,238,102,0.55) 0%, rgba(0,122,48,0.22) 28%, transparent 50%), radial-gradient(circle at 74% 50%, rgba(255,0,152,0.52) 0%, rgba(168,0,80,0.20) 28%, transparent 50%), #030505' },
  { id: 39, name: 'ניאון כתום + כחול',    cat: 'ניאון', bg: 'radial-gradient(circle at 26% 50%, rgba(255,118,0,0.58) 0%, rgba(188,52,0,0.22) 28%, transparent 50%), radial-gradient(circle at 74% 50%, rgba(0,108,255,0.55) 0%, rgba(0,52,178,0.22) 28%, transparent 50%), #050408' },
  { id: 40, name: 'ניאון לבן',            cat: 'ניאון', bg: 'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.18) 0%, rgba(202,218,255,0.09) 30%, rgba(142,168,218,0.04) 52%, transparent 68%), #06070c' },

  // ── אטמוספירה ── נוף, סביבה, תחושת מקום
  { id: 41, name: 'שחר חורפי',            cat: 'אטמוספירה', bg: 'linear-gradient(180deg, rgba(18,28,58,0.96) 0%, rgba(58,38,28,0.82) 55%, rgba(120,78,38,0.58) 100%), #080608' },
  { id: 42, name: 'ים לילה',              cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 50% 100%, rgba(0,58,148,0.72) 0%, transparent 60%), radial-gradient(ellipse at 50% 0%, rgba(0,18,58,0.90) 0%, transparent 65%), #02050a' },
  { id: 43, name: 'שקיעת דם',             cat: 'אטמוספירה', bg: 'linear-gradient(180deg, rgba(4,4,14,0.98) 0%, rgba(98,18,0,0.82) 58%, rgba(202,58,0,0.58) 100%), #080302' },
  { id: 44, name: 'ג׳ונגל לילי',          cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 28% 78%, rgba(0,78,28,0.72) 0%, transparent 54%), radial-gradient(ellipse at 72% 18%, rgba(0,118,48,0.50) 0%, transparent 54%), linear-gradient(160deg, #030a04 0%, #060d05 100%)' },
  { id: 45, name: 'ערפל אפל',             cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 50% 50%, rgba(78,80,102,0.30) 0%, transparent 68%), radial-gradient(ellipse at 30% 30%, rgba(58,60,82,0.22) 0%, transparent 52%), linear-gradient(160deg, #0a0c10 0%, #080a0e 100%)' },
  { id: 46, name: 'מדבר קר',              cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 70% 28%, rgba(188,145,58,0.44) 0%, transparent 58%), radial-gradient(ellipse at 28% 72%, rgba(125,82,18,0.36) 0%, transparent 54%), linear-gradient(160deg, #0a0806 0%, #080604 100%)' },
  { id: 47, name: 'גלאציר',               cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 50% 0%, rgba(180,228,255,0.36) 0%, transparent 54%), radial-gradient(ellipse at 28% 82%, rgba(58,142,208,0.34) 0%, transparent 54%), linear-gradient(160deg, #04090e 0%, #050b10 100%)' },
  { id: 48, name: 'ענן סערה',             cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 38% 28%, rgba(58,68,100,0.65) 0%, transparent 60%), radial-gradient(ellipse at 68% 70%, rgba(28,38,70,0.52) 0%, transparent 54%), #05060c' },
  { id: 49, name: 'ריף תת-ימי',           cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 58% 38%, rgba(0,165,185,0.62) 0%, transparent 54%), radial-gradient(ellipse at 28% 68%, rgba(0,100,120,0.48) 0%, transparent 54%), radial-gradient(ellipse at 82% 70%, rgba(205,80,38,0.34) 0%, transparent 42%), #030a0a' },
  { id: 50, name: 'הר הגעש',              cat: 'אטמוספירה', bg: 'radial-gradient(ellipse at 50% 100%, rgba(255,78,0,0.75) 0%, rgba(180,28,0,0.46) 28%, transparent 65%), radial-gradient(ellipse at 50% 60%, rgba(100,18,0,0.34) 0%, transparent 54%), #080200' },
];

const CATS = ['הכל', 'זוג זרקורים', 'מש גרדיאנט', 'פרמיום מבטא', 'ניאון', 'אטמוספירה'];

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
