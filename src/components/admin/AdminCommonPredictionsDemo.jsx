import React, { useState, useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from "recharts";

// ── Demo data ──────────────────────────────────────────────────────────────────
const DATA = [
  { score: "1-0", count: 12 },
  { score: "1-1", count: 10 },
  { score: "2-1", count: 9 },
  { score: "2-0", count: 8 },
  { score: "0-0", count: 7 },
  { score: "3-1", count: 5 },
  { score: "0-1", count: 5 },
  { score: "2-2", count: 4 },
];
const MAX = DATA[0].count;
const TOTAL = DATA.reduce((s, d) => s + d.count, 0);

const COLORS = ["#f5c518", "#e2e8f0", "#cd7f32", "#60a5fa", "#34d399", "#a78bfa", "#fb923c", "#f87171"];
const MEDALS = ["🥇", "🥈", "🥉"];

const tt = { background: "rgba(10,14,28,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 12 };

const VLabel = ({ n, title }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="text-[10px] font-mono bg-amber-400/15 text-amber-400 px-2 py-0.5 rounded-full">#{n}</span>
    <span className="text-white/70 text-xs">{title}</span>
  </div>
);

// ── Animated bar fill hook ────────────────────────────────────────────────────
function useAnimIn(delay = 150) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, [delay]);
  return on;
}

// ══════════════════════════════════════════════════════════════════════════════
// 1 · Horizontal bars – gradient gold (refined current)
// ══════════════════════════════════════════════════════════════════════════════
function V1() {
  const on = useAnimIn(100);
  return (
    <div className="space-y-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3">
          <div className="w-5 text-center text-[11px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
            {i < 3 ? MEDALS[i] : `${i + 1}.`}
          </div>
          <div className="w-9 text-center font-bold text-xs rounded-md py-0.5 flex-shrink-0"
            style={{ color: COLORS[i], background: `${COLORS[i]}18` }}>{d.score}</div>
          <div className="flex-1 h-7 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full flex items-center justify-end pr-2.5"
              style={{
                width: on ? `${(d.count / MAX) * 100}%` : "0%",
                background: i === 0 ? "linear-gradient(90deg,#d4a520,#f5c518)" : `${COLORS[i]}55`,
                transition: `width ${0.55 + i * 0.06}s cubic-bezier(0.34,1.2,0.64,1)`,
                boxShadow: i === 0 ? "0 0 12px #f5c51855" : "none",
              }}>
              <span className="text-[10px] font-black" style={{ color: i === 0 ? "#000" : COLORS[i] }}>{d.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2 · Vertical columns (recharts)
// ══════════════════════════════════════════════════════════════════════════════
function V2() {
  const CustomTT = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return <div style={tt} className="px-3 py-2"><p>{payload[0].payload.score}</p><p className="text-amber-400 font-bold">{payload[0].value} פעמים</p></div>;
  };
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={DATA} margin={{ top: 8, right: 4, bottom: 4, left: -28 }}>
        <XAxis dataKey="score" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTT />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {DATA.map((_, i) => <Cell key={i} fill={COLORS[i]} fillOpacity={i === 0 ? 1 : 0.6} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3 · Score matrix grid
// ══════════════════════════════════════════════════════════════════════════════
function V3() {
  // Build a 5×5 grid (0-4 home, 0-4 away)
  const freq = {};
  DATA.forEach(d => { freq[d.score] = d.count; });
  const maxF = MAX;
  return (
    <div>
      <div className="flex items-center justify-center gap-1 mb-2">
        <span className="text-slate-500 text-[10px] rotate-[-90deg] mr-1">בית →</span>
        <div>
          <div className="flex gap-1 mb-1 mr-6">
            {[0,1,2,3,4].map(a => <div key={a} className="w-9 text-center text-[10px] text-slate-500">{a}</div>)}
          </div>
          {[0,1,2,3,4].map(h => (
            <div key={h} className="flex gap-1 mb-1 items-center">
              <div className="w-5 text-[10px] text-slate-500 text-right">{h}</div>
              {[0,1,2,3,4].map(a => {
                const key = `${h}-${a}`;
                const c = freq[key] || 0;
                const pct = c / maxF;
                return (
                  <div key={a} className="w-9 h-9 rounded-lg flex items-center justify-center relative"
                    style={{ background: c > 0 ? `rgba(245,197,24,${0.1 + pct * 0.85})` : "rgba(255,255,255,0.04)", border: c > 0 ? `1px solid rgba(245,197,24,${0.2 + pct * 0.5})` : "1px solid rgba(255,255,255,0.06)" }}>
                    {c > 0 && <span className="font-bold text-xs" style={{ color: pct > 0.5 ? "#000" : "#f5c518" }}>{c}</span>}
                  </div>
                );
              })}
            </div>
          ))}
          <div className="text-center text-slate-500 text-[10px] mt-1 mr-6">← חוץ</div>
        </div>
      </div>
      <p className="text-center text-slate-500 text-[10px]">עוצמת הצהוב = כמה פעמים ניחשת</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 4 · Bubble / circles
// ══════════════════════════════════════════════════════════════════════════════
function V4() {
  const on = useAnimIn(100);
  const maxR = 44;
  const minR = 18;
  return (
    <div className="flex flex-wrap gap-3 justify-center py-2">
      {DATA.map((d, i) => {
        const r = minR + ((d.count / MAX) * (maxR - minR));
        return (
          <div key={d.score} className="flex flex-col items-center gap-1">
            <div className="rounded-full flex items-center justify-center font-bold"
              style={{
                width: on ? r * 2 : 0, height: on ? r * 2 : 0,
                background: `${COLORS[i]}22`,
                border: `2px solid ${COLORS[i]}99`,
                color: COLORS[i],
                fontSize: r > 28 ? 14 : 11,
                transition: `width ${0.4 + i * 0.05}s, height ${0.4 + i * 0.05}s`,
                boxShadow: i === 0 ? `0 0 16px ${COLORS[i]}55` : "none",
              }}>
              {d.count}
            </div>
            <span className="text-[10px] font-mono" style={{ color: COLORS[i], opacity: 0.8 }}>{d.score}</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5 · Podium (top 3 + rest as list)
// ══════════════════════════════════════════════════════════════════════════════
function V5() {
  const on = useAnimIn(200);
  const podium = [DATA[1], DATA[0], DATA[2]]; // 2nd, 1st, 3rd visual order
  const heights = [80, 110, 60];
  const podColors = ["#C0C0C0", "#FFD700", "#CD7F32"];
  return (
    <div>
      {/* Podium */}
      <div className="flex items-end justify-center gap-3 mb-4 h-32">
        {podium.map((d, i) => (
          <div key={d.score} className="flex flex-col items-center gap-1">
            <div className="text-center mb-1">
              <div className="font-bold text-sm" style={{ color: podColors[i] }}>{d.score}</div>
              <div className="text-[10px] text-slate-400">{d.count}×</div>
            </div>
            <div className="w-14 rounded-t-xl flex items-center justify-center text-xl"
              style={{
                height: on ? heights[i] : 0,
                background: `${podColors[i]}22`,
                border: `1px solid ${podColors[i]}66`,
                transition: `height ${0.6 + i * 0.1}s cubic-bezier(0.34,1.2,0.64,1)`,
              }}>
              {["🥈","🥇","🥉"][i]}
            </div>
          </div>
        ))}
      </div>
      {/* Rest */}
      <div className="space-y-1 border-t border-white/10 pt-3">
        {DATA.slice(3).map((d, i) => (
          <div key={d.score} className="flex items-center gap-3 text-xs">
            <span className="text-slate-600 w-4 text-right">{i + 4}.</span>
            <span className="font-mono font-bold text-slate-300 w-10">{d.score}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${(d.count / MAX) * 100}%`, background: COLORS[i + 3] }} />
            </div>
            <span className="text-slate-500 w-4 text-right">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 6 · Glass morphism ranked cards
// ══════════════════════════════════════════════════════════════════════════════
function V6() {
  return (
    <div className="space-y-2">
      {DATA.slice(0, 6).map((d, i) => (
        <div key={d.score} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", border: `1px solid ${COLORS[i]}30` }}>
          <span className="text-base w-6 text-center">{i < 3 ? MEDALS[i] : `${i + 1}.`}</span>
          <span className="font-black text-sm w-12" style={{ color: COLORS[i] }}>{d.score}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: `${(d.count / MAX) * 100}%`, background: COLORS[i], boxShadow: `0 0 8px ${COLORS[i]}66` }} />
          </div>
          <span className="text-xs font-bold" style={{ color: COLORS[i] }}>{d.count}×</span>
          <span className="text-[10px] text-slate-600">{((d.count / TOTAL) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 7 · Donut pie chart
// ══════════════════════════════════════════════════════════════════════════════
function V7() {
  const [active, setActive] = useState(null);
  const CustomTT = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return <div style={tt} className="px-3 py-2"><p style={{ color: d.payload.color }} className="font-bold">{d.name}</p><p className="text-white">{d.value} פעמים ({((d.value / TOTAL) * 100).toFixed(0)}%)</p></div>;
  };
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={DATA.map((d, i) => ({ name: d.score, value: d.count, color: COLORS[i] }))}
            cx="50%" cy="50%" innerRadius={45} outerRadius={72}
            dataKey="value" paddingAngle={2}
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}>
            {DATA.map((_, i) => (
              <Cell key={i} fill={COLORS[i]}
                fillOpacity={active === null || active === i ? (i === 0 ? 1 : 0.7) : 0.3}
                stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTT />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex-1 space-y-1.5">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
            <span className="text-xs font-mono font-bold" style={{ color: COLORS[i] }}>{d.score}</span>
            <span className="text-[11px] text-slate-500 ml-auto">{d.count}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 8 · Neon arcade / retro
// ══════════════════════════════════════════════════════════════════════════════
function V8() {
  const on = useAnimIn(100);
  const neonColors = ["#ff0080", "#ff6600", "#ffcc00", "#00ff88", "#00ccff", "#8844ff", "#ff4488", "#44ffcc"];
  return (
    <div className="rounded-xl p-4" style={{ background: "#020010", border: "1px solid rgba(255,0,128,0.2)" }}>
      <p className="text-center font-mono text-[9px] tracking-[0.3em] mb-3" style={{ color: "rgba(255,0,128,0.6)" }}>
        ◆ TOP PREDICTIONS ◆
      </p>
      <div className="space-y-2">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-2">
            <span className="font-mono font-black w-9 text-sm" style={{ color: neonColors[i], textShadow: `0 0 10px ${neonColors[i]}` }}>
              {d.score}
            </span>
            <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="h-full flex items-center"
                style={{
                  width: on ? `${(d.count / MAX) * 100}%` : "0%",
                  background: `linear-gradient(90deg, ${neonColors[i]}33, ${neonColors[i]})`,
                  boxShadow: `0 0 8px ${neonColors[i]}88`,
                  transition: `width ${0.5 + i * 0.05}s ease`,
                }}>
              </div>
            </div>
            <span className="font-mono text-xs font-black" style={{ color: neonColors[i], textShadow: `0 0 8px ${neonColors[i]}` }}>
              {String(d.count).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center font-mono text-[8px] mt-3" style={{ color: "rgba(255,0,128,0.3)" }}>INSERT COIN TO CONTINUE</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 9 · Editorial / typography-first
// ══════════════════════════════════════════════════════════════════════════════
function V9() {
  return (
    <div style={{ fontFamily: "monospace" }}>
      <div className="border-b border-white/15 pb-2 mb-4 flex justify-between items-baseline">
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase">תוצאה</span>
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase">פעמים</span>
        <span className="text-white/30 text-[9px] tracking-[0.3em] uppercase">%</span>
      </div>
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-baseline justify-between py-1.5 border-b border-white/[0.05]">
          <span className="font-black text-2xl leading-none" style={{ color: i === 0 ? "#f5c518" : i < 3 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)" }}>
            {d.score}
          </span>
          <span className="text-white/50 text-sm font-bold">{d.count}</span>
          <span className="text-white/25 text-xs">{((d.count / TOTAL) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 10 · Tag frequency cloud
// ══════════════════════════════════════════════════════════════════════════════
function V10() {
  const on = useAnimIn(100);
  const sorted = [...DATA].sort(() => Math.random() - 0.5); // shuffle for cloud feel
  return (
    <div>
      <div className="flex flex-wrap gap-2 justify-center py-2">
        {DATA.map((d, i) => {
          const scale = 0.7 + (d.count / MAX) * 0.9;
          const fontSize = Math.round(11 + (d.count / MAX) * 18);
          return (
            <div key={d.score}
              className="px-3 py-1.5 rounded-xl font-black cursor-default select-none transition-transform hover:scale-110"
              style={{
                fontSize,
                color: COLORS[i],
                background: `${COLORS[i]}15`,
                border: `1px solid ${COLORS[i]}${i === 0 ? "66" : "33"}`,
                opacity: on ? 1 : 0,
                transform: on ? "scale(1)" : "scale(0.5)",
                transition: `all ${0.3 + i * 0.06}s cubic-bezier(0.34,1.56,0.64,1)`,
                boxShadow: i === 0 ? `0 0 14px ${COLORS[i]}44` : "none",
              }}>
              {d.score}
              <span className="ml-1.5 font-normal" style={{ fontSize: 10, opacity: 0.6 }}>×{d.count}</span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-slate-600 text-[10px] mt-2">גודל הכרטיסייה = כמה פעמים ניחשת</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════════
const VARIANTS = [
  { n: 1,  title: "Horizontal bars – gradient gold",     C: V1  },
  { n: 2,  title: "עמודות אנכיות (Recharts)",            C: V2  },
  { n: 3,  title: "Score matrix grid – ריבוע תוצאות",   C: V3  },
  { n: 4,  title: "בועות / Bubbles – גודל = תדירות",    C: V4  },
  { n: 5,  title: "Podium – במה לשלישייה המובילה",      C: V5  },
  { n: 6,  title: "Glassmorphism ranked cards",          C: V6  },
  { n: 7,  title: "Donut pie – עוגת הניחושים",          C: V7  },
  { n: 8,  title: "Neon arcade – רטרו זוהר",            C: V8  },
  { n: 9,  title: "Editorial – טיפוגרפיה נקייה",        C: V9  },
  { n: 10, title: "Tag cloud – ענן תדירות",              C: V10 },
];

export default function AdminCommonPredictionsDemo() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">הניחוש הנפוץ ביותר — 10 עיצובים</h2>
        <p className="text-slate-400 text-sm">כל הנתונים הם דמו · בחר עיצוב ונוסיף לדף הסטטיסטיקה</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VARIANTS.map(({ n, title, C }) => (
          <div key={n} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
            <VLabel n={n} title={title} />
            <C />
          </div>
        ))}
      </div>
    </div>
  );
}
