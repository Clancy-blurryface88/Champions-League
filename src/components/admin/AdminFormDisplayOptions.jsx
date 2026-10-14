import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import TeamFlag from "@/components/TeamFlag";
import { TeamFormRow } from "@/components/predictions/MatchArenaSection";
import { OptionCard } from "./AdminScoringModalOptions";

// ── 12 alternative UIs for the "last 5 matches" block inside the match arena
// (today: TeamFormRow — team badge + 5 opponent circles + score). Demo only.
// Runs on a 5-result simulation per team by default (early in the season the
// real data has only 1-3 games), or on real finished matches. ──────────────

const RES = {
  W: { c: "#4ade80", bg: "rgba(74,222,128,0.18)", he: "נ", pts: 3 },
  D: { c: "#facc15", bg: "rgba(250,204,21,0.18)", he: "ת", pts: 1 },
  L: { c: "#f87171", bg: "rgba(248,113,113,0.18)", he: "ה", pts: 0 },
};
const HOME_C = "#38bdf8";
const AWAY_C = "#fb7185";

const SIM_SEQ = [
  [[2, 0, true], [1, 1, false], [3, 1, true], [0, 1, false], [2, 1, true]],
  [[1, 0, false], [0, 0, true], [2, 2, false], [3, 0, true], [1, 2, false]],
];
const FALLBACK_OPP = ["Bayern München", "Inter", "Arsenal", "Paris Saint-Germain", "Barcelona", "Juventus", "Benfica", "Atlético Madrid", "Dortmund", "Napoli"];

function teamPool(allMatches, exclude) {
  const map = new Map();
  allMatches.forEach((m) => {
    if (!map.has(m.team_a)) map.set(m.team_a, m.team_a_logo);
    if (!map.has(m.team_b)) map.set(m.team_b, m.team_b_logo);
  });
  const real = [...map.entries()].filter(([n]) => n && !exclude.includes(n)).map(([name, logo]) => ({ name, logo }));
  return real.length >= 10 ? real : FALLBACK_OPP.map((name) => ({ name, logo: null }));
}

function finish(items) {
  const scored = items.reduce((s, x) => s + x.scored, 0);
  const conceded = items.reduce((s, x) => s + x.conceded, 0);
  const n = items.length || 1;
  return {
    items,
    pts: items.reduce((s, x) => s + RES[x.result].pts, 0),
    w: items.filter((x) => x.result === "W").length,
    d: items.filter((x) => x.result === "D").length,
    l: items.filter((x) => x.result === "L").length,
    scored, conceded,
    avgGoals: items.length ? (scored / n).toFixed(1) : null,
    avgConceded: items.length ? (conceded / n).toFixed(1) : null,
  };
}

// Items are always oldest → newest here; display order is applied per variant.
function simForm(teamIdx, pool) {
  const items = SIM_SEQ[teamIdx].map(([s, c, home], i) => {
    const opp = pool[(i * 2 + teamIdx) % pool.length];
    return { result: s > c ? "W" : s < c ? "L" : "D", scored: s, conceded: c, home, opponent: opp.name, opponentLogo: opp.logo };
  });
  return finish(items);
}

function realForm(allMatches, team) {
  const items = allMatches
    .filter((m) => m.is_finished && m.actual_score_a != null && m.actual_score_b != null && (m.team_a === team || m.team_b === team))
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
    .slice(-5)
    .map((m) => {
      const home = m.team_a === team;
      const s = Number(home ? m.actual_score_a : m.actual_score_b);
      const c = Number(home ? m.actual_score_b : m.actual_score_a);
      return { result: s > c ? "W" : s < c ? "L" : "D", scored: s, conceded: c, home, opponent: home ? m.team_b : m.team_a, opponentLogo: home ? m.team_b_logo : m.team_a_logo };
    });
  return finish(items);
}

function streak(items) {
  if (!items.length) return null;
  const last = items[items.length - 1].result;
  let n = 0;
  for (let i = items.length - 1; i >= 0 && items[i].result === last; i--) n++;
  const word = { W: n > 1 ? "ניצחונות" : "ניצחון", D: n > 1 ? "תיקו ברציפות" : "תיקו", L: n > 1 ? "הפסדים" : "הפסד" }[last];
  return { n, last, text: `${n} ${word}` };
}

// newestFirst → newest is the first DOM child (rightmost in RTL / top in a column).
const ordered = (items, newestFirst) => (newestFirst ? [...items].reverse() : items);

function Badge({ team, size = 34, ring = HOME_C }) {
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: `linear-gradient(rgba(15,23,42,0.9), rgba(15,23,42,0.9)) padding-box, linear-gradient(135deg, ${ring}, #097adc) border-box`, border: "2.5px solid transparent" }}>
      <TeamFlag logo={team.logo} name={team.name} className={size > 36 ? "w-7 h-7" : "w-5 h-5"} animate={false} rounded="full" />
    </div>
  );
}

function Opp({ item, size = 20 }) {
  return <TeamFlag logo={item.opponentLogo} name={item.opponent} className={size >= 28 ? "w-7 h-7" : size >= 24 ? "w-6 h-6" : "w-5 h-5"} animate={false} rounded="full" />;
}

function Box({ children }) {
  return <div className="mx-auto rounded-2xl p-4" style={{ maxWidth: 360, background: "linear-gradient(160deg,#0f2150 0%,#0a1226 100%)", border: "1px solid rgba(255,255,255,0.12)" }}>{children}</div>;
}

const OrderHint = ({ newestFirst }) => (
  <div className="flex justify-between text-[8.5px] text-white/35 px-1 mt-1">
    <span>{newestFirst ? "חדש" : "ישן"}</span><span>{newestFirst ? "ישן" : "חדש"}</span>
  </div>
);

// ── Variants ──────────────────────────────────────────────────────────────

// F1. Current design (baseline)
function F1({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="flex flex-col gap-2.5">
        {teams.map((t, k) => <TeamFormRow key={t.name} logo={t.logo} name={t.name} form={ordered(forms[k].items, newestFirst)} avgGoals={forms[k].avgGoals} avgConceded={forms[k].avgConceded} />)}
      </div>
    </Box>
  );
}

// F2. Timeline that grows toward the latest match
function F2({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="space-y-4">
        {teams.map((t, k) => {
          const items = forms[k].items;
          return (
            <div key={t.name}>
              <div className="flex items-center gap-2 mb-2"><Badge team={t} size={26} ring={k ? AWAY_C : HOME_C} /><span className="text-[11px] font-bold text-white">{t.name}</span></div>
              <div className="relative flex items-end justify-between px-1">
                <div className="absolute inset-x-3 top-1/2 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.3))", transform: newestFirst ? "scaleX(-1)" : "none" }} />
                {ordered(items.map((it, i) => ({ it, i })), newestFirst).map(({ it, i }) => {
                  const size = 26 + i * 4;
                  const latest = i === items.length - 1;
                  return (
                    <div key={i} className="relative flex flex-col items-center gap-1">
                      {latest && <span className="absolute -top-4 text-[8px] font-black px-1.5 rounded-full" style={{ background: RES[it.result].c, color: "#0a1226" }}>אחרון</span>}
                      <div className="rounded-full flex items-center justify-center" style={{ width: size, height: size, background: RES[it.result].bg, border: `2px solid ${RES[it.result].c}`, boxShadow: latest ? `0 0 12px ${RES[it.result].c}` : "none" }}>
                        <Opp item={it} size={size - 10} />
                      </div>
                      <span className="text-[9.5px] font-bold" style={{ color: RES[it.result].c }} dir="ltr">{it.scored}:{it.conceded}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

// F3. Hebrew result letters + points out of 15
function F3({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="space-y-3">
        {teams.map((t, k) => (
          <div key={t.name} className="flex items-center gap-2.5">
            <Badge team={t} size={30} ring={k ? AWAY_C : HOME_C} />
            <div className="flex gap-1">
              {ordered(forms[k].items, newestFirst).map((it, i) => (
                <div key={i} title={`${it.scored}:${it.conceded} מול ${it.opponent}`} className="w-7 h-7 rounded-md flex items-center justify-center text-[13px] font-black" style={{ background: RES[it.result].c, color: "#0a1226" }}>{RES[it.result].he}</div>
              ))}
            </div>
            <span className="flex-1" />
            <div className="text-left leading-none">
              <span className="text-lg font-black text-white tabular-nums">{forms[k].pts}</span>
              <span className="text-[10px] text-white/40">/15</span>
              <div className="text-[8.5px] text-white/40 mt-0.5">נקודות</div>
            </div>
          </div>
        ))}
      </div>
      <OrderHint newestFirst={newestFirst} />
    </Box>
  );
}

// F4. Side-by-side columns, row k vs row k
function F4({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="grid grid-cols-2 gap-3">
        {teams.map((t, k) => (
          <div key={t.name} className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${k ? "rgba(251,113,133,0.3)" : "rgba(56,189,248,0.3)"}` }}>
            <div className="flex flex-col items-center gap-1 mb-2"><Badge team={t} size={32} ring={k ? AWAY_C : HOME_C} /><span className="text-[10px] font-bold text-white truncate max-w-full">{t.name}</span></div>
            <div className="space-y-1">
              {ordered(forms[k].items, newestFirst).map((it, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg px-1.5 py-1" style={{ background: RES[it.result].bg }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RES[it.result].c }} />
                  <Opp item={it} />
                  <span className="flex-1" />
                  <span className="text-[11px] font-black tabular-nums" style={{ color: RES[it.result].c }} dir="ltr">{it.scored}-{it.conceded}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center text-[8.5px] text-white/35 mt-1.5">{newestFirst ? "החדש ביותר למעלה" : "החדש ביותר למטה"}</div>
    </Box>
  );
}

// F5. Results list with home/away tags
function F5({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="space-y-3">
        {teams.map((t, k) => (
          <div key={t.name}>
            <div className="flex items-center gap-2 mb-1.5"><Badge team={t} size={24} ring={k ? AWAY_C : HOME_C} /><span className="text-[11px] font-bold text-white">{t.name}</span></div>
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
              {ordered(forms[k].items, newestFirst).map((it, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5" style={{ borderTop: i ? "1px solid rgba(255,255,255,0.06)" : "none", background: i % 2 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <span className="text-[8.5px] font-bold w-7 text-center rounded py-0.5" style={{ background: it.home ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.06)", color: it.home ? HOME_C : "rgba(255,255,255,0.5)" }}>{it.home ? "בית" : "חוץ"}</span>
                  <Opp item={it} />
                  <span className="text-[10.5px] text-white/80 truncate flex-1">{it.opponent}</span>
                  <span className="text-[11px] font-bold text-white tabular-nums" dir="ltr">{it.scored} - {it.conceded}</span>
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black" style={{ background: RES[it.result].c, color: "#0a1226" }}>{RES[it.result].he}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

// F6. Momentum chart — cumulative points, both teams on one graph
function F6({ teams, forms, newestFirst }) {
  const W = 300, H = 110, P = 14;
  const x = (i) => { const p = P + (i * (W - 2 * P)) / 4; return newestFirst ? W - p : p; };
  const y = (v) => H - P - (v / 15) * (H - 2 * P);
  const lines = forms.map((f) => { let acc = 0; return f.items.map((it) => (acc += RES[it.result].pts)); });
  return (
    <Box>
      <div className="flex justify-center gap-4 mb-1">
        {teams.map((t, k) => <span key={t.name} className="flex items-center gap-1.5 text-[10px] font-bold" style={{ color: k ? AWAY_C : HOME_C }}><Badge team={t} size={22} ring={k ? AWAY_C : HOME_C} />{forms[k].pts} נק'</span>)}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {[0, 5, 10, 15].map((v) => <g key={v}><line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.07)" /><text x={newestFirst ? W - 2 : 2} y={y(v) + 3} fontSize="7" fill="rgba(255,255,255,0.3)" textAnchor={newestFirst ? "end" : "start"}>{v}</text></g>)}
        {lines.map((pts, k) => (
          <g key={k}>
            <motion.polyline initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, delay: k * 0.3 }} fill="none" stroke={k ? AWAY_C : HOME_C} strokeWidth="2.5" strokeLinejoin="round" points={pts.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
            {pts.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="4.5" fill={RES[forms[k].items[i].result].c} stroke="#0a1226" strokeWidth="1.5" />)}
          </g>
        ))}
      </svg>
      <div className="text-center text-[8.5px] text-white/35">נקודות מצטברות ב-5 המשחקים · {newestFirst ? "החדש מימין" : "החדש משמאל"}</div>
    </Box>
  );
}

// F7. Goals scored (up) / conceded (down) bars
function F7({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="space-y-4">
        {teams.map((t, k) => (
          <div key={t.name} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1 w-12 flex-shrink-0"><Badge team={t} size={30} ring={k ? AWAY_C : HOME_C} /><span className="text-[8.5px] text-white/50" dir="ltr">{forms[k].scored}:{forms[k].conceded}</span></div>
            <div className="flex-1 flex justify-between items-center">
              {ordered(forms[k].items, newestFirst).map((it, i) => (
                <div key={i} className="flex flex-col items-center" style={{ width: 34 }}>
                  <div className="flex flex-col justify-end items-center" style={{ height: 36 }}>
                    <span className="text-[8.5px] font-bold text-emerald-400">{it.scored || ""}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: it.scored * 9 }} className="w-3.5 rounded-t" style={{ background: "#4ade80" }} />
                  </div>
                  <div className="my-0.5 rounded-full" style={{ boxShadow: `0 0 0 2px ${RES[it.result].c}` }}><Opp item={it} /></div>
                  <div className="flex flex-col items-center" style={{ height: 36 }}>
                    <motion.div initial={{ height: 0 }} animate={{ height: it.conceded * 9 }} className="w-3.5 rounded-b" style={{ background: "#f87171" }} />
                    <span className="text-[8.5px] font-bold text-red-400">{it.conceded || ""}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-3 text-[8.5px] mt-1"><span className="text-emerald-400">▲ כבשה</span><span className="text-red-400">▼ ספגה</span></div>
    </Box>
  );
}

// F8. Form gauge (points / 15)
function Gauge({ pts, color }) {
  const r = 26, C = 2 * Math.PI * r;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68">
      <circle cx="34" cy="34" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <motion.circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" transform="rotate(-90 34 34)" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - pts / 15) }} transition={{ duration: 1.2 }} />
      <text x="34" y="36" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff">{pts}</text>
      <text x="34" y="47" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.45)">מתוך 15</text>
    </svg>
  );
}
function F8({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="grid grid-cols-2 gap-3">
        {teams.map((t, k) => {
          const f = forms[k];
          const color = f.pts >= 10 ? "#4ade80" : f.pts >= 6 ? "#facc15" : "#f87171";
          const s = streak(f.items);
          return (
            <div key={t.name} className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-1.5"><Badge team={t} size={22} ring={k ? AWAY_C : HOME_C} /><span className="text-[10px] font-bold text-white truncate max-w-[100px]">{t.name}</span></div>
              <Gauge pts={f.pts} color={color} />
              <div className="flex gap-1">{ordered(f.items, newestFirst).map((it, i) => <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: RES[it.result].c }} />)}</div>
              {s && <span className="text-[9px] font-semibold" style={{ color: RES[s.last].c }}>רצף: {s.text}</span>}
            </div>
          );
        })}
      </div>
    </Box>
  );
}

// F9. W/D/L balance bar + averages
function F9({ teams, forms }) {
  return (
    <Box>
      <div className="space-y-3.5">
        {teams.map((t, k) => {
          const f = forms[k];
          const n = f.items.length || 1;
          return (
            <div key={t.name}>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge team={t} size={24} ring={k ? AWAY_C : HOME_C} />
                <span className="text-[11px] font-bold text-white flex-1 truncate">{t.name}</span>
                <span className="text-[10px] font-medium"><span>⚽</span><span className="text-emerald-400 mx-0.5">{f.avgGoals}</span><span className="text-slate-600">/</span><span className="text-red-400 mr-0.5">✕ {f.avgConceded}</span></span>
              </div>
              <div className="flex h-5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
                {[["W", f.w], ["D", f.d], ["L", f.l]].filter(([, v]) => v).map(([r, v]) => (
                  <motion.div key={r} initial={{ width: 0 }} animate={{ width: `${(v / n) * 100}%` }} transition={{ duration: 0.8 }} className="flex items-center justify-center text-[10px] font-black" style={{ background: RES[r].c, color: "#0a1226" }}>{v}{RES[r].he}</motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-[8.5px] text-white/35 mt-2">מאזן בלבד — בלי סדר כרונולוגי</div>
    </Box>
  );
}

// F10. Mini match cards, scrollable
function F10({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="space-y-3">
        {teams.map((t, k) => (
          <div key={t.name}>
            <div className="flex items-center gap-2 mb-1.5"><Badge team={t} size={22} ring={k ? AWAY_C : HOME_C} /><span className="text-[10.5px] font-bold text-white">{t.name}</span></div>
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {ordered(forms[k].items, newestFirst).map((it, i) => (
                <div key={i} className="flex-shrink-0 w-[58px] rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="h-1" style={{ background: RES[it.result].c }} />
                  <div className="flex flex-col items-center gap-1 py-1.5">
                    <Opp item={it} size={24} />
                    <span className="text-[12px] font-black text-white tabular-nums" dir="ltr">{it.scored}-{it.conceded}</span>
                    <span className="text-[8px] text-white/45">{it.home ? "בבית" : "בחוץ"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}

// F11. Heat strip — saturation by margin, streak caption
function F11({ teams, forms, newestFirst }) {
  return (
    <Box>
      <div className="space-y-3.5">
        {teams.map((t, k) => {
          const s = streak(forms[k].items);
          return (
            <div key={t.name}>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge team={t} size={24} ring={k ? AWAY_C : HOME_C} />
                <span className="text-[11px] font-bold text-white flex-1 truncate">{t.name}</span>
                {s && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: RES[s.last].bg, color: RES[s.last].c }}>🔥 {s.text}</span>}
              </div>
              <div className="flex h-9 rounded-xl overflow-hidden gap-[2px]">
                {ordered(forms[k].items, newestFirst).map((it, i) => {
                  const margin = Math.min(Math.abs(it.scored - it.conceded), 3);
                  return (
                    <div key={i} className="flex-1 flex items-center justify-center gap-1" style={{ background: RES[it.result].c, opacity: 0.45 + margin * 0.18 }}>
                      <Opp item={it} size={18} />
                      <span className="text-[10px] font-black text-[#0a1226]" dir="ltr">{it.scored}-{it.conceded}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center text-[8.5px] text-white/35 mt-1.5">צבע עז = פער גדול יותר</div>
    </Box>
  );
}

// F12. Tug-of-war comparison by metric
function F12({ teams, forms, newestFirst }) {
  const [a, b] = forms;
  const rows = [
    { label: "נקודות", va: a.pts, vb: b.pts },
    { label: "ניצחונות", va: a.w, vb: b.w },
    { label: "שערים", va: a.scored, vb: b.scored },
    { label: "ספיגות", va: a.conceded, vb: b.conceded, invert: true },
  ];
  return (
    <Box>
      <div className="flex items-center justify-between mb-3">
        {teams.map((t, k) => (
          <div key={t.name} className="flex flex-col items-center gap-1 w-24">
            <Badge team={t} size={34} ring={k ? AWAY_C : HOME_C} />
            <div className="flex gap-0.5">{ordered(forms[k].items, newestFirst).map((it, i) => <span key={i} className="w-2 h-2 rounded-full" style={{ background: RES[it.result].c }} />)}</div>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((r) => {
          const tot = r.va + r.vb || 1;
          const aBetter = r.invert ? r.va < r.vb : r.va > r.vb;
          const bBetter = r.invert ? r.vb < r.va : r.vb > r.va;
          return (
            <div key={r.label}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="font-black tabular-nums" style={{ color: aBetter ? HOME_C : "rgba(255,255,255,0.5)" }}>{r.va}</span>
                <span className="text-white/50">{r.label}</span>
                <span className="font-black tabular-nums" style={{ color: bBetter ? AWAY_C : "rgba(255,255,255,0.5)" }}>{r.vb}</span>
              </div>
              <div className="flex h-1.5 rounded-full overflow-hidden gap-[2px]">
                <motion.div initial={{ width: "50%" }} animate={{ width: `${(r.va / tot) * 100}%` }} transition={{ duration: 0.8 }} style={{ background: HOME_C, opacity: aBetter ? 1 : 0.35 }} />
                <motion.div initial={{ width: "50%" }} animate={{ width: `${(r.vb / tot) * 100}%` }} transition={{ duration: 0.8 }} style={{ background: AWAY_C, opacity: bBetter ? 1 : 0.35 }} />
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}

const VARIANTS = [
  { n: "F1", title: "העיצוב הנוכחי", tagline: "לבסיס השוואה — סמל קבוצה, ממוצעים ו-5 עיגולי יריבה עם תוצאה.", approach: "בסיס", Comp: F1 },
  { n: "F2", title: "ציר זמן מתעצם", tagline: "העיגולים גדלים לכיוון המשחק האחרון, שמקבל זוהר ותגית \"אחרון\".", approach: "כרונולוגי", Comp: F2 },
  { n: "F3", title: "אותיות נ/ת/ה + נקודות", tagline: "ריבועים צבעוניים עם אות התוצאה, וציון נקודות מתוך 15 בצד. התוצאה המלאה במעבר עכבר.", approach: "קומפקטי", Comp: F3 },
  { n: "F4", title: "עמודות זו מול זו", tagline: "שתי הקבוצות בשתי עמודות, שורה מול שורה — משווים משחק אחר משחק.", approach: "השוואה", Comp: F4 },
  { n: "F5", title: "רשימת תוצאות", tagline: "טבלה מלאה: בית/חוץ, שם היריבה, תוצאה ואות — הכי הרבה מידע.", approach: "מפורט", Comp: F5 },
  { n: "F6", title: "גרף מומנטום", tagline: "נקודות מצטברות לאורך 5 המשחקים — שתי הקבוצות על אותו גרף.", approach: "גרפי", Comp: F6 },
  { n: "F7", title: "עמודות שערים", tagline: "לכל משחק: עמודה ירוקה למעלה לשערים, אדומה למטה לספיגות.", approach: "גרפי", Comp: F7 },
  { n: "F8", title: "מד כושר", tagline: "טבעת נקודות מתוך 15 לכל קבוצה, נקודות תוצאה ורצף נוכחי.", approach: "סיכום", Comp: F8 },
  { n: "F9", title: "פס מאזן", tagline: "פס אחד מחולק לניצחונות/תיקו/הפסדים + ממוצעי שערים.", approach: "סיכום", Comp: F9 },
  { n: "F10", title: "כרטיסוני משחק", tagline: "כרטיס קטן לכל משחק עם פס צבע, יריבה, תוצאה ובית/חוץ; גלילה הצידה.", approach: "מפורט", Comp: F10 },
  { n: "F11", title: "רצועת חום", tagline: "רצועה רציפה: הצבע לפי תוצאה, העוצמה לפי הפער; תגית רצף.", approach: "קומפקטי", Comp: F11 },
  { n: "F12", title: "משיכת חבל", tagline: "השוואה ישירה לפי מדד — נקודות, ניצחונות, שערים, ספיגות; המובילה מודגשת.", approach: "השוואה", Comp: F12 },
];

function Seg({ value, set, opts }) {
  return (
    <div className="flex p-0.5 rounded-full bg-white/5 border border-white/10">
      {opts.map(([v, l]) => <button key={String(v)} onClick={() => set(v)} className={`px-3 py-1 rounded-full text-xs ${value === v ? "bg-yellow-400 text-black font-bold" : "text-slate-300"}`}>{l}</button>)}
    </div>
  );
}

export default function FormVariantsGallery({ match, allMatches }) {
  const [source, setSource] = useState("sim");
  const [newestFirst, setNewestFirst] = useState(false);
  const teams = [{ name: match.team_a, logo: match.team_a_logo }, { name: match.team_b, logo: match.team_b_logo }];
  const forms = useMemo(() => {
    if (source === "real") return [realForm(allMatches, match.team_a), realForm(allMatches, match.team_b)];
    const pool = teamPool(allMatches, [match.team_a, match.team_b]);
    return [simForm(0, pool), simForm(1, pool)];
  }, [source, allMatches, match.team_a, match.team_b]);
  const empty = forms.every((f) => !f.items.length);

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <h2 className="text-xl font-bold text-white mb-1">12 תצוגות ל-5 המשחקים האחרונים</h2>
      <p className="text-slate-400 text-sm mb-3">אותו מידע בארגון שונה. ברירת המחדל היא סימולציה של 5 תוצאות לכל קבוצה (בתחילת העונה אין עדיין 5 משחקים אמיתיים).</p>
      <div className="flex items-center gap-3 flex-wrap mb-5">
        <Seg value={source} set={setSource} opts={[["sim", "סימולציה 5 תוצאות"], ["real", "נתונים אמיתיים"]]} />
        <Seg value={newestFirst} set={setNewestFirst} opts={[[false, "החדש ביותר משמאל"], [true, "החדש ביותר מימין"]]} />
      </div>
      {empty ? (
        <p className="text-slate-500 text-sm">אין עדיין משחקים שהסתיימו לקבוצות האלה — עבור לסימולציה.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5">
          {VARIANTS.map((v) => (
            <OptionCard key={v.n} n={v.n} title={v.title} tagline={v.tagline} approach={v.approach}>
              <v.Comp teams={teams} forms={forms} newestFirst={newestFirst} />
            </OptionCard>
          ))}
        </div>
      )}
    </div>
  );
}
