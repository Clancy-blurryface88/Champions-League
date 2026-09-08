import React from "react";

// A gold corner bracket that hugs the top-left corner of its own box by
// default — rotate 0/90/180/270 to hug each of a cabinet's 4 corners.
// Shared by every "trophy cabinet" style Hall of Fame layout.
export default function CornerFlourish({ style }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="absolute pointer-events-none" style={{ opacity: 0.55, ...style }}>
      <path d="M3 18 L3 7 Q3 3 7 3 L18 3" stroke="#f5c518" strokeWidth="1.4" fill="none" />
      <circle cx="3" cy="18" r="1.6" fill="#f5c518" />
    </svg>
  );
}
