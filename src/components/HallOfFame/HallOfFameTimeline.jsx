import React from "react";
import { motion } from "framer-motion";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";
import HallOfFameCabinet from "./HallOfFameCabinet";

// Staggered reveal step — capped index so a long list doesn't push the last
// entries' entrance out several seconds.
const STEP = 0.13;
const delayFor = (idx) => Math.min(idx, 12) * STEP;
const SPINE = 26;

// A small gold diamond medallion — the node each entry hangs from on the line.
function Medallion() {
  return (
    <span
      className="block flex-shrink-0"
      style={{
        width: 13,
        height: 13,
        transform: "rotate(45deg)",
        background: "linear-gradient(135deg, #fde68a 0%, #f5c518 55%, #8a6508 100%)",
        border: "1px solid rgba(138,101,8,0.7)",
        boxShadow: "0 0 10px rgba(245,197,24,0.7), inset 0 1px 1px rgba(255,255,255,0.6)",
      }}
    />
  );
}

// Alternate view — a vertical timeline, top to bottom, dressed up as part of
// the same gold trophy-cabinet family as the vitrine: an ornate rule with a
// diamond medallion marking each entry.
export default function HallOfFameTimeline({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;

  return (
    <HallOfFameCabinet maxWidth={460}>
      <div className="relative max-h-[480px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
        <div
          className="absolute top-0 bottom-0 w-px"
          style={{ right: SPINE / 2, background: "linear-gradient(to bottom, transparent, rgba(245,197,24,0.75) 5%, rgba(245,197,24,0.75) 95%, transparent)" }}
        />

        <div className="space-y-7 py-1">
          {entries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: delayFor(idx), ease: "easeOut" }}
              className="flex items-start"
            >
              <div className="flex-shrink-0 flex justify-center pt-1.5" style={{ width: SPINE }}>
                <Medallion />
              </div>
              <div className="flex-1 min-w-0">
                <HallOfFameEntryCard entry={entry} align="start" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </HallOfFameCabinet>
  );
}
