import React from "react";

// Round 2 — same mock rows as gallery 1, but this batch explores material/
// texture/theme treatments (glass, metal, neon, retro, etc.) rather than pure
// outline silhouettes.
const MOCK_ROWS = [
  { rank: 1, name: "דימה",  score: 128.5, delta: 2 },
  { rank: 2, name: "יוסי",  score: 121.0, delta: -1 },
  { rank: 3, name: "מוטי",  score: 115.5, delta: 0 },
  { rank: 4, name: "שי",    score: 98.0,  delta: 1 },
];

const RANK_COLOR  = r => r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#64748b';
const RANK_BORDER = r => r === 1 ? '#FFD700' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569';
const MEDAL       = r => r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : null;

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

// ── 30 material/theme variants ──────────────────────────────────────────────

// 1. Neumorphic soft-UI
function Row1({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-2xl" style={{
      background: '#1b2536',
      boxShadow: '6px 6px 12px rgba(0,0,0,.45), -6px -6px 12px rgba(255,255,255,.03)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 2. Glassmorphism
function Row2({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 3. Holographic foil shimmer border
function Row3({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
      background: '#111a2b',
      border: '1.5px solid transparent',
      backgroundImage: 'linear-gradient(#111a2b,#111a2b), linear-gradient(120deg,#f0f,#0ff,#ff0,#f0f)',
      backgroundOrigin: 'padding-box, border-box', backgroundClip: 'padding-box, border-box',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 4. Gold-foil rank-1 with confetti dots, plain for others
function Row4({ row }) {
  const gold = row.rank === 1;
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded-xl overflow-hidden" style={{
      background: gold ? 'linear-gradient(135deg,#facc15,#fef3c7,#facc15)' : 'rgba(30,41,59,.6)',
      border: `1px solid ${RANK_BORDER(row.rank)}`,
    }}>
      {gold && <span className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle,#fff8 1px,transparent 1px)', backgroundSize: '10px 10px' }} />}
      <span className="text-sm font-black w-5 text-center relative" style={{ color: gold ? '#78350f' : RANK_COLOR(row.rank) }}>{row.rank}</span>
      <span className={`flex-1 min-w-0 truncate text-[11px] font-semibold text-center relative ${gold ? 'text-amber-900' : 'text-slate-200'}`}>{row.name}</span>
      <span className={`text-[11px] font-bold tabular-nums relative ${gold ? 'text-amber-900' : 'text-emerald-400'}`}>{row.score}</span>
      <DeltaTag delta={row.delta} />
    </div>
  );
}

// 5. LED scoreboard digital
function Row5({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: '#000', border: '1px solid #14532d', fontFamily: 'monospace' }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: '#4ade80', textShadow: '0 0 6px #4ade80' }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-bold text-center" style={{ color: '#4ade80', textShadow: '0 0 6px #4ade80' }}>{row.name}</span>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: '#4ade80', textShadow: '0 0 6px #4ade80' }}>{row.score}</span>
    </div>
  );
}

// 6. Esports HUD (angular brackets, cyan glow)
function Row6({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2" style={{
      background: 'rgba(8,20,30,.8)', borderTop: '2px solid #22d3ee', borderBottom: '2px solid #22d3ee',
      clipPath: 'polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 10px)',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: '#22d3ee' }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 7. Vinyl-record disc rank badge
function Row7({ row }) {
  return (
    <div className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-full" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0" style={{
        background: 'repeating-radial-gradient(circle,#111 0,#111 2px,#333 3px,#111 4px)',
        border: `2px solid ${RANK_BORDER(row.rank)}`, color: RANK_COLOR(row.rank),
      }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 8. Wooden plaque (engraved look)
function Row8({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{
      background: 'linear-gradient(135deg,#7c4a24,#5c3317)', border: '2px solid #3d2210',
      boxShadow: 'inset 0 1px 3px rgba(0,0,0,.5)',
    }}>
      <span className="text-sm font-black w-5 text-center text-amber-100" style={{ textShadow: '0 1px 0 rgba(0,0,0,.6)' }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-semibold text-amber-100 text-center" style={{ textShadow: '0 1px 0 rgba(0,0,0,.6)' }}>{row.name}</span>
      <span className="text-[11px] font-bold text-amber-200 tabular-nums">{row.score}</span>
    </div>
  );
}

// 9. Chalkboard
function Row9({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#1c3327', border: '3px solid #4a3728' }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: '#fefce8', fontFamily: 'cursive' }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] text-center" style={{ color: '#fefce8', fontFamily: 'cursive' }}>{row.name}</span>
      <span className="text-[11px] tabular-nums" style={{ color: '#fefce8', fontFamily: 'cursive' }}>{row.score}</span>
    </div>
  );
}

// 10. Vintage medal ribbon banner
function Row10({ row }) {
  return (
    <div className="relative flex items-center gap-2 pl-8 pr-3 py-2 rounded" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-center text-xs font-black"
        style={{ background: RANK_BORDER(row.rank), color: '#0a1220', clipPath: 'polygon(0 0,100% 0,100% 70%,50% 100%,0 70%)' }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 11. Credit-card / ID badge with magnetic stripe
function Row11({ row }) {
  return (
    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="w-2 self-stretch flex-shrink-0" style={{ background: RANK_BORDER(row.rank) }} />
      <div className="flex items-center gap-2 px-3 py-2 flex-1" style={{ background: 'rgba(30,41,59,.6)' }}>
        <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
        <RowContent row={row} />
      </div>
    </div>
  );
}

// 12. Postage-stamp perforated
function Row12({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2" style={{
      background: 'rgba(30,41,59,.6)',
      border: `2px dotted ${RANK_BORDER(row.rank)}`, borderRadius: 3,
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 13. Browser-tab
function Row13({ row }) {
  return (
    <div className="relative" style={{ marginTop: 6 }}>
      <div className="absolute -top-2 right-2 w-8 h-2 rounded-t" style={{ background: RANK_BORDER(row.rank) }} />
      <div className="flex items-center gap-2 px-3 py-2 rounded-b-lg rounded-tl-lg" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
        <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
        <RowContent row={row} />
      </div>
    </div>
  );
}

// 14. Notification-toast (floating, icon on left)
function Row14({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#0f172a', boxShadow: '0 8px 20px rgba(0,0,0,.5)', border: '1px solid rgba(255,255,255,.06)' }}>
      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0" style={{ background: RANK_BORDER(row.rank), color: '#0a1220' }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 15. Subway-sign roundel
function Row15({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-sm" style={{ background: '#00274d', border: '2px solid #fff' }}>
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0" style={{ background: '#c8102e', color: '#fff' }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-bold text-white text-center">{row.name}</span>
      <span className="text-[11px] font-bold text-white tabular-nums">{row.score}</span>
    </div>
  );
}

// 16. License-plate embossed
function Row16({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded" style={{ background: '#e5e7eb', border: '3px solid #1e293b', fontFamily: 'monospace' }}>
      <span className="text-sm font-black w-5 text-center text-slate-900">{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-bold text-slate-900 text-center">{row.name}</span>
      <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.score}</span>
    </div>
  );
}

// 17. Barcode texture background
function Row17({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded overflow-hidden" style={{ background: '#0a1220', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 3px)' }} />
      <span className="text-sm font-black w-5 text-center relative" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-semibold text-slate-200 text-center relative">{row.name}</span>
      <span className="text-[11px] font-bold text-emerald-400 tabular-nums relative">{row.score}</span>
    </div>
  );
}

// 18. Neon-sign glowing text
function Row18({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#0a0a12', border: '1px solid #ec4899' }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: '#ec4899', textShadow: '0 0 8px #ec4899, 0 0 16px #ec4899' }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-bold text-center" style={{ color: '#f0abfc', textShadow: '0 0 6px #ec4899' }}>{row.name}</span>
      <span className="text-[11px] font-bold tabular-nums" style={{ color: '#f0abfc', textShadow: '0 0 6px #ec4899' }}>{row.score}</span>
    </div>
  );
}

// 19. Film-strip sprocket holes
function Row19({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-4 py-2" style={{ background: '#1c1c1c', border: '1px solid #444' }}>
      <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-around py-1">{[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-sm bg-black" />)}</div>
      <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-around py-1">{[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-sm bg-black" />)}</div>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 20. Stock-ticker thin bar
function Row20({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded" style={{ background: '#111', borderRight: `3px solid ${row.delta >= 0 ? '#22c55e' : '#ef4444'}` }}>
      <span className="text-xs font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-mono text-slate-200 text-center">{row.name}</span>
      <span className="text-[11px] font-mono font-bold tabular-nums" style={{ color: row.delta >= 0 ? '#22c55e' : '#ef4444' }}>{row.score}</span>
    </div>
  );
}

// 21. Horizontal bar-chart fill (width ~ score)
function Row21({ row }) {
  const pct = Math.min(100, (row.score / 130) * 100);
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded overflow-hidden" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute inset-y-0 right-0" style={{ width: `${pct}%`, background: RANK_BG_SOLID(row.rank), opacity: .25 }} />
      <span className="text-sm font-black w-5 text-center relative" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-semibold text-slate-200 text-center relative">{row.name}</span>
      <span className="text-[11px] font-bold text-emerald-400 tabular-nums relative">{row.score}</span>
    </div>
  );
}
function RANK_BG_SOLID(r) { return r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : '#64748b'; }

// 22. Trophy-case ornamented frame
function Row22({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-4 py-2.5 m-0.5" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute -top-1 -right-1 w-2 h-2" style={{ borderTop: `2px solid ${RANK_BORDER(row.rank)}`, borderRight: `2px solid ${RANK_BORDER(row.rank)}` }} />
      <span className="absolute -top-1 -left-1 w-2 h-2" style={{ borderTop: `2px solid ${RANK_BORDER(row.rank)}`, borderLeft: `2px solid ${RANK_BORDER(row.rank)}` }} />
      <span className="absolute -bottom-1 -right-1 w-2 h-2" style={{ borderBottom: `2px solid ${RANK_BORDER(row.rank)}`, borderRight: `2px solid ${RANK_BORDER(row.rank)}` }} />
      <span className="absolute -bottom-1 -left-1 w-2 h-2" style={{ borderBottom: `2px solid ${RANK_BORDER(row.rank)}`, borderLeft: `2px solid ${RANK_BORDER(row.rank)}` }} />
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 23. Emoji medal for top 3, plain rank number for the rest
function Row23({ row }) {
  const medal = MEDAL(row.rank);
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(30,41,59,.6)', border: '1px solid #334155' }}>
      <span className="w-6 text-center text-base flex-shrink-0">{medal || <span className="text-sm font-black text-slate-400">{row.rank}</span>}</span>
      <RowContent row={row} />
    </div>
  );
}

// 24. Big faded watermark number
function Row24({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-3 py-3 rounded-lg overflow-hidden" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute -left-1 -bottom-3 text-5xl font-black opacity-10 select-none pointer-events-none" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-semibold text-slate-200 text-center relative">{row.name}</span>
      <span className="text-[11px] font-bold text-emerald-400 tabular-nums relative">{row.score}</span>
      <DeltaTag delta={row.delta} />
    </div>
  );
}

// 25. Split dual-tone (colored left half / neutral right half)
function Row25({ row }) {
  return (
    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="flex items-center justify-center w-9 py-2.5 text-sm font-black flex-shrink-0" style={{ background: RANK_BORDER(row.rank), color: '#0a1220' }}>{row.rank}</span>
      <div className="flex items-center gap-2 px-3 py-2 flex-1" style={{ background: 'rgba(30,41,59,.6)' }}>
        <RowContent row={row} />
      </div>
    </div>
  );
}

// 26. Diagonal color-block split
function Row26({ row }) {
  return (
    <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg overflow-hidden" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute inset-0" style={{ background: RANK_BORDER(row.rank), opacity: .15, clipPath: 'polygon(0 0, 35% 0, 20% 100%, 0 100%)' }} />
      <span className="text-sm font-black w-5 text-center relative" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 27. Retro pixel-art stepped border
function Row27({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2" style={{
      background: '#1a1a2e', border: `2px solid ${RANK_BORDER(row.rank)}`, imageRendering: 'pixelated',
      boxShadow: `4px 4px 0 0 ${RANK_BORDER(row.rank)}`, fontFamily: 'monospace',
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 28. Wristband — long thin rounded strip
function Row28({ row }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: RANK_BORDER(row.rank), opacity: .9 }}>
      <span className="text-xs font-black w-5 text-center text-slate-900">{row.rank}</span>
      <span className="flex-1 min-w-0 truncate text-[11px] font-bold text-slate-900 text-center">{row.name}</span>
      <span className="text-[11px] font-bold text-slate-900 tabular-nums">{row.score}</span>
    </div>
  );
}

// 29. Keycap — bevelled mechanical-key look
function Row29({ row }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{
      background: '#334155',
      boxShadow: `0 3px 0 0 #1e293b, inset 0 1px 0 0 rgba(255,255,255,.15)`,
      border: `1px solid ${RANK_BORDER(row.rank)}`,
    }}>
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

// 30. Luggage-tag with punched hole
function Row30({ row }) {
  return (
    <div className="relative flex items-center gap-2 pl-5 pr-3 py-2 rounded-md" style={{ background: 'rgba(30,41,59,.6)', border: `1px solid ${RANK_BORDER(row.rank)}` }}>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ border: `1px solid ${RANK_BORDER(row.rank)}` }} />
      <span className="text-sm font-black w-5 text-center" style={{ color: RANK_COLOR(row.rank) }}>{row.rank}</span>
      <RowContent row={row} />
    </div>
  );
}

const VARIANTS = [
  { label: "נאומורפי רך", sub: "צללים כפולים רכים על רקע אחיד", Row: Row1 },
  { label: "זכוכית מטושטשת", sub: "Glassmorphism - שקוף עם blur", Row: Row2 },
  { label: "פוליה הולוגרפית", sub: "מסגרת בגוונים חולפים כמו מדבקת הולוגרמה", Row: Row3 },
  { label: "זהב + קונפטי", sub: "מקום ראשון בעטיפת זהב עם נקודות קונפטי", Row: Row4 },
  { label: "לוח תוצאות LED", sub: "טקסט ירוק זוהר על שחור, כמו לוח דיגיטלי", Row: Row5 },
  { label: "HUD אסקורט", sub: "פינות זוויתיות עם זוהר טורקיז", Row: Row6 },
  { label: "תקליט ויניל", sub: "תג דירוג עגול בדוגמת תקליט מסתובב", Row: Row7 },
  { label: "שלט עץ חרוט", sub: "מרקם עץ עם טקסט חרוט", Row: Row8 },
  { label: "לוח גיר", sub: "רקע ירוק כהה עם פונט יד וגבול עץ", Row: Row9 },
  { label: "סרט מדליה וינטג'", sub: "תג דירוג בצורת סרט מדליה", Row: Row10 },
  { label: "כרטיס אשראי", sub: "פס מגנטי צבעוני בצד", Row: Row11 },
  { label: "בול דואר מנוקד", sub: "מסגרת מנוקדת כמו בול מחורר", Row: Row12 },
  { label: "טאב דפדפן", sub: "צורת לשונית דפדפן מעל השורה", Row: Row13 },
  { label: "התראה צפה", sub: "כרטיס צף עם צל עמוק כמו התראה", Row: Row14 },
  { label: "שלט רכבת תחתית", sub: "רונדל צבעוני בסגנון תחבורה ציבורית", Row: Row15 },
  { label: "לוחית רישוי", sub: "מסגרת מוטבעת ופונט מונוספייס", Row: Row16 },
  { label: "ברקוד", sub: "רקע עם פסי ברקוד עדינים", Row: Row17 },
  { label: "שלט ניאון", sub: "טקסט זוהר בסגנון שלט ניאון ורוד", Row: Row18 },
  { label: "פס סרט צילום", sub: "חורי הינע משני הצדדים כמו סרט פילם", Row: Row19 },
  { label: "טיקר מניות", sub: "פס דק עם צבע דלתא ירוק/אדום", Row: Row20 },
  { label: "בר גרף אופקי", sub: "מילוי רקע יחסי לניקוד", Row: Row21 },
  { label: "מסגרת ויטרינת גביעים", sub: "פינות מעוטרות כמו מסגרת תצוגה", Row: Row22 },
  { label: "מדליית אימוג'י", sub: "🥇🥈🥉 למקומות הראשונים, מספר רגיל לשאר", Row: Row23 },
  { label: "מספר ענק דהוי", sub: "דירוג ענק כרקע שקוף חלקית", Row: Row24 },
  { label: "פיצול דו-גוני", sub: "חצי צבעוני קבוע + חצי ניטרלי", Row: Row25 },
  { label: "פיצול אלכסוני", sub: "בלוק צבע אלכסוני ברקע", Row: Row26 },
  { label: "פיקסל-ארט רטרו", sub: "מסגרת מדורגת וצל בלוקי", Row: Row27 },
  { label: "צמיד אירוע", sub: "רצועה ארוכה ומעוגלת כמו צמיד כניסה", Row: Row28 },
  { label: "מקש מכני", sub: "מראה תלת-ממדי של מקש מקלדת", Row: Row29 },
  { label: "תגית מזוודה", sub: "חור מנוקב לחוט בצד השורה", Row: Row30 },
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

export default function AdminLiveTableShapeGallery2() {
  return (
    <div dir="rtl" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">🔷🔥 30 עוד יותר - חומרים וסגנונות לטבלת הלייב</h2>
        <p className="text-slate-400 text-sm">
          המשך לגלריה הקודמת (20 צורות) - הפעם דגש על חומר/מרקם/נושא (זכוכית, מתכת, ניאון, עץ, רטרו) ולא רק על קו המתאר.
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
