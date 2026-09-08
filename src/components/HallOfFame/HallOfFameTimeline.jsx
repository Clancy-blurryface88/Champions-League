import React from "react";
import { motion } from "framer-motion";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";

// Staggered reveal step — capped index so a long list doesn't push the last
// entries' entrance out several seconds.
const STEP = 0.09;
const delayFor = (idx) => Math.min(idx, 12) * STEP;

// Alternate view — a horizontal gold line running right-to-left, with a
// node per entry, in the same order the admin arranged them in.
export default function HallOfFameTimeline({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;

  return (
    <div dir="rtl" className="overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
      <div className="relative flex items-start gap-7 px-2 pt-1" style={{ minWidth: "max-content" }}>
        <div className="absolute right-0 left-0 h-px" style={{ top: 10, background: "linear-gradient(to left, rgba(245,197,24,0.65), rgba(245,197,24,0.1))" }} />
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delayFor(idx), ease: "easeOut" }}
            className="relative flex flex-col items-center flex-shrink-0"
            style={{ width: 132 }}
          >
            <div className="h-5 flex items-center justify-center mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f5c518", boxShadow: "0 0 10px rgba(245,197,24,0.7)" }} />
            </div>
            <HallOfFameEntryCard entry={entry} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
