import React from "react";

// Shared mock data — same shape as real LiveLeaderboard rows (userId/name/total/delta),
// used so every variant below is compared on identical content.
const MOCK_ROWS = [
  { rank: 1, name: "דימה",  score: 128.5, delta: 2 },
  { rank: 2, name: "יוסי",  score: 121.0, delta: -1 },
  { rank: 3, name: "מוטי",  score: 115.5, delta: 0 },
  { rank: 4, name: "שי",    score: 98.0,  delta: 1 },
];

const RANK_COLOR  = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#64748b';
const RANK_BORDER = r => r === 1 ? '#FFD700' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const RANK_BG     = r => r === 1 ? 'linear-gradient(135deg,rgba(250,204,21,.22),rgba(245,158,11,.22))'
                       : r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,.18),rgba(156,163,175,.18))'
                       : r === 3 ? 'linear-gradient(135deg,rgba(245,158,11,.20),rgba(217,119,6,.20))'
                       : 'rgba(30,41,59,.60)';

function DeltaTag({ delta }) {
  if (!delta) return <span className="text-[10px] text-slate-600">—</span>;
  return (
    <span className={`text-[10px] font-bold ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {delta > 0 ? `▲${delta}` : `▼${Math.abs(delta)}`}
    </span>
  );
}

function RowContent({ row }) {
  return (
    <>
      <span className="text-[11px] font-semibold text-slate-200 flex-1 min-w-0 truncate text-center">{row.name}</span>
      <span className="text-[11px] font-bold text-emerald-400 tabular-nums">{row.score}</span>
      <DeltaTag delta={row.delta} />
    </>
  );
}

// ── 20 shape variants ──────────────────────────────────────────────────────

// 1. Straight rectangle, sharp corners, colored left accent bar
function Row1({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2" style={{ background: RANK_BG(row.rank), borderRight: `4px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 2. Fully rounded pill / capsule
function Row2({ row }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: RANK_BG(row.rank), border: `1.5px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 3. Hexagonal angled-tag left edge
function Row3({ row }) {
  return (
    <div className="flex items-center gap-2 pr-3 pl-4 py-2" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`, clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)' }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 4. Chevron / arrow-pointed right edge
function Row4({ row }) {
  return (
    <div className="flex items-center gap-2 pl-4 pr-6 py-2" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`, clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)' }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 5. Ticket-stub with a punched circular notch on the left edge
function Row5({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: RANK_BG(row.rank), border: `1px dashed ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: '#0a1220' }} />
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 6. Reverse-diagonal parallelogram (opposite skew of current design)
function Row6({ row }) {
  return (
    <div style={{ transform: 'skewX(6deg)' }}>
      <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ transform: 'skewX(-6deg)', background: RANK_BG(row.rank), border: `1.5px solid ${RANK_BORDER(row.rank)}` }}>
        <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
        <RowContent row={row} />
      </div>
    </div>
  );
}

// 7. Rank badge circle floating outside the rounded card's left edge
function Row7({ row }) {
  return (
    <div className="relative flex items-center gap-2 pl-6 pr-3 py-2 rounded-xl ml-3" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
        style={{ background: '#0a1220', border: `2px solid ${RANK_BORDER(row.rank)}`, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 8. Folded-corner "page turn" card
function Row8({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg overflow-hidden" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <div className="absolute top-0 left-0" style={{ width: 0, height: 0, borderTop: `14px solid ${RANK_BORDER(row.rank)}`, borderRight: '14px solid transparent' }} />
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 9. Speech-bubble with a small tail pointing to the rank
function Row9({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl mr-2" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <div className="absolute -right-1.5 top-1/2 -translate-y-1/2" style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: `7px solid ${RANK_BORDER(row.rank)}` }} />
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 10. Trapezoid podium-step (top-1 widest, narrowing down)
function Row10({ row }) {
  const inset = Math.max(0, (row.rank - 1) * 6);
  return (
    <div className="flex items-center gap-2 px-3 py-2" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`, clipPath: `polygon(${inset}px 0, calc(100% - ${inset}px) 0, 100% 100%, 0 100%)` }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 11. Shield / crest (pointed bottom) for the podium, plain rect otherwise
function Row11({ row }) {
  const shield = row.rank <= 3;
  return (
    <div className="flex items-center gap-2 px-3 py-2.5" style={{
      background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`,
      clipPath: shield ? 'polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)' : undefined,
      borderRadius: shield ? 0 : 8,
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 12. Scoreboard bar — thin strip, big digital-style score block on the right
function Row12({ row }) {
  return (
    <div className="flex items-center" style={{ border: `1px solid ${RANK_BORDER(row.rank)}`, borderRadius: 4, overflow: 'hidden' }}>
      <span className="text-sm font-black w-7 text-center py-2" style={{ background: RANK_BORDER(row.rank), color: '#0a1220' }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-semibold text-slate-200 px-2 text-center">{row.name}</span>
      <span className="text-xs font-black tabular-nums px-2 py-2" style={{ background: '#0a1220', color: '#34d399', fontFamily: 'monospace' }}>{row.score}</span>
    </div>
  );
}

// 13. Jersey-collar notch cut top-center
function Row13({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-3 pb-2 rounded-lg" style={{
      background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`,
      clipPath: 'polygon(0 0, 42% 0, 48% 8px, 52% 8px, 58% 0, 100% 0, 100% 100%, 0 100%)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 14. Full hexagon (honeycomb tile)
function Row14({ row }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3" style={{
      background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`,
      clipPath: 'polygon(4% 0, 96% 0, 100% 50%, 96% 100%, 4% 100%, 0 50%)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 15. Big circular rank/avatar overlapping a pill name/score bar
function Row15({ row }) {
  return (
    <div className="flex items-center">
      <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black z-10 flex-shrink-0"
        style={{ background: RANK_BORDER(row.rank), color: '#0a1220', boxShadow: '0 2px 8px rgba(0,0,0,.4)' }}>{row.rank}</span>
      <div className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-full -mr-4" style={{ background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}` }}>
        <RowContent row={row} />
      </div>
    </div>
  );
}

// 16. Ribbon — triangular cuts on both left and right edges
function Row16({ row }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2" style={{
      background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`,
      clipPath: 'polygon(0 50%, 10px 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 10px 100%)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 17. Dashed curved "stitched" pitch-style card
function Row17({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{ background: RANK_BG(row.rank), border: `2px dashed ${RANK_BORDER(row.rank)}` }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 18. Neon outline — transparent fill, glowing border only
function Row18({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
      background: 'transparent', border: `1.5px solid ${RANK_BORDER(row.rank)}`,
      boxShadow: `0 0 10px ${RANK_BORDER(row.rank)}66, inset 0 0 10px ${RANK_BORDER(row.rank)}22`,
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 19. Staircase-cut left edge (climbing steps)
function Row19({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2" style={{
      background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`,
      clipPath: 'polygon(0 100%, 0 66%, 8px 66%, 8px 33%, 16px 33%, 16px 0, 100% 0, 100% 100%)',
    }}>
      <span className="text-sm font-black w-5 text-center mr-1" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 20. Pennant / flag — pointed triangular tip on the right edge
function Row20({ row }) {
  return (
    <div className="flex items-center gap-2 pl-3 pr-6 py-2" style={{
      background: RANK_BG(row.rank), border: `1px solid ${RANK_BORDER(row.rank)}`,
      clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

const VARIANTS = [
  { label: "מלבן + פס צבע", sub: "מלבן ישר עם פס אקסנט צבעוני מימין", Row: Row1 },
  { label: "כמוסה מעוגלת", sub: "פינות מעוגלות לגמרי (פילס)", Row: Row2 },
  { label: "תג משושה", sub: "קצה שמאלי חתוך באלכסון כמו תג", Row: Row3 },
  { label: "חץ פונה קדימה", sub: "קצה ימני מחודד כמו חץ", Row: Row4 },
  { label: "כרטיס-כניסה מנוקב", sub: "חריר עגול מנוקב בקצה + מסגרת מקווקוות", Row: Row5 },
  { label: "מקבילית הפוכה", sub: "אלכסון הפוך מהעיצוב הנוכחי", Row: Row6 },
  { label: "תג דירוג צף", sub: "מספר הדירוג בעיגול צף מחוץ לכרטיס", Row: Row7 },
  { label: "קצה מקופל", sub: "פינה מקופלת כמו דף שנהפך", Row: Row8 },
  { label: "בועת דיבור", sub: "כרטיס עם זנב קטן פונה למספר הדירוג", Row: Row9 },
  { label: "טרפז פודיום", sub: "צר יותר ככל שהדירוג נמוך יותר", Row: Row10 },
  { label: "מגן / סמל", sub: "צורת מגן מחודדת מלמטה למקום 1-3", Row: Row11 },
  { label: "לוח תוצאות", sub: "פס דק עם בלוק ניקוד דיגיטלי", Row: Row12 },
  { label: "צווארון חולצה", sub: "חריץ V בראש הכרטיס כמו צווארון משחקן", Row: Row13 },
  { label: "משושה מלא", sub: "אריח כוורת דבש שלם", Row: Row14 },
  { label: "עיגול חופף", sub: "מספר גדול בעיגול חופף לפס שם/ניקוד", Row: Row15 },
  { label: "סרט מנצחים", sub: "חיתוכים משולשים בשני הקצוות", Row: Row16 },
  { label: "מגרש תפור", sub: "מסגרת מקווקוות מעוגלת בסגנון כדורגל", Row: Row17 },
  { label: "מתאר ניאון", sub: "רקע שקוף עם מסגרת זוהרת בלבד", Row: Row18 },
  { label: "מדרגות טיפוס", sub: "קצה שמאלי מדורג כמו טיפוס בדירוג", Row: Row19 },
  { label: "דגלון מחודד", sub: "קצה ימני מחודד כמו דגלון", Row: Row20 },
];

function Frame({ id, title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 flex flex-col gap-3">
      <div>
        <h3 className="text-white font-bold text-sm">{id}. {title}</h3>
        <p className="text-slate-500 text-xs">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2 py-2" style={{ maxWidth: 300, margin: '0 auto', width: '100%' }} dir="ltr">
        {children}
      </div>
    </div>
  );
}

export default function AdminLiveTableShapeGallery() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🔷 20 צורות לטבלת הלייב</h2>
        <p className="text-slate-400 text-sm">
          כרגע השורה בטבלה החיה היא מקבילית (skew). הגלריה הבאה מציגה 20 חלופות לצורת השורה, עם אותם נתונים לדוגמה בכל וריאנט — כדי להשוות ביניהן בקלות.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {VARIANTS.map(({ label, sub, Row }, idx) => (
          <Frame key={idx} id={idx + 1} title={label} subtitle={sub}>
            {MOCK_ROWS.map((row, i) => <Row key={i} row={row} />)}
          </Frame>
        ))}
      </div>
    </div>
  );
}
