import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Demo-only: 20 entrance-animation styles for the "משחקי היום" grid shown on
// app entry (Layout.jsx). Mock data, self-contained, autoplays + replayable.
// Doesn't touch Layout.jsx.

const BLUE = '9,122,220';
const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ec4899', '#06b6d4', '#f97316'];
function colorFor(code) {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = code.charCodeAt(i) + ((h << 5) - h);
  return COLORS[Math.abs(h) % COLORS.length];
}
function Badge({ code, size = 20 }) {
  return (
    <div className="rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.36, background: colorFor(code) }}>
      {code[0]}
    </div>
  );
}

const MATCHES = [
  { a: 'ARS', b: 'BAY', time: '19:00' },
  { a: 'RMA', b: 'INT', time: '19:00' },
  { a: 'PSG', b: 'LIV', time: '22:00' },
  { a: 'BAR', b: 'MCI', time: '22:00' },
  { a: 'POR', b: 'CEL', time: '19:00' },
  { a: 'FEY', b: 'NAP', time: '22:00' },
];

function Cell({ style, children }) {
  return (
    <div className="rounded-xl px-2 py-2.5 flex flex-col items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', ...style }}>
      {children}
    </div>
  );
}
function CellContent({ m }) {
  return (
    <>
      <div className="flex items-center gap-1.5"><Badge code={m.a} /><Badge code={m.b} /></div>
      <span className="text-slate-400 text-[9px] font-bold" dir="ltr">{m.time}</span>
    </>
  );
}

function useReplay() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}

function Frame({ label, desc, children }) {
  const [replay, bump] = useReplay();
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="rounded-xl overflow-hidden p-3 flex items-center justify-center" style={{ background: '#050a12', minHeight: 150 }}>
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

// 1. Classic staggered fade+scale
function V1({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 260 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 2. Diagonal wave
function V2({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => {
        const row = Math.floor(i / 3), col = i % 3;
        return (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (row + col) * 0.15 }}>
            <Cell><CellContent m={m} /></Cell>
          </motion.div>
        );
      })}
    </div>
  );
}

// 3. Radial burst from center
function V3({ k }) {
  const positions = [{ x: -90, y: -50 }, { x: 0, y: -60 }, { x: 90, y: -50 }, { x: -90, y: 50 }, { x: 0, y: 60 }, { x: 90, y: 50 }];
  return (
    <div key={k} className="relative" style={{ width: 240, height: 130 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={i} className="absolute" style={{ left: '50%', top: '50%' }}
          initial={{ x: -50, y: -30, scale: 0, opacity: 0 }} animate={{ x: positions[i].x - 50, y: positions[i].y - 30, scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.07, type: 'spring', stiffness: 220, damping: 18 }}>
          <Cell style={{ width: 96 }}><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 4. Spiral inward
function V4({ k }) {
  return (
    <div key={k} className="relative" style={{ width: 240, height: 140 }}>
      {MATCHES.map((m, i) => {
        const angle = i * 137.5 * (Math.PI / 180);
        const r = 90 - i * 12;
        return (
          <motion.div key={i} className="absolute" style={{ left: '50%', top: '50%' }}
            initial={{ x: Math.cos(angle) * r - 48, y: Math.sin(angle) * r - 25, scale: 0, opacity: 0, rotate: 180 }}
            animate={{ x: (i % 3) * 80 - 88, y: Math.floor(i / 3) * 60 - 30, scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}>
            <Cell style={{ width: 74 }}><CellContent m={m} /></Cell>
          </motion.div>
        );
      })}
    </div>
  );
}

// 5. Cascade drop with bounce
function V5({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 12 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 6. 3D coin flip
function V6({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2" style={{ perspective: 400 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ rotateY: 180, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ delay: i * 0.12, duration: 0.5 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 7. Blur to focus
function V7({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ filter: 'blur(10px)', opacity: 0, scale: 1.3 }} animate={{ filter: 'blur(0px)', opacity: 1, scale: 1 }} transition={{ delay: i * 0.12, duration: 0.5 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 8. Random directions (puzzle assembly)
function V8({ k }) {
  const from = [{ x: -100, y: 0 }, { x: 0, y: -80 }, { x: 100, y: 0 }, { x: -60, y: 60 }, { x: 0, y: 80 }, { x: 60, y: -60 }];
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ x: from[i].x, y: from[i].y, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 240, damping: 20 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 9. Zoom out from a single point
function V9({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ scale: 4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 10. Typewriter clip-path wipe (current baseline)
function V10({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <div key={i} style={{ overflow: 'hidden', borderRadius: 12 }}>
          <motion.div initial={{ clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ delay: i * 0.15, duration: 0.5 }}>
            <Cell><CellContent m={m} /></Cell>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// 11. Confetti particles coalesce
function V11({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <div key={i} className="relative">
          {Array.from({ length: 4 }).map((_, p) => (
            <motion.span key={p} className="absolute w-1 h-1 rounded-full" style={{ background: colorFor(m.a), left: '50%', top: '50%' }}
              initial={{ x: (p - 1.5) * 26, y: (p % 2 ? 1 : -1) * 18, opacity: 1 }} animate={{ x: 0, y: 0, opacity: 0 }} transition={{ delay: i * 0.1, duration: 0.4 }} />
          ))}
          <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 + 0.25 }}>
            <Cell><CellContent m={m} /></Cell>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// 12. Elastic bounce
function V12({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 400, damping: 9 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 13. Color wash (grayscale -> color)
function V13({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ filter: 'grayscale(1) brightness(0.5)', opacity: 0.3 }} animate={{ filter: 'grayscale(0) brightness(1)', opacity: 1 }} transition={{ delay: i * 0.14, duration: 0.5 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 14. Domino chain with connectors
function V14({ k }) {
  return (
    <div key={k} className="flex flex-col gap-0 w-full max-w-[220px]">
      {MATCHES.slice(0, 4).map((m, i) => (
        <React.Fragment key={i}>
          {i > 0 && <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.16 - 0.05, duration: 0.1 }} style={{ width: 2, height: 8, background: `rgba(${BLUE},0.5)`, marginRight: 12, transformOrigin: 'top' }} />}
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.16, type: 'spring', stiffness: 300 }}>
            <Cell style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}><CellContent m={m} /></Cell>
          </motion.div>
        </React.Fragment>
      ))}
    </div>
  );
}

// 15. Curtain / blinds wipe
function V15({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <div key={i} style={{ overflow: 'hidden', borderRadius: 12 }}>
          <motion.div initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ delay: i * 0.1, duration: 0.4, ease: 'easeInOut' }}>
            <Cell><CellContent m={m} /></Cell>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// 16. Magnetic snap from scattered positions
function V16({ k }) {
  const scatter = [{ x: -90, y: -60, r: -30 }, { x: 100, y: -40, r: 25 }, { x: -110, y: 30, r: 15 }, { x: 90, y: 60, r: -20 }, { x: 0, y: -90, r: 10 }, { x: 0, y: 90, r: -15 }];
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ x: scatter[i].x, y: scatter[i].y, rotate: scatter[i].r, opacity: 0 }} animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }} transition={{ delay: i * 0.06, type: 'spring', stiffness: 180, damping: 14 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 17. Ripple from a tap point
function V17({ k }) {
  const dist = [1.4, 1, 1.4, 1, 0, 1];
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: dist[i] * 0.2, duration: 0.4 }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 18. Split-flap scoreboard
function V18({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2" style={{ perspective: 250 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: i * 0.13, duration: 0.35 }} style={{ transformOrigin: 'top' }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 19. Digital glitch reveal
function V19({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2">
      {MATCHES.map((m, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: [0, 1, 0.3, 1], x: [8, -6, 3, 0] }}
          transition={{ delay: i * 0.1, duration: 0.3, times: [0, 0.3, 0.6, 1] }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

// 20. Origami unfold
function V20({ k }) {
  return (
    <div key={k} className="grid grid-cols-3 gap-2" style={{ perspective: 300 }}>
      {MATCHES.map((m, i) => (
        <motion.div key={i} initial={{ rotateX: -70, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ delay: i * 0.12, duration: 0.45, ease: 'easeOut' }} style={{ transformOrigin: 'top' }}>
          <Cell><CellContent m={m} /></Cell>
        </motion.div>
      ))}
    </div>
  );
}

const VARIANTS = [
  ['1. פייד+מדורג קלאסי', 'קפיץ עדין, כרטיס אחר כרטיס', V1],
  ['2. גל אלכסוני', 'עיכוב לפי מרחק אלכסוני מהפינה', V2],
  ['3. פיצוץ רדיאלי', 'כרטיסים מתפזרים ממרכז המסך', V3],
  ['4. ספירלה פנימה', 'כניסה בתנועה ספירלית עם סיבוב', V4],
  ['5. מפל עם קפיץ', 'נופלים מלמעלה עם bounce', V5],
  ['6. הפיכת מטבע תלת-ממד', 'כל כרטיס מתהפך מגב לפנים', V6],
  ['7. מטושטש לחד', 'נכנס מטושטש ומתמקד', V7],
  ['8. כיוונים אקראיים', 'כל כרטיס מגיע מכיוון אחר', V8],
  ['9. זום-אאוט מנקודה', 'מתחיל ענק וכתמצת למקומו', V9],
  ['10. מכונת כתיבה (הקיים)', 'חשיפה בקליפ אופקי — הבסיס הנוכחי', V10],
  ['11. קונפטי מתכנס', 'חלקיקים קטנים מתכנסים לכרטיס', V11],
  ['12. קפיצה אלסטית', 'overshoot חזק בכניסה', V12],
  ['13. שטיפת צבע', 'מתחיל אפור/כהה ועובר לצבע מלא', V13],
  ['14. שרשרת דומינו', 'כרטיסים ברצף עם קו מחבר קצר', V14],
  ['15. וילון/תריסים', 'חשיפה אנכית מלמטה למעלה', V15],
  ['16. הצמדה מגנטית', 'מתעופפים ממיקומים מפוזרים ונצמדים', V16],
  ['17. אדווה ממרכז', 'עיכוב לפי מרחק מהתא האמצעי', V17],
  ['18. סקורבורד מתהפך', 'פליפ אנכי כמו לוח תוצאות', V18],
  ['19. גליץ׳ דיגיטלי', 'רעד/הבהוב קצר לפני התייצבות', V19],
  ['20. קיפול אוריגמי', 'נפתח מלמעלה כמו קיפול נייר', V20],
];

export default function AdminGridRevealDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 20 אנימציות לחשיפת גריד המשחקים</h2>
        <p className="text-slate-500 text-sm">כולן חיות עם כפתור "הצג שוב". דאטה קבוע לדוגמה. כלי דמו בלבד — לא משפיע על Layout.jsx.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {VARIANTS.map(([label, desc, Comp]) => (
          <Frame key={label} label={label} desc={desc}>{(k) => <Comp k={k} />}</Frame>
        ))}
      </div>
    </div>
  );
}
