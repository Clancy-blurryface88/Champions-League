import React from "react";

// The one visual unit every Hall of Fame layout is built from — always
// stacked top-to-bottom in this exact order: trophy image, text, name.
export default function HallOfFameEntryCard({ entry, size = "md" }) {
  const boxPx = size === "lg" ? 92 : 72;

  return (
    <div className="flex flex-col items-center text-center gap-1.5" style={{ maxWidth: 150 }}>
      <img
        src={entry.trophy_image}
        alt={entry.name}
        className="flex-shrink-0"
        style={{ maxWidth: boxPx, maxHeight: boxPx, width: "auto", height: "auto", objectFit: "contain", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }}
      />
      {entry.text && <p className="text-slate-300 text-[11px] leading-snug">{entry.text}</p>}
      <p className="font-bold text-sm leading-tight" style={{ color: "#f5c518" }}>{entry.name}</p>
    </div>
  );
}
