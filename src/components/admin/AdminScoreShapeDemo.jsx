import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

// Demo-only: 20 alternative shapes/frames for the tile that holds a single
// team's predicted goal count (the "ellipse around the score picker" the
// admin asked about). The interaction (chevron +/- stepper) stays constant
// across variants — the visual difference is purely the container shape.
// Mock, self-contained local state per variant, fully interactive.
// Doesn't touch ScoreInput.jsx, Predictions.jsx or AdminScoreInputDemo.jsx.

const HOME = '#097adc';
const AWAY = '#8b5cf6';
const BG = '#050a12'; // matches Frame's preview background — used for cutout "notch" tricks

function clamp(v, min = 0, max = 9) { return Math.max(min, Math.min(max, v)); }

function useReplay() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}

function Frame({ label, desc, children }) {
  const [replay, bump] = useReplay();
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="rounded-xl overflow-hidden p-3 flex items-center justify-center" style={{ background: BG, minHeight: 170 }}>
        {children(replay)}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0"><div className="text-white text-xs font-bold">{label}</div><div className="text-slate-500 text-[10px]">{desc}</div></div>
        <button onClick={bump} className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full bg-white/6 border border-white/10 text-slate-300 hover:bg-white/12">
          <RefreshCw className="w-3 h-3" /> הצג שוב
        </button>
      </div>
    </div>
  );
}

// ---- shared primitives ----

// Animated flip digit, reused inside every shape
function Digit({ value, color = '#fff', size = 28 }) {
  return (
    <div style={{ perspective: 200 }}>
      <AnimatePresence mode="popLayout">
        <motion.span key={value} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: size, color, display: 'inline-block', lineHeight: 1, userSelect: 'none' }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Chevron up/down stepper wrapping any shape tile
function Stepper({ value, onChange, color, children }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => onChange(clamp(value + 1))} className="hover:opacity-70">
        <ChevronUp className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
      </button>
      {children}
      <button onClick={() => onChange(clamp(value - 1))} className="hover:opacity-70">
        <ChevronDown className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// Renders both team tiles side by side, sharing one Tile component + local state
function TwoTiles({ Tile, a, setA, b, setB, gap = 18 }) {
  return (
    <div className="flex items-center" style={{ gap }}>
      <Stepper value={a} onChange={setA} color={HOME}><Tile value={a} color={HOME} /></Stepper>
      <Stepper value={b} onChange={setB} color={AWAY}><Tile value={b} color={AWAY} /></Stepper>
    </div>
  );
}

// Generic helper for clip-path shapes: draws a thin "frame" by layering a
// colored outer clipped box behind a slightly inset, same-clipped fill box —
// a plain CSS border looks broken on diagonal clip-path edges, this doesn't.
function ClipTile({ value, color, clipPath, width, height, digitSize = 24, borderWidth = 2, fill = 'rgba(255,255,255,0.07)', extraInnerStyle }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width, height, clipPath, background: color }}>
      <div className="absolute flex items-center justify-center" style={{ inset: borderWidth, clipPath, background: fill, ...extraInnerStyle }} />
      <div className="relative"><Digit value={value} size={digitSize} /></div>
    </div>
  );
}

// ================= The 20 shapes =================

// 1. Baseline — the real ScoreInput.jsx split-flap glass tile
function BaselineTile({ value }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: 44, height: 74, borderRadius: 20,
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)' }} />
      <Digit value={value} size={32} />
      <div className="absolute left-0 right-0 top-1/2 h-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.55)', boxShadow: '0 1px 0 rgba(255,255,255,0.08)' }} />
      <div className="absolute inset-x-0 top-1/2 bottom-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.14) 0%, transparent 35%)' }} />
    </div>
  );
}

// 2. True ellipse/oval — wide flattened oval
function OvalTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 76, height: 46, borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>
      <Digit value={value} size={26} />
    </div>
  );
}

// 3. Perfect circle
function CircleTile({ value, color }) {
  return (
    <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={28} />
    </div>
  );
}

// 4. Capsule/pill — stadium shape
function PillTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 40, height: 68, borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={30} />
    </div>
  );
}

// 5. Hexagon
function HexagonTile({ value, color }) {
  return <ClipTile value={value} color={color} width={56} height={62} digitSize={26}
    clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" />;
}

// 6. Shield / club-crest silhouette
function ShieldTile({ value, color }) {
  return <ClipTile value={value} color={color} width={54} height={68} digitSize={24}
    clipPath="polygon(15% 0%, 85% 0%, 100% 10%, 100% 45%, 85% 75%, 50% 100%, 15% 75%, 0% 45%, 0% 10%)" />;
}

// 7. Diamond/rhombus — rotated square, digit stays upright
function DiamondTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <div className="absolute" style={{ inset: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88`, borderRadius: 8, transform: 'rotate(45deg)' }} />
      <div className="relative"><Digit value={value} size={26} /></div>
    </div>
  );
}

// 8. Chamfered / cut-corner octagon
function ChamferedTile({ value, color }) {
  return <ClipTile value={value} color={color} width={56} height={56} digitSize={26}
    clipPath="polygon(22% 0%, 78% 0%, 100% 22%, 100% 78%, 78% 100%, 22% 100%, 0% 78%, 0% 22%)" />;
}

// 9. Ribbon/banner — pointed notch tail at the bottom
function RibbonTile({ value, color }) {
  return <ClipTile value={value} color={color} width={54} height={66} digitSize={24}
    clipPath="polygon(0% 0%, 100% 0%, 100% 78%, 50% 62%, 0% 78%)" />;
}

// 10. Speech-bubble / callout — rounded tile with a small downward tail
function CalloutTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 54, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={26} />
      <div className="absolute" style={{
        bottom: -7, left: '50%', width: 12, height: 12, marginLeft: -6, background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${color}88`, borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)',
      }} />
    </div>
  );
}

// 11. Ticket-stub — semi-circle notches on left/right edges (movie-ticket look)
function TicketTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <div className="absolute rounded-full" style={{ width: 15, height: 15, left: -8, top: '50%', marginTop: -7.5, background: BG }} />
      <div className="absolute rounded-full" style={{ width: 15, height: 15, right: -8, top: '50%', marginTop: -7.5, background: BG }} />
      <div className="absolute" style={{ left: 15, top: 6, bottom: 6, borderLeft: `1px dashed ${color}66` }} />
      <div className="absolute" style={{ right: 15, top: 6, bottom: 6, borderLeft: `1px dashed ${color}66` }} />
      <Digit value={value} size={24} />
    </div>
  );
}

// 12. Jersey-number patch — rounded badge with a dashed "stitched" inner border
function PatchTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 12,
      background: `linear-gradient(160deg, ${color}30, rgba(255,255,255,0.04))`, border: `2px solid ${color}` }}>
      <div className="absolute rounded-lg pointer-events-none" style={{ inset: 5, border: `1px dashed ${color}aa` }} />
      <Digit value={value} size={24} />
    </div>
  );
}

// 13. LED-scoreboard bezel — thick dark housing, corner rivets, recessed panel
function BezelTile({ value, color }) {
  const rivet = (style) => <div className="absolute rounded-full" style={{ width: 4, height: 4, background: '#4a5568', ...style }} />;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 62, height: 70, borderRadius: 6, background: '#181d29', border: '2px solid #2c3444' }}>
      {rivet({ top: 5, left: 5 })}{rivet({ top: 5, right: 5 })}{rivet({ bottom: 5, left: 5 })}{rivet({ bottom: 5, right: 5 })}
      <div className="flex items-center justify-center" style={{ width: 40, height: 50, borderRadius: 3, background: '#000', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.85)' }}>
        <Digit value={value} size={28} color={color === HOME ? '#22ff66' : '#ffb020'} />
      </div>
    </div>
  );
}

// 14. Double-ring halo — circular tile plus a glowing separated outer ring
function HaloTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <div className="absolute rounded-full" style={{ inset: 0, border: `1px solid ${color}66`, filter: `drop-shadow(0 0 4px ${color}aa)` }} />
      <div className="rounded-full flex items-center justify-center" style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}` }}>
        <Digit value={value} size={26} />
      </div>
    </div>
  );
}

// 15. Vesica-piscis / lens — two overlapping circle arcs meeting in points
function LensTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" style={{ position: 'absolute', inset: 0 }}>
        <path d="M32,4 A34,34 0 0,1 32,60 A34,34 0 0,1 32,4 Z" fill="rgba(255,255,255,0.07)" stroke={color} strokeWidth="1.5" />
      </svg>
      <div className="relative"><Digit value={value} size={24} /></div>
    </div>
  );
}

// 16. Torn-paper edge — irregular jagged outline
const TORN_PATH = 'polygon(4% 10%, 18% 2%, 30% 11%, 45% 2%, 60% 9%, 76% 1%, 92% 8%, 100% 22%, 93% 36%, 100% 50%, 92% 64%, 100% 79%, 90% 93%, 74% 100%, 58% 92%, 44% 100%, 28% 91%, 12% 100%, 3% 87%, 9% 71%, 0% 55%, 7% 40%, 1% 25%)';
function TornTile({ value, color }) {
  return <ClipTile value={value} color={color} width={60} height={62} digitSize={24} borderWidth={1.5} clipPath={TORN_PATH} />;
}

// 17. Porthole / film-reel — circle with small tick marks around the rim
function PortholeTile({ value, color }) {
  const N = 10;
  return (
    <div className="relative flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * 2 * Math.PI;
        const x = 30 + Math.cos(ang) * 30, y = 30 + Math.sin(ang) * 30;
        return <div key={i} className="absolute rounded-full" style={{ width: 3, height: 3, left: x - 1.5, top: y - 1.5, background: `${color}cc` }} />;
      })}
      <Digit value={value} size={26} />
    </div>
  );
}

// 18. Pentagon / arrow-cut — pointed upward, road-sign-like
function PentagonTile({ value, color }) {
  return <ClipTile value={value} color={color} width={58} height={60} digitSize={24}
    clipPath="polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" />;
}

// 19. Soccer-ball honeycomb panel — hexagon with an embossed/beveled edge
function HoneycombTile({ value, color }) {
  return <ClipTile value={value} color={color} width={58} height={64} digitSize={26}
    clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
    extraInnerStyle={{ boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -4px 6px rgba(0,0,0,0.55)' }} />;
}

// 20. Neon-outline-only ellipse — no fill, glowing colored stroke
function NeonTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 72, height: 46, borderRadius: '50%', background: 'transparent',
      border: `2px solid ${color}`, boxShadow: `0 0 8px ${color}, 0 0 18px ${color}77, inset 0 0 10px ${color}44` }}>
      <Digit value={value} size={26} />
    </div>
  );
}

// ================= Variant wrappers (local state per variant) =================

function makeVariant(Tile, defaults = [2, 1]) {
  return function Variant() {
    const [a, setA] = useState(defaults[0]);
    const [b, setB] = useState(defaults[1]);
    return <TwoTiles Tile={Tile} a={a} setA={setA} b={b} setB={setB} />;
  };
}

const V1 = makeVariant(BaselineTile);
const V2 = makeVariant(OvalTile);
const V3 = makeVariant(CircleTile);
const V4 = makeVariant(PillTile);
const V5 = makeVariant(HexagonTile);
const V6 = makeVariant(ShieldTile);
const V7 = makeVariant(DiamondTile);
const V8 = makeVariant(ChamferedTile);
const V9 = makeVariant(RibbonTile);
const V10 = makeVariant(CalloutTile);
const V11 = makeVariant(TicketTile);
const V12 = makeVariant(PatchTile);
const V13 = makeVariant(BezelTile);
const V14 = makeVariant(HaloTile);
const V15 = makeVariant(LensTile);
const V16 = makeVariant(TornTile);
const V17 = makeVariant(PortholeTile);
const V18 = makeVariant(PentagonTile);
const V19 = makeVariant(HoneycombTile);
const V20 = makeVariant(NeonTile);

const VARIANTS = [
  ['1. הנוכחי (בסיס להשוואה)', 'מלבן מעוגל עם תפר אמצעי — הצורה הקיימת ב-ScoreInput', V1],
  ['2. אליפסה אמיתית', 'מסגרת אליפסה שטוחה ורחבה', V2],
  ['3. עיגול מושלם', 'טבעת עגולה סימטרית', V3],
  ['4. קפסולה/גלולה', 'צורת אצטדיון — קצוות מעוגלים לגמרי', V4],
  ['5. משושה', 'מסגרת הקסגון חדה', V5],
  ['6. מגן/סמל מועדון', 'עליון מעוגל, תחתון מחודד — כמו סמל כדורגל', V6],
  ['7. יהלום', 'ריבוע מסובב 45°, הספרה נשארת זקופה', V7],
  ['8. אוקטגון עם פינות קטומות', 'ריבוע מעוגל עם פינות חתוכות ב-45°', V8],
  ['9. סרט/באנר', 'מלבן עם זנב משולש חתוך בתחתית', V9],
  ['10. בועת דיבור', 'מלבן מעוגל עם זנב משולש כלפי מטה', V10],
  ['11. כרטיס קולנוע', 'מלבן עם חריצים חצי-עגולים בצדדים', V11],
  ['12. טלאי מספר חולצה', 'תג מרובע עם מסגרת מקווקוות כמו רקמה', V12],
  ['13. מסך תוצאות LED', 'מסגרת עבה כמו לוח תוצאות אמיתי, עם ברגים בפינות', V13],
  ['14. הילה כפולה', 'טבעת זוהרת נוספת סביב העיגול, במרחק', V14],
  ['15. עדשה (Vesica Piscis)', 'שתי קשתות חופפות יוצרות צורת עדשה מחודדת', V15],
  ['16. קצה נייר קרוע', 'מתאר משונן ולא סדיר, אווירת פלייר משחק', V16],
  ['17. אשנב/סרט קולנוע', 'עיגול עם חריצים קטנים סביב ההיקף', V17],
  ['18. מצולע חץ', 'פנטגון מחודד כלפי מעלה, כמו תמרור', V18],
  ['19. פאנל כדורגל', 'משושה עם מראה תלת-ממדי מוטבע (בוהק+צל פנימי)', V19],
  ['20. קו ניאון בלבד', 'ללא רקע — רק מתאר אליפסה זוהר', V20],
];

export default function AdminScoreShapeDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 20 צורות מסגרת לתא התוצאה</h2>
        <p className="text-slate-500 text-sm">כולן חיות ולחיצות (+/- לכל קבוצה). הצורה היא ההבדל היחיד בין הווריאנטים — האינטראקציה זהה. כלי דמו בלבד — לא משפיע על ScoreInput.jsx.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VARIANTS.map(([label, desc, Comp]) => (
          <Frame key={label} label={label} desc={desc}>{() => <Comp />}</Frame>
        ))}
      </div>
    </div>
  );
}
