import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { calculateProbabilities, getTopScores } from './MatchOddsBar';
import OdometerValue from '@/components/OdometerValue';
import { PitchLineup } from './MatchLineups';
import { useModalBackButtonOnMount } from '@/hooks/useModalBackButton';
import HeadToHead from './HeadToHead';
import TeamFlag from '@/components/TeamFlag';
import MatchupPlates from './MatchupPlates';
import { goalTeamId } from '@/data/goalTeamIds';
import { getTeamColor } from '@/utils/teamColors';

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
    <div className="flex-1 min-w-0 flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,197,24,0.55)' }}>
      <TeamFlag logo={logo} name={name} className="w-11 h-11" animate={false} rounded="none" />
      <span className="text-[12px] font-bold text-white text-center leading-tight truncate w-full">{name}</span>
      <div className="flex items-center gap-1.5 text-[10px]" dir="rtl">
        <span className="px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>זכות {avgGoals ?? '—'}</span>
        <span className="px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171' }}>חובה {avgConceded ?? '—'}</span>
      </div>
      <span className="text-[9px] text-slate-500">ממוצע למשחק</span>
    </div>
  );
}

// The right-hand team's cell is mirrored (logo on the outer edge), so both
// scores sit side by side in the middle of the row.
function FormCell({ item, mirror }) {
  if (!item) return <div className="flex-1 min-w-0 max-w-[140px] rounded-xl py-1.5 text-center text-[10px] text-slate-600" style={{ background: 'rgba(255,255,255,0.02)' }}>—</div>;
  const s = R[item.result];
  return (
    <div className={`flex-1 min-w-0 max-w-[140px] flex items-center gap-1.5 rounded-xl px-2 py-1 ${mirror ? 'flex-row-reverse' : ''}`} style={{ background: s.bg, border: `1px solid ${s.bd}` }}>
      <TeamFlag logo={item.opponentLogo} name={item.opponent} className="w-5 h-5 flex-shrink-0" animate={false} rounded="none" />
      <span className={`flex-1 min-w-0 text-[10px] text-white/85 truncate ${mirror ? 'text-right' : ''}`}>{item.opponent}</span>
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
          <div key={r.md} className="flex items-center justify-center gap-1.5">
            <FormCell item={r.a} />
            <span className="w-11 flex-shrink-0 text-center text-[9.5px] text-slate-500 leading-tight" dir="rtl">מחזור<br />{r.md}</span>
            <FormCell item={r.b} mirror />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Arena sheet tab: תחזית ────────────────────────────────────────────────
// Big 1/X/2 probability squares (odometer roll), the most likely exact scores
// stacked by likelihood. (The crowd's picks live in MatchPredictionsModal.)
// Each glass square fills from the bottom with its team's colour up to the
// percentage, a slow wave on top; the favourite breathes a glow
// (prototypes/odds/probs20.html, design 1).
const PROB_CSS = `
@keyframes prob-wave{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes prob-breathe{0%,100%{box-shadow:0 0 0 1px var(--pc),0 0 16px -2px var(--pc)}50%{box-shadow:0 0 0 1px var(--pc),0 0 30px 2px var(--pc)}}`;

// Dark blues vanish on our navy background, so blue clubs fill with the
// ticker's result cyan; any other very dark colour is lifted toward white.
const RESULT_CYAN = '#22d3ee';
function liquidColor(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return hex;
  const n = parseInt(m[1], 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const hue = d === 0 ? 0 : max === r ? 60 * (((g - b) / d) % 6) : max === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  const h = (hue + 360) % 360, sat = max === 0 ? 0 : d / max;
  if (sat > 0.25 && h >= 190 && h <= 255) return RESULT_CYAN;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lum >= 0.07) return hex;
  const mix = (c) => Math.round((c + (1 - c) * 0.45) * 255).toString(16).padStart(2, '0');
  return `#${mix(r)}${mix(g)}${mix(b)}`;
}

function ProbSquare({ label, logo, pct, best, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex-1 aspect-square rounded-2xl overflow-hidden"
      style={{
        '--pc': `${color}cc`,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
        border: '1px solid rgba(255,255,255,0.13)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14), 0 8px 24px rgba(0,0,0,0.3)',
        animation: best ? 'prob-breathe 2.4s ease-in-out 1.2s infinite' : undefined,
      }}
    >
      {/* the liquid */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.3 + index * 0.12, duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-x-0 bottom-0"
        style={{ height: `${Math.max(pct, 6)}%`, transformOrigin: 'bottom', background: `linear-gradient(180deg, ${color}66, ${color}bb)` }}
      >
        <svg viewBox="0 0 200 12" preserveAspectRatio="none" className="absolute left-0 h-2.5"
          style={{ top: -9, width: '200%', animation: 'prob-wave 3s linear infinite' }}>
          <path d="M0 6 Q25 0 50 6 T100 6 T150 6 T200 6 V12 H0Z" fill={`${color}66`} />
        </svg>
      </motion.div>
      <div className="relative h-full flex flex-col items-center justify-center gap-1.5">
        {logo !== undefined
          ? <TeamFlag logo={logo} name={label} className="w-8 h-8" animate={false} rounded="full" />
          : <span className="w-8 h-8 flex items-center justify-center text-lg font-black text-slate-300">X</span>}
        <span className="text-3xl font-black text-white tabular-nums leading-none" dir="ltr" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.45)' }}>
          <OdometerValue target={pct} decimals={0} height={32} width={18} />%
        </span>
        <span className="text-[10px] text-slate-200 truncate max-w-[90%]">{label}</span>
      </div>
    </motion.div>
  );
}

// One glass plate of a most-likely-score row (tinted when given a team colour);
// the row is skewed, so the content is counter-skewed upright.
function ScorePlate({ width, color, children }) {
  return (
    <div
      className="flex-none h-10 flex items-center justify-center"
      style={{
        width,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
        backgroundColor: color ? `${color}33` : undefined,
        border: `1px solid ${color ? `${color}88` : 'rgba(255,255,255,0.3)'}`,
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <span className="flex items-center" style={{ transform: 'skewX(12deg)' }}>{children}</span>
    </div>
  );
}

// A digit that rolls up from 0 to its value (odometer column), after `delay` seconds.
function RollDigit({ value, delay }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(t); }, []);
  return (
    <span className="inline-block overflow-hidden text-center" style={{ height: '1em', minWidth: '0.55em' }}>
      <span className="flex flex-col" style={{ transform: `translateY(-${on ? value : 0}em)`, transition: `transform 1.3s cubic-bezier(.2,.9,.25,1) ${delay}s` }}>
        {Array.from({ length: value + 1 }, (_, k) => <span key={k} style={{ height: '1em' }}>{k}</span>)}
      </span>
    </span>
  );
}

function OddsTab({ match }) {
  const probs = useMemo(() => calculateProbabilities(match.home_win_points, match.draw_points, match.away_win_points), [match]);
  const top = useMemo(() => getTopScores(match.score_odds, 5), [match]);
  const best = probs ? Math.max(probs.home, probs.draw, probs.away) : null;
  const colorA = liquidColor(getTeamColor(match.team_a, '#2f7bff'));
  const colorB = liquidColor(getTeamColor(match.team_b, '#ff7a1a'));
  if (!probs && !top.length) return <p className="text-center text-[11px] text-slate-500 py-4">אין עדיין יחסים למשחק הזה</p>;
  return (
    <div className="space-y-5">
      {probs && (
        <div className="flex gap-2 pt-2" dir="ltr">
          <style>{PROB_CSS}</style>
          <ProbSquare index={0} label={match.team_a} logo={match.team_a_logo} pct={probs.home} best={probs.home === best} color={colorA} />
          <ProbSquare index={1} label="תיקו" pct={probs.draw} best={probs.draw === best} color="#a3adc6" />
          <ProbSquare index={2} label={match.team_b} logo={match.team_b_logo} pct={probs.away} best={probs.away === best} color={colorB} />
        </div>
      )}

      {top.length > 0 && (
        <div>
          {/* one slow light sweep that passes over the rows one after the other */}
          <style>{`@keyframes ts-shine{0%{transform:translateX(-160%) skewX(-20deg)}17%,100%{transform:translateX(330%) skewX(-20deg)}}`}</style>
          <p className="text-[12px] font-semibold text-yellow-400 text-center mb-3">תוצאות עם יחס הסיכוי הגבוה ביותר</p>
          {/* Slanted glass plates (prototypes/odds/glass20.html, design 2): home crest
              tinted in its colour · the score, digits rolling up · away crest · % */}
          <div className="flex flex-col items-center gap-[7px]" dir="ltr">
            {top.map((t, i) => {
              const [a, b] = t.score.split(':').map(Number);
              return (
                <motion.div
                  key={t.score}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden flex items-stretch gap-[3px]"
                  style={{ skewX: -12 }}
                >
                  <ScorePlate width={62} color={colorA}><TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-[26px] h-[26px]" animate={false} rounded="full" /></ScorePlate>
                  <ScorePlate width={84}>
                    <span className="flex items-center gap-1.5 text-white font-black tabular-nums" style={{ fontFamily: 'var(--num-font)', fontSize: 26, lineHeight: 1 }}>
                      <RollDigit value={a} delay={0.65 + i * 0.28} /><span className="opacity-55">-</span><RollDigit value={b} delay={0.77 + i * 0.28} />
                    </span>
                  </ScorePlate>
                  <ScorePlate width={62} color={colorB}><TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-[26px] h-[26px]" animate={false} rounded="full" /></ScorePlate>
                  <ScorePlate width={52}><span className="text-[13px] font-bold text-slate-200 tabular-nums">{t.pct}%</span></ScorePlate>
                  <span className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                    style={{ transform: 'translateX(-160%)', animation: `ts-shine ${top.length * 1.5 + 2.5}s ease-in-out ${1.3 + i * 1.5}s infinite` }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Arena bottom sheet (admin gallery option 12): rises over the page with
// glass category tabs in one uniform color; drag the handle down (or tap the
// backdrop / back button) to close. Lineups get a tab only once UEFA has
// published them. The crowd's 1/X/2 split lives in MatchPredictionsModal.
const TAB_COLOR = '56,189,248';
const sheetFade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -6 }, transition: { duration: 0.2 } };

// ── "כל המסגרות" mode of the 5 אחרונים tab ─────────────────────────────────
// Each team's latest games this season in every competition (league, cups,
// CL, friendlies) from GOAL API via our cached proxy — fetched only when the
// toggle is switched on. Up to 12 per team, newest first, filterable by venue.
const ALL_COMPS_LIMIT = 12;

function seasonStart() {
  const d = new Date();
  const y = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1; // season starts in July
  return `${y}-07-01`;
}

function useAllCompsResults(teamName, enabled) {
  const [state, setState] = useState({ loading: false, games: null });
  useEffect(() => {
    if (!enabled) return;
    const id = goalTeamId(teamName);
    if (!id) { setState({ loading: false, games: [] }); return; }
    let cancelled = false;
    setState((s) => ({ ...s, loading: !s.games }));
    fetch(`/api/football?source=goal&path=${encodeURIComponent(`/teams/${id}/results`)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const from = seasonStart();
        const games = (d.data || [])
          .filter((m) => m.matchStatus === 'FINISHED' && m.matchDate >= from && m.homeTeamScore != null && m.awayTeamScore != null)
          .sort((a, b) => (b.kickoffUtc || b.matchDate).localeCompare(a.kickoffUtc || a.matchDate))
          .map((m) => {
            const isHome = m.homeTeamId === id;
            const scored = Number(isHome ? m.homeTeamScore : m.awayTeamScore);
            const conceded = Number(isHome ? m.awayTeamScore : m.homeTeamScore);
            return {
              key: m.id,
              isHome,
              date: m.matchDate,
              competition: m.leagueName,
              competitionLogo: m.leagueLogo || m.league?.logo,
              opponent: isHome ? m.awayTeamName : m.homeTeamName,
              opponentLogo: isHome ? m.teamAwayBadge : m.teamHomeBadge,
              scored, conceded,
              result: scored > conceded ? 'W' : scored < conceded ? 'L' : 'D',
            };
          });
        setState({ loading: false, games });
      })
      .catch(() => { if (!cancelled) setState({ loading: false, games: [] }); });
    return () => { cancelled = true; };
  }, [teamName, enabled]);
  return state;
}

function summarize(games) {
  if (!games.length) return { avgGoals: null, avgConceded: null };
  const g = games.reduce((s, x) => s + x.scored, 0);
  const c = games.reduce((s, x) => s + x.conceded, 0);
  return { avgGoals: (g / games.length).toFixed(1), avgConceded: (c / games.length).toFixed(1) };
}

function AllCompsCell({ item, mirror }) {
  if (!item) return <div className="flex-1 min-w-0 rounded-xl py-2 text-center text-[10px] text-slate-600" style={{ background: 'rgba(255,255,255,0.02)' }}>—</div>;
  const s = R[item.result];
  const [, mm, dd] = item.date.split('-');
  return (
    <div className={`flex-1 min-w-0 flex items-center gap-1.5 rounded-xl px-1.5 py-1.5 ${mirror ? 'flex-row-reverse' : ''}`} style={{ background: s.bg, border: `1px solid ${s.bd}` }}>
      {item.competitionLogo
        ? <img src={item.competitionLogo} alt={item.competition} title={item.competition} className="w-4 h-4 object-contain flex-shrink-0 rounded-sm bg-white/90 p-[1px]" loading="lazy" />
        : <span className="w-4 h-4 flex-shrink-0" />}
      <span className="flex-shrink-0 self-stretch mx-0.5" style={{ width: 1, background: 'rgba(255,255,255,0.18)' }} />
      <img src={item.opponentLogo} alt="" className="w-5 h-5 object-contain flex-shrink-0 " loading="lazy" />
      <div className={`flex-1 min-w-0 leading-tight ${mirror ? 'text-right' : ''}`}>
        <div className="text-[10px] text-white/85 truncate">{item.opponent}</div>
        <div className="text-[8.5px] text-white/45">{dd}/{mm} · {item.isHome ? 'בית' : 'חוץ'}</div>
      </div>
      <span className="font-black tabular-nums text-[12px] flex-shrink-0" style={{ color: s.tx }}>{item.scored}:{item.conceded}</span>
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="flex p-0.5 gap-0.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} dir="rtl">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className="flex-1 text-[10.5px] font-bold px-3 py-1 rounded-[10px] transition-colors"
          style={value === id
            ? { background: `rgba(${TAB_COLOR},0.22)`, border: `1px solid rgba(${TAB_COLOR},0.45)`, color: '#fff' }
            : { border: '1px solid transparent', color: 'rgba(255,255,255,0.55)' }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function AllCompsFormTab({ match, a, b }) {
  const [venue, setVenue] = useState('all');
  const pick = (games) => (games || []).filter((g) => venue === 'all' || (venue === 'home' ? g.isHome : !g.isHome)).slice(0, ALL_COMPS_LIMIT);
  const ga = pick(a.games);
  const gb = pick(b.games);
  const sa = summarize(ga);
  const sb = summarize(gb);
  const n = Math.max(ga.length, gb.length);
  return (
    <div className="space-y-3">
      <Segmented value={venue} onChange={setVenue} options={[['all', 'הכל'], ['home', 'בית'], ['away', 'חוץ']]} />
      <div dir="ltr" className="space-y-3">
        <div className="flex gap-2">
          <TeamHeaderCard logo={match.team_a_logo} name={match.team_a} avgGoals={sa.avgGoals} avgConceded={sa.avgConceded} />
          <TeamHeaderCard logo={match.team_b_logo} name={match.team_b} avgGoals={sb.avgGoals} avgConceded={sb.avgConceded} />
        </div>
        {(a.loading || b.loading) && !n
          ? <p className="text-center text-[11px] text-slate-500 py-4 animate-pulse">טוען...</p>
          : !n
            ? <p className="text-center text-[11px] text-slate-500 py-4">אין משחקים העונה</p>
            : (
              <div className="space-y-1.5">
                {Array.from({ length: n }, (_, j) => (
                  <div key={j} className="flex items-center justify-center gap-1.5">
                    <AllCompsCell item={ga[j]} />
                    <AllCompsCell item={gb[j]} mirror />
                  </div>
                ))}
              </div>
            )}
      </div>
      <p className="text-center text-[9px] text-slate-500">העונה הנוכחית · מהחדש לישן · עד {ALL_COMPS_LIMIT} משחקים</p>
    </div>
  );
}

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

export default function MatchArenaSection({ match, allMatches, loading, onClose }) {
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
  const [tab, setTab] = useState('odds');
  const [formScope, setFormScope] = useState('cl');
  const allA = useAllCompsResults(match.team_a, tab === 'form' && formScope === 'all');
  const allB = useAllCompsResults(match.team_b, tab === 'form' && formScope === 'all');

  const body = (() => {
    if (tab === 'form') {
      const scope = <div className="mb-3"><Segmented value={formScope} onChange={setFormScope} options={[['cl', 'ליגת האלופות'], ['all', 'כל המסגרות']]} /></div>;
      if (formScope === 'all') return <>{scope}<AllCompsFormTab match={match} a={allA} b={allB} /></>;
      if (loading) return <>{scope}<p className="text-center text-[11px] text-slate-500 py-4 animate-pulse">טוען...</p></>;
      if (!hasForm) return <>{scope}<p className="text-center text-[11px] text-slate-500 py-4">אין עדיין משחקים שהסתיימו</p></>;
      return <>{scope}<FormTab match={match} formA={formA} formB={formB} /></>;
    }
    if (tab === 'odds') return <OddsTab match={match} />;
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
        {/* Drag handle + matchup header — the only drag area, so the content scrolls freely */}
        <div onPointerDown={(e) => dragControls.start(e)} className="flex-shrink-0 cursor-grab touch-none pt-2 pb-3">
          <div className="flex justify-center"><div className="w-10 h-1 rounded-full bg-white/30" /></div>
          <MatchupPlates match={match} className="mx-3 mt-2" />
        </div>

        {/* Category tabs — same broadcast look as the 1X2 panel: skewed, white when active */}
        <div className="flex-shrink-0 mx-3 mb-3 flex gap-1">
          {tabs.map((t) => {
            const on = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className="flex-1 py-2 text-[12px] font-bold"
                style={{ transform: 'skewX(-12deg)', background: on ? '#fff' : 'rgba(255,255,255,.07)', color: on ? '#070822' : '#9aa3d6' }}
              >
                <span className="inline-block" style={{ transform: 'skewX(12deg)' }}>{t.label}</span>
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
