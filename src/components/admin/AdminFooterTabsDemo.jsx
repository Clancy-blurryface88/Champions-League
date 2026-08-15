import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Target, Users } from 'lucide-react';

// Demo-only: 25 alternative designs for the two-button footer bar on each
// match card in Predictions.jsx — "1 X 2" (opens MatchScoringRulesModal) /
// "ניחושים" (opens MatchPredictionsModal). Mock context, self-contained,
// replayable. Doesn't touch Predictions.jsx.

const LABELS = ['1 X 2', 'ניחושים'];
const CARD_BG = '#0b1526';

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

// local "which button is active" state, per variant instance
function useActive(initial = 0) {
  const [active, setActive] = useState(initial);
  return [active, setActive];
}

// Mock match-card sliver — a plausible header (team names + kickoff time)
// sitting above the footer bar under test, same proportions as the real card.
function CardSliver({ children, width = 320 }) {
  return (
    <div style={{ width, borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: CARD_BG, boxShadow: '0 10px 26px rgba(0,0,0,0.4)' }}>
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ color: '#e2e8f0', fontSize: 11.5, fontWeight: 700 }}>ריאל מדריד</span>
        <span style={{ color: '#64748b', fontSize: 10.5, fontWeight: 600 }}>20:45</span>
        <span style={{ color: '#e2e8f0', fontSize: 11.5, fontWeight: 700 }}>ליברפול</span>
      </div>
      {children}
    </div>
  );
}

// ================= Group A — Baseline + segmented controls (1-5) =================

// 1. Baseline — the real current style exactly
function V1() {
  return (
    <CardSliver>
      <div className="flex items-center">
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>1 X 2</button>
        <div className="w-px my-2.5" style={{ background: 'rgba(255,255,255,0.14)' }} />
        <button className="flex-1 flex items-center justify-center py-3 text-xs font-bold transition-colors" style={{ color: 'rgba(255,255,255,0.75)' }}>ניחושים</button>
      </div>
    </CardSliver>
  );
}

// 2. Pill segmented control — sliding indicator behind the active label
function V2() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ padding: 10 }}>
        <div style={{ position: 'relative', display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: 4 }}>
          <motion.div
            style={{ position: 'absolute', top: 4, bottom: 4, width: 'calc(50% - 6px)', borderRadius: 999, background: 'linear-gradient(135deg,#7cadee,#097adc)' }}
            animate={{ left: active === 0 ? 4 : 'calc(50% + 2px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
          {LABELS.map((label, i) => (
            <button key={label} onClick={() => setActive(i)} style={{ position: 'relative', zIndex: 1, flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// 3. Underline tabs — animated underline slides between labels (material-tabs)
function V3() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', position: 'relative' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.55)', textAlign: 'center' }}>
            {label}
          </button>
        ))}
        <motion.div
          style={{ position: 'absolute', bottom: 0, height: 2, width: '50%', background: 'linear-gradient(90deg,#7cadee,#097adc)', borderRadius: 2 }}
          animate={{ left: active === 0 ? '0%' : '50%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      </div>
    </CardSliver>
  );
}

// 4. Frosted-glass segmented control — same sliding mechanic, heavy backdrop-blur
function V4() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ padding: 10 }}>
        <div style={{ position: 'relative', display: 'flex', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 999, padding: 4, backdropFilter: 'blur(14px) saturate(1.4)', WebkitBackdropFilter: 'blur(14px) saturate(1.4)' }}>
          <motion.div
            style={{ position: 'absolute', top: 4, bottom: 4, width: 'calc(50% - 6px)', borderRadius: 999, background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            animate={{ left: active === 0 ? 4 : 'calc(50% + 2px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
          {LABELS.map((label, i) => (
            <button key={label} onClick={() => setActive(i)} style={{ position: 'relative', zIndex: 1, flex: 1, padding: '9px 0', fontSize: 12, fontWeight: 700, color: '#fff', textAlign: 'center' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// 5. Toggle-switch style — iOS-style track, handle slides to the active side
function V5() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ padding: 14, display: 'flex', justifyContent: 'center' }}>
        <div onClick={() => setActive(active === 0 ? 1 : 0)} style={{ position: 'relative', width: 180, height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <motion.div
            style={{ position: 'absolute', top: 3, bottom: 3, width: 'calc(50% - 3px)', borderRadius: 999, background: 'linear-gradient(135deg,#f2b84b,#d97706)' }}
            animate={{ left: active === 0 ? 3 : 'calc(50% + 0px)' }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
          {LABELS.map((label, i) => (
            <span key={label} style={{ position: 'relative', flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 800, color: active === i ? '#1a1206' : 'rgba(255,255,255,0.55)' }}>{label}</span>
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// ================= Group B — Color/shape treatments (6-10) =================

// 6. Split dual-tone halves — static color-coded halves, sharp center divider
function V6() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: i === 0 ? 'rgba(124,173,238,0.16)' : 'rgba(52,211,153,0.16)', color: active === i ? '#fff' : (i === 0 ? '#9dc2f5' : '#7fe4bd'), borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none', outline: active === i ? `2px solid ${i === 0 ? '#7cadee' : '#34d399'}` : 'none', outlineOffset: -2 }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 7. Diagonal-cut split — angled chevron divider instead of a straight line
function V7() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ position: 'relative', height: 48, display: 'flex' }}>
        <button onClick={() => setActive(0)} style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)', background: active === 0 ? 'linear-gradient(135deg,#7cadee,#097adc)' : 'rgba(124,173,238,0.14)', color: active === 0 ? '#fff' : '#9dc2f5', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInlineEnd: '30%' }}>1 X 2</button>
        <button onClick={() => setActive(1)} style={{ position: 'absolute', inset: 0, clipPath: 'polygon(58% 0, 100% 0, 100% 100%, 42% 100%)', background: active === 1 ? 'linear-gradient(135deg,#34d399,#059669)' : 'rgba(52,211,153,0.14)', color: active === 1 ? '#fff' : '#7fe4bd', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInlineStart: '30%' }}>ניחושים</button>
      </div>
    </CardSliver>
  );
}

// 8. Gold/blue dual-tone — this app's stadium blue/gold palette
function V8() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setActive(0)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: 'rgba(242,184,75,0.14)', color: active === 0 ? '#fff' : '#f2c876', borderInlineEnd: '1px solid rgba(255,255,255,0.1)', outline: active === 0 ? '2px solid #f2b84b' : 'none', outlineOffset: -2 }}>1 X 2</button>
        <button onClick={() => setActive(1)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: 'rgba(124,173,238,0.14)', color: active === 1 ? '#fff' : '#9dc2f5', outline: active === 1 ? '2px solid #7cadee' : 'none', outlineOffset: -2 }}>ניחושים</button>
      </div>
    </CardSliver>
  );
}

// 9. Home/away color-coded — this app's home-green / away-blue convention
function V9() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setActive(0)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: 'rgba(52,211,153,0.14)', color: active === 0 ? '#fff' : '#7fe4bd', borderInlineEnd: '1px solid rgba(255,255,255,0.1)', outline: active === 0 ? '2px solid #34d399' : 'none', outlineOffset: -2 }}>1 X 2</button>
        <button onClick={() => setActive(1)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: 'rgba(96,165,250,0.14)', color: active === 1 ? '#fff' : '#a9c8fb', outline: active === 1 ? '2px solid #60a5fa' : 'none', outlineOffset: -2 }}>ניחושים</button>
      </div>
    </CardSliver>
  );
}

// 10. Gradient-sweep active state — animated shimmer plays across the active button
function V10() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: 'rgba(255,255,255,0.05)', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            {active === i && (
              <motion.div
                style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(100deg, transparent 20%, rgba(124,173,238,0.55) 45%, rgba(255,255,255,0.8) 50%, rgba(124,173,238,0.55) 55%, transparent 80%)', backgroundSize: '250% 100%' }}
                animate={{ backgroundPosition: ['150% 0%', '-50% 0%'] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <span style={{ position: 'relative' }}>{label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// ================= Group C — Shape/layout alternatives (11-15) =================

// 11. Two separate rounded pill buttons with a gap (not a joined bar)
function V11() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '10px 0', borderRadius: 999, fontSize: 12, fontWeight: 800, textAlign: 'center', background: active === i ? 'linear-gradient(135deg,#7cadee,#097adc)' : 'rgba(255,255,255,0.06)', color: active === i ? '#fff' : 'rgba(255,255,255,0.6)', border: active === i ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 12. Stacked icon-above-label buttons
function V12() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Target }, { label: 'ניחושים', Icon: Users }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 0', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <it.Icon className="w-4 h-4" style={{ color: active === i ? '#7cadee' : 'currentColor' }} />
            <span style={{ fontSize: 10.5, fontWeight: 700 }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 13. Circular dual-button — two overlapping circular icon buttons
function V13() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Target }, { label: 'ניחושים', Icon: Users }];
  return (
    <CardSliver>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 14 }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} title={it.label} style={{ width: 48, height: 48, borderRadius: '50%', marginInlineStart: i === 1 ? -10 : 0, zIndex: active === i ? 2 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active === i ? 'linear-gradient(135deg,#7cadee,#097adc)' : '#1b2333', border: '2px solid #0b1526', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', boxShadow: active === i ? '0 4px 14px rgba(9,122,220,0.5)' : 'none' }}>
            <it.Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 14. Vertical stack — the two options stacked as two rows
function V14() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ padding: '11px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)', background: active === i ? 'rgba(124,173,238,0.14)' : 'transparent', borderTop: i === 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 15. Ticket-stub divider — perforated dashed line with semi-circle notches
function V15() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.6)' }}>
            {label}
          </button>
        ))}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, transform: 'translateX(-50%)', borderLeft: '2px dashed rgba(255,255,255,0.25)' }} />
        <div style={{ position: 'absolute', left: '50%', top: -7, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: CARD_BG }} />
        <div style={{ position: 'absolute', left: '50%', bottom: -7, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: CARD_BG }} />
      </div>
    </CardSliver>
  );
}

// ================= Group D — Motion/interaction-forward (16-20) =================

// 16. Expanding-emphasis buttons — the active one grows, the other shrinks
function V16() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', height: 48 }}>
        {LABELS.map((label, i) => (
          <motion.button
            key={label}
            onClick={() => setActive(i)}
            animate={{ flexGrow: active === i ? 1.6 : 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            style={{ flexBasis: 0, minWidth: 0, fontSize: active === i ? 12.5 : 11, fontWeight: 800, color: active === i ? '#fff' : 'rgba(255,255,255,0.45)', background: active === i ? 'rgba(124,173,238,0.14)' : 'transparent', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </CardSliver>
  );
}

// 17. Bouncy spring-tap feedback — each tap gets a satisfying scale-squish
function V17() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <motion.button
            key={label}
            onClick={() => setActive(i)}
            whileTap={{ scale: 0.86 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </CardSliver>
  );
}

// 18. Swipeable indicator-dots — one label at a time, carousel-style dots below
function V18() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div onClick={() => setActive(active === 0 ? 1 : 0)} style={{ padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
        <AnimatePresence mode="wait">
          <motion.span key={active} initial={{ opacity: 0, x: active === 0 ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: active === 0 ? 16 : -16 }} transition={{ duration: 0.22 }} style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>
            {LABELS[active]}
          </motion.span>
        </AnimatePresence>
        <div style={{ display: 'flex', gap: 5 }}>
          {LABELS.map((_, i) => (
            <span key={i} style={{ width: active === i ? 14 : 6, height: 6, borderRadius: 3, background: active === i ? '#7cadee' : 'rgba(255,255,255,0.25)', transition: 'all .2s' }} />
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// 19. Badge-counter buttons — each label carries a small numeric badge
function V19() {
  const [active, setActive] = useActive(0);
  const counts = [3, 128];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', fontSize: 12, fontWeight: 800, color: active === i ? '#fff' : 'rgba(255,255,255,0.6)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <span>{label}</span>
            <span style={{ fontSize: 9.5, fontWeight: 800, color: active === i ? '#0b1526' : '#fff', background: active === i ? '#7cadee' : 'rgba(255,255,255,0.15)', borderRadius: 999, padding: '1px 6px', minWidth: 16, textAlign: 'center' }}>{counts[i]}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 20. Ripple-tap buttons — a material ripple expands from the exact tap point
function V20() {
  const [active, setActive] = useActive(0);
  const [ripples, setRipples] = useState({ 0: [], 1: [] });
  const handleClick = (i, e) => {
    setActive(i);
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    const r = { id, x: e.clientX - rect.left, y: e.clientY - rect.top };
    setRipples((prev) => ({ ...prev, [i]: [...prev[i], r] }));
    setTimeout(() => setRipples((prev) => ({ ...prev, [i]: prev[i].filter((rp) => rp.id !== id) })), 600);
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={(e) => handleClick(i, e)} style={{ position: 'relative', overflow: 'hidden', flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.6)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            {ripples[i].map((r) => (
              <motion.span key={r.id} initial={{ width: 0, height: 0, opacity: 0.5 }} animate={{ width: 120, height: 120, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }} style={{ position: 'absolute', left: r.x, top: r.y, marginLeft: -60, marginTop: -60, borderRadius: '50%', background: 'rgba(124,173,238,0.5)', pointerEvents: 'none' }} />
            ))}
            <span style={{ position: 'relative' }}>{label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// ================= Group E — Novelty/polish (21-25) =================

// 21. Neon-outline bar — transparent fill, glowing outline around the bar and the active side
function V21() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex', borderRadius: 12, border: '1px solid rgba(124,173,238,0.5)', boxShadow: '0 0 12px rgba(124,173,238,0.35)', overflow: 'hidden' }}>
          {LABELS.map((label, i) => (
            <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '11px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: 'transparent', color: active === i ? '#7cadee' : 'rgba(255,255,255,0.5)', textShadow: active === i ? '0 0 8px rgba(124,173,238,0.9)' : 'none', boxShadow: active === i ? 'inset 0 0 14px rgba(124,173,238,0.35)' : 'none', borderInlineEnd: i === 0 ? '1px solid rgba(124,173,238,0.3)' : 'none' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// 22. Scoreboard/stadium-LED style — LED-digit font treatment, stadium-light glow
function V22() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', background: '#000' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontFamily: "'Courier New', monospace", letterSpacing: 2, fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#facc15' : '#4a3d0d', textShadow: active === i ? '0 0 6px #facc15, 0 0 14px #facc15' : 'none', borderInlineEnd: i === 0 ? '1px solid #1a1a1a' : 'none' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 23. Minimal text-only, no chrome — active state via color/weight/underline only
function V23() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', padding: '13px 20px', justifyContent: 'space-between' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ fontSize: active === i ? 13 : 12, fontWeight: active === i ? 900 : 500, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)', textDecoration: active === i ? 'underline' : 'none', textUnderlineOffset: 4 }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 24. 3D pressed-button pair — raised at rest, visibly presses in on tap
function V24() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        {LABELS.map((label, i) => (
          <button
            key={label}
            onClick={() => setActive(i)}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 10, fontSize: 12, fontWeight: 800, textAlign: 'center', color: '#e2e8f0', background: '#1b2333',
              boxShadow: active === i ? 'inset 3px 3px 6px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.03)' : '3px 3px 8px rgba(0,0,0,0.4), -2px -2px 6px rgba(255,255,255,0.04)',
              transform: active === i ? 'translateY(1px)' : 'none',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 25. Morphing background blob — a soft blob morphs from behind one label to the other
function V25() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex', padding: 8 }}>
        <motion.div
          style={{ position: 'absolute', top: 8, bottom: 8, width: 'calc(50% - 8px)', background: 'linear-gradient(135deg,#7cadee,#097adc)' }}
          animate={{
            left: active === 0 ? 8 : 'calc(50% + 0px)',
            borderRadius: active === 0 ? '40% 60% 55% 45% / 50% 45% 55% 50%' : '55% 45% 40% 60% / 45% 55% 45% 55%',
          }}
          transition={{ type: 'spring', stiffness: 180, damping: 16 }}
        />
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ position: 'relative', zIndex: 1, flex: 1, padding: '11px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

const GROUPS = [
  { title: 'קבוצה A — בסיס ובקרות מקוטעות (Segmented)', items: [
    ['1. הנוכחי (בסיס להשוואה)', 'הסגנון הקיים בדיוק: טקסט חלק, קו מפריד דק, בלי רקע', V1],
    ['2. בקרה מקוטעת בכדור', 'מיכל כדור מלא-רוחב, אינדיקטור צבעוני גולש בין הלייבלים', V2],
    ['3. טאבים עם קו תחתון', 'לייבלים פשוטים, קו תחתון מונפש נגלש בין הכפתורים (סגנון Material)', V3],
    ['4. בקרה מקוטעת זכוכית קפואה', 'אותה מכניקת החלקה, עם backdrop-blur כבד על המסלול והאינדיקטור', V4],
    ['5. מתג הפעלה בסגנון iOS', 'ידית מתג נעה בין שני קצוות עם לייבל בכל צד', V5],
  ]},
  { title: 'קבוצה B — טיפולי צבע וצורה (6-10)', items: [
    ['6. חצי-חצי דו-גוני', 'חצי שמאלי בגוון אחד, חצי ימני בגוון אחר, קו מפריד חד באמצע', V6],
    ['7. חיתוך אלכסוני', 'שני החצאים נפגשים בקו אלכסוני/שברון במקום קו ישר', V7],
    ['8. דו-גוני זהב/כחול', 'כפתור שמאלי בגוון זהב, ימני בגוון כחול — פלטת האצטדיון של האפליקציה', V8],
    ['9. קידוד צבע בית/חוץ', 'ירוק "בית" מול כחול "חוץ", לפי מוסכמת הצבעים הקיימת באפליקציה', V9],
    ['10. גל גרדיאנט פעיל', 'הכפתור הפעיל מקבל ברק גרדיאנט נע שחולף עליו', V10],
  ]},
  { title: 'קבוצה C — חלופות צורה ופריסה (11-15)', items: [
    ['11. שני כדורים נפרדים', 'שני כפתורי כדור נפרדים זה מזה עם רווח, לא פס אחד מאוחד', V11],
    ['12. אייקון מעל טקסט', 'אייקון קטן למעלה, לייבל טקסט מתחתיו, בכל כפתור', V12],
    ['13. כפתורים עגולים חופפים', 'שני כפתורי אייקון עגולים חופפים במקום פס מלבני', V13],
    ['14. מדורג אנכית', 'שתי האפשרויות מדורגות כשתי שורות במקום זו לצד זו', V14],
    ['15. מפריד כרטיס-קרעים', 'שני החצאים מופרדים בקו מקווקו עם חריצים חצי-עגולים, בסגנון כרטיס קולנוע', V15],
  ]},
  { title: 'קבוצה D — תנועה ואינטראקציה (16-20)', items: [
    ['16. כפתורים מתרחבים בהדגשה', 'לחיצה על כפתור מגדילה אותו ומכווצת את השני', V16],
    ['17. משוב קפיצי בלחיצה', 'כל כפתור מבצע כיווץ-קפיץ נעים בלחיצה (whileTap)', V17],
    ['18. נקודות מחוון החלקה', 'לייבל יחיד מתחלף עם שתי נקודות מחוון מתחתיו, בסגנון קרוסלה', V18],
    ['19. כפתורי תג מספרי', 'כל כפתור מציג תג מספרי קטן (למשל כמות מנחשים) לצד הלייבל', V19],
    ['20. כפתורי אדווה בלחיצה', 'אדווה בסגנון Material מתפשטת מנקודת הלחיצה המדויקת', V20],
  ]},
  { title: 'קבוצה E — נובלטי וליטוש (21-25)', items: [
    ['21. פס מתאר ניאון', 'מילוי שקוף, מתאר זוהר סביב כל הפס וסביב הכפתור הפעיל', V21],
    ['22. סגנון לוח תוצאות LED', 'גופן דיגיטלי בסגנון תצוגת LED, זוהר תאורת אצטדיון', V22],
    ['23. טקסט מינימלי בלי מסגרת', 'בלי מסגרת/רקע/מפריד כלל — המצב הפעיל מובע רק בטיפוגרפיה', V23],
    ['24. זוג כפתורים תלת-ממדי', 'מראה בולט במנוחה, "נלחץ פנימה" עם צל פנימי בלחיצה, כמו כפתור פיזי', V24],
    ['25. כתם רקע נוזלי', 'צורת רקע רכה עוברת (לא רק גולשת) בין הלייבלים בלחיצה, אפקט נוזלי', V25],
  ]},
];

export default function AdminFooterTabsDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 25 עיצובים לשורת הכפתורים התחתונה (1 X 2 / ניחושים)</h2>
        <p className="text-slate-500 text-sm">25 גישות עיצוב לזוג הכפתורים בתחתית כרטיס המשחק בעמוד הניחושים. כולן אינטראקטיביות באמת — לחיצה מציגה מצב פעיל, וחיות עם כפתור "הצג שוב". הקשר כרטיס משחק לדוגמה בלבד — כלי דמו, לא משפיע על Predictions.jsx.</p>
      </div>
      {GROUPS.map((group) => (
        <div key={group.title} className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">{group.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.items.map(([label, desc, Comp]) => (
              <Frame key={label} label={label} desc={desc}>{(k) => <Comp key={k} />}</Frame>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
