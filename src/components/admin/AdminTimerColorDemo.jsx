import React, { useState } from "react";

const TIMER_VALS = [
  { val: "03", label: "ימים" },
  { val: "14", label: "שעות" },
  { val: "27", label: "דקות" },
  { val: "48", label: "שניות" },
];

const palettes = [
  // ── ירוקים ──
  { id: 1,  group: "ירוקים", name: "Emerald 300 (נוכחי)", digit: "#6ee7b7", label: "rgba(110,231,183,0.70)", border: "rgba(110,231,183,0.28)", bg: "rgba(110,231,183,0.10)", sep: "rgba(110,231,183,0.20)" },
  { id: 2,  group: "ירוקים", name: "Emerald 400 — בהיר יותר", digit: "#34d399", label: "rgba(52,211,153,0.75)", border: "rgba(52,211,153,0.32)", bg: "rgba(52,211,153,0.12)", sep: "rgba(52,211,153,0.22)" },
  { id: 3,  group: "ירוקים", name: "iOS Green #34C759", digit: "#34C759", label: "rgba(52,199,89,0.75)", border: "rgba(52,199,89,0.30)", bg: "rgba(52,199,89,0.12)", sep: "rgba(52,199,89,0.20)" },
  { id: 4,  group: "ירוקים", name: "Lime — ירוק-צהוב", digit: "#a3e635", label: "rgba(163,230,53,0.70)", border: "rgba(163,230,53,0.28)", bg: "rgba(163,230,53,0.10)", sep: "rgba(163,230,53,0.20)" },
  { id: 5,  group: "ירוקים", name: "Mint — מינט קר", digit: "#99f6e4", label: "rgba(153,246,228,0.65)", border: "rgba(153,246,228,0.25)", bg: "rgba(153,246,228,0.09)", sep: "rgba(153,246,228,0.18)" },

  // ── כחולים ──
  { id: 6,  group: "כחולים", name: "iOS Blue #007AFF", digit: "#007AFF", label: "rgba(0,122,255,0.70)", border: "rgba(0,122,255,0.30)", bg: "rgba(0,122,255,0.10)", sep: "rgba(0,122,255,0.20)" },
  { id: 7,  group: "כחולים", name: "Sky 300 — כחול שמיים", digit: "#7dd3fc", label: "rgba(125,211,252,0.70)", border: "rgba(125,211,252,0.28)", bg: "rgba(125,211,252,0.10)", sep: "rgba(125,211,252,0.20)" },
  { id: 8,  group: "כחולים", name: "Cyan — ציאן חשמלי", digit: "#22d3ee", label: "rgba(34,211,238,0.70)", border: "rgba(34,211,238,0.28)", bg: "rgba(34,211,238,0.10)", sep: "rgba(34,211,238,0.20)" },
  { id: 9,  group: "כחולים", name: "Indigo — כחול-סגול", digit: "#818cf8", label: "rgba(129,140,248,0.70)", border: "rgba(129,140,248,0.28)", bg: "rgba(129,140,248,0.10)", sep: "rgba(129,140,248,0.20)" },

  // ── לבן / כסף ──
  { id: 10, group: "לבן/כסף", name: "Pure White", digit: "#ffffff", label: "rgba(255,255,255,0.60)", border: "rgba(255,255,255,0.22)", bg: "rgba(255,255,255,0.08)", sep: "rgba(255,255,255,0.15)" },
  { id: 11, group: "לבן/כסף", name: "Silver Chrome", digit: "#e2e8f0", label: "rgba(226,232,240,0.60)", border: "rgba(226,232,240,0.22)", bg: "rgba(226,232,240,0.08)", sep: "rgba(226,232,240,0.15)" },
  { id: 12, group: "לבן/כסף", name: "Platinum", digit: "#C0C0C0", label: "rgba(192,192,192,0.65)", border: "rgba(192,192,192,0.25)", bg: "rgba(192,192,192,0.08)", sep: "rgba(192,192,192,0.18)" },

  // ── זהב / חם ──
  { id: 13, group: "זהב/חם", name: "Gold #FFD60A", digit: "#FFD60A", label: "rgba(255,214,10,0.70)", border: "rgba(255,214,10,0.30)", bg: "rgba(255,214,10,0.10)", sep: "rgba(255,214,10,0.20)" },
  { id: 14, group: "זהב/חם", name: "Amber — ענבר חם", digit: "#fbbf24", label: "rgba(251,191,36,0.70)", border: "rgba(251,191,36,0.28)", bg: "rgba(251,191,36,0.10)", sep: "rgba(251,191,36,0.20)" },
  { id: 15, group: "זהב/חם", name: "Orange — כתום עז", digit: "#fb923c", label: "rgba(251,146,60,0.70)", border: "rgba(251,146,60,0.28)", bg: "rgba(251,146,60,0.10)", sep: "rgba(251,146,60,0.20)" },
  { id: 16, group: "זהב/חם", name: "Rose — ורוד-זהב", digit: "#fb7185", label: "rgba(251,113,133,0.70)", border: "rgba(251,113,133,0.28)", bg: "rgba(251,113,133,0.10)", sep: "rgba(251,113,133,0.20)" },

  // ── סגול / פוקסיה ──
  { id: 17, group: "סגול/פוקסיה", name: "Purple — iOS BF5AF2", digit: "#BF5AF2", label: "rgba(191,90,242,0.70)", border: "rgba(191,90,242,0.28)", bg: "rgba(191,90,242,0.10)", sep: "rgba(191,90,242,0.20)" },
  { id: 18, group: "סגול/פוקסיה", name: "Violet 300", digit: "#c4b5fd", label: "rgba(196,181,253,0.70)", border: "rgba(196,181,253,0.25)", bg: "rgba(196,181,253,0.09)", sep: "rgba(196,181,253,0.18)" },
  { id: 19, group: "סגול/פוקסיה", name: "Fuchsia — פוקסיה", digit: "#e879f9", label: "rgba(232,121,249,0.70)", border: "rgba(232,121,249,0.28)", bg: "rgba(232,121,249,0.10)", sep: "rgba(232,121,249,0.20)" },
  { id: 20, group: "סגול/פוקסיה", name: "Pink — ורוד חשמלי", digit: "#f472b6", label: "rgba(244,114,182,0.70)", border: "rgba(244,114,182,0.28)", bg: "rgba(244,114,182,0.10)", sep: "rgba(244,114,182,0.20)" },

  // ── מיוחדים ──
  { id: 21, group: "מיוחדים", name: "Aurora — ירוק+כחול", digit: "#5eead4", label: "rgba(94,234,212,0.70)", border: "rgba(94,234,212,0.28)", bg: "rgba(94,234,212,0.10)", sep: "rgba(94,234,212,0.20)" },
  { id: 22, group: "מיוחדים", name: "Neon Green — ניאון", digit: "#39FF14", label: "rgba(57,255,20,0.65)", border: "rgba(57,255,20,0.28)", bg: "rgba(57,255,20,0.08)", sep: "rgba(57,255,20,0.18)" },
  { id: 23, group: "מיוחדים", name: "Neon Cyan — ניאון ציאן", digit: "#00F5FF", label: "rgba(0,245,255,0.65)", border: "rgba(0,245,255,0.25)", bg: "rgba(0,245,255,0.08)", sep: "rgba(0,245,255,0.18)" },
  { id: 24, group: "מיוחדים", name: "Coral — אלמוג", digit: "#ff6b6b", label: "rgba(255,107,107,0.70)", border: "rgba(255,107,107,0.28)", bg: "rgba(255,107,107,0.10)", sep: "rgba(255,107,107,0.20)" },
];

const groups = [...new Set(palettes.map(p => p.group))];

function TimerPreview({ p, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 cursor-pointer transition-all duration-150"
      style={{
        background: selected ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)",
        border: selected ? "1px solid rgba(255,255,255,0.20)" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: selected ? "0 0 0 2px rgba(255,255,255,0.12)" : "none",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>#{p.id} {p.name}</span>
        {selected && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: p.bg, color: p.digit, border: `1px solid ${p.border}` }}>נבחר</span>}
      </div>

      {/* Timer preview */}
      <div className="flex justify-center">
        <div dir="rtl" className="relative overflow-hidden flex rounded-2xl" style={{
          background: p.bg,
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          border: `1px solid ${p.border}`,
          boxShadow: `0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.40)`,
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

export default function AdminTimerColorDemo() {
  const [selected, setSelected] = useState(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Timer Color Demo — {palettes.length} אפשרויות</h2>
        <p className="text-slate-400 text-sm">לחץ על אפשרות כדי לבחור. המספר שתבחר יחיל את הצבע.</p>
      </div>

      {groups.map(group => (
        <div key={group}>
          <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>{group}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {palettes.filter(p => p.group === group).map(p => (
              <TimerPreview
                key={p.id}
                p={p}
                selected={selected === p.id}
                onClick={() => setSelected(p.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {selected && (
        <div className="sticky bottom-0 rounded-xl p-4" style={{
          background: "rgba(15,20,30,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}>
          <p className="text-sm text-white font-semibold">נבחר: #{selected} — {palettes.find(p => p.id === selected)?.name}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>שלח לי את המספר ואחיל את הצבע על הטיימר</p>
        </div>
      )}
    </div>
  );
}
