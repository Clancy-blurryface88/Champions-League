import React, { useState } from "react";
import HallOfFameVitrine from "./HallOfFameVitrine";
import HallOfFameTimeline from "./HallOfFameTimeline";

const VIEWS = [
  { id: "vitrine", label: "🏛️ ויטרינה" },
  { id: "timeline", label: "🕰️ ציר זמן" },
];

// The real Hall of Fame page — default view is the vitrine shelf, with a
// pill toggle on the right (dir="rtl", so the first child sits on the right)
// to switch to the vertical timeline. This is the component that will move
// into the live app once the admin is happy with it.
export default function HallOfFameView({ entries, title = "היכל התהילה", defaultView = "vitrine" }) {
  const [view, setView] = useState(defaultView);

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center rounded-full p-1 flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
              style={view === v.id ? { background: "#f5c518", color: "#000" } : { color: "#94a3b8" }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <h2 className="text-white font-black text-lg truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{title}</h2>
      </div>

      {view === "vitrine" ? <HallOfFameVitrine entries={entries} /> : <HallOfFameTimeline entries={entries} />}
    </div>
  );
}
