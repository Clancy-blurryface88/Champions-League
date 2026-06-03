import React, { useState } from "react";

const UNITS = [
  { val: 14, label: "ימים" },
  { val: 23, label: "שעות" },
  { val: 57, label: "דקות" },
  { val: 36, label: "שניות" },
];

function TimerPreview({ numStyle = {}, padZero = false }) {
  const base = numStyle.background
    ? { lineHeight: 1, marginBottom: 2, fontSize: "1.05rem", fontWeight: 800 }
    : { lineHeight: 1, marginBottom: 2, color: "#4ade80", fontSize: "1.05rem", fontWeight: 800 };
  const merged = { ...base, ...numStyle };

  return (
    <div dir="rtl" style={{ display: "flex", borderRadius: "0.75rem", overflow: "hidden", border: "1px solid #244a3d", background: "#1a362d" }}>
      {UNITS.map((u, i) => (
        <React.Fragment key={u.label}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 12px" }}>
            <span style={merged}>{padZero ? String(u.val).padStart(2, "0") : u.val}</span>
            <span style={{ fontSize: "0.6rem", color: "#4ade80", fontWeight: 500, lineHeight: 1 }}>{u.label}</span>
          </div>
          {i < 3 && <div style={{ width: 1, height: 24, background: "rgba(74,222,128,0.2)", alignSelf: "center" }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── 50 font/style designs ─────────────────────────────────────────────────────

const FONTS = [
  // ── FONT FAMILIES (1–10) ─────────────────────────────────────────────────────
  { id: 1,  name: "System UI",         tag: "נוכחי",        numStyle: { fontWeight: 800, fontSize: "1.05rem" } },
  { id: 2,  name: "Monospace",         tag: "מונוספייס",    numStyle: { fontFamily: "monospace", fontWeight: 700 } },
  { id: 3,  name: "Georgia Serif",     tag: "סריף",         numStyle: { fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.1rem" } },
  { id: 4,  name: "Impact",            tag: "אימפקט",       numStyle: { fontFamily: "Impact, sans-serif", fontWeight: 400, fontSize: "1.25rem", letterSpacing: "-0.02em" } },
  { id: 5,  name: "Arial Black",       tag: "Arial Black",  numStyle: { fontFamily: "'Arial Black', sans-serif", fontWeight: 900, fontSize: "0.95rem" } },
  { id: 6,  name: "Verdana",           tag: "ורדנה",        numStyle: { fontFamily: "Verdana, sans-serif", fontWeight: 700, fontSize: "0.9rem" } },
  { id: 7,  name: "Courier New",       tag: "קוריאר",       numStyle: { fontFamily: "'Courier New', monospace", fontWeight: 700 } },
  { id: 8,  name: "Times New Roman",   tag: "טיימס",        numStyle: { fontFamily: "'Times New Roman', serif", fontWeight: 700, fontSize: "1.15rem" } },
  { id: 9,  name: "Trebuchet MS",      tag: "טרבושה",       numStyle: { fontFamily: "'Trebuchet MS', sans-serif", fontWeight: 700 } },
  { id: 10, name: "Tahoma",            tag: "טאהומה",       numStyle: { fontFamily: "Tahoma, sans-serif", fontWeight: 700 } },

  // ── FONT WEIGHTS (11–19) ─────────────────────────────────────────────────────
  { id: 11, name: "Weight 100",        tag: "דק מאוד",      numStyle: { fontWeight: 100, fontSize: "1.2rem" } },
  { id: 12, name: "Weight 200",        tag: "דק",           numStyle: { fontWeight: 200, fontSize: "1.2rem" } },
  { id: 13, name: "Weight 300",        tag: "קל",           numStyle: { fontWeight: 300, fontSize: "1.1rem" } },
  { id: 14, name: "Weight 400",        tag: "רגיל",         numStyle: { fontWeight: 400 } },
  { id: 15, name: "Weight 500",        tag: "בינוני",       numStyle: { fontWeight: 500 } },
  { id: 16, name: "Weight 600",        tag: "סמי-בולד",     numStyle: { fontWeight: 600 } },
  { id: 17, name: "Weight 700",        tag: "בולד",         numStyle: { fontWeight: 700 } },
  { id: 18, name: "Weight 800",        tag: "אקסטרה בולד",  numStyle: { fontWeight: 800 } },
  { id: 19, name: "Weight 900",        tag: "הכי שמן",      numStyle: { fontWeight: 900 } },

  // ── LETTER SPACING (20–24) ───────────────────────────────────────────────────
  { id: 20, name: "Tracking -0.08em",  tag: "צפוף מאוד",   numStyle: { fontWeight: 800, letterSpacing: "-0.08em" } },
  { id: 21, name: "Tracking -0.04em",  tag: "צפוף",        numStyle: { fontWeight: 800, letterSpacing: "-0.04em" } },
  { id: 22, name: "Tracking +0.06em",  tag: "רחב קצת",     numStyle: { fontWeight: 700, letterSpacing: "0.06em" } },
  { id: 23, name: "Tracking +0.14em",  tag: "רחב",         numStyle: { fontWeight: 700, fontSize: "1rem", letterSpacing: "0.14em" } },
  { id: 24, name: "Tracking +0.28em",  tag: "רחב מאוד",    numStyle: { fontWeight: 600, fontSize: "0.9rem", letterSpacing: "0.28em" } },

  // ── FONT SIZES (25–29) ───────────────────────────────────────────────────────
  { id: 25, name: "Tiny 0.75rem",      tag: "קטן מאוד",    numStyle: { fontWeight: 800, fontSize: "0.75rem" } },
  { id: 26, name: "Small 0.9rem",      tag: "קטן",         numStyle: { fontWeight: 800, fontSize: "0.9rem" } },
  { id: 27, name: "Large 1.3rem",      tag: "גדול",        numStyle: { fontWeight: 800, fontSize: "1.3rem" } },
  { id: 28, name: "XL 1.6rem",         tag: "גדול מאוד",   numStyle: { fontWeight: 800, fontSize: "1.6rem" } },
  { id: 29, name: "XXL 2rem",          tag: "ענק",         numStyle: { fontWeight: 800, fontSize: "2rem" } },

  // ── TEXT SHADOW / GLOW (30–34) ───────────────────────────────────────────────
  { id: 30, name: "Soft Glow",         tag: "גלואו רך",    numStyle: { fontWeight: 800, textShadow: "0 0 10px rgba(74,222,128,0.6)" } },
  { id: 31, name: "Neon Bright",       tag: "ניאון חזק",   numStyle: { fontWeight: 800, textShadow: "0 0 6px #4ade80, 0 0 14px rgba(74,222,128,0.9)" } },
  { id: 32, name: "Hard Shadow",       tag: "צל קשה",      numStyle: { fontWeight: 800, textShadow: "1px 2px 0px rgba(0,0,0,0.9)" } },
  { id: 33, name: "Offset Shadow",     tag: "צל היסט",     numStyle: { fontWeight: 800, textShadow: "3px 3px 6px rgba(0,0,0,0.7)" } },
  { id: 34, name: "Triple Glow",       tag: "גלואו משולש",  numStyle: { fontWeight: 800, textShadow: "0 0 4px #4ade80, 0 0 14px rgba(74,222,128,0.6), 0 0 30px rgba(74,222,128,0.3)" } },

  // ── GRADIENT TEXT (35–40) ────────────────────────────────────────────────────
  { id: 35, name: "Green → Teal",      tag: "ירוק→ציאן",   numStyle: { fontWeight: 800, background: "linear-gradient(135deg,#4ade80,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
  { id: 36, name: "Green → Gold",      tag: "ירוק→זהב",    numStyle: { fontWeight: 800, background: "linear-gradient(135deg,#4ade80,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
  { id: 37, name: "Blue → Purple",     tag: "כחול→סגול",   numStyle: { fontWeight: 800, background: "linear-gradient(135deg,#60a5fa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
  { id: 38, name: "Gold Gradient",     tag: "זהב",         numStyle: { fontWeight: 800, background: "linear-gradient(135deg,#f59e0b,#fde68a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
  { id: 39, name: "Fire",              tag: "אש",          numStyle: { fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },
  { id: 40, name: "Aurora",            tag: "אורורה",      numStyle: { fontWeight: 800, background: "linear-gradient(135deg,#4ade80,#22d3ee,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } },

  // ── ITALIC (41–43) ───────────────────────────────────────────────────────────
  { id: 41, name: "Italic Bold",       tag: "נטוי שמן",    numStyle: { fontWeight: 800, fontStyle: "italic" } },
  { id: 42, name: "Italic Light",      tag: "נטוי קל",     numStyle: { fontWeight: 300, fontSize: "1.2rem", fontStyle: "italic" } },
  { id: 43, name: "Italic Mono",       tag: "מונו נטוי",   numStyle: { fontFamily: "monospace", fontWeight: 700, fontStyle: "italic" } },

  // ── NUMERIC FEATURES (44–45) ─────────────────────────────────────────────────
  { id: 44, name: "Tabular Nums",      tag: "טאבולרי",     numStyle: { fontWeight: 800, fontVariantNumeric: "tabular-nums", fontFamily: "monospace" } },
  { id: 45, name: "Zero Padded",       tag: "עם 0",        numStyle: { fontWeight: 800, fontFamily: "'Courier New', monospace" }, padZero: true },

  // ── CONDENSED / EXPANDED (46–48) ─────────────────────────────────────────────
  { id: 46, name: "Ultra Condensed",   tag: "מכווץ",       numStyle: { fontWeight: 900, fontSize: "1.4rem", letterSpacing: "-0.1em" } },
  { id: 47, name: "Expanded Light",    tag: "מורחב קל",    numStyle: { fontWeight: 200, fontSize: "1rem", letterSpacing: "0.18em" } },
  { id: 48, name: "Expanded Bold",     tag: "מורחב שמן",   numStyle: { fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.12em" } },

  // ── COMBOS (49–50) ───────────────────────────────────────────────────────────
  { id: 49, name: "Mono + Glow",       tag: "מונו+גלואו",  numStyle: { fontFamily: "monospace", fontWeight: 700, textShadow: "0 0 8px rgba(74,222,128,0.8)" } },
  { id: 50, name: "Serif Italic Glow", tag: "סריף+גלואו",  numStyle: { fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.1rem", fontStyle: "italic", textShadow: "0 0 10px rgba(74,222,128,0.5)" } },
];

// ── main component ────────────────────────────────────────────────────────────

export default function AdminFontDemo() {
  const [selected, setSelected] = useState(null);
  const sel = FONTS.find(f => f.id === selected);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🔤 עיצובי פונט — 50 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כל תא מציג עיצוב פונט שונה על אותו טיימר. לחץ לבחירה.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {FONTS.map(f => (
          <div
            key={f.id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === f.id ? "border-white/50 ring-2 ring-white/20" : "border-slate-800 hover:border-slate-600"}`}
            style={{ background: "#060810" }}
            onClick={() => setSelected(f.id === selected ? null : f.id)}
          >
            <div className="p-3 flex items-center justify-center min-h-[72px]">
              <TimerPreview numStyle={f.numStyle} padZero={f.padZero} />
            </div>
            <div className="px-2.5 py-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{f.id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{f.name}</span>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full flex-shrink-0 bg-white/5 text-slate-400 border border-white/10">
                {f.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {sel && (
        <div className="mt-5 rounded-2xl border border-white/15 p-5 flex gap-6 items-center flex-wrap" style={{ background: "rgba(6,8,16,0.98)" }}>
          <div className="flex items-center justify-center p-6 rounded-xl" style={{ background: "#060810", minWidth: 220 }}>
            <TimerPreview numStyle={sel.numStyle} padZero={sel.padZero} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-bold text-white text-lg">#{sel.id} — {sel.name}</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{sel.tag}</span>
            </div>
            <div className="text-xs text-slate-500 font-mono mb-3 break-all">
              {JSON.stringify(sel.numStyle, null, 0)}
            </div>
            <button onClick={() => setSelected(null)} className="text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
          </div>
        </div>
      )}
    </div>
  );
}
