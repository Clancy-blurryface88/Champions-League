import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

// ── Static mock card content ───────────────────────────────────────────────────
function Flag({ code, size = 44 }) {
  return (
    <span className={`fi fi-${code} fis`}
      style={{ width: size, height: size, fontSize: size, display: "inline-block", backgroundSize: "cover", backgroundPosition: "center", borderRadius: 7, flexShrink: 0 }} />
  );
}

function CardContent({ textColor = "text-white", mutedColor = "text-slate-400", scoreColor = "text-white", groupColor, borderColor }) {
  return (
    <div className="flex flex-col gap-2 p-4 w-full">
      {/* Countdown */}
      <div className="flex justify-center">
        <div className="rounded-2xl px-3 py-1.5 flex gap-3 text-center" style={{ background: "rgba(26,54,45,0.8)", border: "1px solid rgba(74,222,128,0.2)" }}>
          {[["10","ימים"],["7","שעות"],["55","דקות"],["51","שניות"]].map(([n,l]) => (
            <div key={l} className="flex flex-col items-center">
              <span className="text-sm font-bold leading-none text-emerald-400">{n}</span>
              <span className="text-[9px] text-emerald-600">{l}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Group */}
      <div className="flex justify-center">
        <span className={`text-xs font-semibold px-4 py-1 rounded-full ${groupColor || "text-amber-400 bg-amber-400/10 border border-amber-400/30"}`}>Group A</span>
      </div>
      {/* Separator */}
      <div className="border-t border-white/8" />
      {/* Teams */}
      <div className="flex items-center justify-between px-1 py-1">
        <div className="flex flex-col items-center gap-1 flex-1">
          <Flag code="kr" />
          <span className={`text-[10px] font-semibold ${textColor}`}>Korea Republic</span>
          <span className={`text-[9px] ${mutedColor}`}>(Home)</span>
        </div>
        <div className="flex items-center gap-2">
          {[null, null].map((_, i) => (
            <div key={i} className="w-8 h-10 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <span className={`text-lg font-bold ${scoreColor}`}>1</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-1 flex-1">
          <Flag code="cz" />
          <span className={`text-[10px] font-semibold ${textColor}`}>Czechia</span>
          <span className={`text-[9px] ${mutedColor}`}>(Away)</span>
        </div>
      </div>
      {/* Footer */}
      <div className="flex flex-col items-center gap-0.5">
        <span className={`text-[9px] ${mutedColor}`}>📅 12/06/2026 · 05:00</span>
        <span className={`text-[9px] ${mutedColor}`}>📍 Guadalajara Stadium</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 20 card designs
// ═══════════════════════════════════════════════════════════════════════════════

const C = ({ children, style = {}, className = "" }) => (
  <div className={`relative rounded-2xl overflow-hidden w-full ${className}`} style={style}>{children}</div>
);

// 1. Glass Crystal
function D1() {
  return (
    <C style={{ background: "linear-gradient(145deg,rgba(255,255,255,0.13) 0%,rgba(10,20,50,0.5) 50%,rgba(255,255,255,0.06) 100%)", backdropFilter: "blur(32px)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)" }}>
      <ShineBorder borderRadius={16} borderWidth={1} duration={10} shineColor={["rgba(255,255,255,0.9)","rgba(200,220,255,0.7)","rgba(255,255,255,1)"]} />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)" }} />
      <CardContent />
    </C>
  );
}

// 2. Gold Championship
function D2() {
  return (
    <C style={{ background: "linear-gradient(145deg,rgba(20,14,2,0.95),rgba(10,8,2,0.95))", border: "1.5px solid rgba(212,175,55,0.7)", boxShadow: "0 0 24px rgba(212,175,55,0.2), inset 0 1px 0 rgba(255,215,0,0.25)" }}>
      <ShineBorder borderRadius={16} borderWidth={1.5} duration={14} shineColor={["#b8860b","#ffd700","#fffacd","#ffd700","#b8860b"]} />
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.9),transparent)" }} />
      <CardContent mutedColor="text-amber-700" groupColor="text-amber-400 bg-amber-400/10 border border-amber-500/30" />
    </C>
  );
}

// 3. Dark Carbon
function D3() {
  return (
    <C style={{ background: "repeating-linear-gradient(45deg,rgba(30,30,30,0.95) 0px,rgba(30,30,30,0.95) 2px,rgba(20,20,20,0.95) 2px,rgba(20,20,20,0.95) 4px)", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 8px 24px rgba(0,0,0,0.6)" }}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} />
      <div className="relative z-10"><CardContent mutedColor="text-slate-500" /></div>
    </C>
  );
}

// 4. Neon Pulse
function D4() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden w-full"
      style={{ background: "rgba(4,8,20,0.97)" }}
      animate={{ boxShadow: ["0 0 0 1.5px rgba(0,240,255,0.7),0 0 20px rgba(0,240,255,0.2)", "0 0 0 1.5px rgba(180,0,255,0.7),0 0 20px rgba(180,0,255,0.2)", "0 0 0 1.5px rgba(0,240,255,0.7),0 0 20px rgba(0,240,255,0.2)"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
      <CardContent mutedColor="text-cyan-900" groupColor="text-cyan-400 bg-cyan-400/10 border border-cyan-500/30" />
    </motion.div>
  );
}

// 5. Royal Navy
function D5() {
  return (
    <C style={{ background: "linear-gradient(145deg,rgba(0,21,82,0.95),rgba(0,10,45,0.98))", border: "1px solid rgba(99,130,255,0.35)", boxShadow: "0 8px 40px rgba(0,21,82,0.7), inset 0 1px 0 rgba(99,130,255,0.25)" }}>
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(99,130,255,0.8),transparent)" }} />
      <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(212,175,55,0.4),transparent)" }} />
      <CardContent groupColor="text-blue-300 bg-blue-500/10 border border-blue-500/20" mutedColor="text-blue-400/60" />
    </C>
  );
}

// 6. Gradient Border (pseudo-border via box-shadow + padding)
function D6() {
  return (
    <div className="relative rounded-2xl p-[1.5px] w-full" style={{ background: "linear-gradient(135deg,#6366f1,#ec4899,#f59e0b)", boxShadow: "0 8px 32px rgba(99,102,241,0.3)" }}>
      <div className="rounded-[14px] overflow-hidden" style={{ background: "rgba(10,12,30,0.96)" }}>
        <CardContent groupColor="text-violet-400 bg-violet-500/10 border border-violet-500/20" mutedColor="text-slate-500" />
      </div>
    </div>
  );
}

// 7. Frosted Capsule
function D7() {
  return (
    <C className="!rounded-[28px]" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(40px) saturate(200%)", border: "1px solid rgba(255,255,255,0.28)", boxShadow: "0 12px 40px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.35)" }}>
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)" }} />
      <CardContent />
    </C>
  );
}

// 8. Lava Edge
function D8() {
  return (
    <div className="relative rounded-2xl p-[1.5px] w-full" style={{ background: "linear-gradient(135deg,#ef4444,#f97316,#ef4444)", boxShadow: "0 8px 32px rgba(239,68,68,0.25)" }}>
      <div className="rounded-[14px] overflow-hidden" style={{ background: "linear-gradient(145deg,rgba(30,8,8,0.97),rgba(15,5,5,0.98))" }}>
        <CardContent groupColor="text-orange-400 bg-orange-500/10 border border-orange-500/20" mutedColor="text-orange-900" />
      </div>
    </div>
  );
}

// 9. Stadium Night
function D9() {
  return (
    <C style={{ background: "radial-gradient(ellipse at 50% 120%,rgba(255,220,80,0.12) 0%,transparent 60%),linear-gradient(180deg,rgba(0,0,0,0.95),rgba(5,10,20,0.98))", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 0 40px rgba(0,0,0,0.8)" }}>
      <div className="absolute bottom-0 inset-x-0 h-12 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 100%,rgba(255,220,80,0.08) 0%,transparent 70%)" }} />
      <div className="relative z-10"><CardContent mutedColor="text-slate-600" groupColor="text-yellow-500/80 bg-yellow-500/8 border border-yellow-500/20" /></div>
    </C>
  );
}

// 10. Holographic
function D10() {
  return (
    <div className="relative rounded-2xl p-[1.5px] w-full" style={{ background: "linear-gradient(135deg,#ff006e,#8338ec,#3a86ff,#06ffa5,#ffbe0b,#ff006e)", backgroundSize: "300% 300%", animation: "holoBorder 4s linear infinite", boxShadow: "0 8px 32px rgba(131,56,236,0.3)" }}>
      <style>{`@keyframes holoBorder { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }`}</style>
      <div className="rounded-[14px] overflow-hidden" style={{ background: "rgba(8,6,20,0.97)" }}>
        <CardContent groupColor="text-purple-400 bg-purple-500/10 border border-purple-500/20" mutedColor="text-slate-500" />
      </div>
    </div>
  );
}

// 11. Emerald Premium
function D11() {
  return (
    <C style={{ background: "linear-gradient(145deg,rgba(2,20,12,0.97),rgba(1,12,8,0.98))", border: "1px solid rgba(52,211,153,0.4)", boxShadow: "0 0 28px rgba(52,211,153,0.12), inset 0 1px 0 rgba(52,211,153,0.2)" }}>
      <ShineBorder borderRadius={16} borderWidth={1} duration={12} shineColor={["#10b981","#6ee7b7","#10b981"]} />
      <CardContent groupColor="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" mutedColor="text-emerald-900" />
    </C>
  );
}

// 12. Blueprint
function D12() {
  return (
    <C style={{ background: "linear-gradient(135deg,rgba(0,40,100,0.95),rgba(0,25,70,0.98))", border: "1px solid rgba(100,160,255,0.3)", boxShadow: "inset 0 0 60px rgba(0,60,150,0.3)" }}>
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: "linear-gradient(rgba(100,160,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(100,160,255,0.5) 1px,transparent 1px)", backgroundSize: "20px 20px" }} />
      <div className="relative z-10"><CardContent textColor="text-blue-200" mutedColor="text-blue-400/50" groupColor="text-blue-300 bg-blue-500/10 border border-blue-400/20" scoreColor="text-blue-200" /></div>
    </C>
  );
}

// 13. Retro Scoreboard
function D13() {
  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ border: "2px solid rgba(245,197,24,0.6)", background: "rgba(8,6,0,0.98)", fontFamily: "'Courier New',monospace" }}>
      <div className="text-center py-1 text-[9px] font-bold tracking-widest" style={{ background: "rgba(245,197,24,0.1)", color: "rgba(245,197,24,0.8)", borderBottom: "1px solid rgba(245,197,24,0.2)" }}>
        ══ FIFA WORLD CUP 2026 ══
      </div>
      <CardContent groupColor="text-amber-400 bg-transparent border border-amber-400/30" mutedColor="text-amber-700" />
    </div>
  );
}

// 14. Tactical Board
function D14() {
  return (
    <C style={{ background: "repeating-linear-gradient(90deg,rgba(22,101,52,0.6) 0px,rgba(22,101,52,0.6) 30px,rgba(21,128,61,0.6) 30px,rgba(21,128,61,0.6) 60px)", border: "2px solid rgba(34,197,94,0.3)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
      <div className="relative z-10"><CardContent groupColor="text-green-400 bg-green-500/10 border border-green-500/20" mutedColor="text-green-800" /></div>
    </C>
  );
}

// 15. Minimal White
function D15() {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg,#f8fafc,#f1f5f9)", border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <CardContent textColor="text-slate-800" mutedColor="text-slate-400" groupColor="text-slate-700 bg-slate-200 border border-slate-300" scoreColor="text-slate-800" />
    </div>
  );
}

// 16. Aurora Glow
function D16() {
  return (
    <motion.div className="relative rounded-2xl overflow-hidden w-full"
      style={{ background: "rgba(6,8,24,0.97)" }}
      animate={{ boxShadow: ["0 0 0 1px rgba(99,102,241,0.5),0 0 30px rgba(99,102,241,0.15)", "0 0 0 1px rgba(236,72,153,0.5),0 0 30px rgba(236,72,153,0.15)", "0 0 0 1px rgba(6,182,212,0.5),0 0 30px rgba(6,182,212,0.15)", "0 0 0 1px rgba(99,102,241,0.5),0 0 30px rgba(99,102,241,0.15)"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ background: ["radial-gradient(ellipse at 20% 50%,rgba(99,102,241,0.08) 0%,transparent 60%)", "radial-gradient(ellipse at 80% 50%,rgba(236,72,153,0.08) 0%,transparent 60%)", "radial-gradient(ellipse at 50% 20%,rgba(6,182,212,0.08) 0%,transparent 60%)", "radial-gradient(ellipse at 20% 50%,rgba(99,102,241,0.08) 0%,transparent 60%)"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
      <div className="relative z-10"><CardContent groupColor="text-violet-400 bg-violet-500/10 border border-violet-500/20" mutedColor="text-slate-600" /></div>
    </motion.div>
  );
}

// 17. Newspaper
function D17() {
  return (
    <div className="w-full rounded-lg overflow-hidden" style={{ background: "#f5f0e8", border: "2px solid #2c1810", boxShadow: "4px 4px 0 #2c1810" }}>
      <div className="text-center py-1 text-[9px] font-black tracking-widest border-b-2 border-[#2c1810]" style={{ color: "#2c1810", fontFamily: "'Times New Roman',serif" }}>
        WORLD CUP MATCH PREDICTION
      </div>
      <CardContent textColor="text-[#2c1810]" mutedColor="text-[#6b4c3b]" groupColor="text-[#2c1810] bg-transparent border-2 border-[#2c1810]" scoreColor="text-[#2c1810]" />
    </div>
  );
}

// 18. Rose Gold
function D18() {
  return (
    <div className="relative rounded-2xl p-[1.5px] w-full" style={{ background: "linear-gradient(135deg,#c9748f,#e8b4b8,#c9748f,#9b5e6e)", boxShadow: "0 8px 32px rgba(201,116,143,0.3)" }}>
      <div className="rounded-[14px] overflow-hidden" style={{ background: "linear-gradient(145deg,rgba(30,10,15,0.97),rgba(20,8,12,0.98))" }}>
        <CardContent groupColor="text-rose-300 bg-rose-500/10 border border-rose-400/20" mutedColor="text-rose-900" />
      </div>
    </div>
  );
}

// 19. Ice/Arctic
function D19() {
  return (
    <C style={{ background: "linear-gradient(145deg,rgba(200,230,255,0.12),rgba(150,200,255,0.06))", backdropFilter: "blur(30px)", border: "1px solid rgba(180,220,255,0.3)", boxShadow: "0 8px 32px rgba(100,180,255,0.1), inset 0 1px 0 rgba(255,255,255,0.4)" }}>
      <div className="absolute top-0 inset-x-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(180,220,255,0.9),transparent)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(200,230,255,0.08) 0%,transparent 60%)" }} />
      <CardContent groupColor="text-sky-300 bg-sky-500/10 border border-sky-400/20" mutedColor="text-sky-400/50" />
    </C>
  );
}

// 20. Double Border
function D20() {
  return (
    <div className="relative rounded-2xl w-full" style={{ padding: "2px", background: "rgba(255,255,255,0.15)", boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }}>
      <div className="rounded-[14px] overflow-hidden" style={{ padding: "2px", background: "rgba(255,255,255,0.05)" }}>
        <div className="rounded-xl overflow-hidden" style={{ background: "rgba(10,14,30,0.97)" }}>
          <CardContent groupColor="text-slate-300 bg-slate-500/10 border border-slate-400/20" mutedColor="text-slate-500" />
        </div>
      </div>
    </div>
  );
}

// ── Catalog ────────────────────────────────────────────────────────────────────
const DESIGNS = [
  { id:1,  name:"Glass Crystal",     tag:"זכוכית",    desc:"Glassmorphism עם ShineBorder לבן ופס specular עליון",    C:D1 },
  { id:2,  name:"Gold Championship", tag:"זהב",       desc:"מסגרת זהב כפולה עם inner glow ו-ShineBorder זהוב",     C:D2 },
  { id:3,  name:"Dark Carbon",       tag:"קרבון",     desc:"מרקם סיבי פחמן אלכסוני עם מסגרת עדינה מאוד",           C:D3 },
  { id:4,  name:"Neon Pulse",        tag:"ניאון",     desc:"מסגרת ניאון שמחליפה ציאן↔סגול בלופ רציף",             C:D4 },
  { id:5,  name:"Royal Navy",        tag:"נייבי",     desc:"כחול כהן עמוק עם קו כחול למעלה וזהב למטה",            C:D5 },
  { id:6,  name:"Gradient Border",   tag:"גרדיאנט",  desc:"מסגרת גרדיאנט סגול-ורוד-זהב ע\"י שכבת pseudo-border",  C:D6 },
  { id:7,  name:"Frosted Capsule",   tag:"קפסולה",   desc:"פינות עגולות מאוד עם זכוכית כבדה ופס אור עליון עז",   C:D7 },
  { id:8,  name:"Lava Edge",         tag:"לבה",      desc:"מסגרת אש כתום-אדום עם רקע כהה-אדום",                 C:D8 },
  { id:9,  name:"Stadium Night",     tag:"אצטדיון",  desc:"זרקור ספוטלייט מהתחתית, אפקט לילה של מגרש",           C:D9 },
  { id:10, name:"Holographic",       tag:"הולוגרפי", desc:"מסגרת קשת צבעים מסתובבת עם 6 צבעים",                  C:D10 },
  { id:11, name:"Emerald Premium",   tag:"ירוק",     desc:"ירוק עמוק עם ShineBorder ירוק ו-inner glow עדין",      C:D11 },
  { id:12, name:"Blueprint",         tag:"טכני",     desc:"רשת כחולה טכנית ברקע כמו שרטוט הנדסי",               C:D12 },
  { id:13, name:"Retro Scoreboard",  tag:"רטרו",     desc:"לוח תוצאות וינטג' עם מסגרת זהב כפולה וכותרת",        C:D13 },
  { id:14, name:"Tactical Board",    tag:"מגרש",     desc:"פסי דשא ירוקים עם מסגרת ירוקה, ישר מחדר ההלבשה",     C:D14 },
  { id:15, name:"Minimal White",     tag:"מינימל",   desc:"כרטיס בהיר לבן/אפור עם צלל עדין — Apple style",       C:D15 },
  { id:16, name:"Aurora Glow",       tag:"אורורה",   desc:"גרדיאנט רקע ומסגרת שמחליפים בין 3 צבעים לאט",        C:D16 },
  { id:17, name:"Newspaper",         tag:"עיתון",    desc:"סגנון עיתון וינטג' עם צל קשיח ומסגרת כפולה",          C:D17 },
  { id:18, name:"Rose Gold",         tag:"רוז גולד", desc:"מסגרת רוז גולד עדינה עם רקע כהה-ורדרד",              C:D18 },
  { id:19, name:"Ice Arctic",        tag:"קרח",      desc:"מסגרת קרח כחולה-לבנה עם גלואו קריר וצלל תכלת",       C:D19 },
  { id:20, name:"Double Border",     tag:"כפול",     desc:"שתי מסגרות מקוננות — שקופה בחוץ, כהה בפנים",         C:D20 },
];

const TAG_COLORS = {
  "זכוכית":"#94a3b8","זהב":"#fbbf24","קרבון":"#64748b","ניאון":"#22d3ee","נייבי":"#60a5fa",
  "גרדיאנט":"#a78bfa","קפסולה":"#f0abfc","לבה":"#f97316","אצטדיון":"#fde68a","הולוגרפי":"#e879f9",
  "ירוק":"#4ade80","טכני":"#38bdf8","רטרו":"#f59e0b","מגרש":"#86efac","מינימל":"#cbd5e1",
  "אורורה":"#c084fc","עיתון":"#a16207","רוז גולד":"#fda4af","קרח":"#7dd3fc","כפול":"#6b7280",
};

export default function AdminCardDesigns() {
  const [selected, setSelected] = useState(null);
  const bg = "bg-gradient-to-br from-slate-950 to-slate-900";

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🃏 עיצובי כרטיסיית משחק — 20 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">דגש על מסגרת וקונטיינר. לחץ על כרטיס לתצוגה מוגדלת.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {DESIGNS.map(({ id, name, tag, C: Comp }) => (
          <motion.div key={id}
            className={`rounded-2xl overflow-hidden cursor-pointer border transition-all duration-200 ${selected === id ? "border-indigo-500 ring-2 ring-indigo-500/30" : "border-slate-800 hover:border-slate-600"}`}
            style={{ background: "#080c1a" }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelected(id === selected ? null : id)}>

            <div className={`p-3 ${bg}`}>
              <Comp />
            </div>

            <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600 font-mono">#{id}</span>
                <span className="text-xs font-semibold text-white truncate">{name}</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${TAG_COLORS[tag]}15`, color: TAG_COLORS[tag], border: `1px solid ${TAG_COLORS[tag]}30` }}>
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
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              className="mt-6 rounded-2xl border border-indigo-500/30 p-6 flex gap-6 items-start flex-wrap"
              style={{ background: "rgba(8,12,26,0.98)", boxShadow: "0 0 40px rgba(99,102,241,0.1)" }}>
              <div className={`w-64 flex-shrink-0 rounded-2xl overflow-hidden p-3 ${bg}`}>
                <d.C />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-lg text-white">#{d.id} — {d.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: `${TAG_COLORS[d.tag]}15`, color: TAG_COLORS[d.tag] }}>{d.tag}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
                <button onClick={() => setSelected(null)} className="mt-4 text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
