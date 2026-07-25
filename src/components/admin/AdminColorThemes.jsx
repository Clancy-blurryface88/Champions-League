import React, { useMemo, useState } from "react";

// 5 moods x 10 variants = 50 blue combinations. Each combo pairs a primary
// tone with a lighter accent (for gradients/text) and a glow rgba (for
// borders/shadows), all generated procedurally so every option stays
// internally consistent rather than hand-picked one by one.
const MOODS = [
  { name: "טורקיז-כחול", hueRange: [182, 196], satRange: [65, 90], lightRange: [45, 62] },
  { name: "אינדיגו כהה", hueRange: [250, 264], satRange: [55, 78], lightRange: [24, 38] },
  { name: "מתכתי / כרום", hueRange: [208, 218], satRange: [12, 28], lightRange: [55, 74] },
  { name: "כחול חצות", hueRange: [230, 244], satRange: [45, 65], lightRange: [12, 22] },
  { name: "כחול אצטדיון", hueRange: [204, 214], satRange: [85, 100], lightRange: [40, 52] },
];

function hsl(h, s, l) { return `hsl(${h}, ${s}%, ${l}%)`; }
function hslToRgbaString(h, s, l, a) {
  s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const A = s * Math.min(l, 1 - l);
  const f = (n) => l - A * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const r = Math.round(f(0) * 255), g = Math.round(f(8) * 255), b = Math.round(f(4) * 255);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function buildCombos() {
  const combos = [];
  let id = 1;
  for (const mood of MOODS) {
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const h = Math.round(mood.hueRange[0] + t * (mood.hueRange[1] - mood.hueRange[0]));
      const s = Math.round(mood.satRange[0] + (1 - t) * (mood.satRange[1] - mood.satRange[0]));
      const l = Math.round(mood.lightRange[0] + t * (mood.lightRange[1] - mood.lightRange[0]));
      const primary = hsl(h, s, l);
      const accentL = Math.min(l + 26, 92);
      const accent = hsl(h + 6, Math.max(s - 15, 20), accentL);
      const glow = hslToRgbaString(h, s, l, 0.45);
      combos.push({ id: id++, mood: mood.name, h, s, l, primary, accent, glow });
    }
  }
  return combos;
}

function ComboCard({ combo, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-right rounded-2xl p-4 transition-transform hover:scale-[1.03] cursor-pointer"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: selected ? `2px solid ${combo.primary}` : "1px solid rgba(255,255,255,0.08)",
        boxShadow: selected ? `0 0 24px ${combo.glow}` : "none",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/30 text-[11px] font-mono">#{combo.id}</span>
        <span className="text-white/25 text-[10px]">{combo.mood}</span>
      </div>

      {/* Sample gradient title, like the app's "2026" / hero text */}
      <div
        className="text-2xl font-black mb-3 text-center"
        style={{
          background: `linear-gradient(90deg, ${combo.primary}, ${combo.accent}, ${combo.primary})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          fontFamily: "'Russo One', sans-serif",
        }}
      >
        2026
      </div>

      {/* Sample button */}
      <div
        className="w-full text-center rounded-lg py-1.5 text-xs font-bold mb-3"
        style={{ background: combo.primary, color: "#04101f" }}
      >
        כפתור לדוגמה
      </div>

      {/* Sample card border/glow */}
      <div
        className="w-full rounded-lg py-2 text-center text-[11px] mb-3"
        style={{
          border: `1px solid ${combo.primary}`,
          boxShadow: `0 0 14px ${combo.glow}`,
          color: combo.accent,
        }}
      >
        קלף עם זוהר
      </div>

      {/* Swatches */}
      <div className="flex gap-1.5">
        <div className="flex-1 h-6 rounded" style={{ background: combo.primary }} />
        <div className="flex-1 h-6 rounded" style={{ background: combo.accent }} />
      </div>
      <div className="text-white/20 text-[9px] font-mono mt-1.5 text-center" dir="ltr">
        h{combo.h} s{combo.s} l{combo.l}
      </div>
    </button>
  );
}

export default function AdminColorThemes() {
  const combos = useMemo(() => buildCombos(), []);
  const [selectedId, setSelectedId] = useState(null);
  const selected = combos.find((c) => c.id === selectedId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold mb-1">🎨 פלטת כחולים — דמו (50 אפשרויות, סבב 2)</h2>
        <p className="text-slate-400 text-sm">
          לחץ על קלף כדי לסמן אותו, ואז תגיד לי את המספר (#1–#50) שתרצה להחיל בפועל על העיצוב.
        </p>
      </div>

      {selected && (
        <div
          className="rounded-xl p-4 sticky top-2 z-10"
          style={{ background: "rgba(8,20,45,0.9)", border: `1px solid ${selected.primary}`, backdropFilter: "blur(12px)" }}
        >
          <p className="text-white text-sm font-semibold">
            נבחר: #{selected.id} ({selected.mood}) — primary <span dir="ltr">{selected.primary}</span>, accent <span dir="ltr">{selected.accent}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {combos.map((combo) => (
          <ComboCard
            key={combo.id}
            combo={combo}
            selected={selectedId === combo.id}
            onClick={() => setSelectedId(combo.id)}
          />
        ))}
      </div>
    </div>
  );
}
