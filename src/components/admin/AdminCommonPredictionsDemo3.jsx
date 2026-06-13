import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  LineChart, Line, CartesianGrid,
} from "recharts";

const DATA = [
  { score: "1-0", count: 12 },
  { score: "1-1", count: 10 },
  { score: "2-1", count: 9  },
  { score: "2-0", count: 8  },
  { score: "0-0", count: 7  },
  { score: "3-1", count: 5  },
  { score: "0-1", count: 5  },
  { score: "2-2", count: 4  },
];
const MAX   = DATA[0].count;
const TOTAL = DATA.reduce((s, d) => s + d.count, 0);
const AVG   = TOTAL / DATA.length;

const VLabel = ({ n, title }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="text-[10px] font-mono bg-white/8 text-white/40 px-2 py-0.5 rounded">{n}</span>
    <span className="text-white/55 text-xs">{title}</span>
  </div>
);

const tt = {
  background: "rgba(10,12,18,0.97)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 8,
  color: "#fff",
  fontSize: 12,
  padding: "6px 10px",
};

// ══════════════════════════════════════════════════════════════════════════════
// 26 · Clean data table
// ══════════════════════════════════════════════════════════════════════════════
function V26() {
  const [sort, setSort] = useState("count");
  const sorted = [...DATA].sort((a, b) => b[sort] - a[sort]);
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {[["#",""], ["תוצאה","score"], ["פעמים","count"], ["%",""]].map(([h, k]) => (
            <th key={h}
              className={`py-2 text-left font-medium text-xs cursor-pointer select-none ${k ? "hover:text-white" : ""}`}
              style={{ color: sort === k ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}
              onClick={() => k && setSort(k)}>
              {h}{sort === k ? " ↓" : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((d, i) => (
          <tr key={d.score} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            className="hover:bg-white/[0.02] transition-colors">
            <td className="py-2 text-white/20 text-xs">{i + 1}</td>
            <td className="py-2 font-mono font-bold text-white">{d.score}</td>
            <td className="py-2 font-bold text-white">{d.count}</td>
            <td className="py-2 text-white/35 text-xs">{((d.count / TOTAL) * 100).toFixed(0)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 27 · Minimal horizontal bars (no decoration)
// ══════════════════════════════════════════════════════════════════════════════
function V27() {
  return (
    <div className="space-y-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/50 w-9 flex-shrink-0">{d.score}</span>
          <div className="flex-1 h-5 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-sm"
              style={{ width: `${(d.count / MAX) * 100}%`, background: i === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.2)" }} />
          </div>
          <span className="text-xs text-white/40 w-5 text-right flex-shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 28 · Waffle chart (grid of squares)
// ══════════════════════════════════════════════════════════════════════════════
function V28() {
  // Fill 60 cells proportionally
  const cells = 60;
  const filled = DATA.map(d => Math.round((d.count / TOTAL) * cells));
  const palette = ["rgba(255,255,255,0.85)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0.45)",
    "rgba(255,255,255,0.3)", "rgba(255,255,255,0.2)", "rgba(255,255,255,0.15)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.07)"];
  const grid = filled.flatMap((n, i) => Array(n).fill(i));

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-3">
        {grid.slice(0, cells).map((ci, idx) => (
          <div key={idx} className="w-4 h-4 rounded-sm" style={{ background: palette[ci] }} />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: palette[i] }} />
            <span className="text-[10px] text-white/40 font-mono">{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 29 · Proportional stacked bar
// ══════════════════════════════════════════════════════════════════════════════
function V29() {
  const [hov, setHov] = useState(null);
  const palette = [
    "#ffffff","#d1d5db","#9ca3af","#6b7280",
    "#4b5563","#374151","#1f2937","#111827",
  ];
  return (
    <div>
      <div className="flex h-10 rounded-lg overflow-hidden mb-4 gap-px">
        {DATA.map((d, i) => (
          <div key={d.score}
            className="h-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              width: `${(d.count / TOTAL) * 100}%`,
              background: hov === i ? palette[i] : `${palette[i]}cc`,
              filter: hov !== null && hov !== i ? "brightness(0.6)" : "none",
            }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            {(d.count / TOTAL) > 0.12 && (
              <span className="text-[9px] font-bold" style={{ color: i < 3 ? "#000" : "#fff" }}>{d.score}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: palette[i] }} />
            <span className="text-[10px] text-white/45 font-mono">{d.score} · {((d.count/TOTAL)*100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 30 · Bullet chart (bar with reference line)
// ══════════════════════════════════════════════════════════════════════════════
function V30() {
  return (
    <div className="space-y-3">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3">
          <span className="font-mono text-xs text-white/45 w-9 flex-shrink-0">{d.score}</span>
          <div className="flex-1 relative h-5">
            {/* Background range */}
            <div className="absolute inset-0 rounded-sm" style={{ background: "rgba(255,255,255,0.05)" }} />
            {/* Bar */}
            <div className="absolute inset-y-1 left-0 rounded-sm"
              style={{ width: `${(d.count / MAX) * 100}%`, background: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.22)" }} />
            {/* Average reference line */}
            <div className="absolute top-0 bottom-0 w-px" style={{ left: `${(AVG / MAX) * 100}%`, background: "rgba(255,255,255,0.35)" }} />
          </div>
          <span className="text-xs text-white/35 w-4 text-right flex-shrink-0">{d.count}</span>
        </div>
      ))}
      <p className="text-[10px] text-white/20 pt-1">קו אנכי = ממוצע ({AVG.toFixed(1)})</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 31 · Diverging from average
// ══════════════════════════════════════════════════════════════════════════════
function V31() {
  return (
    <div className="space-y-2">
      {DATA.map((d, i) => {
        const delta = d.count - AVG;
        const pct = (Math.abs(delta) / (MAX - AVG)) * 45;
        return (
          <div key={d.score} className="flex items-center gap-2">
            <span className="font-mono text-xs text-white/40 w-9 flex-shrink-0 text-right">{d.score}</span>
            <div className="flex-1 flex items-center h-5">
              <div className="flex-1 flex justify-end">
                {delta < 0 && (
                  <div className="h-4 rounded-l-sm"
                    style={{ width: `${pct}%`, background: "rgba(255,255,255,0.18)" }} />
                )}
              </div>
              <div className="w-px h-5 flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }} />
              <div className="flex-1">
                {delta >= 0 && (
                  <div className="h-4 rounded-r-sm"
                    style={{ width: `${pct}%`, background: i === 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.35)" }} />
                )}
              </div>
            </div>
            <span className="text-[10px] w-10 flex-shrink-0"
              style={{ color: delta >= 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}>
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}
            </span>
          </div>
        );
      })}
      <p className="text-[10px] text-white/18 pt-1">ציר = ממוצע · ימין = מעל ממוצע · שמאל = מתחת</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 32 · Mosaic (width-proportional blocks)
// ══════════════════════════════════════════════════════════════════════════════
function V32() {
  const [hov, setHov] = useState(null);
  return (
    <div>
      <div className="flex gap-1 mb-3">
        {DATA.map((d, i) => (
          <div key={d.score}
            className="flex flex-col items-center justify-end rounded-md cursor-pointer transition-all"
            style={{
              width: `${(d.count / TOTAL) * 100}%`,
              height: 72,
              background: hov === i ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              paddingBottom: 6,
            }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
            {(d.count / TOTAL) > 0.1 && (
              <>
                <span className="text-[9px] font-mono font-bold text-white/70">{d.score}</span>
                <span className="text-[9px] text-white/35">{d.count}</span>
              </>
            )}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/20">רוחב = שיעור יחסי</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 33 · Small multiples (mini bar per score)
// ══════════════════════════════════════════════════════════════════════════════
function V33() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="rounded-lg p-3 flex flex-col items-center gap-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="w-full flex items-end justify-center" style={{ height: 40 }}>
            <div className="w-5 rounded-t-sm"
              style={{ height: `${(d.count / MAX) * 40}px`, background: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }} />
          </div>
          <span className="font-mono text-[10px] font-bold text-white/60">{d.score}</span>
          <span className="text-[11px] font-bold text-white/40">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 34 · Leaderboard rows
// ══════════════════════════════════════════════════════════════════════════════
function V34() {
  return (
    <div className="space-y-px">
      {DATA.map((d, i) => (
        <div key={d.score}
          className="flex items-center gap-4 px-4 py-3 rounded transition-colors hover:bg-white/[0.03]"
          style={{ background: i === 0 ? "rgba(255,255,255,0.05)" : "transparent", borderLeft: i === 0 ? "2px solid rgba(255,255,255,0.4)" : "2px solid transparent" }}>
          <span className="text-sm font-bold w-5 flex-shrink-0" style={{ color: i < 3 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)" }}>{i + 1}</span>
          <span className="font-mono font-bold text-sm flex-1 text-white/80">{d.score}</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div className="h-full rounded-full" style={{ width: `${(d.count / MAX) * 100}%`, background: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }} />
            </div>
            <span className="text-sm font-bold text-white/50 w-4 text-right">{d.count}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 35 · KPI metric grid (clean number cards)
// ══════════════════════════════════════════════════════════════════════════════
function V35() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="rounded-xl p-3 flex flex-col gap-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[10px] text-white/30 font-mono">{d.score}</span>
          <span className="text-2xl font-black leading-none" style={{ color: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)" }}>{d.count}</span>
          <span className="text-[9px] text-white/18">{((d.count / TOTAL) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 36 · Stripe-style stat rows
// ══════════════════════════════════════════════════════════════════════════════
function V36() {
  return (
    <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/25 font-mono w-4">{i + 1}</span>
            <span className="font-mono text-sm font-semibold text-white/70">{d.score}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-full" style={{ width: `${(d.count / MAX) * 100}%`, background: i === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)" }} />
            </div>
            <span className="text-sm font-bold text-white/60 w-5 text-right">{d.count}</span>
            <span className="text-xs text-white/25 w-8 text-right">{((d.count / TOTAL) * 100).toFixed(0)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 37 · Linear-style (like Linear issue tracker progress)
// ══════════════════════════════════════════════════════════════════════════════
function V37() {
  return (
    <div className="space-y-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3 group">
          <div className="w-9 flex-shrink-0">
            <span className="text-[11px] font-mono text-white/40 group-hover:text-white/60 transition-colors">{d.score}</span>
          </div>
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${(d.count / MAX) * 100}%`, background: i === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.22)" }} />
          </div>
          <span className="text-[11px] font-semibold text-white/35 w-4 text-right flex-shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 38 · Funnel chart
// ══════════════════════════════════════════════════════════════════════════════
function V38() {
  return (
    <div className="space-y-1.5">
      {DATA.map((d, i) => {
        const w = 30 + ((d.count / MAX) * 70);
        return (
          <div key={d.score} className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/35 w-9 text-right flex-shrink-0">{d.score}</span>
            <div className="flex-1 flex justify-center">
              <div className="h-7 rounded-sm flex items-center justify-center transition-all"
                style={{ width: `${w}%`, background: i === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-[10px] font-bold text-white/50">{d.count}</span>
              </div>
            </div>
            <span className="text-[10px] text-white/20 w-8 flex-shrink-0">{((d.count / TOTAL) * 100).toFixed(0)}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 39 · Dot strip plot
// ══════════════════════════════════════════════════════════════════════════════
function V39() {
  return (
    <div>
      <div className="relative h-6 mb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        {[0, 3, 6, 9, 12].map(v => (
          <div key={v} className="absolute bottom-0 flex flex-col items-center"
            style={{ left: `${(v / MAX) * 100}%`, transform: "translateX(-50%)" }}>
            <span className="text-[9px] text-white/20">{v}</span>
          </div>
        ))}
      </div>
      <div className="space-y-2 mt-3">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-white/35 w-9 flex-shrink-0">{d.score}</span>
            <div className="flex-1 relative h-4">
              <div className="absolute w-2 h-2 rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{
                  left: `${(d.count / MAX) * 100}%`,
                  background: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                  boxShadow: i === 0 ? "0 0 6px rgba(255,255,255,0.5)" : "none",
                }} />
              <div className="absolute inset-y-1/2 left-0 h-px" style={{ width: `${(d.count / MAX) * 100}%`, background: "rgba(255,255,255,0.08)" }} />
            </div>
            <span className="text-[10px] text-white/25 w-4 text-right flex-shrink-0">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 40 · Recharts clean column (white-on-dark, labeled)
// ══════════════════════════════════════════════════════════════════════════════
function V40() {
  const CustomTT = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return <div style={tt}><b>{payload[0].payload.score}</b>: {payload[0].value} פעמים</div>;
  };
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={DATA} margin={{ top: 16, right: 4, bottom: 0, left: -28 }}
        barCategoryGap="30%">
        <XAxis dataKey="score" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTT />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]} label={{ position: "top", fill: "rgba(255,255,255,0.3)", fontSize: 10 }}>
          {DATA.map((_, i) => <Cell key={i} fill={i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 41 · GitHub contribution grid
// ══════════════════════════════════════════════════════════════════════════════
function V41() {
  const freq = {};
  DATA.forEach(d => { freq[d.score] = d.count; });
  // Build 5×5 grid from 0-2 goals each side
  const rows = [0,1,2,3,4];
  return (
    <div>
      <div className="inline-block">
        {/* Col headers (away) */}
        <div className="flex ml-7 mb-1 gap-1">
          {rows.map(a => <div key={a} className="w-8 text-center text-[9px] text-white/25">{a}</div>)}
        </div>
        {rows.map(h => (
          <div key={h} className="flex items-center gap-1 mb-1">
            <div className="w-5 text-[9px] text-white/25 text-right mr-1">{h}</div>
            {rows.map(a => {
              const c = freq[`${h}-${a}`] || 0;
              const alpha = c === 0 ? 0.04 : 0.08 + (c / MAX) * 0.65;
              return (
                <div key={a} className="w-8 h-8 rounded-sm flex items-center justify-center"
                  style={{ background: `rgba(255,255,255,${alpha})`, border: "1px solid rgba(255,255,255,0.06)" }}>
                  {c > 0 && <span className="text-[9px] font-bold" style={{ color: `rgba(255,255,255,${0.3 + alpha})` }}>{c}</span>}
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex ml-7 mt-1 gap-1">
          <span className="text-[9px] text-white/18">← חוץ · בית ↑</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 42 · Step / histogram (recharts step type)
// ══════════════════════════════════════════════════════════════════════════════
function V42() {
  const CustomTT = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return <div style={tt}><b>{payload[0].payload.score}</b>: {payload[0].value}</div>;
  };
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={DATA} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="score" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTT />} />
        <Line type="stepAfter" dataKey="count" stroke="rgba(255,255,255,0.55)" strokeWidth={2}
          dot={{ fill: "rgba(255,255,255,0.6)", r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 43 · Rank comparison (slope)
// ══════════════════════════════════════════════════════════════════════════════
function V43() {
  return (
    <div className="flex gap-4 items-stretch">
      {/* Left: rank */}
      <div className="flex flex-col justify-around">
        {DATA.map((d, i) => (
          <div key={d.score} className="text-right">
            <span className="text-xs font-bold" style={{ color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }}>#{i + 1}</span>
          </div>
        ))}
      </div>
      {/* Lines */}
      <div className="flex-1 relative" style={{ minHeight: 180 }}>
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {DATA.map((d, i) => {
            const y = (i / (DATA.length - 1)) * 100;
            const x2 = (d.count / MAX) * 100;
            return (
              <line key={d.score}
                x1="0%" y1={`${y}%`} x2={`${x2}%`} y2={`${y}%`}
                stroke={i === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
                strokeWidth={i === 0 ? 2 : 1} />
            );
          })}
        </svg>
      </div>
      {/* Right: score + count */}
      <div className="flex flex-col justify-around">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-2">
            <span className="font-mono text-[10px]" style={{ color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>{d.score}</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 44 · Compact inline — single line per item
// ══════════════════════════════════════════════════════════════════════════════
function V44() {
  return (
    <div className="font-mono text-xs space-y-1">
      {DATA.map((d, i) => {
        const filled = Math.round((d.count / MAX) * 12);
        const bar = "█".repeat(filled) + "░".repeat(12 - filled);
        return (
          <div key={d.score} className="flex items-center gap-3">
            <span style={{ color: i === 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)" }}>{d.score}</span>
            <span style={{ color: i === 0 ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)", letterSpacing: 1 }}>{bar}</span>
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{d.count}</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 45 · Percentage ring per score (small ring grid)
// ══════════════════════════════════════════════════════════════════════════════
function MiniRing({ pct, label, count, highlight }) {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={54} height={54} viewBox="0 0 54 54">
        <circle cx={27} cy={27} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={7} />
        <circle cx={27} cy={27} r={r} fill="none"
          stroke={highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}
          strokeWidth={7} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ * 0.25} />
        <text x={27} y={31} textAnchor="middle"
          fill={highlight ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)"}
          fontSize={10} fontWeight={700}>{count}</text>
      </svg>
      <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</span>
    </div>
  );
}

function V45() {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {DATA.map((d, i) => (
        <MiniRing key={d.score} pct={(d.count / MAX) * 100} label={d.score} count={d.count} highlight={i === 0} />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════════
const VARIANTS = [
  { n: 26, title: "Data table — טבלה עם מיון",           C: V26 },
  { n: 27, title: "Minimal bars — פשוט ונקי",            C: V27 },
  { n: 28, title: "Waffle chart — רשת ריבועים",          C: V28 },
  { n: 29, title: "Stacked bar — פס אחד מחולק",          C: V29 },
  { n: 30, title: "Bullet chart — עם קו ממוצע",          C: V30 },
  { n: 31, title: "Diverging — סטייה מהממוצע",           C: V31 },
  { n: 32, title: "Mosaic — בלוקים לפי רוחב יחסי",      C: V32 },
  { n: 33, title: "Small multiples — עמודה קטנה לכל תוצאה", C: V33 },
  { n: 34, title: "Leaderboard — טבלת מובילים",          C: V34 },
  { n: 35, title: "KPI grid — כרטיסי מדד",               C: V35 },
  { n: 36, title: "Stripe-style — שורות סטטיסטיקה",     C: V36 },
  { n: 37, title: "Linear-style — כמו Linear tracker",   C: V37 },
  { n: 38, title: "Funnel — משפך יורד",                  C: V38 },
  { n: 39, title: "Dot strip — נקודה על ציר",            C: V39 },
  { n: 40, title: "Column chart עם תוויות",              C: V40 },
  { n: 41, title: "Contribution grid — כמו GitHub",      C: V41 },
  { n: 42, title: "Step chart — היסטוגרם מדורג",         C: V42 },
  { n: 43, title: "Slope — פסים לפי דירוג",              C: V43 },
  { n: 44, title: "ASCII bar — קומפקטי במיוחד",          C: V44 },
  { n: 45, title: "Mini rings — טבעת קטנה לכל תוצאה",   C: V45 },
];

export default function AdminCommonPredictionsDemo3() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">ניחוש נפוץ — עיצובים 26–45 (רציניים)</h2>
        <p className="text-slate-400 text-sm">אסתטיקה של Stripe / Linear / Vercel · ללא קישוטים מיותרים</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {VARIANTS.map(({ n, title, C }) => (
          <div key={n} className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <VLabel n={n} title={title} />
            <C />
          </div>
        ))}
      </div>
    </div>
  );
}
