import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   25 concepts for the "today's matches" FAB button — the small stadium-icon
   circle with a count badge shown on the Dashboard. Covers badge position/
   style, badge animation, alternative icons, and a few combined/novel
   directions. Each preview loops so entrance/attention animations are
   actually visible, not just a static frame.
   ────────────────────────────────────────────────────────────────────────── */

const COUNT = 3;
const GREEN_BG = 'linear-gradient(145deg, #1a3a2a 0%, #0d2018 100%)';
const GOLD_BORDER = 'rgba(245,197,24,0.5)';

const CAT_COLORS = {
  badge: '#f5c518', anim: '#4ade80', icon: '#60a5fa', novel: '#e879f9',
};
const CAT_LABELS = { badge: 'תג ומיקום', anim: 'אנימציית תג', icon: 'אייקון חלופי', novel: 'קונספט ייחודי' };

/* ── shared FAB shell ─────────────────────────────────────────────────── */
function Fab({ children, size = 52 }) {
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{
        width: size, height: size, borderRadius: '50%',
        background: GREEN_BG, border: `1.5px solid ${GOLD_BORDER}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      {children}
    </div>
  );
}

const NumBadge = ({ n = COUNT, style }) => (
  <span
    className="absolute flex items-center justify-center font-bold"
    style={{ minWidth: 16, height: 16, padding: '0 2px', borderRadius: 999, background: '#fbbf24', color: '#000', fontSize: 9, boxShadow: '0 2px 6px rgba(0,0,0,0.4)', ...style }}
  >
    {n}
  </span>
);

/* ── loop wrapper ─────────────────────────────────────────────────────── */
function LoopStage({ interval = 3200, children }) {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setCycle((c) => c + 1), interval);
    return () => clearInterval(iv);
  }, [interval]);
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.div key={cycle}>{children}</motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── 25 previews ──────────────────────────────────────────────────────── */

const P1 = () => ( // baseline refined — top-right circle
  <Fab><span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
);

const P2 = () => ( // bottom-left badge
  <Fab><span className="text-xl">🏟️</span><NumBadge style={{ bottom: -4, left: -4 }} /></Fab>
);

const P3 = () => ( // text pill under the icon
  <div className="flex flex-col items-center gap-1">
    <Fab><span className="text-xl">🏟️</span></Fab>
    <span style={{ background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.4)', color: '#fbbf24', fontSize: 8, fontWeight: 800, borderRadius: 999, padding: '2px 8px' }}>{COUNT} משחקים</span>
  </div>
);

const P4 = () => ( // ribbon diagonal badge
  <Fab>
    <span className="text-xl">🏟️</span>
    <div style={{ position: 'absolute', top: 6, right: -10, width: 34, background: '#fbbf24', color: '#000', fontSize: 8, fontWeight: 900, textAlign: 'center', transform: 'rotate(45deg)', boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>{COUNT}</div>
  </Fab>
);

const P5 = () => ( // dot only, no number
  <Fab><span className="text-xl">🏟️</span><span style={{ position: 'absolute', top: 2, right: 2, width: 9, height: 9, borderRadius: '50%', background: '#fbbf24', border: '1.5px solid #0d2018' }} /></Fab>
);

const P6 = () => ( // overlapping half-in-half-out badge
  <Fab><span className="text-xl">🏟️</span><NumBadge style={{ top: -8, right: -8 }} /></Fab>
);

const P7 = () => ( // squircle badge
  <Fab><span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4, borderRadius: 6, width: 16 }} /></Fab>
);

const P8 = () => { // continuous pulse loop
  return (
    <Fab>
      <span className="text-xl">🏟️</span>
      <motion.span
        className="absolute flex items-center justify-center font-bold"
        style={{ top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 999, background: '#fbbf24', color: '#000', fontSize: 9 }}
        animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >{COUNT}</motion.span>
    </Fab>
  );
};

const P9 = () => ( // bounce-in on change
  <Fab>
    <span className="text-xl">🏟️</span>
    <motion.span
      className="absolute flex items-center justify-center font-bold"
      style={{ top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 999, background: '#fbbf24', color: '#000', fontSize: 9 }}
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >{COUNT}</motion.span>
  </Fab>
);

const P10 = () => { // count-up
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const iv = setInterval(() => setN((v) => (v < COUNT ? v + 1 : v)), 260);
    return () => clearInterval(iv);
  }, []);
  return <Fab><span className="text-xl">🏟️</span><NumBadge n={n} style={{ top: -4, right: -4 }} /></Fab>;
};

const P11 = () => ( // shake for attention
  <motion.div animate={{ x: [0, -3, 3, -2, 2, 0] }} transition={{ duration: 0.5, delay: 0.3 }}>
    <Fab><span className="text-xl">🏟️</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
  </motion.div>
);

const P12 = () => ( // glow pulse ring around badge
  <Fab>
    <span className="text-xl">🏟️</span>
    <span style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 999 }}>
      <motion.span className="absolute inset-0 rounded-full" style={{ background: '#fbbf24' }} animate={{ scale: [1, 2.2], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
      <span className="absolute inset-0 rounded-full flex items-center justify-center font-bold" style={{ background: '#fbbf24', color: '#000', fontSize: 9 }}>{COUNT}</span>
    </span>
  </Fab>
);

const P13 = () => ( // 3D flip-in badge
  <Fab>
    <span className="text-xl">🏟️</span>
    <motion.span
      className="absolute flex items-center justify-center font-bold"
      style={{ top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 999, background: '#fbbf24', color: '#000', fontSize: 9 }}
      initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.5 }}
    >{COUNT}</motion.span>
  </Fab>
);

const P14 = () => ( // soccer ball spinning icon
  <Fab>
    <motion.span className="text-xl" animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>⚽</motion.span>
    <NumBadge style={{ top: -4, right: -4 }} />
  </Fab>
);

const P15 = () => ( // calendar with dot
  <Fab><span className="text-xl">📅</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
);

const P16 = () => ( // whistle icon
  <Fab><span className="text-xl">🎽</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
);

const P17 = () => ( // ticket icon
  <Fab><span className="text-xl">🎫</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
);

const P18 = () => ( // trophy icon
  <Fab><span className="text-xl">🏆</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
);

const P19 = () => ( // custom SVG pitch icon instead of emoji
  <Fab>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="#4ade80" strokeWidth="1.5" />
      <line x1="12" y1="5" x2="12" y2="19" stroke="#4ade80" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="#4ade80" strokeWidth="1.5" />
    </svg>
    <NumBadge style={{ top: -4, right: -4 }} />
  </Fab>
);

const P20 = () => ( // broadcast/TV icon
  <Fab><span className="text-xl">📺</span><NumBadge style={{ top: -4, right: -4 }} /></Fab>
);

const P21 = () => { // progress ring: matches finished vs remaining
  const finished = 1, total = COUNT;
  const pct = (finished / total) * 360;
  return (
    <div style={{ position: 'relative', width: 58, height: 58, borderRadius: '50%', background: `conic-gradient(#4ade80 ${pct}deg, rgba(255,255,255,0.15) ${pct}deg 360deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Fab size={48}><span className="text-lg">🏟️</span></Fab>
      <NumBadge style={{ top: -2, right: -2 }} />
    </div>
  );
};

const P22 = () => ( // mini flags instead of a number
  <div className="relative">
    <Fab><span className="text-xl">🏟️</span></Fab>
    <div className="absolute flex" style={{ top: -6, right: -10 }}>
      <span style={{ fontSize: 11, marginLeft: -6 }}>🇧🇷</span>
      <span style={{ fontSize: 11, marginLeft: -6 }}>🇦🇷</span>
      <span style={{ fontSize: 11 }}>🇺🇸</span>
    </div>
  </div>
);

const P23 = () => { // expands to a pill with text on "hover" (simulated via loop)
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <motion.div
      className="flex items-center overflow-hidden"
      animate={{ width: open ? 128 : 52, borderRadius: open ? 26 : 999 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ height: 52, background: GREEN_BG, border: `1.5px solid ${GOLD_BORDER}` }}
    >
      <span className="text-xl flex-shrink-0" style={{ marginInline: 14 }}>🏟️</span>
      {open && <span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap' }}>{COUNT} משחקים היום</span>}
    </motion.div>
  );
};

const P24 = () => ( // red pulse only if a live match is among them
  <Fab>
    <span className="text-xl">🏟️</span>
    <NumBadge style={{ top: -4, right: -4 }} />
    <span className="absolute" style={{ bottom: -2, left: -2, width: 10, height: 10 }}>
      <motion.span className="absolute inset-0 rounded-full bg-red-500" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />
    </span>
  </Fab>
);

const P25 = () => ( // tear-off calendar page: day number + match count subcaption
  <div className="flex flex-col items-center" style={{ width: 44, borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 14px rgba(0,0,0,0.4)' }}>
    <div style={{ background: '#ef4444', color: '#fff', fontSize: 8, fontWeight: 900, textAlign: 'center', padding: '2px 0', width: '100%' }}>יולי</div>
    <div style={{ background: '#fff', color: '#111', fontWeight: 900, fontSize: 20, textAlign: 'center', width: '100%', lineHeight: 1.3 }}>4</div>
    <div style={{ background: '#f1f1f1', color: '#111', fontSize: 8, fontWeight: 700, textAlign: 'center', padding: '2px 0', width: '100%' }}>{COUNT} משחקים</div>
  </div>
);

/* ── data ─────────────────────────────────────────────────────────────── */
const DESIGNS = [
  { id: 1, cat: 'badge', name: 'עיגול פינה עליונה (הקיים)', sub: 'Top-Right Circle (current)', desc: 'הבסיס הנוכחי, מחודד — נקודת ייחוס להשוואה.', Preview: P1 },
  { id: 2, cat: 'badge', name: 'תג פינה תחתונה', sub: 'Bottom-Left Badge', desc: 'פחות מתחרה עם תפריט ההמבורגר שמעל.', Preview: P2 },
  { id: 3, cat: 'badge', name: 'פיל טקסט מתחת', sub: 'Text Pill Below', desc: 'כתובת מלאה "3 משחקים" במקום מספר בלבד — ברור יותר בלי לגעת באייקון.', Preview: P3 },
  { id: 4, cat: 'badge', name: 'רצועה אלכסונית', sub: 'Diagonal Ribbon', desc: 'תג שחוצה את הפינה באלכסון, כמו מדבקת "חדש" בחנות.', Preview: P4 },
  { id: 5, cat: 'badge', name: 'נקודה בלבד', sub: 'Dot Only, No Number', desc: 'מינימלי מאוד — רק מציין שיש משהו, בלי לפרט כמות.', Preview: P5 },
  { id: 6, cat: 'badge', name: 'תג חופף לקצה', sub: 'Overlapping Badge', desc: 'התג יושב חצי בפנים חצי בחוץ — יותר בולט.', Preview: P6 },
  { id: 7, cat: 'badge', name: 'תג מרובע מעוגל', sub: 'Squircle Badge', desc: 'ריבוע עם פינות רכות במקום עיגול — עדין יותר.', Preview: P7 },
  { id: 8, cat: 'anim', name: 'פעימה מתמשכת', sub: 'Continuous Pulse', desc: 'התג גדל וקטן ברציפות כדי למשוך תשומת לב.', Preview: P8 },
  { id: 9, cat: 'anim', name: 'קפיצה בשינוי', sub: 'Bounce on Change', desc: 'התג "קופץ" פנימה כשהמספר מתעדכן.', Preview: P9 },
  { id: 10, cat: 'anim', name: 'ספירה עולה', sub: 'Count-Up Reveal', desc: 'המספר עולה בהדרגה מ-0 עד הכמות האמיתית באנימציה.', Preview: P10 },
  { id: 11, cat: 'anim', name: 'רעידה קלה', sub: 'Attention Shake', desc: 'רעידה קצרה בכניסה כדי לתפוס עין, פעם אחת בלבד.', Preview: P11 },
  { id: 12, cat: 'anim', name: 'זוהר דופק', sub: 'Glow Pulse Ring', desc: 'טבעת אור מתרחבת ונעלמת סביב התג, כמו התראה חיה.', Preview: P12 },
  { id: 13, cat: 'anim', name: 'היפוך תלת-מימד', sub: '3D Flip-In Badge', desc: 'התג מתהפך פנימה על ציר X בכל עדכון.', Preview: P13 },
  { id: 14, cat: 'icon', name: 'כדורגל מסתובב', sub: 'Spinning Soccer Ball', desc: 'האייקון עצמו מסתובב לאט ברקע — תזכורת עדינה שזה ספורט חי.', Preview: P14 },
  { id: 15, cat: 'icon', name: 'יומן', sub: 'Calendar Icon', desc: 'מדגיש את הזמן/תאריך במקום את המקום (אצטדיון).', Preview: P15 },
  { id: 16, cat: 'icon', name: 'חולצת שחקן', sub: 'Jersey Icon', desc: 'מרגיש יותר "קבוצתי" מאשר מבנה.', Preview: P16 },
  { id: 17, cat: 'icon', name: 'כרטיס כניסה', sub: 'Ticket Icon', desc: 'תמת "יש לך כרטיס למשחקים האלה".', Preview: P17 },
  { id: 18, cat: 'icon', name: 'גביע', sub: 'Trophy Icon', desc: 'עקבי עם שאר המיתוג הזהוב של האפליקציה.', Preview: P18 },
  { id: 19, cat: 'icon', name: 'מגרש SVG מצויר', sub: 'Custom Pitch SVG', desc: 'קווי מגרש מצוירים במקום אימוג\'י — נראה יותר "מלוטש" ומותאם.', Preview: P19 },
  { id: 20, cat: 'icon', name: 'מסך שידור', sub: 'Broadcast TV Icon', desc: 'תמת "יש מה לצפות בו היום".', Preview: P20 },
  { id: 21, cat: 'novel', name: 'טבעת התקדמות היום', sub: 'Day-Progress Ring', desc: 'טבעת ירוקה מסביב מראה כמה מתוך משחקי היום כבר הסתיימו.', Preview: P21 },
  { id: 22, cat: 'novel', name: 'דגלי הקבוצות', sub: 'Mini Team Flags', desc: 'במקום מספר — 3 דגלים זעירים חופפים של הקבוצות שמשחקות היום.', Preview: P22 },
  { id: 23, cat: 'novel', name: 'התרחבות לפיל עם טקסט', sub: 'Expanding Text Pill', desc: 'הכפתור מתרחב לרגע ומראה "3 משחקים היום" במלואו ואז חוזר לקומפקטי.', Preview: P23 },
  { id: 24, cat: 'novel', name: 'נקודה אדומה אם יש לייב', sub: 'Live-Aware Red Pulse', desc: 'נקודה אדומה פועמת מופיעה רק אם אחד מ-3 המשחקים חי ממש עכשיו.', Preview: P24 },
  { id: 25, cat: 'novel', name: 'דף יומן קרוע', sub: 'Tear-Off Calendar Page', desc: 'חודש + יום גדול + כמות משחקים כתת-כיתוב — מזכיר יומן קיר קלאסי.', Preview: P25 },
];

const CATS = ['הכול', 'badge', 'anim', 'icon', 'novel'];

/* ── Card ─────────────────────────────────────────────────────────────── */
function DesignCard({ d, isSelected, onSelect }) {
  const { Preview } = d;
  const accent = CAT_COLORS[d.cat];
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: isSelected ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        boxShadow: isSelected ? `0 0 24px ${accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      <div style={{ height: 150, position: 'relative', background: 'linear-gradient(160deg,#050d1a,#0d1a2e)', overflow: 'hidden' }}>
        <LoopStage><Preview /></LoopStage>
        {isSelected && (
          <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <span style={{ color: '#000', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 999, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{d.id}</div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{d.name}</span>
          <span style={{ color: accent, fontSize: 9 }}>{CAT_LABELS[d.cat]}</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, marginTop: 2 }}>{d.sub}</div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 4, lineHeight: 1.5 }}>{d.desc}</div>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function AdminMatchBadgeDesignsDemo() {
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState('הכול');

  const visible = cat === 'הכול' ? DESIGNS : DESIGNS.filter((d) => d.cat === cat);
  const selectedDesign = DESIGNS.find((d) => d.id === selected);

  return (
    <div dir="rtl" style={{ color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>25 עיצובים — כפתור משחקי היום</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {selectedDesign ? `✓ נבחר: ${selectedDesign.name} (${CAT_LABELS[selectedDesign.cat]})` : 'תג המספר, אנימציית התג, ואייקונים חלופיים לכפתור האצטדיון הקיים'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATS.map((c) => {
          const count = c === 'הכול' ? DESIGNS.length : DESIGNS.filter((d) => d.cat === c).length;
          const active = cat === c;
          const accent = CAT_COLORS[c] || '#FFD700';
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{ padding: '6px 14px', borderRadius: 999, border: `1px solid ${active ? accent : 'rgba(255,255,255,0.18)'}`, background: active ? accent : 'rgba(255,255,255,0.06)', color: active ? '#000' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
            >
              {c === 'הכול' ? c : CAT_LABELS[c]} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {visible.map((d) => (
          <DesignCard key={d.id} d={d} isSelected={selected === d.id} onSelect={() => setSelected(selected === d.id ? null : d.id)} />
        ))}
      </div>
    </div>
  );
}
