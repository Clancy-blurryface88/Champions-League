import React, { useState } from "react";

const UNITS = [
  { val: 14, label: "ימים" },
  { val: 23, label: "שעות" },
  { val: 57, label: "דקות" },
  { val: 36, label: "שניות" },
];

// ── layout helpers ────────────────────────────────────────────────────────────

function Pill({ bg, border, radius = "1rem", gap = 16, pad = "6px 16px", numColor, numSize = "1rem", lblColor, extra = {} }) {
  return (
    <div dir="rtl" style={{ display: "flex", gap, padding: pad, background: bg, border: `1px solid ${border}`, borderRadius: radius, ...extra }}>
      {UNITS.map(u => (
        <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontWeight: 700, lineHeight: 1, marginBottom: 2, fontSize: numSize, color: numColor }}>{u.val}</span>
          <span style={{ fontSize: "0.6rem", color: lblColor }}>{u.label}</span>
        </div>
      ))}
    </div>
  );
}

function Boxes({ bg, border, radius = "0.5rem", gap = 6, pad = "8px 10px", numColor, numSize = "1.125rem", lblColor, minW = 42, extra = {} }) {
  return (
    <div dir="rtl" style={{ display: "flex", gap }}>
      {UNITS.map(u => (
        <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: minW, padding: pad, background: bg, border: `1px solid ${border}`, borderRadius: radius, ...extra }}>
          <span style={{ fontWeight: 700, lineHeight: 1, marginBottom: 3, fontSize: numSize, color: numColor }}>{u.val}</span>
          <span style={{ fontSize: "0.6rem", color: lblColor }}>{u.label}</span>
        </div>
      ))}
    </div>
  );
}

function ColonTimer({ numColor, lblColor, numSize = "1.1rem", colonColor, showLabels = true, gap = 6, extra = {} }) {
  return (
    <div dir="rtl" style={{ display: "flex", alignItems: "center", gap, ...extra }}>
      {UNITS.map((u, i) => (
        <React.Fragment key={u.label}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: numSize, lineHeight: 1, color: numColor, marginBottom: showLabels ? 2 : 0 }}>
              {String(u.val).padStart(2, "0")}
            </span>
            {showLabels && <span style={{ fontSize: "0.55rem", color: lblColor }}>{u.label}</span>}
          </div>
          {i < UNITS.length - 1 && (
            <span style={{ fontSize: numSize, color: colonColor, fontWeight: 700, paddingBottom: showLabels ? 10 : 0, opacity: 0.6 }}>:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── 50 designs ────────────────────────────────────────────────────────────────

const TIMERS = [
  // ── PILL (1–18) ──────────────────────────────────────────────────────────────
  { id: 1,  name: "Emerald Pill",       tag: "נוכחי",
    render: () => <Pill bg="#1a362d" border="#244a3d" numColor="#4ade80" lblColor="#4ade8077" /> },

  { id: 2,  name: "Ocean Pill",         tag: "אוקיינוס",
    render: () => <Pill bg="#0c2040" border="#1a3d70" numColor="#38bdf8" lblColor="#38bdf877" /> },

  { id: 3,  name: "Midnight Gold",      tag: "זהב",
    render: () => <Pill bg="#18120a" border="#3d2a0a" numColor="#fbbf24" lblColor="#fbbf2477" /> },

  { id: 4,  name: "Royal Purple",       tag: "רויאל",
    render: () => <Pill bg="#1a0f30" border="#3a1f60" numColor="#c084fc" lblColor="#c084fc77" /> },

  { id: 5,  name: "Crimson Pill",       tag: "קרימזון",
    render: () => <Pill bg="#2a0a0a" border="#5a1010" numColor="#f87171" lblColor="#f8717177" /> },

  { id: 6,  name: "Steel Blue",         tag: "פלדה",
    render: () => <Pill bg="#0e1929" border="#1e3049" numColor="#93c5fd" lblColor="#93c5fd77" /> },

  { id: 7,  name: "Obsidian White",     tag: "אובסידיאן",
    render: () => <Pill bg="#0c0c0e" border="#2a2a2e" numColor="#f1f5f9" lblColor="#f1f5f966" /> },

  { id: 8,  name: "Warm Amber",         tag: "ענבר",
    render: () => <Pill bg="#1c1200" border="#3d2800" numColor="#f59e0b" lblColor="#f59e0b77" /> },

  { id: 9,  name: "Matrix Green",       tag: "מטריקס",
    render: () => <Pill bg="#000000" border="#0a2e0a" numColor="#00ff41" lblColor="#00ff4166" extra={{ fontFamily: "monospace" }} /> },

  { id: 10, name: "Sunset Orange",      tag: "שקיעה",
    render: () => <Pill bg="#1e0c00" border="#4a1a00" numColor="#fb923c" lblColor="#fb923c77" /> },

  { id: 11, name: "Arctic Ice",         tag: "ארקטי",
    render: () => <Pill bg="#07192e" border="#0e3058" numColor="#bae6fd" lblColor="#bae6fd77" /> },

  { id: 12, name: "Violet Night",       tag: "סגול",
    render: () => <Pill bg="#150a28" border="#301560" numColor="#e879f9" lblColor="#e879f977" /> },

  { id: 13, name: "Jade Pure",          tag: "ג׳ייד",
    render: () => <Pill bg="#022c1a" border="#065f40" numColor="#34d399" lblColor="#34d39977" /> },

  { id: 14, name: "Copper Bronze",      tag: "נחושת",
    render: () => <Pill bg="#1c0e02" border="#4a2808" numColor="#f97316" lblColor="#f9731677" radius="0.6rem" /> },

  { id: 15, name: "Rose Dark",          tag: "ורוד",
    render: () => <Pill bg="#250818" border="#5a1038" numColor="#fb7185" lblColor="#fb718577" /> },

  { id: 16, name: "Teal Glow",          tag: "טיל",
    render: () => <Pill bg="#042d2a" border="#0e5a55" numColor="#2dd4bf" lblColor="#2dd4bf77" /> },

  { id: 17, name: "Cobalt Blue",        tag: "קובלט",
    render: () => <Pill bg="#0a1640" border="#1a3080" numColor="#60a5fa" lblColor="#60a5fa77" /> },

  { id: 18, name: "Lime Neon",          tag: "ליים",
    render: () => <Pill bg="#0e1a00" border="#203800" numColor="#a3e635" lblColor="#a3e63577" /> },

  // ── BOXES (19–34) ────────────────────────────────────────────────────────────
  { id: 19, name: "Emerald Boxes",      tag: "תיבות ירוק",
    render: () => <Boxes bg="#112218" border="#1e4030" numColor="#4ade80" lblColor="#4ade8077" /> },

  { id: 20, name: "Sky Blue Boxes",     tag: "תיבות כחול",
    render: () => <Boxes bg="#0e1e38" border="#1a3a60" numColor="#7dd3fc" lblColor="#7dd3fc77" /> },

  { id: 21, name: "Gold Boxes",         tag: "תיבות זהב",
    render: () => <Boxes bg="#1c1400" border="#3d2c00" numColor="#fbbf24" lblColor="#fbbf2477" /> },

  { id: 22, name: "Glass Boxes",        tag: "זכוכית",
    render: () => <Boxes bg="rgba(255,255,255,0.06)" border="rgba(255,255,255,0.15)" numColor="#ffffff" lblColor="rgba(255,255,255,0.45)" radius="0.75rem" extra={{ backdropFilter: "blur(12px)" }} /> },

  { id: 23, name: "Neon Glow Green",    tag: "ניאון ירוק",
    render: () => <Boxes bg="rgba(74,222,128,0.08)" border="rgba(74,222,128,0.35)" numColor="#4ade80" lblColor="#4ade8077" extra={{ boxShadow: "0 0 10px rgba(74,222,128,0.2)" }} /> },

  { id: 24, name: "Neon Glow Blue",     tag: "ניאון כחול",
    render: () => <Boxes bg="rgba(56,189,248,0.08)" border="rgba(56,189,248,0.35)" numColor="#38bdf8" lblColor="#38bdf877" extra={{ boxShadow: "0 0 10px rgba(56,189,248,0.2)" }} /> },

  { id: 25, name: "Outline Green",      tag: "קווי ירוק",
    render: () => <Boxes bg="transparent" border="#4ade8055" numColor="#4ade80" lblColor="#4ade8066" radius="0.75rem" /> },

  { id: 26, name: "Outline Gold",       tag: "קווי זהב",
    render: () => <Boxes bg="transparent" border="#fbbf2455" numColor="#fbbf24" lblColor="#fbbf2466" radius="0.75rem" /> },

  { id: 27, name: "Gradient Boxes",     tag: "גרדיאנט",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 6 }}>
        {[["#1a362d","#244a3d","#4ade80"],["#0c2040","#1a3d70","#38bdf8"],["#18120a","#3d2a0a","#fbbf24"],["#1a0f30","#3a1f60","#c084fc"]].map((c, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 42, padding: "8px 10px", background: c[0], border: `1px solid ${c[1]}`, borderRadius: "0.5rem" }}>
            <span style={{ fontWeight: 700, fontSize: "1.125rem", lineHeight: 1, marginBottom: 3, color: c[2] }}>{UNITS[i].val}</span>
            <span style={{ fontSize: "0.6rem", color: `${c[2]}77` }}>{UNITS[i].label}</span>
          </div>
        ))}
      </div>
    )},

  { id: 28, name: "Purple Boxes",       tag: "תיבות סגול",
    render: () => <Boxes bg="#160e28" border="#301860" numColor="#a78bfa" lblColor="#a78bfa77" /> },

  { id: 29, name: "Teal Boxes",         tag: "תיבות טיל",
    render: () => <Boxes bg="#052520" border="#0e4a44" numColor="#2dd4bf" lblColor="#2dd4bf77" /> },

  { id: 30, name: "Red Boxes",          tag: "תיבות אדום",
    render: () => <Boxes bg="#200808" border="#4a1010" numColor="#f87171" lblColor="#f8717177" /> },

  { id: 31, name: "Orange Boxes",       tag: "תיבות כתום",
    render: () => <Boxes bg="#1c0c00" border="#4a2000" numColor="#fb923c" lblColor="#fb923c77" /> },

  { id: 32, name: "Silver Minimal",     tag: "כסף",
    render: () => <Boxes bg="#0e1018" border="#2a2e3a" numColor="#cbd5e1" lblColor="#cbd5e177" radius="0.5rem" /> },

  { id: 33, name: "White Outline",      tag: "לבן",
    render: () => <Boxes bg="transparent" border="rgba(255,255,255,0.2)" numColor="#ffffff" lblColor="rgba(255,255,255,0.4)" radius="0.5rem" /> },

  { id: 34, name: "Warm Sand",          tag: "חול",
    render: () => <Boxes bg="#1e1208" border="#3d2808" numColor="#fde68a" lblColor="#fde68a77" /> },

  // ── COLON (35–42) ────────────────────────────────────────────────────────────
  { id: 35, name: "Classic Colon",      tag: "קולון לבן",
    render: () => <ColonTimer numColor="#ffffff" lblColor="rgba(255,255,255,0.4)" colonColor="#ffffff" /> },

  { id: 36, name: "Gold Colon",         tag: "קולון זהב",
    render: () => <ColonTimer numColor="#fbbf24" lblColor="#fbbf2466" colonColor="#fbbf24" /> },

  { id: 37, name: "Cyan Colon",         tag: "קולון ציאן",
    render: () => <ColonTimer numColor="#22d3ee" lblColor="#22d3ee66" colonColor="#22d3ee" /> },

  { id: 38, name: "Large No Labels",    tag: "קולון גדול",
    render: () => <ColonTimer numColor="#4ade80" colonColor="#4ade8055" showLabels={false} numSize="1.75rem" gap={4} /> },

  { id: 39, name: "Compact Colon",      tag: "קולון קטן",
    render: () => <ColonTimer numColor="#93c5fd" lblColor="#93c5fd66" colonColor="#93c5fd" numSize="0.9rem" gap={4} /> },

  { id: 40, name: "Purple Colon",       tag: "קולון סגול",
    render: () => <ColonTimer numColor="#c084fc" lblColor="#c084fc66" colonColor="#c084fc" /> },

  { id: 41, name: "Green Colon",        tag: "קולון ירוק",
    render: () => <ColonTimer numColor="#34d399" lblColor="#34d39966" colonColor="#34d399" /> },

  { id: 42, name: "Dot Minimal",        tag: "נקודות",
    render: () => (
      <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {UNITS.map((u, i) => (
          <React.Fragment key={u.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontWeight: 300, fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", letterSpacing: "0.05em", lineHeight: 1, marginBottom: 2 }}>
                {String(u.val).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>{u.label}</span>
            </div>
            {i < UNITS.length - 1 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "1rem" }}>·</span>}
          </React.Fragment>
        ))}
      </div>
    )},

  // ── SPECIAL / UNIQUE (43–50) ─────────────────────────────────────────────────
  { id: 43, name: "Labels Above",       tag: "תוויות מעל",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 16 }}>
        {UNITS.map(u => (
          <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em" }}>{u.label}</span>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: "#ffffff", lineHeight: 1 }}>{String(u.val).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
    )},

  { id: 44, name: "Split Colors",       tag: "צבעים מחולקים",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 4 }}>
        {UNITS.map((u, i) => {
          const cols = ["#4ade80", "#38bdf8", "#fbbf24", "#c084fc"];
          return (
            <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 10px", background: `${cols[i]}15`, border: `1px solid ${cols[i]}40`, borderRadius: "0.6rem" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", color: cols[i], lineHeight: 1, marginBottom: 2 }}>{u.val}</span>
              <span style={{ fontSize: "0.55rem", color: `${cols[i]}88` }}>{u.label}</span>
            </div>
          );
        })}
      </div>
    )},

  { id: 45, name: "Underline Style",    tag: "קו תחתון",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 14 }}>
        {UNITS.map(u => (
          <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingBottom: 4, borderBottom: "1px solid rgba(74,222,128,0.4)" }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "#4ade80", lineHeight: 1, marginBottom: 3 }}>{u.val}</span>
            <span style={{ fontSize: "0.55rem", color: "rgba(74,222,128,0.5)" }}>{u.label}</span>
          </div>
        ))}
      </div>
    )},

  { id: 46, name: "Bold Dividers",      tag: "מפרידים",
    render: () => (
      <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.75rem", overflow: "hidden" }}>
        {UNITS.map((u, i) => (
          <React.Fragment key={u.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 12px" }}>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#ffffff", lineHeight: 1, marginBottom: 2 }}>{String(u.val).padStart(2, "0")}</span>
              <span style={{ fontSize: "0.5rem", color: "rgba(255,255,255,0.3)" }}>{u.label}</span>
            </div>
            {i < UNITS.length - 1 && <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />}
          </React.Fragment>
        ))}
      </div>
    )},

  { id: 47, name: "Gradient Text",      tag: "גרדיאנט טקסט",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 16, padding: "6px 16px", background: "rgba(10,10,20,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "1rem" }}>
        {UNITS.map(u => (
          <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1, marginBottom: 2, background: "linear-gradient(135deg,#4ade80,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{u.val}</span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)" }}>{u.label}</span>
          </div>
        ))}
      </div>
    )},

  { id: 48, name: "Frosted Luxury",     tag: "זכוכית פרימיום",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 16, padding: "8px 20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.2rem", backdropFilter: "blur(20px)", boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
        {UNITS.map(u => (
          <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontWeight: 600, fontSize: "1rem", lineHeight: 1, marginBottom: 2, color: "rgba(255,255,255,0.9)" }}>{u.val}</span>
            <span style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)" }}>{u.label}</span>
          </div>
        ))}
      </div>
    )},

  { id: 49, name: "Retro LCD",          tag: "רטרו LCD",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 12, padding: "6px 14px", background: "#0a1a08", border: "1px solid #1a3a14", borderRadius: "0.4rem", fontFamily: "'Courier New', monospace" }}>
        {UNITS.map(u => (
          <div key={u.label} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1, marginBottom: 2, color: "#39ff14", textShadow: "0 0 8px #39ff14" }}>{String(u.val).padStart(2, "0")}</span>
            <span style={{ fontSize: "0.55rem", color: "#39ff1455" }}>{u.label}</span>
          </div>
        ))}
      </div>
    )},

  { id: 50, name: "Gold Luxury",        tag: "זהב יוקרה",
    render: () => (
      <div dir="rtl" style={{ display: "flex", gap: 0, padding: "6px 4px", background: "linear-gradient(145deg,#1c1200,#0d0a00)", border: "1px solid #8b6914", borderRadius: "0.75rem", boxShadow: "0 0 20px rgba(251,191,36,0.12), inset 0 1px 0 rgba(251,191,36,0.15)" }}>
        {UNITS.map((u, i) => (
          <React.Fragment key={u.label}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px" }}>
              <span style={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1, marginBottom: 2, color: "#fbbf24", textShadow: "0 0 10px rgba(251,191,36,0.4)" }}>{u.val}</span>
              <span style={{ fontSize: "0.6rem", color: "#fbbf2466" }}>{u.label}</span>
            </div>
            {i < UNITS.length - 1 && <div style={{ width: 1, height: 24, background: "#fbbf2430", alignSelf: "center" }} />}
          </React.Fragment>
        ))}
      </div>
    )},
];

// ── main component ────────────────────────────────────────────────────────────

export default function AdminTimerDemo() {
  const [selected, setSelected] = useState(null);
  const sel = TIMERS.find(t => t.id === selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">⏱️ עיצובי טיימר — 50 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל תא מציג עיצוב שונה של הטיימר סופר לאחור. לחץ לבחירה.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {TIMERS.map(t => (
          <div
            key={t.id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === t.id ? "border-white/50 ring-2 ring-white/20" : "border-slate-800 hover:border-slate-600"}`}
            style={{ background: "#060810" }}
            onClick={() => setSelected(t.id === selected ? null : t.id)}
          >
            <div className="p-3 flex items-center justify-center min-h-[72px]">
              {t.render()}
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{t.id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{t.name}</span>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full flex-shrink-0 bg-white/5 text-slate-400 border border-white/10">
                {t.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="mt-5 rounded-2xl border border-white/15 p-5 flex gap-6 items-center flex-wrap" style={{ background: "rgba(6,8,16,0.98)" }}>
          <div className="flex items-center justify-center p-6 rounded-xl" style={{ background: "#060810", minWidth: 220 }}>
            {sel.render()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-bold text-white text-lg">#{sel.id} — {sel.name}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{sel.tag}</span>
            </div>
            <button onClick={() => setSelected(null)} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}
