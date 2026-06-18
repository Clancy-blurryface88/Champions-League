import React, { useState, useEffect, useMemo } from 'react';
import { Match } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import AppBackground from '@/components/AppBackground';
import { RefreshCw, Trophy } from 'lucide-react';

// ─── Layout constants ────────────────────────────────────────────────────────
const CH = 64;   // card height
const CW = 118;  // card width
const CG = 6;    // gap between R32 cards
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

const TOTAL_H   = r32Top(7) + CH;
const THIRD_Y   = TOTAL_H + 18;
const CONTAINER_H = THIRD_Y + CH;

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

// ─── Assign best 3rd-place teams to bracket slots (greedy) ──────────────────
function assign3rd(allGroupMatches) {
  const all3rd = ALL_GROUPS.map(g => {
    const s = calcStandings(allGroupMatches[g] || []);
    return s.length >= 3 ? { ...s[2], group: g } : null;
  }).filter(Boolean).sort((a,b) =>
    (b.Pts-a.Pts)||(b.GD-a.GD)||(b.GF-a.GF)||a.name.localeCompare(b.name)
  );
  const qualifying = all3rd.slice(0, 8);
  const used = new Set();
  const result = {};
  for (const slotNum of [74,77,79,80,81,82,85,87]) {
    const allowed = THIRD_SLOTS[slotNum];
    const pick = qualifying.find(t => !used.has(t.name) && allowed.includes(t.group));
    if (pick) { result[slotNum] = pick; used.add(pick.name); }
  }
  return result;
}

// ─── Resolve a slot label to { name, logo } ──────────────────────────────────
function resolveTeam(slotLabel, standings, third3rd, knockoutWinners) {
  if (!slotLabel) return null;
  // 3rd place slot object
  if (typeof slotLabel === 'object' && slotLabel.slot) {
    const t = third3rd[slotLabel.slot];
    return t ? { name: t.name, logo: t.logo, projected: true } : null;
  }
  // Knockout winner (W73, W74...)
  if (typeof slotLabel === 'string' && slotLabel.startsWith('W')) {
    const num = parseInt(slotLabel.slice(1));
    return knockoutWinners[num] || null;
  }
  // Knockout loser (L101, L102)
  if (typeof slotLabel === 'string' && slotLabel.startsWith('L')) {
    const num = parseInt(slotLabel.slice(1));
    return knockoutWinners[`L${num}`] || null;
  }
  // Group position (1A, 2B, etc.)
  if (typeof slotLabel === 'string' && /^[12][A-L]$/.test(slotLabel)) {
    const pos = parseInt(slotLabel[0]) - 1;
    const grp = slotLabel[1];
    const s = standings[grp] || [];
    return s[pos] ? { name: s[pos].name, logo: s[pos].logo, projected: true } : null;
  }
  return null;
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

function MatchCard({ homeTeam, awayTeam, homeScore, awayScore, isFinished, width = CW }) {
  const homeWon = isFinished && homeScore > awayScore;
  const awayWon = isFinished && awayScore > homeScore;
  return (
    <div style={{
      width, height: CH,
      background: 'rgba(10,18,35,0.92)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 6, overflow:'hidden',
      display:'flex', flexDirection:'column', justifyContent:'center',
    }}>
      <TeamRow team={homeTeam} score={homeScore} won={homeWon} isFinished={isFinished} dimmed={awayWon} />
      <div style={{ height:1, background:'rgba(255,255,255,0.06)', margin:'0 6px' }} />
      <TeamRow team={awayTeam} score={awayScore} won={awayWon} isFinished={isFinished} dimmed={homeWon} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function KnockoutBracket() {
  const [allGroupMatches, setAllGroupMatches] = useState({});
  const [knockoutMatches, setKnoutMatches]   = useState([]);
  const [loading, setLoading]                = useState(true);
  const [lastUpdate, setLastUpdate]          = useState(null);

  const load = async () => {
    try {
      const data = await Match.list('match_date');
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
      setLastUpdate(new Date());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  // Standings per group
  const standings = useMemo(() => {
    const r = {};
    ALL_GROUPS.forEach(g => { r[g] = calcStandings(allGroupMatches[g] || []); });
    return r;
  }, [allGroupMatches]);

  // 3rd-place assignment
  const third3rd = useMemo(() => assign3rd(allGroupMatches), [allGroupMatches]);

  // Build knockout winners map from DB matches
  // Key = match number (from bracket), value = { name, logo } of winner
  const knockoutWinners = useMemo(() => {
    const map = {};
    // Try to match DB knockout matches by date
    // Each bracket slot has a kickoff date - we find DB match near that date
    knockoutMatches.forEach(m => {
      if (!m.is_finished || m.actual_score_a == null) return;
      const winner = m.actual_score_a > m.actual_score_b
        ? { name: m.team_a, logo: m.team_a_logo }
        : m.actual_score_b > m.actual_score_a
        ? { name: m.team_b, logo: m.team_b_logo }
        : null; // draw — shouldn't happen in knockout
      const loser = m.actual_score_a > m.actual_score_b
        ? { name: m.team_b, logo: m.team_b_logo }
        : { name: m.team_a, logo: m.team_a_logo };
      // Match by team names across bracket slots
      const allSlots = [
        ...LEFT_R32, ...LEFT_R16, ...LEFT_QF, ...LEFT_SF,
        ...RIGHT_R32, ...RIGHT_R16, ...RIGHT_QF, ...RIGHT_SF,
        FINAL_SLOT, THIRD_SLOT
      ];
      // We store by match number derived from date+teams (simplified: store by teams)
      if (winner) map[`team_${m.team_a}_${m.team_b}`] = { winner, loser, homeScore: m.actual_score_a, awayScore: m.actual_score_b, match: m };
    });
    return map;
  }, [knockoutMatches]);

  // Resolve a bracket slot definition to a rendered match
  const resolveSlot = (slotDef) => {
    const homeTeam = resolveTeam(slotDef.home, standings, third3rd, {});
    const awayTeam = resolveTeam(slotDef.away, standings, third3rd, {});
    // Check if there's a DB match for these teams
    const key1 = homeTeam && awayTeam ? `team_${homeTeam.name}_${awayTeam.name}` : null;
    const key2 = homeTeam && awayTeam ? `team_${awayTeam.name}_${homeTeam.name}` : null;
    const dbMatch = (key1 && knockoutWinners[key1]) || (key2 && knockoutWinners[key2]);
    const swapped = dbMatch && key2 && knockoutWinners[key2];
    return {
      homeTeam,
      awayTeam,
      homeScore: dbMatch ? (swapped ? dbMatch.awayScore : dbMatch.homeScore) : null,
      awayScore: dbMatch ? (swapped ? dbMatch.homeScore : dbMatch.awayScore) : null,
      isFinished: !!dbMatch,
    };
  };

  // Pre-resolve all slots
  const resolved = useMemo(() => {
    const resolve = arr => arr.map(s => ({ ...s, ...resolveSlot(s) }));
    return {
      leftR32:  resolve(LEFT_R32),
      leftR16:  resolve(LEFT_R16),
      leftQF:   resolve(LEFT_QF),
      leftSF:   resolve(LEFT_SF),
      rightR32: resolve(RIGHT_R32),
      rightR16: resolve(RIGHT_R16),
      rightQF:  resolve(RIGHT_QF),
      rightSF:  resolve(RIGHT_SF),
      final:    resolveSlot(FINAL_SLOT),
      third:    resolveSlot(THIRD_SLOT),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standings, third3rd, knockoutWinners]);

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
            <h1 className="text-white font-black text-xl">🏆 בראקט מונדיאל 2026</h1>
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
              <div style={{ height:CH, background:'rgba(245,197,24,0.08)', border:'1px solid rgba(245,197,24,0.3)', borderRadius:8, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div style={{ textAlign:'center', fontSize:9, color:'#f5c518', fontWeight:700, letterSpacing:2, paddingTop:2 }}>FINAL</div>
                <TeamRow team={resolved.final.homeTeam} score={resolved.final.homeScore} won={resolved.final.isFinished && resolved.final.homeScore > resolved.final.awayScore} isFinished={resolved.final.isFinished} />
                <div style={{ height:1, background:'rgba(245,197,24,0.2)', margin:'0 6px' }} />
                <TeamRow team={resolved.final.awayTeam} score={resolved.final.awayScore} won={resolved.final.isFinished && resolved.final.awayScore > resolved.final.homeScore} isFinished={resolved.final.isFinished} />
              </div>
            )}

            {/* THIRD PLACE */}
            {abs(FINAL_X, THIRD_Y, FINAL_CW,
              <div style={{ height:CH, background:'rgba(148,163,184,0.06)', border:'1px solid rgba(148,163,184,0.15)', borderRadius:8, overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center' }}>
                <div style={{ textAlign:'center', fontSize:8, color:'#64748b', fontWeight:700, letterSpacing:1, paddingTop:2 }}>מקום 3</div>
                <TeamRow team={resolved.third.homeTeam} score={resolved.third.homeScore} won={false} isFinished={resolved.third.isFinished} />
                <div style={{ height:1, background:'rgba(148,163,184,0.1)', margin:'0 6px' }} />
                <TeamRow team={resolved.third.awayTeam} score={resolved.third.awayScore} won={false} isFinished={resolved.third.isFinished} />
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
              <div key={x} style={{ position:'absolute', left:x, top: TOTAL_H + 4, width:CW, textAlign:'center', fontSize:8, color:'#475569', fontWeight:600 }}>
                {label}
              </div>
            ))}
            {[
              { x: RSF_X,  label: 'חצי גמר' },
              { x: RQF_X,  label: 'רבע גמר' },
              { x: RR16_X, label: 'שמינית גמר' },
              { x: RR32_X, label: 'שמינית 32' },
            ].map(({ x, label }) => (
              <div key={x} style={{ position:'absolute', left:x, top: TOTAL_H + 4, width:CW, textAlign:'center', fontSize:8, color:'#475569', fontWeight:600 }}>
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
