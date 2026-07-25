import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import AppBackground from '@/components/AppBackground';
import { RefreshCw, Trophy, ArrowRight } from 'lucide-react';
import { loadAllOverrides, applyOverride, applyBestThirdOrder } from '@/utils/groupOverride';

// ─── Layout constants ────────────────────────────────────────────────────────
const CH = 64;   // card height
const CW = 118;  // card width
const CG = 20;   // gap between R32 cards (room for the date/time line below each card)
const CN = 22;   // connector width

const COL = CW + CN; // 140

// Left half X positions (R32 → R16 → QF → SF → center)
const LR32_X = 0;
const LR16_X = COL;
const LQF_X  = COL * 2;
const LSF_X  = COL * 3;

// Final (center)
const FINAL_CW = 130;
const FINAL_X  = LSF_X + CW + 30;

// Right half X positions (SF → QF → R16 → R32)
const RSF_X  = FINAL_X + FINAL_CW + 30;
const RQF_X  = RSF_X + COL;
const RR16_X = RQF_X + COL;
const RR32_X = RR16_X + COL;

const TOTAL_W = RR32_X + CW;

// Y helpers
const r32Top    = i => i * (CH + CG);
const r32Ctr    = i => r32Top(i) + CH / 2;
const r16Ctr    = i => (r32Ctr(2*i) + r32Ctr(2*i+1)) / 2;
const r16Top    = i => r16Ctr(i) - CH / 2;
const qfCtr     = i => (r16Ctr(2*i) + r16Ctr(2*i+1)) / 2;
const qfTop     = i => qfCtr(i) - CH / 2;
const sfCtr     = () => (qfCtr(0) + qfCtr(1)) / 2;
const sfTop     = () => sfCtr() - CH / 2;

const TOTAL_H     = r32Top(7) + CH;
const ROUND_LBL_Y = TOTAL_H + 18;      // below the last R32 row's date/time label
const THIRD_Y      = ROUND_LBL_Y + 16;
const CONTAINER_H  = THIRD_Y + CH + 16; // + room for the date/time label under the 3rd-place card

// ─── Groups ──────────────────────────────────────────────────────────────────
const ALL_GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const toLetter   = g => g?.replace?.('Group ', '').trim() || '';

// ─── FIFA 2026 3rd-place slot rules ─────────────────────────────────────────
const THIRD_SLOTS = {
  74: ['A','B','C','D','F'],
  77: ['C','D','F','G','H'],
  79: ['C','E','F','H','I'],
  80: ['E','H','I','J','K'],
  81: ['B','E','F','I','J'],
  82: ['A','E','H','I','J'],
  85: ['E','F','G','I','J'],
  87: ['D','E','I','J','L'],
};

// ─── Bracket topology ────────────────────────────────────────────────────────
// Order = top → bottom within each column
const LEFT_R32 = [
  { num:74, home:'1E', away:{slot:74} },
  { num:77, home:'1I', away:{slot:77} },
  { num:73, home:'2A', away:'2B' },
  { num:75, home:'1F', away:'2C' },
  { num:83, home:'2K', away:'2L' },
  { num:84, home:'1H', away:'2J' },
  { num:81, home:'1D', away:{slot:81} },
  { num:82, home:'1G', away:{slot:82} },
];
const LEFT_R16 = [
  { num:89, home:'W74', away:'W77' },
  { num:90, home:'W73', away:'W75' },
  { num:93, home:'W83', away:'W84' },
  { num:94, home:'W81', away:'W82' },
];
const LEFT_QF = [
  { num:97, home:'W89', away:'W90' },
  { num:98, home:'W93', away:'W94' },
];
const LEFT_SF  = [{ num:101, home:'W97', away:'W98' }];

const RIGHT_R32 = [
  { num:76, home:'1C', away:'2F' },
  { num:78, home:'2E', away:'2I' },
  { num:79, home:'1A', away:{slot:79} },
  { num:80, home:'1L', away:{slot:80} },
  { num:86, home:'1J', away:'2H' },
  { num:88, home:'2D', away:'2G' },
  { num:85, home:'1B', away:{slot:85} },
  { num:87, home:'1K', away:{slot:87} },
];
const RIGHT_R16 = [
  { num:91, home:'W76', away:'W78' },
  { num:92, home:'W79', away:'W80' },
  { num:95, home:'W86', away:'W88' },
  { num:96, home:'W85', away:'W87' },
];
const RIGHT_QF = [
  { num:99,  home:'W91', away:'W92' },
  { num:100, home:'W95', away:'W96' },
];
const RIGHT_SF = [{ num:102, home:'W99', away:'W100' }];

const FINAL_SLOT = { num:104, home:'W101', away:'W102' };
const THIRD_SLOT = { num:103, home:'L101', away:'L102' };

// ─── Standings calculation (matches GroupStandingsModal) ─────────────────────
function calcStandings(matches) {
  const teams = {};
  const ensure = (name, logo) => {
    if (!teams[name]) teams[name] = { name, logo, P:0,W:0,D:0,L:0,GF:0,GA:0,GD:0,Pts:0 };
    return teams[name];
  };
  matches.forEach(m => { ensure(m.team_a, m.team_a_logo); ensure(m.team_b, m.team_b_logo); });
  matches.forEach(m => {
    if (!m.is_finished || m.actual_score_a == null) return;
    const a = teams[m.team_a], b = teams[m.team_b];
    const sa = m.actual_score_a, sb = m.actual_score_b;
    a.P++; b.P++;
    a.GF += sa; a.GA += sb; b.GF += sb; b.GA += sa;
    if (sa > sb)      { a.W++; a.Pts += 3; b.L++; }
    else if (sa < sb) { b.W++; b.Pts += 3; a.L++; }
    else              { a.D++; a.Pts++; b.D++; b.Pts++; }
  });
  Object.values(teams).forEach(t => { t.GD = t.GF - t.GA; });
  const h2h = names => {
    const s = {}; names.forEach(n => { s[n] = {Pts:0,GD:0,GF:0}; });
    const set = new Set(names);
    matches.forEach(m => {
      if (!m.is_finished || !set.has(m.team_a) || !set.has(m.team_b)) return;
      const sa = m.actual_score_a, sb = m.actual_score_b;
      s[m.team_a].GF += sa; s[m.team_a].GD += sa-sb;
      s[m.team_b].GF += sb; s[m.team_b].GD += sb-sa;
      if (sa > sb) s[m.team_a].Pts += 3;
      else if (sa < sb) s[m.team_b].Pts += 3;
      else { s[m.team_a].Pts++; s[m.team_b].Pts++; }
    });
    return s;
  };
  const list = Object.values(teams).sort((a,b) => b.Pts - a.Pts);
  const result = [];
  let i = 0;
  while (i < list.length) {
    let j = i+1;
    while (j < list.length && list[j].Pts === list[i].Pts) j++;
    const grp = list.slice(i,j);
    if (grp.length > 1) {
      const h = h2h(grp.map(t => t.name));
      grp.sort((a,b) =>
        (h[b.name].Pts-h[a.name].Pts)||(h[b.name].GD-h[a.name].GD)||
        (h[b.name].GF-h[a.name].GF)||(b.GD-a.GD)||(b.GF-a.GF)||
        a.name.localeCompare(b.name));
    }
    result.push(...grp); i = j;
  }
  return result;
}

// ─── Assign best 3rd-place teams to bracket slots (backtracking) ─────────────
function assign3rd(allGroupMatches, groupOverrides = {}, bestThirdOrder = null, bracketSlotOverride = {}) {
  const all3rd = ALL_GROUPS.map(g => {
    const s = applyOverride(calcStandings(allGroupMatches[g] || []), groupOverrides[g]);
    return s.length >= 3 ? { ...s[2], group: g } : null;
  }).filter(Boolean).sort((a,b) =>
    (b.Pts-a.Pts)||(b.GD-a.GD)||(b.GF-a.GF)||a.name.localeCompare(b.name)
  );

  // apply manual ranking order if set
  const sorted = bestThirdOrder ? applyBestThirdOrder(all3rd, bestThirdOrder) : all3rd;
  const qualifying = sorted.slice(0, 8);

  const all3rdByName = Object.fromEntries(all3rd.map(t => [t.name, t]));

  const SLOTS = [74,77,79,80,81,82,85,87];
  const result = {};

  function backtrack(idx, used) {
    if (idx === SLOTS.length) return true;
    const slotNum = SLOTS[idx];
    for (const team of qualifying) {
      if (!used.has(team.name) && THIRD_SLOTS[slotNum].includes(team.group)) {
        result[slotNum] = team;
        used.add(team.name);
        if (backtrack(idx + 1, used)) return true;
        delete result[slotNum];
        used.delete(team.name);
      }
    }
    return false;
  }

  const fullSuccess = backtrack(0, new Set());

  // When a full valid assignment isn't possible, fall back to a greedy best-effort
  // using MRV (Minimum Remaining Values): process the most constrained slots first
  // (fewest eligible qualifying teams). This prevents a team like Sweden (eligible
  // for many slots) from being "stolen" by an earlier slot before reaching the slot
  // where she truly belongs (e.g. slot 82 for Morocco).
  if (!fullSuccess) {
    const usedNames = new Set(Object.values(result).map(t => t.name));

    // Sort slots by number of currently-eligible qualifying teams (ascending)
    const remaining = SLOTS.filter(s => !result[s]);
    remaining.sort((a, b) => {
      const countA = qualifying.filter(t => !usedNames.has(t.name) && THIRD_SLOTS[a].includes(t.group)).length;
      const countB = qualifying.filter(t => !usedNames.has(t.name) && THIRD_SLOTS[b].includes(t.group)).length;
      return countA - countB;
    });

    for (const slotNum of remaining) {
      const candidate = qualifying.find(t =>
        !usedNames.has(t.name) && THIRD_SLOTS[slotNum].includes(t.group)
      );
      if (candidate) {
        result[slotNum] = candidate;
        usedNames.add(candidate.name);
      }
    }
  }

  // apply manual bracket slot overrides on top
  Object.entries(bracketSlotOverride).forEach(([slot, teamName]) => {
    const team = all3rdByName[teamName];
    if (team) result[parseInt(slot)] = team;
  });

  return result;
}


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
      {team ? (
        <TeamFlag logo={team.logo} name={team.name} className="w-4 h-4 flex-shrink-0" rounded="sm" />
      ) : (
        <div style={{ width:16, height:16, borderRadius:2, background:'rgba(255,255,255,0.06)', flexShrink:0 }} />
      )}
      <span style={nameStyle}>{team?.name || '—'}</span>
      {isFinished && score != null && (
        <span style={{ fontSize:11, fontWeight:800, color: won?'#4ade80':'#94a3b8', flexShrink:0 }}>{score}</span>
      )}
      {!isFinished && team?.projected && (
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
  const [allGroupMatches, setAllGroupMatches]     = useState({});
  const [knockoutMatches, setKnoutMatches]        = useState([]);
  const [groupOverrides, setGroupOverrides]       = useState({});
  const [bestThirdOrder, setBestThirdOrder]       = useState(null);
  const [bracketSlotOverride, setBracketSlotOverride] = useState({});
  const [bracketMatchOverride, setBracketMatchOverride] = useState({});
  const [loading, setLoading]                     = useState(true);
  const [lastUpdate, setLastUpdate]               = useState(null);

  const load = async () => {
    try {
      const [data, { groupOverrides: gOvr, bestThirdOrder: bto, bracketSlotOverride: bso, bracketMatchOverride: bmo }] = await Promise.all([
        Match.list('match_date'),
        loadAllOverrides(),
      ]);
      const grouped = {};
      const knockout = [];
      data.forEach(m => {
        if (m.league) {
          const letter = toLetter(m.league);
          if (!grouped[letter]) grouped[letter] = [];
          grouped[letter].push(m);
        } else {
          knockout.push(m);
        }
      });
      setAllGroupMatches(grouped);
      setKnoutMatches(knockout);
      setGroupOverrides(gOvr || {});
      setBestThirdOrder(bto || null);
      setBracketSlotOverride(bso || {});
      setBracketMatchOverride(bmo || {});
      setLastUpdate(new Date());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  // Standings per group (with manual overrides applied)
  const standings = useMemo(() => {
    const r = {};
    ALL_GROUPS.forEach(g => {
      r[g] = applyOverride(calcStandings(allGroupMatches[g] || []), groupOverrides[g]);
    });
    return r;
  }, [allGroupMatches, groupOverrides]);

  // Groups where ALL matches are finished → teams are confirmed, no ~ needed
  const confirmedGroups = useMemo(() => {
    const s = new Set();
    ALL_GROUPS.forEach(g => {
      const gm = allGroupMatches[g] || [];
      if (gm.length > 0 && gm.every(m => m.is_finished)) s.add(g);
    });
    return s;
  }, [allGroupMatches]);

  // 3rd-place assignment (with all manual overrides applied)
  const third3rd = useMemo(
    () => assign3rd(allGroupMatches, groupOverrides, bestThirdOrder, bracketSlotOverride),
    [allGroupMatches, groupOverrides, bestThirdOrder, bracketSlotOverride]
  );

  // Multi-pass bracket resolution:
  // 1. Processes rounds in order so W-labels (winner propagation) work correctly.
  // 2. Falls back to matching a DB match by home-team name alone when the
  //    exact (both-team) lookup fails — this handles wrong 3rd-place projections.
  // 3. Tracks used match IDs so each DB match is only assigned to one slot.
  const resolved = useMemo(() => {
    // Build team-name → sorted DB match list (upcoming first, then finished)
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
      if (typeof label === 'object' && label.slot != null) {
        const t = third3rd[label.slot];
        const isConfirmed = t && confirmedGroups.has(t.group);
        return t ? { name: t.name, logo: t.logo, projected: !isConfirmed } : null;
      }
      if (typeof label === 'string' && label.startsWith('W')) {
        const num = parseInt(label.slice(1));
        return slotWinners[num]?.winner || null;
      }
      if (typeof label === 'string' && label.startsWith('L')) {
        const num = parseInt(label.slice(1));
        return slotWinners[num]?.loser || null;
      }
      if (/^[12][A-L]$/.test(label)) {
        const pos = parseInt(label[0]) - 1;
        const grp = label[1];
        const s = standings[grp] || [];
        return s[pos] ? { name: s[pos].name, logo: s[pos].logo, projected: !confirmedGroups.has(grp) } : null;
      }
      return null;
    };

    const findDbMatch = (homeTeam, awayTeam, slotDef) => {
      // 1. Exact match — both computed teams appear in the same DB match
      if (homeTeam && awayTeam) {
        const m = knockoutMatches.find(m =>
          !usedMatchIds.has(m.id) && (
            (m.team_a === homeTeam.name && m.team_b === awayTeam.name) ||
            (m.team_a === awayTeam.name && m.team_b === homeTeam.name)
          )
        );
        if (m) return m;
      }

      const is3rdSlot = typeof slotDef?.away === 'object' && slotDef.away?.slot != null;

      // 2. For 3rd-place slots: home-team fallback with group validation.
      //    Only accept a DB match whose OTHER team is actually a 3rd-place finisher
      //    from one of the valid groups for this slot — prevents "stealing" another
      //    slot's match just because the team name appears in it.
      if (homeTeam && is3rdSlot) {
        const validGroups = new Set(THIRD_SLOTS[slotDef.away.slot] || []);
        const candidates = (byTeam[homeTeam.name] || []).filter(c => !usedMatchIds.has(c.id));

        const validated = candidates.find(c => {
          const otherName  = c.team_a === homeTeam.name ? c.team_b : c.team_a;
          const otherGroup = ALL_GROUPS.find(g => (standings[g] || []).some(t => t.name === otherName));
          const otherPos   = otherGroup ? (standings[otherGroup] || []).findIndex(t => t.name === otherName) : -1;
          return otherGroup && validGroups.has(otherGroup) && otherPos === 2;
        });
        if (validated) return validated;

        // Less-strict fallback: any available home-team match (standings may not be settled yet)
        return candidates.find(c => !c.is_finished) || candidates[0] || null;
      }

      // 3. When home team is unknown — try by away team instead
      if (!homeTeam && awayTeam) {
        const candidates = (byTeam[awayTeam.name] || []).filter(c => !usedMatchIds.has(c.id));
        return candidates.find(c => !c.is_finished) || candidates[0] || null;
      }

      return null;
    };

    const resolveOne = (slotDef) => {
      const manualOv = bracketMatchOverride[slotDef.num];
      let homeTeam, awayTeam;
      if (manualOv?.team_a) {
        homeTeam = { name: manualOv.team_a, logo: manualOv.team_a_logo };
        awayTeam = manualOv.team_b ? { name: manualOv.team_b, logo: manualOv.team_b_logo } : null;
      } else {
        homeTeam = resolveLabel(slotDef.home);
        awayTeam = resolveLabel(slotDef.away);
      }

      const dbMatch = findDbMatch(homeTeam, awayTeam, slotDef);
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

    const leftR32  = LEFT_R32.map(s  => ({ ...s, ...resolveOne(s) }));
    const rightR32 = RIGHT_R32.map(s => ({ ...s, ...resolveOne(s) }));
    const leftR16  = LEFT_R16.map(s  => ({ ...s, ...resolveOne(s) }));
    const rightR16 = RIGHT_R16.map(s => ({ ...s, ...resolveOne(s) }));
    const leftQF   = LEFT_QF.map(s   => ({ ...s, ...resolveOne(s) }));
    const rightQF  = RIGHT_QF.map(s  => ({ ...s, ...resolveOne(s) }));
    const leftSF   = LEFT_SF.map(s   => ({ ...s, ...resolveOne(s) }));
    const rightSF  = RIGHT_SF.map(s  => ({ ...s, ...resolveOne(s) }));
    const final    = { ...FINAL_SLOT, ...resolveOne(FINAL_SLOT) };
    const third    = { ...THIRD_SLOT, ...resolveOne(THIRD_SLOT) };

    return { leftR32, leftR16, leftQF, leftSF, rightR32, rightR16, rightQF, rightSF, final, third };
  }, [standings, third3rd, knockoutMatches, bracketMatchOverride, confirmedGroups]);

  // ─── SVG lines ─────────────────────────────────────────────────────────────
  const lineColor = 'rgba(71,85,105,0.55)';

  const leftLines = [];
  // R32 → R16
  for (let i = 0; i < 4; i++) {
    leftLines.push(
      <BracketArm key={`lr32r16_${i}`}
        x1={LR32_X+CW} y1a={r32Ctr(2*i)} y1b={r32Ctr(2*i+1)}
        x2={LR16_X} y2={r16Ctr(i)} color={lineColor} />
    );
  }
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

  const rightLines = [];
  // R32 → R16 (right — mirrored)
  for (let i = 0; i < 4; i++) {
    rightLines.push(
      <BracketArm key={`rr32r16_${i}`}
        x1={RR32_X} y1a={r32Ctr(2*i)} y1b={r32Ctr(2*i+1)}
        x2={RR16_X+CW} y2={r16Ctr(i)}
        color={lineColor} xMid={RR32_X - CN/2} />
    );
  }
  // R16 → QF (right)
  for (let i = 0; i < 2; i++) {
    rightLines.push(
      <BracketArm key={`rr16qf_${i}`}
        x1={RR16_X} y1a={r16Ctr(2*i)} y1b={r16Ctr(2*i+1)}
        x2={RQF_X+CW} y2={qfCtr(i)}
        color={lineColor} xMid={RR16_X - CN/2} />
    );
  }
  // QF → SF (right)
  rightLines.push(
    <BracketArm key="rqfsf"
      x1={RQF_X} y1a={qfCtr(0)} y1b={qfCtr(1)}
      x2={RSF_X+CW} y2={sfCtr()}
      color={lineColor} xMid={RQF_X - CN/2} />
  );
  // SF → Final (right)
  rightLines.push(
    <g key="rsffinal">
      <line x1={RSF_X} y1={sfCtr()} x2={FINAL_X+FINAL_CW} y2={sfCtr()} stroke={lineColor} strokeWidth={1.5} />
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
            <p className="text-slate-400 text-xs">מחושב לפי מצב הטבלאות הנוכחי · ~ = תחזית</p>
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
              {/* Right lines — BracketArm for right side needs mirrored logic */}
              {/* R32 → R16 right */}
              {[0,1,2,3].map(i => (
                <g key={`rr32r16_${i}`} stroke={lineColor} strokeWidth={1.5} fill="none">
                  <line x1={RR32_X}      y1={r32Ctr(2*i)}   x2={RR32_X-CN/2} y2={r32Ctr(2*i)} />
                  <line x1={RR32_X}      y1={r32Ctr(2*i+1)} x2={RR32_X-CN/2} y2={r32Ctr(2*i+1)} />
                  <line x1={RR32_X-CN/2} y1={r32Ctr(2*i)}   x2={RR32_X-CN/2} y2={r32Ctr(2*i+1)} />
                  <line x1={RR32_X-CN/2} y1={r16Ctr(i)}     x2={RR16_X+CW}   y2={r16Ctr(i)} />
                </g>
              ))}
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

            {/* LEFT R32 */}
            {resolved.leftR32.map((m,i) =>
              abs(LR32_X, r32Top(i), CW,
                <MatchCard key={m.num} {...m} />
              )
            )}
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
                    style={{ width:56, height:72, objectFit:'contain', display:'inline-block', filter:'drop-shadow(0 0 12px rgba(56, 189, 248,0.7)) drop-shadow(0 0 4px rgba(56, 189, 248,0.4))' }}
                  />
                </div>
              <div style={{ height:CH, background:'rgba(56, 189, 248,0.08)', border:'1px solid rgba(56, 189, 248,0.3)', borderRadius:8, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div style={{ textAlign:'center', fontSize:9, color:'#38bdf8', fontWeight:700, letterSpacing:2, paddingTop:2 }}>FINAL</div>
                <TeamRow team={resolved.final.homeTeam} score={resolved.final.homeScore} won={resolved.final.isFinished && resolved.final.homeScore > resolved.final.awayScore} isFinished={resolved.final.isFinished} />
                <div style={{ height:1, background:'rgba(56, 189, 248,0.2)', margin:'0 6px' }} />
                <TeamRow team={resolved.final.awayTeam} score={resolved.final.awayScore} won={resolved.final.isFinished && resolved.final.awayScore > resolved.final.homeScore} isFinished={resolved.final.isFinished} />
              </div>
              <MatchDateLabel matchDate={resolved.final.matchDate} />
              </div>
            )}

            {/* THIRD PLACE */}
            {abs(FINAL_X, THIRD_Y, FINAL_CW,
              <div>
                <div style={{ height:CH, background:'rgba(148,163,184,0.06)', border:'1px solid rgba(148,163,184,0.15)', borderRadius:8, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                  <div style={{ textAlign:'center', fontSize:8, color:'#64748b', fontWeight:700, letterSpacing:1, paddingTop:2 }}>מקום 3</div>
                  <TeamRow team={resolved.third.homeTeam} score={resolved.third.homeScore} won={false} isFinished={resolved.third.isFinished} />
                  <div style={{ height:1, background:'rgba(148,163,184,0.1)', margin:'0 6px' }} />
                  <TeamRow team={resolved.third.awayTeam} score={resolved.third.awayScore} won={false} isFinished={resolved.third.isFinished} />
                </div>
                <MatchDateLabel matchDate={resolved.third.matchDate} />
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
            {/* RIGHT R32 */}
            {resolved.rightR32.map((m,i) =>
              abs(RR32_X, r32Top(i), CW,
                <MatchCard key={m.num} {...m} />
              )
            )}

            {/* Round labels */}
            {[
              { x: LR32_X, label: 'שמינית 32' },
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
              { x: RR32_X, label: 'שמינית 32' },
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
