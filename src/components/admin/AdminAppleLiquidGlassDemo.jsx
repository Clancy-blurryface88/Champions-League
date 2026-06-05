import React, { useState } from "react";
import { SlidingNumber } from "../animate-ui/text/sliding-number";

const MATCH_VAL = 7.4;
const ROUND_VAL = 22.1;

const variants = [
  {
    id: "frosted-system",
    label: "Frosted System (נוכחי)",
    description: "ברירת מחדל iOS — זכוכית מט עם #007AFF / #34C759",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    card: {
      background: "rgba(255,255,255,0.10)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.22)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.45)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
    labelColor: "rgba(255,255,255,0.45)",
    subColor: "rgba(255,255,255,0.28)",
  },
  {
    id: "light-mode",
    label: "iOS Light Mode",
    description: "#F2F2F7 רקע כסוף-לבן, כרטיסים לבנים טהורים",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    wrapperBg: "#1c1f26",
    card: {
      background: "#FFFFFF",
      border: "1px solid rgba(60,60,67,0.13)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 50%)",
    labelColor: "rgba(60,60,67,0.55)",
    subColor: "rgba(60,60,67,0.35)",
  },
  {
    id: "tinted-blue-green",
    label: "Tinted Glass",
    description: "זכוכית עם גוון צבע — כחול למשחק, ירוק למחזור",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    matchCard: {
      background: "rgba(0,122,255,0.14)",
      backdropFilter: "blur(40px) saturate(200%)",
      WebkitBackdropFilter: "blur(40px) saturate(200%)",
      border: "1px solid rgba(0,122,255,0.30)",
      boxShadow: "0 8px 32px rgba(0,122,255,0.18), inset 0 1px 0 rgba(255,255,255,0.35)",
    },
    roundCard: {
      background: "rgba(52,199,89,0.14)",
      backdropFilter: "blur(40px) saturate(200%)",
      WebkitBackdropFilter: "blur(40px) saturate(200%)",
      border: "1px solid rgba(52,199,89,0.30)",
      boxShadow: "0 8px 32px rgba(52,199,89,0.18), inset 0 1px 0 rgba(255,255,255,0.35)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
    labelColor: "rgba(255,255,255,0.5)",
    subColor: "rgba(255,255,255,0.3)",
  },
  {
    id: "ultradeep",
    label: "Ultra Deep Frost",
    description: "100px blur עם רוויה מקסימלית, אפקט ice-glass עמוק",
    matchColor: "#5AC8FA",
    roundColor: "#30D158",
    card: {
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(100px) saturate(300%)",
      WebkitBackdropFilter: "blur(100px) saturate(300%)",
      border: "1px solid rgba(255,255,255,0.18)",
      boxShadow: "0 16px 48px rgba(0,0,0,0.45), inset 0 1.5px 0 rgba(255,255,255,0.6)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.20) 0%, transparent 55%)",
    labelColor: "rgba(255,255,255,0.4)",
    subColor: "rgba(255,255,255,0.22)",
  },
  {
    id: "pill-minimal",
    label: "Pill Minimal",
    description: "כפתורים מעוגלים לחלוטין בסגנון Dynamic Island",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    card: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(32px) saturate(160%)",
      WebkitBackdropFilter: "blur(32px) saturate(160%)",
      border: "1px solid rgba(255,255,255,0.20)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.40)",
      borderRadius: "9999px",
    },
    radius: "9999px",
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 50%)",
    labelColor: "rgba(255,255,255,0.45)",
    subColor: "rgba(255,255,255,0.28)",
  },
  {
    id: "gold-platinum",
    label: "Liquid Gold / Platinum",
    description: "גוון מתכת יוקרתי — זהב למשחק, פלטינום למחזור",
    matchColor: "#FFD60A",
    roundColor: "#E5E5EA",
    matchCard: {
      background: "rgba(255,214,10,0.10)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255,214,10,0.28)",
      boxShadow: "0 8px 32px rgba(255,214,10,0.14), inset 0 1px 0 rgba(255,255,255,0.50)",
    },
    roundCard: {
      background: "rgba(229,229,234,0.08)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(229,229,234,0.25)",
      boxShadow: "0 8px 32px rgba(200,200,200,0.10), inset 0 1px 0 rgba(255,255,255,0.50)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
    labelColor: "rgba(255,255,255,0.45)",
    subColor: "rgba(255,255,255,0.28)",
  },
  {
    id: "aurora",
    label: "Aurora Liquid",
    description: "שניים זהים בצבע אאורורה סגול-ורוד",
    matchColor: "#BF5AF2",
    roundColor: "#FF375F",
    matchCard: {
      background: "rgba(191,90,242,0.12)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(191,90,242,0.28)",
      boxShadow: "0 8px 32px rgba(191,90,242,0.18), inset 0 1px 0 rgba(255,255,255,0.40)",
    },
    roundCard: {
      background: "rgba(255,55,95,0.12)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255,55,95,0.28)",
      boxShadow: "0 8px 32px rgba(255,55,95,0.18), inset 0 1px 0 rgba(255,255,255,0.40)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)",
    labelColor: "rgba(255,255,255,0.5)",
    subColor: "rgba(255,255,255,0.28)",
  },
  {
    id: "monochrome",
    label: "Pure Monochrome",
    description: "שחור-לבן בלבד — ניקיון מוחלט בלי גוני צבע",
    matchColor: "#FFFFFF",
    roundColor: "rgba(255,255,255,0.70)",
    card: {
      background: "rgba(255,255,255,0.07)",
      backdropFilter: "blur(40px) saturate(120%)",
      WebkitBackdropFilter: "blur(40px) saturate(120%)",
      border: "1px solid rgba(255,255,255,0.15)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.40)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
    labelColor: "rgba(255,255,255,0.40)",
    subColor: "rgba(255,255,255,0.22)",
  },

  // ── גל 2: 8 וריאציות נוספות ──────────────────────────────────────────

  {
    id: "mesh-gradient",
    label: "Mesh Gradient",
    description: "רקע גרדיאנט רשת בסגנון iOS 16 wallpaper — צבעוני ועשיר",
    matchColor: "#FFFFFF",
    roundColor: "#FFFFFF",
    matchCard: {
      background: "linear-gradient(135deg, rgba(0,122,255,0.55) 0%, rgba(90,200,250,0.35) 50%, rgba(52,199,89,0.45) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.30)",
      boxShadow: "0 8px 32px rgba(0,122,255,0.25), inset 0 1px 0 rgba(255,255,255,0.50)",
    },
    roundCard: {
      background: "linear-gradient(135deg, rgba(52,199,89,0.55) 0%, rgba(48,209,88,0.35) 50%, rgba(0,122,255,0.40) 100%)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.30)",
      boxShadow: "0 8px 32px rgba(52,199,89,0.25), inset 0 1px 0 rgba(255,255,255,0.50)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 55%)",
    labelColor: "rgba(255,255,255,0.75)",
    subColor: "rgba(255,255,255,0.55)",
  },

  {
    id: "neumorphic",
    label: "Neumorphism",
    description: "Soft UI — כרטיסים בולטים מהרקע, צל כפול בסגנון נאומורפי",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    card: {
      background: "#1e2130",
      border: "1px solid rgba(255,255,255,0.04)",
      boxShadow: "6px 6px 14px rgba(0,0,0,0.55), -4px -4px 10px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
    },
    gloss: "none",
    labelColor: "rgba(255,255,255,0.35)",
    subColor: "rgba(255,255,255,0.20)",
  },

  {
    id: "holographic",
    label: "Holographic / Iridescent",
    description: "אפקט הולוגרמה קשת — שינוי צבע לפי זווית",
    matchColor: "#FFFFFF",
    roundColor: "#FFFFFF",
    matchCard: {
      background: "linear-gradient(125deg, rgba(255,0,128,0.18) 0%, rgba(0,200,255,0.18) 33%, rgba(128,255,0,0.18) 66%, rgba(200,0,255,0.18) 100%)",
      backdropFilter: "blur(32px) saturate(200%)",
      WebkitBackdropFilter: "blur(32px) saturate(200%)",
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "0 8px 32px rgba(128,0,255,0.20), inset 0 1px 0 rgba(255,255,255,0.60)",
    },
    roundCard: {
      background: "linear-gradient(125deg, rgba(0,200,255,0.18) 0%, rgba(128,255,0,0.18) 33%, rgba(200,0,255,0.18) 66%, rgba(255,128,0,0.18) 100%)",
      backdropFilter: "blur(32px) saturate(200%)",
      WebkitBackdropFilter: "blur(32px) saturate(200%)",
      border: "1px solid rgba(255,255,255,0.35)",
      boxShadow: "0 8px 32px rgba(0,200,255,0.20), inset 0 1px 0 rgba(255,255,255,0.60)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.30) 0%, transparent 50%)",
    labelColor: "rgba(255,255,255,0.65)",
    subColor: "rgba(255,255,255,0.40)",
  },

  {
    id: "neon-outline",
    label: "Neon Outline",
    description: "מסגרת ניאון זוהרת, פנים שקוף לחלוטין — minimal ודרמטי",
    matchColor: "#00F5FF",
    roundColor: "#39FF14",
    matchCard: {
      background: "rgba(0,245,255,0.04)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1.5px solid rgba(0,245,255,0.70)",
      boxShadow: "0 0 20px rgba(0,245,255,0.25), 0 0 60px rgba(0,245,255,0.10), inset 0 0 20px rgba(0,245,255,0.05)",
    },
    roundCard: {
      background: "rgba(57,255,20,0.04)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      border: "1.5px solid rgba(57,255,20,0.65)",
      boxShadow: "0 0 20px rgba(57,255,20,0.25), 0 0 60px rgba(57,255,20,0.10), inset 0 0 20px rgba(57,255,20,0.05)",
    },
    gloss: "none",
    labelColor: "rgba(255,255,255,0.40)",
    subColor: "rgba(255,255,255,0.22)",
  },

  {
    id: "mercury",
    label: "Liquid Mercury",
    description: "מתכת כסופה נוזלית — כסף-כרום עם עומק מתכתי",
    matchColor: "#C0C0C0",
    roundColor: "#E8E8E8",
    card: {
      background: "linear-gradient(160deg, rgba(200,200,210,0.18) 0%, rgba(120,120,135,0.10) 50%, rgba(200,200,210,0.16) 100%)",
      backdropFilter: "blur(40px) saturate(140%)",
      WebkitBackdropFilter: "blur(40px) saturate(140%)",
      border: "1px solid rgba(200,200,215,0.30)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.20)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.05) 40%, transparent 100%)",
    labelColor: "rgba(255,255,255,0.45)",
    subColor: "rgba(255,255,255,0.28)",
  },

  {
    id: "grain-dark",
    label: "Dark Grain Glass",
    description: "זכוכית כהה עם טקסטורת noise — פרמיום קינמטי",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    matchCard: {
      background: "rgba(10,12,20,0.75)",
      backdropFilter: "blur(48px) saturate(160%)",
      WebkitBackdropFilter: "blur(48px) saturate(160%)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 12px 48px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.12)",
    },
    roundCard: {
      background: "rgba(10,12,20,0.75)",
      backdropFilter: "blur(48px) saturate(160%)",
      WebkitBackdropFilter: "blur(48px) saturate(160%)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "0 12px 48px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.12)",
    },
    gloss: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
    labelColor: "rgba(255,255,255,0.38)",
    subColor: "rgba(255,255,255,0.20)",
    extraOverlay: "noise",
  },

  {
    id: "bento",
    label: "Bento Flat",
    description: "שטוח לחלוטין בסגנון Bento Box — ניקיון יפני, פסים עדינים",
    matchColor: "#007AFF",
    roundColor: "#34C759",
    matchCard: {
      background: "rgba(255,255,255,0.055)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "none",
    },
    roundCard: {
      background: "rgba(255,255,255,0.055)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow: "none",
    },
    gloss: "none",
    labelColor: "rgba(255,255,255,0.35)",
    subColor: "rgba(255,255,255,0.20)",
  },

  {
    id: "material-you",
    label: "Material You",
    description: "Google Dynamic Color — צבעי tone-on-tone עמוקים ורכים",
    matchColor: "#CDD6F4",
    roundColor: "#A6E3A1",
    matchCard: {
      background: "rgba(30,40,70,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(100,130,220,0.20)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      borderRadius: "16px",
    },
    roundCard: {
      background: "rgba(20,50,35,0.85)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(80,180,100,0.20)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      borderRadius: "16px",
    },
    gloss: "none",
    labelColor: "rgba(205,214,244,0.50)",
    subColor: "rgba(205,214,244,0.30)",
  },
];

function CardInner({ color, label, value, cardStyle, gloss, labelColor, subColor, radius, extraOverlay, delay }) {
  return (
    <div className="p-5 text-center relative overflow-hidden" style={{ borderRadius: radius, ...cardStyle }}>
      {/* noise grain overlay */}
      {extraOverlay === "noise" && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "160px",
        }} />
      )}
      {gloss && gloss !== "none" && (
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: gloss, borderRadius: `${radius} ${radius} 0 0` }} />
      )}
      <p className="relative text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: labelColor, letterSpacing: "0.12em" }}>{label}</p>
      <div className="relative text-3xl font-bold tabular-nums" style={{ color }}>
        <SlidingNumber number={value} className="text-3xl font-bold" duration={1.0} delay={delay} showDecimals={true} />
      </div>
      <p className="relative text-xs mt-2" style={{ color: subColor }}>נקודות</p>
    </div>
  );
}

function StatCard({ matchColor, roundColor, matchCardStyle, roundCardStyle, sharedCardStyle, gloss, labelColor, subColor, radius = "20px", extraOverlay }) {
  const baseCard = sharedCardStyle || {};
  const mCard = matchCardStyle || baseCard;
  const rCard = roundCardStyle || baseCard;
  const mRadius = mCard.borderRadius || radius;
  const rRadius = rCard.borderRadius || radius;

  return (
    <div className="grid grid-cols-2 gap-4">
      <CardInner color={matchColor} label="ממוצע למשחק" value={MATCH_VAL} cardStyle={mCard} gloss={gloss} labelColor={labelColor} subColor={subColor} radius={mRadius} extraOverlay={extraOverlay} delay={0.1} />
      <CardInner color={roundColor} label="ממוצע למחזור" value={ROUND_VAL} cardStyle={rCard} gloss={gloss} labelColor={labelColor} subColor={subColor} radius={rRadius} extraOverlay={extraOverlay} delay={0.25} />
    </div>
  );
}

export default function AdminAppleLiquidGlassDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Apple Liquid Glass — וריאציות</h2>
        <p className="text-slate-400 text-sm">16 עיצובים שונים לכרטיסי ממוצע למשחק / למחזור. לחץ על וריאציה לבחירה.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {variants.map((v) => (
          <div
            key={v.id}
            onClick={() => setSelected(selected === v.id ? null : v.id)}
            className="rounded-xl border cursor-pointer transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: selected === v.id ? "1px solid rgba(0,122,255,0.6)" : "1px solid rgba(255,255,255,0.08)",
              boxShadow: selected === v.id ? "0 0 0 2px rgba(0,122,255,0.2)" : "none",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div>
                <span className="text-white font-semibold text-sm">{v.label}</span>
                <p className="text-slate-400 text-xs mt-0.5">{v.description}</p>
              </div>
              {selected === v.id && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: "rgba(0,122,255,0.2)", color: "#007AFF" }}>
                  נבחר
                </span>
              )}
            </div>

            {/* Preview */}
            <div className="px-5 pb-5">
              <StatCard
                matchColor={v.matchColor}
                roundColor={v.roundColor}
                matchCardStyle={v.matchCard}
                roundCardStyle={v.roundCard}
                sharedCardStyle={v.card}
                gloss={v.gloss}
                labelColor={v.labelColor}
                subColor={v.subColor}
                radius={v.card?.borderRadius || "20px"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
