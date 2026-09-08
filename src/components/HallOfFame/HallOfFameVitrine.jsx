import React from "react";
import { motion } from "framer-motion";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";

// Staggered reveal step — capped index so a long list doesn't push the last
// entries' entrance out several seconds.
const STEP = 0.13;
const delayFor = (idx) => Math.min(idx, 12) * STEP;

function chunk3(arr) {
  const rows = [];
  for (let i = 0; i < arr.length; i += 3) rows.push(arr.slice(i, i + 3));
  return rows;
}

// A gold corner bracket that hugs the top-left corner of its own box by
// default — rotate 0/90/180/270 to hug each of the cabinet's 4 corners.
function CornerFlourish({ style }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="absolute pointer-events-none" style={{ opacity: 0.55, ...style }}>
      <path d="M3 18 L3 7 Q3 3 7 3 L18 3" stroke="#f5c518" strokeWidth="1.4" fill="none" />
      <circle cx="3" cy="18" r="1.6" fill="#f5c518" />
    </svg>
  );
}

// Default view — a real trophy cabinet: a gold-trimmed case with a fixed 3
// entries per shelf, each shelf a gold plank the row "stands" on.
export default function HallOfFameVitrine({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;
  const rows = chunk3(entries);

  return (
    <div
      className="relative mx-auto rounded-2xl px-3 py-5 sm:px-6"
      style={{
        maxWidth: 440,
        background: "linear-gradient(180deg, rgba(30,21,6,0.55), rgba(8,6,2,0.78))",
        border: "1px solid rgba(245,197,24,0.45)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 0 50px rgba(245,197,24,0.06), 0 12px 28px rgba(0,0,0,0.45)",
      }}
    >
      <CornerFlourish style={{ top: 6, left: 6, transform: "rotate(0deg)" }} />
      <CornerFlourish style={{ top: 6, right: 6, transform: "rotate(90deg)" }} />
      <CornerFlourish style={{ bottom: 6, right: 6, transform: "rotate(180deg)" }} />
      <CornerFlourish style={{ bottom: 6, left: 6, transform: "rotate(270deg)" }} />

      <div className="flex items-center justify-center gap-2 mb-4 px-6">
        <span className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(245,197,24,0.55))" }} />
        <span style={{ color: "#f5c518", fontSize: 10 }}>✦</span>
        <span className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(245,197,24,0.55))" }} />
      </div>

      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="relative mb-6 last:mb-0.5">
          <div className="grid grid-cols-3 gap-x-1 gap-y-2 items-end justify-items-center pb-2.5">
            {row.map((entry, i) => {
              const globalIdx = rowIdx * 3 + i;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 14, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: delayFor(globalIdx), ease: "easeOut" }}
                >
                  <HallOfFameEntryCard entry={entry} size="sm" />
                </motion.div>
              );
            })}
          </div>
          <div
            className="h-2.5 rounded-full"
            style={{
              background: "linear-gradient(180deg, #fde68a 0%, #f5c518 35%, #b8860b 80%, #8a6508 100%)",
              boxShadow: "0 5px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
            }}
          />
          <div className="w-[92%] h-4 mx-auto -mt-1 pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(245,197,24,0.2), transparent 75%)" }} />
        </div>
      ))}
    </div>
  );
}
