import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, Reorder } from 'framer-motion';
import {
  RefreshCw, Crown, Trophy, Star, Medal, ChevronDown, Eye, Share2, UserPlus, Heart, Check,
  TrendingUp, TrendingDown, Flame, Sparkles, Loader2, Sun, Moon, Zap, Award,
} from 'lucide-react';
import { ShineBorder } from '@/components/magicui/shine-border';
import OdometerValue from '@/components/OdometerValue';

// Demo-only: 150 alternative designs for the leaderboard participant card —
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

// ================= Groups F-J — genuinely interactive + high-craft (51-100) =================
// Shared rule kept from Groups A-E: any per-row hook state (useState/useRef/
// useMotionValue) lives EITHER at the top of the Vxx function (keyed by
// row.rank, read via closures inside the per-row renderer) OR inside a real
// standalone sub-component instance (e.g. TiltRow, PressHold) — never called
// directly inside the .map()-driven children callback of the same component,
// which would call hooks in a loop. Reveal-gated effects still key off each
// row's own onAnimationComplete (via RevealRows/markRevealed), never off
// mount-relative timers or IntersectionObserver.

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Detects a press held past `ms`. A real component instance per row (not a
// hook called inside a parent's .map), so its own timer ref is Rules-of-
// Hooks safe no matter how many rows render it.
function PressHold({ ms = 500, onHold, onTap, children, style }) {
  const timer = useRef(null);
  const fired = useRef(false);
  const start = () => { fired.current = false; timer.current = setTimeout(() => { fired.current = true; onHold?.(); }, ms); };
  const clear = () => { if (timer.current) clearTimeout(timer.current); };
  const release = () => { clear(); if (!fired.current) onTap?.(); };
  return (
    <div style={{ touchAction: 'manipulation', ...style }} onPointerDown={start} onPointerUp={release} onPointerLeave={clear}>
      {children}
    </div>
  );
}

// Rank + name + points row content, shared across Groups F-J so each variant
// only wires the interaction that's unique to it.
function IRow({ row, revealed, right, contentStyle }) {
  return (
    <div style={{ width: '100%', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', ...contentStyle }}>
      <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank), width: 18, flexShrink: 0 }}>{row.rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
      </div>
      {right !== undefined ? right : <PointsPill value={row.points} trigger={revealed} />}
    </div>
  );
}

function CardShell({ row, children, style, width = 220 }) {
  return (
    <div style={{ position: 'relative', width, borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

// ================= Group F — Tap / gesture interactions (51-60) =================

// 51. Tap-to-expand accordion — tapping a row expands it to reveal a stat breakdown, tap again to collapse
function V51() {
  const [open, setOpen] = useState(null);
  return (
    <RevealRows rows={MOCK3} gap={8}>
      {(row, i, revealed) => {
        const isOpen = open === row.rank;
        return (
          <motion.div layout onClick={() => setOpen(isOpen ? null : row.rank)} whileTap={{ scale: 0.97 }} style={{ cursor: 'pointer' }}>
            <CardShell row={row}>
              <IRow row={row} revealed={revealed} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PointsPill value={row.points} trigger={revealed} />
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                    <ChevronDown className="w-3.5 h-3.5" style={{ color: '#94a3b8' }} />
                  </motion.div>
                </div>
              } />
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, padding: '0 14px 10px' }}>
                      {[['ניחושים', 12 - row.rank], ['מדויקים', 6 - row.rank], ['רצף', row.rank === 1 ? 4 : 1]].map(([lbl, v]) => (
                        <div key={lbl} style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '4px 6px', textAlign: 'center' }}>
                          <div style={{ color: '#64748b', fontSize: 8 }}>{lbl}</div>
                          <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800 }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardShell>
          </motion.div>
        );
      }}
    </RevealRows>
  );
}

// 52. Long-press opens a small radial quick-action menu anchored to the row
function V52() {
  const [openRank, setOpenRank] = useState(null);
  const actions = [Eye, Share2, UserPlus];
  return (
    <RevealRows rows={MOCK3} gap={14}>
      {(row, i, revealed) => (
        <PressHold onHold={() => setOpenRank(row.rank)} style={{ position: 'relative' }}>
          <motion.div whileTap={{ scale: 0.97 }}>
            <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          </motion.div>
          <AnimatePresence>
            {openRank === row.rank && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenRank(null)}
                  style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
                {actions.map((Icon, idx) => {
                  const angle = -150 + idx * 60;
                  const rad = (angle * Math.PI) / 180;
                  const dist = 44;
                  return (
                    <motion.button key={idx}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                      animate={{ opacity: 1, x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18, delay: idx * 0.04 }}
                      onClick={() => setOpenRank(null)}
                      style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -14, marginTop: -14, width: 28, height: 28, borderRadius: '50%', background: RANK_BORDER(row.rank), border: '2px solid #0b1220', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 21, cursor: 'pointer' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: '#fff' }} />
                    </motion.button>
                  );
                })}
              </>
            )}
          </AnimatePresence>
        </PressHold>
      )}
    </RevealRows>
  );
}

// 53. Swipe-left-to-reveal action buttons behind the row (iOS-style), swipe back or tap elsewhere to close
function V53() {
  const [openRank, setOpenRank] = useState(null);
  return (
    <RevealRows rows={MOCK3} gap={8}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'flex-end', alignItems: 'stretch' }}>
            {[{ Icon: Eye, bg: '#3b82f6' }, { Icon: Heart, bg: '#ef4444' }].map(({ Icon, bg }, idx) => (
              <button key={idx} onClick={() => setOpenRank(null)} style={{ width: 46, background: bg, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Icon className="w-4 h-4" style={{ color: '#fff' }} />
              </button>
            ))}
          </div>
          <motion.div
            drag="x"
            dragConstraints={{ left: -92, right: 0 }}
            dragElastic={0.08}
            animate={{ x: openRank === row.rank ? -92 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            onDragEnd={(e, info) => setOpenRank(info.offset.x < -40 ? row.rank : null)}
            onClick={() => openRank === row.rank && setOpenRank(null)}
            style={{ position: 'relative' }}>
            <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          </motion.div>
        </div>
      )}
    </RevealRows>
  );
}

// 54. Double-tap "cheer" — a heart/burst particle animation plays and a cheer counter increments
function V54() {
  const [state, setState] = useState({});
  const lastTap = useRef({});
  const cheer = (rank) => {
    setState((prev) => {
      const cur = prev[rank] || { count: 0, bursts: [] };
      const id = Date.now() + Math.random();
      return { ...prev, [rank]: { count: cur.count + 1, bursts: [...cur.bursts, id] } };
    });
    setTimeout(() => {
      setState((prev) => {
        const cur = prev[rank];
        if (!cur) return prev;
        return { ...prev, [rank]: { ...cur, bursts: cur.bursts.slice(1) } };
      });
    }, 700);
  };
  const handleTap = (rank) => {
    const now = Date.now();
    if (now - (lastTap.current[rank] || 0) < 320) cheer(rank);
    lastTap.current[rank] = now;
  };
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const s = state[row.rank] || { count: 0, bursts: [] };
        return (
          <div onClick={() => handleTap(row.rank)} style={{ position: 'relative', cursor: 'pointer' }}>
            <CardShell row={row}>
              <IRow row={row} revealed={revealed} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Heart className="w-3.5 h-3.5" style={{ color: s.count > 0 ? '#f87171' : '#475569' }} fill={s.count > 0 ? '#f87171' : 'none'} />
                  <span style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700, minWidth: 12 }}>{s.count}</span>
                  <PointsPill value={row.points} trigger={revealed} />
                </div>
              } />
            </CardShell>
            <AnimatePresence>
              {s.bursts.map((id) => (
                <motion.div key={id} initial={{ opacity: 1, scale: 0.4, y: 0 }} animate={{ opacity: 0, scale: 1.6, y: -26 }} exit={{ opacity: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }}
                  style={{ position: 'absolute', right: 26, top: 8, pointerEvents: 'none' }}>
                  <Heart className="w-5 h-5" style={{ color: '#f87171' }} fill="#f87171" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 55. Tap the avatar to flip the whole card (3D rotateY) revealing a small stat card on the back, tap again to flip back
function V55() {
  const [flipped, setFlipped] = useState({});
  return (
    <RevealRows rows={MOCK3} style={{ perspective: 800 }}>
      {(row, i, revealed) => {
        const isFlipped = !!flipped[row.rank];
        return (
          <div style={{ width: 220, height: 54, position: 'relative' }}>
            <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden' }}>
                <CardShell row={row} style={{ height: '100%' }}>
                  <IRow row={row} revealed={revealed} right={
                    <button onClick={() => setFlipped((p) => ({ ...p, [row.rank]: true }))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <div style={{ width: 26, height: 26, borderRadius: '50%', background: RANK_BORDER(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 11 }}>{row.name[0]}</div>
                    </button>
                  } />
                </CardShell>
              </div>
              <div onClick={() => setFlipped((p) => ({ ...p, [row.rank]: false }))} style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', cursor: 'pointer' }}>
                <CardShell row={row} style={{ height: '100%' }}>
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 10px' }}>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: 8 }}>ניחושים</div><div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800 }}>{12 - row.rank}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: 8 }}>מדויקים</div><div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800 }}>{6 - row.rank}</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: 8 }}>רצף</div><div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 800 }}>{row.rank === 1 ? 4 : 1}🔥</div></div>
                  </div>
                </CardShell>
              </div>
            </motion.div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 56. Drag handle for reordering — grabbing and dragging a row reorders the list with a snap-to-slot on release
function V56() {
  const [rows, setRows] = useState(MOCK3);
  const [revealed, markRevealed] = useRevealTracking();
  return (
    <Reorder.Group axis="y" values={rows} onReorder={setRows} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 220, listStyle: 'none', padding: 0, margin: 0 }}>
      {rows.map((row, i) => (
        <Reorder.Item key={row.rank} value={row} whileDrag={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 10 }} style={{ listStyle: 'none' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }} onAnimationComplete={() => markRevealed(row.rank)}>
            <CardShell row={row}>
              <IRow row={row} revealed={revealed.has(row.rank)} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PointsPill value={row.points} trigger={revealed.has(row.rank)} />
                  <div style={{ cursor: 'grab', color: '#64748b', fontSize: 14, letterSpacing: -2 }}>⠿</div>
                </div>
              } />
            </CardShell>
          </motion.div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

// 57. Pull-to-refresh gesture at the top of the list — dragging down past a threshold spins then re-shuffles data, with a bounce-back
function V57() {
  const [rows, setRows] = useState(MOCK3);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [revealed, markRevealed] = useRevealTracking();
  const THRESHOLD = 54;
  return (
    <div style={{ width: 220 }}>
      <div style={{ display: 'flex', justifyContent: 'center', height: 28, alignItems: 'center' }}>
        <motion.div animate={{ rotate: refreshing ? 360 : Math.min(pull, THRESHOLD) * 3, opacity: pull > 4 || refreshing ? 1 : 0 }} transition={refreshing ? { duration: 0.6, repeat: Infinity, ease: 'linear' } : { duration: 0 }}>
          <Loader2 className="w-4 h-4" style={{ color: pull >= THRESHOLD || refreshing ? '#4ade80' : '#64748b' }} />
        </motion.div>
      </div>
      <motion.div
        drag="y"
        dragDirectionLock
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDrag={(e, info) => setPull(Math.max(0, info.offset.y))}
        onDragEnd={() => {
          if (pull >= THRESHOLD && !refreshing) {
            setRefreshing(true);
            setTimeout(() => { setRows(shuffle(MOCK3)); setRefreshing(false); }, 700);
          }
          setPull(0);
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((row, i) => (
          <motion.div key={row.rank} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.35 }} onAnimationComplete={() => markRevealed(row.rank)}>
            <CardShell row={row}><IRow row={row} revealed={revealed.has(row.rank)} /></CardShell>
          </motion.div>
        ))}
      </motion.div>
      <div style={{ textAlign: 'center', color: '#475569', fontSize: 9, marginTop: 4 }}>משוך מטה לרענון</div>
    </div>
  );
}

// 58. Press-and-hold shows a preview popover with more profile detail, released to dismiss
function V58() {
  const [open, setOpen] = useState(null);
  return (
    <RevealRows rows={MOCK3} gap={16}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative' }}>
          <PressHold onHold={() => setOpen(row.rank)}>
            <motion.div onPointerUp={() => setOpen(null)} onPointerLeave={() => setOpen(null)} whileTap={{ scale: 0.98 }}>
              <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
            </motion.div>
          </PressHold>
          <AnimatePresence>
            {open === row.rank && (
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.92 }} transition={{ duration: 0.2 }}
                style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8, width: 170, background: '#111a2b', border: `1px solid ${RANK_BORDER(row.rank)}`, borderRadius: 10, padding: 10, zIndex: 20, boxShadow: '0 10px 28px rgba(0,0,0,0.5)' }}>
                <p style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800, textAlign: 'center' }}>{row.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 6 }}>
                  <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: 8 }}>דרגה</div><div style={{ color: RANK_COLOR(row.rank), fontSize: 13, fontWeight: 900 }}>#{row.rank}</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: 8 }}>ניקוד</div><div style={{ color: '#4ade80', fontSize: 13, fontWeight: 900 }}>{row.points.toFixed(2)}</div></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </RevealRows>
  );
}

// 59. Tap-select two rows, then a "compare" button appears to open a side-by-side comparison view
function V59() {
  const [selected, setSelected] = useState([]);
  const [comparing, setComparing] = useState(false);
  const toggle = (rank) => {
    setComparing(false);
    setSelected((prev) => prev.includes(rank) ? prev.filter((r) => r !== rank) : prev.length < 2 ? [...prev, rank] : [prev[1], rank]);
  };
  const chosen = MOCK3.filter((r) => selected.includes(r.rank));
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RevealRows rows={MOCK3} gap={8}>
        {(row, i, revealed) => {
          const isSel = selected.includes(row.rank);
          return (
            <motion.div onClick={() => toggle(row.rank)} whileTap={{ scale: 0.97 }} animate={{ scale: isSel ? 1.03 : 1 }} style={{ cursor: 'pointer' }}>
              <CardShell row={row} style={{ borderColor: isSel ? '#4ade80' : RANK_BORDER(row.rank), boxShadow: isSel ? '0 0 0 2px rgba(74,222,128,0.4)' : 'none' }}>
                <IRow row={row} revealed={revealed} right={<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{isSel && <Check className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />}<PointsPill value={row.points} trigger={revealed} /></div>} />
              </CardShell>
            </motion.div>
          );
        }}
      </RevealRows>
      <AnimatePresence>
        {selected.length === 2 && !comparing && (
          <motion.button initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => setComparing(true)}
            style={{ alignSelf: 'center', fontSize: 11, fontWeight: 700, color: '#0b1220', background: '#4ade80', border: 'none', borderRadius: 999, padding: '5px 14px', cursor: 'pointer' }}>
            השווה ⚔️
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {comparing && chosen.length === 2 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
            {chosen.map((row) => (
              <div key={row.rank} style={{ flex: 1, borderRadius: 10, border: `1px solid ${RANK_BORDER(row.rank)}`, padding: 8, textAlign: 'center' }}>
                <p className="truncate" style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700 }}>{row.name}</p>
                <div style={{ color: '#4ade80', fontSize: 13, fontWeight: 900, marginTop: 2 }}>{row.points.toFixed(2)}</div>
                <div style={{ color: '#64748b', fontSize: 9 }}>#{row.rank}</div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 60. Swipe-right to bookmark/follow a row — a checkmark morphs in with a satisfying spring, swipe again to unfollow
function V60() {
  const [followed, setFollowed] = useState({});
  return (
    <RevealRows rows={MOCK3} gap={8}>
      {(row, i, revealed) => {
        const isFollowed = !!followed[row.rank];
        return (
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, info) => { if (info.offset.x > 50) setFollowed((p) => ({ ...p, [row.rank]: !p[row.rank] })); }}
            style={{ position: 'relative' }}>
            <CardShell row={row} style={{ borderColor: isFollowed ? '#4ade80' : RANK_BORDER(row.rank) }}>
              <IRow row={row} revealed={revealed} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PointsPill value={row.points} trigger={revealed} />
                  <motion.div initial={false} animate={{ scale: isFollowed ? 1 : 0, opacity: isFollowed ? 1 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    style={{ width: 18, height: 18, borderRadius: '50%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check className="w-3 h-3" style={{ color: '#0b1220' }} />
                  </motion.div>
                </div>
              } />
            </CardShell>
          </motion.div>
        );
      }}
    </RevealRows>
  );
}

// ================= Group G — Pointer/hover-driven polish (61-70) =================
// Each has a touch fallback: press/drag stands in for hover since there's no
// true hover on touch devices.

function TiltRow({ row, revealed }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 300, damping: 22 });
  const sry = useSpring(ry, { stiffness: 300, damping: 22 });
  const update = (clientX, clientY) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    ry.set(((clientX - rect.left) / rect.width - 0.5) * 18);
    rx.set(-((clientY - rect.top) / rect.height - 0.5) * 18);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref}
      onMouseMove={(e) => update(e.clientX, e.clientY)} onMouseLeave={reset}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) update(t.clientX, t.clientY); }} onTouchEnd={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 700 }}>
      <CardShell row={row}>
        <IRow row={row} revealed={revealed} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.18), transparent 60%)', pointerEvents: 'none' }} />
      </CardShell>
    </motion.div>
  );
}
// 61. 3D tilt-on-hover — the card tilts in perspective following cursor position, holographic-card feel (touch: follows the finger)
function V61() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <TiltRow row={row} revealed={revealed} />}</RevealRows>;
}

function SpotlightRow({ row, revealed }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50, on: false });
  const update = (clientX, clientY) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({ x: ((clientX - rect.left) / rect.width) * 100, y: ((clientY - rect.top) / rect.height) * 100, on: true });
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseMove={(e) => update(e.clientX, e.clientY)} onMouseLeave={() => setPos((p) => ({ ...p, on: false }))}
      onTouchStart={(e) => { const t = e.touches[0]; if (t) update(t.clientX, t.clientY); }}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) update(t.clientX, t.clientY); }}
      onTouchEnd={() => setPos((p) => ({ ...p, on: false }))}>
      <CardShell row={row}>
        <div style={{ position: 'absolute', inset: 0, opacity: pos.on ? 1 : 0, transition: 'opacity 0.2s', background: `radial-gradient(120px circle at ${pos.x}% ${pos.y}%, ${RANK_BORDER(row.rank)}55, transparent 70%)`, pointerEvents: 'none' }} />
        <IRow row={row} revealed={revealed} />
      </CardShell>
    </div>
  );
}
// 62. Magnetic cursor-follow spotlight glow beneath the cursor as it moves across the card (touch: follows the finger)
function V62() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <SpotlightRow row={row} revealed={revealed} />}</RevealRows>;
}

function SparkleRow({ row, revealed }) {
  const [sparks, setSparks] = useState([]);
  const lastAt = useRef(0);
  const spawn = (clientX, clientY, el) => {
    const now = Date.now();
    if (now - lastAt.current < 60) return;
    lastAt.current = now;
    const rect = el.getBoundingClientRect();
    const id = now + Math.random();
    setSparks((p) => [...p.slice(-8), { id, x: clientX - rect.left, y: clientY - rect.top }]);
    setTimeout(() => setSparks((p) => p.filter((s) => s.id !== id)), 550);
  };
  return (
    <div style={{ position: 'relative' }}
      onMouseMove={(e) => spawn(e.clientX, e.clientY, e.currentTarget)}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) spawn(t.clientX, t.clientY, e.currentTarget); }}>
      <CardShell row={row}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', pointerEvents: 'none' }}>
          <AnimatePresence>
            {sparks.map((s) => (
              <motion.div key={s.id} initial={{ opacity: 1, scale: 0.6, x: s.x, y: s.y }} animate={{ opacity: 0, scale: 1.2, y: s.y - 14 }} exit={{ opacity: 0 }} transition={{ duration: 0.55 }}
                style={{ position: 'absolute' }}>
                <Sparkles className="w-3 h-3" style={{ color: '#facc15' }} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <IRow row={row} revealed={revealed} />
      </CardShell>
    </div>
  );
}
// 63. Cursor-trailing sparkle particles while hovering over the card (touch: trails the finger while dragging)
function V63() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <SparkleRow row={row} revealed={revealed} />}</RevealRows>;
}

function ProxRow({ row, revealed, pointer }) {
  const ref = useRef(null);
  let lift = 0;
  if (pointer && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const dist = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2));
    lift = Math.max(0, 1 - dist / 220);
  }
  return (
    <motion.div ref={ref} animate={{ y: -lift * 8, boxShadow: `0 ${6 + lift * 18}px ${14 + lift * 26}px rgba(0,0,0,${0.15 + lift * 0.35})` }}
      whileTap={{ y: -8 }} transition={{ type: 'spring', stiffness: 300, damping: 26 }}>
      <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
    </motion.div>
  );
}
// 64. Card lifts (translateY + shadow grows) proportionally to how close the cursor is, before full hover (touch: lifts on press)
function V64() {
  const [pointer, setPointer] = useState(null);
  return (
    <div onMouseMove={(e) => setPointer({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setPointer(null)}>
      <RevealRows rows={MOCK3}>{(row, i, revealed) => <ProxRow row={row} revealed={revealed} pointer={pointer} />}</RevealRows>
    </div>
  );
}

function ChaseRow({ row, revealed }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setActive(true)} onHoverEnd={() => setActive(false)}
      onPointerDown={() => setActive(true)} onPointerUp={() => setActive(false)}
      style={{ position: 'relative', width: 220, borderRadius: 14, overflow: 'hidden' }}>
      <motion.div animate={active ? { rotate: 360 } : { rotate: 0 }} transition={active ? { duration: 1.6, repeat: Infinity, ease: 'linear' } : { duration: 0.3 }}
        style={{ position: 'absolute', inset: -40, background: `conic-gradient(from 0deg, transparent 0%, ${RANK_BORDER(row.rank)} 8%, transparent 18%)`, opacity: active ? 1 : 0, transition: 'opacity 0.25s' }} />
      <div style={{ position: 'relative', borderRadius: 12, background: RANK_BG(row.rank), margin: 2, border: `1px solid ${RANK_BORDER(row.rank)}55` }}>
        <IRow row={row} revealed={revealed} />
      </div>
    </motion.div>
  );
}
// 65. A light chases around the card's border perimeter continuously on hover (touch: on press-hold)
function V65() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <ChaseRow row={row} revealed={revealed} />}</RevealRows>;
}

function ParallaxRow({ row, revealed }) {
  const ref = useRef(null);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const update = (clientX, clientY) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    setOff({ x: ((clientX - rect.left) / rect.width - 0.5) * -10, y: ((clientY - rect.top) / rect.height - 0.5) * -10 });
  };
  return (
    <div ref={ref} style={{ position: 'relative' }}
      onMouseMove={(e) => update(e.clientX, e.clientY)} onMouseLeave={() => setOff({ x: 0, y: 0 })}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) update(t.clientX, t.clientY); }} onTouchEnd={() => setOff({ x: 0, y: 0 })}>
      <CardShell row={row} style={{ overflow: 'hidden' }}>
        <motion.div animate={{ x: off.x, y: off.y }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ position: 'absolute', inset: -10, background: `radial-gradient(60px circle at 30% 30%, ${RANK_BORDER(row.rank)}44, transparent 70%)`, pointerEvents: 'none' }} />
        <motion.div animate={{ x: off.x * 0.5, y: off.y * 0.5 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }} style={{ position: 'relative' }}>
          <IRow row={row} revealed={revealed} />
        </motion.div>
      </CardShell>
    </div>
  );
}
// 66. Subtle parallax — background layers inside the card shift opposite to cursor position for a depth effect (touch: shifts with finger drag)
function V66() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <ParallaxRow row={row} revealed={revealed} />}</RevealRows>;
}

function TooltipRow({ row, revealed }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onPointerDown={() => setShow((s) => !s)}>
      <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.18 }}
            style={{ position: 'absolute', top: -8, right: 8, transform: 'translateY(-100%)', background: '#111a2b', border: `1px solid ${RANK_BORDER(row.rank)}`, borderRadius: 8, padding: '5px 9px', fontSize: 10, color: '#e2e8f0', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}>
            {6 - row.rank} תחזיות מדויקות · רצף {row.rank === 1 ? 4 : 1}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// 67. Hover reveals a small "quick stats" tooltip anchored above the card (touch: tap toggles it)
function V67() {
  return <RevealRows rows={MOCK3} gap={20}>{(row, i, revealed) => <TooltipRow row={row} revealed={revealed} />}</RevealRows>;
}

function RippleRow({ row, revealed }) {
  const [ripples, setRipples] = useState([]);
  const onDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now() + Math.random();
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 650);
  };
  return (
    <div onPointerDown={onDown} style={{ position: 'relative', cursor: 'pointer' }}>
      <CardShell row={row} style={{ overflow: 'hidden' }}>
        <IRow row={row} revealed={revealed} />
        {ripples.map((r) => (
          <motion.span key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 5, opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ position: 'absolute', left: r.x - 8, top: r.y - 8, width: 16, height: 16, borderRadius: '50%', background: RANK_COLOR(row.rank), pointerEvents: 'none' }} />
        ))}
      </CardShell>
    </div>
  );
}
// 68. Material-design ripple expanding from the exact click/tap point
function V68() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <RippleRow row={row} revealed={revealed} />}</RevealRows>;
}

function ProxGlowRow({ row, revealed, pointer }) {
  const ref = useRef(null);
  let glow = 0;
  if (pointer && ref.current) {
    const rect = ref.current.getBoundingClientRect();
    const dist = Math.hypot(pointer.x - (rect.left + rect.width / 2), pointer.y - (rect.top + rect.height / 2));
    glow = Math.max(0, 1 - dist / 260);
  }
  const alpha = Math.round((0.15 + glow * 0.6) * 255).toString(16).padStart(2, '0');
  return (
    <div ref={ref} style={{ borderRadius: 14, transition: 'box-shadow 0.15s', boxShadow: `0 0 ${8 + glow * 30}px ${RANK_BORDER(row.rank)}${alpha}` }}>
      <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
    </div>
  );
}
// 69. Cursor-proximity glow — the card's glow brightens as the pointer approaches, even before it's directly hovering (touch: brightens on press)
function V69() {
  const [pointer, setPointer] = useState(null);
  return (
    <div onMouseMove={(e) => setPointer({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setPointer(null)}
      onTouchStart={(e) => { const t = e.touches[0]; if (t) setPointer({ x: t.clientX, y: t.clientY }); }} onTouchEnd={() => setPointer(null)}>
      <RevealRows rows={MOCK3}>{(row, i, revealed) => <ProxGlowRow row={row} revealed={revealed} pointer={pointer} />}</RevealRows>
    </div>
  );
}

function GhostPopRow({ row, revealed }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setActive(true)} onHoverEnd={() => setActive(false)}
      onPointerDown={() => setActive(true)} onPointerUp={() => setActive(false)}
      style={{ position: 'relative', width: 220, borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), overflow: 'hidden' }}>
      <span style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
        <motion.span animate={{ scale: active ? 1.35 : 1, opacity: active ? 0.32 : 0.16, x: active ? 4 : 0 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          style={{ display: 'inline-block', fontSize: 48, fontWeight: 900, color: RANK_COLOR(row.rank), filter: active ? `drop-shadow(0 6px 10px ${RANK_BORDER(row.rank)}aa)` : 'none' }}>
          {row.rank}
        </motion.span>
      </span>
      <IRow row={row} revealed={revealed} />
    </motion.div>
  );
}
// 70. Hovering makes the ghost rank number pop forward in simulated 3D — scale + shadow deepen (touch: on press)
function V70() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <GhostPopRow row={row} revealed={revealed} />}</RevealRows>;
}

// ================= Group H — Live/dynamic data-driven polish (71-80) =================

// 71. A floating "+X" text pops up and fades when a row's points increase (simulate a point change on tap)
function V71() {
  const [pops, setPops] = useState({});
  const bump = (rank) => {
    const id = Date.now() + Math.random();
    setPops((p) => ({ ...p, [rank]: [...(p[rank] || []), id] }));
    setTimeout(() => setPops((p) => ({ ...p, [rank]: (p[rank] || []).filter((x) => x !== id) })), 800);
  };
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div onClick={() => bump(row.rank)} style={{ position: 'relative', cursor: 'pointer' }}>
          <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          <AnimatePresence>
            {(pops[row.rank] || []).map((id) => (
              <motion.div key={id} initial={{ opacity: 0, y: 0, scale: 0.7 }} animate={{ opacity: [0, 1, 1, 0], y: -28, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                style={{ position: 'absolute', top: 6, right: 14, color: '#4ade80', fontSize: 13, fontWeight: 900, pointerEvents: 'none' }}>
                +1.50
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </RevealRows>
  );
}

// 72. A rank-change up/down arrow animates in when a row's position shifts (simulate a shuffle on tap/replay)
function V72() {
  const [rows, setRows] = useState(MOCK3);
  const [dirs, setDirs] = useState({});
  const shuffleNow = () => {
    setRows((prev) => {
      const arr = shuffle(prev);
      const nd = {};
      arr.forEach((r, i) => { const oldIdx = prev.findIndex((p) => p.rank === r.rank); nd[r.rank] = i < oldIdx ? 'up' : i > oldIdx ? 'down' : 'same'; });
      setDirs(nd);
      return arr;
    });
  };
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <motion.ul layout style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
        {rows.map((row) => (
          <motion.li layout key={row.rank} transition={{ type: 'spring', stiffness: 350, damping: 30 }} style={{ listStyle: 'none' }}>
            <CardShell row={row}>
              <IRow row={row} revealed={true} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {dirs[row.rank] === 'up' && <TrendingUp className="w-3.5 h-3.5" style={{ color: '#4ade80' }} />}
                  {dirs[row.rank] === 'down' && <TrendingDown className="w-3.5 h-3.5" style={{ color: '#f87171' }} />}
                  <PointsPill value={row.points} trigger={true} />
                </div>
              } />
            </CardShell>
          </motion.li>
        ))}
      </motion.ul>
      <button onClick={shuffleNow} style={{ alignSelf: 'center', fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>דמה שינוי דירוג</button>
    </div>
  );
}

// 73. A pulse/heartbeat ring plays on whichever row "just scored" (cycles through rows automatically)
function V73() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % MOCK3.length), 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative' }}>
          {i === activeIdx && (
            <motion.div key={activeIdx} initial={{ opacity: 0.6, scale: 1 }} animate={{ opacity: 0, scale: 1.25 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: -2, borderRadius: 16, border: `2px solid ${RANK_BORDER(row.rank)}`, pointerEvents: 'none' }} />
          )}
          <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
        </div>
      )}
    </RevealRows>
  );
}

// 74. A streak-flame icon that visually grows with a simulated consecutive-correct-predictions counter (tap to increment)
function V74() {
  const [streaks, setStreaks] = useState({ 1: 2, 2: 4, 3: 1 });
  const bump = (rank) => setStreaks((p) => ({ ...p, [rank]: (p[rank] || 0) + 1 }));
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const n = streaks[row.rank] || 0;
        const size = 14 + Math.min(n, 6) * 2;
        return (
          <div onClick={() => bump(row.rank)} style={{ cursor: 'pointer' }}>
            <CardShell row={row}>
              <IRow row={row} revealed={revealed} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <motion.div key={n} initial={{ scale: 0.7 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 12 }}>
                    <Flame style={{ color: '#fb923c', width: size, height: size }} fill="#fb923c" fillOpacity={0.4} />
                  </motion.div>
                  <span style={{ color: '#fb923c', fontSize: 11, fontWeight: 800 }}>{n}</span>
                  <PointsPill value={row.points} trigger={revealed} />
                </div>
              } />
            </CardShell>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 75. A fading "ghost trail" showing a row's recent rank movement (afterimage as it moves up/down on reorder)
function V75() {
  const [rows, setRows] = useState(MOCK3);
  const [trails, setTrails] = useState({});
  const posRef = useRef({});
  const shuffleNow = () => {
    setRows((prev) => {
      prev.forEach((r, i) => { posRef.current[r.rank] = i; });
      const arr = shuffle(prev);
      const nt = {};
      arr.forEach((r, i) => { const from = posRef.current[r.rank]; if (from !== i) nt[r.rank] = (from - i) * 62; });
      setTrails(nt);
      setTimeout(() => setTrails({}), 700);
      return arr;
    });
  };
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <motion.ul layout style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
        {rows.map((row) => (
          <motion.li layout key={row.rank} transition={{ type: 'spring', stiffness: 300, damping: 28 }} style={{ position: 'relative', listStyle: 'none' }}>
            {trails[row.rank] !== undefined && (
              <motion.div initial={{ opacity: 0.35, y: trails[row.rank] }} animate={{ opacity: 0, y: 0 }} transition={{ duration: 0.6 }}
                style={{ position: 'absolute', inset: 0, borderRadius: 14, background: RANK_BORDER(row.rank), pointerEvents: 'none' }} />
            )}
            <CardShell row={row}><IRow row={row} revealed={true} /></CardShell>
          </motion.li>
        ))}
      </motion.ul>
      <button onClick={shuffleNow} style={{ alignSelf: 'center', fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>דמה החלפת מקומות</button>
    </div>
  );
}

// 76. A small "👀 N watching" live indicator with an animated count that ticks
function V76() {
  const [counts, setCounts] = useState({ 1: 24, 2: 17, 3: 9 });
  useEffect(() => {
    const id = setInterval(() => {
      setCounts((p) => {
        const next = { ...p };
        const rank = 1 + Math.floor(Math.random() * 3);
        next[rank] = Math.max(3, next[rank] + (Math.random() > 0.5 ? 1 : -1));
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <CardShell row={row}>
          <IRow row={row} revealed={revealed} right={
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#7cadee', fontSize: 10, fontWeight: 700 }}>
                <Eye className="w-3 h-3" />
                <AnimatePresence mode="popLayout">
                  <motion.span key={counts[row.rank]} initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 6, opacity: 0 }} transition={{ duration: 0.2 }}>
                    {counts[row.rank]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <PointsPill value={row.points} trigger={revealed} />
            </div>
          } />
        </CardShell>
      )}
    </RevealRows>
  );
}

function ConfettiBurst({ color }) {
  const pieces = Array.from({ length: 14 });
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {pieces.map((_, idx) => {
        const angle = (idx / pieces.length) * Math.PI * 2;
        const dist = 40 + (idx % 3) * 14;
        return (
          <motion.span key={idx} initial={{ opacity: 1, x: 0, y: 0, scale: 1 }} animate={{ opacity: 0, x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 10, scale: 0.4, rotate: idx * 40 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.05 }}
            style={{ position: 'absolute', left: '50%', top: '50%', width: 5, height: 8, background: idx % 2 ? color : '#facc15', borderRadius: 1 }} />
        );
      })}
    </div>
  );
}
// 77. Confetti/particle burst plays automatically when a row reaches rank #1 (simulated promotion to #1 on replay)
function V77() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative' }}>
          <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          {row.rank === 1 && revealed && <ConfettiBurst color={RANK_BORDER(1)} />}
        </div>
      )}
    </RevealRows>
  );
}

// 78. Digit-diff flash — when points update (tap to simulate), only the changed digit(s) briefly flash before settling
function V78() {
  const [pts, setPts] = useState({ 1: 61.5, 2: 54.0, 3: 48.5 });
  const [prevPts, setPrevPts] = useState({ 1: 61.5, 2: 54.0, 3: 48.5 });
  const bump = (rank) => {
    setPrevPts((p) => ({ ...p, [rank]: pts[rank] }));
    setPts((p) => ({ ...p, [rank]: Math.round((p[rank] + 0.75) * 100) / 100 }));
  };
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const newStr = pts[row.rank].toFixed(2);
        const oldStr = prevPts[row.rank].toFixed(2);
        return (
          <div onClick={() => bump(row.rank)} style={{ cursor: 'pointer' }}>
            <CardShell row={row}>
              <IRow row={row} revealed={revealed} right={
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80' }}>
                  {newStr.split('').map((ch, idx) => (
                    <motion.span key={idx} animate={ch !== oldStr[idx] ? { color: ['#facc15', '#4ade80'] } : {}} transition={{ duration: 0.6 }} style={{ display: 'inline-block' }}>{ch}</motion.span>
                  ))}
                  {' Pts'}
                </span>
              } />
            </CardShell>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 79. A subtle pulsing connector line between two rows that are close in points ("close race" indicator)
function V79() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const isClose = row.rank === 2 || row.rank === 3;
        return (
          <div style={{ position: 'relative' }}>
            {row.rank === 2 && (
              <motion.div animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'absolute', left: 18, bottom: -12, width: 2, height: 16, background: '#f87171', zIndex: 5 }} />
            )}
            <CardShell row={row} style={{ borderColor: isClose ? '#f87171' : RANK_BORDER(row.rank) }}>
              <IRow row={row} revealed={revealed} right={
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {isClose && <Zap className="w-3 h-3" style={{ color: '#f87171' }} />}
                  <PointsPill value={row.points} trigger={revealed} />
                </div>
              } />
            </CardShell>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 80. A small auto-scrolling ticker strip embedded in the card showing recent mock match results affecting that player's score
function V80() {
  const results = ['⚽ ריאל מדריד 2-1 סיטי', '🟨 שער חסר - 45\'', '⚽ הניחוש נפגע', '📈 +2.5 נק\' השבוע'];
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <CardShell row={row}>
          <IRow row={row} revealed={revealed} />
          <div style={{ borderTop: `1px solid ${RANK_BORDER(row.rank)}33`, overflow: 'hidden', padding: '3px 0' }}>
            <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 9, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex', gap: 20, whiteSpace: 'nowrap', width: 'max-content' }}>
              {[...results, ...results].map((t, idx) => <span key={idx} style={{ fontSize: 9, color: '#94a3b8' }}>{t}</span>)}
            </motion.div>
          </div>
        </CardShell>
      )}
    </RevealRows>
  );
}

// ================= Group I — Tactile/haptic-style micro-feedback (visual proxies) (81-90) =================

// 81. A satisfying scale-squish "thump" plays on every tap, like a physical button press
function V81() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <motion.div whileTap={{ scale: 0.9 }} transition={{ type: 'spring', stiffness: 700, damping: 18 }} style={{ cursor: 'pointer' }}>
          <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
        </motion.div>
      )}
    </RevealRows>
  );
}

// 82. A brief shake + red flash plays for a simulated missed/incorrect prediction reveal (tap to simulate)
function V82() {
  const [missed, setMissed] = useState({});
  const trigger = (rank) => setMissed((p) => ({ ...p, [rank]: (p[rank] || 0) + 1 }));
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div onClick={() => trigger(row.rank)} style={{ position: 'relative', cursor: 'pointer' }}>
          <motion.div key={missed[row.rank] || 0} animate={missed[row.rank] ? { x: [0, -8, 8, -6, 6, -2, 2, 0] } : {}} transition={{ duration: 0.45 }}>
            <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          </motion.div>
          {!!missed[row.rank] && (
            <motion.div key={'flash' + missed[row.rank]} initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }}
              style={{ position: 'absolute', inset: 0, background: '#ef4444', borderRadius: 14, pointerEvents: 'none' }} />
          )}
        </div>
      )}
    </RevealRows>
  );
}

// 83. A coin-drop visual + bounce plays when points are added to a row (tap to add points)
function V83() {
  const [pts, setPts] = useState({ 1: 61.5, 2: 54.0, 3: 48.5 });
  const [coins, setCoins] = useState({});
  const add = (rank) => {
    setPts((p) => ({ ...p, [rank]: Math.round((p[rank] + 1.5) * 100) / 100 }));
    const id = Date.now();
    setCoins((p) => ({ ...p, [rank]: id }));
    setTimeout(() => setCoins((p) => (p[rank] === id ? { ...p, [rank]: null } : p)), 650);
  };
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div onClick={() => add(row.rank)} style={{ position: 'relative', cursor: 'pointer' }}>
          <CardShell row={row}>
            <IRow row={row} revealed={revealed} right={<span style={{ color: '#4ade80', fontSize: 12, fontWeight: 700 }}>{pts[row.rank].toFixed(2)} Pts</span>} />
          </CardShell>
          <AnimatePresence>
            {coins[row.rank] && (
              <motion.div key={coins[row.rank]} initial={{ y: -30, opacity: 1, rotate: 0 }} animate={{ y: [-30, 4, -2, 0], opacity: 1, rotate: 360 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{ position: 'absolute', right: 16, top: 4, width: 16, height: 16, borderRadius: '50%', background: '#facc15', border: '2px solid #ca8a04', pointerEvents: 'none' }} />
            )}
          </AnimatePresence>
        </div>
      )}
    </RevealRows>
  );
}

// 84. The current-user's row has a subtle idle "breathing" scale pulse to keep it findable at a glance
function V84() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const isMe = row.rank === 2;
        return (
          <motion.div animate={isMe ? { scale: [1, 1.025, 1] } : {}} transition={{ duration: 2.4, repeat: isMe ? Infinity : 0, ease: 'easeInOut' }}>
            <CardShell row={row} style={isMe ? { borderColor: '#60A5FA' } : {}}>
              <IRow row={row} revealed={revealed} right={<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>{isMe && <span style={{ fontSize: 8, color: '#60A5FA', fontWeight: 800 }}>אתה</span>}<PointsPill value={row.points} trigger={revealed} /></div>} />
            </CardShell>
          </motion.div>
        );
      }}
    </RevealRows>
  );
}

// 85. When the list re-sorts (button-triggered), rows animate into their new slots with a satisfying snap/settle, not just teleporting
function V85() {
  const [rows, setRows] = useState(MOCK3);
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <motion.ul layout style={{ display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
        {rows.map((row) => (
          <motion.li layout key={row.rank} transition={{ type: 'spring', stiffness: 380, damping: 26 }} style={{ listStyle: 'none' }}>
            <CardShell row={row}><IRow row={row} revealed={true} /></CardShell>
          </motion.li>
        ))}
      </motion.ul>
      <button onClick={() => setRows((r) => shuffle(r))} style={{ alignSelf: 'center', fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>מיין מחדש</button>
    </div>
  );
}

// 86. A radiant flash + checkmark replaces a raw number update as a "success chime" visual (tap to confirm)
function V86() {
  const [confirmed, setConfirmed] = useState({});
  const confirm = (rank) => {
    setConfirmed((p) => ({ ...p, [rank]: true }));
    setTimeout(() => setConfirmed((p) => ({ ...p, [rank]: false })), 900);
  };
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div onClick={() => confirm(row.rank)} style={{ cursor: 'pointer' }}>
          <CardShell row={row}>
            <IRow row={row} revealed={revealed} right={
              <AnimatePresence mode="wait">
                {confirmed[row.rank] ? (
                  <motion.div key="ok" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                    style={{ width: 20, height: 20, borderRadius: '50%', background: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(74,222,128,0.8)' }}>
                    <Check className="w-3 h-3" style={{ color: '#052e14' }} />
                  </motion.div>
                ) : (
                  <motion.div key="pts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PointsPill value={row.points} trigger={revealed} />
                  </motion.div>
                )}
              </AnimatePresence>
            } />
          </CardShell>
        </div>
      )}
    </RevealRows>
  );
}

// 87. Elastic drag-resistance visual (rubber-band effect) when trying to drag past the list's boundary
function V87() {
  return (
    <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.35} whileDrag={{ cursor: 'grabbing' }}
      style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(255,255,255,0.02)', borderRadius: 14, padding: 6 }}>
      <RevealRows rows={MOCK3}>{(row, i, revealed) => <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>}</RevealRows>
      <div style={{ textAlign: 'center', color: '#475569', fontSize: 9 }}>גררו למעלה/למטה כדי להרגיש את ה-rubber band</div>
    </motion.div>
  );
}

// 88. Rapid repeated taps make the top card "wobble" like jello — a playful easter egg, capped so it doesn't get silly
function V88() {
  const [tapCount, setTapCount] = useState(0);
  const wobble = Math.min(tapCount, 5);
  const onTap = () => setTapCount((c) => Math.min(c + 1, 5));
  useEffect(() => {
    if (tapCount === 0) return;
    const t = setTimeout(() => setTapCount(0), 900);
    return () => clearTimeout(t);
  }, [tapCount]);
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <motion.div onClick={row.rank === 1 ? onTap : undefined}
          animate={row.rank === 1 && wobble > 0 ? { rotate: [0, -wobble * 2, wobble * 1.6, -wobble, wobble * 0.6, 0], scale: [1, 1 + wobble * 0.01, 1] } : {}}
          transition={{ duration: 0.5 }} style={{ cursor: row.rank === 1 ? 'pointer' : 'default' }}>
          <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          {row.rank === 1 && <div style={{ textAlign: 'center', fontSize: 8, color: '#475569', marginTop: 2 }}>לחצו כמה פעמים ברצף 😄</div>}
        </motion.div>
      )}
    </RevealRows>
  );
}

// 89. A shimmering skeleton loading state morphs smoothly into the real revealed card (not an abrupt swap)
function V89() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1100); return () => clearTimeout(t); }, []);
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 46 }}>
          <AnimatePresence>
            {!loaded && (
              <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.4 }} style={{ position: 'absolute', inset: 0, borderRadius: 14, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: loaded ? 1 : 0 }} transition={{ duration: 0.5 }} style={{ position: 'absolute', inset: 0 }}>
            <CardShell row={row}><IRow row={row} revealed={revealed && loaded} /></CardShell>
          </motion.div>
        </div>
      )}
    </RevealRows>
  );
}

// 90. Tapping-and-releasing shows a brief "held" compressed state before releasing back, like a real button's press-travel
function V90() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <motion.div whileTap={{ scale: 0.95, y: 2 }} transition={{ duration: 0.12 }}
          style={{ width: 220, borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), cursor: 'pointer' }}>
          <IRow row={row} revealed={revealed} />
        </motion.div>
      )}
    </RevealRows>
  );
}

// ================= Group J — Advanced craft details (91-100) =================

// 91. Adaptive contrast — card visually adjusts its glow/text intensity based on a simulated "ambient brightness" toggle
function V91() {
  const [bright, setBright] = useState(false);
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RevealRows rows={MOCK3}>
        {(row, i, revealed) => (
          <div style={{ borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: bright ? 'rgba(255,255,255,0.9)' : RANK_BG(row.rank), boxShadow: bright ? `0 0 4px ${RANK_BORDER(row.rank)}55` : `0 0 16px ${RANK_BORDER(row.rank)}55`, transition: 'background 0.35s, box-shadow 0.35s' }}>
            <div style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: bright ? RANK_BORDER(row.rank) : RANK_COLOR(row.rank) }}>{row.rank}</span>
              <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: bright ? '#111827' : '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p></div>
              <PointsPill value={row.points} trigger={revealed} color={bright ? '#166534' : '#4ade80'} />
            </div>
          </div>
        )}
      </RevealRows>
      <button onClick={() => setBright((b) => !b)} style={{ alignSelf: 'center', display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>
        {bright ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />} {bright ? 'בהיר' : 'כהה'}
      </button>
    </div>
  );
}

function AvatarParallaxRow({ row, revealed }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20 });
  const avX = useTransform(sry, (v) => -v * 1.2);
  const avY = useTransform(srx, (v) => v * 1.2);
  const update = (clientX, clientY) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    ry.set(((clientX - rect.left) / rect.width - 0.5) * 14);
    rx.set(-((clientY - rect.top) / rect.height - 0.5) * 14);
  };
  const reset = () => { rx.set(0); ry.set(0); };
  return (
    <motion.div ref={ref}
      onMouseMove={(e) => update(e.clientX, e.clientY)} onMouseLeave={reset}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) update(t.clientX, t.clientY); }} onTouchEnd={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 600, width: 220, borderRadius: 14, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <motion.div style={{ x: avX, y: avY, width: 26, height: 26, borderRadius: '50%', background: RANK_BORDER(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 11, flexShrink: 0 }}>{row.name[0]}</motion.div>
      <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p></div>
      <PointsPill value={row.points} trigger={revealed} />
    </motion.div>
  );
}
// 92. Micro-parallax avatar — the avatar shifts slightly opposite to any card tilt/hover motion, adding depth (touch: follows the finger)
function V92() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <AvatarParallaxRow row={row} revealed={revealed} />}</RevealRows>;
}

// 93. Kinetic typography — the player name's letters spring in individually with a slight stagger and overshoot on reveal
function V93() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <CardShell row={row}>
          <div style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: RANK_COLOR(row.rank), width: 18, flexShrink: 0 }}>{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
              {row.name.split('').map((ch, ci) => (
                <motion.span key={ci} initial={{ opacity: 0, y: 10, scale: 0.5 }} animate={revealed ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ delay: ci * 0.035, type: 'spring', stiffness: 400, damping: 12 }}
                  style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600, display: 'inline-block', whiteSpace: 'pre' }}>{ch}</motion.span>
              ))}
            </div>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </CardShell>
      )}
    </RevealRows>
  );
}

// 94. Dynamic accent color — the card's accent color is sampled/derived from a mock "avatar dominant color" per row, distinct per person
const AVATAR_ACCENTS = { 'דניאל כהן': '#f97316', 'נועה לוי': '#ec4899', 'איתי מזרחי': '#22d3ee', 'שירה בן דוד': '#a78bfa' };
function V94() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const accent = AVATAR_ACCENTS[row.name] || '#7cadee';
        return (
          <div style={{ width: 220, borderRadius: 14, border: `2px solid ${accent}`, background: `linear-gradient(135deg, ${accent}22, ${accent}0d)`, padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 10, flexShrink: 0 }}>{row.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p></div>
            <PointsPill value={row.points} trigger={revealed} color={accent} />
          </div>
        );
      }}
    </RevealRows>
  );
}

// 95. Elegant smart truncation — an overflowing tag list truncates with an expandable "…ועוד N" footer that expands smoothly
function V95() {
  const EXTRA = { 1: ["פרמייר ליג", "צ'מפיונס ליג", 'גביע המדינה'], 2: ['פרמייר ליג', 'קונפרנס ליג'], 3: ["צ'מפיונס ליג"] };
  const [open, setOpen] = useState({});
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const extra = EXTRA[row.rank] || [];
        const isOpen = !!open[row.rank];
        return (
          <CardShell row={row}>
            <IRow row={row} revealed={revealed} />
            {extra.length > 0 && (
              <div style={{ padding: '0 14px 8px' }}>
                {isOpen ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {extra.map((tag) => <span key={tag} style={{ fontSize: 8.5, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 6px' }}>{tag}</span>)}
                  </motion.div>
                ) : (
                  <button onClick={() => setOpen((p) => ({ ...p, [row.rank]: true }))} style={{ fontSize: 9, color: RANK_COLOR(row.rank), background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    …ועוד {extra.length}
                  </button>
                )}
              </div>
            )}
          </CardShell>
        );
      }}
    </RevealRows>
  );
}

// 96. A polished empty-state / loading skeleton with a subtle rotating tip or light joke text while "loading" (demo-only mock delay)
function V96() {
  const tips = ['טוען נתונים מהיציע האחורי…', 'סופר גולים... שוב...', 'מיישר את המקבילית 😅', 'כמעט מוכנים!'];
  const [tipIdx, setTipIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setTipIdx((t) => (t + 1) % tips.length), 700);
    const done = setTimeout(() => { setLoaded(true); clearInterval(id); }, 2200);
    return () => { clearInterval(id); clearTimeout(done); };
  }, []);
  return (
    <div style={{ width: 220, minHeight: 120, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence mode="wait">
        {!loaded ? (
          <motion.div key="loading" exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[0, 1, 2].map((idx) => (
              <div key={idx} style={{ height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', position: 'relative' }}>
                <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.1, repeat: Infinity, ease: 'linear', delay: idx * 0.1 }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)' }} />
              </div>
            ))}
            <AnimatePresence mode="wait">
              <motion.p key={tipIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}
                style={{ textAlign: 'center', color: '#64748b', fontSize: 9.5 }}>{tips[tipIdx]}</motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div key="loaded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RevealRows rows={MOCK3}>{(row, i, revealed) => <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>}</RevealRows>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 97. Adaptive density — the card compresses to a denser single-line layout during fast scroll (simulate via a scroll-speed toggle)
function V97() {
  const [dense, setDense] = useState(false);
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RevealRows rows={MOCK3} gap={dense ? 4 : 8}>
        {(row, i, revealed) => (
          <motion.div layout transition={{ duration: 0.3 }} style={{ width: 220, borderRadius: dense ? 8 : 14, border: `${dense ? 1 : 2}px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), overflow: 'hidden' }}>
            <motion.div layout style={{ padding: dense ? '3px 10px' : '9px 14px', display: 'flex', alignItems: 'center', gap: dense ? 6 : 10 }}>
              <span style={{ fontSize: dense ? 10 : 14, fontWeight: 900, color: RANK_COLOR(row.rank), width: dense ? 12 : 18, flexShrink: 0 }}>{row.rank}</span>
              <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#e2e8f0', fontSize: dense ? 10.5 : 13, fontWeight: 600 }}>{row.name}</p></div>
              <PointsPill value={row.points} trigger={revealed} size={dense ? 9 : 12} />
            </motion.div>
          </motion.div>
        )}
      </RevealRows>
      <button onClick={() => setDense((d) => !d)} style={{ alignSelf: 'center', fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>
        {dense ? 'מצב רגיל' : 'דמה גלילה מהירה'}
      </button>
    </div>
  );
}

// 98. A crisp animated focus-ring for keyboard navigation (Tab to focus a row), styled in the row's rank color — genuinely keyboard-operable
function V98() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const cls = `v98-r${row.rank}`;
        return (
          <div tabIndex={0} role="button" className={cls} style={{ borderRadius: 14, outline: 'none' }}>
            <style>{`.${cls}:focus-visible { box-shadow: 0 0 0 3px ${RANK_BORDER(row.rank)}, 0 0 16px ${RANK_BORDER(row.rank)}aa; border-radius: 14px; }`}</style>
            <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 99. A prefers-reduced-motion-aware variant that visibly shows both states via a toggle — full motion vs. the graceful reduced-motion fallback
function V99() {
  const [reduced, setReduced] = useState(false);
  return (
    <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <RevealRows key={String(reduced)} rows={MOCK3}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        transitionFor={(i) => reduced ? { delay: 0, duration: 0.2 } : { delay: i * 0.15, type: 'spring', stiffness: 300, damping: 16 }}>
        {(row, i, revealed) => <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>}
      </RevealRows>
      <button onClick={() => setReduced((r) => !r)} style={{ alignSelf: 'center', fontSize: 10, color: '#94a3b8', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '4px 12px', cursor: 'pointer' }}>
        {reduced ? 'תנועה מלאה' : 'prefers-reduced-motion'}
      </button>
    </div>
  );
}

// 100. A one-of-a-kind "signature" flourish reserved for rank #1 only — an animated medal-mint wax-seal stamp, distinct from other rank treatments
function V100() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative' }}>
          <CardShell row={row}><IRow row={row} revealed={revealed} /></CardShell>
          {row.rank === 1 && revealed && (
            <motion.div initial={{ scale: 2.2, opacity: 0, rotate: -18 }} animate={{ scale: 1, opacity: 1, rotate: -12 }} transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.15 }}
              style={{ position: 'absolute', right: -10, top: -10, width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #fde68a, #ca8a04 70%)', border: '2px solid #92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.5)', zIndex: 5 }}>
              <Award className="w-4 h-4" style={{ color: '#78350f' }} />
            </motion.div>
          )}
        </div>
      )}
    </RevealRows>
  );
}

// ================= Group K — Football/stadium thematic skins (101-110) =================

const LED_FONT = "'Courier New', monospace";

// 101. Stadium jumbotron/scoreboard card — pixelated LED-style digit font, stadium-light glow.
function V101() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, padding: '9px 14px', borderRadius: 6, background: '#04120a', border: `2px solid ${RANK_BORDER(row.rank)}`, backgroundImage: 'radial-gradient(rgba(34,197,94,0.12) 1px, transparent 1px)', backgroundSize: '4px 4px', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 10 }}>
          <motion.div animate={{ opacity: [0.4, 0.9, 0.4] }} transition={{ duration: 2.2, repeat: Infinity }}
            style={{ position: 'absolute', inset: 0, background: `radial-gradient(120px circle at 10% 0%, ${RANK_BORDER(row.rank)}30, transparent 70%)`, pointerEvents: 'none' }} />
          <span style={{ position: 'relative', fontFamily: LED_FONT, fontSize: 16, fontWeight: 900, color: RANK_COLOR(row.rank), textShadow: `0 0 6px ${RANK_BORDER(row.rank)}` }}>{row.rank}</span>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ fontFamily: LED_FONT, color: '#8effc0', fontSize: 12, fontWeight: 700, textShadow: '0 0 5px #22c55e' }}>{row.name}</p>
          </div>
          <span style={{ position: 'relative' }}><PointsPill value={row.points} trigger={revealed} color="#8effc0" /></span>
        </div>
      )}
    </RevealRows>
  );
}

// 102. Football jersey card — name/number styled like the back of a jersey, subtle fabric-weave texture, team-stripe accent.
function V102() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, padding: '10px 14px 10px 20px', borderRadius: 10, background: RANK_BG(row.rank), border: `2px solid ${RANK_BORDER(row.rank)}`, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 2px, transparent 2px 4px)', display: 'flex', alignItems: 'center', gap: 12, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, background: `repeating-linear-gradient(180deg, ${RANK_BORDER(row.rank)} 0 6px, #0b1220 6px 12px)` }} />
          <span style={{ fontSize: 24, fontWeight: 900, color: '#fff', WebkitTextStroke: `1px ${RANK_BORDER(row.rank)}`, fontFamily: 'Arial, sans-serif' }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 103. Trading-card foil-pack reveal — the card appears to tear out of a foil pack wrapper on first render, settling into a sports trading-card layout.
function V103() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 56 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden', border: `2px solid ${RANK_BORDER(row.rank)}` }}>
            <CardFace row={row} revealed={revealed} style={{ width: '100%', height: '100%', border: 'none', borderRadius: 0 }} />
          </div>
          <motion.div
            initial={{ x: 0, rotate: 0, opacity: 1 }}
            animate={{ x: 260, rotate: 24, opacity: 0 }}
            transition={{ delay: i * 0.18 + 0.3, duration: 0.55, ease: 'easeIn' }}
            style={{ position: 'absolute', inset: 0, borderRadius: 10, backgroundImage: 'linear-gradient(120deg,#c0c0c0,#f5f5f5 30%,#8a8a8a 55%,#e8e8e8 80%)', backgroundSize: '250% 250%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <Sparkles className="w-5 h-5" style={{ color: '#0b1220' }} />
          </motion.div>
        </div>
      )}
    </RevealRows>
  );
}

function RefWhistle({ color }) {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
      <circle cx="4" cy="5" r="4" stroke={color} strokeWidth="1.3" />
      <path d="M8 5H13.5" stroke={color} strokeWidth="1.3" />
      <path d="M13.5 2.5V7.5" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}
// 104. Referee-card parody — yellow/red card silhouette shape, a small whistle icon accent (playful, not literal penalty framing).
function V104() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const cardColor = row.rank === 2 ? '#ef4444' : '#facc15';
        return (
          <div style={{ width: 200, borderRadius: 4, background: cardColor, transform: 'rotate(-2deg)', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#1e1b1b' }}>{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="truncate" style={{ color: '#1e1b1b', fontSize: 12.5, fontWeight: 800 }}>{row.name}</p>
            </div>
            <RefWhistle color="#1e1b1b" />
            <PointsPill value={row.points} trigger={revealed} color="#1e1b1b" />
          </div>
        );
      }}
    </RevealRows>
  );
}

function PitchLines({ color }) {
  return (
    <svg style={{ position: 'absolute', inset: 0 }} viewBox="0 0 220 56" preserveAspectRatio="none">
      <rect x="2" y="2" width="216" height="52" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      <line x1="110" y1="2" x2="110" y2="54" stroke={color} strokeWidth="1" opacity="0.35" />
      <circle cx="110" cy="28" r="10" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      <rect x="2" y="14" width="18" height="28" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
      <rect x="200" y="14" width="18" height="28" fill="none" stroke={color} strokeWidth="1" opacity="0.35" />
    </svg>
  );
}
// 105. Pitch-view card — a miniature football-pitch line diagram as the card's background, with a marker dot showing the player's rank position on the pitch.
function V105() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const mx = 14 + ((row.rank - 1) / 3) * 190;
        return (
          <div style={{ position: 'relative', width: 220, height: 56, borderRadius: 10, background: '#0d2818', border: `2px solid ${RANK_BORDER(row.rank)}`, overflow: 'hidden' }}>
            <PitchLines color="#4ade80" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: revealed ? 1 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              style={{ position: 'absolute', left: mx, top: 24, width: 8, height: 8, borderRadius: '50%', background: RANK_COLOR(row.rank), boxShadow: `0 0 8px ${RANK_BORDER(row.rank)}` }} />
            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{row.rank}</span>
              <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#e2e8f0', fontSize: 12.5, fontWeight: 700 }}>{row.name}</p></div>
              <PointsPill value={row.points} trigger={revealed} />
            </div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 106. Substitution board card — electronic sub-board LED-digit look (like the boards refs hold up).
function V106() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, borderRadius: 6, background: '#1a1a1a', border: '3px solid #333', padding: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#000', borderRadius: 4, padding: '4px 8px', border: '1px solid #ef4444' }}>
            <span style={{ fontFamily: LED_FONT, fontSize: 20, fontWeight: 900, color: '#ef4444', textShadow: '0 0 8px #ef4444' }}>{String(row.rank).padStart(2, '0')}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ color: '#e5e5e5', fontSize: 11.5, fontWeight: 700, fontFamily: LED_FONT }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} color="#ef4444" size={11} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 107. Locker-room nameplate card — brushed-metal plate texture with the name looking engraved/debossed.
function V107() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '10px 16px', borderRadius: 4, backgroundImage: 'linear-gradient(135deg,#9199a3 0%,#c7ccd3 25%,#7d838d 50%,#c7ccd3 75%,#9199a3 100%)', border: '1px solid #5c6169', boxShadow: '0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#3a3f47', textShadow: '0 1px 0 rgba(255,255,255,0.5)' }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ color: '#2b2f35', fontSize: 13, fontWeight: 800, textShadow: '0 1px 0 rgba(255,255,255,0.45), 0 -1px 0 rgba(0,0,0,0.25)', textTransform: 'uppercase', letterSpacing: 1 }}>{row.name}</p>
          </div>
          <PointsPill value={row.points} trigger={revealed} color="#1e3a24" />
        </div>
      )}
    </RevealRows>
  );
}

// 108. Match-day ticket stub — perforated edge on one side, a small barcode-style stripe.
function V108() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 224, display: 'flex', borderRadius: 8, overflow: 'hidden', border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank) }}>
          <div style={{ flex: 1, minWidth: 0, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank), flexShrink: 0 }}>{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 700 }}>{row.name}</p></div>
            <PointsPill value={row.points} trigger={revealed} size={10} />
          </div>
          <div style={{ position: 'relative', width: 40, borderInlineStart: `1.5px dashed ${RANK_BORDER(row.rank)}77`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 0' }}>
            <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#050a12' }} />
            <div style={{ position: 'absolute', bottom: -7, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#050a12' }} />
            <div style={{ display: 'flex', gap: 1 }}>{[2, 1, 3, 1, 2, 1, 3].map((w, idx) => <div key={idx} style={{ width: w, height: 22, background: RANK_COLOR(row.rank) }} />)}</div>
          </div>
        </div>
      )}
    </RevealRows>
  );
}

function TacticsDiagram({ color }) {
  return (
    <svg style={{ position: 'absolute', inset: 0, opacity: 0.5 }} viewBox="0 0 220 56" preserveAspectRatio="none">
      <circle cx="40" cy="40" r="5" fill="none" stroke={color} strokeWidth="1.2" />
      <text x="36" y="18" fontSize="9" fill={color}>X</text>
      <path d="M40 35 L100 15" stroke={color} strokeWidth="1" strokeDasharray="3 2" fill="none" />
      <circle cx="100" cy="15" r="5" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M100 20 L170 40" stroke={color} strokeWidth="1" strokeDasharray="3 2" fill="none" />
    </svg>
  );
}
// 109. Tactics-board card — chalkboard/whiteboard texture with a simple X-O tactical diagram line as background art.
function V109() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 56, borderRadius: 8, background: '#1b3327', border: '3px solid #5b3a22', overflow: 'hidden' }}>
          <TacticsDiagram color="#e2e8f0" />
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px' }}>
            <span style={{ fontFamily: "'Comic Sans MS', cursive", fontSize: 15, fontWeight: 900, color: '#fff' }}>{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0 }}><p className="truncate" style={{ color: '#f1f5f9', fontFamily: "'Comic Sans MS', cursive", fontSize: 12.5, fontWeight: 700 }}>{row.name}</p></div>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 110. Championship-belt plate — for rank 1 specifically, a belt-plate shape (wide center medallion) as the card frame; other ranks use a simpler consistent shape.
function V110() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        if (row.rank === 1) {
          return (
            <div style={{ position: 'relative', width: 240, height: 70 }}>
              <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(15% 0,85% 0,100% 30%,100% 70%,85% 100%,15% 100%,0 70%,0 30%)', background: 'linear-gradient(135deg,#fde68a,#ca8a04 50%,#fde68a)', border: '2px solid #92400e' }} />
              <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '0 26px' }}>
                <Trophy className="w-5 h-5" style={{ color: '#78350f', flexShrink: 0 }} />
                <div style={{ textAlign: 'center', minWidth: 0 }}>
                  <p className="truncate" style={{ color: '#3a2205', fontSize: 12.5, fontWeight: 900 }}>{row.name}</p>
                  <PointsPill value={row.points} trigger={revealed} color="#3a2205" />
                </div>
                <Trophy className="w-5 h-5" style={{ color: '#78350f', flexShrink: 0 }} />
              </div>
            </div>
          );
        }
        return <PlainCard row={row} revealed={revealed} rankSlot={<PlainRankBadge rank={row.rank} />} width={200} />;
      }}
    </RevealRows>
  );
}

// ================= Group L — Typography-led design (111-120) =================

// 111. Oversized rank numeral dominates the card, name rendered small beneath it.
function V111() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 150, textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: RANK_COLOR(row.rank) }}>{row.rank}</div>
          <p className="truncate" style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600, marginTop: 2 }}>{row.name}</p>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 112. Newspaper-headline style — serif display type for the name, a thin column rule, "breaking news" energy.
function V112() {
  return (
    <RevealRows rows={MOCK3} direction="row" gap={2}>
      {(row, i, revealed) => (
        <div style={{ width: 130, padding: '4px 10px', borderInlineStart: i > 0 ? '1px solid #475569' : 'none' }}>
          <div style={{ fontSize: 8, letterSpacing: 1.5, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 2 }}>מהדורה מיוחדת</div>
          <p className="truncate" style={{ fontFamily: 'Georgia, serif', color: '#f1f5f9', fontSize: 15, fontWeight: 900, lineHeight: 1.15 }}>{row.name}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, borderTop: '1px solid #475569', paddingTop: 3 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 10, color: '#94a3b8' }}>#{row.rank}</span>
            <PointsPill value={row.points} trigger={revealed} size={10} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 113. Neon marquee sign — letterforms styled like glowing tube-light signage, with a flicker-on entrance.
function V113() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: [0, 1, 0.4, 1, 0.6, 1] } : { opacity: 0 }}
          transition={{ duration: 0.6, times: [0, 0.2, 0.35, 0.5, 0.65, 1] }}
          style={{ width: 220, padding: '10px 14px', borderRadius: 10, background: '#0a0612', border: `1px solid ${RANK_BORDER(row.rank)}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', textShadow: `0 0 6px #fff, 0 0 14px ${RANK_BORDER(row.rank)}, 0 0 28px ${RANK_BORDER(row.rank)}` }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: RANK_COLOR(row.rank), fontSize: 14, fontWeight: 800, textShadow: `0 0 6px ${RANK_BORDER(row.rank)}, 0 0 16px ${RANK_BORDER(row.rank)}` }}>{row.name}</p>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#f472b6', textShadow: '0 0 6px #f472b6, 0 0 14px #f472b6' }}>{row.points.toFixed(2)}</span>
        </motion.div>
      )}
    </RevealRows>
  );
}

// 114. Handwritten signature-style name (script-style font treatment) for a personal, autographed feel.
function V114() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ fontFamily: "'Brush Script MT', cursive", color: '#e2e8f0', fontSize: 22, lineHeight: 1, transform: 'rotate(-3deg)', transformOrigin: 'right center' }}>{row.name}</p>
          </div>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 115. Monospace terminal/hacker aesthetic — green-on-black, blinking cursor after the name.
function V115() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 6, background: '#020604', border: '1px solid #16a34a', display: 'flex', alignItems: 'center', gap: 8, fontFamily: LED_FONT }}>
          <span style={{ color: '#22c55e', fontSize: 12 }}>&gt;</span>
          <span style={{ color: '#4ade80', fontSize: 12 }}>rank_{row.rank}:</span>
          <span className="truncate" style={{ flex: 1, minWidth: 0, color: '#86efac', fontSize: 12 }}>{row.name}</span>
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }} style={{ width: 6, height: 12, background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
          <PointsPill value={row.points} trigger={revealed} color="#4ade80" size={11} />
        </div>
      )}
    </RevealRows>
  );
}

// 116. Variable font-weight breathing — the name's font-weight subtly oscillates (400↔800) as an idle animation.
function V116() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
          <motion.p className="truncate" animate={{ fontWeight: [400, 800, 400] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 14 }}>{row.name}</motion.p>
          <PointsPill value={row.points} trigger={revealed} />
        </div>
      )}
    </RevealRows>
  );
}

// 117. Vertical rotated label running along one edge of the card (rank or a category tag, rotated 90°).
function V117() {
  return (
    <RevealRows rows={MOCK3} direction="row" gap={10}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 150, height: 60, borderRadius: 10, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: 22, background: RANK_BORDER(row.rank), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ transform: 'rotate(-90deg)', whiteSpace: 'nowrap', color: '#fff', fontSize: 9, fontWeight: 900, letterSpacing: 1 }}>דרגה #{row.rank}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: '0 10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} size={10} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 118. Letterpress engraved typography — subtle inset/emboss shadow making text look pressed into the surface.
function V118() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '10px 14px', borderRadius: 10, background: '#2b3446', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#5b6577', textShadow: '0 1px 1px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.08)' }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#5b6577', fontSize: 14, fontWeight: 800, textShadow: '0 1px 1px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.08)' }}>{row.name}</p>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ duration: 0.3 }}
            style={{ fontSize: 12, fontWeight: 800, color: '#4a5568', textShadow: '0 1px 1px rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.08)' }}>{row.points.toFixed(2)} Pts</motion.span>
        </div>
      )}
    </RevealRows>
  );
}

// 119. Marquee auto-scroll for long names — text scrolls horizontally like a ticker when it overflows.
function V119() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const longName = `${row.name} — מוביל בדירוג השבועי`;
        return (
          <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank), flexShrink: 0 }}>{row.rank}</span>
            <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <motion.div animate={{ x: [0, -130] }} transition={{ duration: 4, repeat: Infinity, repeatType: 'loop', ease: 'linear' }} style={{ whiteSpace: 'nowrap', color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>
                {longName}
              </motion.div>
            </div>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        );
      }}
    </RevealRows>
  );
}

// 120. Bold condensed jersey-numeral font specifically for the points value, contrasting with a lighter name font.
function V120() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 300, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#cbd5e1', fontSize: 13, fontWeight: 300 }}>{row.name}</p>
          <span style={{ fontStretch: 'condensed', fontFamily: 'Arial Narrow, sans-serif' }}>
            <PointsPill value={row.points} trigger={revealed} size={18} />
          </span>
        </div>
      )}
    </RevealRows>
  );
}

// ================= Group M — Gamification / RPG-inspired (121-130) =================

// 121. XP progress bar — points rendered as a fill bar progressing toward the next rank threshold, RPG level-up framing.
function V121() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const next = MOCK4[Math.max(0, row.rank - 2)]?.points ?? row.points + 10;
        const pct = Math.min(100, Math.round((row.points / next) * 100));
        return (
          <div style={{ width: 220, padding: '9px 14px', borderRadius: 10, border: `2px solid ${RANK_BORDER(row.rank)}`, background: '#161225' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
              <span style={{ color: '#fbbf24', fontSize: 10, fontWeight: 900, flexShrink: 0 }}>LVL {row.rank}</span>
              <p className="truncate" style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 700, minWidth: 0 }}>{row.name}</p>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: revealed ? `${pct}%` : 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg,#a78bfa,#fbbf24)' }} />
            </div>
            <div style={{ textAlign: 'left', marginTop: 3 }}><PointsPill value={row.points} trigger={revealed} color="#fbbf24" size={10} /></div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 122. Achievement badge shelf — a small row of earned icon badges displayed beneath the name.
function V122() {
  const badgesByRank = { 1: [Trophy, Star, Flame], 2: [Medal, Star], 3: [Medal] };
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            {(badgesByRank[row.rank] || []).map((Icon, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0 }} animate={revealed ? { opacity: 1, scale: 1 } : {}} transition={{ delay: idx * 0.1, type: 'spring', stiffness: 400, damping: 14 }}
                style={{ width: 18, height: 18, borderRadius: 5, background: 'rgba(250,204,21,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon className="w-3 h-3" style={{ color: '#facc15' }} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 123. Segmented health-bar style points display, RPG HUD aesthetic.
function V123() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const segs = 10;
        const filled = Math.round((row.points / MOCK4[0].points) * segs);
        return (
          <div style={{ width: 220, padding: '9px 14px', borderRadius: 10, background: '#1a0f0f', border: `2px solid ${RANK_BORDER(row.rank)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <p className="truncate" style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 800 }}>{row.name}</p>
              <span style={{ color: '#94a3b8', fontSize: 10 }}>#{row.rank}</span>
            </div>
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: segs }).map((_, idx) => (
                <motion.div key={idx} initial={{ opacity: 0.15 }} animate={{ opacity: revealed && idx < filled ? 1 : 0.15 }} transition={{ delay: idx * 0.03 }}
                  style={{ flex: 1, height: 10, background: idx < filled ? '#ef4444' : 'rgba(255,255,255,0.1)', borderRadius: 1 }} />
              ))}
            </div>
            <div style={{ textAlign: 'left', marginTop: 3 }}><PointsPill value={row.points} trigger={revealed} color="#ef4444" size={10} /></div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 124. Loot-rarity border — border color/glow intensity coded like game item rarity tiers (common/rare/epic/legendary) mapped to rank.
const RARITY = { 1: { color: '#f59e0b', label: 'אגדי' }, 2: { color: '#a855f7', label: 'אפי' }, 3: { color: '#3b82f6', label: 'נדיר' }, 4: { color: '#9ca3af', label: 'רגיל' } };
function V124() {
  return (
    <RevealRows rows={MOCK4}>
      {(row, i, revealed) => {
        const r = RARITY[row.rank] || RARITY[4];
        return (
          <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `2px solid ${r.color}`, background: `${r.color}14`, boxShadow: `0 0 ${row.rank === 1 ? 20 : 8}px ${r.color}66`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 8, fontWeight: 900, color: r.color, border: `1px solid ${r.color}`, borderRadius: 4, padding: '1px 4px', flexShrink: 0 }}>{r.label}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} color={r.color} />
          </div>
        );
      }}
    </RevealRows>
  );
}

// 125. "LEVEL UP" burst — when points update (simulate on tap/replay), a game-style level-up flash and banner plays.
function V125() {
  const [lvl, setLvl] = useState({});
  const [burst, setBurst] = useState(null);
  const levelUp = (rank) => {
    setLvl((p) => ({ ...p, [rank]: (p[rank] || 0) + 1 }));
    setBurst(rank);
    setTimeout(() => setBurst((b) => (b === rank ? null : b)), 900);
  };
  return (
    <RevealRows rows={MOCK3} gap={16}>
      {(row, i, revealed) => (
        <div onClick={() => levelUp(row.rank)} style={{ position: 'relative', cursor: 'pointer' }}>
          <CardShell row={row}>
            <IRow row={row} revealed={revealed} right={<span style={{ color: '#fbbf24', fontSize: 11, fontWeight: 800 }}>LVL {(lvl[row.rank] || 0) + row.rank}</span>} />
          </CardShell>
          <AnimatePresence>
            {burst === row.rank && (
              <motion.div initial={{ opacity: 0, scale: 0.6, y: 0 }} animate={{ opacity: 1, scale: 1.15, y: -20 }} exit={{ opacity: 0, y: -34 }} transition={{ duration: 0.4 }}
                style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', background: '#fbbf24', color: '#1a0f00', fontWeight: 900, fontSize: 11, padding: '3px 10px', borderRadius: 999, boxShadow: '0 0 20px rgba(251,191,36,0.9)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                LEVEL UP! ⭐
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </RevealRows>
  );
}

// 126. Skill-tree node — the card styled as one connected node in a tree diagram, with faint connector lines to adjacent ranks.
function V126() {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 22 }}>
      <svg style={{ position: 'absolute', left: 100, top: 0, width: 2, height: '100%' }}><line x1="1" y1="0" x2="1" y2="100%" stroke="#475569" strokeWidth="2" strokeDasharray="3 3" /></svg>
      <RevealRows rows={MOCK3} gap={22}>
        {(row, i, revealed) => (
          <div style={{ position: 'relative', display: 'flex', justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}>
            <div style={{ width: 170, borderRadius: 999, border: `2px solid ${RANK_BORDER(row.rank)}`, background: RANK_BG(row.rank), padding: '7px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
              <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 11.5, fontWeight: 700 }}>{row.name}</p>
              <PointsPill value={row.points} trigger={revealed} size={10} />
            </div>
          </div>
        )}
      </RevealRows>
    </div>
  );
}

// 127. Quest-log parchment entry — aged paper/scroll texture styled row.
function V127() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 4, backgroundImage: 'radial-gradient(rgba(120,90,40,0.08) 1px, transparent 1px), linear-gradient(135deg,#e8d9b5,#d8c395)', backgroundSize: '3px 3px, auto', border: '2px solid #8a6d3b', boxShadow: '0 3px 8px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontWeight: 900, color: '#5c3d1e' }}>{row.rank}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="truncate" style={{ fontFamily: 'Georgia, serif', color: '#4a2e12', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 9, color: '#8a6d3b' }}>משימה הושלמה ✓</span>
          </div>
          <PointsPill value={row.points} trigger={revealed} color="#5c3d1e" />
        </div>
      )}
    </RevealRows>
  );
}

// 128. Character-sheet stat block — RPG-style labeled stat rows (points as one "stat" among a small mock stat block).
function V128() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 210, padding: '9px 12px', borderRadius: 10, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: '#12172a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, gap: 8 }}>
            <p className="truncate" style={{ color: '#e2e8f0', fontSize: 12.5, fontWeight: 800, minWidth: 0 }}>{row.name}</p>
            <span style={{ color: RANK_COLOR(row.rank), fontSize: 11, fontWeight: 900, flexShrink: 0 }}>#{row.rank}</span>
          </div>
          {[['STR', 8 - row.rank], ['LUK', 10 - row.rank * 2], ['PTS', null]].map(([lbl, v]) => (
            <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
              <span>{lbl}</span>
              {v === null ? <PointsPill value={row.points} trigger={revealed} size={10} /> : <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{v}</span>}
            </div>
          ))}
        </div>
      )}
    </RevealRows>
  );
}

// 129. Boss-battle health bar — dramatic, oversized bar treatment reserved for rank 1 only.
function V129() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        if (row.rank !== 1) return <PlainCard row={row} revealed={revealed} rankSlot={<PlainRankBadge rank={row.rank} />} width={200} />;
        return (
          <div style={{ width: 220, padding: '10px 14px', borderRadius: 10, background: '#1a0808', border: '2px solid #ef4444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
              <span style={{ color: '#ef4444', fontSize: 10, fontWeight: 900, letterSpacing: 1, flexShrink: 0 }}>👑 BOSS</span>
              <p className="truncate" style={{ color: '#fff', fontSize: 12, fontWeight: 900, minWidth: 0 }}>{row.name}</p>
            </div>
            <div style={{ height: 12, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', border: '1px solid #7f1d1d' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: revealed ? '100%' : 0 }} transition={{ duration: 0.9, ease: 'easeOut' }}
                style={{ height: '100%', background: 'linear-gradient(90deg,#ef4444,#f87171)' }} />
            </div>
            <div style={{ textAlign: 'left', marginTop: 3 }}><PointsPill value={row.points} trigger={revealed} color="#f87171" /></div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 130. Coin-counter points display — a small stack of coin icons plus a running counter, arcade-currency feel.
function V130() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const coins = Math.min(5, Math.max(1, Math.round(row.points / 15)));
        return (
          <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${RANK_BORDER(row.rank)}55`, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {Array.from({ length: coins }).map((_, idx) => (
                <motion.div key={idx} initial={{ opacity: 0, y: -8 }} animate={revealed ? { opacity: 1, y: 0 } : {}} transition={{ delay: idx * 0.06 }}
                  style={{ width: 12, height: 12, borderRadius: '50%', background: '#facc15', border: '1.5px solid #ca8a04', marginInlineStart: idx > 0 ? -5 : 0 }} />
              ))}
            </div>
            <PointsPill value={row.points} trigger={revealed} color="#facc15" size={11} />
          </div>
        );
      }}
    </RevealRows>
  );
}

// ================= Group N — Extreme minimalism (131-140) =================

// 131. Borderless, colorless row — pure whitespace/alignment/type-scale carries all hierarchy, no boxes or accent color at all.
function V131() {
  return (
    <RevealRows rows={MOCK3} gap={14}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', gap: 14, padding: '2px 0' }}>
          <span style={{ fontSize: 13, color: '#94a3b8', width: 14 }}>{row.rank}</span>
          <span className="truncate" style={{ flex: 1, minWidth: 0, fontSize: 14, color: '#f1f5f9', fontWeight: row.rank === 1 ? 700 : 400 }}>{row.name}</span>
          <PointsPill value={row.points} trigger={revealed} color="#f1f5f9" size={12} />
        </div>
      )}
    </RevealRows>
  );
}

// 132. Single accent dot — one small color-coded dot is the ENTIRE rank indicator, no badge/number shape.
function V132() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: RANK_COLOR(row.rank), flexShrink: 0 }} />
          <span className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13 }}>{row.name}</span>
          <PointsPill value={row.points} trigger={revealed} size={11} />
        </div>
      )}
    </RevealRows>
  );
}

// 133. Underline-only rank cue — a colored underline beneath the name, no badge at all.
function V133() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 2px' }}>
          <span className="truncate" style={{ color: '#e2e8f0', fontSize: 13.5, paddingBottom: 2, borderBottom: `2px solid ${RANK_COLOR(row.rank)}` }}>{row.name}</span>
          <PointsPill value={row.points} trigger={revealed} size={11} />
        </div>
      )}
    </RevealRows>
  );
}

function GrayRow({ row, revealed }) {
  const [active, setActive] = useState(false);
  return (
    <div onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} onPointerDown={() => setActive(true)} onPointerUp={() => setActive(false)}
      style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1px solid ${active ? RANK_BORDER(row.rank) : '#475569'}`, background: active ? RANK_BG(row.rank) : 'rgba(255,255,255,0.03)', transition: 'border-color 0.25s, background 0.25s', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 900, color: active ? RANK_COLOR(row.rank) : '#64748b', transition: 'color 0.25s' }}>{row.rank}</span>
      <p className="truncate" style={{ flex: 1, minWidth: 0, color: active ? '#e2e8f0' : '#94a3b8', fontSize: 13, fontWeight: 600, transition: 'color 0.25s' }}>{row.name}</p>
      <PointsPill value={row.points} trigger={revealed} color={active ? '#4ade80' : '#64748b'} />
    </div>
  );
}
// 134. Monochrome/grayscale by default — color only appears on hover/tap interaction.
function V134() {
  return <RevealRows rows={MOCK3}>{(row, i, revealed) => <GrayRow row={row} revealed={revealed} />}</RevealRows>;
}

// 135. Pure line-art / outline-icon only card — nothing filled anywhere.
function V135() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, border: `1.5px solid ${RANK_BORDER(row.rank)}`, background: 'transparent', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${RANK_COLOR(row.rank)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: RANK_COLOR(row.rank) }}>{row.rank}</span>
          </div>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{row.name}</p>
          <PointsPill value={row.points} trigger={revealed} color={RANK_COLOR(row.rank)} />
        </div>
      )}
    </RevealRows>
  );
}

// 136. Ultra-compact micro-row — icon + 2-digit points only, built for very dense long lists.
function V136() {
  return (
    <RevealRows rows={MOCK3} gap={2}>
      {(row, i, revealed) => (
        <div style={{ width: 140, display: 'flex', alignItems: 'center', gap: 6, padding: '2px 4px' }}>
          <span style={{ fontSize: 9, color: RANK_COLOR(row.rank), width: 10, flexShrink: 0 }}>{row.rank}</span>
          <span className="truncate" style={{ flex: 1, minWidth: 0, fontSize: 9.5, color: '#cbd5e1' }}>{row.name}</span>
          <PointsPill value={Math.round(row.points)} trigger={revealed} size={9} />
        </div>
      )}
    </RevealRows>
  );
}

// 137. Text-shadow-only depth — no boxes, borders, or fills at all, depth conveyed purely through typographic shadow.
function V137() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', gap: 10, padding: '6px 4px' }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#cbd5e1', textShadow: '0 2px 3px rgba(0,0,0,0.7)' }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#f1f5f9', fontSize: 14, fontWeight: 800, textShadow: '0 3px 6px rgba(0,0,0,0.7)' }}>{row.name}</p>
          <PointsPill value={row.points} trigger={revealed} color="#f1f5f9" />
        </div>
      )}
    </RevealRows>
  );
}

// 138. Hairline-divider spreadsheet row — plain table-row aesthetic, deliberately unstyled/utilitarian.
function V138() {
  return (
    <RevealRows rows={MOCK3} gap={0}>
      {(row, i, revealed) => (
        <div style={{ width: 220, display: 'flex', alignItems: 'center', padding: '5px 4px', borderBottom: '1px solid #334155', fontFamily: 'Arial, sans-serif' }}>
          <span style={{ width: 24, fontSize: 11, color: '#94a3b8' }}>{row.rank}</span>
          <span className="truncate" style={{ flex: 1, minWidth: 0, fontSize: 11, color: '#e2e8f0' }}>{row.name}</span>
          <PointsPill value={row.points} trigger={revealed} color="#94a3b8" size={11} />
        </div>
      )}
    </RevealRows>
  );
}

// 139. Whisper-glow — an extremely subtle (near-imperceptible, ~2% opacity) accent glow, minimalism taken to its edge.
function V139() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ width: 220, padding: '9px 14px', borderRadius: 12, background: `radial-gradient(120px circle at 20% 50%, ${RANK_BORDER(row.rank)}05, transparent 70%)`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, color: '#e2e8f0' }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13 }}>{row.name}</p>
          <PointsPill value={row.points} trigger={revealed} color="#e2e8f0" />
        </div>
      )}
    </RevealRows>
  );
}

// 140. Negative-space rank — the rank number is cut OUT of the card as a hole/window, revealing the background through it, rather than printed on top.
function V140() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 54 }}>
          <svg width="220" height="54" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <mask id={`hole-${row.rank}`}>
                <rect width="220" height="54" fill="white" />
                <text x="26" y="40" fontSize="36" fontWeight="900" fill="black">{row.rank}</text>
              </mask>
            </defs>
            <rect width="220" height="54" rx="12" fill={RANK_BORDER(row.rank)} mask={`url(#hole-${row.rank})`} />
          </svg>
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 0 66px' }}>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e2e8f0', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// ================= Group O — Maximalism / ornate / novelty (141-150) =================

function BaroqueCorner({ style }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ position: 'absolute', ...style }}>
      <path d="M2 18 Q2 2 18 2 Q10 2 8 8 Q6 14 2 18" stroke="#d4af37" strokeWidth="1.4" fill="none" />
      <circle cx="4" cy="16" r="1.4" fill="#d4af37" />
    </svg>
  );
}
// 141. Baroque ornamental frame — scrollwork corner flourishes bordering the card.
function V141() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, padding: '10px 16px', borderRadius: 10, border: '1.5px solid #d4af37', background: 'linear-gradient(135deg,#1c1206,#2c1d0c)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BaroqueCorner style={{ top: -2, left: -2 }} />
          <BaroqueCorner style={{ top: -2, right: -2, transform: 'scaleX(-1)' }} />
          <BaroqueCorner style={{ bottom: -2, left: -2, transform: 'scaleY(-1)' }} />
          <BaroqueCorner style={{ bottom: -2, right: -2, transform: 'scale(-1,-1)' }} />
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 900, color: '#d4af37' }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, fontFamily: 'Georgia, serif', color: '#f3e6c8', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
          <PointsPill value={row.points} trigger={revealed} color="#d4af37" />
        </div>
      )}
    </RevealRows>
  );
}

// 142. Art-deco geometric — gold linework, symmetrical fan/sunburst pattern accents.
function V142() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 56, borderRadius: 4, border: '1.5px solid #d4af37', background: '#0e0e12', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', left: -10, top: -10 }} width="70" height="70" viewBox="0 0 70 70">
            {Array.from({ length: 6 }).map((_, idx) => (
              <line key={idx} x1="10" y1="10" x2={10 + Math.cos((idx / 5) * Math.PI / 2) * 40} y2={10 + Math.sin((idx / 5) * Math.PI / 2) * 40} stroke="#d4af3755" strokeWidth="1.5" />
            ))}
          </svg>
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px 0 34px' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#d4af37' }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#f1f5f9', fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} color="#d4af37" />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 143. Stained-glass card — segmented color panels separated by dark "leading" lines, like a stained-glass window.
function V143() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 56, borderRadius: 8, overflow: 'hidden', border: '3px solid #1a1a1a', background: '#1a1a1a' }}>
          <div style={{ position: 'absolute', inset: 2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: '#1a1a1a' }}>
            <div style={{ background: '#7c3aed99' }} /><div style={{ background: '#0ea5e999' }} /><div style={{ background: '#eab30899' }} />
          </div>
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', textShadow: '0 0 4px #000' }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#fff', fontSize: 13, fontWeight: 700, textShadow: '0 0 4px #000' }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 144. Circuit-board card — PCB trace-pattern background, tech-novelty aesthetic.
function V144() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 56, borderRadius: 6, background: '#062b1a', border: '2px solid #10b981', overflow: 'hidden' }}>
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.5 }} viewBox="0 0 220 56">
            <path d="M0 10 H60 V30 H140 V10 H220 M40 56 V40 H100 V56 M180 0 V20 H160 V56" stroke="#10b981" strokeWidth="1" fill="none" />
            {[[60, 10], [140, 30], [100, 40], [160, 20]].map(([x, y], idx) => <circle key={idx} cx={x} cy={y} r="2" fill="#34d399" />)}
          </svg>
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
            <span style={{ fontFamily: LED_FONT, fontSize: 13, fontWeight: 900, color: '#34d399' }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, fontFamily: LED_FONT, color: '#a7f3d0', fontSize: 12, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} color="#34d399" />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 145. Constellation/star-map — the name connects via thin lines to small "star" points representing the score, night-sky styled.
function V145() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        const stars = Math.min(6, Math.max(2, Math.round(row.points / 12)));
        return (
          <div style={{ position: 'relative', width: 220, height: 60, borderRadius: 10, background: 'radial-gradient(ellipse at 30% 20%, #1e1b4b, #0a0a1a)', border: '1px solid #312e81', overflow: 'hidden' }}>
            <svg style={{ position: 'absolute', inset: 0 }} width="220" height="60">
              {Array.from({ length: stars }).map((_, idx) => {
                const x = 130 + idx * 14;
                const y = 15 + (idx % 2) * 20;
                return (
                  <g key={idx}>
                    <line x1={26} y1={30} x2={x} y2={y} stroke="#6366f1" strokeWidth="0.6" opacity={revealed ? 0.5 : 0} style={{ transition: `opacity 0.4s ${idx * 0.08}s` }} />
                    <motion.circle cx={x} cy={y} r="1.8" fill="#c7d2fe" initial={{ opacity: 0 }} animate={{ opacity: revealed ? [0.4, 1, 0.4] : 0 }} transition={{ delay: idx * 0.08, duration: 1.8, repeat: Infinity }} />
                  </g>
                );
              })}
            </svg>
            <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px' }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#c7d2fe', flexShrink: 0 }}>{row.rank}</span>
              <p className="truncate" style={{ maxWidth: 90, color: '#e0e7ff', fontSize: 11.5, fontWeight: 700 }}>{row.name}</p>
              <div style={{ marginInlineStart: 'auto' }}><PointsPill value={row.points} trigger={revealed} color="#a5b4fc" size={10} /></div>
            </div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 146. Royal wax-seal decree — parchment background with an animated wax-seal stamp effect, reserved for rank 1.
function V146() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => {
        if (row.rank !== 1) return <PlainCard row={row} revealed={revealed} rankSlot={<PlainRankBadge rank={row.rank} />} width={200} />;
        return (
          <div style={{ position: 'relative', width: 220, padding: '10px 14px', borderRadius: 4, background: '#e8d9b5', border: '2px solid #8a6d3b', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="truncate" style={{ fontFamily: 'Georgia, serif', color: '#3d2b13', fontSize: 14, fontWeight: 900 }}>{row.name}</p>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 9, color: '#6b4f24' }}>המלך של הליגה</span>
            </div>
            <PointsPill value={row.points} trigger={revealed} color="#5c3d1e" />
            <motion.div initial={{ scale: 0, rotate: -40 }} animate={{ scale: revealed ? 1 : 0, rotate: -14 }} transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 14 }}
              style={{ position: 'absolute', right: -6, top: -6, width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #b91c1c, #7f1d1d 70%)', border: '2px solid #450a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(0,0,0,0.5)' }}>
              <Crown className="w-3.5 h-3.5" style={{ color: '#fca5a5' }} />
            </motion.div>
          </div>
        );
      }}
    </RevealRows>
  );
}

// 147. Vintage postage-stamp — perforated-edge border framing the whole card like a stamp.
function V147() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 210, padding: '10px 14px' }}>
          <div style={{ position: 'absolute', inset: -8, backgroundImage: 'radial-gradient(circle, #050a12 3px, transparent 3.5px)', backgroundSize: '11px 11px' }} />
          <div style={{ position: 'absolute', inset: 0, background: '#f5eee0', border: '1px solid #a8987a' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: 13, fontWeight: 900, color: '#5c4a2e' }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, fontFamily: 'Georgia, serif', color: '#3d3220', fontSize: 12.5, fontWeight: 700 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} color="#5c4a2e" />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 148. Graffiti/street-art — spray-paint texture background, bold tag-style lettering for the name.
function V148() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, padding: '10px 14px', borderRadius: 8, background: 'radial-gradient(circle at 20% 30%, #ec489944, transparent 40%), radial-gradient(circle at 80% 70%, #22d3ee44, transparent 40%), #14141a', border: `2px solid ${RANK_BORDER(row.rank)}`, display: 'flex', alignItems: 'center', gap: 10, transform: 'rotate(-1deg)' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#facc15', WebkitTextStroke: '1px #000', transform: 'rotate(-6deg)', display: 'inline-block' }}>{row.rank}</span>
          <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#f472b6', fontSize: 15, fontWeight: 900, fontStyle: 'italic', WebkitTextStroke: '0.5px #000' }}>{row.name}</p>
          <PointsPill value={row.points} trigger={revealed} color="#22d3ee" />
        </div>
      )}
    </RevealRows>
  );
}

function BubbleField({ color }) {
  const bubbles = [
    { x: 20, size: 4, dur: 3.2, delay: 0 }, { x: 60, size: 3, dur: 2.6, delay: 0.4 },
    { x: 110, size: 5, dur: 3.6, delay: 0.8 }, { x: 150, size: 3, dur: 2.8, delay: 0.2 },
    { x: 190, size: 4, dur: 3.1, delay: 0.6 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {bubbles.map((b, idx) => (
        <motion.div key={idx} initial={{ y: 60, opacity: 0 }} animate={{ y: -70, opacity: [0, 0.8, 0] }} transition={{ duration: b.dur, repeat: Infinity, delay: b.delay, ease: 'easeIn' }}
          style={{ position: 'absolute', left: b.x, bottom: 0, width: b.size, height: b.size, borderRadius: '50%', background: color, border: `1px solid ${color}` }} />
      ))}
    </div>
  );
}
// 149. Aquarium/bubble card — floating bubble particles drifting upward, cool underwater blue tint.
function V149() {
  return (
    <RevealRows rows={MOCK3}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, height: 56, borderRadius: 14, background: 'linear-gradient(180deg,#0c4a6e,#083344)', border: '2px solid #0ea5e9', overflow: 'hidden' }}>
          <BubbleField color="#7dd3fc" />
          <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#7dd3fc' }}>{row.rank}</span>
            <p className="truncate" style={{ flex: 1, minWidth: 0, color: '#e0f2fe', fontSize: 13, fontWeight: 600 }}>{row.name}</p>
            <PointsPill value={row.points} trigger={revealed} color="#7dd3fc" />
          </div>
        </div>
      )}
    </RevealRows>
  );
}

// 150. Origami paper-fold — visible fold-crease lines, the card visually "unfolds" into place on reveal.
function V150() {
  return (
    <RevealRows rows={MOCK3} style={{ perspective: 600 }} itemStyle={{ transformOrigin: 'top center' }}
      initial={{ opacity: 0, rotateX: -90, scaleY: 0.3 }} animate={{ opacity: 1, rotateX: 0, scaleY: 1 }}
      transitionFor={(i) => ({ delay: i * 0.2, duration: 0.5, ease: 'easeOut' })}>
      {(row, i, revealed) => (
        <div style={{ position: 'relative', width: 220, padding: '9px 14px', borderRadius: 6, background: '#f8fafc', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 8, right: 8, top: '50%', borderTop: '1px dashed #cbd5e1' }} />
          <div style={{ position: 'absolute', top: 8, bottom: 8, left: '33%', borderInlineStart: '1px dashed #cbd5e1' }} />
          <div style={{ position: 'absolute', top: 8, bottom: 8, left: '66%', borderInlineStart: '1px dashed #cbd5e1' }} />
          <span style={{ position: 'relative', fontSize: 13, fontWeight: 900, color: '#334155' }}>{row.rank}</span>
          <p className="truncate" style={{ position: 'relative', flex: 1, minWidth: 0, color: '#1e293b', fontSize: 13, fontWeight: 700 }}>{row.name}</p>
          <span style={{ position: 'relative' }}><PointsPill value={row.points} trigger={revealed} color="#166534" /></span>
        </div>
      )}
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
  { title: 'קבוצה F — אינטראקציות מגע ומחוות', items: [
    ['51. אקורדיון בהקשה', 'הקשה על שורה פותחת אותה עם פירוט סטטיסטי, הקשה נוספת סוגרת', V51],
    ['52. תפריט רדיאלי בלחיצה ארוכה', 'החזקה ארוכה פותחת תפריט פעולות מהיר סביב השורה', V52],
    ['53. פעולות בהחלקה שמאלה', 'סגנון iOS — החלקה חושפת כפתורי פעולה מאחורי השורה', V53],
    ['54. עידוד בהקשה כפולה', 'הקשה כפולה מפעילה פרץ לב ומעלה מונה עידוד', V54],
    ['55. היפוך כרטיס בהקשה על האווטאר', 'הקשה על האווטאר הופכת את הכרטיס (rotateY) לצד סטטיסטי', V55],
    ['56. סידור מחדש בגרירה', 'אחיזה וגרירה של שורה מסדרת מחדש עם הצמדה לחריץ', V56],
    ['57. משיכה לרענון', 'משיכה מטה מעבר לסף מפעילה טעינה וערבוב נתונים', V57],
    ['58. תצוגה מקדימה בלחיצה ממושכת', 'החזקה מציגה חלון פרופיל קצר, שחרור סוגר אותו', V58],
    ['59. השוואת שני שחקנים', 'בוחרים שתי שורות בהקשה ומקבלים תצוגת השוואה זו לצד זו', V59],
    ['60. מעקב בהחלקה ימינה', 'החלקה ימינה מוסיפה סימן וי בקפיץ, החלקה נוספת מבטלת', V60],
  ]},
  { title: 'קבוצה G — פולחן מצביע/ריחוף (עם נפילה חלופית למגע)', items: [
    ['61. הטיה תלת-ממדית בריחוף', 'הכרטיס נוטה בפרספקטיבה בעקבות העכבר, תחושת קלף הולוגרפי (במגע: עוקב אחרי האצבע)', V61],
    ['62. זרקור מגנטי עוקב עכבר', 'זוהר עדין נע מתחת לעכבר בתוך הכרטיס (במגע: עוקב אחרי האצבע)', V62],
    ['63. ניצוצות בעקבות הסמן', 'חלקיקי נצנוץ נגררים אחרי הסמן מעל הכרטיס (במגע: בגרירה)', V63],
    ['64. הרמה לפי קרבה לסמן', 'הכרטיס עולה וצילו מעמיק ככל שהעכבר מתקרב (במגע: בלחיצה)', V64],
    ['65. אור נע היקפי בריחוף', 'קו אור רץ סביב מסגרת הכרטיס ברציפות בזמן ריחוף (במגע: בהחזקה)', V65],
    ['66. פרלקס פנימי', 'שכבות רקע בתוך הכרטיס נעות הפוך למיקום הסמן (במגע: בגרירה)', V66],
    ['67. טולטיפ סטטיסטי בריחוף', 'ריחוף חושף בועת סטטיסטיקה קצרה מעל הכרטיס (במגע: הקשה מחליפה מצב)', V67],
    ['68. אדווה מנקודת ההקשה', 'אפקט ripple של מטריאל דיזיין שמתפשט בדיוק מנקודת הלחיצה', V68],
    ['69. זוהר לפי קרבת סמן', 'הזוהר של הכרטיס מתחזק ככל שהעכבר מתקרב, עוד לפני ריחוף ישיר (במגע: בלחיצה)', V69],
    ['70. מספר הרפאים קופץ קדימה', 'ריחוף מגדיל את מספר הרפאים בתלת-ממד מדומה עם צל מעמיק (במגע: בלחיצה)', V70],
  ]},
  { title: 'קבוצה H — נתונים חיים ודינמיים', items: [
    ['71. "+X" צף בהקשה', 'הקשה על שורה מדמה עליית ניקוד — טקסט צף דוהה למעלה', V71],
    ['72. חץ שינוי דירוג', 'כפתור מדמה ערבוב דירוג; חץ עולה/יורד נכנס באנימציה לכל שורה שזזה', V72],
    ['73. טבעת פעימה מסתובבת', 'טבעת דופק רצה אוטומטית על השורה ש"קלעה" ברגע זה', V73],
    ['74. להבת רצף גדלה', 'הקשה מגדילה מונה רצף חיזויים מדומה ואת אייקון הלהבה שלו', V74],
    ['75. שובל רפאים דועך', 'כפתור מדמה החלפת מקומות; שובל דועך מסמן את כיוון התנועה', V75],
    ['76. "N צופים" בזמן אמת', 'מונה צפייה קטן מתעדכן ומונפש כל כמה שניות', V76],
    ['77. פרץ קונפטי למקום ראשון', 'בכל הצגה מחדש, השורה במקום 1 מקבלת פרץ חלקיקים אוטומטי', V77],
    ['78. הבהוב ספרה שהשתנתה', 'הקשה מעדכנת ניקוד; רק הספרות שהשתנו מהבהבות לפני שמתייצבות', V78],
    ['79. קו "מירוץ צמוד"', 'קו מחבר פועם בין שתי שורות עם פער ניקוד קטן', V79],
    ['80. סרגל תוצאות גולש', 'רצועת חדשות קטנה בתוך הכרטיס גוללת תוצאות משחקים אחרונים', V80],
  ]},
  { title: 'קבוצה I — משוב מישושי מדומה', items: [
    ['81. "תבום" בלחיצה', 'כל הקשה מקבלת כיווץ קפיצי קצר, כמו לחיצה על כפתור פיזי', V81],
    ['82. רעידה ואדום לחיזוי שגוי', 'הקשה מדמה חיזוי שגוי — רעד קצר וברק אדום', V82],
    ['83. מטבע נופל בזכיית נקודות', 'הקשה מוסיפה ניקוד עם אנימציית מטבע נופל וקופץ', V83],
    ['84. נשימה עדינה למשתמש הנוכחי', 'פעימת קנה מידה איטית שומרת על השורה שלך בולטת בקלות', V84],
    ['85. מיון מחדש עם הצמדה', 'כפתור ממיין מחדש; השורות קופצות לחריץ החדש בקפיץ, לא מקפיצות פתאום', V85],
    ['86. הבזק הצלחה במקום מספר', 'הקשה מחליפה רגעית את הניקוד בהבזק ירוק וסימן וי', V86],
    ['87. התנגדות גומייה בקצה', 'גרירה מעבר לקצה הרשימה נמתחת כמו גומייה וקופצת חזרה', V87],
    ['88. רעידת ג׳לי בהקשות מהירות', 'הקשות חוזרות על השורה הראשונה גורמות לה "לרעוד" — מוגבל בעוצמה', V88],
    ['89. שלד טעינה נוצץ', 'שלד מנצנץ עובר בצורה חלקה לכרטיס האמיתי כשהטעינה מסתיימת', V89],
    ['90. מסע לחיצה של כפתור אמיתי', 'לחיצה והחזקה מציגה מצב "לחוץ" דחוס לפני שהכרטיס משתחרר בחזרה', V90],
  ]},
  { title: 'קבוצה J — פרטי גימור מתקדמים', items: [
    ['91. ניגודיות מסתגלת', 'מתג בהיר/כהה מדגים איך הזוהר והטקסט מתאזנים לתאורת סביבה מדומה', V91],
    ['92. פרלקס עדין באווטאר', 'האווטאר זז מעט הפוך לכל הטיה של הכרטיס, מוסיף עומק (במגע: עוקב אחרי האצבע)', V92],
    ['93. טיפוגרפיה קינטית', 'אותיות השם קופצות פנימה אחת-אחת עם overshoot קליל', V93],
    ['94. גוון אישי לכל שחקן', 'צבע ההדגשה נגזר מ"צבע אווטאר דומיננטי" מדומה לכל שורה בנפרד', V94],
    ['95. קיצור חכם עם "ועוד"', 'תגיות עודפות מתקצרות לכפתור "…ועוד N" שנפתח בעדינות', V95],
    ['96. שלד טעינה עם טיפ מתחלף', 'טקסט טיפ/בדיחה קליל מתחלף בזמן טעינה מדומה', V96],
    ['97. צפיפות מסתגלת לגלילה', 'מתג מדמה גלילה מהירה — הכרטיס מצטמצם לשורה דחוסה ומתרחב בחזרה', V97],
    ['98. טבעת פוקוס למקלדת', 'Tab מדגיש שורה בטבעת פוקוס בצבע הדרגה — נגישות אמיתית במקלדת', V98],
    ['99. מודע ל-prefers-reduced-motion', 'מתג מציג זה לצד זה תנועה מלאה מול חלופת תנועה מופחתת', V99],
    ['100. חותם זהב למקום ראשון', 'אפקט חתימה ייחודי — מטבע/חותם שנוחת רק על מקום 1', V100],
  ]},
  { title: 'קבוצה K — עיצובי כדורגל ואצטדיון', items: [
    ['101. לוח תוצאות אצטדיון', 'גופן ספרות LED פיקסלי וזוהר תאורת אצטדיון', V101],
    ['102. חולצת משחק', 'שם ומספר בסגנון גב חולצה, טקסטורת בד עדינה ופס קבוצתי', V102],
    ['103. קריעת חבילת קלפים', 'הכרטיס "נקרע" מתוך עטיפת נייר כסף באנימציה בחשיפה הראשונה', V103],
    ['104. כרטיס שופט', 'צללית כרטיס צהוב/אדום עם אייקון משרוקית קטן', V104],
    ['105. תצוגת מגרש', 'תרשים קווי מגרש כדורגל מיניאטורי ברקע עם נקודת מיקום לפי דרגה', V105],
    ['106. לוח חילופים', 'מראה לוח LED אלקטרוני כמו זה שמניפים השופטים', V106],
    ['107. שלט ארון הלבשה', 'טקסטורת מתכת מוברשת עם שם חרוט/מוטבע', V107],
    ['108. כרטיס כניסה למשחק', 'קצה מחורר בצד אחד ופס דמוי ברקוד', V108],
    ['109. לוח טקטי', 'טקסטורת לוח גיר עם תרשים טקטי פשוט של X-O ברקע', V109],
    ['110. חגורת אליפות', 'למקום הראשון בלבד: צורת מדליון חגורה רחבה; לשאר צורה אחידה פשוטה', V110],
  ]},
  { title: 'קבוצה L — טיפוגרפיה כמוקד עיצובי', items: [
    ['111. ספרת דרגה ענקית', 'מספר הדרגה שולט בכרטיס, השם קטן מתחתיו', V111],
    ['112. כותרת עיתון', 'גופן serif דרמטי לשם, קו טור דק, אנרגיית "מהדורה מיוחדת"', V112],
    ['113. שלט ניאון', 'אותיות בסגנון שלט זכוכית זוהרת עם הבהוב כניסה', V113],
    ['114. חתימה בכתב יד', 'שם בגופן חתימה, תחושת אוטוגרף אישי', V114],
    ['115. טרמינל האקרים', 'ירוק על שחור במונוספייס, סמן מהבהב אחרי השם', V115],
    ['116. נשימת משקל גופן', 'עובי הגופן של השם נע בעדינות בין 400 ל-800 באנימציית סרק', V116],
    ['117. תווית אנכית', 'תג דרגה מסובב 90° לאורך קצה הכרטיס', V117],
    ['118. טיפוגרפיה חרוטה', 'צל שקוע עדין שגורם לטקסט להיראות לחוץ אל תוך המשטח', V118],
    ['119. שם גולש', 'שם ארוך גולש אופקית כמו כרזת חדשות כשאין לו מקום', V119],
    ['120. ספרת מספר חולצה', 'גופן מודגש ומצומצם לניקוד, בניגוד לגופן הקליל של השם', V120],
  ]},
  { title: 'קבוצה M — גיימיפיקציה בהשראת RPG', items: [
    ['121. פס XP', 'הניקוד כפס התקדמות לקראת סף הדרגה הבאה, תחושת עליית שלב במשחק', V121],
    ['122. מדף הישגים', 'שורת אייקוני תגים שהושגו מתחת לשם', V122],
    ['123. פס בריאות מקוטע', 'תצוגת ניקוד בסגנון HUD של פס בריאות מפולח', V123],
    ['124. מסגרת נדירות שלל', 'צבע ועוצמת זוהר המסגרת מקודדים כמו דרגות נדירות פריט במשחק, לפי דרגה', V124],
    ['125. פרץ "עליית שלב"', 'הקשה מדמה עדכון ניקוד: הבזק ובאנר LEVEL UP בסגנון משחק', V125],
    ['126. צומת עץ מיומנויות', 'הכרטיס כצומת מחובר בתרשים עץ, עם קווי חיבור עדינים לדרגות שכנות', V126],
    ['127. רישום קלף משימה', 'שורה בסגנון קלף משימה על נייר מיושן', V127],
    ['128. גיליון תכונות דמות', 'שורות סטטיסטיקה בסגנון RPG, הניקוד כאחת התכונות', V128],
    ['129. פס בריאות בוס', 'תצוגה דרמטית וגדולה, שמורה למקום הראשון בלבד', V129],
    ['130. מונה מטבעות', 'ערימת אייקוני מטבעות ומונה רץ, תחושת מטבע ארקייד', V130],
  ]},
  { title: 'קבוצה N — מינימליזם קיצוני', items: [
    ['131. שורה נטולת מסגרת וצבע', 'רווח, יישור וסולם גופנים בלבד יוצרים היררכיה — בלי תיבות או צבע הדגשה', V131],
    ['132. נקודת הדגשה בודדת', 'נקודה צבעונית קטנה אחת היא כל מדד הדרגה — בלי תג או מספר', V132],
    ['133. קו תחתי בלבד', 'קו צבעוני מתחת לשם, בלי תג דרגה כלל', V133],
    ['134. מונוכרום כברירת מחדל', 'הכרטיס אפור לגמרי, צבע מופיע רק בריחוף/לחיצה', V134],
    ['135. קווי מתאר בלבד', 'הכרטיס כולו קווי מתאר, בלי שום מילוי', V135],
    ['136. שורת מיקרו דחוסה', 'מדד דרגה + ניקוד דו-ספרתי בלבד, לרשימות ארוכות וצפופות', V136],
    ['137. עומק בצל טקסט בלבד', 'בלי תיבות, מסגרות או מילוי — העומק מגיע רק מצל טיפוגרפי', V137],
    ['138. שורת גיליון אלקטרוני', 'קו הפרדה דק בלבד, אסתטיקת טבלה מכוונת ולא מעוצבת', V138],
    ['139. זוהר לחישה', 'זוהר הדגשה כמעט בלתי מורגש (כ-2% שקיפות) — מינימליזם בקצה הקיצון', V139],
    ['140. דרגה בחלל שלילי', 'מספר הדרגה "חתוך" מהכרטיס כחור שדרכו נראה הרקע, במקום מודפס עליו', V140],
  ]},
  { title: 'קבוצה O — מקסימליזם ותפאורה קישוטית', items: [
    ['141. מסגרת בארוק מקושטת', 'קישוטי גליל בפינות הכרטיס', V141],
    ['142. ארט-דקו גיאומטרי', 'קווי זהב ותבנית מניפה/שמש סימטרית', V142],
    ['143. כרטיס ויטראז׳', 'פאנלים צבעוניים מופרדים בקווי "עופרת" כהים, כמו חלון ויטראז׳', V143],
    ['144. לוח מעגלים אלקטרוני', 'רקע תבנית מסלולי PCB, אסתטיקת נוברלטי טכנולוגית', V144],
    ['145. מפת כוכבים', 'השם מתחבר בקווים דקים ל"כוכבים" שמייצגים את הניקוד, בסגנון שמי לילה', V145],
    ['146. צו מלכותי בחותם שעווה', 'רקע קלף עם אפקט הטבעת חותם שעווה מונפש, שמור למקום הראשון', V146],
    ['147. בול דואר וינטג׳', 'מסגרת קצה מחוררת סביב כל הכרטיס, כמו בול', V147],
    ['148. גרפיטי רחוב', 'רקע טקסטורת ריסוס וכתב תג נועז לשם', V148],
    ['149. כרטיס אקווריום', 'בועות צפות כלפי מעלה, גוון כחול קריר תת-ימי', V149],
    ['150. קיפול אוריגמי', 'קווי קיפול נראים לעין, הכרטיס "נפתח" למקומו בחשיפה', V150],
  ]},
];

export default function AdminLeaderboardCardDemo() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 150 עיצובים לכרטיס משתתף בלוח התוצאות</h2>
        <p className="text-slate-500 text-sm">1-50: וריאציות צורה/פריסה/חומר/תנועה. 51-100: אינטראקטיביות אמיתית וגימור עדין — גרירה, ריחוף, לחיצה ארוכה ועוד. 101-150: כיווני עיצוב חדשים — כדורגל/אצטדיון, טיפוגרפיה, גיימיפיקציה, מינימליזם קיצוני ומקסימליזם קישוטי. כולן חיות עם כפתור "הצג שוב". דאטה קבועה לדוגמה. כלי דמו בלבד — לא משפיע על LeaderboardPanel.jsx.</p>
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
