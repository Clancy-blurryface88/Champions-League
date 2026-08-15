import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Crown, Trophy, Star, Medal } from 'lucide-react';
import { ShineBorder } from '@/components/magicui/shine-border';
import OdometerValue from '@/components/OdometerValue';

// Demo-only: 50 alternative designs for the leaderboard participant card —
// the skewed parallelogram rows in LeaderboardPanel.jsx. Mock data,
// self-contained, replayable. Doesn't touch LeaderboardPanel.jsx.
//
// Lesson applied from the OdometerValue/PredictionsResults debugging pass:
// a row that reveals on its own staggered entrance animation must trigger
// its points-counting animation from that row's OWN onAnimationComplete —
// never from IntersectionObserver or mount-relative timing — because a row
// occupies its layout box (and "intersects" the viewport) from the instant
// it mounts, even while still at opacity:0 mid-reveal. RevealRows below
// implements that correctly once, and nearly every variant reuses it.

const RANK_COLOR = (r) => (r === 1 ? '#7cadee' : r === 2 ? '#C0C0C0' : r === 3 ? '#CD7F32' : 'rgba(255,255,255,0.5)');
const RANK_BORDER = (r) => (r === 1 ? '#7cadee' : r === 2 ? '#D1D5DB' : r === 3 ? '#D97706' : '#475569');
const RANK_BG = (r) =>
  r === 1 ? 'linear-gradient(135deg,rgba(124,173,238,0.22),rgba(9,122,220,0.22))' :
  r === 2 ? 'linear-gradient(135deg,rgba(209,213,219,0.18),rgba(156,163,175,0.18))' :
  r === 3 ? 'linear-gradient(135deg,rgba(9,122,220,0.20),rgba(217,119,6,0.20))' :
  'rgba(30,41,59,0.60)';
const MEDAL_COLOR = (r) => (r === 1 ? '#FFD700' : r === 2 ? '#C0C0C0' : '#CD7F32');

const MOCK4 = [
  { rank: 1, name: 'דניאל כהן', points: 61.5 },
  { rank: 2, name: 'נועה לוי', points: 54.0 },
  { rank: 3, name: 'איתי מזרחי', points: 48.5 },
  { rank: 4, name: 'שירה בן דוד', points: 39.0 },
];
const MOCK3 = MOCK4.slice(0, 3);

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

// ---- shared reveal-tracking + primitives ----

function useRevealTracking() {
  const [revealed, setRevealed] = useState(() => new Set());
  const markRevealed = (id) => setRevealed((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  return [revealed, markRevealed];
}

function PointsPill({ value, trigger, color = '#4ade80', size = 12 }) {
  return (
    <span style={{ color, fontSize: size, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>
      <OdometerValue target={value} trigger={trigger} height={size + 3} width={size * 0.62} /> Pts
    </span>
  );
}

// Generic staggered row list. Each row is its own motion.div; its
// onAnimationComplete flips that row (and only that row) "revealed" —
// children() receives (row, index, revealedBoolean) so points/effects can
// gate on the row's own real completion instead of geometry or a timer.
function RevealRows({ rows, gap = 8, direction = 'column', style, itemStyle, initial, animate, transitionFor, children }) {
  const [revealed, markRevealed] = useRevealTracking();
  return (
    <div className="flex" style={{ flexDirection: direction, gap, alignItems: direction === 'row' ? 'flex-end' : 'stretch', ...style }}>
      {rows.map((row, i) => (
        <motion.div
          key={row.rank}
          initial={initial || { opacity: 0, y: 14 }}
          animate={animate || { opacity: 1, y: 0 }}
          transition={transitionFor ? transitionFor(i) : { delay: i * 0.13, duration: 0.45, ease: 'easeOut' }}
          onAnimationComplete={() => markRevealed(row.rank)}
          style={itemStyle}
        >
          {children(row, i, revealed.has(row.rank))}
        </motion.div>
      ))}
    </div>
  );
}

// Layered clip-path card: an outer color box + an inset same-clipped fill
// box, instead of a plain border on a clip-path element (which renders
// broken on diagonal edges).
function ClipCard({ row, revealed, clipPath, width = 224, height = 56 }) {
  return (
    <div style={{ position: 'relative', width, height }}>
      <div style={{ position: 'absolute', inset: 0, background: RANK_BORDER(row.rank), clipPath }} />
      <div style={{ position: 'absolute', inset: 2, background: RANK_BG(row.rank), clipPath, display: 'flex', alignItems: 'center', gap: 10, padding: '0 22px' }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank), flexShrink: 0 }}>{row.rank}</span>
        <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, flex: 1, minWidth: 0, textAlign: 'center' }}>{row.name}</p>
        <PointsPill value={row.points} trigger={revealed} />
      </div>
    </div>
  );
}

// Plain rounded-rect card used across Group C — shape/layout held constant
// while only the rank indicator (`rankSlot` / `overlay`) changes.
function PlainCard({ row, revealed, overlay, rankSlot, width = 224 }) {
  return (
    <div style={{ position: 'relative', width, padding: '8px 14px', borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
      {overlay}
      {rankSlot}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
      </div>
      <PointsPill value={row.points} trigger={revealed} />
    </div>
  );
}

function PlainRankBadge({ rank }) {
  return (
    <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
      {rank}
    </div>
  );
}

function Laurel({ color }) {
  const leaves = [0, 1, 2, 3];
  return (
    <div style={{ position: 'absolute', inset: -7, pointerEvents: 'none' }}>
      {leaves.map((i) => (
        <div key={'l' + i} style={{ position: 'absolute', left: -1 - i * 2, top: 9 + i * 4.5, width: 7, height: 3.5, borderRadius: '50%', background: color, transform: `rotate(${-25 - i * 16}deg)` }} />
      ))}
      {leaves.map((i) => (
        <div key={'r' + i} style={{ position: 'absolute', right: -1 - i * 2, top: 9 + i * 4.5, width: 7, height: 3.5, borderRadius: '50%', background: color, transform: `rotate(${25 + i * 16}deg)` }} />
      ))}
    </div>
  );
}

// Card content row for Group D (material treatments) — shape/layout held
// constant so only the surrounding surface style varies.
function CardInner({ row, revealed, textColor = '#e2e8f0', rankColorOverride, pointsColor = '#4ade80' }) {
  return (
    <>
      <span style={{ fontSize: 13, fontWeight: 900, color: rankColorOverride || RANK_COLOR(row.rank), width: 18, flexShrink: 0 }}>{row.rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="truncate" style={{ color: textColor, fontSize: 13, fontWeight: 600 }}>{row.name}</p>
      </div>
      <PointsPill value={row.points} trigger={revealed} color={pointsColor} />
    </>
  );
}

// Card face for Group E (motion-forward) — a consistent rounded-rect look
// so the ENTRANCE motion itself is the only differentiator.
function CardFace({ row, revealed, style }) {
  return (
    <div style={{ width: 220, padding: '9px 14px', borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), display: 'flex', alignItems: 'center', gap: 10, ...style }}>
      <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank), width: 18, flexShrink: 0 }}>{row.rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
      </div>
      <PointsPill value={row.points} trigger={revealed} />
    </div>
  );
}

// ================= Group A — Geometric card shapes (1-10) =================

// 1. Baseline — the real skewed parallelogram card exactly as in LeaderboardPanel.jsx
function V1() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220 }}>
          <div style={{ transform: 'skewX(-6deg)', position: 'relative', overflow: 'hidden', borderRadius: 8, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank) }}>
            <ShineBorder
              borderRadius={8}
              borderWidth={1}
              duration={row.rank === 1 ? 6 : row.rank === 2 ? 7 : row.rank === 3 ? 8 : 12}
              shineColor={row.rank === 1 ? ['#7cadee', '#fff', '#097adc'] : row.rank === 2 ? ['#C0C0C0', '#fff', '#94a3b8'] : row.rank === 3 ? ['#CD7F32', '#fff', '#D97706'] : ['#475569', '#64748b', '#475569']}
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%) skewX(6deg)', fontSize: 34, fontWeight: 900, color: RANK_COLOR(row.rank), opacity: 0.18, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
              {row.rank}
            </span>
            <div style={{ transform: 'skewX(6deg)', padding: '5px 13px', textAlign: 'center' }}>
              <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, marginBottom: 1 }}>{row.name}</p>
              <PointsPill value={row.points} trigger={revealed} />
            </div>
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 2. Flat rectangle, no skew, sharp corners
function V2() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank), width: 20, flexShrink: 0 }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
          </div>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 3. Rounded rectangle, generous corner radius, soft card feel
function V3() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '10px 16px', borderRadius: 22, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), boxShadow: '0 4px 20px rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: RANK_COLOR(row.rank), flexShrink: 0 }}>#{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
          </div>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 4. Hexagon card (clip-path)
function V4() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => <ClipCard row={row} revealed={revealed} clipPath="polygon(3% 0,97% 0,100% 50%,97% 100%,3% 100%,0 50%)" />}
    </RevealRows>
  );
}

// 5. Ticket-stub card (semi-circle notches on the sides, like a movie ticket)
function V5() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 224, padding: '10px 18px', borderRadius: 4, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), display: 'flex', alignItems: 'center', gap: 10, overflow: 'visible' }}>
          <div style={{ position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, borderRadius: '50%', background: '#050a12' }} />
          <div style={{ position: 'absolute', right: -8, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, borderRadius: '50%', background: '#050a12' }} />
          <div style={{ position: 'absolute', left: 30, top: 4, bottom: 4, borderLeft: `1px dashed ${RANK_BORDER(row.rank)}66` }} />
          <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank), width: 20, textAlign: 'center', flexShrink: 0 }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'center', marginInlineStart: 8 }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
          </div>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 6. Shield/crest card (rounded top, pointed bottom, club-crest silhouette)
function V6() {
  const clip = 'polygon(8% 0,92% 0,100% 14%,100% 58%,50% 100%,0 58%,0 14%)';
  return (
    <RevealRows rows={MOCK3} direction="row" gap={12}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 80, height: 98 }}>
          <div style={{ position: 'absolute', inset: 0, background: RANK_BORDER(row.rank), clipPath: clip }} />
          <div style={{ position: 'absolute', inset: 2, background: RANK_BG(row.rank), clipPath: clip, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '16px 6px 8px' }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 9.5, fontWeight: 700, textAlign: 'center', width: '100%' }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} size={9} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 7. Diagonal-cut card (one corner chamfered at 45°)
function V7() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => <ClipCard row={row} revealed={revealed} clipPath="polygon(0 0, 82% 0, 100% 30%, 100% 100%, 0 100%)" />}
    </RevealRows>
  );
}

// 8. Ribbon/banner card (pointed tail on one side)
function V8() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => <ClipCard row={row} revealed={revealed} clipPath="polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)" />}
    </RevealRows>
  );
}

// 9. Arch/dome-top card (rounded top corners only, flat bottom)
function V9() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', borderRadius: '26px 26px 4px 4px', border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank), width: 18, flexShrink: 0 }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
          </div>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 10. Chevron/arrow card (pointed leading edge, like a directional sign)
function V10() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => <ClipCard row={row} revealed={revealed} clipPath="polygon(0 0, 82% 0, 100% 50%, 82% 100%, 0 100%, 12% 50%)" />}
    </RevealRows>
  );
}

// ================= Group B — Layout / information-density variants (11-20) =================

// 11. Compact single-line row (avatar + name + points inline, no card chrome, just a divider)
function V11() {
  return (
    <RevealRows rows={MOCK3} gap={0}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', borderBottom: i < MOCK3.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: RANK_COLOR(row.rank), flexShrink: 0 }}>{row.name[0]}</div>
          <span className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 12.5, fontWeight: 600 }}>{row.name}</span>
          <PointsPill value={row.points} trigger={revealed} size={11} />
        </div>
      )}
    </RevealRows>
  );
}

// 12. Two-line stacked (name on top, points + rank badge below, centered)
function V12() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 180, padding: '10px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.04)', textAlign: 'center' }}>
          <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#fff', background: RANK_BORDER(row.rank), borderRadius: 6, padding: '1px 6px' }}>#{row.rank}</span>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 13. Avatar-forward (large circular avatar/initial dominating the left, name+points stacked to its right)
function V13() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', gap: 12, padding: '6px 10px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: `1px solid ${RANK_BORDER(row.rank)}44` }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: RANK_BG(row.rank), border: `2px solid ${RANK_BORDER(row.rank)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', flexShrink: 0 }}>{row.name[0]}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
          <span style={{ fontSize: 12, fontWeight: 900, color: RANK_COLOR(row.rank), flexShrink: 0 }}>#{row.rank}</span>
        </div>
      )}
    </RevealRows>
  );
}

// 14. Stat-sheet card (name + points + a small secondary stat in a mini 2-column grid)
function V14() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 210, padding: '8px 12px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 8 }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700, minWidth: 0 }}>{row.name}</p>
            <span style={{ fontSize: 11, fontWeight: 900, color: RANK_COLOR(row.rank), flexShrink: 0 }}>#{row.rank}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: 8 }}>נקודות</div>
              <PointsPill value={row.points} trigger={revealed} size={11} />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: 8 }}>פגיעות מדויקות</div>
              <span style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800 }}>{Math.max(1, 5 - row.rank)}</span>
            </div>
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 15. Comparison-bar card (horizontal bar fill proportional to points relative to the leader, name overlaid)
function V15() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const pct = Math.round((row.points / MOCK4[0].points) * 100);
        return (
          <div style={{ position: 'relative', width: 220, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', border: `1px solid ${RANK_BORDER(row.rank)}44` }}>
            <motion.div initial={{ width: 0 }} animate={{ width: revealed ? `${pct}%` : 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, background: RANK_BG(row.rank) }} />
            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
              <span className="truncate" style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>{row.rank}. {row.name}</span>
              <PointsPill value={row.points} trigger={revealed} />
            </div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 16. ID-badge / lanyard card (portrait-oriented badge look with a "clip" notch at top)
function V16() {
  return (
    <RevealRows rows={MOCK3} direction="row" gap={10}>
      {(row, i, revealed) => (
        <div style={{ width: 88, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `2px solid ${RANK_BORDER(row.rank)}`, position: 'relative', paddingTop: 14, paddingBottom: 8, textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 26, height: 9, borderRadius: 4, background: '#475569', border: '1px solid rgba(255,255,255,0.3)' }} />
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: RANK_BORDER(row.rank), margin: '0 auto 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13 }}>{row.name[0]}</div>
          <p className="truncate" style={{ color: '#e2e8f0', fontSize: 10, fontWeight: 700, padding: '0 5px' }}>{row.name}</p>
          <div style={{ fontSize: 8.5, color: RANK_COLOR(row.rank), fontWeight: 800, margin: '2px 0' }}>#{row.rank}</div>
          <PointsPill value={row.points} trigger={revealed} size={9} />
        </div>
      )}
    </RevealRows>
  );
}

// 17. Trading-card style (portrait card with a colored header band showing rank, art area, stat footer)
function V17() {
  return (
    <RevealRows rows={MOCK3} direction="row" gap={10}>
      {(row, i, revealed) => (
        <div style={{ width: 96, borderRadius: 10, overflow: 'hidden', border: `2px solid ${RANK_BORDER(row.rank)}`, background: '#111a2b' }}>
          <div style={{ background: RANK_BORDER(row.rank), padding: '3px 7px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontSize: 9.5, fontWeight: 900 }}>#{row.rank}</span>
            <Star className="w-3 h-3" style={{ color: '#fff' }} fill="#fff" />
          </div>
          <div style={{ height: 44, background: RANK_BG(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.85)' }}>{row.name[0]}</span>
          </div>
          <div style={{ padding: '5px 7px', textAlign: 'center' }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 9.5, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} size={9} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 18. Podium-step card (each row's left edge height varies to suggest a step/stair)
function V18() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const stepH = row.rank === 1 ? 66 : row.rank === 2 ? 54 : row.rank === 3 ? 46 : 38;
        return (
          <div style={{ position: 'relative', width: 200, minHeight: stepH, display: 'flex', alignItems: 'center', borderRadius: 10, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: RANK_BG(row.rank), padding: '0 12px 0 16px', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: RANK_BORDER(row.rank) }} />
            <span style={{ fontSize: 16, fontWeight: 900, color: RANK_COLOR(row.rank), marginInlineEnd: 10 }}>#{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
              <PointsPill value={row.points} trigger={revealed} />
            </div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 19. Minimalist text-only row (no background/border at all, just typography hierarchy and spacing)
function V19() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'baseline', gap: 10, padding: '4px 2px' }}>
          <span style={{ fontSize: row.rank === 1 ? 20 : 16, fontWeight: 900, color: row.rank === 1 ? '#fff' : '#64748b', width: 22, flexShrink: 0 }}>{row.rank}</span>
          <span className="truncate" style={{ flex: 1, minWidth: 0, fontSize: row.rank === 1 ? 15 : 13, fontWeight: row.rank === 1 ? 800 : 500, color: row.rank === 1 ? '#fff' : '#cbd5e1' }}>{row.name}</span>
          <PointsPill value={row.points} trigger={revealed} color={row.rank === 1 ? '#4ade80' : '#64748b'} />
        </div>
      )}
    </RevealRows>
  );
}

// 20. Split dual-tone card (left half one color block for rank, right half a different tone for name+points)
function V20() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', borderRadius: 10, overflow: 'hidden', border: `1px solid ${RANK_BORDER(row.rank)}55` }}>
          <div style={{ width: 44, background: RANK_BORDER(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 16, flexShrink: 0 }}>{row.rank}</div>
          <div style={{ flex: 1, minWidth: 0, background: 'rgba(255,255,255,0.05)', padding: '8px 12px' }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// ================= Group C — Rank-indicator treatments (21-30) =================
// Card shape/layout held constant (PlainCard); only the rank badge/indicator changes.

// 21. Large ghost-number watermark behind the row, bleeding off the right edge
function V21() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const overlay = (
          <span style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontSize: 62, fontWeight: 900, color: RANK_COLOR(row.rank), opacity: 0.16, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
            {row.rank}
          </span>
        );
        return <PlainCard row={row} revealed={revealed} overlay={overlay} />;
      }}
    </RevealRows>
  );
}

// 22. Circular numbered badge, solid fill, positioned at the leading edge
function V22() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const rankSlot = (
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: RANK_BORDER(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 13, flexShrink: 0 }}>
            {row.rank}
          </div>
        );
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 23. Corner-ribbon rank badge (diagonal ribbon banner in the top corner, "#1" printed on it)
function V23() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const overlay = (
          <div style={{ position: 'absolute', top: 8, left: -26, width: 84, transform: 'rotate(-45deg)', background: RANK_BORDER(row.rank), color: '#fff', fontSize: 9, fontWeight: 900, textAlign: 'center', padding: '1px 0' }}>
            #{row.rank}
          </div>
        );
        return <PlainCard row={row} revealed={revealed} overlay={overlay} />;
      }}
    </RevealRows>
  );
}

// 24. Medal icon for top 3 (styled shape, not emoji), plain number badge for the rest
function V24() {
  return (
    <RevealRows rows={MOCK4}>
      {(row, i, revealed) => {
        const rankSlot = row.rank <= 3
          ? <Medal className="w-5 h-5" style={{ color: MEDAL_COLOR(row.rank), flexShrink: 0 }} fill={MEDAL_COLOR(row.rank)} fillOpacity={0.25} />
          : <PlainRankBadge rank={row.rank} />;
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 25. Podium-pedestal icon inline for top 3
function V25() {
  return (
    <RevealRows rows={MOCK4}>
      {(row, i, revealed) => {
        const rankSlot = row.rank <= 3 ? (
          <div style={{ width: 18, height: row.rank === 1 ? 22 : row.rank === 2 ? 16 : 11, background: RANK_BORDER(row.rank), borderRadius: '3px 3px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 900, paddingTop: 2, flexShrink: 0 }}>
            {row.rank}
          </div>
        ) : <PlainRankBadge rank={row.rank} />;
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 26. Progress-ring rank indicator (thin circular progress ring around the avatar, filled by closeness-to-leader)
function V26() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const pct = Math.max(6, Math.round((row.points / MOCK4[0].points) * 100));
        const rankSlot = (
          <div style={{ position: 'relative', width: 28, height: 28, borderRadius: '50%', background: `conic-gradient(${RANK_BORDER(row.rank)} ${pct}%, rgba(255,255,255,0.12) ${pct}%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0', fontSize: 10, fontWeight: 800 }}>{row.name[0]}</div>
          </div>
        );
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 27. Laurel-wreath frame around the avatar for top 3
function V27() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const rankSlot = (
          <div style={{ position: 'relative', width: 30, height: 30, flexShrink: 0 }}>
            {row.rank <= 3 && <Laurel color={MEDAL_COLOR(row.rank)} />}
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e2e8f0', fontWeight: 800, fontSize: 12 }}>{row.name[0]}</div>
          </div>
        );
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 28. Crown icon above the row for rank 1 only, animated in — gated by that row's OWN reveal, not mount timing
function V28() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const rankSlot = (
          <div style={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <AnimatePresence>
              {revealed && row.rank === 1 ? (
                <motion.div key="crown" initial={{ opacity: 0, y: 6, scale: 0.5 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 320, damping: 14 }}>
                  <Crown className="w-4 h-4" style={{ color: '#facc15' }} fill="#facc15" fillOpacity={0.5} />
                </motion.div>
              ) : row.rank !== 1 ? (
                <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
              ) : null}
            </AnimatePresence>
          </div>
        );
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 29. Trophy-cup silhouette badge for top 3, numbered chip for the rest
function V29() {
  return (
    <RevealRows rows={MOCK4}>
      {(row, i, revealed) => {
        const rankSlot = row.rank <= 3
          ? <Trophy className="w-5 h-5" style={{ color: MEDAL_COLOR(row.rank), flexShrink: 0 }} fill={MEDAL_COLOR(row.rank)} fillOpacity={0.3} />
          : <PlainRankBadge rank={row.rank} />;
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// 30. Star-rating style row (row 1 gets 3 stars, row 2 gets 2, row 3 gets 1)
function V30() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const filled = 4 - row.rank;
        const rankSlot = (
          <div style={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {[0, 1, 2].map((si) => (
              <Star key={si} className="w-3.5 h-3.5" style={{ color: si < filled ? '#facc15' : '#475569' }} fill={si < filled ? '#facc15' : 'none'} />
            ))}
          </div>
        );
        return <PlainCard row={row} revealed={revealed} rankSlot={rankSlot} />;
      }}
    </RevealRows>
  );
}

// ================= Group D — Material / surface treatments (31-40) =================
// Shape + layout held constant (CardInner); only the surface style changes.

// 31. Frosted glass (heavy backdrop-blur, translucent white overlay)
function V31() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 18, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(16px) saturate(1.4)', WebkitBackdropFilter: 'blur(16px) saturate(1.4)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 32. Neumorphic soft-UI (soft inset/outset shadows, no hard border)
function V32() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '10px 14px', borderRadius: 18, background: '#1b2333', boxShadow: '8px 8px 16px rgba(0,0,0,0.45), -6px -6px 14px rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 33. Neon-outline only (transparent fill, glowing colored border, esports HUD feel)
function V33() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', borderRadius: 12, background: 'transparent', border: `1.5px solid ${RANK_BORDER(row.rank)}`, boxShadow: `0 0 10px ${RANK_BORDER(row.rank)}, inset 0 0 10px ${RANK_BORDER(row.rank)}33`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} pointsColor="#7cadee" />
        </div>
      )}
    </RevealRows>
  );
}

// 34. Holographic foil shimmer (animated iridescent gradient sweep, trading-card foil look)
function V34() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <motion.div
          style={{ width: 220, padding: '8px 14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.3)', backgroundImage: 'linear-gradient(120deg, #ff9a9e, #fad0c4, #a1c4fd, #c2e9fb, #fbc2eb, #ff9a9e)', backgroundSize: '300% 300%', display: 'flex', alignItems: 'center', gap: 10 }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
          <CardInner row={row} revealed={revealed} textColor="#1e1b3a" rankColorOverride="#4c1d95" pointsColor="#065f46" />
        </motion.div>
      )}
    </RevealRows>
  );
}

// 35. Brushed-metal/chrome surface (metallic gradient with a subtle diagonal sheen)
function V35() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', borderRadius: 10, backgroundImage: 'linear-gradient(135deg,#8a8f98 0%,#c9ced6 22%,#eef1f4 38%,#9aa0a8 55%,#c9ced6 72%,#787e88 100%)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 8px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} textColor="#1e293b" rankColorOverride="#334155" pointsColor="#065f46" />
        </div>
      )}
    </RevealRows>
  );
}

// 36. Matte solid-color card, flat design, no gradients or glass at all
function V36() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', borderRadius: 10, background: row.rank === 1 ? '#3b5f8a' : row.rank === 2 ? '#5b6472' : row.rank === 3 ? '#7a5230' : '#2a3140', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 37. Textured paper/fabric card (subtle noise/grain texture, warm off-white tone)
function V37() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', borderRadius: 6, background: '#efe4cf', backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '3px 3px', border: '1px solid rgba(0,0,0,0.15)', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} textColor="#3a2f22" rankColorOverride="#7a4f1e" pointsColor="#166534" />
        </div>
      )}
    </RevealRows>
  );
}

// 38. Wood-grain/stadium-bench texture card
function V38() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '8px 14px', borderRadius: 6, backgroundImage: 'repeating-linear-gradient(90deg, #6b4423 0px, #7a4f2a 4px, #5e3b1e 8px)', border: '1px solid #4a2f18', boxShadow: 'inset 0 0 12px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CardInner row={row} revealed={revealed} textColor="#f3e6d3" rankColorOverride="#f3d9a4" pointsColor="#bef264" />
        </div>
      )}
    </RevealRows>
  );
}

// 39. Cracked-glass/shatter overlay for a "rank drop" moment (decorative fracture lines)
function V39() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, padding: '8px 14px', borderRadius: 10, background: RANK_BG(row.rank), border: `2px solid ${RANK_BORDER(row.rank)}`, overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.4 }} viewBox="0 0 220 54" preserveAspectRatio="none">
            <line x1="38" y1="0" x2="66" y2="54" stroke="white" strokeWidth="1" />
            <line x1="66" y1="54" x2="104" y2="18" stroke="white" strokeWidth="1" />
            <line x1="104" y1="18" x2="150" y2="0" stroke="white" strokeWidth="1" />
            <line x1="66" y1="54" x2="48" y2="28" stroke="white" strokeWidth="0.6" />
          </svg>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CardInner row={row} revealed={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 40. Liquid-metal morphing border (an animated gradient border that slowly shifts hue)
function V40() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <motion.div
          style={{ width: 220, borderRadius: 14, padding: 2, backgroundImage: 'linear-gradient(120deg,#7cadee,#a78bfa,#34d399,#7cadee)', backgroundSize: '300% 300%' }}
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
          <div style={{ borderRadius: 12, background: '#0b1220', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <CardInner row={row} revealed={revealed} />
          </div>
        </motion.div>
      )}
    </RevealRows>
  );
}

// ================= Group E — Motion-forward / novelty cards (41-50) =================
// The entrance/idle motion itself is the differentiator. Every reveal-gated
// effect below fires from that row's own animation completion — see the
// lesson noted at the top of this file.

// 41. Card flips in 3D (rotateY) to reveal the row, like a playing card being dealt
function V41() {
  return (
    <RevealRows rows={MOCK3} style={{ perspective: 700 }}
      initial={{ opacity: 0, rotateY: 100 }} animate={{ opacity: 1, rotateY: 0 }}
      transitionFor={(i) => ({ delay: i * 0.25, duration: 0.55, ease: 'easeOut' })}>
      {(row, i, revealed) => <CardFace row={row} revealed={revealed} />}
    </RevealRows>
  );
}

// 42. Card slides in from the side and slams to a stop with a small overshoot/bounce
function V42() {
  return (
    <RevealRows rows={MOCK3}
      initial={{ opacity: 0, x: -70 }} animate={{ opacity: 1, x: 0 }}
      transitionFor={(i) => ({ delay: i * 0.16, type: 'spring', stiffness: 500, damping: 14 })}>
      {(row, i, revealed) => <CardFace row={row} revealed={revealed} />}
    </RevealRows>
  );
}

// 43. Card assembles from fragments (a few pieces fly in and snap together)
function V43() {
  const [revealed, markRevealed] = useRevealTracking();
  return (
    <div className="flex flex-col gap-2">
      {MOCK3.map((row, i) => (
        <div key={row.rank} style={{ width: 220, height: 44, borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
          <motion.span initial={{ opacity: 0, x: -30, y: -14 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: i * 0.3, duration: 0.35 }}
            style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</motion.span>
          <motion.p className="truncate" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.3 + 0.08, duration: 0.35 }}
            style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</motion.p>
          <motion.div initial={{ opacity: 0, x: 30, y: 14 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ delay: i * 0.3 + 0.16, duration: 0.35 }}
            onAnimationComplete={() => markRevealed(row.rank)}>
            <PointsPill value={row.points} trigger={revealed.has(row.rank)} />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// 44. Card "deals" like a playing card with a slight arc trajectory and rotation
function V44() {
  return (
    <RevealRows rows={MOCK3}
      initial={{ opacity: 0, x: -150, y: 16, rotate: -18 }}
      animate={{ opacity: 1, x: 0, y: [16, -12, 0], rotate: 0 }}
      transitionFor={(i) => ({ delay: i * 0.28, duration: 0.6, ease: 'easeOut' })}>
      {(row, i, revealed) => <CardFace row={row} revealed={revealed} />}
    </RevealRows>
  );
}

// 45. Card pulses with a subtle idle breathing glow when it's the current user's row
function V45() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const isMe = row.rank === 2;
        return (
          <div>
            <motion.div
              animate={isMe ? { boxShadow: ['0 0 0px rgba(96,165,250,0)', '0 0 18px rgba(96,165,250,0.65)', '0 0 0px rgba(96,165,250,0)'] } : {}}
              transition={{ duration: 2.2, repeat: isMe ? Infinity : 0, ease: 'easeInOut' }}
              style={{ borderRadius: 14 }}>
              <CardFace row={row} revealed={revealed} style={isMe ? { border: '2px solid #60A5FA' } : {}} />
            </motion.div>
            {isMe && <div style={{ textAlign: 'center', fontSize: 9, color: '#60A5FA', marginTop: 2, fontWeight: 700 }}>אתה</div>}
          </div>
        );
      }}
    </RevealRows>
  );
}

// 46. Card has a scan-line sweep effect that plays once on reveal (sci-fi HUD)
function V46() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, borderRadius: 14, overflow: 'hidden' }}>
          <CardFace row={row} revealed={revealed} />
          {revealed && (
            <motion.div initial={{ y: '-120%' }} animate={{ y: '220%' }} transition={{ duration: 0.6, ease: 'easeIn' }}
              style={{ position: 'absolute', left: 0, right: 0, height: '45%', background: `linear-gradient(180deg, transparent, ${RANK_BORDER(row.rank)}77, transparent)`, pointerEvents: 'none' }} />
          )}
        </div>
      )}
    </RevealRows>
  );
}

// 47. Card grows from a single point (scale from 0 with the ghost rank number as the origin)
function V47() {
  return (
    <RevealRows rows={MOCK3} itemStyle={{ transformOrigin: '0% 50%' }}
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transitionFor={(i) => ({ delay: i * 0.25, type: 'spring', stiffness: 230, damping: 16 })}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), overflow: 'hidden', padding: '8px 14px 8px 40px' }}>
          <span style={{ position: 'absolute', left: 4, top: '50%', transform: 'translateY(-50%)', fontSize: 38, fontWeight: 900, color: RANK_COLOR(row.rank), opacity: 0.2, userSelect: 'none' }}>{row.rank}</span>
          <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, position: 'relative' }}>{row.name}</p>
          <span style={{ position: 'relative' }}><PointsPill value={row.points} trigger={revealed} /></span>
        </div>
      )}
    </RevealRows>
  );
}

// 48. Card's border materializes as a drawn line (stroke-dashoffset / pathLength draw-on)
function V48() {
  const [revealed, markRevealed] = useRevealTracking();
  return (
    <div className="flex flex-col gap-3">
      {MOCK3.map((row, i) => (
        <div key={row.rank} style={{ position: 'relative', width: 220, height: 50 }}>
          <svg width="220" height="50" style={{ position: 'absolute', inset: 0 }}>
            <motion.rect x="1" y="1" width="218" height="48" rx="10" fill="none" stroke={RANK_BORDER(row.rank)} strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: i * 0.3, duration: 0.7, ease: 'easeInOut' }}
              onAnimationComplete={() => markRevealed(row.rank)} />
          </svg>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.3 + 0.3, duration: 0.5 }}
            style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p></div>
            <PointsPill value={row.points} trigger={revealed.has(row.rank)} />
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// 49. Card content staggers in element-by-element (avatar, then name, then points)
function V49() {
  const [revealed, markRevealed] = useRevealTracking();
  return (
    <div className="flex flex-col gap-2">
      {MOCK3.map((row, i) => {
        const base = i * 0.35;
        return (
          <div key={row.rank} style={{ width: 220, height: 46, borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: base, duration: 0.3 }}
              style={{ width: 26, height: 26, borderRadius: '50%', background: RANK_BORDER(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 11, flexShrink: 0 }}>{row.name[0]}</motion.div>
            <motion.p className="truncate" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: base + 0.14, duration: 0.3 }}
              style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</motion.p>
            <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: base + 0.28, duration: 0.3 }}
              onAnimationComplete={() => markRevealed(row.rank)}>
              <PointsPill value={row.points} trigger={revealed.has(row.rank)} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

// 50. Card has a magnetic "settle" — overshoots past its resting position along both axes then eases back
function V50() {
  return (
    <RevealRows rows={MOCK3}
      initial={{ opacity: 0, x: -24, y: -24 }} animate={{ opacity: 1, x: 0, y: 0 }}
      transitionFor={(i) => ({ delay: i * 0.18, type: 'spring', stiffness: 260, damping: 10 })}>
      {(row, i, revealed) => <CardFace row={row} revealed={revealed} />}
    </RevealRows>
  );
}

const GROUPS = [
  { title: 'קבוצה A — צורות גיאומטריות לכרטיס', items: [
    ['1. הנוכחי (בסיס להשוואה)', 'המקבילית המוטה המקורית מ-LeaderboardPanel: מספר רפאים, ShineBorder ומסגרת צבועה לפי דרגה', V1],
    ['2. מלבן שטוח', 'בלי הטיה, פינות חדות', V2],
    ['3. מלבן מעוגל', 'רדיוס פינות נדיב, תחושת כרטיס רכה', V3],
    ['4. משושה', 'צורת hexagon עם clip-path', V4],
    ['5. גזיר כרטיס', 'חריצים חצי-עגולים בצדדים, כמו כרטיס קולנוע', V5],
    ['6. מגן/סמל מועדון', 'חלק עליון מעוגל, תחתית מחודדת בסגנון סמל', V6],
    ['7. פינה חתוכה', 'פינה אחת קטומה באלכסון', V7],
    ['8. סרט/באנר', 'זנב מחודד בצד אחד', V8],
    ['9. קשת עליונה', 'פינות עליונות מעוגלות, תחתית ישרה', V9],
    ['10. שברון/חץ', 'קצה מוביל מחודד, כמו שלט כיווני', V10],
  ]},
  { title: 'קבוצה B — פריסה וצפיפות מידע', items: [
    ['11. שורה קומפקטית', 'אווטאר+שם+ניקוד בשורה אחת, בלי מסגרת — רק קו מפריד', V11],
    ['12. שתי שורות מוערמות', 'שם למעלה, ניקוד ותג דרגה למטה, ממורכז', V12],
    ['13. אווטאר דומיננטי', 'אווטאר עגול גדול מצד אחד, שם וניקוד מוערמים לידו', V13],
    ['14. גיליון סטטיסטיקה', 'שם, ניקוד ונתון משני ברשת מיני דו-טורית', V14],
    ['15. פס השוואה', 'פס אופקי שאורכו יחסי לניקוד מול המוביל, שם על גביו', V15],
    ['16. תג זיהוי', 'כרטיס פורטרט עם חריץ קליפס למעלה, כמו תג עובד', V16],
    ['17. קלף איסוף', 'כרטיס פורטרט עם פס כותרת צבעוני ורגל סטטיסטיקה', V17],
    ['18. מדרגות פודיום', 'גובה הקצה משתנה לפי דרגה, כמו מדרגת פודיום', V18],
    ['19. שורת טקסט מינימלית', 'בלי רקע או מסגרת בכלל — רק היררכיית טיפוגרפיה', V19],
    ['20. כרטיס דו-גוני', 'חצי אחד בצבע לדרגה, חצי שני בגוון אחר לשם ולניקוד', V20],
  ]},
  { title: 'קבוצה C — טיפולי מדד דרגה (הכרטיס עצמו קבוע)', items: [
    ['21. מספר רפאים ענק', 'כמו הבסיס אך במיקום אחר — גולש מהקצה', V21],
    ['22. תג עגול מלא', 'תג מספר עגול וצבוע במקום המוביל', V22],
    ['23. סרט פינה אלכסוני', 'באנר אלכסוני בפינה העליונה עם מספר הדרגה', V23],
    ['24. מדליה לשלושת הראשונים', 'צורת מדליה מעוצבת, תג רגיל לשאר', V24],
    ['25. אייקון פודיום', 'עמודת פודיום מוטבעת לשלושת הראשונים', V25],
    ['26. טבעת התקדמות', 'טבעת דקה סביב האווטאר, מתמלאת לפי קרבה למוביל', V26],
    ['27. זר דפנה', 'מסגרת זר סביב האווטאר לשלושת הראשונים', V27],
    ['28. כתר אנימטיבי', 'כתר מעל השורה למקום הראשון בלבד, נכנס באנימציה', V28],
    ['29. גביע', 'סמל גביע לשלושת הראשונים, שבב מספר לשאר', V29],
    ['30. דירוג בכוכבים', '3/2/1 כוכבים לפי דרגה במקום מספר', V30],
  ]},
  { title: 'קבוצה D — משטח וחומר (צורה ופריסה קבועות)', items: [
    ['31. זכוכית מכוסה כפור', 'backdrop-blur כבד ושכבת לבן שקופה', V31],
    ['32. ניומורפיזם רך', 'צללים פנימיים/חיצוניים רכים, בלי מסגרת קשה', V32],
    ['33. קו נאון בלבד', 'מילוי שקוף ומסגרת זוהרת בסגנון HUD', V33],
    ['34. נצנוץ הולוגרפי', 'מעבר גרדיאנט צבעוני אנימטיבי, כמו נייר כסף של קלף', V34],
    ['35. מתכת מוברשת', 'גרדיאנט מטאלי עם ברק אלכסוני עדין', V35],
    ['36. צבע אחיד מאט', 'עיצוב שטוח לגמרי, בלי גרדיאנטים או זכוכית', V36],
    ['37. נייר/בד מרוקם', 'טקסטורת רעש עדינה וגוון קרם חמים', V37],
    ['38. עץ אצטדיון', 'טקסטורת סיבי עץ כמו ספסל יציע', V38],
    ['39. זכוכית סדוקה', 'קווי שבר דקורטיביים לרגע של ירידה בדרגה', V39],
    ['40. מסגרת מתכת נוזלית', 'גרדיאנט גבול אנימטיבי שמשנה גוון לאט', V40],
  ]},
  { title: 'קבוצה E — תנועה כמאפיין מרכזי', items: [
    ['41. היפוך תלת-ממד', 'הכרטיס מתהפך (rotateY) כמו חלוקת קלף', V41],
    ['42. החלקה עם קפיצה', 'נכנס מהצד ונעצר עם overshoot קל', V42],
    ['43. הרכבה מרסיסים', 'כמה חלקים עפים פנימה ומתחברים לשורה שלמה', V43],
    ['44. חלוקה בקשת', 'נכנס כמו חלוקת קלף — מסלול קשתי וסיבוב', V44],
    ['45. נשימה עדינה', 'זוהר פועם למשתמש הנוכחי (isCurrentUser)', V45],
    ['46. סריקת קו', 'אפקט סריקה חד-פעמי אחרי החשיפה, בסגנון HUD', V46],
    ['47. צמיחה מנקודה', 'קנה מידה מ-0 מתוך מיקום מספר הרפאים', V47],
    ['48. גבול מצויר', 'המסגרת מצטיירת כמו קו נמתח (stroke draw-on)', V48],
    ['49. הופעה איבר-איבר', 'אווטאר, אז שם, אז ניקוד — כל אחד בעיכוב משלו', V49],
    ['50. התיישבות מגנטית', 'overshoot בשני הצירים ואז התייצבות רכה', V50],
  ]},
];

export default function AdminLeaderboardCardDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 50 עיצובים לכרטיס משתתף בלוח התוצאות</h2>
        <p className="text-slate-500 text-sm">כולן חיות עם כפתור "הצג שוב". דאטה קבועה לדוגמה. כלי דמו בלבד — לא משפיע על LeaderboardPanel.jsx.</p>
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
