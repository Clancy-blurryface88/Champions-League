import React from "react";
import { motion } from "framer-motion";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";
import HallOfFameCabinet from "./HallOfFameCabinet";

// Staggered reveal step — capped index so a long list doesn't push the last
// entries' entrance out several seconds.
const STEP = 0.13;
const delayFor = (idx) => Math.min(idx, 12) * STEP;
const COL_GAP = 22;
const NODE_WIDTH = 76;

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

// Alternate view — a horizontal timeline, right to left, with the gold line
// running through the middle: the entry's "text" sits in a pill right on
// that center line (typically a year), and the trophy+name card alternates
// above/below it row by row so the strip stays compact instead of piling
// every card in one direction.
export default function HallOfFameTimeline({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;

  return (
    <HallOfFameCabinet maxWidth={520}>
      <div dir="rtl" className="overflow-x-auto overflow-y-visible pb-1" style={{ scrollbarWidth: "thin" }}>
        <div
          className="grid grid-flow-col px-2"
          style={{ gridTemplateRows: "auto auto auto", columnGap: COL_GAP, width: "max-content" }}
        >
          {entries.map((entry, idx) => {
            const above = idx % 2 === 0;
            const cardEntry = { ...entry, text: undefined };
            const card = (
              <motion.div
                initial={{ opacity: 0, y: above ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: delayFor(idx), ease: "easeOut" }}
              >
                <HallOfFameEntryCard entry={cardEntry} size="sm" />
              </motion.div>
            );
            const connector = <span className="w-px" style={{ height: 8, background: "rgba(245,197,24,0.5)" }} />;

            return (
              <React.Fragment key={entry.id}>
                <div className="flex flex-col items-center justify-end" style={{ width: NODE_WIDTH }}>
                  {above && (<>{card}{connector}</>)}
                </div>

                <div className="relative flex items-center justify-center py-2" style={{ width: NODE_WIDTH }}>
                  <span
                    className="absolute top-1/2 h-px"
                    style={{ right: -COL_GAP / 2, left: -COL_GAP / 2, background: "linear-gradient(to left, rgba(245,197,24,0.15), rgba(245,197,24,0.7), rgba(245,197,24,0.15))" }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: delayFor(idx), ease: "easeOut" }}
                    className="relative"
                  >
                    {entry.text ? (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-black whitespace-nowrap block"
                        style={{ background: "#0f172a", border: "1px solid #f5c518", color: "#f5c518" }}
                      >
                        {entry.text}
                      </span>
                    ) : (
                      <Medallion />
                    )}
                  </motion.div>
                </div>

                <div className="flex flex-col items-center justify-start" style={{ width: NODE_WIDTH }}>
                  {!above && (<>{connector}{card}</>)}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </HallOfFameCabinet>
  );
}
