import React, { useState } from "react";

const TIMER_VALS = [
  { val: "03", label: "ימים" },
  { val: "14", label: "שעות" },
  { val: "27", label: "דקות" },
  { val: "48", label: "שניות" },
];

const greens = [
  { id: 1,  name: "Emerald 200", digit: "#a7f3d0", label: "rgba(167,243,208,0.65)", border: "rgba(167,243,208,0.25)", bg: "rgba(167,243,208,0.08)", sep: "rgba(167,243,208,0.18)" },
  { id: 2,  name: "Emerald 300 (נוכחי)", digit: "#6ee7b7", label: "rgba(110,231,183,0.70)", border: "rgba(110,231,183,0.28)", bg: "rgba(110,231,183,0.10)", sep: "rgba(110,231,183,0.20)" },
  { id: 3,  name: "Emerald 400", digit: "#34d399", label: "rgba(52,211,153,0.75)", border: "rgba(52,211,153,0.32)", bg: "rgba(52,211,153,0.12)", sep: "rgba(52,211,153,0.22)" },
  { id: 4,  name: "Emerald 500", digit: "#10b981", label: "rgba(16,185,129,0.80)", border: "rgba(16,185,129,0.35)", bg: "rgba(16,185,129,0.13)", sep: "rgba(16,185,129,0.25)" },
  { id: 5,  name: "Emerald 400 מלא", digit: "#34d399", label: "#34d399",             border: "rgba(52,211,153,0.35)", bg: "rgba(52,211,153,0.13)", sep: "rgba(52,211,153,0.25)" },
  { id: 6,  name: "iOS Green #34C759", digit: "#34C759", label: "rgba(52,199,89,0.78)", border: "rgba(52,199,89,0.32)", bg: "rgba(52,199,89,0.12)", sep: "rgba(52,199,89,0.22)" },
  { id: 7,  name: "Green 300", digit: "#86efac", label: "rgba(134,239,172,0.68)", border: "rgba(134,239,172,0.26)", bg: "rgba(134,239,172,0.09)", sep: "rgba(134,239,172,0.19)" },
  { id: 8,  name: "Green 400", digit: "#4ade80", label: "rgba(74,222,128,0.75)", border: "rgba(74,222,128,0.30)", bg: "rgba(74,222,128,0.11)", sep: "rgba(74,222,128,0.22)" },
  { id: 9,  name: "Green 500", digit: "#22c55e", label: "rgba(34,197,94,0.78)", border: "rgba(34,197,94,0.32)", bg: "rgba(34,197,94,0.12)", sep: "rgba(34,197,94,0.23)" },
  { id: 10, name: "Teal 300", digit: "#5eead4", label: "rgba(94,234,212,0.68)", border: "rgba(94,234,212,0.26)", bg: "rgba(94,234,212,0.09)", sep: "rgba(94,234,212,0.19)" },
  { id: 11, name: "Teal 400", digit: "#2dd4bf", label: "rgba(45,212,191,0.72)", border: "rgba(45,212,191,0.28)", bg: "rgba(45,212,191,0.10)", sep: "rgba(45,212,191,0.20)" },
  { id: 12, name: "Mint — מינט קר", digit: "#99f6e4", label: "rgba(153,246,228,0.62)", border: "rgba(153,246,228,0.22)", bg: "rgba(153,246,228,0.08)", sep: "rgba(153,246,228,0.16)" },
  { id: 13, name: "Lime 300", digit: "#bef264", label: "rgba(190,242,100,0.70)", border: "rgba(190,242,100,0.28)", bg: "rgba(190,242,100,0.09)", sep: "rgba(190,242,100,0.20)" },
  { id: 14, name: "Lime 400", digit: "#a3e635", label: "rgba(163,230,53,0.75)", border: "rgba(163,230,53,0.30)", bg: "rgba(163,230,53,0.10)", sep: "rgba(163,230,53,0.22)" },
  { id: 15, name: "Yellow-Green", digit: "#d9f99d", label: "rgba(217,249,157,0.60)", border: "rgba(217,249,157,0.22)", bg: "rgba(217,249,157,0.07)", sep: "rgba(217,249,157,0.16)" },
  { id: 16, name: "Neon Green", digit: "#39FF14", label: "rgba(57,255,20,0.65)", border: "rgba(57,255,20,0.28)", bg: "rgba(57,255,20,0.08)", sep: "rgba(57,255,20,0.18)" },
  { id: 17, name: "Neon Mint", digit: "#00ffcc", label: "rgba(0,255,204,0.65)", border: "rgba(0,255,204,0.25)", bg: "rgba(0,255,204,0.08)", sep: "rgba(0,255,204,0.18)" },
  { id: 18, name: "Sage — ירוק-אפור", digit: "#84cc16", label: "rgba(132,204,22,0.72)", border: "rgba(132,204,22,0.28)", bg: "rgba(132,204,22,0.09)", sep: "rgba(132,204,22,0.20)" },
  { id: 19, name: "Forest — ירוק יער", digit: "#4ade80", label: "rgba(74,222,128,0.55)", border: "rgba(74,222,128,0.22)", bg: "rgba(20,80,40,0.35)",    sep: "rgba(74,222,128,0.15)" },
  { id: 20, name: "Seafoam — ים", digit: "#6fcf97", label: "rgba(111,207,151,0.70)", border: "rgba(111,207,151,0.28)", bg: "rgba(111,207,151,0.09)", sep: "rgba(111,207,151,0.19)" },
  { id: 21, name: "Jade", digit: "#00a86b", label: "rgba(0,168,107,0.75)", border: "rgba(0,168,107,0.30)", bg: "rgba(0,168,107,0.10)", sep: "rgba(0,168,107,0.22)" },
  { id: 22, name: "Aquamarine", digit: "#7fffd4", label: "rgba(127,255,212,0.60)", border: "rgba(127,255,212,0.22)", bg: "rgba(127,255,212,0.07)", sep: "rgba(127,255,212,0.16)" },
  { id: 23, name: "Spring Green", digit: "#00ff7f", label: "rgba(0,255,127,0.65)", border: "rgba(0,255,127,0.26)", bg: "rgba(0,255,127,0.08)", sep: "rgba(0,255,127,0.18)" },
  { id: 24, name: "Chartreuse", digit: "#7fff00", label: "rgba(127,255,0,0.65)", border: "rgba(127,255,0,0.26)", bg: "rgba(127,255,0,0.08)", sep: "rgba(127,255,0,0.18)" },
];

function TimerPreview({ p, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-150"
      style={{
        background: selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)",
        border: selected ? `1px solid ${p.border}` : "1px solid rgba(255,255,255,0.07)",
        boxShadow: selected ? `0 0 0 2px ${p.bg}` : "none",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.50)" }}>#{p.id} — {p.name}</span>
        {selected && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: p.bg, color: p.digit, border: `1px solid ${p.border}` }}>✓ נבחר</span>
        )}
      </div>

      <div className="flex justify-center">
        <div dir="rtl" className="relative overflow-hidden flex rounded-2xl" style={{
          background: p.bg,
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: `1px solid ${p.border}`,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.40)",
        }}>
          <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)", borderRadius: "16px 16px 0 0" }} />
          {TIMER_VALS.map((item, i) => (
            <React.Fragment key={item.label}>
              <div className="relative flex flex-col items-center px-3 py-2">
                <span className="font-extrabold leading-none mb-0.5" style={{ fontSize: "1.05rem", color: p.digit }}>{item.val}</span>
                <span className="text-[9px] font-semibold" style={{ color: p.label }}>{item.label}</span>
              </div>
              {i < 3 && <div className="self-center" style={{ width: 1, height: 24, background: p.sep }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminTimerGreenDemo() {
  const [selected, setSelected] = useState(2);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Timer — גוונים ירוקים ({greens.length})</h2>
        <p className="text-slate-400 text-sm">לחץ על גוון ואמור לי את המספר.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {greens.map(p => (
          <TimerPreview key={p.id} p={p} selected={selected === p.id} onClick={() => setSelected(p.id)} />
        ))}
      </div>

      {selected && (
        <div className="sticky bottom-0 rounded-xl p-4" style={{
          background: "rgba(10,15,20,0.94)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${greens.find(p => p.id === selected)?.border}`,
        }}>
          <p className="text-sm font-semibold" style={{ color: greens.find(p => p.id === selected)?.digit }}>
            נבחר #{selected} — {greens.find(p => p.id === selected)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
