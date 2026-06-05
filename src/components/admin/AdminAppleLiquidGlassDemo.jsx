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
];

function StatCard({ matchColor, roundColor, matchCardStyle, roundCardStyle, sharedCardStyle, gloss, labelColor, subColor, radius = "20px" }) {
  const baseCard = sharedCardStyle || {};
  const mCard = matchCardStyle || baseCard;
  const rCard = roundCardStyle || baseCard;

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-5 text-center relative overflow-hidden" style={{ borderRadius: radius, ...mCard }}>
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: gloss, borderRadius: `${radius} ${radius} 0 0` }} />
        <p className="relative text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: labelColor, letterSpacing: "0.12em" }}>ממוצע למשחק</p>
        <div className="relative text-3xl font-bold tabular-nums" style={{ color: matchColor }}>
          <SlidingNumber number={MATCH_VAL} className="text-3xl font-bold" duration={1.0} delay={0.1} showDecimals={true} />
        </div>
        <p className="relative text-xs mt-2" style={{ color: subColor }}>נקודות</p>
      </div>

      <div className="p-5 text-center relative overflow-hidden" style={{ borderRadius: radius, ...rCard }}>
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: gloss, borderRadius: `${radius} ${radius} 0 0` }} />
        <p className="relative text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: labelColor, letterSpacing: "0.12em" }}>ממוצע למחזור</p>
        <div className="relative text-3xl font-bold tabular-nums" style={{ color: roundColor }}>
          <SlidingNumber number={ROUND_VAL} className="text-3xl font-bold" duration={1.0} delay={0.25} showDecimals={true} />
        </div>
        <p className="relative text-xs mt-2" style={{ color: subColor }}>נקודות</p>
      </div>
    </div>
  );
}

export default function AdminAppleLiquidGlassDemo() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">Apple Liquid Glass — וריאציות</h2>
        <p className="text-slate-400 text-sm">8 עיצובים שונים לכרטיסי ממוצע למשחק / למחזור. לחץ על וריאציה לבחירה.</p>
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
