import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   25 reveal-effect concepts for the "Next Match" overlay (teams, date/time,
   countdown). Each preview auto-loops its entrance animation every ~3.8s so
   the effect itself — not just a static frame — is what's being compared.
   ────────────────────────────────────────────────────────────────────────── */

const MOCK = {
  teamAFlag: '🇧🇷', teamA: 'ברזיל',
  teamBFlag: '🇦🇷', teamB: 'ארגנטינה',
  date: '05/07', time: '20:00',
  units: [['02', 'ימים'], ['14', 'שעות'], ['37', 'דק'], ['09', 'שנ']],
};

/* ── shared atoms ─────────────────────────────────────────────────────── */
const Chip = ({ v, l, accent, style }) => (
  <div style={{ textAlign: 'center', ...style }}>
    <div style={{ background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 8, padding: '4px 7px', color: '#fff', fontWeight: 800, fontSize: 13, fontFamily: 'monospace', minWidth: 30 }}>{v}</div>
    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, marginTop: 2 }}>{l}</div>
  </div>
);

const TitleChip = ({ accent, children = 'המשחק הבא' }) => (
  <div style={{ background: `${accent}18`, border: `1px solid ${accent}45`, borderRadius: 999, padding: '3px 10px', color: accent, fontSize: 8, fontWeight: 800, letterSpacing: 1 }}>{children}</div>
);

const FlagsRow = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontSize: 20 }}>{MOCK.teamAFlag}</span>
    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}>VS</span>
    <span style={{ fontSize: 20 }}>{MOCK.teamBFlag}</span>
  </div>
);

const DateLine = () => (
  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10 }}>{MOCK.date} · {MOCK.time}</div>
);

const ChipsRow = ({ accent }) => (
  <div style={{ display: 'flex', gap: 5 }}>
    {MOCK.units.map(([v, l]) => <Chip key={l} v={v} l={l} accent={accent} />)}
  </div>
);

function BaseScene({ accent, itemVariants, staggerDelay = 0.16, transitionOverride }) {
  const container = { hidden: {}, show: { transition: { staggerChildren: staggerDelay } } };
  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <motion.div custom={0} variants={itemVariants} transition={transitionOverride}><TitleChip accent={accent} /></motion.div>
      <motion.div custom={1} variants={itemVariants} transition={transitionOverride}><FlagsRow /></motion.div>
      <motion.div custom={2} variants={itemVariants} transition={transitionOverride}><DateLine /></motion.div>
      <motion.div custom={3} variants={itemVariants} transition={transitionOverride}><ChipsRow accent={accent} /></motion.div>
    </motion.div>
  );
}

function TypewriterLine({ text, style, delay = 0 }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const start = setTimeout(() => {
      const iv = setInterval(() => setN((v) => (v < text.length ? v + 1 : v)), 45);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  return <span style={style}>{text.slice(0, n)}<span style={{ opacity: n < text.length ? 0.5 : 0 }}>|</span></span>;
}

function Confetti() {
  const pieces = React.useMemo(() => Array.from({ length: 14 }).map((_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.3, duration: 0.9 + Math.random() * 0.6,
    color: ['#f5c518', '#4ade80', '#2dd4bf', '#fff'][i % 4],
  })), []);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map((p, i) => (
        <motion.span key={i} initial={{ y: -10, opacity: 0 }} animate={{ y: 90, opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay }}
          style={{ position: 'absolute', top: 0, left: `${p.left}%`, width: 4, height: 7, background: p.color, borderRadius: 1 }} />
      ))}
    </div>
  );
}

/* ── 25 effects ───────────────────────────────────────────────────────── */

const fadeUp = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const fadeOnly = { hidden: { opacity: 0 }, show: { opacity: 1 } };

const E1 = ({ accent }) => <BaseScene accent={accent} itemVariants={fadeUp} transitionOverride={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />;

const E2 = ({ accent }) => {
  const offsets = [[0, -22], [-26, 0], [0, 16], [26, 0]];
  const variants = { hidden: (i) => ({ opacity: 0, scale: 0.3, x: offsets[i][0], y: offsets[i][1] }), show: { opacity: 1, scale: 1, x: 0, y: 0 } };
  return <BaseScene accent={accent} itemVariants={variants} transitionOverride={{ type: 'spring', stiffness: 260, damping: 18 }} />;
};

const E3 = ({ accent }) => (
  <div style={{ perspective: 700 }}>
    <motion.div initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} style={{ transformStyle: 'preserve-3d' }}>
      <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.08} transitionOverride={{ duration: 0.3 }} />
    </motion.div>
  </div>
);

const E4 = ({ accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
    <TitleChip accent={accent} />
    <FlagsRow />
    <DateLine />
    <div style={{ display: 'flex', gap: 5, perspective: 300 }}>
      {MOCK.units.map(([v, l], i) => (
        <motion.div key={l} initial={{ rotateX: 90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }} style={{ transformOrigin: 'bottom' }}>
          <Chip v={v} l={l} accent={accent} />
        </motion.div>
      ))}
    </div>
  </div>
);

const E5 = ({ accent }) => {
  const chars = MOCK.teamA.split('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <TitleChip accent={accent} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 20 }}>{MOCK.teamAFlag}</span>
        <span style={{ display: 'flex' }}>
          {chars.map((c, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0, 1, 0, 1] }}
              transition={{ delay: i * 0.05, duration: 0.35 }} style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{c}</motion.span>
          ))}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>VS</span>
        <span style={{ fontSize: 20 }}>{MOCK.teamBFlag}</span>
      </div>
      <DateLine /><ChipsRow accent={accent} />
    </div>
  );
};

const E6 = ({ accent }) => (
  <div style={{ position: 'relative' }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.3 }} />
    <motion.div initial={{ scaleX: 1 }} animate={{ scaleX: 0 }} transition={{ duration: 0.55, ease: 'easeInOut', delay: 0.35 }}
      style={{ position: 'absolute', inset: 0, background: '#030d1a', transformOrigin: 'left' }} />
  </div>
);

const E7 = ({ accent }) => (
  <div style={{ position: 'relative' }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.3 }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
          style={{ flex: 1, background: '#030d1a', transformOrigin: i % 2 ? 'top' : 'bottom' }} />
      ))}
    </div>
  </div>
);

const E8 = ({ accent }) => (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <BaseScene accent={accent} itemVariants={fadeUp} staggerDelay={0.1} transitionOverride={{ duration: 0.4 }} />
    <motion.div initial={{ x: '-160%' }} animate={{ x: '160%' }} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.15 }}
      style={{ position: 'absolute', top: 0, bottom: 0, width: '40%', background: `linear-gradient(100deg, transparent, ${accent}66, transparent)`, pointerEvents: 'none' }} />
  </div>
);

const E9 = ({ accent }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.15, 1, 0.3, 1] }} transition={{ duration: 1, times: [0, 0.15, 0.3, 0.45, 0.6, 1] }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, filter: `drop-shadow(0 0 6px ${accent}88)` }}>
      <TitleChip accent={accent} /><FlagsRow /><DateLine /><ChipsRow accent={accent} />
    </div>
  </motion.div>
);

const E10 = ({ accent }) => (
  <motion.div style={{ padding: 2, borderRadius: 14, background: 'linear-gradient(120deg,#ff9ecb,#a78bfa,#7dd3fc,#fbbf24,#ff9ecb)', backgroundSize: '300% 300%' }}
    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 2.6, ease: 'linear', repeat: Infinity }}>
    <div style={{ background: '#030d1a', borderRadius: 12, padding: '12px 10px' }}>
      <BaseScene accent={accent} itemVariants={fadeUp} staggerDelay={0.1} transitionOverride={{ duration: 0.4 }} />
    </div>
  </motion.div>
);

const E11 = ({ accent }) => (
  <motion.div animate={{ x: [0, -3, 3, -2, 2, 0], filter: ['none', 'hue-rotate(90deg)', 'hue-rotate(-90deg)', 'none', 'none', 'none'] }} transition={{ duration: 0.5 }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.03} transitionOverride={{ duration: 0.15 }} />
  </motion.div>
);

const E12 = ({ accent }) => (
  <div style={{ position: 'relative' }}>
    <Confetti />
    <BaseScene accent={accent} itemVariants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1 } }} staggerDelay={0.08} transitionOverride={{ type: 'spring', stiffness: 220, damping: 16 }} />
  </div>
);

const E13 = ({ accent }) => (
  <BaseScene accent={accent} itemVariants={fadeUp} staggerDelay={0.15} transitionOverride={{ type: 'spring', stiffness: 320, damping: 8 }} />
);

const E14 = ({ accent }) => (
  <div style={{ position: 'relative' }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.02} transitionOverride={{ duration: 0.2 }} />
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gridTemplateRows: 'repeat(5,1fr)' }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 1 }} animate={{ opacity: 0 }}
          transition={{ delay: (i % 8) * 0.035 + Math.floor(i / 8) * 0.02, duration: 0.01 }} style={{ background: '#030d1a' }} />
      ))}
    </div>
  </div>
);

const E15 = ({ accent }) => (
  <div style={{ position: 'relative', perspective: 500 }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.3 }} />
    <motion.div initial={{ rotateX: 0 }} animate={{ rotateX: -105 }} transition={{ duration: 0.55, delay: 0.15 }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: '#030d1a', transformOrigin: 'top' }} />
    <motion.div initial={{ rotateX: 0 }} animate={{ rotateX: 105 }} transition={{ duration: 0.55, delay: 0.15 }}
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%', background: '#030d1a', transformOrigin: 'bottom' }} />
  </div>
);

const E16 = ({ accent }) => {
  const offsets = [[0, -60], [-90, 20], [90, -20], [0, 60]];
  const variants = { hidden: (i) => ({ opacity: 0, x: offsets[i][0], y: offsets[i][1] }), show: { opacity: 1, x: 0, y: 0 } };
  return <BaseScene accent={accent} itemVariants={variants} staggerDelay={0.06} transitionOverride={{ type: 'spring', stiffness: 200, damping: 14 }} />;
};

const E17 = ({ accent }) => (
  <motion.div initial={{ y: 50, rotate: 6, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 20 }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.25 }} />
  </motion.div>
);

const E18 = ({ accent }) => (
  <motion.div initial={{ scale: 1.7, opacity: 0, filter: 'blur(8px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
    <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.25 }} />
  </motion.div>
);

const E19 = ({ accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
    <TitleChip accent={accent} /><FlagsRow />
    <TypewriterLine text={`${MOCK.date} · ${MOCK.time}`} delay={500} style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10, fontFamily: 'monospace' }} />
    <ChipsRow accent={accent} />
  </div>
);

const E20 = ({ accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
    <TitleChip accent={accent} /><FlagsRow /><DateLine />
    <div style={{ display: 'flex', gap: 5 }}>
      {MOCK.units.map(([v, l], i) => (
        <motion.div key={l} animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.1 }}>
          <Chip v={v} l={l} accent={accent} />
        </motion.div>
      ))}
    </div>
  </div>
);

const E21 = ({ accent }) => (
  <div style={{ position: 'relative' }}>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 0.5 }}
      style={{ position: 'absolute', top: 0, left: '-15%', width: '65%', height: '100%', background: `linear-gradient(115deg, ${accent}, transparent 60%)` }} />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 0.5, delay: 0.1 }}
      style={{ position: 'absolute', top: 0, right: '-15%', width: '65%', height: '100%', background: `linear-gradient(245deg, ${accent}, transparent 60%)` }} />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35, duration: 0.4 }}>
      <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.25 }} />
    </motion.div>
  </div>
);

const E22 = ({ accent }) => (
  <div style={{ position: 'relative' }}>
    <svg width="100%" height="100%" viewBox="0 0 200 130" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
      <motion.rect x="4" y="4" width="192" height="122" rx="10" fill="none" stroke={accent} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: 'easeInOut' }} />
    </svg>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
      <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.25 }} />
    </motion.div>
  </div>
);

const E23 = ({ accent }) => {
  const variants = { hidden: (i) => ({ opacity: 0, y: 14, rotate: i % 2 ? -4 : 4 }), show: { opacity: 1, y: 0, rotate: 0 } };
  return <BaseScene accent={accent} itemVariants={variants} staggerDelay={0.13} transitionOverride={{ duration: 0.45, ease: 'easeOut' }} />;
};

const E24 = ({ accent }) => (
  <div style={{ position: 'relative', overflow: 'hidden' }}>
    <motion.div initial={{ scale: 0 }} animate={{ scale: 9 }} transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{ position: 'absolute', top: '50%', left: '50%', width: 16, height: 16, marginLeft: -8, marginTop: -8, borderRadius: '50%', background: `${accent}25` }} />
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.4 }}>
      <BaseScene accent={accent} itemVariants={fadeOnly} staggerDelay={0.05} transitionOverride={{ duration: 0.25 }} />
    </motion.div>
  </div>
);

const E25 = ({ accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
    <motion.div initial={{ scale: 2, opacity: 0, skewX: -15 }} animate={{ scale: 1, opacity: 1, skewX: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
      <TitleChip accent={accent} />
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.35 }}><FlagsRow /></motion.div>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.42 }}><DateLine /></motion.div>
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.52 }}><ChipsRow accent={accent} /></motion.div>
  </div>
);

/* ── loop wrapper — remounts children on an interval to replay the entrance ── */
function LoopStage({ interval = 3800, children }) {
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

/* ── data ─────────────────────────────────────────────────────────────── */
const DESIGNS = [
  { id: 1, cat: 'סטגר', name: 'החלקה מלמטה', sub: 'Stagger Slide-Up', desc: 'כל רכיב נכנס בזה אחר זה עם fade + תזוזה כלפי מעלה — קלאסי ונקי.', accent: '#f5c518', Effect: E1 },
  { id: 2, cat: 'פיזיקה/תנועה', name: 'פיצוץ רדיאלי', sub: 'Radial Burst', desc: 'הרכיבים "מתפוצצים" פנימה ממרכז הכרטיס מכיוונים שונים.', accent: '#f97316', Effect: E2 },
  { id: 3, cat: 'תלת-מימד', name: 'היפוך קלף תלת-מימדי', sub: '3D Card Flip', desc: 'הכרטיס כולו מסתובב על ציר Y ונחשף בפרספקטיבה.', accent: '#38bdf8', Effect: E3 },
  { id: 4, cat: 'טיפוגרפיה', name: 'ספרות לוח דפדוף', sub: 'Flip-Clock Digits', desc: 'כל ספרת ספירה לאחור "נופלת" פנימה כמו לוח שעון מכני ישן.', accent: '#4ade80', Effect: E4 },
  { id: 5, cat: 'טיפוגרפיה', name: 'שמות מהבהבים', sub: 'Split-Flap Team Names', desc: 'שם הקבוצה מהבהב אות-אות לפני שהוא מתייצב, כמו שלט תחנת רכבת.', accent: '#a78bfa', Effect: E5 },
  { id: 6, cat: 'מסך/מסכה', name: 'וילון נגלל', sub: 'Curtain Wipe', desc: 'פאנל כהה "נגלל" הצידה וחושף את הכרטיס מתחתיו.', accent: '#f5c518', Effect: E6 },
  { id: 7, cat: 'מסך/מסכה', name: 'תריסים אנכיים', sub: 'Vertical Blinds', desc: 'רצועות אנכיות נפתחות בזו אחר זו כמו תריס.', accent: '#2dd4bf', Effect: E7 },
  { id: 8, cat: 'אווירה', name: 'מטאטא זרקור', sub: 'Spotlight Sweep', desc: 'פס אור אלכסוני חולף פעם אחת מעל הכרטיס עם הופעתו.', accent: '#fbbf24', Effect: E8 },
  { id: 9, cat: 'אווירה', name: 'ניאון מהבהב', sub: 'Neon Flicker-On', desc: 'הכרטיס "נדלק" במהבהוב לא סדיר לפני שהוא נשאר יציב, כמו שלט ניאון.', accent: '#22d3ee', Effect: E9 },
  { id: 10, cat: 'אווירה', name: 'ברק הולוגרפי', sub: 'Holographic Shimmer', desc: 'מסגרת בגוונים משתנים זזה ברציפות סביב הכרטיס.', accent: '#d946ef', Effect: E10 },
  { id: 11, cat: 'אווירה', name: 'גליץ׳ דיגיטלי', sub: 'Glitch Digital Reveal', desc: 'רעד קל וסטיית צבע רגעית לפני שהתמונה "מתייצבת" נקייה.', accent: '#ef4444', Effect: E11 },
  { id: 12, cat: 'פיזיקה/תנועה', name: 'התפרצות קונפטי', sub: 'Confetti Burst Reveal', desc: 'הכרטיס נכנס עם קפיצה קלה ופרץ קונפטי מאחוריו.', accent: '#f5c518', Effect: E12 },
  { id: 13, cat: 'פיזיקה/תנועה', name: 'קפיצה אלסטית', sub: 'Bounce-In Badges', desc: 'כל רכיב "מקפץ" פנימה במעין קפיץ גמיש ומשחקי.', accent: '#fb7185', Effect: E13 },
  { id: 14, cat: 'מסך/מסכה', name: 'המסה לפיקסלים', sub: 'Pixel Dissolve', desc: 'רשת ריבועים נעלמת בפיזור אקראי וחושפת את הכרטיס מתחתיה.', accent: '#60a5fa', Effect: E14 },
  { id: 15, cat: 'תלת-מימד', name: 'קיפול אוריגמי', sub: 'Origami Unfold', desc: 'שני פאנלים נפתחים כמו דלתות נייר מקופלות, מלמעלה ומלמטה.', accent: '#e2725b', Effect: E15 },
  { id: 16, cat: 'פיזיקה/תנועה', name: 'הרכבה מגנטית', sub: 'Magnetic Snap Assembly', desc: 'חלקי הכרטיס "עפים" פנימה מכיוונים אקראיים ו"נצמדים" למקומם.', accent: '#818cf8', Effect: E16 },
  { id: 17, cat: 'פיזיקה/תנועה', name: 'החלקת כרטיס כניסה', sub: 'Ticket Slide-In', desc: 'הכרטיס נכנס מלמטה עם סיבוב קל, כמו כרטיס שנפלט ממכונה.', accent: '#FFD700', Effect: E17 },
  { id: 18, cat: 'פיזיקה/תנועה', name: 'זום דרך', sub: 'Zoom-Through Reveal', desc: 'הכרטיס מתחיל גדול ומטושטש ומתכווץ לחדות מלאה.', accent: '#34d399', Effect: E18 },
  { id: 19, cat: 'טיפוגרפיה', name: 'מכונת כתיבה', sub: 'Typewriter Date/Time', desc: 'התאריך והשעה מוקלדים תו אחר תו עם סמן מהבהב.', accent: '#94a3b8', Effect: E19 },
  { id: 20, cat: 'פיזיקה/תנועה', name: 'פעימת לב', sub: 'Countdown Heartbeat Pulse', desc: 'שבבי הספירה לאחור פועמים ברציפות כמו דופק.', accent: '#f87171', Effect: E20 },
  { id: 21, cat: 'אווירה', name: 'זרקורי אצטדיון', sub: 'Stadium Floodlights', desc: 'שתי קרני אור מתכנסות מהצדדים לפני שהכרטיס נחשף במרכז.', accent: '#FFD700', Effect: E21 },
  { id: 22, cat: 'טיפוגרפיה', name: 'ציור מתאר', sub: 'Sketch Draw-In', desc: 'מסגרת מצוירת נבנית סביב הכרטיס כמו קו שרטוט לפני חשיפת התוכן.', accent: '#fbbf24', Effect: E22 },
  { id: 23, cat: 'סטגר', name: 'אדווה גלית', sub: 'Wave Ripple Reveal', desc: 'הרכיבים נכנסים בזה אחר זה עם נטייה קלה, כמו אדווה על מים.', accent: '#2dd4bf', Effect: E23 },
  { id: 24, cat: 'מסך/מסכה', name: 'התפשטות דיו', sub: 'Color Ink Bleed', desc: 'כתם צבע עגול מתרחב ממרכז הכרטיס עד שהוא ממלא אותו.', accent: '#a855f7', Effect: E24 },
  { id: 25, cat: 'טיפוגרפיה', name: 'טיפוגרפיה קינטית', sub: 'Kinetic Typography Countdown', desc: 'הכותרת נכנסת ענקית ומוטה ומתכווצת למקומה, ואז שאר הכרטיס עוקב.', accent: '#f5c518', Effect: E25 },
];

const CATS = ['הכול', 'סטגר', 'תלת-מימד', 'מסך/מסכה', 'טיפוגרפיה', 'אווירה', 'פיזיקה/תנועה'];

/* ── Card ─────────────────────────────────────────────────────────────── */
function DesignCard({ d, isSelected, onSelect }) {
  const { Effect } = d;
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: isSelected ? `2px solid ${d.accent}` : '2px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        boxShadow: isSelected ? `0 0 24px ${d.accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      <div style={{ height: 190, position: 'relative', background: 'linear-gradient(160deg,#050d1a,#0d1a2e)', overflow: 'hidden' }}>
        <LoopStage>
          <Effect accent={d.accent} />
        </LoopStage>
        {isSelected && (
          <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: '50%', background: d.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <span style={{ color: '#000', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 999, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{d.id}</div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{d.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{d.sub}</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 4, lineHeight: 1.5 }}>{d.desc}</div>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function AdminNextMatchDesignsDemo() {
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState('הכול');

  const visible = cat === 'הכול' ? DESIGNS : DESIGNS.filter((d) => d.cat === cat);
  const selectedDesign = DESIGNS.find((d) => d.id === selected);

  return (
    <div dir="rtl" style={{ color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>25 אפקטים — הצגת המשחק הבא</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {selectedDesign ? `✓ נבחר: ${selectedDesign.name} (${selectedDesign.sub})` : 'כל תצוגה חוזרת על עצמה בלולאה — משווים בין אפקטי הכניסה של הרכיבים'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATS.map((c) => {
          const count = c === 'הכול' ? DESIGNS.length : DESIGNS.filter((d) => d.cat === c).length;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.18)', background: cat === c ? '#FFD700' : 'rgba(255,255,255,0.06)', color: cat === c ? '#000' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {visible.map((d) => (
          <DesignCard key={d.id} d={d} isSelected={selected === d.id} onSelect={() => setSelected(selected === d.id ? null : d.id)} />
        ))}
      </div>
    </div>
  );
}
