import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// The round page's first-time tour: a few short steps, each lighting up one part of the real page (the
// rest dims) with a small card that says what it is. It can't be closed half way — it's short — and once
// finished it doesn't come back (localStorage). Targets are found by their data-tour attribute.

export const ROUND_TOUR_KEY = 'tour_round_v1';

// each step: a title, a short subtitle, and rows — a coloured key (in the colour it has in the app) and
// what it means, one per line
const Y = '#facc15', G = '#4ade80', GREY = '#94a3b8', BLUE = '#60a5fa', W = '#e2e8f0';
const STEPS = [
  { target: 'strip', radius: 18, pad: 4, title: 'משחקי המחזור', subtitle: 'צבע הטבעת מציין את מצב הניחוש', rows: [
    { key: 'צהוב', color: Y, ring: true, text: 'ממתין לניחוש שלך' },
    { key: 'ירוק', color: G, ring: true, text: 'הניחוש נקלט' },
    { key: 'אפור', color: GREY, ring: true, text: 'המשחק נעול לניחושים' },
  ] },
  { target: 'card', radius: 20, pad: 4, swipe: true, title: 'מעבר בין משחקים', subtitle: 'ניווט בין משחקי המחזור', rows: [
    { key: 'החלקה', color: W, text: 'החלקת הכרטיס לצדדים עוברת למשחק הבא או הקודם' },
    { key: 'לחיצה', color: W, text: 'לחיצה על משחק בפס מציגה אותו מיד' },
  ] },
  { target: 'score', radius: 18, pad: 8, title: 'הניחוש שלך', subtitle: 'הזנת תוצאת המשחק', rows: [
    { key: 'חצים', color: Y, text: 'קביעת מספר השערים לכל קבוצה' },
    { key: 'בחר עבורי', color: G, text: 'הצעת תוצאה אוטומטית' },
  ] },
  { target: 'actions', radius: 18, pad: 6, title: 'לפני שמנחשים', subtitle: 'מידע שיעזור לך לנחש', rows: [
    { key: '1X2', color: BLUE, ltr: true, text: 'ניקוד, יחסים ושווי כל סוג הימור' },
    { key: 'זירת המשחק', color: Y, text: 'תחזית, טבלה, פורמה ונתונים נוספים' },
    { key: 'BETS', color: G, ltr: true, text: 'ניחושי כל המשתתפים – נחשפים עם נעילת המשחק' },
  ] },
  { target: 'bottom', radius: 18, pad: 2, title: 'שליחת הניחושים', subtitle: 'מעקב והגשה', rows: [
    { key: 'מונה', color: Y, text: 'מספר המשחקים שניחשת מתוך המחזור' },
    { key: 'שליחה', color: G, text: 'הגשת הניחושים בסיום' },
  ] },
];

const rectOf = (name) => {
  const el = document.querySelector(`[data-tour="${name}"]`);
  return el ? el.getBoundingClientRect() : null;
};

export default function RoundTour({ onDone }) {
  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  // bring the step's part into view, then follow it (it can move: animations, scrolling)
  React.useEffect(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el && step.target !== 'bottom' && step.target !== 'strip') el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let raf = 0;
    const tick = () => { const r = rectOf(step.target); if (r) setRect((p) => (p && Math.abs(p.top - r.top) < 0.5 && Math.abs(p.left - r.left) < 0.5 && Math.abs(p.width - r.width) < 0.5 && Math.abs(p.height - r.height) < 0.5 ? p : { top: r.top, left: r.left, width: r.width, height: r.height })); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [i]);

  if (!rect) return null;
  const pad = step.pad;
  const box = { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 };
  const vh = window.innerHeight, vw = window.innerWidth;
  const cardW = Math.min(340, vw - 32);
  const below = box.top + box.height + 230 < vh; // room for the card under the lit part?
  const cardTop = below ? box.top + box.height + 12 : Math.max(12, box.top - 12);
  const finish = () => { try { localStorage.setItem(ROUND_TOUR_KEY, 'done'); } catch {} onDone?.(); };

  return createPortal(
    <div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: 120 }} onClick={(e) => e.stopPropagation()}>
      {/* the dimmed page with a lit hole on the step's part */}
      <motion.div
        initial={false}
        animate={{ top: box.top, left: box.left, width: box.width, height: box.height, borderRadius: step.radius }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        style={{ position: 'fixed', boxShadow: '0 0 0 9999px rgba(2,6,23,0.8)', outline: '1.5px solid rgba(250,204,21,0.75)', outlineOffset: 0, pointerEvents: 'none' }}
      />
      {/* a hand showing the swipe */}
      {step.swipe && (
        <motion.span
          key={`hand-${i}`}
          animate={{ x: [40, -40, 40], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'fixed', top: box.top + box.height / 2 - 18, left: box.left + box.width / 2 - 16, fontSize: 32, pointerEvents: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.6))' }}
        >👆</motion.span>
      )}
      {/* the card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: below ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'fixed', left: (vw - cardW) / 2, width: cardW,
            ...(below ? { top: cardTop } : { bottom: vh - cardTop }),
            padding: '14px 16px 12px', borderRadius: 18, color: '#fff',
            background: 'linear-gradient(170deg,#16295a,#0b1426 80%)', border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          <div className="flex items-center justify-between">
            <span style={{ font: '800 16px Outfit, system-ui' }}>{step.title}</span>
            <span dir="ltr" style={{ font: '900 12px var(--num-font)', color: '#facc15', letterSpacing: '.06em' }}>{i + 1}/{STEPS.length}</span>
          </div>
          <div style={{ font: '600 12px Outfit, system-ui', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{step.subtitle}</div>
          <div style={{ height: 1, margin: '10px 0 8px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 10, rowGap: 7, alignItems: 'center' }}>
            {step.rows.map((row) => (
              <React.Fragment key={row.key}>
                <span className="flex items-center gap-1.5" style={{ whiteSpace: 'nowrap' }}>
                  {row.ring
                    ? <span style={{ width: 11, height: 11, borderRadius: '50%', border: `2.5px solid ${row.color}`, boxShadow: `0 0 6px ${row.color}66` }} />
                    : <span style={{ width: 4, height: 14, borderRadius: 2, background: row.color }} />}
                  <span dir={row.ltr ? 'ltr' : undefined} style={{ font: row.ltr ? '900 14px var(--num-font)' : '800 13px Outfit, system-ui', letterSpacing: row.ltr ? '.06em' : 0, color: row.color }}>{row.key}</span>
                </span>
                <span style={{ font: '500 12.5px/1.45 Outfit, system-ui', color: 'rgba(255,255,255,0.85)' }}>{row.text}</span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            <div className="flex gap-1.5">
              {STEPS.map((_, k) => <span key={k} style={{ width: k === i ? 16 : 6, height: 6, borderRadius: 3, background: k <= i ? '#facc15' : 'rgba(255,255,255,0.22)', transition: 'all .25s' }} />)}
            </div>
            <div className="flex gap-2">
              {i > 0 && (
                <button type="button" onClick={() => setI(i - 1)} style={{ padding: '7px 12px', borderRadius: 12, font: '700 12px Outfit, system-ui', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.08)' }}>הקודם</button>
              )}
              <button type="button" onClick={() => (last ? finish() : setI(i + 1))} style={{ padding: '7px 16px', borderRadius: 12, font: '800 12px Outfit, system-ui', color: '#1a1405', background: 'linear-gradient(135deg,#fde047,#eab308)' }}>
                {last ? 'יאללה, מתחילים' : 'הבא'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
}
