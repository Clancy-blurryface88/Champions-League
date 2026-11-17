import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

// First-time tours: a few short steps, each lighting up one part of the real page (the rest dims) with a
// small card that says what it is. A tour can't be closed half way — they're short — and once finished it
// doesn't come back (localStorage). Targets are found by their data-tour attribute.
// RoundTour: the round page. WINDOW_TOURS: the 1X2, match arena and BETS windows (shown over an example
// match from an earlier round, with a small "example" badge).

export const ROUND_TOUR_KEY = 'tour_round_v1';

// each step: a title, a short subtitle, and rows — a coloured key (in the colour it has in the app) and
// what it means, one per line
const Y = '#facc15', G = '#4ade80', GREY = '#94a3b8', BLUE = '#60a5fa', W = '#e2e8f0';
const STEPS = [
  { target: 'strip', noScroll: true, radius: 18, pad: 4, title: 'משחקי המחזור', subtitle: 'צבע הטבעת מציין את מצב הניחוש', rows: [
    { key: 'צהוב', color: Y, ring: true, text: 'ממתין לניחוש שלך' },
    { key: 'ירוק', color: G, ring: true, text: 'הניחוש נקלט' },
    { key: 'אפור', color: GREY, ring: true, text: 'המשחק נעול לניחושים' },
  ] },
  { target: 'card', radius: 20, pad: 4, swipe: true, title: 'מעבר בין משחקים', subtitle: 'ניווט בין משחקי המחזור', rows: [
    { key: 'החלקה', color: W, text: 'החלקת הכרטיס לצדדים עוברת למשחק הבא או הקודם' },
    { key: 'לחיצה', color: W, text: 'לחיצה על משחק בפס מציגה אותו מיד' },
  ] },
  { target: 'timer', radius: 16, pad: 6, title: 'זמן לניחוש', subtitle: 'מתחלף בין הספירה למועד המשחק', rows: [
    { key: 'ספירה לאחור', color: Y, text: 'הזמן שנותר עד נעילת הניחושים' },
    { key: 'שעה ותאריך', color: W, text: 'מועד שריקת הפתיחה' },
    { key: 'נעילה', color: GREY, text: '10 דקות לפני תחילת המשחק' },
  ] },
  { target: 'team-info', radius: 12, pad: 8, title: 'הקבוצות', subtitle: 'מתחת לכל סמל: מארחת או אורחת, ומיקום בטבלה', rows: [
    { key: '(Home)', color: W, ltr: true, text: 'הקבוצה המארחת · (Away) – האורחת' },
    { key: 'מיקום', color: W, text: 'המקום של הקבוצה בטבלת הליגה' },
    { key: '1–8', color: G, ltr: true, text: 'ירוק – עולה ישירות לשמינית הגמר' },
    { key: '9–24', color: Y, ltr: true, text: 'צהוב – פלייאוף' },
    { key: '25–36', color: '#f87171', ltr: true, text: 'אדום – מודחת' },
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
  { target: 'bottom', noScroll: true, radius: 18, pad: 2, title: 'שליחת הניחושים', subtitle: 'מעקב והגשה', rows: [
    { key: 'מונה', color: Y, text: 'מספר המשחקים שניחשת מתוך המחזור' },
    { key: 'שליחה', color: G, text: 'הגשת הניחושים בסיום' },
  ] },
];

const rectOf = (name) => {
  const el = document.querySelector(`[data-tour="${name}"]`);
  return el ? el.getBoundingClientRect() : null;
};

export function Tour({ steps, storageKey, onDone, badge, z = 120 }) {
  const [i, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const step = steps[i];
  const last = i === steps.length - 1;

  // bring the step's part into view, then follow it (it can move: animations, scrolling)
  React.useEffect(() => {
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (el && !step.noScroll) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    let raf = 0;
    const tick = () => { const r = rectOf(step.target); if (r) setRect((p) => (p && Math.abs(p.top - r.top) < 0.5 && Math.abs(p.left - r.left) < 0.5 && Math.abs(p.width - r.width) < 0.5 && Math.abs(p.height - r.height) < 0.5 ? p : { top: r.top, left: r.left, width: r.width, height: r.height })); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [i]);

  const pad = step.pad;
  const box = rect
    ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }
    : { top: window.innerHeight * 0.32, left: window.innerWidth / 2, width: 0, height: 0 };
  const vh = window.innerHeight, vw = window.innerWidth;
  const cardW = Math.min(340, vw - 32);
  const below = box.top + box.height + 230 < vh; // room for the card under the lit part?
  const cardTop = below ? box.top + box.height + 12 : Math.max(12, box.top - 12);
  const finish = () => { try { localStorage.setItem(storageKey, 'done'); } catch {} onDone?.(); };

  return createPortal(
    <div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: z }} onClick={(e) => e.stopPropagation()}>
      {badge && (
        <span style={{ position: 'fixed', top: 'max(10px, env(safe-area-inset-top))', left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', borderRadius: 999, font: '800 11px Outfit, system-ui', color: '#1a1405', background: 'linear-gradient(135deg,#fde047,#eab308)', boxShadow: '0 4px 14px rgba(0,0,0,.4)', zIndex: 1 }}>{badge}</span>
      )}
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
            <span dir="ltr" style={{ font: '900 12px var(--num-font)', color: '#facc15', letterSpacing: '.06em' }}>{i + 1}/{steps.length}</span>
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
              {steps.map((_, k) => <span key={k} style={{ width: k === i ? 16 : 6, height: 6, borderRadius: 3, background: k <= i ? '#facc15' : 'rgba(255,255,255,0.22)', transition: 'all .25s' }} />)}
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

export default function RoundTour({ onDone }) {
  return <Tour steps={STEPS} storageKey={ROUND_TOUR_KEY} onDone={onDone} />;
}

// the three windows under each match card
export const WINDOW_TOURS = {
  x12: { key: 'tour_x12_v1', steps: [
    { target: 'x12-tabs', noScroll: true, radius: 12, pad: 6, title: '1X2 – ניקוד ויחסים', subtitle: 'שלוש לשוניות מידע', rows: [
      { key: 'סימולטור', color: Y, text: 'בוחרים תוצאה ורואים כמה נקודות היא שווה' },
      { key: 'יחסים', color: BLUE, text: 'סיכויי המשחק ושווי כל סוג הימור' },
      { key: 'תוצאה מדויקת', color: G, text: 'הסיכוי לכל תוצאה אפשרית' },
    ] },
    { target: 'x12-body', noScroll: true, radius: 16, pad: 4, title: 'סימולטור הניקוד', subtitle: 'חישוב הנקודות לפני הניחוש', rows: [
      { key: 'גלגלים', color: Y, text: 'קביעת תוצאה לכל קבוצה' },
      { key: 'פירוט', color: G, text: 'הנקודות לפי כל רכיב בניחוש' },
    ] },
  ] },
  arena: { key: 'tour_arena_v1', steps: [
    { target: 'arena-tabs', noScroll: true, radius: 12, pad: 6, title: 'זירת המשחק', subtitle: 'כל הנתונים על המשחק', rows: [
      { key: '5 אחרונים', color: W, text: 'התוצאות האחרונות של שתי הקבוצות' },
      { key: 'תחזית', color: Y, text: 'סיכויי ניצחון ותוצאות צפויות' },
      { key: 'ראש בראש', color: BLUE, text: 'המפגשים הקודמים בין הקבוצות' },
      { key: 'הרכבים', color: G, text: 'ההרכבים, כשהם מתפרסמים' },
      { key: 'טבלה', color: GREY, text: 'מיקום הקבוצות בטבלת הליגה' },
    ] },
    { target: 'arena-body', noScroll: true, radius: 16, pad: 4, title: 'התחזית', subtitle: 'סיכויים לפי יחסי ההימורים', rows: [
      { key: 'אחוזים', color: Y, text: 'הסיכוי לניצחון, תיקו או הפסד' },
      { key: 'תוצאות צפויות', color: G, text: 'התוצאות המדויקות הסבירות ביותר' },
    ] },
  ] },
  bets: { key: 'tour_bets_v1', steps: [
    { target: 'bets-cols', noScroll: true, radius: 16, pad: 6, title: 'BETS – ניחושי המשתתפים', subtitle: 'נחשפים עם נעילת המשחק', rows: [
      { key: 'אחוזים', color: Y, text: 'פיזור הניחושים בין 1 / X / 2' },
      { key: 'עמודות', color: G, text: 'כל משתתף מופיע תחת התוצאה שניחש' },
    ] },
    { target: 'bets-row', noScroll: true, radius: 12, pad: 4, title: 'שורת ניחוש', subtitle: 'משתתף אחד והניחוש שלו', rows: [
      { key: 'שם', color: W, text: 'המשתתף' },
      { key: 'תוצאה', color: Y, text: 'התוצאה שניחש' },
    ] },
  ] },
};
