import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const designs = [
  {
    id: 1,
    name: "Stadium Night",
    tag: "אווירה",
    desc: "רקע של אצטדיון לילי עם אורות ספוטלייט מתנועעים ופרטיקלים זוהרים",
    preview: StadiumNight,
  },
  {
    id: 2,
    name: "Neon Cyber",
    tag: "סייברפאנק",
    desc: "גבולות ניאון זוהרים, ריחוף אנרגטי, ויב פוטוריסטי",
    preview: NeonCyber,
  },
  {
    id: 3,
    name: "Fire vs Ice",
    tag: "דרמה",
    desc: "קבוצת בית = אש, קבוצת אורחים = קרח — גרדיאנט דינמי שמשתנה לפי הניחוש",
    preview: FireVsIce,
  },
  {
    id: 4,
    name: "Glassmorphism",
    tag: "מודרני",
    desc: "כרטיס זכוכית מטושטשת עם אפקט frosted glass ורקע גרדיאנטי",
    preview: Glassmorphism,
  },
  {
    id: 5,
    name: "VS Battle",
    tag: "אקשן",
    desc: "סגנון מסך VS של משחקי לחימה — בזק, אנרגיה, ועוצמה",
    preview: VSBattle,
  },
  {
    id: 6,
    name: "Holographic",
    tag: "עתיד",
    desc: "שימר הולוגרפי קשתי שמשתנה עם תנועת עכבר",
    preview: Holographic,
  },
  {
    id: 7,
    name: "Minimal Clean",
    tag: "מינימל",
    desc: "נקי, לבן, Apple-style — רק מה שצריך, בלי רעש",
    preview: MinimalClean,
  },
  {
    id: 8,
    name: "Tactical Board",
    tag: "כדורגל",
    desc: "לוח טקטי ירוק עם קווים לבנים — ישר מחדר ההלבשה",
    preview: TacticalBoard,
  },
  {
    id: 9,
    name: "Aurora",
    tag: "שמיים",
    desc: "אורות צפון מתנועעים ברקע עם צבעים שמשתנים בהדרגה",
    preview: Aurora,
  },
  {
    id: 10,
    name: "Heartbeat Pulse",
    tag: "מתח",
    desc: "קו דופק חי בין שתי הקבוצות — אנימציה של מתח ורגש",
    preview: HeartbeatPulse,
  },
  {
    id: 11,
    name: "Trophy Gold",
    tag: "ניצחון",
    desc: "ערכת צבעים זהובה מלכותית עם ניצוצות ואפקטי זהב",
    preview: TrophyGold,
  },
  {
    id: 12,
    name: "Retro Classic",
    desc: "סגנון לוח תוצאות וינטג' של אצטדיון ישן עם טיפוגרפיה רטרו",
    tag: "נוסטלגיה",
    preview: RetroClassic,
  },
  {
    id: 13,
    name: "Particle Storm",
    tag: "אנרגיה",
    desc: "פרטיקלים מתפוצצים בכל שינוי ניחוש — חגיגה ויזואלית",
    preview: ParticleStorm,
  },
  {
    id: 14,
    name: "Dark Gradient",
    tag: "פרימיום",
    desc: "גרדיאנט כהה עשיר עם border זוהר עדין וצלליות עמוקות",
    preview: DarkGradient,
  },
  {
    id: 15,
    name: "Split Universe",
    tag: "יצירתי",
    desc: "הכרטיס מחולק לשניים — כל חצי בצבע, טקסטורה וסגנון של הקבוצה שלו",
    preview: SplitUniverse,
  },
];

function PreviewShell({ children, bg = "bg-slate-900" }) {
  return (
    <div className={`w-full h-full flex items-center justify-center p-3 ${bg} rounded-lg overflow-hidden`}>
      {children}
    </div>
  );
}

function MiniCard({ children, className = "" }) {
  return (
    <div className={`w-full rounded-xl p-3 flex flex-col items-center gap-2 text-xs ${className}`}>
      {children}
    </div>
  );
}

function Teams({ home = "🇰🇷", away = "🇨🇿", score = "1 - 1", className = "" }) {
  return (
    <div className={`flex items-center justify-between w-full px-1 ${className}`}>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl">{home}</span>
        <span className="text-[9px] opacity-70">Korea</span>
      </div>
      <div className="font-bold text-sm">{score}</div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xl">{away}</span>
        <span className="text-[9px] opacity-70">Czechia</span>
      </div>
    </div>
  );
}

// ── 1. Stadium Night ──────────────────────────────────────────────────────────
function StadiumNight() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 80); return () => clearInterval(t); }, []);
  const particles = [0,1,2,3,4,5];
  return (
    <PreviewShell bg="bg-black">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
        {/* spotlight beams */}
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 20% 110%, rgba(255,220,80,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 110%, rgba(255,220,80,0.15) 0%, transparent 60%), linear-gradient(180deg, #000 0%, #0a1628 100%)"}}>
        </div>
        {/* particles */}
        {particles.map(i => (
          <motion.div key={i} className="absolute w-0.5 h-0.5 rounded-full bg-yellow-300/60"
            animate={{ y: [0, -60 - i*10], x: [Math.sin(i)*20, Math.cos(i)*30], opacity: [0, 1, 0] }}
            transition={{ duration: 2 + i*0.4, repeat: Infinity, delay: i*0.3 }}
            style={{ left: `${20 + i * 12}%`, bottom: "10%" }}
          />
        ))}
        <MiniCard className="relative z-10 text-white">
          <div className="text-[9px] text-yellow-400 font-bold tracking-widest">⚽ GROUP A</div>
          <Teams className="text-white" />
          <div className="text-[8px] text-yellow-300/70">📍 Guadalajara Stadium</div>
        </MiniCard>
      </div>
    </PreviewShell>
  );
}

// ── 2. Neon Cyber ─────────────────────────────────────────────────────────────
function NeonCyber() {
  return (
    <PreviewShell bg="bg-black">
      <motion.div className="w-full rounded-xl p-3 text-white flex flex-col items-center gap-2"
        style={{ border: "1px solid #00fff0", boxShadow: "0 0 15px #00fff0, inset 0 0 15px rgba(0,255,240,0.05)", background: "rgba(0,10,20,0.95)" }}
        animate={{ boxShadow: ["0 0 10px #00fff0", "0 0 25px #00fff0, 0 0 50px #00f0ff40", "0 0 10px #00fff0"] }}
        transition={{ duration: 2, repeat: Infinity }}>
        <div className="text-[9px] tracking-widest" style={{ color: "#00fff0", textShadow: "0 0 10px #00fff0" }}>◈ MATCH PREDICTION ◈</div>
        <Teams />
        <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #00fff0, transparent)" }} />
        <div className="text-[8px]" style={{ color: "#00fff080" }}>12/06/2026 · 05:00</div>
      </motion.div>
    </PreviewShell>
  );
}

// ── 3. Fire vs Ice ────────────────────────────────────────────────────────────
function FireVsIce() {
  return (
    <PreviewShell bg="bg-slate-900">
      <div className="w-full rounded-xl overflow-hidden flex flex-col">
        <div className="flex h-16">
          <motion.div className="flex-1 flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(135deg, #ff4500, #ff8c00, #ffd700)" }}
            animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <span className="text-2xl">🇰🇷</span>
            <span className="text-[8px] text-white font-bold">FIRE</span>
          </motion.div>
          <div className="w-10 flex items-center justify-center bg-black text-white font-bold text-xs z-10">1-1</div>
          <motion.div className="flex-1 flex flex-col items-center justify-center"
            style={{ background: "linear-gradient(225deg, #00c6ff, #0072ff, #005bb5)" }}
            animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}>
            <span className="text-2xl">🇨🇿</span>
            <span className="text-[8px] text-white font-bold">ICE</span>
          </motion.div>
        </div>
        <div className="bg-black/80 text-center text-[8px] text-slate-400 py-1.5">⚽ Guadalajara · Group A</div>
      </div>
    </PreviewShell>
  );
}

// ── 4. Glassmorphism ──────────────────────────────────────────────────────────
function Glassmorphism() {
  return (
    <PreviewShell bg="bg-transparent">
      <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
        <div className="absolute inset-0">
          <div className="absolute w-16 h-16 rounded-full bg-white/20 top-1 left-2 blur-md" />
          <div className="absolute w-10 h-10 rounded-full bg-pink-300/30 bottom-2 right-3 blur-sm" />
        </div>
        <div className="relative w-[90%] rounded-xl p-3 flex flex-col items-center gap-2"
          style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)" }}>
          <div className="text-[9px] text-white/80 font-semibold tracking-wide">Group A</div>
          <Teams className="text-white" />
          <div className="text-[8px] text-white/60">12/06/2026</div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── 5. VS Battle ──────────────────────────────────────────────────────────────
function VSBattle() {
  return (
    <PreviewShell bg="bg-black">
      <div className="w-full rounded-xl overflow-hidden">
        <div className="relative flex items-center justify-between px-3 py-2"
          style={{ background: "linear-gradient(90deg, #1a0000 0%, #000 50%, #00001a 100%)" }}>
          <motion.div className="flex flex-col items-center gap-1"
            animate={{ x: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
            <span className="text-2xl">🇰🇷</span>
            <span className="text-[8px] text-red-400 font-black">KOREA</span>
          </motion.div>
          <div className="flex flex-col items-center">
            <motion.div className="text-sm font-black text-yellow-400"
              animate={{ scale: [1, 1.15, 1], textShadow: ["0 0 5px #ffd700", "0 0 20px #ffd700", "0 0 5px #ffd700"] }}
              transition={{ duration: 0.8, repeat: Infinity }}>VS</motion.div>
            <div className="text-[9px] text-white/50">1 - 1</div>
          </div>
          <motion.div className="flex flex-col items-center gap-1"
            animate={{ x: [0, -1, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}>
            <span className="text-2xl">🇨🇿</span>
            <span className="text-[8px] text-blue-400 font-black">CZECHIA</span>
          </motion.div>
          {/* lightning divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: "linear-gradient(180deg, transparent, #ffd70080, transparent)" }} />
        </div>
        <div className="bg-slate-900 text-center text-[8px] text-slate-500 py-1">⚽ Group A · Guadalajara</div>
      </div>
    </PreviewShell>
  );
}

// ── 6. Holographic ───────────────────────────────────────────────────────────
function Holographic() {
  const [hue, setHue] = useState(0);
  useEffect(() => { const t = setInterval(() => setHue(h => (h + 2) % 360), 50); return () => clearInterval(t); }, []);
  return (
    <PreviewShell bg="bg-slate-950">
      <motion.div className="w-full rounded-xl p-3 flex flex-col items-center gap-2 text-white"
        style={{
          background: `linear-gradient(135deg, hsl(${hue},80%,15%), hsl(${(hue+60)%360},80%,10%))`,
          border: `1px solid hsl(${hue},100%,60%)`,
          boxShadow: `0 0 20px hsl(${hue},100%,40%)40`,
        }}>
        <div className="text-[9px] font-bold tracking-widest" style={{ color: `hsl(${hue},100%,70%)` }}>◈ HOLOGRAPHIC ◈</div>
        <Teams />
        <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${hue},100%,60%), transparent)` }} />
        <div className="text-[8px] opacity-60">Group A · 12/06/2026</div>
      </motion.div>
    </PreviewShell>
  );
}

// ── 7. Minimal Clean ─────────────────────────────────────────────────────────
function MinimalClean() {
  return (
    <PreviewShell bg="bg-gray-50">
      <div className="w-full rounded-2xl p-3 bg-white flex flex-col items-center gap-2 text-gray-800"
        style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
        <div className="text-[8px] text-gray-400 font-medium tracking-widest uppercase">Group A</div>
        <div className="flex items-center justify-between w-full px-1">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl">🇰🇷</span>
            <span className="text-[9px] text-gray-500">Korea</span>
          </div>
          <div className="text-center">
            <div className="text-lg font-thin text-gray-800 tracking-wider">1 — 1</div>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-2xl">🇨🇿</span>
            <span className="text-[9px] text-gray-500">Czechia</span>
          </div>
        </div>
        <div className="w-8 h-px bg-gray-200" />
        <div className="text-[8px] text-gray-400">12 Jun 2026 · 05:00</div>
      </div>
    </PreviewShell>
  );
}

// ── 8. Tactical Board ────────────────────────────────────────────────────────
function TacticalBoard() {
  return (
    <PreviewShell bg="bg-green-900">
      <div className="w-full rounded-xl overflow-hidden"
        style={{ background: "repeating-linear-gradient(90deg, #166534 0px, #166534 18px, #15803d 18px, #15803d 36px)" }}>
        <div className="p-3 flex flex-col items-center gap-2">
          <div className="text-[9px] text-white/70 font-mono tracking-widest">⬡ TACTICAL BOARD</div>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col items-center">
              <span className="text-xl">🇰🇷</span>
              <span className="text-[8px] text-white font-mono">KOR</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-xs font-black text-white font-mono bg-black/40 px-2 py-0.5 rounded border border-white/20">1 : 1</div>
              <div className="text-[7px] text-white/50 font-mono mt-0.5">GROUP A</div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl">🇨🇿</span>
              <span className="text-[8px] text-white font-mono">CZE</span>
            </div>
          </div>
          <div className="w-full h-px border-t border-dashed border-white/20" />
          <div className="text-[7px] text-white/40 font-mono">GUADALAJARA · 12.06.2026</div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── 9. Aurora ────────────────────────────────────────────────────────────────
function Aurora() {
  return (
    <PreviewShell bg="bg-slate-950">
      <div className="relative w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse at 30% 50%, rgba(0,255,150,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(100,0,255,0.3) 0%, transparent 60%), #020817",
            "radial-gradient(ellipse at 60% 30%, rgba(0,200,255,0.3) 0%, transparent 60%), radial-gradient(ellipse at 40% 70%, rgba(255,0,150,0.2) 0%, transparent 60%), #020817",
            "radial-gradient(ellipse at 30% 50%, rgba(0,255,150,0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(100,0,255,0.3) 0%, transparent 60%), #020817",
          ]}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 w-[90%] text-white flex flex-col items-center gap-2">
          <div className="text-[9px] text-emerald-300/80 tracking-widest">✦ GROUP A ✦</div>
          <Teams />
          <div className="text-[8px] text-purple-300/60">Guadalajara · 12/06/2026</div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── 10. Heartbeat Pulse ──────────────────────────────────────────────────────
function HeartbeatPulse() {
  return (
    <PreviewShell bg="bg-slate-950">
      <div className="w-full rounded-xl p-3 flex flex-col items-center gap-2 text-white"
        style={{ background: "linear-gradient(135deg, #1a001a, #0a0a2a)" }}>
        <div className="text-[9px] text-pink-400 tracking-widest">♥ PULSE PREDICTION</div>
        <Teams />
        {/* heartbeat line */}
        <svg viewBox="0 0 120 24" className="w-full h-5">
          <motion.polyline points="0,12 20,12 28,4 36,20 44,12 52,12 60,2 68,22 76,12 84,12 104,12 120,12"
            fill="none" stroke="#ec4899" strokeWidth="1.5"
            strokeDasharray="200" strokeDashoffset="200"
            animate={{ strokeDashoffset: [200, 0, -200] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </svg>
        <div className="text-[8px] text-pink-300/50">12/06/2026 · 05:00</div>
      </div>
    </PreviewShell>
  );
}

// ── 11. Trophy Gold ──────────────────────────────────────────────────────────
function TrophyGold() {
  const sparks = [0,1,2,3];
  return (
    <PreviewShell bg="bg-amber-950">
      <div className="relative w-full rounded-xl overflow-hidden">
        <div className="p-3 flex flex-col items-center gap-2"
          style={{ background: "linear-gradient(135deg, #78350f, #451a03)", border: "1px solid #d97706" }}>
          {sparks.map(i => (
            <motion.div key={i} className="absolute text-xs pointer-events-none"
              animate={{ y: [0, -30], opacity: [1, 0], x: [0, (i%2===0?1:-1)*15] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i*0.4 }}
              style={{ left: `${20+i*20}%`, bottom: "10%" }}>✦</motion.div>
          ))}
          <div className="text-[9px] font-bold tracking-widest text-amber-300">🏆 GROUP A</div>
          <Teams className="text-amber-100" />
          <div className="w-full h-px" style={{ background: "linear-gradient(90deg, transparent, #d97706, transparent)" }} />
          <div className="text-[8px] text-amber-500/70">Guadalajara · 12/06/2026</div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── 12. Retro Classic ────────────────────────────────────────────────────────
function RetroClassic() {
  return (
    <PreviewShell bg="bg-amber-50">
      <div className="w-full rounded border-2 border-amber-900 overflow-hidden"
        style={{ fontFamily: "'Courier New', monospace", background: "#fef3c7" }}>
        <div className="bg-amber-900 text-amber-100 text-center py-0.5 text-[8px] font-bold tracking-widest">
          ══ WORLD CUP 2026 ══
        </div>
        <div className="p-2 flex flex-col items-center gap-1">
          <div className="text-[8px] text-amber-800 font-bold">GROUP A · MATCH 17</div>
          <div className="flex items-center justify-between w-full text-[9px] text-amber-900 font-bold">
            <div className="text-center"><div>🇰🇷</div><div>KOREA</div></div>
            <div className="text-base font-black border border-amber-800 px-2">1-1</div>
            <div className="text-center"><div>🇨🇿</div><div>CZECHIA</div></div>
          </div>
          <div className="text-[7px] text-amber-700 border-t border-amber-300 w-full text-center pt-1">
            12 JUNE 2026 · GUADALAJARA
          </div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── 13. Particle Storm ───────────────────────────────────────────────────────
function ParticleStorm() {
  const dots = Array.from({length:12}, (_,i) => i);
  return (
    <PreviewShell bg="bg-slate-950">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl">
        {dots.map(i => (
          <motion.div key={i} className="absolute w-1 h-1 rounded-full"
            style={{ background: `hsl(${i*30},100%,60%)` }}
            animate={{
              x: [0, (Math.cos(i*30*Math.PI/180))*40],
              y: [0, (Math.sin(i*30*Math.PI/180))*40],
              opacity: [0, 1, 0], scale: [0, 1.5, 0]
            }}
            transition={{ duration: 1.8, repeat: Infinity, delay: (i%4)*0.4, ease: "easeOut" }}
          />
        ))}
        <div className="relative z-10 flex flex-col items-center gap-2 text-white">
          <div className="text-[9px] text-white/60 tracking-widest">PARTICLE STORM</div>
          <Teams />
          <div className="text-[8px] text-white/40">Group A</div>
        </div>
      </div>
    </PreviewShell>
  );
}

// ── 14. Dark Gradient ────────────────────────────────────────────────────────
function DarkGradient() {
  return (
    <PreviewShell bg="bg-slate-950">
      <motion.div className="w-full rounded-xl p-3 flex flex-col items-center gap-2 text-white"
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
        }}
        whileHover={{ boxShadow: "0 8px 40px rgba(120,80,255,0.4), inset 0 1px 0 rgba(255,255,255,0.1)" }}
        transition={{ duration: 0.3 }}>
        <div className="text-[9px] text-purple-400/80 tracking-widest font-medium">GROUP A</div>
        <Teams />
        <div className="w-full h-px bg-white/5" />
        <div className="text-[8px] text-white/30">Guadalajara · 12/06/2026</div>
      </motion.div>
    </PreviewShell>
  );
}

// ── 15. Split Universe ───────────────────────────────────────────────────────
function SplitUniverse() {
  return (
    <PreviewShell bg="bg-slate-900">
      <div className="w-full rounded-xl overflow-hidden flex flex-col text-white">
        <div className="flex h-20 relative">
          <div className="flex-1 flex flex-col items-center justify-center gap-1"
            style={{ background: "linear-gradient(135deg, #c0392b, #8e44ad)" }}>
            <span className="text-2xl">🇰🇷</span>
            <span className="text-[8px] font-bold">KOREA</span>
            <span className="text-xs font-black">1</span>
          </div>
          {/* diagonal divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 flex items-center justify-center z-10"
            style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)" }}>
            <div className="text-[8px] font-black bg-white text-slate-900 rounded-full w-5 h-5 flex items-center justify-center text-[7px]">VS</div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-1"
            style={{ background: "linear-gradient(225deg, #2980b9, #1a5276)" }}>
            <span className="text-2xl">🇨🇿</span>
            <span className="text-[8px] font-bold">CZECHIA</span>
            <span className="text-xs font-black">1</span>
          </div>
        </div>
        <div className="bg-black/60 text-center text-[7px] text-slate-400 py-1">⚽ Group A · Guadalajara · 12/06</div>
      </div>
    </PreviewShell>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminPredictionDesigns() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="text-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">🎨 רעיונות עיצוב — כרטיס ניחוש</h2>
        <p className="text-slate-400 mt-1 text-sm">15 קונספטים ויזואליים לבחירה. לחץ על כרטיס לפרטים נוספים.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {designs.map((d) => {
          const Preview = d.preview;
          return (
            <motion.div key={d.id}
              className={`rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${
                selected?.id === d.id
                  ? "border-blue-500 ring-2 ring-blue-500/40"
                  : "border-slate-700 hover:border-slate-500"
              }`}
              style={{ background: "#1e293b" }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(selected?.id === d.id ? null : d)}>
              {/* Preview area */}
              <div className="h-36 relative">
                <Preview />
                <div className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[8px] text-white/70 font-medium">
                  #{d.id}
                </div>
                <div className="absolute top-1.5 right-1.5 bg-blue-600/70 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[8px] text-white font-medium">
                  {d.tag}
                </div>
              </div>
              {/* Label */}
              <div className="px-2.5 py-2 border-t border-slate-700">
                <div className="text-xs font-semibold text-white truncate">{d.name}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 rounded-xl border border-blue-500/40 p-5 flex gap-5 items-start"
            style={{ background: "rgba(30,41,59,0.95)", boxShadow: "0 0 30px rgba(59,130,246,0.15)" }}>
            <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
              {React.createElement(selected.preview)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-white">#{selected.id} — {selected.name}</span>
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{selected.tag}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{selected.desc}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors">
                ✕ סגור
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
