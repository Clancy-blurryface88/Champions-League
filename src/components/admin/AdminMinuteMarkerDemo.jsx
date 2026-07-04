import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   Demo of idea #1 from the live-card discussion: a small marker riding the
   edge of the minute-progress ring, like a clock hand tip — so the ring
   reads as an actual "match clock," not just decoration. Each variant loops
   the minute from 0→90 continuously so you can watch the marker travel.

   Shown on a plain circle (not the card's rounded-rect) for a clean, exact
   position calculation — if you like the concept, the real card can either
   adopt a circular ring too, or we approximate the position on the
   rounded-rect border during implementation.
   ────────────────────────────────────────────────────────────────────────── */

function useLoopingMinute(durationMs = 9000) {
  const [minute, setMinute] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = ((now - start) % durationMs) / durationMs;
      setMinute(Math.floor(t * 90));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);
  return minute;
}

const RING_R = 74; // px, radius used for marker placement
const RING_SIZE = 172;

function markerPos(minute) {
  const angle = (minute / 90) * 360 - 90; // -90 so 0° starts at top (12 o'clock)
  const rad = (angle * Math.PI) / 180;
  return {
    x: RING_SIZE / 2 + RING_R * Math.cos(rad),
    y: RING_SIZE / 2 + RING_R * Math.sin(rad),
  };
}

function RingBase({ minute, children }) {
  const progress = minute / 90;
  return (
    <div style={{ position: 'relative', width: RING_SIZE, height: RING_SIZE }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `conic-gradient(from 0deg, #ef4444 ${progress * 360}deg, rgba(255,255,255,0.1) ${progress * 360}deg 360deg)`,
        padding: 4,
      }}>
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#0d1a2e' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ color: '#f87171', fontSize: 10, fontWeight: 900, letterSpacing: 2 }}>LIVE</span>
        <span style={{ color: '#fff', fontWeight: 900, fontSize: 22 }} dir="ltr">1 - 0</span>
      </div>
      {children}
    </div>
  );
}

/* ── A: gold chip riding the edge ─────────────────────────────────────── */
function VariantChip() {
  const minute = useLoopingMinute();
  const { x, y } = markerPos(minute);
  return (
    <RingBase minute={minute}>
      <motion.div
        animate={{ left: x, top: y }}
        transition={{ duration: 0.3, ease: 'linear' }}
        style={{
          position: 'absolute', transform: 'translate(-50%,-50%)',
          background: '#FFD700', color: '#000', fontWeight: 900, fontSize: 11,
          borderRadius: 999, padding: '2px 6px', boxShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 0 2px #0d1a2e',
          whiteSpace: 'nowrap',
        }}
      >
        {minute}'
      </motion.div>
    </RingBase>
  );
}

/* ── B: bare glowing number, no chip ──────────────────────────────────── */
function VariantBareNumber() {
  const minute = useLoopingMinute();
  const { x, y } = markerPos(minute);
  return (
    <RingBase minute={minute}>
      <motion.div
        animate={{ left: x, top: y }}
        transition={{ duration: 0.3, ease: 'linear' }}
        style={{
          position: 'absolute', transform: 'translate(-50%,-50%)',
          color: '#fff', fontWeight: 900, fontSize: 13,
          textShadow: '0 0 6px #ef4444, 0 0 12px #ef4444',
        }}
      >
        {minute}
      </motion.div>
    </RingBase>
  );
}

/* ── C: clock-hand dash + number just outside the ring ────────────────── */
function VariantHand() {
  const minute = useLoopingMinute();
  const angle = (minute / 90) * 360 - 90;
  const { x: dashX, y: dashY } = markerPos(minute);
  const rad = (angle * Math.PI) / 180;
  const labelR = RING_R + 18;
  const labelX = RING_SIZE / 2 + labelR * Math.cos(rad);
  const labelY = RING_SIZE / 2 + labelR * Math.sin(rad);
  return (
    <RingBase minute={minute}>
      <motion.div
        animate={{ left: dashX, top: dashY, rotate: angle + 90 }}
        transition={{ duration: 0.3, ease: 'linear' }}
        style={{ position: 'absolute', transform: 'translate(-50%,-50%)', width: 3, height: 12, borderRadius: 2, background: '#fff', boxShadow: '0 0 4px rgba(0,0,0,0.6)' }}
      />
      <motion.div
        animate={{ left: labelX, top: labelY }}
        transition={{ duration: 0.3, ease: 'linear' }}
        style={{ position: 'absolute', transform: 'translate(-50%,-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: 800 }}
      >
        {minute}'
      </motion.div>
    </RingBase>
  );
}

/* ── D: puck sitting directly on the ring track ───────────────────────── */
function VariantPuck() {
  const minute = useLoopingMinute();
  const { x, y } = markerPos(minute);
  return (
    <RingBase minute={minute}>
      <motion.div
        animate={{ left: x, top: y }}
        transition={{ duration: 0.3, ease: 'linear' }}
        style={{
          position: 'absolute', transform: 'translate(-50%,-50%)',
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
          border: '3px solid #ef4444', boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <span style={{ color: '#111', fontWeight: 900, fontSize: 8 }}>{minute}</span>
      </motion.div>
    </RingBase>
  );
}

const VARIANTS = [
  { id: 'A', name: 'צ׳יפ זהב על הקצה', desc: 'תג זהב קטן שרוכב על קצה הטבעת עם הדקה בפנים — הכי קריא ובולט.', Comp: VariantChip },
  { id: 'B', name: 'מספר חשוף זוהר', desc: 'רק המספר עצמו עם זוהר אדום, בלי רקע — עדין יותר, פחות "מפריע".', Comp: VariantBareNumber },
  { id: 'C', name: 'מחוג שעון + תווית', desc: 'קו קצר כמו מחוג שעון על הטבעת, והמספר יושב קצת מחוץ לה — הכי "שעוני".', Comp: VariantHand },
  { id: 'D', name: 'פאק על המסילה', desc: 'עיגול לבן עם מסגרת אדומה, כמו ידית סליידר שיושבת ממש על מסלול הטבעת.', Comp: VariantPuck },
];

export default function AdminMinuteMarkerDemo() {
  return (
    <div dir="rtl" style={{ color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>סמן דקה על קצה הטבעת</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
          כל וריאציה לולאה על 0→90 דקות ברציפות (9 שניות לסבב) — צפה במספר נוסע סביב הטבעת ומדמה שעון אמיתי.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 20 }}>
        {VARIANTS.map(({ id, name, desc, Comp }) => (
          <div key={id} style={{ background: 'linear-gradient(160deg,#050d1a,#0d1a2e)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '18px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <Comp />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{name}</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
