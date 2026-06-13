import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

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

const VLabel = ({ n, title }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="text-[10px] font-mono bg-amber-400/15 text-amber-400 px-2 py-0.5 rounded-full">#{n}</span>
    <span className="text-white/70 text-xs">{title}</span>
  </div>
);

function useAnimIn(delay = 150) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, [delay]);
  return on;
}

// ══════════════════════════════════════════════════════════════════════════════
// 11 · Lollipop chart
// ══════════════════════════════════════════════════════════════════════════════
function V11() {
  const on = useAnimIn(100);
  return (
    <div className="space-y-3">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3">
          <div className="w-9 text-center font-bold text-xs flex-shrink-0" style={{ color: COLORS[i] }}>{d.score}</div>
          <div className="flex-1 flex items-center gap-0 relative h-4">
            <div className="h-px flex-shrink-0 rounded-full"
              style={{
                width: on ? `calc(${(d.count / MAX) * 100}% - 12px)` : "0%",
                background: `${COLORS[i]}66`,
                transition: `width ${0.5 + i * 0.06}s cubic-bezier(0.34,1.2,0.64,1)`,
              }} />
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: `${COLORS[i]}22`,
                border: `2px solid ${COLORS[i]}`,
                boxShadow: i === 0 ? `0 0 10px ${COLORS[i]}66` : "none",
                transform: on ? "scale(1)" : "scale(0)",
                transition: `transform ${0.4 + i * 0.06}s cubic-bezier(0.34,1.56,0.64,1) ${0.2 + i * 0.04}s`,
              }}>
              <span className="text-[9px] font-black" style={{ color: COLORS[i] }}>{d.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 12 · Dot plot — stacked dots (each dot = 1 prediction)
// ══════════════════════════════════════════════════════════════════════════════
function V12() {
  const on = useAnimIn(100);
  return (
    <div className="flex gap-3 items-end justify-center pt-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex flex-col items-center gap-1">
          <div className="flex flex-col-reverse gap-0.5">
            {Array.from({ length: d.count }).map((_, di) => (
              <div key={di} className="w-4 h-4 rounded-full"
                style={{
                  background: `${COLORS[i]}${di === d.count - 1 ? "ff" : "88"}`,
                  boxShadow: di === d.count - 1 && i === 0 ? `0 0 8px ${COLORS[i]}` : "none",
                  transform: on ? "scale(1)" : "scale(0)",
                  transition: `transform ${0.25 + di * 0.04}s cubic-bezier(0.34,1.56,0.64,1)`,
                }} />
            ))}
          </div>
          <span className="text-[10px] font-bold mt-1" style={{ color: COLORS[i] }}>{d.score}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 13 · Radial bars (SVG, bars from center outward)
// ══════════════════════════════════════════════════════════════════════════════
function V13() {
  const on = useAnimIn(150);
  const cx = 110, cy = 110, minR = 28, maxR = 95;
  const n = DATA.length;
  return (
    <div className="flex flex-col items-center">
      <svg width={220} height={220} viewBox="0 0 220 220">
        {/* Rings */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <circle key={f} cx={cx} cy={cy} r={minR + f * (maxR - minR)}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
        ))}
        {DATA.map((d, i) => {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
          const barLen = on ? (d.count / MAX) * (maxR - minR) : 0;
          const x1 = cx + minR * Math.cos(angle);
          const y1 = cy + minR * Math.sin(angle);
          const x2 = cx + (minR + barLen) * Math.cos(angle);
          const y2 = cy + (minR + barLen) * Math.sin(angle);
          const lx = cx + (maxR + 14) * Math.cos(angle);
          const ly = cy + (maxR + 14) * Math.sin(angle);
          return (
            <g key={d.score}>
              <line x1={cx} y1={cy} x2={cx + maxR * Math.cos(angle)} y2={cy + maxR * Math.sin(angle)}
                stroke="rgba(255,255,255,0.04)" strokeWidth={6} strokeLinecap="round" />
              <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS[i]} strokeWidth={6} strokeLinecap="round"
                style={{ transition: `x2 0.8s, y2 0.8s`, filter: i === 0 ? `drop-shadow(0 0 4px ${COLORS[i]})` : "none" }} />
              <circle cx={x2} cy={y2} r={4} fill={COLORS[i]}
                style={{ transition: `cx 0.8s, cy 0.8s` }} />
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                fill={COLORS[i]} fontSize={9} fontWeight={700}>{d.score}</text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={minR - 4} fill="rgba(0,0,0,0.6)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={8}>סה״כ</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#f5c518" fontSize={14} fontWeight={900}>{TOTAL}</text>
      </svg>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 14 · LED dot matrix
// ══════════════════════════════════════════════════════════════════════════════
function V14() {
  const on = useAnimIn(200);
  const rows = MAX;
  return (
    <div className="rounded-xl p-4" style={{ background: "#050a0f", border: "1px solid rgba(0,255,100,0.1)" }}>
      <p className="font-mono text-[9px] tracking-[0.25em] text-center mb-3" style={{ color: "rgba(0,255,100,0.4)" }}>
        ▶ PREDICTION MATRIX
      </p>
      <div className="flex gap-2 items-end justify-center">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex flex-col items-center gap-1">
            <div className="flex flex-col-reverse gap-1">
              {Array.from({ length: rows }).map((_, row) => {
                const lit = on && row < d.count;
                return (
                  <div key={row} className="w-3 h-3 rounded-sm"
                    style={{
                      background: lit ? COLORS[i] : "rgba(255,255,255,0.04)",
                      boxShadow: lit ? `0 0 6px ${COLORS[i]}` : "none",
                      transition: `background ${0.05 + row * 0.04}s ease ${lit ? row * 0.04 : 0}s, box-shadow 0.2s`,
                    }} />
                );
              })}
            </div>
            <span className="font-mono text-[9px] font-bold mt-1" style={{ color: COLORS[i] }}>{d.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 15 · Tally marks (IIII)
// ══════════════════════════════════════════════════════════════════════════════
function Tally({ count, color }) {
  const groups = Math.floor(count / 5);
  const rem = count % 5;
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: groups }).map((_, gi) => (
        <div key={gi} className="flex items-center gap-px relative">
          {Array.from({ length: 4 }).map((_, li) => (
            <div key={li} className="w-0.5 h-5 rounded-full" style={{ background: color }} />
          ))}
          {/* diagonal cross */}
          <div className="absolute" style={{
            left: -2, top: 2, width: 20, height: 2,
            background: color,
            transform: "rotate(-65deg)",
            transformOrigin: "left center",
          }} />
        </div>
      ))}
      {rem > 0 && (
        <div className="flex items-center gap-px">
          {Array.from({ length: rem }).map((_, li) => (
            <div key={li} className="w-0.5 h-5 rounded-full" style={{ background: color }} />
          ))}
        </div>
      )}
    </div>
  );
}

function V15() {
  return (
    <div className="space-y-3">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3">
          <span className="font-bold text-xs w-9 flex-shrink-0" style={{ color: COLORS[i] }}>{d.score}</span>
          <div className="flex-1"><Tally count={d.count} color={COLORS[i]} /></div>
          <span className="text-[11px] text-slate-500 flex-shrink-0">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 16 · FIFA attribute style (like player card stats)
// ══════════════════════════════════════════════════════════════════════════════
function V16() {
  const on = useAnimIn(100);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(160deg,#1a1200,#2a1e00)", border: "1px solid rgba(200,140,0,0.3)" }}>
      <div className="px-4 py-2 border-b" style={{ borderColor: "rgba(200,140,0,0.2)", background: "rgba(200,140,0,0.08)" }}>
        <p className="font-black text-[9px] tracking-[0.25em]" style={{ color: "rgba(200,140,0,0.7)" }}>PREDICTION ATTRIBUTES</p>
      </div>
      <div className="p-4 space-y-3">
        {DATA.map((d, i) => (
          <div key={d.score} className="flex items-center gap-3">
            <span className="font-black text-lg w-6 text-right" style={{ color: "#d4a520" }}>{d.count}</span>
            <span className="text-[10px] text-amber-300/50 w-9">{d.score}</span>
            <div className="flex-1 h-3 rounded-sm overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-sm"
                style={{
                  width: on ? `${(d.count / MAX) * 100}%` : "0%",
                  background: i === 0 ? "linear-gradient(90deg,#c8a000,#f5c518)" : `linear-gradient(90deg,${COLORS[i]}88,${COLORS[i]})`,
                  transition: `width ${0.6 + i * 0.07}s cubic-bezier(0.34,1.2,0.64,1)`,
                }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 17 · Apple Fitness ring style — arc per score
// ══════════════════════════════════════════════════════════════════════════════
function V17() {
  const on = useAnimIn(150);
  const rings = DATA.slice(0, 5);
  const cx = 100, cy = 100;
  const radii = [85, 70, 55, 40, 25];

  return (
    <div className="flex items-center gap-4">
      <svg width={200} height={200} viewBox="0 0 200 200">
        {rings.map((d, i) => {
          const r = radii[i];
          const circ = 2 * Math.PI * r;
          const pct = on ? d.count / MAX : 0;
          const dash = pct * circ;
          const gap = circ - dash;
          return (
            <g key={d.score}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${COLORS[i]}18`} strokeWidth={10} />
              <circle cx={cx} cy={cy} r={r} fill="none"
                stroke={COLORS[i]} strokeWidth={10}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={circ * 0.25}
                style={{ transition: `stroke-dasharray 1s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.1}s`, filter: i === 0 ? `drop-shadow(0 0 4px ${COLORS[i]})` : "none" }}
              />
            </g>
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}>top 5</text>
        <text x={cx} y={cx + 8} textAnchor="middle" fill="#f5c518" fontSize={18} fontWeight={900}>{DATA[0].score}</text>
      </svg>
      <div className="space-y-2">
        {rings.map((d, i) => (
          <div key={d.score} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
            <span className="font-bold text-xs" style={{ color: COLORS[i] }}>{d.score}</span>
            <span className="text-[11px] text-slate-500">{d.count}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 18 · Area / wave chart
// ══════════════════════════════════════════════════════════════════════════════
function V18() {
  const tt = { background: "rgba(10,14,28,0.96)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", fontSize: 12 };
  const CustomTT = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return <div style={tt} className="px-3 py-2"><p className="text-amber-400 font-bold">{payload[0].payload.score}</p><p>{payload[0].value} פעמים</p></div>;
  };
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={DATA} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5c518" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#f5c518" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="score" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTT />} />
        <Area type="monotone" dataKey="count" stroke="#f5c518" strokeWidth={2.5}
          fill="url(#areaGrad)" dot={{ fill: "#f5c518", r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#fff", stroke: "#f5c518", strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 19 · Flip number cards (3D flip on mount)
// ══════════════════════════════════════════════════════════════════════════════
function V19() {
  const [flipped, setFlipped] = useState([]);
  useEffect(() => {
    DATA.forEach((_, i) => {
      setTimeout(() => setFlipped(f => [...f, i]), 100 + i * 120);
    });
  }, []);
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {DATA.map((d, i) => (
        <div key={d.score} className="relative" style={{ perspective: 500, width: 60, height: 72 }}>
          <div style={{
            width: "100%", height: "100%",
            transition: "transform 0.5s cubic-bezier(0.34,1.2,0.64,1)",
            transformStyle: "preserve-3d",
            transform: flipped.includes(i) ? "rotateY(0deg)" : "rotateY(-90deg)",
          }}>
            <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1"
              style={{ backfaceVisibility: "hidden", background: `${COLORS[i]}18`, border: `1px solid ${COLORS[i]}44` }}>
              <span className="font-black text-xl" style={{ color: COLORS[i] }}>{d.count}</span>
              <span className="text-[11px] font-bold" style={{ color: `${COLORS[i]}99` }}>{d.score}</span>
              {i < 3 && <span className="text-xs">{["🥇","🥈","🥉"][i]}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 20 · Watermark number cards (big bg number)
// ══════════════════════════════════════════════════════════════════════════════
function V20() {
  return (
    <div className="grid grid-cols-4 gap-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="rounded-xl p-3 relative overflow-hidden flex flex-col items-center justify-center min-h-[70px]"
          style={{ background: `${COLORS[i]}0f`, border: `1px solid ${COLORS[i]}22` }}>
          {/* Watermark */}
          <span className="absolute font-black select-none pointer-events-none"
            style={{ fontSize: 52, color: `${COLORS[i]}12`, bottom: -8, right: -4, lineHeight: 1 }}>
            {d.count}
          </span>
          <span className="relative font-black text-sm" style={{ color: COLORS[i] }}>{d.score}</span>
          <span className="relative font-black text-2xl" style={{ color: COLORS[i] }}>{d.count}</span>
          <span className="relative text-[9px]" style={{ color: `${COLORS[i]}66` }}>פעמים</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 21 · Horizontal swimlane — full-width rows
// ══════════════════════════════════════════════════════════════════════════════
function V21() {
  const on = useAnimIn(100);
  return (
    <div className="space-y-1.5">
      {DATA.map((d, i) => (
        <div key={d.score} className="rounded-xl overflow-hidden relative h-10 flex items-center"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${COLORS[i]}22` }}>
          {/* Fill */}
          <div className="absolute inset-y-0 left-0 rounded-xl"
            style={{
              width: on ? `${(d.count / MAX) * 100}%` : "0%",
              background: `linear-gradient(90deg, ${COLORS[i]}33, ${COLORS[i]}18)`,
              transition: `width ${0.55 + i * 0.06}s cubic-bezier(0.34,1.2,0.64,1)`,
            }} />
          {/* Content */}
          <div className="relative flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-3">
              <span className="text-xs w-4 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>{i < 3 ? ["🥇","🥈","🥉"][i] : `${i+1}.`}</span>
              <span className="font-black text-sm" style={{ color: COLORS[i] }}>{d.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>{((d.count / TOTAL) * 100).toFixed(0)}%</span>
              <span className="font-black text-sm" style={{ color: COLORS[i] }}>{d.count}×</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 22 · Newspaper / ticker tape
// ══════════════════════════════════════════════════════════════════════════════
function V22() {
  const tickerRef = useRef(null);
  const text = DATA.map(d => `${d.score} (${d.count}×)`).join("  ·  ") + "  ·  ";
  return (
    <div>
      {/* Ticker */}
      <div className="overflow-hidden rounded-lg mb-4 relative"
        style={{ background: "#f5c518", height: 32 }}>
        <div className="absolute inset-y-0 flex items-center whitespace-nowrap animate-marquee">
          <span className="font-black text-black text-sm tracking-wide px-4">{text}{text}</span>
        </div>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 12s linear infinite; }`}</style>
      {/* Table */}
      <table className="w-full text-xs" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            {["#","תוצאה","פעמים","%"].map(h => (
              <th key={h} className="py-1.5 text-left font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DATA.map((d, i) => (
            <tr key={d.score} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <td className="py-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>{i + 1}</td>
              <td className="py-1.5 font-black" style={{ color: COLORS[i] }}>{d.score}</td>
              <td className="py-1.5 font-bold text-white">{d.count}</td>
              <td className="py-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>{((d.count / TOTAL) * 100).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 23 · Concentric rings (stacked donuts)
// ══════════════════════════════════════════════════════════════════════════════
function V23() {
  const on = useAnimIn(150);
  const cx = 100, cy = 105;
  const rings = DATA.slice(0, 6);
  const spacing = 13;
  const baseR = 30;
  return (
    <div className="flex items-center gap-4">
      <svg width={200} height={210} viewBox="0 0 200 210">
        {rings.map((d, i) => {
          const r = baseR + i * spacing;
          const circ = 2 * Math.PI * r;
          const pct = on ? d.count / MAX : 0;
          const dash = pct * circ;
          return (
            <g key={d.score}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${COLORS[i]}15`} strokeWidth={9} />
              <circle cx={cx} cy={cy} r={r} fill="none"
                stroke={COLORS[i]} strokeWidth={9} strokeLinecap="round"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={circ * 0.25}
                style={{ transition: `stroke-dasharray 1s cubic-bezier(0.34,1.2,0.64,1) ${i * 0.08}s` }}
              />
            </g>
          );
        })}
        <text x={cx} y={cy - 5} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={8}>שיא</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#f5c518" fontSize={16} fontWeight={900}>{DATA[0].score}</text>
      </svg>
      <div className="space-y-2">
        {rings.map((d, i) => (
          <div key={d.score} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
            <span className="text-xs font-mono font-bold" style={{ color: COLORS[i] }}>{d.score}</span>
            <span className="text-[10px] text-slate-500">{d.count}×</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 24 · Sparkline + number (compact horizontal)
// ══════════════════════════════════════════════════════════════════════════════
function V24() {
  const on = useAnimIn(100);
  return (
    <div className="space-y-2">
      {DATA.map((d, i) => (
        <div key={d.score} className="flex items-center gap-3 px-3 py-2 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="font-black text-sm w-9" style={{ color: COLORS[i] }}>{d.score}</span>
          {/* mini sparkline bar */}
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full"
              style={{
                width: on ? `${(d.count / MAX) * 100}%` : "0%",
                background: COLORS[i],
                transition: `width ${0.5 + i * 0.055}s cubic-bezier(0.34,1.2,0.64,1)`,
              }} />
          </div>
          {/* pill */}
          <div className="rounded-full px-2 py-0.5 text-[10px] font-black flex-shrink-0"
            style={{ background: `${COLORS[i]}22`, color: COLORS[i], minWidth: 28, textAlign: "center" }}>
            {d.count}
          </div>
          <span className="text-[10px] text-slate-600 w-7 text-right">{((d.count / TOTAL) * 100).toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 25 · Slot machine reveal
// ══════════════════════════════════════════════════════════════════════════════
function V25() {
  const [reveal, setReveal] = useState(Array(3).fill(null));
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setReveal([null, null, null]);
    DATA.slice(0, 3).forEach((d, i) => {
      setTimeout(() => {
        setReveal(r => { const c = [...r]; c[i] = d; return c; });
      }, 400 + i * 350);
    });
    setTimeout(() => setSpinning(false), 400 + 3 * 350);
  };

  return (
    <div className="space-y-4">
      {/* Slot machine display */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#0a0510", border: "2px solid rgba(180,100,255,0.3)", boxShadow: "0 0 20px rgba(180,100,255,0.1)" }}>
        <div className="px-4 py-2 flex items-center justify-between" style={{ background: "rgba(180,100,255,0.1)", borderBottom: "1px solid rgba(180,100,255,0.15)" }}>
          <span className="font-mono text-[9px] tracking-widest" style={{ color: "rgba(180,100,255,0.6)" }}>🎰 TOP PREDICTIONS</span>
          <div className="flex gap-1">
            {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? "#f87171" : i === 1 ? "#fbbf24" : "#34d399" }} />)}
          </div>
        </div>
        <div className="flex gap-0 divide-x divide-white/[0.08]">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 h-24 flex items-center justify-center"
              style={{ background: reveal[i] ? `${COLORS[i]}0a` : "transparent", transition: "background 0.3s" }}>
              {reveal[i] ? (
                <div className="text-center animate-bounce" style={{ animationDuration: "0.4s", animationIterationCount: 1 }}>
                  <div className="text-2xl font-black" style={{ color: COLORS[i] }}>{reveal[i].score}</div>
                  <div className="text-sm" style={{ color: `${COLORS[i]}88` }}>{reveal[i].count}×</div>
                  <div className="text-sm">{MEDALS[i]}</div>
                </div>
              ) : (
                <div className="text-2xl opacity-20 select-none" style={{ animation: spinning ? "spin 0.1s linear infinite" : "none" }}>?</div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Rest of list */}
      <div className="flex gap-2 flex-wrap justify-center">
        {DATA.slice(3).map((d, i) => (
          <div key={d.score} className="px-3 py-1.5 rounded-lg text-xs font-bold"
            style={{ background: `${COLORS[i+3]}15`, color: COLORS[i+3], border: `1px solid ${COLORS[i+3]}30` }}>
            {d.score} <span style={{ opacity: 0.6 }}>×{d.count}</span>
          </div>
        ))}
      </div>
      <button onClick={spin} disabled={spinning}
        className="w-full py-2 rounded-xl font-bold text-sm transition-all"
        style={{ background: spinning ? "rgba(180,100,255,0.1)" : "rgba(180,100,255,0.2)", color: "#b468ff", border: "1px solid rgba(180,100,255,0.3)" }}>
        {spinning ? "⟳ מסתובב..." : "🎰 הגרל שוב"}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════════
const VARIANTS = [
  { n: 11, title: "Lollipop chart — מקל + עיגול",          C: V11 },
  { n: 12, title: "Dot plot — ערימת נקודות",               C: V12 },
  { n: 13, title: "Radial bars — קרניים ממרכז",            C: V13 },
  { n: 14, title: "LED dot matrix — מטריצת נורות",         C: V14 },
  { n: 15, title: "Tally marks — סימני ספירה",             C: V15 },
  { n: 16, title: "FIFA attribute bars — סגנון כרטיס FIFA", C: V16 },
  { n: 17, title: "Apple Fitness rings — טבעות קשת",       C: V17 },
  { n: 18, title: "Area / wave chart — גרף גל",            C: V18 },
  { n: 19, title: "Flip cards — קלפים נהפכים",             C: V19 },
  { n: 20, title: "Watermark cards — מספר ברקע",           C: V20 },
  { n: 21, title: "Swimlane rows — שורות מלאות",           C: V21 },
  { n: 22, title: "Ticker + table — נייר חדשות",           C: V22 },
  { n: 23, title: "Concentric rings — טבעות מקוננות",      C: V23 },
  { n: 24, title: "Sparkline compact — שורה עם מיני-בר",   C: V24 },
  { n: 25, title: "Slot machine — הגרלה 🎰",               C: V25 },
];

export default function AdminCommonPredictionsDemo2() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">הניחוש הנפוץ ביותר — עיצובים 11–25</h2>
        <p className="text-slate-400 text-sm">המשך מהדמו הקודם · כל הנתונים דמו</p>
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
