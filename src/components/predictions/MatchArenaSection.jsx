import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { calculateProbabilities, getTopScores } from './MatchOddsBar';
import OdometerValue from '@/components/OdometerValue';
import { PitchLineup } from './MatchLineups';
import { useModalBackButtonOnMount } from '@/hooks/useModalBackButton';
import HeadToHead from './HeadToHead';
import CrowdWisdomStats from './CrowdWisdomStats';
import TeamFlag from '@/components/TeamFlag';

export function getTeamForm(allMatches, teamName) {
  const played = allMatches
    .filter(m =>
      m.is_finished &&
      m.actual_score_a != null &&
      m.actual_score_b != null &&
      (m.team_a === teamName || m.team_b === teamName)
    )
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date));

  let totalGoals = 0;
  let totalConceded = 0;
  const results = played.map(m => {
    const isHome  = m.team_a === teamName;
    const scored   = isHome ? Number(m.actual_score_a) : Number(m.actual_score_b);
    const conceded = isHome ? Number(m.actual_score_b) : Number(m.actual_score_a);
    totalGoals += scored;
    totalConceded += conceded;
    const result = scored > conceded ? 'W' : scored < conceded ? 'L' : 'D';
    return {
      result, scored, conceded,
      opponent: isHome ? m.team_b : m.team_a,
      opponentLogo: isHome ? m.team_b_logo : m.team_a_logo,
    };
  });

  return {
    last5: results.slice(-5),
    avgGoals: played.length > 0 ? (totalGoals / played.length).toFixed(1) : null,
    avgConceded: played.length > 0 ? (totalConceded / played.length).toFixed(1) : null,
    played: played.length,
  };
}

const R = {
  W: { bg: 'rgba(74,222,128,0.18)',  bd: 'rgba(74,222,128,0.55)',  tx: '#4ade80', so: '#22c55e' },
  D: { bg: 'rgba(250,204,21,0.18)',  bd: 'rgba(250,204,21,0.48)',  tx: '#facc15', so: '#ca8a04' },
  L: { bg: 'rgba(248,113,113,0.18)', bd: 'rgba(248,113,113,0.52)', tx: '#f87171', so: '#dc2626' },
};

function FormDots({ form }) {
  if (!form?.length) return <span className="text-[10px] text-slate-600">—</span>;
  return (
    <div className="flex gap-1.5">
      {form.map((item, i) => {
        const s = R[item.result];
        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                width: 36, height: 36,
                background: s.bg,
                border: `2px solid ${s.tx}`,
                boxShadow: `0 0 0 3px ${s.bg}, 0 2px 6px rgba(0,0,0,0.25)`,
              }}
              title={`${item.result} · ${item.scored}:${item.conceded} מול ${item.opponent}`}
            >
              <TeamFlag logo={item.opponentLogo} name={item.opponent} className="w-6 h-6" animate={false} rounded="full" />
            </div>
            <span className="font-bold" style={{ fontSize: 10, color: s.tx, lineHeight: 1 }}>{item.scored}:{item.conceded}</span>
          </div>
        );
      })}
    </div>
  );
}

function AvgGoals({ scored, conceded }) {
  if (scored == null) return null;
  return (
    <span className="text-[10px] font-medium flex items-center flex-shrink-0">
      <span>⚽</span>
      <span style={{ color: '#4ade80', marginLeft: 2 }}>{scored}</span>
      <span className="text-slate-600 mx-1">/</span>
      <span style={{ color: '#f87171' }}>✕ {conceded}</span>
    </span>
  );
}

// Team on the left, its last games on the right (row-reverse: the page is RTL).
// One line, never wraps.
export function TeamFormRow({ logo, name, form, avgGoals, avgConceded }) {
  return (
    <div className="flex flex-row-reverse items-center justify-between gap-2">
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div
          className="rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            width: 46, height: 46,
            background: 'linear-gradient(rgba(15,23,42,0.9), rgba(15,23,42,0.9)) padding-box, linear-gradient(135deg, #38bdf8, #097adc) border-box',
            border: '3px solid transparent',
            boxShadow: '0 0 0 2px rgba(9,122,220,0.18), 0 2px 8px rgba(0,0,0,0.35)',
          }}
        >
          <TeamFlag logo={logo} name={name} className="w-7 h-7" animate={false} rounded="full" />
        </div>
        <AvgGoals scored={avgGoals} conceded={avgConceded} />
      </div>

      <div className="flex-shrink-0 self-center" style={{ width: 1, height: 30, background: 'rgba(255,255,255,0.12)' }} />

      <FormDots form={form} />
    </div>
  );
}

// ── Arena sheet tab: 5 אחרונים ────────────────────────────────────────────
// Both teams up top (logo, name, goals for/against per game), then the last
// games as rows, oldest → newest, one team per column — matchday vs matchday.
function TeamHeaderCard({ logo, name, avgGoals, avgConceded }) {
  return (
    <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <TeamFlag logo={logo} name={name} className="w-11 h-11" animate={false} rounded="full" />
      <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">{name}</span>
      <div className="flex items-center gap-1.5 text-[10px]" dir="rtl">
        <span className="px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>זכות {avgGoals ?? '—'}</span>
        <span className="px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>חובה {avgConceded ?? '—'}</span>
      </div>
      <span className="text-[9px] text-slate-500">ממוצע למשחק</span>
    </div>
  );
}

function FormCell({ item }) {
  if (!item) return <div className="flex-1 min-w-0 rounded-xl py-2 text-center text-[10px] text-slate-600" style={{ background: 'rgba(255,255,255,0.02)' }}>—</div>;
  const s = R[item.result];
  return (
    <div className="flex-1 min-w-0 flex items-center gap-2 rounded-xl px-2 py-1.5" style={{ background: s.bg, border: `1px solid ${s.bd}` }}>
      <TeamFlag logo={item.opponentLogo} name={item.opponent} className="w-6 h-6 flex-shrink-0" animate={false} rounded="full" />
      <span className="flex-1 min-w-0 text-[10.5px] text-white/85 truncate">{item.opponent}</span>
      <span className="font-black tabular-nums text-[12px] flex-shrink-0" style={{ color: s.tx }}>{item.scored}:{item.conceded}</span>
    </div>
  );
}

function FormTab({ match, formA, formB }) {
  const a = formA.last5;
  const b = formB.last5;
  const n = Math.max(a.length, b.length);
  const last = Math.max(formA.played, formB.played);
  // Align on the newest game so the bottom rows are the same matchday.
  const rows = Array.from({ length: n }, (_, j) => ({
    md: last - (n - 1 - j),
    a: a[j - (n - a.length)],
    b: b[j - (n - b.length)],
  }));
  return (
    <div className="space-y-3" dir="ltr">
      <div className="flex gap-2">
        <TeamHeaderCard logo={match.team_a_logo} name={match.team_a} avgGoals={formA.avgGoals} avgConceded={formA.avgConceded} />
        <TeamHeaderCard logo={match.team_b_logo} name={match.team_b} avgGoals={formB.avgGoals} avgConceded={formB.avgConceded} />
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.md} className="flex items-center gap-1.5">
            <FormCell item={r.a} />
            <span className="w-11 flex-shrink-0 text-center text-[9.5px] text-slate-500 leading-tight" dir="rtl">מחזור<br />{r.md}</span>
            <FormCell item={r.b} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Arena sheet tab: תחזית ────────────────────────────────────────────────
// Big 1/X/2 probability squares (odometer roll), the most likely exact scores
// stacked by likelihood, and — once predictions lock — the crowd's picks.
function ProbSquare({ label, logo, pct, best }) {
  return (
    <div
      className="flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center gap-1.5"
      style={{
        background: best ? 'rgba(56,189,248,0.16)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${best ? 'rgba(56,189,248,0.55)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: best ? '0 0 18px rgba(56,189,248,0.2)' : 'none',
      }}
    >
      {logo !== undefined
        ? <TeamFlag logo={logo} name={label} className="w-8 h-8" animate={false} rounded="full" />
        : <span className="w-8 h-8 flex items-center justify-center text-lg font-black text-slate-300">X</span>}
      <span className="text-3xl font-black text-white tabular-nums leading-none" dir="ltr">
        <OdometerValue target={pct} decimals={0} height={32} width={18} />%
      </span>
      <span className="text-[10px] text-slate-300 truncate max-w-[90%]">{label}</span>
    </div>
  );
}

function OddsTab({ match, isLocked }) {
  const probs = useMemo(() => calculateProbabilities(match.home_win_points, match.draw_points, match.away_win_points), [match]);
  const top = useMemo(() => getTopScores(match.score_odds, 5), [match]);
  const maxPct = top[0]?.pct || 1;
  const best = probs ? Math.max(probs.home, probs.draw, probs.away) : null;
  if (!probs && !top.length) return <p className="text-center text-[11px] text-slate-500 py-4">אין עדיין יחסים למשחק הזה</p>;
  return (
    <div className="space-y-5">
      {probs && (
        <div className="flex gap-2" dir="ltr">
          <ProbSquare label={match.team_a} logo={match.team_a_logo} pct={probs.home} best={probs.home === best} />
          <ProbSquare label="תיקו" pct={probs.draw} best={probs.draw === best} />
          <ProbSquare label={match.team_b} logo={match.team_b_logo} pct={probs.away} best={probs.away === best} />
        </div>
      )}

      {top.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10.5px] font-semibold text-yellow-400 text-center">התוצאות הסבירות ביותר</p>
          {top.map((t, i) => (
            <motion.div
              key={t.score}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              className="flex items-center gap-3 rounded-xl px-3 py-2"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}
              dir="ltr"
            >
              <span className="w-12 text-lg font-black text-white tabular-nums">{t.score.replace(':', '-')}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg,#097adc,#38bdf8)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(t.pct / maxPct) * 100}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
              <span className="w-10 text-right text-[12px] font-bold text-sky-300 tabular-nums">{t.pct}%</span>
            </motion.div>
          ))}
        </div>
      )}

      {isLocked && (
        <div className="space-y-1">
          <p className="text-[10.5px] font-semibold text-yellow-400 text-center">ניחושי המשתתפים</p>
          <div className="[&>div]:mt-0 [&>div]:pt-0 [&>div]:border-t-0">
            <CrowdWisdomStats matchId={match.id} teamA={match.team_a} teamB={match.team_b} />
          </div>
        </div>
      )}
    </div>
  );
}

// Arena bottom sheet (admin gallery option 12): rises over the page with
// glass category tabs in one uniform color; drag the handle down (or tap the
// backdrop / back button) to close. Lineups get a tab only once UEFA has
// published them. The crowd's picks live at the bottom of תחזית once locked.
const TAB_COLOR = '56,189,248';
const sheetFade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

function useLineups(teamA, teamB) {
  const [lineups, setLineups] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/uefa-lineups?homeTeam=${encodeURIComponent(teamA)}&awayTeam=${encodeURIComponent(teamB)}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d.success && d.lineups) setLineups(d.lineups); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [teamA, teamB]);
  return lineups;
}

export default function MatchArenaSection({ match, isLocked, allMatches, loading, onClose }) {
  const formA = useMemo(() => getTeamForm(allMatches, match.team_a), [allMatches, match.team_a]);
  const formB = useMemo(() => getTeamForm(allMatches, match.team_b), [allMatches, match.team_b]);
  const hasForm = formA.played > 0 || formB.played > 0;
  const lineups = useLineups(match.team_a, match.team_b);
  const dragControls = useDragControls();
  useModalBackButtonOnMount(onClose);

  const tabs = [
    { id: 'form', label: '5 אחרונים' },
    { id: 'odds', label: 'תחזית' },
    { id: 'h2h', label: 'ראש בראש' },
    ...(lineups ? [{ id: 'lineups', label: 'הרכבים' }] : []),
  ];
  const [tab, setTab] = useState('form');

  const body = (() => {
    if (tab === 'form') {
      if (loading) return <p className="text-center text-[11px] text-slate-500 py-4 animate-pulse">טוען...</p>;
      if (!hasForm) return <p className="text-center text-[11px] text-slate-500 py-4">אין עדיין משחקים שהסתיימו</p>;
      return <FormTab match={match} formA={formA} formB={formB} />;
    }
    if (tab === 'odds') return <OddsTab match={match} isLocked={isLocked} />;
    if (tab === 'h2h') {
      return <HeadToHead inline teamA={match.team_a?.trim()} teamB={match.team_b?.trim()} logoA={match.team_a_logo} logoB={match.team_b_logo} allMatches={allMatches} />;
    }
    if (tab === 'lineups' && lineups) return <PitchLineup home={lineups.homeTeam} away={lineups.awayTeam} />;
    return null;
  })();

  return createPortal(
    <>
      <motion.div
        key="arena-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] bg-black/55"
      />
      <motion.div
        key="arena-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(e, info) => { if (info.offset.y > 90 || info.velocity.y > 500) onClose(); }}
        className="fixed inset-x-0 bottom-0 z-[71] mx-auto max-w-lg rounded-t-3xl flex flex-col"
        style={{ height: '82vh', background: 'linear-gradient(180deg,#13265a,#0a1226)', borderTop: '1px solid rgba(255,255,255,0.18)' }}
        dir="rtl"
      >
        {/* Drag handle — the only drag area, so the content scrolls freely.
            No title: the gap above the tabs stays empty on purpose. */}
        <div onPointerDown={(e) => dragControls.start(e)} className="flex-shrink-0 cursor-grab touch-none pt-2 pb-6">
          <div className="flex justify-center"><div className="w-10 h-1 rounded-full bg-white/30" /></div>
        </div>

        {/* Glass category tabs — one uniform color */}
        <div
          className="flex-shrink-0 mx-4 mb-3 p-1 flex gap-1 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)' }}
        >
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="relative flex-1 text-[10.5px] font-bold py-1.5 rounded-xl transition-colors"
                style={{ color: on ? '#fff' : 'rgba(255,255,255,0.55)' }}
              >
                {on && (
                  <motion.span
                    layoutId={`arena-tab-${match.id}`}
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `rgba(${TAB_COLOR},0.22)`, border: `1px solid rgba(${TAB_COLOR},0.45)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 14px rgba(${TAB_COLOR},0.18)`, backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                  />
                )}
                <span className="relative">{t.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} {...sheetFade}>{body}</motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </>,
    document.body
  );
}
