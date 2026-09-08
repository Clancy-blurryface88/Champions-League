import React from "react";

const SIZES = {
  sm: { box: 56, maxWidth: 100, name: "text-[11px]", text: "text-[8.5px]", gap: "gap-1" },
  md: { box: 72, maxWidth: 150, name: "text-sm", text: "text-[11px]", gap: "gap-1.5" },
  lg: { box: 92, maxWidth: 150, name: "text-sm", text: "text-[11px]", gap: "gap-1.5" },
};

// The one visual unit every Hall of Fame layout is built from — always
// stacked top-to-bottom in this exact order: trophy image, text, name.
export default function HallOfFameEntryCard({ entry, size = "md", align = "center" }) {
  const cfg = SIZES[size] || SIZES.md;
  const isCenter = align === "center";

  return (
    <div className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start text-right"} ${cfg.gap}`} style={{ maxWidth: cfg.maxWidth }}>
      <img
        src={entry.trophy_image}
        alt={entry.name}
        className="flex-shrink-0"
        style={{ maxWidth: cfg.box, maxHeight: cfg.box, width: "auto", height: "auto", objectFit: "contain", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.4))" }}
      />
      {entry.text && <p className={`text-slate-300 leading-snug ${cfg.text}`}>{entry.text}</p>}
      <p className={`font-bold leading-tight ${cfg.name}`} style={{ color: "#f5c518" }}>{entry.name}</p>
    </div>
  );
}
