import React, { useState } from "react";
import { motion } from "framer-motion";
import HallOfFameVitrine from "./HallOfFameVitrine";
import HallOfFameTimeline from "./HallOfFameTimeline";

const VIEWS = [
  { id: "vitrine", label: "ויטרינה" },
  { id: "timeline", label: "ציר זמן" },
];

// The real Hall of Fame view — default is the vitrine cabinet, with a pill
// toggle on the right (dir="rtl", so the first child sits on the right) to
// switch to the horizontal timeline. Used both by the live app page (which
// has its own hero title, so passes showTitle={false}) and the admin's live
// preview (which keeps the inline title for context).
export default function HallOfFameView({ entries, title = "היכל התהילה", defaultView = "vitrine", showTitle = true }) {
  const [view, setView] = useState(defaultView);

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center rounded-full p-1 flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {VIEWS.map((v) => {
            const active = view === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className="relative text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap"
                style={{ color: active ? "#f5c518" : "#7cadee", transition: "color 0.3s" }}
              >
                {active && (
                  <motion.span
                    layoutId="hof-view-toggle-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "rgba(245,197,24,0.14)", border: "1px solid rgba(245,197,24,0.4)" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{v.label}</span>
              </button>
            );
          })}
        </div>
        {showTitle && <h2 className="text-white font-black text-lg truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h2>}
      </div>

      {view === "vitrine" ? <HallOfFameVitrine entries={entries} /> : <HallOfFameTimeline entries={entries} />}
    </div>
  );
}
