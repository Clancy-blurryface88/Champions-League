import React from "react";
import { motion } from "framer-motion";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";
import HallOfFameCabinet from "./HallOfFameCabinet";

// Staggered reveal step — capped index so a long list doesn't push the last
// entries' entrance out several seconds.
const STEP = 0.13;
const delayFor = (idx) => Math.min(idx, 12) * STEP;

function chunk3(arr) {
  const rows = [];
  for (let i = 0; i < arr.length; i += 3) rows.push(arr.slice(i, i + 3));
  return rows;
}

// Default view — a real trophy cabinet: a fixed 3 entries per shelf, each
// shelf a gold plank the row "stands" on.
export default function HallOfFameVitrine({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;
  const rows = chunk3(entries);

  return (
    <HallOfFameCabinet maxWidth={440}>
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
    </HallOfFameCabinet>
  );
}
