import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, RotateCcw } from "lucide-react";

const MOCK = [
  { rank: 1, name: 'אביב כהן',    score: 142.5, pred: '2-1', type: 'exact'   },
  { rank: 2, name: 'מיכל לוי',   score: 138.0, pred: '1-0', type: 'correct' },
  { rank: 3, name: 'דניאל רוזן', score: 131.5, pred: '2-2', type: 'exact'   },
  { rank: 4, name: 'שירה גולן',  score: 127.0, pred: '3-1', type: 'correct' },
  { rank: 5, name: 'יונתן בר',   score: 119.5, pred: '0-0', type: 'wrong'   },
  { rank: 6, name: 'נועה שפירא', score: 112.0, pred: '1-1', type: 'wrong'   },
];

const CARD_STYLE = {
  exact:   { border: '1px solid rgba(52,211,153,0.35)',  background: 'rgba(16,185,129,0.08)',  color: '#6ee7b7' },
  correct: { border: '1px solid rgba(251,191,36,0.35)',  background: 'rgba(245,158,11,0.08)',  color: '#fde68a' },
  wrong:   { border: '1px solid rgba(248,113,113,0.3)',  background: 'rgba(239,68,68,0.07)',   color: '#fca5a5' },
};

// 25 reveal styles — each returns Framer Motion props for a single card
// i = card index (0=rank1 at top), n = total cards
const STYLES = [
  {
    id: 1, name: 'בלור-סקייל', sub: 'blur+scale תחתית→ראש (נוכחי)',
    get: (i, n) => ({ initial: { opacity: 0, filter: 'blur(16px)', scale: 0.85 }, animate: { opacity: 1, filter: 'blur(0px)', scale: 1 }, transition: { delay: (n-1-i)*0.32, duration: 0.45, ease: 'easeOut' } }),
  },
  {
    id: 2, name: 'נפילה', sub: 'נפילה+קפיצה מלמעלה',
    get: (i, n) => ({ initial: { opacity: 0, y: -220 }, animate: { opacity: 1, y: 0 }, transition: { delay: i*0.15, type: 'spring', stiffness: 200, damping: 14 } }),
  },
  {
    id: 3, name: 'היפוך כרטיס', sub: 'פליפ 3D ציר-Y',
    get: (i, n) => ({ initial: { opacity: 0, rotateY: 90, scale: 0.9 }, animate: { opacity: 1, rotateY: 0, scale: 1 }, transition: { delay: i*0.22, duration: 0.55, ease: 'easeOut' } }),
  },
  {
    id: 4, name: 'הזזה מימין', sub: 'Slide מימין, elastic',
    get: (i, n) => ({ initial: { opacity: 0, x: 300 }, animate: { opacity: 1, x: 0 }, transition: { delay: (n-1-i)*0.2, type: 'spring', stiffness: 180, damping: 18 } }),
  },
  {
    id: 5, name: 'זום-אין', sub: 'Zoom מגדול לנורמלי',
    get: (i, n) => ({ initial: { opacity: 0, scale: 2.5, filter: 'blur(8px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)' }, transition: { delay: i*0.18, duration: 0.5, ease: [0.16,1,0.3,1] } }),
  },
  {
    id: 6, name: 'פיצוץ', sub: 'Scale 0→1 elastic spring',
    get: (i, n) => ({ initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, transition: { delay: (n-1-i)*0.2, type: 'spring', stiffness: 280, damping: 18 } }),
  },
  {
    id: 7, name: 'קיפול', sub: 'RotateX 90°→0° (נפתח)',
    get: (i, n) => ({ initial: { opacity: 0, rotateX: 90, y: 20 }, animate: { opacity: 1, rotateX: 0, y: 0 }, transition: { delay: (n-1-i)*0.22, duration: 0.55, ease: 'easeOut' } }),
  },
  {
    id: 8, name: 'ספין', sub: 'סיבוב 180° + scale',
    get: (i, n) => ({ initial: { opacity: 0, rotate: -180, scale: 0.3 }, animate: { opacity: 1, rotate: 0, scale: 1 }, transition: { delay: (n-1-i)*0.25, type: 'spring', stiffness: 120, damping: 14 } }),
  },
  {
    id: 9, name: 'אלסטי', sub: 'Elastic מצד שמאל',
    get: (i, n) => ({ initial: { opacity: 0, x: -400 }, animate: { opacity: 1, x: 0 }, transition: { delay: i*0.15, type: 'spring', stiffness: 140, damping: 10 } }),
  },
  {
    id: 10, name: 'אקורדיון', sub: 'scaleY 0→1, פריסה אנכית',
    get: (i, n) => ({ initial: { opacity: 0, scaleY: 0, originY: 0 }, animate: { opacity: 1, scaleY: 1 }, transition: { delay: i*0.18, duration: 0.4, ease: 'easeOut' } }),
  },
  {
    id: 11, name: 'מגלל', sub: 'clipPath wipe מימין לשמאל',
    get: (i, n) => ({ initial: { clipPath: 'inset(0 100% 0 0)' }, animate: { clipPath: 'inset(0 0% 0 0)' }, transition: { delay: (n-1-i)*0.25, duration: 0.5, ease: [0.76,0,0.24,1] } }),
  },
  {
    id: 12, name: "גליצ'", sub: 'Glitch jitter + skew',
    get: (i, n) => ({ initial: { opacity: 0, x: 0, skewX: 0 }, animate: { opacity: 1, x: [12,-9,6,-3,0], skewX: [6,-4,2,-1,0] }, transition: { delay: i*0.12, duration: 0.4, ease: 'easeOut', times: [0,0.25,0.5,0.75,1] } }),
  },
  {
    id: 13, name: 'פרספקטיבה', sub: 'RotateX -75°→0° מלמטה',
    get: (i, n) => ({ initial: { opacity: 0, rotateX: -75, y: 40 }, animate: { opacity: 1, rotateX: 0, y: 0 }, transition: { delay: i*0.2, duration: 0.6, ease: 'easeOut' } }),
  },
  {
    id: 14, name: 'גל', sub: 'גל סינוסואידלי + spring',
    get: (i, n) => ({ initial: { opacity: 0, y: 60 + Math.sin(i) * 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i*0.1, type: 'spring', stiffness: 160, damping: 16 } }),
  },
  {
    id: 15, name: 'סינמטי', sub: 'חשיפה דרמטית, איטי מאוד',
    get: (i, n) => ({ initial: { opacity: 0, y: 30, filter: 'blur(4px)' }, animate: { opacity: 1, y: 0, filter: 'blur(0px)' }, transition: { delay: (n-1-i)*0.55, duration: 1.1, ease: [0.22,1,0.36,1] } }),
  },
  {
    id: 16, name: 'פלאש', sub: 'Brightness flash → settle',
    get: (i, n) => ({ initial: { opacity: 0, scale: 1.1, filter: 'brightness(4) blur(4px)' }, animate: { opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)' }, transition: { delay: (n-1-i)*0.28, duration: 0.55, ease: 'easeOut' } }),
  },
  {
    id: 17, name: 'זיגזג', sub: 'שמאל/ימין לסירוגין',
    get: (i, n) => ({ initial: { opacity: 0, x: i%2===0 ? -300 : 300 }, animate: { opacity: 1, x: 0 }, transition: { delay: (n-1-i)*0.18, type: 'spring', stiffness: 200, damping: 20 } }),
  },
  {
    id: 18, name: 'קינמה', sub: 'Fade בלבד, delay גדול',
    get: (i, n) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: (n-1-i)*0.65, duration: 1.2, ease: 'easeIn' } }),
  },
  {
    id: 19, name: 'קפיצה', sub: 'Bounce y keyframes מלמטה',
    get: (i, n) => ({ initial: { opacity: 0, y: 120 }, animate: { opacity: 1, y: [120, 0, -22, 8, 0] }, transition: { delay: (n-1-i)*0.2, duration: 0.7, ease: 'easeOut', times: [0,0.5,0.7,0.85,1] } }),
  },
  {
    id: 20, name: 'עומק', sub: 'Scale מעומק + blur חזק',
    get: (i, n) => ({ initial: { opacity: 0, scale: 0.1, filter: 'blur(20px)' }, animate: { opacity: 1, scale: 1, filter: 'blur(0px)' }, transition: { delay: (n-1-i)*0.3, type: 'spring', stiffness: 100, damping: 12 } }),
  },
  {
    id: 21, name: 'אלכסון', sub: 'Slide אלכסוני X+Y',
    get: (i, n) => ({ initial: { opacity: 0, x: -200, y: -80 }, animate: { opacity: 1, x: 0, y: 0 }, transition: { delay: (n-1-i)*0.22, type: 'spring', stiffness: 160, damping: 18 } }),
  },
  {
    id: 22, name: 'פנורמה', sub: 'RotateY מימין, ראש→תחתית',
    get: (i, n) => ({ initial: { opacity: 0, rotateY: -90, x: 50 }, animate: { opacity: 1, rotateY: 0, x: 0 }, transition: { delay: i*0.22, duration: 0.55, ease: 'easeOut' } }),
  },
  {
    id: 23, name: "ג'לי", sub: 'Jello — scaleX/Y elastic',
    get: (i, n) => ({ initial: { opacity: 0, scaleX: 1.6, scaleY: 0.4 }, animate: { opacity: 1, scaleX: 1, scaleY: 1 }, transition: { delay: (n-1-i)*0.25, type: 'spring', stiffness: 300, damping: 12 } }),
  },
  {
    id: 24, name: 'מטריקס', sub: 'ירידה מהירה + brightness',
    get: (i, n) => ({ initial: { opacity: 0, y: -80, filter: 'brightness(4)' }, animate: { opacity: 1, y: 0, filter: 'brightness(1)' }, transition: { delay: i*0.08, duration: 0.28, ease: [0.4,0,0.2,1] } }),
  },
  {
    id: 25, name: 'וורטקס', sub: 'Spiral מהמרכז החוצה',
    get: (i, n) => ({ initial: { opacity: 0, scale: 0, rotate: (n-1-i)*50, x: Math.cos((n-1-i))*80, y: Math.sin((n-1-i))*50 }, animate: { opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }, transition: { delay: (n-1-i)*0.18, type: 'spring', stiffness: 130, damping: 14 } }),
  },
];

function MockCard({ row, motionProps }) {
  const s = CARD_STYLE[row.type];
  return (
    <motion.div {...motionProps} style={{ ...s, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, willChange: 'transform, opacity' }}>
      <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${s.color}44` }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: s.color }}>{row.rank}</span>
      </div>
      <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{row.name}</span>
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#7dd3fc' }}>{row.pred}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{row.score}</span>
    </motion.div>
  );
}

export default function AdminRevealDemo() {
  const [sel, setSel] = useState(1);
  const [playKey, setPlayKey] = useState(0);
  const style = STYLES.find(s => s.id === sel);
  const n = MOCK.length;

  // auto-replay when style changes
  useEffect(() => { setPlayKey(k => k + 1); }, [sel]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', color: '#e2e8f0', padding: 24 }} dir="rtl">
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#f8fafc' }}>25 אפקטי חשיפה — דמו</h2>
      <p style={{ fontSize: 11, color: '#64748b', marginBottom: 20 }}>בחר סגנון — האנימציה מתחילה אוטומטית</p>

      {/* picker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, marginBottom: 28, maxWidth: 580 }}>
        {STYLES.map(s => (
          <button key={s.id} onClick={() => setSel(s.id)}
            style={{ padding: '7px 4px', borderRadius: 8, border: `1px solid ${sel===s.id?'#f5c518':'#1e293b'}`, background: sel===s.id?'rgba(245,197,24,.12)':'#1e293b', color: sel===s.id?'#f5c518':'#64748b', fontSize: 10, fontWeight: 600, cursor: 'pointer', lineHeight: 1.4, transition: 'all .15s' }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: sel===s.id?'#f5c518':'#475569' }}>{s.id}</div>
            {s.name}
          </button>
        ))}
      </div>

      {/* preview */}
      <div style={{ background: '#060c1a', borderRadius: 16, padding: 24, border: '1px solid #1e293b', maxWidth: 420 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>{sel}. {style.name}</span>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{style.sub}</div>
          </div>
          <button onClick={() => setPlayKey(k => k+1)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #1e293b', background: '#1e293b', color: '#94a3b8', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
            <RotateCcw size={12}/> שחק שוב
          </button>
        </div>

        <AnimatePresence mode="wait">
          <div key={`${sel}-${playKey}`}>
            {MOCK.map((row, i) => (
              <MockCard key={row.rank} row={row} motionProps={style.get(i, n)} />
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
