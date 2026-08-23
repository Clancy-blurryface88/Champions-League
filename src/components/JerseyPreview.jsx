import React, { useId } from "react";

const SIZES = {
  sm: { w: 150, h: 170 },
  md: { w: 220, h: 250 },
  lg: { w: 280, h: 318 },
};

const TORSO_PATH = `M100,14
  C100,6 110,0 122,0
  Q150,10 178,0
  C190,0 200,6 200,14
  L206,300
  Q150,314 94,300
  Z`;

const SLEEVE_LEFT_PATH = `M100,14 L60,30 L38,90 L72,102 L100,90 Z`;
const SLEEVE_RIGHT_PATH = `M200,14 L240,30 L262,90 L228,102 L200,90 Z`;
const CUFF_LEFT_PATH = `M48,78 L78,90 L72,102 L38,90 Z`;
const CUFF_RIGHT_PATH = `M252,78 L222,90 L228,102 L262,90 Z`;

export default function JerseyPreview({ name = "", number = "", size = "md", className = "" }) {
  const gradId = useId();
  const shadeId = useId();
  const patternId = useId();

  const displayName = (name || "").trim().toUpperCase().slice(0, 14);
  const displayNumber = String(number ?? "").replace(/[^0-9]/g, "").slice(0, 2);
  const numberFontSize = displayNumber.length >= 2 ? 84 : 100;
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
          <stop offset="0%" stopColor="#2f9bf5" />
          <stop offset="50%" stopColor="#0e6dd1" />
          <stop offset="100%" stopColor="#06407e" />
        </linearGradient>
        <linearGradient id={shadeId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
          <stop offset="18%" stopColor="rgba(0,0,0,0)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="82%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
        </linearGradient>
        <pattern id={patternId} width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
          <path d="M13,0 L26,22 L0,22 Z" fill="rgba(255,255,255,0.04)" />
        </pattern>
        <clipPath id={`${gradId}-clip`}>
          <path d={TORSO_PATH} />
          <path d={SLEEVE_LEFT_PATH} />
          <path d={SLEEVE_RIGHT_PATH} />
        </clipPath>
      </defs>

      {/* Sleeves (drawn first so the torso overlaps their inner edge cleanly) */}
      <path d={SLEEVE_LEFT_PATH} fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={SLEEVE_RIGHT_PATH} fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.22)" strokeWidth="1.5" strokeLinejoin="round" />
      <path d={CUFF_LEFT_PATH} fill="rgba(255,255,255,0.82)" />
      <path d={CUFF_RIGHT_PATH} fill="rgba(255,255,255,0.82)" />

      {/* Torso */}
      <path d={TORSO_PATH} fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinejoin="round" />

      {/* Fabric texture + shading, clipped to the whole silhouette */}
      <g clipPath={`url(#${gradId}-clip)`}>
        <path d={`${TORSO_PATH} ${SLEEVE_LEFT_PATH} ${SLEEVE_RIGHT_PATH}`} fill={`url(#${patternId})`} />
        <rect x="0" y="0" width="300" height="340" fill={`url(#${shadeId})`} />
      </g>

      {/* Collar trim */}
      <path
        d="M106,4 Q150,23 194,4"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <image href="/champions/ch-logo.png" x="134" y="19" width="32" height="32" opacity="0.92" />

      {displayName && (
        <text
          x="150"
          y="112"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontWeight="800"
          fontSize="24"
          fill="white"
          stroke="rgba(3,20,45,0.4)"
          strokeWidth="1"
          paintOrder="stroke"
          textLength={displayName.length > 7 ? 92 : undefined}
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
          stroke="rgba(3,20,45,0.4)"
          strokeWidth="1.5"
          paintOrder="stroke"
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
