import React from "react";

// Small green progress ring showing how many of a day's matches have finished.
export default function MatchCountRing({ finished, total, active, size = 22, activeClassName = "text-sky-400/90", inactiveClassName = "text-white/40" }) {
  const pct = total ? finished / total : 0;
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2},${size / 2}) rotate(-90)`}>
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2.5} />
          <circle
            r={r} fill="none" stroke="#4ade80" strokeWidth={2.5}
            strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 3px rgba(74,222,128,0.75))" }}
          />
        </g>
      </svg>
      <span className={`absolute text-[8px] font-bold ${active ? activeClassName : inactiveClassName}`}>
        {finished}/{total}
      </span>
    </div>
  );
}
