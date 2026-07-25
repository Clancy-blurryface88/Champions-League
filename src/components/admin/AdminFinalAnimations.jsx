import React from "react";

// Demo-only gallery: 25 animation treatments layered on TOP of the existing
// RoundCard look (same h-16 w-60 card, trophy image, gold shimmer text) —
// exploring motion for the Final round, not a redesign of the card itself.
// Nothing here is wired to real data or to the production RoundsMarquee.

const SharedStyles = () => (
  <style>{`
    @keyframes fa-shimmer-text { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes fa-confetti-fall { 0% { transform: translateY(-16px) rotate(0deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(90px) rotate(380deg); opacity: 0; } }
    @keyframes fa-twinkle { 0%, 100% { opacity: .15; transform: scale(.6); } 50% { opacity: 1; transform: scale(1.25); } }
    @keyframes fa-ring { 0% { transform: scale(0.6); opacity: .8; } 100% { transform: scale(2); opacity: 0; } }
    @keyframes fa-glow-breathe { 0%, 100% { box-shadow: 0 0 6px 0px rgba(9, 122, 220,0.35), inset 0 1px 0 rgba(255,255,255,0.12); } 50% { box-shadow: 0 0 22px 4px rgba(9, 122, 220,0.75), inset 0 1px 0 rgba(255,255,255,0.12); } }
    @keyframes fa-spin { to { transform: rotate(360deg); } }
    @keyframes fa-spin-rev { to { transform: rotate(-360deg); } }
    @keyframes fa-bokeh-float { 0% { transform: translateY(0) translateX(0); opacity: 0; } 15% { opacity: .8; } 100% { transform: translateY(-70px) translateX(6px); opacity: 0; } }
    @keyframes fa-bounce { 0%, 100% { transform: translateY(0) scale(1); } 30% { transform: translateY(-6px) scale(1.05); } 50% { transform: translateY(0) scale(0.98); } 70% { transform: translateY(-2px) scale(1.02); } }
    @keyframes fa-border-chase { to { background-position: 200% 0; } }
    @keyframes fa-ripple { 0% { transform: scale(0.85); opacity: .6; } 100% { transform: scale(1.6); opacity: 0; } }
    @keyframes fa-firefly { 0% { transform: translate(0,0); opacity: 0; } 20% { opacity: 1; } 50% { transform: translate(14px,-10px); } 80% { opacity: .8; } 100% { transform: translate(-6px,-18px); opacity: 0; } }
    @keyframes fa-ribbon-wave { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
    @keyframes fa-tada { 0% { transform: scale(1) rotate(0); } 10%, 20% { transform: scale(0.94) rotate(-2deg); } 30%, 50%, 70% { transform: scale(1.08) rotate(2deg); } 40%, 60% { transform: scale(1.08) rotate(-2deg); } 100% { transform: scale(1) rotate(0); } }
    @keyframes fa-dust-drift { 0% { background-position: 0 0; } 100% { background-position: 160px 80px; } }
    @keyframes fa-flicker { 0%, 19%, 21%, 23%, 56%, 100% { opacity: 1; } 20%, 22%, 55% { opacity: .45; } }
    @keyframes fa-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
    @keyframes fa-bubble-rise { 0% { transform: translateY(0) scale(0.6); opacity: 0; } 20% { opacity: .9; } 100% { transform: translateY(-64px) scale(1); opacity: 0; } }
    @keyframes fa-spark-orbit { to { transform: rotate(360deg); } }
    .fa-font-out { font-family: 'Outfit', sans-serif; }
  `}</style>
);

function Frame({ n, title, tag, children }) {
  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-sky-400/90 tracking-wide">#{String(n).padStart(2, "0")}</span>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="text-[11px] text-slate-500">{tag}</p>
        </div>
      </div>
      <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[#040a14]" style={{ minHeight: 130 }}>
        {children}
      </div>
    </div>
  );
}

// The actual production card look (h-16 w-60), reused as-is in every demo —
// only the animated layer wrapped around/inside it changes.
function BaseCard({ children, cardStyle, textClass = "" }) {
  return (
    <div className="relative h-16 w-60 rounded-2xl flex items-center justify-center gap-4 overflow-visible"
      style={{
        background: "linear-gradient(135deg, rgba(8,22,42,0.55) 0%, rgba(3,10,20,0.45) 100%)",
        border: "1px solid rgba(9, 122, 220,0.28)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.35)",
        ...cardStyle,
      }}
    >
      {children}
      <div className="flex-shrink-0 relative z-10">
        <img src="/champions/ch-trophy.png" className="h-9 w-auto object-contain" />
      </div>
      <div className="text-center relative z-10">
        <h3 className={`fa-font-out font-semibold text-base tracking-wide ${textClass}`} style={{ color: textClass ? undefined : "#fff" }}>גמר</h3>
      </div>
    </div>
  );
}

const ShimmerText = () => (
  <h3
    className="fa-font-out font-semibold text-base tracking-wide relative z-10"
    style={{ backgroundImage: "linear-gradient(90deg,#097adc,#fff,#097adc,#fff,#097adc)", backgroundSize: "300% 100%", WebkitBackgroundClip: "text", color: "transparent", animation: "fa-shimmer-text 3s linear infinite" }}
  >
    גמר
  </h3>
);

/* 1 — Baseline reference, current production animation */
const A1_ShimmerBaseline = () => (
  <div className="relative h-16 w-60 rounded-2xl flex items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, rgba(8,22,42,0.55) 0%, rgba(3,10,20,0.45) 100%)", border: "1px solid rgba(9, 122, 220,0.28)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.35)" }}>
    <img src="/champions/ch-trophy.png" className="h-9 w-auto object-contain" />
    <ShimmerText />
  </div>
);

/* 2 — Confetti fall */
const A2_ConfettiFall = () => (
  <BaseCard>
    {[...Array(14)].map((_, i) => (
      <span key={i} className="absolute top-0 rounded-sm z-20" style={{ width: 4, height: 6, left: `${(i * 7.2) % 100}%`, background: i % 3 === 0 ? "#097adc" : i % 3 === 1 ? "#fff" : "#e0413a", animation: `fa-confetti-fall ${1.6 + (i % 5) * 0.25}s ease-in ${(i % 6) * 0.2}s infinite` }} />
    ))}
  </BaseCard>
);

/* 3 — Gold glitter sparkle */
const A3_GlitterSparkle = () => (
  <BaseCard>
    {[...Array(16)].map((_, i) => (
      <span key={i} className="absolute rounded-full bg-sky-200 z-20" style={{ width: 2, height: 2, top: `${10 + (i * 11) % 80}%`, left: `${5 + (i * 17) % 90}%`, animation: `fa-twinkle ${1.4 + (i % 4) * 0.35}s ease-in-out ${(i % 5) * 0.2}s infinite` }} />
    ))}
  </BaseCard>
);

/* 4 — Pulsing golden halo glow */
const A4_PulsingGlow = () => (
  <div className="rounded-2xl" style={{ animation: "fa-glow-breathe 2.2s ease-in-out infinite" }}>
    <BaseCard><ShimmerText /></BaseCard>
  </div>
);

/* 5 — Firework burst rings */
const A5_FireworkBurst = () => (
  <BaseCard>
    {[["30%", "20%"], ["70%", "70%"], ["50%", "45%"]].map(([top, left], i) => (
      <span key={i} className="absolute rounded-full z-20" style={{ top, left, width: 4, height: 4, border: "2px solid #097adc", animation: `fa-ring 1.8s ease-out ${i * 0.6}s infinite` }} />
    ))}
  </BaseCard>
);

/* 6 — Floating bokeh lights */
const A6_FloatingBokeh = () => (
  <BaseCard>
    {[...Array(8)].map((_, i) => (
      <span key={i} className="absolute rounded-full z-20" style={{ bottom: 4, left: `${8 + i * 11}%`, width: 6 + (i % 3) * 3, height: 6 + (i % 3) * 3, background: "radial-gradient(circle, rgba(9, 122, 220,0.9), transparent 70%)", filter: "blur(1px)", animation: `fa-bokeh-float ${2.4 + (i % 4) * 0.4}s ease-in ${i * 0.3}s infinite` }} />
    ))}
  </BaseCard>
);

/* 7 — Trophy bounce */
const A7_TrophyBounce = () => (
  <div className="relative h-16 w-60 rounded-2xl flex items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, rgba(8,22,42,0.55), rgba(3,10,20,0.45))", border: "1px solid rgba(9, 122, 220,0.28)" }}>
    <img src="/champions/ch-trophy.png" className="h-9 w-auto object-contain" style={{ animation: "fa-bounce 1.6s ease-in-out infinite" }} />
    <ShimmerText />
  </div>
);

/* 8 — Border light chase */
const A8_BorderChase = () => (
  <div className="relative h-16 w-60 rounded-2xl p-[2px] overflow-hidden" style={{ backgroundImage: "linear-gradient(90deg,#097adc 0%,transparent 15%,transparent 85%,#097adc 100%)", backgroundSize: "250% 100%", animation: "fa-border-chase 2.4s linear infinite" }}>
    <div className="relative h-full w-full rounded-2xl flex items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, rgba(8,22,42,0.9), rgba(3,10,20,0.9))" }}>
      <img src="/champions/ch-trophy.png" className="h-9 w-auto object-contain" />
      <ShimmerText />
    </div>
  </div>
);

/* 9 — Rotating starburst rays */
const A9_RotatingRays = () => (
  <BaseCard>
    <div className="absolute inset-0 z-0" style={{ background: "conic-gradient(from 0deg, transparent 0deg, rgba(9, 122, 220,0.25) 8deg, transparent 20deg, transparent 90deg, rgba(9, 122, 220,0.25) 98deg, transparent 110deg, transparent 180deg, rgba(9, 122, 220,0.25) 188deg, transparent 200deg, transparent 270deg, rgba(9, 122, 220,0.25) 278deg, transparent 290deg)", animation: "fa-spin 5s linear infinite" }} />
  </BaseCard>
);

/* 10 — Confetti cannon from both sides */
const A10_ConfettiCannon = () => (
  <BaseCard>
    {[...Array(10)].map((_, i) => (
      <span key={`l${i}`} className="absolute rounded-sm z-20" style={{ width: 4, height: 6, bottom: 6, left: 0, background: i % 2 ? "#097adc" : "#fff", animation: `fa-confetti-fall ${1.4 + (i % 4) * 0.2}s ease-out ${i * 0.15}s infinite`, transformOrigin: "bottom left" }} />
    ))}
    {[...Array(10)].map((_, i) => (
      <span key={`r${i}`} className="absolute rounded-sm z-20" style={{ width: 4, height: 6, bottom: 6, right: 0, background: i % 2 ? "#097adc" : "#fff", animation: `fa-confetti-fall ${1.4 + (i % 4) * 0.2}s ease-out ${i * 0.15}s infinite`, transformOrigin: "bottom right" }} />
    ))}
  </BaseCard>
);

/* 11 — Slow falling gold dust ("glitter snow") */
const A11_GlitterSnow = () => (
  <BaseCard>
    {[...Array(20)].map((_, i) => (
      <span key={i} className="absolute rounded-full bg-sky-300/80 z-20" style={{ width: 1.5, height: 1.5, top: -4, left: `${(i * 5) % 100}%`, animation: `fa-confetti-fall ${3 + (i % 6) * 0.5}s linear ${(i % 8) * 0.4}s infinite` }} />
    ))}
  </BaseCard>
);

/* 12 — Ripple pulse rings from center */
const A12_RipplePulse = () => (
  <BaseCard>
    <span className="absolute rounded-2xl border border-sky-400/60 z-0" style={{ inset: 0, animation: "fa-ripple 2s ease-out infinite" }} />
    <span className="absolute rounded-2xl border border-sky-400/40 z-0" style={{ inset: 0, animation: "fa-ripple 2s ease-out 1s infinite" }} />
  </BaseCard>
);

/* 13 — Wandering firefly particles */
const A13_Fireflies = () => (
  <BaseCard>
    {[...Array(6)].map((_, i) => (
      <span key={i} className="absolute rounded-full z-20" style={{ width: 3, height: 3, top: `${20 + i * 10}%`, left: `${15 + i * 13}%`, background: "#fff59d", boxShadow: "0 0 6px 2px rgba(255,245,157,0.8)", animation: `fa-firefly ${2.6 + (i % 3) * 0.5}s ease-in-out ${i * 0.4}s infinite alternate` }} />
    ))}
  </BaseCard>
);

/* 14 — Fluttering ribbons at the edges */
const A14_RibbonFlutter = () => (
  <BaseCard>
    <span className="absolute z-20" style={{ top: -6, left: 8, width: 10, height: 26, background: "linear-gradient(#097adc,#8a6a1e)", transformOrigin: "top center", animation: "fa-ribbon-wave 2.2s ease-in-out infinite" }} />
    <span className="absolute z-20" style={{ top: -6, right: 8, width: 10, height: 26, background: "linear-gradient(#097adc,#8a6a1e)", transformOrigin: "top center", animation: "fa-ribbon-wave 2.2s ease-in-out 0.4s infinite" }} />
  </BaseCard>
);

/* 15 — Tada bump on load, then idle */
const A15_TadaBump = () => (
  <div style={{ animation: "fa-tada 2.5s ease-in-out infinite" }}>
    <BaseCard><ShimmerText /></BaseCard>
  </div>
);

/* 16 — Neon border pulse */
const A16_NeonBorderPulse = () => (
  <div className="relative h-16 w-60 rounded-2xl flex items-center justify-center gap-4" style={{ background: "#050505", border: "2px solid #097adc", animation: "fa-glow-breathe 1.8s ease-in-out infinite" }}>
    <img src="/champions/ch-trophy.png" className="h-9 w-auto object-contain" />
    <ShimmerText />
  </div>
);

/* 17 — Orbiting spark trail around the border */
const A17_SparkOrbit = () => (
  <div className="relative h-16 w-60">
    <div className="absolute -inset-1 z-0" style={{ animation: "fa-spark-orbit 3s linear infinite" }}>
      <span className="absolute rounded-full bg-white" style={{ width: 5, height: 5, top: 0, left: "50%", boxShadow: "0 0 8px 3px rgba(9, 122, 220,0.9)" }} />
    </div>
    <BaseCard />
  </div>
);

/* 18 — Drifting gold dust shimmer overlay (texture) */
const A18_GoldDustDrift = () => (
  <BaseCard>
    <div className="absolute inset-0 z-10 opacity-40" style={{ backgroundImage: "radial-gradient(rgba(9, 122, 220,0.9) 1px, transparent 1.5px)", backgroundSize: "18px 18px", animation: "fa-dust-drift 6s linear infinite" }} />
  </BaseCard>
);

/* 19 — Rotating spotlight ray sweeping across */
const A19_SpotlightSweep = () => (
  <BaseCard>
    <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
      <div className="absolute -top-10 -bottom-10 w-10" style={{ left: "-20%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", animation: "fa-border-chase 2.8s linear infinite", transform: "skewX(-20deg)" }} />
    </div>
  </BaseCard>
);

/* 20 — Rising gold bubbles */
const A20_RisingBubbles = () => (
  <BaseCard>
    {[...Array(9)].map((_, i) => (
      <span key={i} className="absolute rounded-full z-20 border border-sky-300/70" style={{ bottom: 4, left: `${10 + i * 9}%`, width: 5 + (i % 3) * 2, height: 5 + (i % 3) * 2, animation: `fa-bubble-rise ${2.2 + (i % 4) * 0.35}s ease-in ${i * 0.25}s infinite` }} />
    ))}
  </BaseCard>
);

/* 21 — Flickering neon text glow (stadium-lights feel) */
const A21_TextFlicker = () => (
  <BaseCard>
    <h3 className="fa-font-out font-semibold text-base tracking-wide relative z-10" style={{ color: "#fff", textShadow: "0 0 10px rgba(9, 122, 220,0.9), 0 0 20px rgba(9, 122, 220,0.5)", animation: "fa-flicker 3.5s infinite" }}>גמר</h3>
  </BaseCard>
);

/* 22 — Twinkling star field background */
const A22_StarTwinkleField = () => (
  <BaseCard>
    {[...Array(18)].map((_, i) => (
      <span key={i} className="absolute rounded-full bg-white z-0" style={{ width: 1.5, height: 1.5, top: `${(i * 13) % 100}%`, left: `${(i * 19) % 100}%`, animation: `fa-twinkle ${1.5 + (i % 5) * 0.3}s ease-in-out ${(i % 7) * 0.2}s infinite` }} />
    ))}
  </BaseCard>
);

/* 23 — Gentle breathing zoom pulse on the whole card */
const A23_BreathePulse = () => (
  <div style={{ animation: "fa-breathe 2.4s ease-in-out infinite" }}>
    <BaseCard><ShimmerText /></BaseCard>
  </div>
);

/* 24 — Confetti bursting from the corners in a loop */
const A24_CornerBursts = () => (
  <BaseCard>
    {[["4px", "4px"], ["4px", "auto"], ["auto", "4px"], ["auto", "auto"]].map(([top, left], corner) => (
      [...Array(4)].map((_, i) => (
        <span key={`${corner}-${i}`} className="absolute rounded-sm z-20" style={{ width: 3, height: 5, top: top === "4px" ? 4 : undefined, bottom: top === "auto" ? 4 : undefined, left: left === "4px" ? 4 : undefined, right: left === "auto" ? 4 : undefined, background: i % 2 ? "#097adc" : "#fff", animation: `fa-confetti-fall ${1.5 + i * 0.2}s ease-out ${corner * 0.3 + i * 0.1}s infinite` }} />
      ))
    ))}
  </BaseCard>
);

/* 25 — Grand finale combo: fireworks + shimmer + sparkle together */
const A25_GrandFinaleCombo = () => (
  <div className="rounded-2xl" style={{ animation: "fa-glow-breathe 2.2s ease-in-out infinite" }}>
    <BaseCard>
      {[...Array(10)].map((_, i) => (
        <span key={`s${i}`} className="absolute rounded-full bg-sky-200 z-20" style={{ width: 2, height: 2, top: `${10 + (i * 9) % 80}%`, left: `${5 + (i * 15) % 90}%`, animation: `fa-twinkle ${1.4 + (i % 4) * 0.3}s ease-in-out ${(i % 5) * 0.2}s infinite` }} />
      ))}
      {[["30%", "15%"], ["65%", "75%"]].map(([top, left], i) => (
        <span key={`r${i}`} className="absolute rounded-full z-20" style={{ top, left, width: 4, height: 4, border: "2px solid #097adc", animation: `fa-ring 2s ease-out ${i * 0.8}s infinite` }} />
      ))}
      <ShimmerText />
    </BaseCard>
  </div>
);

const DESIGNS = [
  { n: 1, title: "שימר קלאסי (מקורי)", tag: "הבייסליין הקיים בפרודקשן", C: A1_ShimmerBaseline },
  { n: 2, title: "קונפטי נופל", tag: "פיסות קונפטי נופלות מלמעלה", C: A2_ConfettiFall },
  { n: 3, title: "נצנוץ זהב", tag: "נקודות נצנוץ מהבהבות", C: A3_GlitterSparkle },
  { n: 4, title: "זוהר פועם", tag: "הילה זהובה נושמת סביב הכרטיס", C: A4_PulsingGlow },
  { n: 5, title: "פיצוץ זיקוקים", tag: "טבעות זיקוקים מתפוצצות", C: A5_FireworkBurst },
  { n: 6, title: "אורות בוקה מרחפים", tag: "כדורי אור מטושטשים עולים", C: A6_FloatingBokeh },
  { n: 7, title: "גביע קופץ", tag: "אנימציית קפיצה על אייקון הגביע", C: A7_TrophyBounce },
  { n: 8, title: "מרדף אור במסגרת", tag: "פס אור זז לאורך המסגרת", C: A8_BorderChase },
  { n: 9, title: "קרני אור מסתובבות", tag: "קרניים זוהרות מסתובבות ברקע", C: A9_RotatingRays },
  { n: 10, title: "תותח קונפטי", tag: "קונפטי יורה משני הצדדים", C: A10_ConfettiCannon },
  { n: 11, title: "שלג זהב", tag: "אבק זהב נופל לאט ועדין", C: A11_GlitterSnow },
  { n: 12, title: "גלי הדף", tag: "טבעות פועמות יוצאות מהמרכז", C: A12_RipplePulse },
  { n: 13, title: "גחליליות זוהרות", tag: "נקודות אור נודדות ברכות", C: A13_Fireflies },
  { n: 14, title: "סרטים מתנפנפים", tag: "סרטי זהב קטנים בפינות העליונות", C: A14_RibbonFlutter },
  { n: 15, title: "קפיצת תשומת לב (Tada)", tag: "בעיטת סקייל+סיבוב קלה חוזרת", C: A15_TadaBump },
  { n: 16, title: "מסגרת נאון פועמת", tag: "מסגרת זוהרת עם נשימה", C: A16_NeonBorderPulse },
  { n: 17, title: "ניצוץ מקיף (Orbit)", tag: "נקודת אור בודדת מקיפה את הכרטיס", C: A17_SparkOrbit },
  { n: 18, title: "אבק זהב נודד", tag: "טקסטורת נקודות זהב זזה לאט", C: A18_GoldDustDrift },
  { n: 19, title: "זרקור חולף", tag: "פס אור אלכסוני חולף כמו זכוכית", C: A19_SpotlightSweep },
  { n: 20, title: "בועות עולות", tag: "בועות זהב קטנות עולות למעלה", C: A20_RisingBubbles },
  { n: 21, title: "הבהוב טקסט נאון", tag: "הטקסט מהבהב כמו שלט ניאון", C: A21_TextFlicker },
  { n: 22, title: "שדה כוכבים נוצץ", tag: "כוכבים קטנים מנצנצים ברקע", C: A22_StarTwinkleField },
  { n: 23, title: "נשימה עדינה", tag: "כל הכרטיס מתנפח ומתכווץ קלות", C: A23_BreathePulse },
  { n: 24, title: "פיצוצים מהפינות", tag: "קונפטי יוצא מארבע הפינות בלולאה", C: A24_CornerBursts },
  { n: 25, title: "הגרנד פינאלה — הכל ביחד", tag: "זיקוקים + נצנוץ + זוהר + שימר", C: A25_GrandFinaleCombo },
];

export default function AdminFinalAnimations() {
  return (
    <div>
      <SharedStyles />
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">🎉 אנימציות למחזור הגמר — גלריית דמו</h2>
        <p className="text-slate-400 text-sm mt-1">
          25 אנימציות שונות, כולן מופעלות על אותו כרטיס מחזור בדיוק כמו בפרודקשן (h-16 w-60, גביע + טקסט "גמר") —
          כאן משתנה רק שכבת האנימציה, לא העיצוב של הכרטיס עצמו. תגיד לי מספרים שאהבת ונבנה מזה את הגרסה הסופית.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {DESIGNS.map(({ n, title, tag, C }) => (
          <Frame key={n} n={n} title={title} tag={tag}>
            <C />
          </Frame>
        ))}
      </div>
    </div>
  );
}
