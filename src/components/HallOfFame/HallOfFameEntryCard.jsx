import React from "react";

// The one visual unit every Hall of Fame layout is built from — always
// stacked top-to-bottom in this exact order: trophy image, text, name.
export default function HallOfFameEntryCard({ entry, size = "md", align = "center" }) {
  const dims = size === "lg" ? { wrap: 92, img: 62 } : { wrap: 72, img: 48 };
  const isCenter = align === "center";

  return (
    <div className={`flex flex-col ${isCenter ? "items-center text-center" : "items-start text-right"} gap-1.5`} style={{ maxWidth: 150 }}>
      <div
        className="rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          width: dims.wrap,
          height: dims.wrap,
          background: "radial-gradient(circle at 35% 30%, rgba(245,197,24,0.28), rgba(245,197,24,0.04) 72%)",
          border: "1px solid rgba(245,197,24,0.4)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
        }}
      >
        <img
          src={entry.trophy_image}
          alt={entry.name}
          style={{ width: dims.img, height: dims.img, objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.5))" }}
        />
      </div>
      {entry.text && <p className="text-slate-300 text-[11px] leading-snug">{entry.text}</p>}
      <p className="text-white font-bold text-sm leading-tight">{entry.name}</p>
    </div>
  );
}
