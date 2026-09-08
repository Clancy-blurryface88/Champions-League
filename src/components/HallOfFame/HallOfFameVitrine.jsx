import React from "react";
import HallOfFameEntryCard from "./HallOfFameEntryCard";
import HallOfFameEmptyState from "./HallOfFameEmptyState";

// Default view — a museum vitrine shelf. Every entry "stands" on a shared
// golden shelf line with a soft ground shadow beneath it.
export default function HallOfFameVitrine({ entries }) {
  if (!entries.length) return <HallOfFameEmptyState />;

  return (
    <div className="relative py-6" style={{ perspective: 900 }}>
      <div className="flex flex-wrap justify-center items-end gap-x-7 gap-y-9 relative z-10" style={{ transform: "rotateX(3deg)", transformStyle: "preserve-3d" }}>
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col items-center">
            <HallOfFameEntryCard entry={entry} size="lg" />
            <div className="w-14 h-2 rounded-full mt-2" style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.45), transparent 70%)" }} />
          </div>
        ))}
      </div>
      <div className="mt-1 h-[2px] rounded-full mx-auto max-w-[94%]" style={{ background: "linear-gradient(90deg, transparent, rgba(245,197,24,0.55), transparent)" }} />
    </div>
  );
}
