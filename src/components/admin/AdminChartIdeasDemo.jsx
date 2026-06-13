import React, { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ScatterChart, Scatter, ZAxis,
  Treemap,
} from "recharts";

// ── Demo data ──────────────────────────────────────────────────────────────────
const ROUNDS = [
  { round: "G1", pts: 42, maxPts: 72 },
  { round: "G2", pts: 55, maxPts: 72 },
  { round: "G3", pts: 38, maxPts: 72 },
  { round: "G4", pts: 61, maxPts: 72 },
  { round: "G5", pts: 48, maxPts: 72 },
  { round: "G6", pts: 70, maxPts: 72 },
  { round: "R16", pts: 30, maxPts: 48 },
  { round: "QF",  pts: 22, maxPts: 32 },
];

const CUMULATIVE = ROUNDS.reduce((acc, r, i) => {
  const prev = i > 0 ? acc[i - 1].cumulative : 0;
  acc.push({ round: r.round, cumulative: parseFloat((prev + r.pts).toFixed(1)), roundPts: r.pts });
  return acc;
}, []);

const RADAR_DATA = [
  { category: "תוצאה מדויקת", score: 78 },
  { category: "כיוון נכון", score: 92 },
  { category: "BTTS", score: 60 },
  { category: "טווח שערים", score: 70 },
  { category: "ניחושים נשלחו", score: 88 },
];

const TREEMAP_DATA = ROUNDS.map(r => ({ name: r.round, size: r.pts, fill: "" }));

const SCATTER_DATA = [
  { predictedA: 0, actualA: 0, predictedB: 0, actualB: 0, pts: 18, label: "1-1" },
  { predictedA: 1, actualA: 1, predictedB: 0, actualB: 0, pts: 14 },
  { predictedA: 2, actualA: 2, predictedB: 1, actualB: 1, pts: 21 },
  { predictedA: 1, actualA: 0, predictedB: 1, actualB: 1, pts: 8 },
  { predictedA: 3, actualA: 3, predictedB: 0, actualB: 0, pts: 21 },
  { predictedA: 0, actualA: 1, predictedB: 2, actualB: 2, pts: 12 },
  { predictedA: 2, actualA: 2, predictedB: 0, actualB: 0, pts: 14 },
  { predictedA: 1, actualA: 1, predictedB: 1, actualB: 2, pts: 6 },
  { predictedA: 4, actualA: 4, predictedB: 1, actualB: 1, pts: 21 },
  { predictedA: 0, actualA: 2, predictedB: 0, actualB: 1, pts: 4 },
  { predictedA: 2, actualA: 1, predictedB: 2, actualB: 2, pts: 7 },
  { predictedA: 1, actualA: 0, predictedB: 0, actualB: 0, pts: 10 },
].map(d => ({ x: d.predictedA, y: d.actualA, pts: d.pts }));

const COMMON_PREDICTIONS = [
  { score: "1-0", count: 12 },
  { score: "1-1", count: 10 },
  { score: "2-1", count: 9 },
  { score: "2-0", count: 8 },
  { score: "0-0", count: 7 },
  { score: "3-1", count: 5 },
  { score: "0-1", count: 5 },
  { score: "2-2", count: 4 },
];

const GAUGE_PCT = 73; // % מהמקסימום האפשרי

// ── Helpers ────────────────────────────────────────────────────────────────────
const VLabel = ({ n, title, sub }) => (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-0.5">
      <span className="text-[10px] font-mono bg-amber-400/15 text-amber-400 px-2 py-0.5 rounded-full">#{n}</span>
      <span className="text-white font-semibold text-sm">{title}</span>
    </div>
    {sub && <p className="text-slate-500 text-[11px] mr-6">{sub}</p>}
  </div>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl p-5 ${className}`}
    style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.10)",
      backdropFilter: "blur(12px)",
    }}
  >
    {children}
  </div>
);

const customTooltipStyle = {
  background: "rgba(15,20,35,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 12,
};

// ══════════════════════════════════════════════════════════════════════════════
// 1 · גרף קו מצטבר
// ══════════════════════════════════════════════════════════════════════════════
function CumulativeLine() {
  const [hovered, setHovered] = useState(null);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={customTooltipStyle} className="px-3 py-2">
        <p className="text-amber-400 font-bold">{d.round}</p>
        <p className="text-white">סה״כ מצטבר: <span className="font-black">{d.cumulative}</span></p>
        <p className="text-slate-400">במחזור זה: +{d.roundPts}</p>
      </div>
    );
  };

  return (
    <Card>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={CUMULATIVE} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f5c518" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="round" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            dot={{ fill: "#f5c518", r: 4, strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#fff", stroke: "#f5c518", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-center text-slate-500 text-[11px] mt-2">נקודות מצטברות לאורך הטורניר</p>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 2 · ספידומטר / Gauge
// ══════════════════════════════════════════════════════════════════════════════
function Gauge() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPct(GAUGE_PCT), 300);
    return () => clearTimeout(t);
  }, []);

  const r = 72;
  const cx = 110;
  const cy = 95;
  const startAngle = Math.PI * 0.85;
  const endAngle   = Math.PI * 2.15;
  const totalArc   = endAngle - startAngle;
  const filled     = startAngle + totalArc * (pct / 100);

  const arcPath = (from, to, inner = false) => {
    const ri = inner ? r - 16 : r;
    const x1 = cx + ri * Math.cos(from), y1 = cy + ri * Math.sin(from);
    const x2 = cx + ri * Math.cos(to),   y2 = cy + ri * Math.sin(to);
    const large = to - from > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${ri} ${ri} 0 ${large} 1 ${x2} ${y2}`;
  };

  // Needle
  const needleAngle = startAngle + totalArc * (pct / 100);
  const nx = cx + (r - 22) * Math.cos(needleAngle);
  const ny = cy + (r - 22) * Math.sin(needleAngle);

  // Color based on %
  const color = pct < 40 ? "#f87171" : pct < 65 ? "#fbbf24" : "#22c55e";

  return (
    <Card>
      <div className="flex flex-col items-center">
        <svg width={220} height={130} viewBox="0 0 220 130" style={{ overflow: "visible" }}>
          {/* Track */}
          <path d={arcPath(startAngle, endAngle)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={16} strokeLinecap="round" />
          {/* Fill */}
          <path
            d={arcPath(startAngle, filled)}
            fill="none"
            stroke={color}
            strokeWidth={16}
            strokeLinecap="round"
            style={{ transition: "d 1.2s cubic-bezier(0.34,1.56,0.64,1)", filter: `drop-shadow(0 0 6px ${color}99)` }}
          />
          {/* Needle */}
          <line
            x1={cx} y1={cy}
            x2={nx} y2={ny}
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ transition: "x2 1.2s, y2 1.2s" }}
          />
          <circle cx={cx} cy={cy} r={5} fill="#fff" />
          {/* % text */}
          <text x={cx} y={cy + 28} textAnchor="middle" fill={color} fontSize={28} fontWeight={900} style={{ transition: "fill 0.5s" }}>
            {pct}%
          </text>
          <text x={cx} y={cy + 44} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={10}>
            מהמקסימום האפשרי
          </text>
          {/* labels */}
          <text x={cx - r - 2} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9}>0%</text>
          <text x={cx + r + 2} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize={9}>100%</text>
        </svg>
        <div className="flex gap-6 mt-1 text-center">
          {[["ירוד", "#f87171"], ["בינוני", "#fbbf24"], ["מצוין", "#22c55e"]].map(([l, c]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: c }} />
              <span className="text-slate-500 text-[10px]">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 3 · Radar Chart
// ══════════════════════════════════════════════════════════════════════════════
function RadarChartDemo() {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={customTooltipStyle} className="px-3 py-2">
        <p className="text-amber-400 font-bold">{payload[0].payload.category}</p>
        <p className="text-white">ציון: <span className="font-black">{payload[0].value}</span>/100</p>
      </div>
    );
  };

  return (
    <Card>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 24, bottom: 10, left: 24 }}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
          />
          <Radar
            dataKey="score"
            stroke="#f5c518"
            fill="#f5c518"
            fillOpacity={0.18}
            strokeWidth={2}
            dot={{ fill: "#f5c518", r: 3 }}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-center text-slate-500 text-[11px] mt-1">ביצועים לפי קטגוריה (מתוך 100)</p>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 5 · TreeMap
// ══════════════════════════════════════════════════════════════════════════════
const TREEMAP_COLORS = ["#f5c518", "#22c55e", "#0ea5e9", "#f87171", "#a78bfa", "#fb923c", "#34d399", "#60a5fa"];

function TreeMapCell({ x, y, width, height, name, value, index }) {
  const color = TREEMAP_COLORS[index % TREEMAP_COLORS.length];
  if (width < 2 || height < 2) return null;
  return (
    <g>
      <rect
        x={x + 1} y={y + 1}
        width={width - 2} height={height - 2}
        rx={6}
        style={{ fill: `${color}22`, stroke: color, strokeWidth: 1.5, strokeOpacity: 0.5 }}
      />
      {width > 32 && height > 22 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 4} textAnchor="middle" fill={color} fontSize={11} fontWeight={700}>{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize={10}>{value}</text>
        </>
      )}
    </g>
  );
}

function TreeMapDemo() {
  return (
    <Card>
      <ResponsiveContainer width="100%" height={200}>
        <Treemap
          data={TREEMAP_DATA}
          dataKey="size"
          nameKey="name"
          content={<TreeMapCell />}
        />
      </ResponsiveContainer>
      <p className="text-center text-slate-500 text-[11px] mt-2">גודל כל מלבן = נקודות שהרווחת במחזור</p>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 12 · Scatter Plot — ניחוש מול תוצאה
// ══════════════════════════════════════════════════════════════════════════════
function ScatterPlotDemo() {
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div style={customTooltipStyle} className="px-3 py-2">
        <p className="text-slate-400 text-[11px]">ניחשת: <span className="text-white font-bold">{d.x}</span></p>
        <p className="text-slate-400 text-[11px]">בפועל: <span className="text-white font-bold">{d.y}</span></p>
        <p className="text-amber-400 font-bold text-[11px]">{d.pts} נק׳</p>
      </div>
    );
  };

  const maxPts = Math.max(...SCATTER_DATA.map(d => d.pts));

  return (
    <Card>
      <p className="text-slate-400 text-[11px] mb-3 text-center">ציר X = ניחשת / ציר Y = בפועל / גודל = נקודות</p>
      <ResponsiveContainer width="100%" height={190}>
        <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            type="number" dataKey="x"
            domain={[-0.5, 4.5]} ticks={[0, 1, 2, 3, 4]}
            label={{ value: "ניחוש (שערי בית)", position: "insideBottom", fill: "rgba(255,255,255,0.3)", fontSize: 10, dy: 12 }}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false}
          />
          <YAxis
            type="number" dataKey="y"
            domain={[-0.5, 4.5]} ticks={[0, 1, 2, 3, 4]}
            label={{ value: "בפועל", angle: -90, position: "insideLeft", fill: "rgba(255,255,255,0.3)", fontSize: 10 }}
            tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false}
          />
          {/* Diagonal "exact hit" line */}
          <line x1="10%" y1="90%" x2="90%" y2="10%" stroke="rgba(34,197,94,0.2)" strokeWidth={1} strokeDasharray="4 3" />
          <ZAxis type="number" dataKey="pts" range={[40, 200]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.15)" }} />
          <Scatter
            data={SCATTER_DATA}
            fill="#f5c518"
            fillOpacity={0.75}
            stroke="#f5c518"
            strokeWidth={1}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-center text-slate-500 text-[11px] mt-1">הקו הירוק המקווקו = פגיעה מדויקת</p>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 13 · הניחוש הנפוץ ביותר
// ══════════════════════════════════════════════════════════════════════════════
function CommonPredictions() {
  const max = COMMON_PREDICTIONS[0].count;
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Card>
      <div className="space-y-2">
        {COMMON_PREDICTIONS.map((d, i) => {
          const pct = (d.count / max) * 100;
          const isTop = i === 0;
          const colors = ["#f5c518", "#e2e8f0", "#cd7f32", "#0ea5e9", "#22c55e", "#a78bfa", "#fb923c", "#f87171"];
          const col = colors[i] || "#64748b";
          return (
            <div key={d.score} className="flex items-center gap-3">
              <div className="w-6 text-right text-slate-500 text-[11px] font-mono flex-shrink-0">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`}
              </div>
              <div
                className="font-bold text-sm flex-shrink-0 w-10 text-center rounded-lg py-0.5"
                style={{ color: col, background: `${col}15`, fontSize: 12 }}
              >
                {d.score}
              </div>
              <div className="flex-1 h-6 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2"
                  style={{
                    width: animated ? `${pct}%` : "0%",
                    background: isTop
                      ? "linear-gradient(90deg, #d4a520, #f5c518)"
                      : `${col}55`,
                    transition: `width ${0.6 + i * 0.07}s cubic-bezier(0.34,1.2,0.64,1)`,
                    boxShadow: isTop ? "0 0 10px #f5c51850" : "none",
                  }}
                >
                  {pct > 30 && (
                    <span className="text-[10px] font-black" style={{ color: isTop ? "#000" : col }}>{d.count}</span>
                  )}
                </div>
              </div>
              {pct <= 30 && (
                <span className="text-[11px] font-bold flex-shrink-0" style={{ color: col }}>{d.count}</span>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-center text-slate-500 text-[11px] mt-3">כמה פעמים ניחשת כל תוצאה</p>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════════════════════════════════
export default function AdminChartIdeasDemo() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו רעיונות גרפים — דף הסטטיסטיקה</h2>
        <p className="text-slate-400 text-sm">6 ויזואליזציות שאפשר להוסיף · כל הנתונים הם דמו</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <VLabel n={1} title="גרף קו מצטבר" sub="נקודות מצטברות לאורך כל הטורניר" />
          <CumulativeLine />
        </div>

        <div>
          <VLabel n={2} title="ספידומטר / Gauge" sub="אחוז צבירת נקודות מהמקסימום האפשרי" />
          <Gauge />
        </div>

        <div>
          <VLabel n={3} title='Radar Chart / עכביש' sub="ביצועים לפי 5 קטגוריות — מבט פנורמי" />
          <RadarChartDemo />
        </div>

        <div>
          <VLabel n={5} title="TreeMap" sub="גודל כל בלוק = נקודות שהרווחת במחזור" />
          <TreeMapDemo />
        </div>

        <div>
          <VLabel n={12} title="Scatter Plot — ניחוש מול תוצאה" sub="כל נקודה = משחק · גודל = נקודות שהרווחת" />
          <ScatterPlotDemo />
        </div>

        <div>
          <VLabel n={13} title="הניחוש הנפוץ ביותר" sub="אילו תוצאות ניחשת הכי הרבה פעמים" />
          <CommonPredictions />
        </div>
      </div>
    </div>
  );
}
