import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import { Hand, Clock } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import { calculateScore } from "@/components/LiveLeaderboard";

// "מפת הערב": every match of the night against every participant. A cell is green when the
// prediction was the exact score at the whistle, red when it was exact for a while and a goal
// broke it. Tapping a cell shows how long the exact score held and the points equation:
// could have earned − earned = points lost. Built from the replay's model (goals by minute).

const GREEN = "#34d399", RED = "#fb7185", GOLD = "#facc15", MUTED = "#94a3b8";
const NUM = { fontFamily: "var(--num-font)" };
const f2 = (v) => (Math.round(v * 100) / 100).toFixed(2);
const minuteOf = (g) => { const m = /(\d+)(?:\s*\+\s*(\d+))?/.exec(g.label || ""); return m ? Number(m[1]) + Number(m[2] || 0) : g.minute; };
const minutesText = (n) => (n === 1 ? "דקה אחת" : `${n} דקות`);

// one cell: the prediction's exact spans along the match, and could-have vs earned
function cellOf(mm, p) {
  if (!p) return { state: "none", spans: [], mins: 0, could: 0, got: 0, diff: 0 };
  const steps = [{ min: 0, a: 0, b: 0, scorer: null }, ...mm.goals.map((g) => ({ min: minuteOf(g), a: g.a, b: g.b, scorer: g.scorer }))];
  const end = Math.max(90, steps[steps.length - 1].min);
  const exact = (s) => p.predicted_score_a === s.a && p.predicted_score_b === s.b;
  const pts = (s) => calculateScore(p, { ...mm.m, actual_score_a: s.a, actual_score_b: s.b }).totalPoints;
  const spans = [];
  steps.forEach((s, i) => {
    if (!exact(s) || (i && exact(steps[i - 1]))) return;
    const j = steps.findIndex((t, k) => k > i && !exact(t));
    spans.push({ from: s.min, to: j < 0 ? end : steps[j].min, inBy: s.scorer, outBy: j < 0 ? null : steps[j].scorer, held: j < 0, pts: pts(s) });
  });
  const got = pts({ a: mm.final.a, b: mm.final.b });
  const could = Math.max(got, ...spans.map((s) => s.pts));
  return { state: spans.some((s) => s.held) ? "held" : spans.length ? "lost" : "none", spans, mins: spans.reduce((t, s) => t + s.to - s.from, 0), could, got, diff: could - got };
}

const BG = { held: "rgba(52,211,153,0.32)", lost: "rgba(251,113,133,0.26)", none: "rgba(255,255,255,0.04)" };

function Count({ v, className, style }) {
  const ref = useRef();
  useEffect(() => {
    const c = animate(0, v, { duration: 0.8, ease: [0.23, 1, 0.32, 1], onUpdate: (x) => { if (ref.current) ref.current.textContent = f2(x); } });
    return () => c.stop();
  }, [v]);
  return <span ref={ref} className={className} style={style}>{f2(v)}</span>;
}

export default function NightHitsMap({ matches, preds, users, me }) {
  // users: [{ userId, name }] in table order
  const grid = useMemo(() => matches.map((mm) => ({ mm, cells: users.map((u) => ({ u, p: preds[mm.id]?.[u.userId], ...cellOf(mm, preds[mm.id]?.[u.userId]) })) })), [matches, preds, users]);
  // open on the cell that lost the most points (else a hit that held), so the detail shows at once
  const first = useMemo(() => {
    const all = grid.flatMap((r) => r.cells.map((c) => ({ mm: r.mm, c })));
    return all.filter((x) => x.c.state === "lost").sort((a, b) => b.c.diff - a.c.diff)[0] || all.find((x) => x.c.state === "held") || null;
  }, [grid]);
  const [sel, setSel] = useState(first);
  useEffect(() => setSel(first), [first]);
  const anyHit = !!first;

  return (
    <div dir="rtl" className="min-w-0">
      {anyHit ? (
        <div className="mb-2 flex items-center justify-center gap-1.5 text-[11.5px] font-bold" style={{ color: GOLD }}>
          <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 1.4 }}><Hand className="h-3.5 w-3.5" /></motion.span>לחצו על משבצת צבעונית לפרטים
        </div>
      ) : <div className="mb-2 text-center text-[12px] text-slate-400">אף אחד לא היה בתוצאה מדויקת הערב</div>}

      <div className="overflow-x-auto rounded-2xl p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
          <thead><tr><th />{users.map((u) => <th key={u.userId} className="text-[10.5px] font-bold whitespace-nowrap" style={{ color: u.userId === me ? GOLD : MUTED }}>{u.name}</th>)}</tr></thead>
          <tbody>{grid.map(({ mm, cells }) => (
            <tr key={mm.id}>
              <td className="pl-1"><div className="flex items-center gap-0.5" dir="ltr">
                <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-4 h-4" animate={false} />
                <span className="text-[10px] font-bold text-slate-300 tabular-nums" style={NUM}>{mm.final.a}-{mm.final.b}</span>
                <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-4 h-4" animate={false} />
              </div></td>
              {cells.map((c) => { const on = sel && sel.mm.id === mm.id && sel.c.u.userId === c.u.userId; return (
                <td key={c.u.userId}>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setSel({ mm, c })} dir="ltr"
                    className="grid h-8 w-full min-w-[34px] place-items-center rounded-lg text-[10px] font-black tabular-nums"
                    style={{ ...NUM, background: BG[c.state], color: c.state === "none" ? "#64748b" : "#fff", outline: on ? `2px solid ${GOLD}` : "none" }}
                    aria-label={`${c.u.name}, ${mm.m.team_a} נגד ${mm.m.team_b}`}>
                    {c.p ? `${c.p.predicted_score_a}-${c.p.predicted_score_b}` : "–"}
                  </motion.button>
                </td>); })}
            </tr>))}</tbody>
        </table>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
        {[["held", GREEN, "פגיעה שהחזיקה"], ["lost", RED, "פגיעה שנהרסה"]].map(([k, c, l]) => <span key={k} className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: BG[k], border: `1px solid ${c}` }} />{l}</span>)}
      </div>

      {sel && <Detail key={sel.mm.id + sel.c.u.userId} mm={sel.mm} c={sel.c} />}
    </div>
  );
}

function Detail({ mm, c }) {
  const tone = c.state === "held" ? GREEN : c.state === "lost" ? RED : "#e2e8f0";
  const lostTone = c.diff > 0.004 ? RED : GREEN;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mt-3 overflow-hidden rounded-3xl"
      style={{ background: "linear-gradient(180deg, rgba(250,204,21,0.10), rgba(255,255,255,0.03))", border: "1px solid rgba(250,204,21,0.25)" }}>
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="min-w-0">
          <div className="text-[16px] font-black text-white">{c.u.name}</div>
          <div className="flex items-center gap-1 text-[11.5px] text-slate-400" dir="ltr">
            <TeamFlag logo={mm.m.team_a_logo} name={mm.m.team_a} className="w-4 h-4" animate={false} />
            <span className="truncate">{mm.m.team_a.trim()} {mm.final.a}-{mm.final.b} {mm.m.team_b.trim()}</span>
            <TeamFlag logo={mm.m.team_b_logo} name={mm.m.team_b} className="w-4 h-4" animate={false} />
          </div>
        </div>
        <div className="text-left"><div className="text-[10.5px] text-slate-400">ניחש</div>
          <div dir="ltr" className="text-[20px] font-black tabular-nums" style={{ ...NUM, color: tone }}>{c.p ? `${c.p.predicted_score_a}-${c.p.predicted_score_b}` : "–"}</div></div>
      </div>
      <div className="flex items-end justify-center gap-2 px-3 pb-4">
        <div className="text-center"><div className="text-[10px] text-slate-400">יכול היה לצבור</div><Count v={c.could} className="text-[24px] font-black" style={{ ...NUM, color: GOLD }} /></div>
        <span className="pb-1 text-[20px] font-black text-slate-500">−</span>
        <div className="text-center"><div className="text-[10px] text-slate-400">צבר בפועל</div><Count v={c.got} className="text-[24px] font-black text-white" style={NUM} /></div>
        <span className="pb-1 text-[20px] font-black text-slate-500">=</span>
        <div className="text-center"><div className="text-[10px] text-slate-400">נהרסו</div><Count v={c.diff} className="text-[28px] font-black" style={{ ...NUM, color: lostTone }} /></div>
      </div>
      <div className="flex items-center justify-center gap-1.5 px-3 py-2 text-[12px] font-bold text-slate-200" style={{ background: "rgba(255,255,255,0.04)" }}>
        <Clock className="h-3.5 w-3.5" style={{ color: c.spans.length ? GREEN : MUTED }} />
        {c.spans.length ? `התוצאה המדויקת החזיקה ${minutesText(c.mins)}${c.state === "held" ? ", עד השריקה" : ""}` : "לא היה בתוצאה המדויקת באף רגע"}
      </div>
    </motion.div>
  );
}
