import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PX = 48;

function Flag({ code }) {
  return (
    <span className={`fi fi-${code} fis`}
      style={{ width: PX, height: PX, fontSize: PX, display: "inline-block", backgroundSize: "cover", backgroundPosition: "center", borderRadius: 8, flexShrink: 0 }} />
  );
}

function Team({ code, name, label }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <Flag code={code} />
      <span className="text-xs font-bold text-white text-center leading-tight">{name}</span>
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  );
}

function TeamWhite({ code, name, label }) {
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <Flag code={code} />
      <span className="text-xs font-bold text-white text-center leading-tight">{name}</span>
      <span className="text-[10px] text-white/50">{label}</span>
    </div>
  );
}

// ── 1. Clean Glass ────────────────────────────────────────────────────────────
function D1() {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-center justify-between"
      style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)" }}>
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-amber-400 font-black text-base tracking-widest pb-4">VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 2. Gold Frame ─────────────────────────────────────────────────────────────
function D2() {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-center justify-between relative overflow-hidden"
      style={{ background: "rgba(10,14,30,0.9)", border: "1.5px solid rgba(212,175,55,0.6)", boxShadow: "0 0 20px rgba(212,175,55,0.15), inset 0 1px 0 rgba(255,215,0,0.2)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.8), transparent)" }} />
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="font-black text-base tracking-widest pb-4 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg,#ffd700,#b8860b)" }}>VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 3. Split Gradient ─────────────────────────────────────────────────────────
function D3() {
  return (
    <div className="rounded-2xl overflow-hidden flex items-center" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex-1 flex flex-col items-center gap-1 px-4 py-4" style={{ background: "linear-gradient(135deg,rgba(220,38,38,0.25),rgba(10,14,30,0.7))" }}>
        <Flag code="kr" /><span className="text-xs font-bold text-white mt-1">Korea Republic</span><span className="text-[10px] text-white/40">(בית)</span>
      </div>
      <div className="flex flex-col items-center px-3 py-4 z-10">
        <span className="text-white/60 font-black text-sm tracking-widest">VS</span>
      </div>
      <div className="flex-1 flex flex-col items-center gap-1 px-4 py-4" style={{ background: "linear-gradient(225deg,rgba(59,130,246,0.25),rgba(10,14,30,0.7))" }}>
        <Flag code="cz" /><span className="text-xs font-bold text-white mt-1">Czechia</span><span className="text-[10px] text-white/40">(חוץ)</span>
      </div>
    </div>
  );
}

// ── 4. Dark Premium ───────────────────────────────────────────────────────────
function D4() {
  return (
    <div className="rounded-xl px-5 py-4 flex items-center justify-between relative"
      style={{ background: "rgba(6,10,20,0.95)", borderBottom: "2px solid rgba(212,175,55,0.5)" }}>
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <div className="flex flex-col items-center pb-4">
        <span className="text-[9px] text-slate-500 tracking-widest">MATCH</span>
        <span className="text-amber-400 font-black text-sm">VS</span>
      </div>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 5. Neon Border ────────────────────────────────────────────────────────────
function D5() {
  return (
    <motion.div className="rounded-2xl px-5 py-4 flex items-center justify-between"
      style={{ background: "rgba(5,8,20,0.9)" }}
      animate={{ boxShadow: ["0 0 0 1.5px rgba(0,240,255,0.6), 0 0 12px rgba(0,240,255,0.2)", "0 0 0 1.5px rgba(180,0,255,0.6), 0 0 12px rgba(180,0,255,0.2)", "0 0 0 1.5px rgba(0,240,255,0.6), 0 0 12px rgba(0,240,255,0.2)"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}>
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-cyan-400 font-black text-base tracking-widest pb-4">VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </motion.div>
  );
}

// ── 6. Stadium Green ─────────────────────────────────────────────────────────
function D6() {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-center justify-between overflow-hidden relative"
      style={{ background: "repeating-linear-gradient(90deg,rgba(22,101,52,0.4) 0px,rgba(22,101,52,0.4) 24px,rgba(21,128,61,0.4) 24px,rgba(21,128,61,0.4) 48px)", border: "1px solid rgba(34,197,94,0.2)" }}>
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <div className="flex flex-col items-center pb-4 bg-black/30 px-3 py-1 rounded-lg">
        <span className="text-white font-black text-sm">VS</span>
      </div>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 7. Minimal Line ───────────────────────────────────────────────────────────
function D7() {
  return (
    <div className="px-2 py-4 flex items-center justify-between relative">
      <div className="absolute bottom-0 left-8 right-8 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent)" }} />
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-white/30 font-bold text-sm pb-4">—</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 8. Banner Style ───────────────────────────────────────────────────────────
function D8() {
  return (
    <div className="flex items-center justify-between px-5 py-3 relative overflow-hidden"
      style={{ background: "linear-gradient(90deg,rgba(30,58,138,0.6) 0%,rgba(15,23,42,0.9) 30%,rgba(15,23,42,0.9) 70%,rgba(120,20,20,0.6) 100%)", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-white/50 font-black text-base tracking-widest pb-4">VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 9. Frosted Heavy ─────────────────────────────────────────────────────────
function D9() {
  return (
    <div className="rounded-3xl px-5 py-4 flex items-center justify-between"
      style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(40px) saturate(180%)", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-white/70 font-black text-base tracking-widest pb-4">VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 10. Trophy Gold Dark ──────────────────────────────────────────────────────
function D10() {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-center justify-between relative overflow-hidden"
      style={{ background: "linear-gradient(145deg,rgba(40,28,0,0.95),rgba(15,10,0,0.95))", border: "1px solid rgba(212,175,55,0.35)", boxShadow: "inset 0 0 30px rgba(212,175,55,0.05)" }}>
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.6),transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.3),transparent)" }} />
      <TeamWhite code="kr" name="Korea Republic" label="(בית)" />
      <span className="font-black text-base tracking-widest pb-4 bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(180deg,#ffd700,#8b6914)" }}>VS</span>
      <TeamWhite code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 11. Diagonal Split ────────────────────────────────────────────────────────
function D11() {
  return (
    <div className="rounded-2xl overflow-hidden relative flex items-center px-5 py-4 justify-between"
      style={{ background: "rgba(10,14,30,0.9)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="absolute inset-y-0 left-0 w-1/2 pointer-events-none" style={{ background: "linear-gradient(160deg,rgba(220,38,38,0.15) 0%,transparent 70%)" }} />
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none" style={{ background: "linear-gradient(200deg,rgba(37,99,235,0.15) 0%,transparent 70%)" }} />
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-white/40 font-black text-sm pb-4 relative z-10">VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── 12. Retro Scoreboard ──────────────────────────────────────────────────────
function D12() {
  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "2px solid rgba(245,197,24,0.5)" }}>
      <div className="bg-amber-400/10 text-center py-1 text-[9px] text-amber-400 font-bold tracking-widest">⚽ GROUP A</div>
      <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(10,10,10,0.95)" }}>
        <Team code="kr" name="Korea Republic" label="(בית)" />
        <div className="flex flex-col items-center pb-4">
          <span className="text-amber-400/60 text-[9px] font-mono">MATCH</span>
          <span className="text-amber-400 font-black text-sm font-mono">VS</span>
        </div>
        <Team code="cz" name="Czechia" label="(חוץ)" />
      </div>
    </div>
  );
}

// ── 13. Glow Flags Focus ─────────────────────────────────────────────────────
function D13() {
  return (
    <div className="px-5 py-4 flex items-center justify-between">
      <div className="flex flex-col items-center gap-1 flex-1">
        <div style={{ filter: "drop-shadow(0 0 16px rgba(220,38,38,0.7))" }}><Flag code="kr" /></div>
        <span className="text-xs font-bold text-white">Korea Republic</span>
        <span className="text-[10px] text-slate-400">(בית)</span>
      </div>
      <div className="flex flex-col items-center pb-4">
        <motion.span className="font-black text-base text-white/60"
          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>VS</motion.span>
      </div>
      <div className="flex flex-col items-center gap-1 flex-1">
        <div style={{ filter: "drop-shadow(0 0 16px rgba(37,99,235,0.7))" }}><Flag code="cz" /></div>
        <span className="text-xs font-bold text-white">Czechia</span>
        <span className="text-[10px] text-slate-400">(חוץ)</span>
      </div>
    </div>
  );
}

// ── 14. Capsule Pills ────────────────────────────────────────────────────────
function D14() {
  return (
    <div className="flex items-center justify-between gap-2 px-2 py-3">
      <div className="flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Flag code="kr" /><span className="text-xs font-bold text-white text-center">Korea Republic</span><span className="text-[10px] text-slate-400">(בית)</span>
      </div>
      <span className="text-white/30 font-black text-xs pb-3 flex-shrink-0">VS</span>
      <div className="flex-1 flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <Flag code="cz" /><span className="text-xs font-bold text-white text-center">Czechia</span><span className="text-[10px] text-slate-400">(חוץ)</span>
      </div>
    </div>
  );
}

// ── 15. Aurora Border ─────────────────────────────────────────────────────────
function D15() {
  return (
    <div className="rounded-2xl px-5 py-4 flex items-center justify-between relative overflow-hidden"
      style={{ background: "rgba(8,10,24,0.95)" }}>
      <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{ boxShadow: [
          "0 0 0 1px rgba(99,102,241,0.6), 0 0 16px rgba(99,102,241,0.2)",
          "0 0 0 1px rgba(236,72,153,0.6), 0 0 16px rgba(236,72,153,0.2)",
          "0 0 0 1px rgba(6,182,212,0.6), 0 0 16px rgba(6,182,212,0.2)",
          "0 0 0 1px rgba(99,102,241,0.6), 0 0 16px rgba(99,102,241,0.2)",
        ]}}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      <Team code="kr" name="Korea Republic" label="(בית)" />
      <span className="text-white/50 font-black text-base tracking-widest pb-4">VS</span>
      <Team code="cz" name="Czechia" label="(חוץ)" />
    </div>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────
const DESIGNS = [
  { id: 1,  name: "Clean Glass",      tag: "זכוכית",    desc: "glassmorphism עם blur עדין ומסגרת לבנה שקופה", C: D1 },
  { id: 2,  name: "Gold Frame",       tag: "זהב",       desc: "מסגרת זהב עם inner glow ופס אור עליון", C: D2 },
  { id: 3,  name: "Split Gradient",   tag: "חלוקה",     desc: "כל צד בגרדיאנט צבע שונה — בית מימין, אורח משמאל", C: D3 },
  { id: 4,  name: "Dark Premium",     tag: "פרימיום",   desc: "רקע כהה מאוד עם קו זהב בתחתית בלבד", C: D4 },
  { id: 5,  name: "Neon Border",      tag: "ניאון",     desc: "מסגרת ניאון שמחליפה צבעים ציאן↔סגול", C: D5 },
  { id: 6,  name: "Stadium Green",    tag: "מגרש",      desc: "פסי דשא ירוקים ברקע — ישר מהמגרש", C: D6 },
  { id: 7,  name: "Minimal Line",     tag: "מינימל",    desc: "אין רקע כלל — רק קו דק מתחת", C: D7 },
  { id: 8,  name: "Banner Style",     tag: "באנר",      desc: "גרדיאנט אופקי עם צבע לכל קבוצה, ללא פינות מעוגלות", C: D8 },
  { id: 9,  name: "Frosted Heavy",    tag: "ערפל",      desc: "frosted glass חזק עם פינות עגולות מאוד ואפקט עמוק", C: D9 },
  { id: 10, name: "Trophy Dark",      tag: "גביע",      desc: "כהה-זהב פרימיום עם שני קווי זהב עליון ותחתון", C: D10 },
  { id: 11, name: "Diagonal Split",   tag: "אלכסון",    desc: "גרדיאנט צבע לכל קבוצה בזווית אלכסונית עדינה", C: D11 },
  { id: 12, name: "Retro Scoreboard", tag: "רטרו",      desc: "לוח תוצאות וינטג' עם כותרת GROUP A", C: D12 },
  { id: 13, name: "Glow Flags",       tag: "זוהר",      desc: "ללא קונטיינר — הדגלים עצמם פולטים זוהר צבעוני", C: D13 },
  { id: 14, name: "Capsule Pills",    tag: "קפסולה",    desc: "כל קבוצה בתוך קפסולה נפרדת עם מסגרת עדינה", C: D14 },
  { id: 15, name: "Aurora Border",    tag: "אורורה",    desc: "מסגרת שמחליפה צבעים באיטיות — סגול↔ורוד↔ציאן", C: D15 },
];

const COLORS = {
  "זכוכית":"#94a3b8","זהב":"#fbbf24","חלוקה":"#818cf8","פרימיום":"#cbd5e1",
  "ניאון":"#22d3ee","מגרש":"#4ade80","מינימל":"#64748b","באנר":"#60a5fa",
  "ערפל":"#e2e8f0","גביע":"#d97706","אלכסון":"#a78bfa","רטרו":"#f59e0b",
  "זוהר":"#f87171","קפסולה":"#86efac","אורורה":"#c084fc",
};

export default function AdminTeamsHeaderDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🎨 עיצוב אזור הנבחרות — 15 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">האזור שמוצג בראש הסימולטור עם דגלים, שמות וVS. לחץ לפרטים.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DESIGNS.map(({ id, name, tag, C }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-700/60 hover:border-slate-500"}`}
            style={{ background: "#0f172a" }}
            whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(id === selected ? null : id)}>

            <div className="p-3">
              <C />
            </div>

            <div className="px-4 pb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">#{id}</span>
                <span className="text-sm font-semibold text-white">{name}</span>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${COLORS[tag]}18`, color: COLORS[tag], border: `1px solid ${COLORS[tag]}30` }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const d = DESIGNS.find(x => x.id === selected);
          if (!d) return null;
          return (
            <motion.div key={selected}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-start flex-wrap"
              style={{ background: "rgba(15,23,42,0.98)", boxShadow: "0 0 30px rgba(99,102,241,0.1)" }}>
              <div className="w-full sm:w-72 flex-shrink-0 rounded-xl overflow-hidden" style={{ background: "#0f172a" }}>
                <div className="p-3"><d.C /></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-white">#{d.id} — {d.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${COLORS[d.tag]}18`, color: COLORS[d.tag] }}>{d.tag}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
                <button onClick={() => setSelected(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
