import React, { useId } from "react";

const SIZES = {
  sm: { w: 150, h: 170 },
  md: { w: 220, h: 250 },
  lg: { w: 280, h: 318 },
};

export default function JerseyPreview({ name = "", number = "", size = "md", className = "" }) {
  const gradId = useId();
  const patternId = useId();

  const displayName = (name || "").trim().toUpperCase().slice(0, 14);
  const displayNumber = String(number ?? "").replace(/[^0-9]/g, "").slice(0, 2);
  const numberFontSize = displayNumber.length >= 2 ? 92 : 110;
  const { w, h } = SIZES[size] || SIZES.md;

  return (
    <svg
      viewBox="0 0 300 340"
      width={w}
      height={h}
      className={className}
      role="img"
      aria-label={`חולצת ${displayName || "שחקן"}${displayNumber ? " מספר " + displayNumber : ""}`}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1487e8" />
          <stop offset="55%" stopColor="#0a63b8" />
          <stop offset="100%" stopColor="#063f78" />
        </linearGradient>
        <pattern id={patternId} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <path d="M13,0 L26,22 L0,22 Z" fill="rgba(255,255,255,0.035)" />
        </pattern>
      </defs>

      <path
        d="M78,18
           C78,7 92,0 112,0
           Q150,16 188,0
           C208,0 222,7 222,18
           L222,38
           L268,58
           L256,112
           L222,96
           L222,306
           Q150,322 78,306
           L78,96
           L44,112
           L32,58
           L78,38
           Z"
        fill={`url(#${gradId})`}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.5"
      />
      <path
        d="M78,18
           C78,7 92,0 112,0
           Q150,16 188,0
           C208,0 222,7 222,18
           L222,38
           L268,58
           L256,112
           L222,96
           L222,306
           Q150,322 78,306
           L78,96
           L44,112
           L32,58
           L78,38
           Z"
        fill={`url(#${patternId})`}
      />

      <path
        d="M104,3 Q150,24 196,3"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <rect x="248" y="96" width="20" height="14" fill="rgba(255,255,255,0.85)" transform="rotate(20 258 103)" />
      <rect x="32" y="96" width="20" height="14" fill="rgba(255,255,255,0.85)" transform="rotate(-20 42 103)" />

      <image href="/champions/ch-logo.png" x="134" y="20" width="32" height="32" opacity="0.92" />

      {displayName && (
        <text
          x="150"
          y="112"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="28"
          fill="white"
          textLength={displayName.length > 8 ? 188 : undefined}
          lengthAdjust="spacingAndGlyphs"
        >
          {displayName}
        </text>
      )}

      {displayNumber && (
        <text
          x="150"
          y="232"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize={numberFontSize}
          fill="white"
        >
          {displayNumber}
        </text>
      )}

      {!displayName && !displayNumber && (
        <text x="150" y="175" textAnchor="middle" fontSize="15" fill="rgba(255,255,255,0.45)">
          התצוגה שלך כאן
        </text>
      )}
    </svg>
  );
}
