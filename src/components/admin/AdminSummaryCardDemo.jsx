import React, { useState } from "react";

const MOCK = { teamA: "Spain", teamB: "Saudi Arabia", score: "3 – 1", league: "Group C" };

const designs = [
  // ── Rounded variations ──────────────────────────────────────────
  {
    id: 1, label: "Rounded XL (קיים)",
    style: { borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 2, label: "Pill",
    style: { borderRadius: 999, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 3, label: "Slightly Rounded",
    style: { borderRadius: 6, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 4, label: "Sharp / Square",
    style: { borderRadius: 0, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 5, label: "Top Rounded Only",
    style: { borderRadius: "16px 16px 0 0", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 6, label: "Diagonal Radius",
    style: { borderRadius: "16px 0 16px 0", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" },
  },

  // ── Parallelogram / Skew ─────────────────────────────────────────
  {
    id: 7, label: "Parallelogram (כמו הטבלה)",
    style: { borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", transform: "skewX(-6deg)" },
    innerSkew: "skewX(6deg)",
  },
  {
    id: 8, label: "Parallelogram Heavy",
    style: { borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", transform: "skewX(-12deg)" },
    innerSkew: "skewX(12deg)",
  },
  {
    id: 9, label: "Parallelogram Right",
    style: { borderRadius: 4, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.04)", transform: "skewX(6deg)" },
    innerSkew: "skewX(-6deg)",
  },
  {
    id: 10, label: "Parallelogram Soft",
    style: { borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", transform: "skewX(-4deg)" },
    innerSkew: "skewX(4deg)",
  },

  // ── Clip-path shapes ─────────────────────────────────────────────
  {
    id: 11, label: "Cut Corner TL",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", clipPath: "polygon(16px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16px)" },
  },
  {
    id: 12, label: "Cut Corners (Octagon)",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.04)", border: "none", clipPath: "polygon(12px 0%,calc(100% - 12px) 0%,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0% calc(100% - 12px),0% 12px)" },
  },
  {
    id: 13, label: "Ticket (Cut BR)",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.04)", border: "none", clipPath: "polygon(0% 0%,100% 0%,100% calc(100% - 14px),calc(100% - 14px) 100%,0% 100%)" },
  },
  {
    id: 14, label: "Arrow Right",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%, calc(100% - 16px) 0%, 100% 50%, calc(100% - 16px) 100%, 0% 100%)" },
  },
  {
    id: 15, label: "Arrow Left",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(16px 0%, 100% 0%, 100% 100%, 16px 100%, 0% 50%)" },
  },
  {
    id: 16, label: "Trapezoid Wide Top",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%, 100% 0%, calc(100% - 10px) 100%, 10px 100%)" },
  },
  {
    id: 17, label: "Trapezoid Wide Bottom",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(10px 0%, calc(100% - 10px) 0%, 100% 100%, 0% 100%)" },
  },
  {
    id: 18, label: "Shield Top",
    style: { borderRadius: "14px 14px 0 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)" },
  },
  {
    id: 19, label: "Chevron Double",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%,calc(100% - 20px) 0%,100% 50%,calc(100% - 20px) 100%,0% 100%,20px 50%)" },
  },
  {
    id: 20, label: "Notched Sides",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.05)", border: "none", clipPath: "polygon(0% 0%,100% 0%,100% calc(50% - 8px),calc(100% + 0px) 50%,100% calc(50% + 8px),100% 100%,0% 100%,0% calc(50% + 8px),-0px 50%,0% calc(50% - 8px))" },
  },

  // ── Border / accent styles ────────────────────────────────────────
  {
    id: 21, label: "Left Accent Bar",
    style: { borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "none", borderLeft: "4px solid rgba(245,197,24,0.7)" },
  },
  {
    id: 22, label: "Top Accent Bar",
    style: { borderRadius: "0 0 8px 8px", background: "rgba(255,255,255,0.04)", border: "none", borderTop: "3px solid rgba(245,197,24,0.7)" },
  },
  {
    id: 23, label: "Double Border",
    style: { borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", outline: "3px solid rgba(255,255,255,0.04)", outlineOffset: "2px" },
  },
  {
    id: 24, label: "Top/Bottom Only",
    style: { borderRadius: 0, background: "rgba(255,255,255,0.04)", border: "none", borderTop: "1px solid rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.12)" },
  },
  {
    id: 25, label: "Dashed Border",
    style: { borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.18)" },
  },

  // ── Special ───────────────────────────────────────────────────────
  {
    id: 26, label: "Stadium Arch",
    style: { borderRadius: "999px 999px 8px 8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 27, label: "Flat Arch Bottom",
    style: { borderRadius: "8px 8px 999px 999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 28, label: "Card with Tab",
    style: { borderRadius: "0 12px 12px 12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 29, label: "Half Pill Left",
    style: { borderRadius: "999px 8px 8px 999px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" },
  },
  {
    id: 30, label: "Inset Shadow Only",
    style: { borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "none", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1), 0 2px 12px rgba(0,0,0,0.3)" },
  },
];

function MockCard({ design, selected, onSelect }) {
  const { style, innerSkew, label, id } = design;
  const inner = { transform: innerSkew || "none", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px" };

  return (
    <div
      onClick={() => onSelect(id)}
      style={{
        cursor: "pointer",
        transition: "opacity 0.15s",
        opacity: selected ? 1 : 0.85,
      }}
    >
      {/* label */}
      <div style={{ fontSize: 11, color: selected ? "#f5c518" : "rgba(255,255,255,0.4)", marginBottom: 5, fontWeight: 600 }}>
        #{id} {label} {selected ? "✓" : ""}
      </div>

      {/* card */}
      <div style={{ ...style, overflow: "hidden", boxShadow: selected ? "0 0 0 2px #f5c518" : style.boxShadow }}>
        <div style={inner}>
          {/* Team A */}
          <span style={{ flex: 1, textAlign: "right", color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {MOCK.teamA}
          </span>
          {/* Score pill */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 68 }}>
            <div style={{ background: "rgba(245,197,24,0.11)", border: "1px solid rgba(245,197,24,0.32)", borderRadius: 10, padding: "2px 10px" }}>
              <span style={{ fontWeight: 900, fontSize: 13, color: "#f5c518" }}>{MOCK.score}</span>
            </div>
            <span style={{ fontSize: 9, color: "rgba(245,197,24,0.4)", marginTop: 2 }}>{MOCK.league}</span>
          </div>
          {/* Team B */}
          <span style={{ flex: 1, textAlign: "left", color: "#e2e8f0", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {MOCK.teamB}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminSummaryCardDemo() {
  const [selected, setSelected] = useState(null);

  const selectedDesign = designs.find(d => d.id === selected);

  const getCss = (d) => {
    if (!d) return "";
    const s = d.style;
    const parts = [];
    if (s.borderRadius !== undefined) parts.push(`border-radius: ${typeof s.borderRadius === "number" ? s.borderRadius + "px" : s.borderRadius}`);
    if (s.border) parts.push(`border: ${s.border}`);
    if (s.borderLeft) parts.push(`border-left: ${s.borderLeft}`);
    if (s.borderTop) parts.push(`border-top: ${s.borderTop}`);
    if (s.borderBottom) parts.push(`border-bottom: ${s.borderBottom}`);
    if (s.background) parts.push(`background: ${s.background}`);
    if (s.clipPath) parts.push(`clip-path: ${s.clipPath}`);
    if (s.transform) parts.push(`transform: ${s.transform}`);
    if (s.boxShadow) parts.push(`box-shadow: ${s.boxShadow}`);
    if (s.outline) parts.push(`outline: ${s.outline}`);
    if (s.outlineOffset) parts.push(`outline-offset: ${s.outlineOffset}`);
    if (d.innerSkew) parts.push(`/* inner content: transform: ${d.innerSkew} */`);
    return parts.join(";\n");
  };

  return (
    <div style={{ padding: 24, color: "white", fontFamily: "'Outfit', sans-serif" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Summary Card Shape Demo</h2>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 24 }}>30 עיצובי צורה לקונטיינר — לחץ לבחור</p>

      {/* Selected CSS */}
      {selected && (
        <div style={{ marginBottom: 24, background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.25)", borderRadius: 10, padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: "#f5c518", fontWeight: 700, marginBottom: 6 }}>#{selected} — {selectedDesign?.label}</div>
          <pre style={{ fontSize: 11, color: "#fde68a", margin: 0, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{getCss(selectedDesign)}</pre>
          <button
            onClick={() => navigator.clipboard?.writeText(getCss(selectedDesign))}
            style={{ marginTop: 8, fontSize: 11, color: "#f5c518", background: "rgba(245,197,24,0.15)", border: "1px solid rgba(245,197,24,0.3)", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}
          >
            העתק CSS
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {designs.map(d => (
          <MockCard key={d.id} design={d} selected={selected === d.id} onSelect={setSelected} />
        ))}
      </div>
    </div>
  );
}
