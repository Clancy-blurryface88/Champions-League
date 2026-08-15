import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Target, Users, Dices, ListChecks, Trophy, Goal, Mic, BarChart2, GripVertical, Repeat, Keyboard } from 'lucide-react';

// Demo-only: 75 alternative designs for the two-button footer bar on each
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

// ================= Group F — Typography-led (26-35) =================

// 26. Oversized bold numerals dominating the button, small caption beneath
function V26() {
  const [active, setActive] = useActive(0);
  const items = [
    { label: '1 X 2', caption: 'תוצאת המשחק' },
    { label: 'ניחושים', caption: 'הימור הקהל' },
  ];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '10px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={{ fontSize: 21, fontWeight: 900, letterSpacing: 1, color: active === i ? '#fff' : 'rgba(255,255,255,0.45)' }}>{it.label}</span>
            <span style={{ fontSize: 8.5, fontWeight: 600, color: active === i ? '#7cadee' : 'rgba(255,255,255,0.3)' }}>{it.caption}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 27. Serif newspaper-headline labels with a thin column rule between them
function V27() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', position: 'relative', fontFamily: 'Georgia, "Times New Roman", serif' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 13.5, fontWeight: 700, textAlign: 'center', letterSpacing: 0.3, color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            {label}
          </button>
        ))}
        <div style={{ position: 'absolute', left: '50%', top: 6, bottom: 6, width: 3, transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
          <div style={{ width: 1, height: '100%', background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ width: 1, height: '100%', background: 'rgba(255,255,255,0.15)' }} />
        </div>
      </div>
    </CardSliver>
  );
}

// 28. Monospace terminal-style buttons with a blinking cursor on the active one
function V28() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', background: '#04140a' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, textAlign: 'center', color: active === i ? '#4ade80' : 'rgba(74,222,128,0.35)', borderInlineEnd: i === 0 ? '1px solid rgba(74,222,128,0.15)' : 'none' }}>
            {label}
            {active === i && (
              <motion.span animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }} style={{ marginInlineStart: 4 }}>_</motion.span>
            )}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 29. Handwritten/marker-style treatment for whichever label is currently active
function V29() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', textAlign: 'center', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={active === i ? { fontFamily: "'Segoe Print','Comic Sans MS',cursive", fontSize: 16, color: '#f2b84b', display: 'inline-block', transform: 'rotate(-3deg)' } : { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 30. A vertical rotated category tag running along the center divider
function V30() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>
            {label}
          </button>
        ))}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(-90deg)', background: '#0b1526', padding: '1px 6px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: 1, color: '#7cadee', whiteSpace: 'nowrap' }}>בחר</span>
        </div>
      </div>
    </CardSliver>
  );
}

// 31. Letter-spaced uppercase micro-labels with a tiny caption beneath each
function V31() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', sub: 'תוצאה' }, { label: 'ניחושים', sub: 'קהילה' }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '12px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2.5, color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>{it.label}</span>
            <span style={{ fontSize: 8, fontWeight: 600, letterSpacing: 1, color: active === i ? '#7cadee' : 'rgba(255,255,255,0.25)' }}>{it.sub}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 32. Kinetic type — the active label's letters spring in individually, staggered
function V32() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', textAlign: 'center', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={{ display: 'inline-flex' }}>
              {label.split('').map((ch, ci) => (
                <motion.span key={active + '-' + ci} initial={{ y: active === i ? -10 : 0, opacity: active === i ? 0 : 1 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: active === i ? ci * 0.03 : 0, type: 'spring', stiffness: 500, damping: 20 }} style={{ fontSize: 12, fontWeight: 800, color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', display: 'inline-block' }}>
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 33. Gradient-fill text labels with zero background chrome
function V33() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', padding: '14px 20px', justifyContent: 'space-between' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={active === i ? { fontSize: 14, fontWeight: 900, backgroundImage: 'linear-gradient(135deg,#f2b84b,#7cadee)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' } : { fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 34. Engraved/embossed drop-shadow text, letterpress feel
function V34() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', background: '#101a2c' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12.5, fontWeight: 800, textAlign: 'center', color: active === i ? '#3a4a66' : '#1b2740', textShadow: active === i ? '0 1px 0 rgba(255,255,255,0.12), 0 -1px 1px rgba(0,0,0,0.6)' : '0 1px 0 rgba(255,255,255,0.05)', borderInlineEnd: i === 0 ? '1px solid rgba(0,0,0,0.4)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 35. A tiny marquee-scrolling micro-ticker sits inside each button
function V35() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '10px 0 6px', textAlign: 'center', overflow: 'hidden', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>{label}</div>
            <div style={{ overflow: 'hidden', marginTop: 3, height: 9 }}>
              <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', width: '200%' }}>
                <span style={{ flex: '0 0 50%', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>עדכון חי · עדכון חי · עדכון חי ·</span>
                <span style={{ flex: '0 0 50%', fontSize: 7.5, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>עדכון חי · עדכון חי · עדכון חי ·</span>
              </motion.div>
            </div>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// ================= Group G — Iconography-driven (36-45) =================

// 36. Icon-only buttons — label appears as a tooltip on hover/press
function V36() {
  const [active, setActive] = useActive(null);
  const [hover, setHover] = useState(null);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ display: 'flex', padding: 10, gap: 8, justifyContent: 'center' }}>
        {items.map((it, i) => (
          <div key={it.label} style={{ position: 'relative' }} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <AnimatePresence>
              {hover === i && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6, background: '#1b2333', color: '#fff', fontSize: 9, fontWeight: 700, padding: '3px 7px', borderRadius: 6, whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {it.label}
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={() => setActive(i)} style={{ width: 46, height: 46, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active === i ? 'linear-gradient(135deg,#7cadee,#097adc)' : 'rgba(255,255,255,0.06)', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>
              <it.Icon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </CardSliver>
  );
}

// 37. Icon-in-circle-badge + text-pill combo — icon and label as two distinct chips
function V37() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 4px', borderRadius: 999, background: active === i ? 'rgba(124,173,238,0.14)' : 'rgba(255,255,255,0.05)', border: active === i ? '1px solid rgba(124,173,238,0.4)' : '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: active === i ? 'linear-gradient(135deg,#7cadee,#097adc)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <it.Icon className="w-3.5 h-3.5" style={{ color: '#fff' }} />
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 38. The icon's shape morphs (rotate + reshape its badge) when its button is tapped
function V38() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <motion.div animate={{ borderRadius: active === i ? '50%' : '30%', rotate: active === i ? 90 : 0, background: active === i ? 'rgba(124,173,238,0.22)' : 'rgba(255,255,255,0.06)' }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <it.Icon className="w-4 h-4" style={{ color: active === i ? '#7cadee' : 'rgba(255,255,255,0.5)', transform: active === i ? 'rotate(-90deg)' : 'none' }} />
            </motion.div>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 39. A dual-icon toggle switch — icons anchored at each end of a sliding track
function V39() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ padding: 14, display: 'flex', justifyContent: 'center' }}>
        <div onClick={() => setActive(active === 0 ? 1 : 0)} style={{ position: 'relative', width: 150, height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
          <motion.div animate={{ left: active === 0 ? 3 : 'calc(100% - 31px)' }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} style={{ position: 'absolute', top: 3, width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#7cadee,#097adc)' }} />
          {items.map((it, i) => (
            <it.Icon key={it.label} className="w-4 h-4" style={{ position: 'relative', zIndex: 1, color: active === i ? '#fff' : 'rgba(255,255,255,0.45)' }} />
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// 40. Icon with a thin circular progress ring drawn around it
function V40() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  const R = 15, C = 2 * Math.PI * R;
  return (
    <CardSliver>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, padding: 12 }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ position: 'relative', width: 40, height: 40 }}>
            <svg width="40" height="40" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
              <circle cx="20" cy="20" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
              <motion.circle cx="20" cy="20" r={R} fill="none" stroke="#7cadee" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} animate={{ strokeDashoffset: active === i ? 0 : C }} transition={{ duration: 0.5 }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <it.Icon className="w-4 h-4" style={{ color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }} />
            </div>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 41. Outlined icon fills solid (stroke to fill) when its button becomes active
function V41() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '11px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <it.Icon className="w-5 h-5" strokeWidth={active === i ? 0 : 1.6} fill={active === i ? '#7cadee' : 'none'} style={{ color: active === i ? '#7cadee' : 'rgba(255,255,255,0.5)', transition: 'all .25s' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 42. Icon does a small bounce/wiggle micro-animation as tap feedback
function V42() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <motion.button key={it.label} onClick={() => setActive(i)} whileTap={{ rotate: [0, -12, 10, -6, 0], scale: [1, 1.15, 1] }} transition={{ duration: 0.45 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '11px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <it.Icon className="w-5 h-5" style={{ color: active === i ? '#7cadee' : 'rgba(255,255,255,0.5)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{it.label}</span>
          </motion.button>
        ))}
      </div>
    </CardSliver>
  );
}

// 43. Icon paired with a tiny inline bar-chart glyph hinting at underlying stats
function V43() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Dices }, { label: 'ניחושים', Icon: ListChecks }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <it.Icon className="w-4 h-4" style={{ color: active === i ? '#7cadee' : 'rgba(255,255,255,0.5)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>{it.label}</span>
            <BarChart2 className="w-3 h-3" style={{ color: active === i ? '#f2b84b' : 'rgba(255,255,255,0.25)' }} />
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 44. A small football icon visually rolls from one button to the other on switch
function V44() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            {label}
          </button>
        ))}
        <motion.div animate={{ left: active === 0 ? '22%' : '72%', rotate: active === 0 ? 0 : 360 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} style={{ position: 'absolute', top: -6, width: 12, height: 12, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fff, #cbd5e1 60%, #64748b)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
      </div>
    </CardSliver>
  );
}

// 45. Trophy icon / goal icon pairing — football-themed iconography for the two actions
function V45() {
  const [active, setActive] = useActive(0);
  const items = [{ label: '1 X 2', Icon: Trophy }, { label: 'ניחושים', Icon: Goal }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '11px 0', background: active === i ? 'rgba(242,184,75,0.1)' : 'transparent', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <it.Icon className="w-4 h-4" style={{ color: active === i ? '#f2b84b' : 'rgba(255,255,255,0.5)' }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)' }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// ================= Group H — Stadium/sports theming (46-55) =================

// 46. Split-flap/departure-board style — each press flips the label like a station board
function V46() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, perspective: '300px', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active === i ? 'on' : 'off'} initial={{ rotateX: -90 }} animate={{ rotateX: 0 }} exit={{ rotateX: 90 }} transition={{ duration: 0.35 }} style={{ padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', background: active === i ? '#1b2333' : 'transparent', color: active === i ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                {label}
              </motion.div>
            </AnimatePresence>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 47. A stadium-floodlight beam visually sweeps onto whichever button is active
function V47() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex', overflow: 'hidden' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, position: 'relative', padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.45)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', overflow: 'hidden' }}>
            {active === i && (
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'absolute', top: -20, left: '50%', width: 70, height: 70, marginLeft: -35, background: 'radial-gradient(circle, rgba(255,255,255,0.35), transparent 70%)', pointerEvents: 'none' }} />
            )}
            <span style={{ position: 'relative' }}>{label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 48. Grass-texture background with a chalk-line style divider
function V48() {
  const [active, setActive] = useActive(0);
  const grass = 'repeating-linear-gradient(90deg, #1a5c2e 0px, #1a5c2e 10px, #1e6b34 10px, #1e6b34 20px)';
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex', background: grass }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.6)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
            {label}
          </button>
        ))}
        <div style={{ position: 'absolute', left: '50%', top: 6, bottom: 6, borderLeft: '2px dashed rgba(255,255,255,0.7)', transform: 'translateX(-50%)' }} />
      </div>
    </CardSliver>
  );
}

// 49. Referee-card silhouette pair — yellow/red card shapes as the two buttons
function V49() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 8, padding: 12, justifyContent: 'center' }}>
        <button onClick={() => setActive(0)} style={{ width: 60, height: 40, borderRadius: 4, background: '#eab308', transform: active === 0 ? 'rotate(-4deg) scale(1.05)' : 'rotate(-4deg)', boxShadow: active === 0 ? '0 4px 12px rgba(234,179,8,0.5)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 800, color: '#1a1206' }}>1 X 2</button>
        <button onClick={() => setActive(1)} style={{ width: 60, height: 40, borderRadius: 4, background: '#dc2626', transform: active === 1 ? 'rotate(4deg) scale(1.05)' : 'rotate(4deg)', boxShadow: active === 1 ? '0 4px 12px rgba(220,38,38,0.5)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 800, color: '#fff' }}>ניחושים</button>
      </div>
    </CardSliver>
  );
}

// 50. Bold jersey-number-style numerals styling the button content
function V50() {
  const [active, setActive] = useActive(0);
  const items = [{ n: '1', label: '1 X 2' }, { n: '2', label: 'ניחושים' }];
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <span style={{ fontSize: 24, fontWeight: 900, fontStyle: 'italic', WebkitTextStroke: active === i ? '1.5px #7cadee' : '1.5px rgba(255,255,255,0.3)', color: active === i ? 'rgba(124,173,238,0.25)' : 'transparent', lineHeight: 1 }}>{it.n}</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)', marginTop: 2 }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 51. Locker-room nameplate engraved-metal look for each button
function V51() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, position: 'relative', padding: '12px 0', borderRadius: 6, textAlign: 'center', fontSize: 11.5, fontWeight: 800, letterSpacing: 1, background: active === i ? 'linear-gradient(160deg,#c9ced6,#8b93a1 45%,#6b7280)' : 'linear-gradient(160deg,#3a4252,#262d3a)', color: active === i ? '#1a1f29' : 'rgba(255,255,255,0.4)', textShadow: active === i ? '0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.3)' : 'none', border: '1px solid rgba(0,0,0,0.3)' }}>
            <span style={{ position: 'absolute', top: 3, left: 4, width: 3, height: 3, borderRadius: '50%', background: 'rgba(0,0,0,0.4)' }} />
            <span style={{ position: 'absolute', top: 3, right: 4, width: 3, height: 3, borderRadius: '50%', background: 'rgba(0,0,0,0.4)' }} />
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 52. An elaborated match-day ticket-stub pair — barcode strip and small print
function V52() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 6px', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>
            <span style={{ fontSize: 11.5, fontWeight: 800 }}>{label}</span>
            <div style={{ display: 'flex', gap: 1, height: 8 }}>
              {Array.from({ length: 12 }).map((_, bi) => (
                <span key={bi} style={{ width: bi % 3 === 0 ? 2 : 1, background: 'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
            <span style={{ fontSize: 6.5, color: 'rgba(255,255,255,0.25)', letterSpacing: 0.5 }}>GATE {i + 1}A · SEC 12</span>
          </button>
        ))}
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, transform: 'translateX(-50%)', borderLeft: '2px dashed rgba(255,255,255,0.2)' }} />
        <div style={{ position: 'absolute', left: '50%', top: -7, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: CARD_BG }} />
        <div style={{ position: 'absolute', left: '50%', bottom: -7, transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: CARD_BG }} />
      </div>
    </CardSliver>
  );
}

// 53. A VAR-review style scanning-line sweeps across whichever button was tapped
function V53() {
  const [active, setActive] = useActive(0);
  const [scan, setScan] = useState(null);
  const handle = (i) => { setActive(i); setScan(i); setTimeout(() => setScan(null), 500); };
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => handle(i)} style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {scan === i && (
              <motion.div initial={{ top: '-20%' }} animate={{ top: '120%' }} transition={{ duration: 0.5, ease: 'linear' }} style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
            )}
            <span style={{ position: 'relative' }}>{label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 54. Substitution-board LED-digit style numerals/labels
function V54() {
  const [active, setActive] = useActive(0);
  const items = [{ n: '1', label: '1 X 2' }, { n: '2', label: 'ניחושים' }];
  return (
    <CardSliver>
      <div style={{ display: 'flex', background: '#111' }}>
        {items.map((it, i) => (
          <button key={it.label} onClick={() => setActive(i)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 0', borderInlineEnd: i === 0 ? '1px solid #222' : 'none' }}>
            <span style={{ width: 22, height: 26, borderRadius: 3, background: active === i ? '#dc2626' : '#2a1414', color: active === i ? '#fff' : '#5c2626', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Courier New', monospace" }}>{it.n}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: active === i ? '#4ade80' : '#1e4d2e' }}>{it.label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 55. A championship-belt plate shape as the center divider between the two buttons
function V55() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            {label}
          </button>
        ))}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fde68a, #d4a017 55%, #92650a)', border: '2px solid #fde68a', boxShadow: '0 2px 6px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Trophy className="w-3.5 h-3.5" style={{ color: '#5c3d0a' }} />
        </div>
      </div>
    </CardSliver>
  );
}

// ================= Group I — Accessibility/utility-first (56-65) =================

// 56. High-contrast, extra-large tap-target buttons
function V56() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 2 }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '20px 0', fontSize: 15, fontWeight: 900, textAlign: 'center', background: active === i ? '#fff' : '#000', color: active === i ? '#000' : '#fff', border: '2px solid #fff' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 57. Radio-group semantics with a visible, theme-colored focus ring for keyboard users
function V57() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div role="radiogroup" aria-label="בחירת פעולה" style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button
            key={label}
            role="radio"
            aria-checked={active === i}
            onClick={() => setActive(i)}
            onFocus={(e) => { e.currentTarget.style.boxShadow = 'inset 0 0 0 2px #f2b84b'; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)', background: active === i ? 'rgba(124,173,238,0.14)' : 'transparent', outline: 'none', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
          >
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 58. Reduced-motion-safe instant switching shown side-by-side vs. the usual animated toggle
function V58() {
  const [a1, setA1] = useActive(0);
  const [a2, setA2] = useActive(0);
  return (
    <CardSliver>
      <div style={{ padding: 8 }}>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 3 }}>מיידי (ללא תנועה)</div>
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', marginBottom: 8 }}>
          {LABELS.map((label, i) => (
            <button key={label} onClick={() => setA1(i)} style={{ flex: 1, padding: '9px 0', fontSize: 11, fontWeight: 700, background: a1 === i ? '#7cadee' : 'rgba(255,255,255,0.06)', color: a1 === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 3 }}>מונפש</div>
        <div style={{ position: 'relative', display: 'flex', borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
          <motion.div animate={{ left: a2 === 0 ? '0%' : '50%' }} transition={{ type: 'spring', stiffness: 300, damping: 26 }} style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: '#7cadee' }} />
          {LABELS.map((label, i) => (
            <button key={label} onClick={() => setA2(i)} style={{ position: 'relative', zIndex: 1, flex: 1, padding: '9px 0', fontSize: 11, fontWeight: 700, color: a2 === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </CardSliver>
  );
}

// 59. Buttons that scale up cleanly under a simulated "large text" mode toggle
function V59() {
  const [active, setActive] = useActive(0);
  const [big, setBig] = useState(false);
  return (
    <CardSliver>
      <div style={{ padding: '6px 10px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => setBig((b) => !b)} style={{ fontSize: 8.5, color: '#7cadee', fontWeight: 700 }}>{big ? 'טקסט רגיל' : 'טקסט גדול'}</button>
      </div>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: big ? '18px 0' : '13px 0', fontSize: big ? 17 : 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'all .2s', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 60. Color-blind-safe state coding — active/inactive distinguished by pattern, not color alone
function V60() {
  const [active, setActive] = useActive(0);
  const stripes = 'repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 3px, transparent 3px, transparent 7px)';
  const dots = 'radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1.5px)';
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setActive(0)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === 0 ? '#fff' : 'rgba(255,255,255,0.5)', backgroundImage: active === 0 ? stripes : 'none', backgroundColor: active === 0 ? 'rgba(124,173,238,0.18)' : 'transparent', borderInlineEnd: '1px solid rgba(255,255,255,0.08)' }}>1 X 2</button>
        <button onClick={() => setActive(1)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === 1 ? '#fff' : 'rgba(255,255,255,0.5)', backgroundImage: active === 1 ? dots : 'none', backgroundSize: '6px 6px', backgroundColor: active === 1 ? 'rgba(242,184,75,0.18)' : 'transparent' }}>ניחושים</button>
      </div>
    </CardSliver>
  );
}

// 61. A fully keyboard-navigable tab list (Tab to focus, Enter/Space to activate)
function V61() {
  const [active, setActive] = useActive(0);
  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') setActive((a) => (a === 0 ? 1 : 0));
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button
            key={label}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onClick={() => setActive(i)}
            onFocus={(e) => { e.currentTarget.style.outline = '2px solid #f2b84b'; }}
            onBlur={(e) => { e.currentTarget.style.outline = 'none'; }}
            style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', background: active === i ? 'rgba(124,173,238,0.14)' : 'transparent', outlineOffset: -2, borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ padding: '2px 10px 6px', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Keyboard className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.3)' }} />
        <span style={{ fontSize: 7.5, color: 'rgba(255,255,255,0.3)' }}>Tab לניווט, Enter/Space לבחירה</span>
      </div>
    </CardSliver>
  );
}

// 62. RTL-correct directional slide — the indicator's motion verified for Hebrew reading order
function V62() {
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
        <div style={{ textAlign: 'center', fontSize: 7.5, color: '#4ade80', marginTop: 4, fontWeight: 700 }}>✓ כיוון ההחלקה נבדק ומתאים לסדר קריאה מימין-לשמאל</div>
      </div>
    </CardSliver>
  );
}

// 63. Bottom-anchored, thumb-zone-optimized larger buttons for one-handed mobile use
function V63() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', gap: 6, padding: '10px 10px 14px' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '16px 0', borderRadius: 14, fontSize: 13, fontWeight: 800, textAlign: 'center', background: active === i ? 'linear-gradient(135deg,#7cadee,#097adc)' : 'rgba(255,255,255,0.07)', color: active === i ? '#fff' : 'rgba(255,255,255,0.55)' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 64. A decorative microphone-icon affordance hinting at voice-command support
function V64() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex', position: 'relative' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {label}
          </button>
        ))}
        <div title="אמור את הבחירה שלך" style={{ position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)', width: 18, height: 18, borderRadius: '50%', background: '#1b2333', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mic className="w-2.5 h-2.5" style={{ color: '#f2b84b' }} />
        </div>
      </div>
    </CardSliver>
  );
}

// 65. A deliberately plain, zero-decoration utilitarian pair — legibility baseline
function V65() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 13, fontWeight: active === i ? 700 : 400, textAlign: 'center', color: active === i ? '#fff' : '#94a3b8', background: 'transparent', border: 'none' }}>
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// ================= Group J — Novel interaction mechanics (66-75) =================

// 66. Drag-to-select — a draggable thumb the user drags between the two options
function V66() {
  const [active, setActive] = useActive(0);
  const trackRef = React.useRef(null);
  const handleDragEnd = (_, info) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const rel = (info.point.x - rect.left) / rect.width;
    setActive(rel < 0.5 ? 0 : 1);
  };
  return (
    <CardSliver>
      <div style={{ padding: 10 }}>
        <div ref={trackRef} style={{ position: 'relative', display: 'flex', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: 4, height: 38 }}>
          {LABELS.map((label, i) => (
            <span key={label} style={{ flex: 1, textAlign: 'center', fontSize: 11, fontWeight: 700, color: active === i ? '#fff' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label}</span>
          ))}
          <motion.div
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            animate={{ left: active === 0 ? 4 : 'calc(50% + 2px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            style={{ position: 'absolute', zIndex: 2, top: 4, bottom: 4, width: 'calc(50% - 6px)', borderRadius: 999, background: 'linear-gradient(135deg,#7cadee,#097adc)', cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <GripVertical className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.6)' }} />
          </motion.div>
        </div>
      </div>
    </CardSliver>
  );
}

// 67. Long-press previews the destination content briefly before committing to navigate
function V67() {
  const [active, setActive] = useActive(0);
  const [preview, setPreview] = useState(null);
  const timerRef = React.useRef(null);
  const startPress = (i) => { timerRef.current = setTimeout(() => setPreview(i), 350); };
  const endPress = (i, commit) => {
    clearTimeout(timerRef.current);
    if (commit && preview === i) setActive(i);
    setPreview(null);
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex', position: 'relative' }}>
        {LABELS.map((label, i) => (
          <button
            key={label}
            onMouseDown={() => startPress(i)}
            onMouseUp={() => endPress(i, true)}
            onMouseLeave={() => endPress(i, false)}
            style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
          >
            {label}
          </button>
        ))}
        <AnimatePresence>
          {preview !== null && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 4, background: '#1b2333', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 10px', fontSize: 9, color: '#cbd5e1', textAlign: 'center' }}>
              תצוגה מקדימה: {LABELS[preview]}...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </CardSliver>
  );
}

// 68. A playful "shake to randomly pick" easter egg — decorative, capped so it doesn't dominate
function V68() {
  const [active, setActive] = useActive(0);
  const [shaking, setShaking] = useState(false);
  const shake = () => {
    if (shaking) return;
    setShaking(true);
    let count = 0;
    const iv = setInterval(() => {
      setActive((a) => (a === 0 ? 1 : 0));
      count++;
      if (count >= 5) {
        clearInterval(iv);
        setShaking(false);
      }
    }, 90);
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <div key={label} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
        <motion.button onClick={shake} animate={shaking ? { rotate: [0, -8, 8, -8, 0] } : {}} transition={{ duration: 0.09, repeat: shaking ? Infinity : 0 }} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 8.5, color: '#f2b84b', fontWeight: 700, padding: '3px 8px', borderRadius: 999, background: 'rgba(242,184,75,0.1)' }}>
          <Repeat className="w-2.5 h-2.5" /> נער אותי לבחירה אקראית
        </motion.button>
      </div>
    </CardSliver>
  );
}

// 69. Double-tap opens both actions at once in a small split preview
function V69() {
  const [active, setActive] = useActive(0);
  const [split, setSplit] = useState(false);
  const lastTap = React.useRef(0);
  const handleTap = (i) => {
    const now = Date.now();
    if (now - lastTap.current < 320) {
      setSplit(true);
      setTimeout(() => setSplit(false), 1400);
    } else {
      setActive(i);
    }
    lastTap.current = now;
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => handleTap(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {label}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {split && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ display: 'flex', gap: 6, padding: '0 10px 10px', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: 'rgba(124,173,238,0.1)', borderRadius: 8, padding: 6, fontSize: 8, color: '#9dc2f5', textAlign: 'center' }}>תצוגת 1 X 2</div>
            <div style={{ flex: 1, background: 'rgba(52,211,153,0.1)', borderRadius: 8, padding: 6, fontSize: 8, color: '#7fe4bd', textAlign: 'center' }}>תצוגת ניחושים</div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardSliver>
  );
}

// 70. Magnetic snap — as the pointer approaches a button, it visually pulls toward it
function V70() {
  const [active, setActive] = useActive(0);
  const [offsets, setOffsets] = useState({ 0: 0, 1: 0 });
  const handleMove = (i, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const pull = Math.max(-6, Math.min(6, (e.clientX - center) / 6));
    setOffsets((o) => ({ ...o, [i]: pull }));
  };
  const resetOffset = (i) => setOffsets((o) => ({ ...o, [i]: 0 }));
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <motion.button
            key={label}
            onClick={() => setActive(i)}
            onMouseMove={(e) => handleMove(i, e)}
            onMouseLeave={() => resetOffset(i)}
            animate={{ x: offsets[i], scale: offsets[i] !== 0 ? 1.04 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </CardSliver>
  );
}

// 71. A liquid-fill button — tapping fills the button like liquid pouring in from one side
function V71() {
  const [active, setActive] = useActive(null);
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: '#fff', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            <motion.div initial={false} animate={{ width: active === i ? '100%' : '0%' }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(100deg,#097adc,#7cadee)' }} />
            <span style={{ position: 'relative' }}>{label}</span>
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 72. A small particle burst plays as tap confirmation
function V72() {
  const [active, setActive] = useActive(0);
  const [bursts, setBursts] = useState({ 0: [], 1: [] });
  const handleClick = (i) => {
    setActive(i);
    const id = Date.now();
    const particles = Array.from({ length: 6 }).map((_, pi) => ({ id: id + pi, angle: (pi / 6) * Math.PI * 2 }));
    setBursts((prev) => ({ ...prev, [i]: particles }));
    setTimeout(() => setBursts((prev) => ({ ...prev, [i]: [] })), 500);
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => handleClick(i)} style={{ flex: 1, position: 'relative', padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
            {bursts[i].map((p) => (
              <motion.span key={p.id} initial={{ x: 0, y: 0, opacity: 1 }} animate={{ x: Math.cos(p.angle) * 26, y: Math.sin(p.angle) * 26, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', left: '50%', top: '50%', width: 4, height: 4, borderRadius: '50%', background: '#f2b84b', pointerEvents: 'none' }} />
            ))}
            {label}
          </button>
        ))}
      </div>
    </CardSliver>
  );
}

// 73. 3D flip-card buttons that flip over to reveal a preview on their back face
function V73() {
  const [active, setActive] = useActive(0);
  const [flipped, setFlipped] = useState({ 0: false, 1: false });
  const backText = ['בדיקת יחס 1/X/2', 'כמה כבר ניחשו'];
  const handleClick = (i) => {
    setActive(i);
    setFlipped((f) => ({ ...f, [i]: true }));
    setTimeout(() => setFlipped((f) => ({ ...f, [i]: false })), 1100);
  };
  return (
    <CardSliver>
      <div style={{ display: 'flex', perspective: '400px' }}>
        {LABELS.map((label, i) => (
          <div key={label} onClick={() => handleClick(i)} style={{ flex: 1, height: 46, position: 'relative', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', cursor: 'pointer' }}>
            <motion.div animate={{ rotateY: flipped[i] ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>{label}</div>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700, color: '#7cadee', textAlign: 'center', padding: '0 6px' }}>{backText[i]}</div>
            </motion.div>
          </div>
        ))}
      </div>
    </CardSliver>
  );
}

// 74. An elastic stretch-band style divider that stretches and snaps between the two states
function V74() {
  const [active, setActive] = useActive(0);
  return (
    <CardSliver>
      <div style={{ position: 'relative', display: 'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => setActive(i)} style={{ flex: 1, padding: '13px 0', fontSize: 12, fontWeight: 800, textAlign: 'center', color: active === i ? '#fff' : 'rgba(255,255,255,0.5)' }}>
            {label}
          </button>
        ))}
        <motion.div
          key={active}
          initial={{ scaleY: 0.3, opacity: 0.4 }}
          animate={{ scaleY: [0.3, 1.4, 0.85, 1], opacity: 1 }}
          transition={{ duration: 0.5, times: [0, 0.4, 0.7, 1] }}
          style={{ position: 'absolute', left: '50%', top: 4, bottom: 4, width: 2, background: 'linear-gradient(180deg,#7cadee,#f2b84b)', transformOrigin: 'center' }}
        />
      </div>
    </CardSliver>
  );
}

// 75. A single "פעולות" button that progressively expands into the two real options
function V75() {
  const [active, setActive] = useActive(null);
  const [open, setOpen] = useState(false);
  return (
    <CardSliver>
      <div style={{ padding: 10, display: 'flex', justifyContent: 'center' }}>
        <motion.div layout style={{ display: 'flex', borderRadius: 999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
          {!open ? (
            <motion.button layout onClick={() => setOpen(true)} style={{ padding: '10px 22px', fontSize: 12, fontWeight: 800, color: '#fff' }}>
              פעולות
            </motion.button>
          ) : (
            LABELS.map((label, i) => (
              <motion.button
                key={label}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => { setActive(i); setOpen(false); }}
                style={{ padding: '10px 18px', fontSize: 12, fontWeight: 800, color: active === i ? '#fff' : 'rgba(255,255,255,0.6)', borderInlineEnd: i === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}
              >
                {label}
              </motion.button>
            ))
          )}
        </motion.div>
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
  { title: 'קבוצה F — טיפוגרפיה מובילה (26-35)', items: [
    ['26. ספרות ענק ל-1 X 2', 'הכיתוב "1 X 2" מוצג בספרות ענק ובולטות, עם כיתובית קטנה מתחת', V26],
    ['27. כותרת עיתון קלאסית', 'לייבלים בגופן סריף בסגנון כותרת עיתון, עם קו טור דק מפריד', V27],
    ['28. טרמינל עם סמן מהבהב', 'עיצוב מונוספייס בסגנון מסוף, סמן מהבהב ליד הכפתור הפעיל', V28],
    ['29. כתב יד על הפעיל', 'הלייבל הפעיל מקבל טיפול גרפי בסגנון כתב יד/טוש', V29],
    ['30. תגית מסתובבת במפריד', 'תגית טקסט קטנה מסתובבת אנכית לאורך קו המפריד שבין הכפתורים', V30],
    ['31. מיקרו-לייבלים במרווח אותיות', 'אותיות במרווח רחב וכיתובית זעירה מתחת לכל לייבל', V31],
    ['32. טיפוגרפיה קינטית', 'אותיות הלייבל הפעיל קופצות פנימה אחת-אחת באנימציה מדורגת', V32],
    ['33. טקסט גרדיאנט ללא רקע', 'טקסט במילוי גרדיאנט צבעוני בלי שום מסגרת או רקע — הצבע נושא הכל', V33],
    ['34. טקסט חרוט/מוטבע', 'אפקט צל חרוט-מוטבע על הטקסט, תחושת דפוס-עופרת', V34],
    ['35. טיקר זעיר גולש', 'שורת טקסט זעירה גולשת בתוך כל כפתור, פרט תנועה דקורטיבי', V35],
  ]},
  { title: 'קבוצה G — עיצוב מונחה אייקונים (36-45)', items: [
    ['36. אייקונים בלבד עם טולטיפ', 'כפתורי אייקון בלבד — הלייבל מופיע כטולטיפ בלחיצה/מעבר עכבר', V36],
    ['37. תג עיגול + פיל טקסט', 'אייקון בתג עיגול לצד פיל טקסט — שני רכיבים חזותיים נפרדים', V37],
    ['38. אייקון משנה צורה', 'צורת האייקון עצמה משתנה (מורפינג) עם הלחיצה על הכפתור', V38],
    ['39. מתג עם אייקונים בקצוות', 'מסלול מתג עם אייקון מעוגן בכל קצה במקום טקסט', V39],
    ['40. אייקון עם טבעת התקדמות', 'טבעת עיגול דקה מצוירת סביב האייקון', V40],
    ['41. מתאר שמתמלא', 'אייקון מתאר מתמלא לצבע מלא כשהכפתור הופך לפעיל', V41],
    ['42. רטט קפיצי באייקון', 'האייקון מבצע קפיצה/רטט קטן כמשוב ללחיצה', V42],
    ['43. אייקון עם גרף מיני', 'אייקון מלווה בגרף עמודות זעיר הרומז על נתונים', V43],
    ['44. כדור מתגלגל בין הכפתורים', 'אייקון כדורגל "מתגלגל" חזותית מכפתור לכפתור במעבר', V44],
    ['45. גביע מול שער', 'זוג אייקונים בהשראת כדורגל — גביע ושער — לשתי הפעולות', V45],
  ]},
  { title: 'קבוצה H — השראת אצטדיון וספורט (46-55)', items: [
    ['46. לוח נוסעים מתהפך', 'כל לחיצה הופכת את הלייבל כמו לוח תצוגה בתחנת רכבת', V46],
    ['47. קרן זרקור אצטדיון', 'קרן אור זרקור סורקת ונוחתת על הכפתור הפעיל', V47],
    ['48. מרשם דשא עם קו גיר', 'רקע מרקם דשא עם קו מפריד בסגנון קו גיר על המגרש', V48],
    ['49. כרטיסי שופט', 'צמד כפתורים בצורת כרטיס צהוב/אדום של שופט', V49],
    ['50. מספרי חולצה', 'ספרות עבות בסגנון מספר על חולצת שחקן', V50],
    ['51. שלט מלתחה מוטבע', 'מראה מתכת חרוטה בסגנון שלט שם על ארון מלתחה', V51],
    ['52. כרטיס כניסה מפורט', 'כרטיס משחק מלא עם פס ברקוד ופרטי דפוס זעירים, גרסה עשירה יותר מהמפריד המחורר', V52],
    ['53. סריקת VAR', 'קו סריקה חולף על הכפתור שזה עתה נלחץ, בהשראת בדיקת וידאו', V53],
    ['54. לוח חילופים דיגיטלי', 'ספרות/לייבלים בסגנון לוח החילופים עם נורות LED', V54],
    ['55. לוחית אלופה', 'מפריד מרכזי בצורת לוחית זהב מעוטרת, כמו חגורת אליפות', V55],
  ]},
  { title: 'קבוצה I — נגישות ותכליתיות (56-65)', items: [
    ['56. ניגודיות גבוהה, יעד ענק', 'כפתורים גדולים במיוחד עם ניגודיות מקסימלית — נגישות לפני הכל', V56],
    ['57. קבוצת רדיו עם פוקוס ברור', 'סמנטיקת radio-group עם טבעת פוקוס בולטת בצבעי המותג לניווט מקלדת', V57],
    ['58. השוואת תנועה מול מיידי', 'שני מופעים זה לצד זה — מעבר מיידי מול מעבר מונפש — להשוואה מפורשת', V58],
    ['59. מצב טקסט גדול', 'מתג "טקסט גדול" שמגדיל את הכפתורים בצורה נקייה', V59],
    ['60. קידוד בתבנית לעיוורי צבעים', 'המצב הפעיל מסומן גם בתבנית (פסים/נקודות) ולא רק בצבע', V60],
    ['61. ניווט מקלדת מלא', 'רשימת טאבים הניתנת לניווט מקלדת מלא (Tab, Enter/Space) עם מתאר פוקוס אמיתי', V61],
    ['62. החלקה נכונה ל-RTL', 'מחוון גולש עם כיוון תנועה מאומת ומתויג לכתיבה מימין-לשמאל', V62],
    ['63. אזור אגודל בתחתית', 'כפתורים גדולים המעוגנים לתחתית המסך, מותאמים לשימוש ביד אחת', V63],
    ['64. רמז קולי דקורטיבי', 'אייקון מיקרופון דקורטיבי הרומז על תמיכה בפקודות קול (חזותי בלבד)', V64],
    ['65. בסיס נקי ללא עיצוב', 'זוג כפתורים אוטיליטריים לחלוטין — מינימום עיצוב, מקסימום בהירות', V65],
  ]},
  { title: 'קבוצה J — מכניקות אינטראקציה חדשניות (66-75)', items: [
    ['66. גרירה לבחירה', 'ידית נגררת בין שתי האפשרויות במקום לחיצה', V66],
    ['67. לחיצה ארוכה לתצוגה מקדימה', 'לחיצה ממושכת מציגה תצוגה מקדימה של היעד לפני המעבר בפועל', V67],
    ['68. נענוע לבחירה אקראית', 'איסטר-אג משעשע שבוחר אפשרות אקראית, מוגבל כדי לא להשתלט', V68],
    ['69. לחיצה כפולה לתצוגה משולבת', 'לחיצה כפולה פותחת תצוגה מקדימה מפוצלת של שתי האפשרויות יחד', V69],
    ['70. משיכה מגנטית', 'הכפתור "נמשך" ויזואלית לעבר האצבע/עכבר לפני שהלחיצה בכלל נוחתת', V70],
    ['71. מילוי נוזלי', 'לחיצה ממלאה את הכפתור כמו נוזל שנשפך פנימה מצד אחד', V71],
    ['72. פרץ חלקיקים בלחיצה', 'פיצוץ חלקיקים קטן כמשוב אישור ללחיצה', V72],
    ['73. כרטיס תלת-ממד מתהפך', 'הכפתורים מתהפכים בתלת-ממד לחשיפת תצוגה מקדימה בגב הכרטיס', V73],
    ['74. מפריד גומי אלסטי', 'מפריד במתיחה אלסטית שנמתח ו"קופץ" בין שני המצבים', V74],
    ['75. כפתור פעולות מתרחב', 'כפתור בודד "פעולות" שמתרחב בהדרגה לשתי האפשרויות האמיתיות בלחיצה', V75],
  ]},
];

export default function AdminFooterTabsDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 75 עיצובים לשורת הכפתורים התחתונה (1 X 2 / ניחושים)</h2>
        <p className="text-slate-500 text-sm">75 גישות עיצוב לזוג הכפתורים בתחתית כרטיס המשחק בעמוד הניחושים. כולן אינטראקטיביות באמת — לחיצה מציגה מצב פעיל, וחיות עם כפתור "הצג שוב". הקשר כרטיס משחק לדוגמה בלבד — כלי דמו, לא משפיע על Predictions.jsx.</p>
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
