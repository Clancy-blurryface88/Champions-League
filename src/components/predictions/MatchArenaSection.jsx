import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import MatchOddsBar from './MatchOddsBar';
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

// Arena bottom sheet (admin gallery option 12): rises over the page with
// glass category tabs in one uniform color; drag the handle down (or tap the
// backdrop / back button) to close. Lineups get a tab only once UEFA has
// published them; the crowd tab only once predictions are locked.
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
  const hasOdds = match.score_odds || (match.home_win_points > 0 && match.draw_points > 0 && match.away_win_points > 0);
  const lineups = useLineups(match.team_a, match.team_b);
  const dragControls = useDragControls();
  useModalBackButtonOnMount(onClose);

  const tabs = [
    { id: 'form', label: '5 אחרונים' },
    { id: 'odds', label: 'תחזית' },
    { id: 'h2h', label: 'ראש בראש' },
    ...(lineups ? [{ id: 'lineups', label: 'הרכבים' }] : []),
    ...(isLocked ? [{ id: 'crowd', label: 'הקהל' }] : []),
  ];
  const [tab, setTab] = useState('form');

  const body = (() => {
    if (tab === 'form') {
      if (loading) return <p className="text-center text-[11px] text-slate-500 py-4 animate-pulse">טוען...</p>;
      if (!hasForm) return <p className="text-center text-[11px] text-slate-500 py-4">אין עדיין משחקים שהסתיימו</p>;
      return (
        <div className="flex flex-col gap-2.5 px-0.5">
          <TeamFormRow logo={match.team_a_logo} name={match.team_a} form={formA.last5} avgGoals={formA.avgGoals} avgConceded={formA.avgConceded} />
          <TeamFormRow logo={match.team_b_logo} name={match.team_b} form={formB.last5} avgGoals={formB.avgGoals} avgConceded={formB.avgConceded} />
        </div>
      );
    }
    if (tab === 'odds') {
      if (!hasOdds) return <p className="text-center text-[11px] text-slate-500 py-4">אין עדיין יחסים למשחק הזה</p>;
      return (
        <div className="[&>div]:mt-0">
          <MatchOddsBar scoreOdds={match.score_odds} homeWinPoints={match.home_win_points} drawPoints={match.draw_points} awayWinPoints={match.away_win_points} teamA={match.team_a} teamB={match.team_b} />
        </div>
      );
    }
    if (tab === 'h2h') {
      return <HeadToHead inline teamA={match.team_a?.trim()} teamB={match.team_b?.trim()} logoA={match.team_a_logo} logoB={match.team_b_logo} allMatches={allMatches} />;
    }
    if (tab === 'lineups' && lineups) return <PitchLineup home={lineups.homeTeam} away={lineups.awayTeam} />;
    if (tab === 'crowd') return <CrowdWisdomStats matchId={match.id} teamA={match.team_a} teamB={match.team_b} />;
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
        {/* Drag handle + title — the only drag area, so the content scrolls freely */}
        <div onPointerDown={(e) => dragControls.start(e)} className="flex-shrink-0 cursor-grab touch-none pt-2 pb-2">
          <div className="flex justify-center pb-1.5"><div className="w-10 h-1 rounded-full bg-white/30" /></div>
          <div className="flex items-center justify-center gap-2 text-[12px] font-bold">
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-5 h-5" animate={false} />
            <span className="text-white truncate max-w-[30%]">{match.team_a}</span>
            <span className="text-yellow-400">זירת המשחק</span>
            <span className="text-white truncate max-w-[30%]">{match.team_b}</span>
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-5 h-5" animate={false} />
          </div>
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
