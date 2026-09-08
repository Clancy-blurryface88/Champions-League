import React from "react";

// The one visual unit every Hall of Fame layout is built from — always
// stacked top-to-bottom in this exact order: trophy image, text, name.
export default function HallOfFameEntryCard({ entry, size = "md", align = "center" }) {
  const wrap = size === "lg" ? 92 : 72;
  const isCenter = align === "center";

  return (
    <div className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start text-right"} gap-1.5`} style={{ maxWidth: 150 }}>
      <div
        className="rounded-full overflow-hidden flex-shrink-0"
        style={{
          width: wrap,
          height: wrap,
          border: "1px solid rgba(245,197,24,0.4)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      >
        <img
          src={entry.trophy_image}
          alt={entry.name}
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />
      </div>
      {entry.text && <p className="text-slate-300 text-[11px] leading-snug">{entry.text}</p>}
      <p className="text-white font-bold text-sm leading-tight">{entry.name}</p>
    </div>
  );
}
