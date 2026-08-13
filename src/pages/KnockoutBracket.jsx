import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import AppBackground from '@/components/AppBackground';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { loadLeagueTableOverride, applyOverride } from '@/utils/standingsOverride';
import { loadPlayoffOverride, resolvePlayoffWinner } from '@/utils/playoffOverride';
import { calcStandings } from '@/utils/standings';
import { STAGES } from '@/config/tournament';

// ─── Layout constants ────────────────────────────────────────────────────────
const CH = 64;   // card height
const CW = 118;  // card width
const CG = 20;   // gap between R16 cards (room for the date/time line below each card)
const CN = 22;   // connector width

const COL = CW + CN; // 140

// Left half X positions (R16 → QF → SF → center)
const LR16_X = 0;
const LQF_X  = COL;
const LSF_X  = COL * 2;

// Final (center)
const FINAL_CW = 130;
const FINAL_X  = LSF_X + CW + 30;

// Right half X positions (SF → QF → R16)
const RSF_X  = FINAL_X + FINAL_CW + 30;
const RQF_X  = RSF_X + COL;
const RR16_X = RQF_X + COL;

const TOTAL_W = RR16_X + CW;

// Y helpers
const r16Top    = i => i * (CH + CG);
const r16Ctr    = i => r16Top(i) + CH / 2;
const qfCtr     = i => (r16Ctr(2*i) + r16Ctr(2*i+1)) / 2;
const qfTop     = i => qfCtr(i) - CH / 2;
const sfCtr     = () => (qfCtr(0) + qfCtr(1)) / 2;
const sfTop     = () => sfCtr() - CH / 2;

const TOTAL_H     = r16Top(3) + CH;
const ROUND_LBL_Y = TOTAL_H + 18;
const CONTAINER_H = ROUND_LBL_Y + 20;

// ─── Bracket topology ────────────────────────────────────────────────────────
// The 8 direct league-phase qualifiers (positions 1-8) always face one of the 8
// knockout-phase play-off winners in the round of 16 (never another direct
// qualifier) — real UEFA rule. The actual draw pairing/seeding is random and
// isn't known until Phase 2 builds the play-off bracket, so these pairings are
// placeholders only, just to give the round of 16 a stable layout.
// Order = top → bottom within each column
const LEFT_R16 = [
  { num:1, home:{pos:1}, away:{playoff:8} },
  { num:2, home:{pos:4}, away:{playoff:5} },
  { num:3, home:{pos:3}, away:{playoff:6} },
  { num:4, home:{pos:2}, away:{playoff:7} },
];
const LEFT_QF = [
  { num:9,  home:'W1', away:'W2' },
  { num:10, home:'W3', away:'W4' },
];
const LEFT_SF  = [{ num:13, home:'W9', away:'W10' }];

const RIGHT_R16 = [
  { num:5, home:{pos:5}, away:{playoff:4} },
  { num:6, home:{pos:8}, away:{playoff:1} },
  { num:7, home:{pos:7}, away:{playoff:2} },
  { num:8, home:{pos:6}, away:{playoff:3} },
];
const RIGHT_QF = [
  { num:11, home:'W5', away:'W6' },
  { num:12, home:'W7', away:'W8' },
];
const RIGHT_SF = [{ num:14, home:'W11', away:'W12' }];

const FINAL_SLOT = { num:15, home:'W13', away:'W14' };

// ─── Date/time formatting ──────────────────────────────────────────────────────
function fmtDateTime(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm} · ${hh}:${mi}`;
}

function MatchDateLabel({ matchDate }) {
  const label = fmtDateTime(matchDate);
  if (!label) return null;
  return (
    <div style={{ textAlign: 'center', fontSize: 8, color: '#64748b', marginTop: 3, whiteSpace: 'nowrap' }}>
      {label}
    </div>
  );
}

// ─── SVG bracket line ─────────────────────────────────────────────────────────
function BracketArm({ x1, y1a, y1b, x2, y2, color = 'rgba(100,116,139,0.5)', xMid }) {
  const mx = xMid ?? (x1 + (x2 - x1) / 2);
  return (
    <g stroke={color} strokeWidth={1.5} fill="none">
      <line x1={x1} y1={y1a} x2={mx} y2={y1a} />
      <line x1={x1} y1={y1b} x2={mx} y2={y1b} />
      <line x1={mx}  y1={y1a} x2={mx} y2={y1b} />
      <line x1={mx}  y1={y2} x2={x2}  y2={y2} />
    </g>
  );
}

// ─── Match card ───────────────────────────────────────────────────────────────
function TeamRow({ team, score, won, isFinished, dimmed }) {
  const nameStyle = {
    fontSize: 10, fontWeight: won ? 700 : 500,
    color: won ? '#4ade80' : dimmed ? '#475569' : '#e2e8f0',
    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  };
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:4, padding:'3px 6px',
      background: won ? 'rgba(16,185,129,0.12)' : 'transparent',
      borderLeft: won ? '2px solid #4ade80' : '2px solid transparent',
      height: CH/2 - 1,
    }}>
      {team && !team.placeholder ? (
        <TeamFlag logo={team.logo} name={team.name} className="w-4 h-4 flex-shrink-0" rounded="sm" />
      ) : (
        <div style={{ width:16, height:16, borderRadius:2, background:'rgba(255,255,255,0.06)', flexShrink:0 }} />
      )}
      <span style={nameStyle}>{team?.name || '—'}</span>
      {isFinished && score != null && (
        <span style={{ fontSize:11, fontWeight:800, color: won?'#4ade80':'#94a3b8', flexShrink:0 }}>{score}</span>
      )}
      {!isFinished && team?.projected && !team?.placeholder && (
        <span style={{ fontSize:8, color:'#64748b', flexShrink:0 }}>~</span>
      )}
    </div>
  );
}

function MatchCard({ homeTeam, awayTeam, homeScore, awayScore, isFinished, matchDate, width = CW }) {
  const homeWon = isFinished && homeScore > awayScore;
  const awayWon = isFinished && awayScore > homeScore;
  return (
    <div style={{ width }}>
      <div style={{
        height: CH,
        background: 'rgba(10,18,35,0.92)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 6, overflow:'hidden',
        display:'flex', flexDirection:'column', justifyContent:'center',
      }}>
        <TeamRow team={homeTeam} score={homeScore} won={homeWon} isFinished={isFinished} dimmed={awayWon} />
        <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'0 6px' }} />
        <TeamRow team={awayTeam} score={awayScore} won={awayWon} isFinished={isFinished} dimmed={homeWon} />
      </div>
      <MatchDateLabel matchDate={matchDate} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function KnockoutBracket() {
  const navigate = useNavigate();
  const [leaguePhaseMatches, setLeaguePhaseMatches] = useState([]);
  const [knockoutMatches, setKnockoutMatches]       = useState([]);
  const [leagueTableOverride, setLeagueTableOverride] = useState([]);
  const [playoffSlots, setPlayoffSlots]           = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [lastUpdate, setLastUpdate]               = useState(null);

  const load = async () => {
    try {
      const [data, { override }, { slots }] = await Promise.all([
        Match.list('match_date'),
        loadLeagueTableOverride(),
        loadPlayoffOverride(),
      ]);
      setLeaguePhaseMatches(data.filter(m => m.stage === STAGES.LEAGUE_PHASE));
      setKnockoutMatches(data.filter(m => m.stage && m.stage !== STAGES.LEAGUE_PHASE));
      setLeagueTableOverride(override || []);
      setPlayoffSlots(slots || []);
      setLastUpdate(new Date());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  // League table (with manual override applied)
  const standings = useMemo(
    () => applyOverride(calcStandings(leaguePhaseMatches), leagueTableOverride),
    [leaguePhaseMatches, leagueTableOverride]
  );

  // Once every league-phase match is finished, the top-8 positions are final (no ~ needed)
  const leaguePhaseComplete = useMemo(
    () => leaguePhaseMatches.length > 0 && leaguePhaseMatches.every(m => m.is_finished),
    [leaguePhaseMatches]
  );

  // Multi-pass bracket resolution:
  // 1. Processes rounds in order so W-labels (winner propagation) work correctly.
  // 2. Falls back to matching a DB match by home-team name alone when the away
  //    side is still a "TBD — play-off winner" placeholder.
  // 3. Tracks used match IDs so each DB match is only assigned to one slot.
  const resolved = useMemo(() => {
    const byTeam = {};
    [...knockoutMatches]
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .forEach(m => {
        (byTeam[m.team_a] = byTeam[m.team_a] || []).push(m);
        (byTeam[m.team_b] = byTeam[m.team_b] || []).push(m);
      });

    const slotWinners  = {};   // slotNum → { winner, loser } — built as we resolve rounds
    const usedMatchIds = new Set();

    const resolveLabel = (label) => {
      if (!label) return null;
      if (typeof label === 'object' && label.pos != null) {
        const t = standings[label.pos - 1];
        return t ? { name: t.name, logo: t.logo, projected: !leaguePhaseComplete } : null;
      }
      if (typeof label === 'object' && label.playoff != null) {
        const winner = resolvePlayoffWinner(playoffSlots, label.playoff);
        if (winner) return { name: winner.name, logo: winner.logo, projected: false };
        return { name: `TBD — מנצחת פלייאוף ${label.playoff}`, logo: null, projected: true, placeholder: true };
      }
      if (typeof label === 'string' && label.startsWith('W')) {
        const num = parseInt(label.slice(1));
        return slotWinners[num]?.winner || null;
      }
      return null;
    };

    const findDbMatch = (homeTeam, awayTeam) => {
      // 1. Exact match — both computed (real) teams appear in the same DB match
      if (homeTeam && awayTeam && !awayTeam.placeholder) {
        const m = knockoutMatches.find(m =>
          !usedMatchIds.has(m.id) && (
            (m.team_a === homeTeam.name && m.team_b === awayTeam.name) ||
            (m.team_a === awayTeam.name && m.team_b === homeTeam.name)
          )
        );
        if (m) return m;
      }
      // 2. Away side still unresolved (play-off winner TBD) — match by home team alone
      if (homeTeam && (!awayTeam || awayTeam.placeholder)) {
        const candidates = (byTeam[homeTeam.name] || []).filter(c => !usedMatchIds.has(c.id));
        return candidates.find(c => !c.is_finished) || candidates[0] || null;
      }
      // 3. Home side unresolved — match by away team alone
      if (awayTeam && !awayTeam.placeholder && !homeTeam) {
        const candidates = (byTeam[awayTeam.name] || []).filter(c => !usedMatchIds.has(c.id));
        return candidates.find(c => !c.is_finished) || candidates[0] || null;
      }
      return null;
    };

    const resolveOne = (slotDef) => {
      const homeTeam = resolveLabel(slotDef.home);
      const awayTeam = resolveLabel(slotDef.away);

      const dbMatch = findDbMatch(homeTeam, awayTeam);
      let displayHome = homeTeam;
      let displayAway = awayTeam;
      let homeScore = null, awayScore = null, isFinished = false;

      if (dbMatch) {
        usedMatchIds.add(dbMatch.id);
        const dbA = { name: dbMatch.team_a, logo: dbMatch.team_a_logo };
        const dbB = { name: dbMatch.team_b, logo: dbMatch.team_b_logo };
        // Preserve home/away orientation from DB
        if (homeTeam?.name === dbMatch.team_b) {
          displayHome = { ...dbB, projected: !dbMatch.is_finished };
          displayAway = { ...dbA, projected: !dbMatch.is_finished };
        } else {
          displayHome = { ...dbA, projected: !dbMatch.is_finished };
          displayAway = { ...dbB, projected: !dbMatch.is_finished };
        }

        if (dbMatch.is_finished && dbMatch.actual_score_a != null) {
          isFinished = true;
          const homeIsDbA = displayHome.name === dbMatch.team_a;
          homeScore = homeIsDbA ? dbMatch.actual_score_a : dbMatch.actual_score_b;
          awayScore = homeIsDbA ? dbMatch.actual_score_b : dbMatch.actual_score_a;
          const winner = homeScore > awayScore ? displayHome : displayAway;
          const loser  = homeScore > awayScore ? displayAway : displayHome;
          slotWinners[slotDef.num] = {
            winner: { name: winner.name, logo: winner.logo },
            loser:  { name: loser.name,  logo: loser.logo },
          };
        }
      }

      return { homeTeam: displayHome, awayTeam: displayAway, homeScore, awayScore, isFinished, matchDate: dbMatch?.match_date || null };
    };

    const leftR16  = LEFT_R16.map(s  => ({ ...s, ...resolveOne(s) }));
    const rightR16 = RIGHT_R16.map(s => ({ ...s, ...resolveOne(s) }));
    const leftQF   = LEFT_QF.map(s   => ({ ...s, ...resolveOne(s) }));
    const rightQF  = RIGHT_QF.map(s  => ({ ...s, ...resolveOne(s) }));
    const leftSF   = LEFT_SF.map(s   => ({ ...s, ...resolveOne(s) }));
    const rightSF  = RIGHT_SF.map(s  => ({ ...s, ...resolveOne(s) }));
    const final    = { ...FINAL_SLOT, ...resolveOne(FINAL_SLOT) };

    return { leftR16, leftQF, leftSF, rightR16, rightQF, rightSF, final };
  }, [standings, leaguePhaseComplete, knockoutMatches, playoffSlots]);

  // ─── SVG lines ─────────────────────────────────────────────────────────────
  const lineColor = 'rgba(71,85,105,0.55)';

  const leftLines = [];
  // R16 → QF
  for (let i = 0; i < 2; i++) {
    leftLines.push(
      <BracketArm key={`lr16qf_${i}`}
        x1={LR16_X+CW} y1a={r16Ctr(2*i)} y1b={r16Ctr(2*i+1)}
        x2={LQF_X} y2={qfCtr(i)} color={lineColor} />
    );
  }
  // QF → SF
  leftLines.push(
    <BracketArm key="lqfsf"
      x1={LQF_X+CW} y1a={qfCtr(0)} y1b={qfCtr(1)}
      x2={LSF_X} y2={sfCtr()} color={lineColor} />
  );
  // SF → Final
  leftLines.push(
    <g key="lsffinal">
      <line x1={LSF_X+CW} y1={sfCtr()} x2={FINAL_X} y2={sfCtr()} stroke={lineColor} strokeWidth={1.5} />
    </g>
  );

  // ─── Render ─────────────────────────────────────────────────────────────────
  const abs = (left, top, width, children) => (
    <div style={{ position:'absolute', left, top, width }}>{children}</div>
  );

  return (
    <div className="min-h-screen text-white" style={{ fontFamily:"'Outfit',sans-serif" }}>
      <AppBackground />
      <div className="relative z-10 px-4 pt-2 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white font-black text-xl">🏆 בראקט ליגת האלופות 2026</h1>
            <p className="text-slate-400 text-xs">מחושב לפי מצב הטבלה הנוכחי · ~ = תחזית</p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-slate-500 text-[10px]">
                {lastUpdate.toLocaleTimeString('he-IL', { hour:'2-digit', minute:'2-digit' })}
              </span>
            )}
            <button
              onClick={() => { setLoading(true); load(); }}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-colors">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bracket scroll container */}
        <div style={{ overflowX:'auto', overflowY:'visible', WebkitOverflowScrolling:'touch' }}>
          <div style={{ position:'relative', width:TOTAL_W, height:CONTAINER_H, minWidth:TOTAL_W }}>

            {/* SVG lines layer */}
            <svg
              width={TOTAL_W} height={CONTAINER_H}
              style={{ position:'absolute', top:0, left:0, pointerEvents:'none' }}>
              {leftLines}
              {/* R16 → QF right */}
              {[0,1].map(i => (
                <g key={`rr16qf_${i}`} stroke={lineColor} strokeWidth={1.5} fill="none">
                  <line x1={RR16_X}      y1={r16Ctr(2*i)}   x2={RR16_X-CN/2} y2={r16Ctr(2*i)} />
                  <line x1={RR16_X}      y1={r16Ctr(2*i+1)} x2={RR16_X-CN/2} y2={r16Ctr(2*i+1)} />
                  <line x1={RR16_X-CN/2} y1={r16Ctr(2*i)}   x2={RR16_X-CN/2} y2={r16Ctr(2*i+1)} />
                  <line x1={RR16_X-CN/2} y1={qfCtr(i)}      x2={RQF_X+CW}    y2={qfCtr(i)} />
                </g>
              ))}
              {/* QF → SF right */}
              <g stroke={lineColor} strokeWidth={1.5} fill="none">
                <line x1={RQF_X}      y1={qfCtr(0)}  x2={RQF_X-CN/2} y2={qfCtr(0)} />
                <line x1={RQF_X}      y1={qfCtr(1)}  x2={RQF_X-CN/2} y2={qfCtr(1)} />
                <line x1={RQF_X-CN/2} y1={qfCtr(0)}  x2={RQF_X-CN/2} y2={qfCtr(1)} />
                <line x1={RQF_X-CN/2} y1={sfCtr()}   x2={RSF_X+CW}   y2={sfCtr()} />
              </g>
              {/* SF → Final right */}
              <line x1={RSF_X} y1={sfCtr()} x2={FINAL_X+FINAL_CW} y2={sfCtr()} stroke={lineColor} strokeWidth={1.5} />
            </svg>

            {/* LEFT R16 */}
            {resolved.leftR16.map((m,i) =>
              abs(LR16_X, r16Top(i), CW,
                <MatchCard key={m.num} {...m} />
              )
            )}
            {/* LEFT QF */}
            {resolved.leftQF.map((m,i) =>
              abs(LQF_X, qfTop(i), CW,
                <MatchCard key={m.num} {...m} />
              )
            )}
            {/* LEFT SF */}
            {abs(LSF_X, sfTop(), CW,
              <MatchCard {...resolved.leftSF[0]} />
            )}

            {/* FINAL */}
            {abs(FINAL_X, sfTop(), FINAL_CW,
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', top:-78, left:0, right:0, textAlign:'center', pointerEvents:'none' }}>
                  <img
                    src="/champions/ch-trophy.png"
                    alt="Champions League Trophy"
                    style={{ width:56, height:72, objectFit:'contain', display:'inline-block', filter:'drop-shadow(0 0 12px rgba(9, 122, 220,0.7)) drop-shadow(0 0 4px rgba(9, 122, 220,0.4))' }}
                  />
                </div>
              <div style={{ height:CH, background:'rgba(9, 122, 220,0.08)', border:'1px solid rgba(9, 122, 220,0.3)', borderRadius:8, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div style={{ textAlign:'center', fontSize:9, color:'#097adc', fontWeight:700, letterSpacing:2, paddingTop:2 }}>FINAL</div>
                <TeamRow team={resolved.final.homeTeam} score={resolved.final.homeScore} won={resolved.final.isFinished && resolved.final.homeScore > resolved.final.awayScore} isFinished={resolved.final.isFinished} />
                <div style={{ height:1, background:'rgba(9, 122, 220,0.2)', margin:'0 6px' }} />
                <TeamRow team={resolved.final.awayTeam} score={resolved.final.awayScore} won={resolved.final.isFinished && resolved.final.awayScore > resolved.final.homeScore} isFinished={resolved.final.isFinished} />
              </div>
              <MatchDateLabel matchDate={resolved.final.matchDate} />
              </div>
            )}

            {/* RIGHT SF */}
            {abs(RSF_X, sfTop(), CW,
              <MatchCard {...resolved.rightSF[0]} />
            )}
            {/* RIGHT QF */}
            {resolved.rightQF.map((m,i) =>
              abs(RQF_X, qfTop(i), CW,
                <MatchCard key={m.num} {...m} />
              )
            )}
            {/* RIGHT R16 */}
            {resolved.rightR16.map((m,i) =>
              abs(RR16_X, r16Top(i), CW,
                <MatchCard key={m.num} {...m} />
              )
            )}

            {/* Round labels */}
            {[
              { x: LR16_X, label: 'שמינית גמר' },
              { x: LQF_X,  label: 'רבע גמר' },
              { x: LSF_X,  label: 'חצי גמר' },
            ].map(({ x, label }) => (
              <div key={x} style={{ position:'absolute', left:x, top: ROUND_LBL_Y, width:CW, textAlign:'center', fontSize:8, color:'#475569', fontWeight:600 }}>
                {label}
              </div>
            ))}
            {[
              { x: RSF_X,  label: 'חצי גמר' },
              { x: RQF_X,  label: 'רבע גמר' },
              { x: RR16_X, label: 'שמינית גמר' },
            ].map(({ x, label }) => (
              <div key={x} style={{ position:'absolute', left:x, top: ROUND_LBL_Y, width:CW, textAlign:'center', fontSize:8, color:'#475569', fontWeight:600 }}>
                {label}
              </div>
            ))}

          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-6 text-[10px] text-slate-500 justify-center flex-wrap">
          <span><span className="text-emerald-400 mr-1">■</span>ניצחון</span>
          <span><span className="text-slate-400 mr-1">~</span>תחזית לפי הטבלה הנוכחית</span>
          <span>מתעדכן כל 30 שניות</span>
        </div>
      </div>
    </div>
  );
}
