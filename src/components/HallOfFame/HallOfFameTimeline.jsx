import React from "react";
import { motion } from "framer-motion";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";

// Staggered reveal step — capped index so a long list doesn't push the last
// entries' entrance out several seconds.
const STEP = 0.09;
const delayFor = (idx) => Math.min(idx, 12) * STEP;

// Alternate view — a vertical gold line with a node per entry, in the same
// order the admin arranged them in.
export default function HallOfFameTimeline({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;

  return (
    <div className="relative pr-6 max-h-[480px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
      <div className="absolute top-1 bottom-1 right-2 w-px" style={{ background: "linear-gradient(to bottom, rgba(245,197,24,0.6), rgba(245,197,24,0.08))" }} />
      <div className="space-y-6 py-1">
        {entries.map((entry, idx) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delayFor(idx), ease: "easeOut" }}
            className="relative flex items-start"
          >
            <span
              className="absolute right-2 translate-x-1/2 top-3 w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: "#f5c518", boxShadow: "0 0 10px rgba(245,197,24,0.7)" }}
            />
            <div className="pr-6">
              <HallOfFameEntryCard entry={entry} align="start" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
