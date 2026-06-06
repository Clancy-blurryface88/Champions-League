import React, { useState } from "react";

const MOCK = { teamA: "Spain", teamB: "Saudi Arabia", score: "3 – 1", league: "Group C" };

const designs = [
  // ── Complex Clip-Path ────────────────────────────────────────────
  {
    id: 51, label: "Ribbon Left",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(8px 0%,100% 0%,100% 100%,8px 100%,0% 50%)" },
  },
  {
    id: 52, label: "Ribbon Right",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%,calc(100% - 8px) 0%,100% 50%,calc(100% - 8px) 100%,0% 100%)" },
  },
  {
    id: 53, label: "Double Arrow",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(10px 0%,calc(100% - 10px) 0%,100% 50%,calc(100% - 10px) 100%,10px 100%,0% 50%)" },
  },
  {
    id: 54, label: "Pentagon Down",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%,100% 0%,100% 70%,50% 100%,0% 70%)" },
  },
  {
    id: 55, label: "Pentagon Up",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(50% 0%,100% 30%,100% 100%,0% 100%,0% 30%)" },
  },
  {
    id: 56, label: "Arch Top",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", clipPath: "ellipse(54% 100% at 50% 100%)" },
  },
  {
    id: 57, label: "Wave Cut Left",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(20px 0%,100% 0%,100% 50%,100% 100%,20px 100%,0% 75%,12px 50%,0% 25%)" },
  },
  {
    id: 58, label: "Flag Notch Right",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%,calc(100% - 12px) 0%,100% 50%,calc(100% - 12px) 100%,0% 100%,0% 0%)" },
  },
  {
    id: 59, label: "Corner Cut TL+BR",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(14px 0%,100% 0%,100% calc(100% - 14px),calc(100% - 14px) 100%,0% 100%,0% 14px)" },
  },
  {
    id: 60, label: "Corner Cut TR+BL",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%,calc(100% - 14px) 0%,100% 14px,100% 100%,14px 100%,0% calc(100% - 14px))" },
  },

  // ── Multi-layer & Gradient border ────────────────────────────────
  {
    id: 61, label: "Gradient Border",
    wrapStyle: { padding: 1, borderRadius: 12, background: "linear-gradient(135deg,rgba(245,197,24,0.6),rgba(255,255,255,0.08))" },
    style: { borderRadius: 11, background: "rgba(8,16,36,0.95)", border: "none" },
  },
  {
    id: 62, label: "Glow Border",
    style: { borderRadius: 12, background: "rgba(10,18,40,0.9)", border: "1px solid rgba(245,197,24,0.35)", boxShadow: "0 0 12px rgba(245,197,24,0.18), inset 0 0 12px rgba(245,197,24,0.05)" },
  },
  {
    id: 63, label: "Glass Frosted",
    style: { borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" },
  },
  {
    id: 64, label: "Dark Card Elevated",
    style: { borderRadius: 12, background: "rgba(15,25,50,0.95)", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06)" },
  },
  {
    id: 65, label: "Inner Glow",
    style: { borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)" },
  },
  {
    id: 66, label: "Gradient Fill",
    style: { borderRadius: 10, background: "linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)" },
  },
  {
    id: 67, label: "Blue Tint",
    style: { borderRadius: 10, background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" },
  },
  {
    id: 68, label: "Amber Tint",
    style: { borderRadius: 10, background: "rgba(245,197,24,0.06)", border: "1px solid rgba(245,197,24,0.2)" },
  },
  {
    id: 69, label: "Gradient Left Accent",
    style: { borderRadius: 8, background: "linear-gradient(90deg,rgba(245,197,24,0.12) 0%,rgba(255,255,255,0.03) 40%)", border: "none", borderLeft: "3px solid rgba(245,197,24,0.6)" },
  },
  {
    id: 70, label: "Stripe Pattern",
    style: { borderRadius: 8, background: "repeating-linear-gradient(45deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 4px,transparent 4px,transparent 12px)", border: "1px solid rgba(255,255,255,0.08)" },
  },

  // ── Skew combinations ────────────────────────────────────────────
  {
    id: 71, label: "Skew + Cut Corner",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transform: "skewX(-5deg)", clipPath: "polygon(10px 0%,100% 0%,100% 100%,0% 100%)" },
    innerSkew: "skewX(5deg)",
  },
  {
    id: 72, label: "Skew + Glow",
    style: { borderRadius: 4, background: "rgba(15,25,50,0.95)", border: "1px solid rgba(245,197,24,0.25)", transform: "skewX(-5deg)", boxShadow: "0 0 10px rgba(245,197,24,0.1)" },
    innerSkew: "skewX(5deg)",
  },
  {
    id: 73, label: "Skew + Gradient Border",
    wrapSkew: "skewX(-5deg)",
    wrapStyle: { padding: 1, background: "linear-gradient(135deg,rgba(245,197,24,0.5),rgba(255,255,255,0.05))" },
    style: { background: "rgba(8,16,36,0.97)", border: "none" },
    innerSkew: "skewX(5deg)",
  },
  {
    id: 74, label: "Skew Pill",
    style: { borderRadius: 999, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", transform: "skewX(-6deg)" },
    innerSkew: "skewX(6deg)",
  },
  {
    id: 75, label: "Skew Sharp Accent",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.04)", border: "none", borderLeft: "4px solid #f5c518", transform: "skewX(-6deg)" },
    innerSkew: "skewX(6deg)",
  },

  // ── Ticket / Coupon styles ───────────────────────────────────────
  {
    id: 76, label: "Ticket Notch Both",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.15)", clipPath: "polygon(0% 0%,100% 0%,100% calc(50% - 8px),calc(100% + 8px) 50%,100% calc(50% + 8px),100% 100%,0% 100%,0% calc(50% + 8px),calc(-8px) 50%,0% calc(50% - 8px))" },
  },
  {
    id: 77, label: "Ticket Stamp",
    style: { borderRadius: 4, background: "rgba(255,255,255,0.04)", border: "2px dashed rgba(255,255,255,0.12)" },
  },
  {
    id: 78, label: "Receipt Strip",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.04)", border: "none", borderTop: "2px solid rgba(255,255,255,0.1)", borderBottom: "2px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 79, label: "Coupon Cut Left",
    style: { borderRadius: "0 8px 8px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "2px dashed rgba(255,255,255,0.2)" },
  },
  {
    id: 80, label: "Perforated Edge",
    style: { borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "none", borderTop: "3px dotted rgba(255,255,255,0.2)", borderBottom: "3px dotted rgba(255,255,255,0.2)" },
  },

  // ── Asymmetric & Mixed ───────────────────────────────────────────
  {
    id: 81, label: "Lopsided Left",
    style: { borderRadius: "20px 6px 6px 20px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 82, label: "Lopsided Right",
    style: { borderRadius: "6px 20px 20px 6px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 83, label: "Top Heavy",
    style: { borderRadius: "12px 12px 4px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 84, label: "Bottom Heavy",
    style: { borderRadius: "4px 4px 12px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 85, label: "Stadium Flat Top",
    style: { borderRadius: "0 0 999px 999px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 86, label: "Leaf Shape",
    style: { borderRadius: "50% 0 50% 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 87, label: "Half Circle Top",
    style: { borderRadius: "999px 999px 0 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 88, label: "Squircle",
    style: { borderRadius: "30%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 89, label: "Tab Right",
    style: { borderRadius: "8px 0 0 8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRight: "none" },
  },
  {
    id: 90, label: "Tab Left",
    style: { borderRadius: "0 8px 8px 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderLeft: "none" },
  },

  // ── Score-board / Sport styles ────────────────────────────────────
  {
    id: 91, label: "Scoreboard Dark",
    style: { borderRadius: 4, background: "#050d1a", border: "2px solid rgba(255,255,255,0.06)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.03)" },
  },
  {
    id: 92, label: "Field Green",
    style: { borderRadius: 8, background: "rgba(22,101,52,0.15)", border: "1px solid rgba(22,163,74,0.25)" },
  },
  {
    id: 93, label: "Jersey Stripe",
    style: { borderRadius: 8, background: "repeating-linear-gradient(90deg,rgba(255,255,255,0.04) 0px,rgba(255,255,255,0.04) 8px,rgba(255,255,255,0.01) 8px,rgba(255,255,255,0.01) 16px)", border: "1px solid rgba(255,255,255,0.08)" },
  },
  {
    id: 94, label: "Diagonal Split",
    style: { borderRadius: 8, background: "linear-gradient(135deg,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.02) 50%)", border: "1px solid rgba(255,255,255,0.08)" },
  },
  {
    id: 95, label: "Gold Top Line",
    style: { borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderTop: "2px solid rgba(245,197,24,0.6)" },
  },
  {
    id: 96, label: "Neon Outline",
    style: { borderRadius: 8, background: "transparent", border: "1px solid rgba(245,197,24,0.5)", boxShadow: "0 0 8px rgba(245,197,24,0.2), inset 0 0 8px rgba(245,197,24,0.05)" },
  },
  {
    id: 97, label: "Minimal Line",
    style: { borderRadius: 0, background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  },
  {
    id: 98, label: "Pill Glass",
    style: { borderRadius: 999, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" },
  },
  {
    id: 99, label: "Shadow Card",
    style: { borderRadius: 10, background: "rgba(5,10,25,0.8)", border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)" },
  },
  {
    id: 100, label: "Neumorphic",
    style: { borderRadius: 14, background: "rgba(10,18,40,0.9)", border: "none", boxShadow: "4px 4px 8px rgba(0,0,0,0.4), -2px -2px 6px rgba(255,255,255,0.04)" },
  },
];

function MockCard({ design, selected, onSelect }) {
  const { style, innerSkew, wrapStyle, wrapSkew, label, id } = design;
  const contentStyle = {
    display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
    transform: innerSkew || "none",
  };

  const card = (
    <div style={{ ...style, overflow: "hidden" }}>
      <div style={contentStyle}>
        <span style={{ flex: 1, textAlign: "right", color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {MOCK.teamA}
        </span>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
          <div style={{ background: "rgba(245,197,24,0.11)", border: "1px solid rgba(245,197,24,0.32)", borderRadius: 10, padding: "2px 10px" }}>
            <span style={{ fontWeight: 900, fontSize: 13, color: "#f5c518" }}>{MOCK.score}</span>
          </div>
          <span style={{ fontSize: 9, color: "rgba(245,197,24,0.4)", marginTop: 2 }}>{MOCK.league}</span>
        </div>
        <span style={{ flex: 1, textAlign: "left", color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {MOCK.teamB}
        </span>
      </div>
    </div>
  );

  return (
    <div onClick={() => onSelect(id)} style={{ cursor: "pointer", opacity: selected ? 1 : 0.85, transition: "opacity 0.15s" }}>
      <div style={{ fontSize: 11, color: selected ? "#f5c518" : "rgba(255,255,255,0.4)", marginBottom: 5, fontWeight: 600 }}>
        #{id} {label} {selected ? "✓" : ""}
      </div>
      <div style={{ ...(wrapStyle || {}), transform: wrapSkew, boxShadow: selected ? "0 0 0 2px #f5c518" : wrapStyle?.boxShadow }}>
        {wrapStyle ? card : <div style={{ boxShadow: selected ? "0 0 0 2px #f5c518" : undefined }}>{card}</div>}
      </div>
    </div>
  );
}

export default function AdminSummaryCardDemo2() {
  const [selected, setSelected] = useState(null);
  const sel = designs.find(d => d.id === selected);

  const getCss = (d) => {
    if (!d) return "";
    const lines = [];
    const s = d.style || {};
    const entries = {
      borderRadius: v => `border-radius: ${typeof v === "number" ? v + "px" : v}`,
      border: v => `border: ${v}`,
      borderLeft: v => `border-left: ${v}`,
      borderTop: v => `border-top: ${v}`,
      borderBottom: v => `border-bottom: ${v}`,
      borderRight: v => `border-right: ${v}`,
      background: v => `background: ${v}`,
      clipPath: v => `clip-path: ${v}`,
      transform: v => `transform: ${v}`,
      boxShadow: v => `box-shadow: ${v}`,
      backdropFilter: v => `backdrop-filter: ${v}`,
    };
    Object.entries(entries).forEach(([k, fn]) => { if (s[k]) lines.push(fn(s[k])); });
    if (d.innerSkew) lines.push(`/* inner content: transform: ${d.innerSkew} */`);
    return lines.join(";\n");
  };

  return (
    <div style={{ padding: 24, color: "white", fontFamily: "'Outfit', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Summary Card Shape Demo 2</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>50 עיצובים נוספים (#51–100) — לחץ לבחור</p>

      {selected && sel && (
        <div style={{ marginBottom: 24, background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.25)", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: "#f5c518", fontWeight: 700, marginBottom: 6 }}>#{selected} — {sel.label}</div>
          <pre style={{ fontSize: 11, color: "#fde68a", margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{getCss(sel)}</pre>
          <button
            onClick={() => navigator.clipboard?.writeText(getCss(sel))}
            style={{ marginTop: 8, fontSize: 11, color: "#f5c518", background: "rgba(245,197,24,0.15)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}
          >
            העתק CSS
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {designs.map(d => (
          <MockCard key={d.id} design={d} selected={selected === d.id} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}
