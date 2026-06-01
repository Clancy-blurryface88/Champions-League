import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShineBorder } from "@/components/magicui/shine-border";

function MiniCard({ border, children, className = "" }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`} style={border}>
      {children}
      <div className="p-3 flex flex-col gap-2">
        {/* countdown */}
        <div className="flex justify-center">
          <div className="rounded-xl px-3 py-1 flex gap-2" style={{ background: "rgba(26,54,45,0.8)", border: "1px solid rgba(74,222,128,0.2)" }}>
            {[["10","ימים"],["6","שעות"],["0","דקות"]].map(([n,l]) => (
              <div key={l} className="flex flex-col items-center">
                <span className="text-xs font-bold text-emerald-400 leading-none">{n}</span>
                <span className="text-[8px] text-emerald-700">{l}</span>
              </div>
            ))}
          </div>
        </div>
        {/* group */}
        <div className="flex justify-center">
          <span className="text-[9px] text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-0.5 rounded-full">Group A</span>
        </div>
        <div className="border-t border-white/8" />
        {/* teams */}
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col items-center gap-0.5 flex-1">
            <span className="fi fi-kr fis rounded" style={{ width:32,height:32,fontSize:32,display:"inline-block",backgroundSize:"cover" }} />
            <span className="text-[8px] text-white font-semibold">Korea</span>
            <span className="text-[7px] text-slate-500">(Home)</span>
          </div>
          <div className="flex items-center gap-1">
            {[1,1].map((v,i) => (
              <div key={i} className="w-6 h-8 rounded flex items-center justify-center text-white font-bold text-sm" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>{v}</div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-0.5 flex-1">
            <span className="fi fi-cz fis rounded" style={{ width:32,height:32,fontSize:32,display:"inline-block",backgroundSize:"cover" }} />
            <span className="text-[8px] text-white font-semibold">Czechia</span>
            <span className="text-[7px] text-slate-500">(Away)</span>
          </div>
        </div>
        <div className="text-center text-[7px] text-slate-600">📅 12/06/2026 · Guadalajara</div>
      </div>
    </div>
  );
}

// helper to hex→rgba
const hr = (hex, a) => {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

const BASE = { background:"radial-gradient(ellipse at 50% 120%,rgba(255,220,80,0.1) 0%,transparent 60%),linear-gradient(180deg,rgba(0,0,0,0.95),rgba(5,10,20,0.98))" };

// ── 20 border designs ─────────────────────────────────────────────────────────

const BORDERS = [
  {
    id:1, name:"Matte Gold (נוכחי)", tag:"זהב מט",
    desc:"זהב מעומעם ודק — 1px, opacity נמוך, בלי זוהר. עדין ומלוכנותי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(184,148,50,0.38)" }} />
    )
  },
  {
    id:2, name:"Bright Gold", tag:"זהב בהיר",
    desc:"זהב מלא עם גלואו חיצוני — יותר דרמטי ובולט.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(255,215,0,0.75)", boxShadow:"0 0 14px rgba(255,215,0,0.2)" }} />
    )
  },
  {
    id:3, name:"ShineBorder Gold", tag:"שיין זהב",
    desc:"נקודת זוהר זהובה שרצה סביב המסגרת לאורך זמן.",
    render: () => (
      <div className="relative rounded-2xl overflow-hidden" style={BASE}>
        <ShineBorder borderRadius={16} borderWidth={1} duration={10} shineColor={["#b8860b","#ffd700","#fffacd","#ffd700","#b8860b"]} />
        <MiniCard border={{}} className="border-0 outline-none" />
      </div>
    )
  },
  {
    id:4, name:"Silver Chrome", tag:"כסף",
    desc:"כסף מבריק עדין — מודרני ונקי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(192,200,210,0.4)" }} />
    )
  },
  {
    id:5, name:"Rose Gold", tag:"רוז גולד",
    desc:"זהב ורדרד — עדין ויוקרתי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(183,110,121,0.55)" }} />
    )
  },
  {
    id:6, name:"Copper", tag:"נחושת",
    desc:"נחושת חמה — גוון חום-כתום עם תחושת מתכת.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(184,115,51,0.55)" }} />
    )
  },
  {
    id:7, name:"Neon Cyan", tag:"ניאון",
    desc:"ניאון ציאן עם גלואו — אנרגטי וטכנולוגי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1.5px solid rgba(0,240,255,0.65)", boxShadow:"0 0 12px rgba(0,240,255,0.18)" }} />
    )
  },
  {
    id:8, name:"Emerald", tag:"ירוק",
    desc:"ירוק אמרלד עדין — רענן ואיכותי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(52,211,153,0.5)" }} />
    )
  },
  {
    id:9, name:"Amethyst", tag:"סגול",
    desc:"סגול אמתיסט — מיסטי ומרשים.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(167,139,250,0.5)" }} />
    )
  },
  {
    id:10, name:"Ice Blue", tag:"קרח",
    desc:"כחול קרח עדין — קריר ומינימלי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(147,197,253,0.4)" }} />
    )
  },
  {
    id:11, name:"Double Gold", tag:"כפול",
    desc:"שני קווי זהב מקוננים — הפנימי דק, החיצוני עדין.",
    render: () => (
      <div className="p-[2px] rounded-2xl" style={{ background:"rgba(184,148,50,0.35)" }}>
        <div className="p-[1px] rounded-[14px]" style={{ background:"rgba(184,148,50,0.18)" }}>
          <MiniCard border={{ ...BASE, borderRadius:12 }} className="!rounded-xl" />
        </div>
      </div>
    )
  },
  {
    id:12, name:"Gradient Border", tag:"גרדיאנט",
    desc:"מסגרת גרדיאנט ורוד-סגול-זהב — ססגונית.",
    render: () => (
      <div className="p-[1.5px] rounded-2xl" style={{ background:"linear-gradient(135deg,#c084fc,#f9a8d4,#fbbf24)" }}>
        <MiniCard border={{ ...BASE, borderRadius:14 }} className="!rounded-[14px]" />
      </div>
    )
  },
  {
    id:13, name:"Glow Only", tag:"זוהר בלבד",
    desc:"ללא מסגרת גלויה — רק boxShadow זהוב חיצוני.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"none", boxShadow:"0 0 0 1px rgba(184,148,50,0.2), 0 0 20px rgba(184,148,50,0.12)" }} />
    )
  },
  {
    id:14, name:"Pulsing Gold", tag:"פולס",
    desc:"קו זהב שמתחזק ונחלש בלופ — חי ונושם.",
    render: () => (
      <motion.div className="rounded-2xl overflow-hidden" style={BASE}
        animate={{ boxShadow:["0 0 0 1px rgba(184,148,50,0.2)","0 0 0 1px rgba(184,148,50,0.7), 0 0 12px rgba(184,148,50,0.2)","0 0 0 1px rgba(184,148,50,0.2)"] }}
        transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}>
        <MiniCard border={{}} />
      </motion.div>
    )
  },
  {
    id:15, name:"Aurora Border", tag:"אורורה",
    desc:"מסגרת שמחליפה צבעים בין סגול, ורוד וציאן.",
    render: () => (
      <motion.div className="rounded-2xl overflow-hidden" style={BASE}
        animate={{ boxShadow:["0 0 0 1px rgba(99,102,241,0.6)","0 0 0 1px rgba(236,72,153,0.6)","0 0 0 1px rgba(6,182,212,0.6)","0 0 0 1px rgba(99,102,241,0.6)"] }}
        transition={{ duration:4, repeat:Infinity, ease:"linear" }}>
        <MiniCard border={{}} />
      </motion.div>
    )
  },
  {
    id:16, name:"ShineBorder White", tag:"שיין לבן",
    desc:"נקודת אור לבנה-כחלחלה שרצה — זכוכית מלוטשת.",
    render: () => (
      <div className="relative rounded-2xl overflow-hidden" style={BASE}>
        <ShineBorder borderRadius={16} borderWidth={1} duration={12} shineColor={["rgba(255,255,255,0.9)","rgba(200,220,255,0.7)","rgba(255,255,255,1)"]} />
        <MiniCard border={{}} />
      </div>
    )
  },
  {
    id:17, name:"Dashed Gold", tag:"מקווקו",
    desc:"קו מקווקו זהוב — יוצא דופן ומעניין.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1.5px dashed rgba(184,148,50,0.45)" }} />
    )
  },
  {
    id:18, name:"Top Line Only", tag:"קו עליון",
    desc:"רק קו זהוב בראש הכרטיס — מינימליסטי מאוד.",
    render: () => (
      <div className="relative rounded-2xl overflow-hidden" style={BASE}>
        <div className="absolute top-0 inset-x-0 h-[1.5px]" style={{ background:"linear-gradient(90deg,transparent,rgba(184,148,50,0.7),transparent)" }} />
        <MiniCard border={{}} />
      </div>
    )
  },
  {
    id:19, name:"Warm Bronze Glow", tag:"ברונזה",
    desc:"ברונזה חמה עם גלואו רחב ועדין — עמוק ויוקרתי.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"1px solid rgba(205,133,63,0.5)", boxShadow:"0 0 24px rgba(205,133,63,0.12), 0 8px 32px rgba(0,0,0,0.5)" }} />
    )
  },
  {
    id:20, name:"No Border", tag:"ללא",
    desc:"ללא מסגרת כלל — הכרטיס צף בחלל האפל.",
    render: () => (
      <MiniCard border={{ ...BASE, outline:"none", boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }} />
    )
  },
];

const TAG_COLORS = {
  "זהב מט":"#b89432","זהב בהיר":"#ffd700","שיין זהב":"#fbbf24","כסף":"#cbd5e1",
  "רוז גולד":"#fda4af","נחושת":"#b87333","ניאון":"#22d3ee","ירוק":"#4ade80",
  "סגול":"#a78bfa","קרח":"#7dd3fc","כפול":"#fde68a","גרדיאנט":"#c084fc",
  "זוהר בלבד":"#fbbf24","פולס":"#f59e0b","אורורה":"#818cf8","שיין לבן":"#e2e8f0",
  "מקווקו":"#d4a017","קו עליון":"#b8860b","ברונזה":"#cd853f","ללא":"#475569",
};

export default function AdminBorderDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">🖼️ אפקטי מסגרת — 20 קונספטים</h2>
        <p className="text-slate-400 mt-1 text-sm">כרטיס משחק מלא עם 20 סגנונות מסגרת שונים. לחץ לפרטים.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {BORDERS.map(({ id, name, tag, render }) => (
          <motion.div key={id}
            className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${selected===id?"ring-2 ring-indigo-500":"hover:ring-1 hover:ring-slate-600"}`}
            style={{ background:"#080c1a" }}
            whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
            onClick={() => setSelected(id===selected?null:id)}>
            <div className="p-2.5" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)" }}>
              {render()}
            </div>
            <div className="px-2.5 py-2 flex items-center justify-between gap-1 border-t border-slate-800/80">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[9px] text-slate-600 font-mono flex-shrink-0">#{id}</span>
                <span className="text-[10px] font-semibold text-white truncate">{name}</span>
              </div>
              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background:`${TAG_COLORS[tag]}15`, color:TAG_COLORS[tag], border:`1px solid ${TAG_COLORS[tag]}30` }}>
                {tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (() => {
          const b = BORDERS.find(x=>x.id===selected);
          if (!b) return null;
          return (
            <motion.div key={selected}
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
              className="mt-5 rounded-2xl border border-indigo-500/30 p-5 flex gap-6 items-center flex-wrap"
              style={{ background:"rgba(8,12,26,0.98)", boxShadow:"0 0 30px rgba(99,102,241,0.1)" }}>
              <div className="w-44 flex-shrink-0" style={{ background:"linear-gradient(135deg,#0d1220,#0a0f1a)", padding:10, borderRadius:16 }}>
                {b.render()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-white">#{b.id} — {b.name}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background:`${TAG_COLORS[b.tag]}15`, color:TAG_COLORS[b.tag] }}>{b.tag}</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                <button onClick={() => setSelected(null)} className="mt-3 text-xs text-slate-600 hover:text-slate-300 transition-colors">✕ סגור</button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
