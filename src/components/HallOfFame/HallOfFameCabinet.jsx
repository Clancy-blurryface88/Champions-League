import React from "react";
import CornerFlourish from "./CornerFlourish";

// Shared "trophy cabinet" frame — gold-trimmed panel, 4 corner flourishes,
// small diamond header divider. Both Hall of Fame layouts (vitrine shelves,
// vertical timeline) sit inside one of these so they read as one family.
export default function HallOfFameCabinet({ children, maxWidth }) {
  return (
    <div
      className="relative mx-auto rounded-2xl px-3 py-5 sm:px-6"
      style={{
        maxWidth,
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

      {children}
    </div>
  );
}
