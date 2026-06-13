import React, { useState } from "react";

// ── Data with hits ────────────────────────────────────────────────────────────
const DATA = [
  { score: "1-0", count: 12, hits: 5  },
  { score: "1-1", count: 10, hits: 3  },
  { score: "2-1", count: 9,  hits: 2  },
  { score: "2-0", count: 8,  hits: 1  },
  { score: "0-0", count: 7,  hits: 2  },
  { score: "3-1", count: 5,  hits: 1  },
  { score: "0-1", count: 5,  hits: 0  },
  { score: "2-2", count: 4,  hits: 1  },
];

const MAX   = DATA[0].count;
const TOTAL = DATA.reduce((s, d) => s + d.count, 0);

export default function AdminStripeDemo() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-1">הניחוש הנפוץ ביותר</h2>
        <p className="text-white/30 text-sm">
          {TOTAL} ניחושים בסה״כ · לחץ שורה להרחבה
        </p>
      </div>

      {/* Header row */}
      <div className="flex items-center gap-3 px-4 pb-2 mb-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="w-5 text-[10px] text-white/55 font-mono">#</span>
        <span className="w-12 text-[10px] text-white/55">תוצאה</span>
        <span className="flex-1 text-[10px] text-white/55 text-right hidden sm:block" />
        <span className="w-24 text-[10px] text-white/55 text-center">ניחושים</span>
        <span className="w-24 text-[10px] text-white/55 text-center">פגיעות</span>
        <span className="w-14 text-[10px] text-white/55 text-right">מהסה״כ</span>
      </div>

      {/* Rows */}
      <div>
        {DATA.map((d, i) => {
          const isHov = hovered === i;
          const hitRate = d.count > 0 ? ((d.hits / d.count) * 100).toFixed(0) : 0;
          const pctOfTotal = ((d.count / TOTAL) * 100).toFixed(0);

          return (
            <div
              key={d.score}
              className="group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: isHov ? "rgba(255,255,255,0.04)" : "transparent",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Rank */}
              <span className="w-5 text-[11px] font-mono flex-shrink-0"
                style={{ color: i === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)" }}>
                {i + 1}
              </span>

              {/* Score */}
              <span className="w-12 font-mono font-bold text-sm flex-shrink-0"
                style={{ color: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>
                {d.score}
              </span>

              {/* Bar */}
              <div className="flex-1 h-1.5 rounded-full overflow-hidden hidden sm:block"
                style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(d.count / MAX) * 100}%`,
                    background: i === 0 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.22)",
                  }} />
              </div>

              {/* Count */}
              <div className="w-24 flex-shrink-0 flex items-center justify-center gap-1.5">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.22)" }}>
                  ניחושים
                </span>
                <span className="text-sm font-bold"
                  style={{ color: i === 0 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)" }}>
                  {d.count}
                </span>
              </div>

              {/* Hits */}
              <div className="w-24 flex-shrink-0 flex items-center justify-center gap-1">
                {d.hits > 0 ? (
                  <>
                    <span className="text-[11px]" style={{ color: "rgba(52,211,153,0.45)" }}>
                      פגיעות
                    </span>
                    <span className="text-sm font-bold" style={{ color: "rgba(52,211,153,0.85)" }}>
                      {d.hits}
                    </span>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      ({hitRate}%)
                    </span>
                  </>
                ) : (
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                    פגיעות 0
                  </span>
                )}
              </div>

              {/* % of total */}
              <div className="w-14 text-right flex-shrink-0">
                <span className="text-[11px] font-semibold"
                  style={{ color: i === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)" }}>
                  {pctOfTotal}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer summary */}
      <div className="mt-4 pt-4 flex gap-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { label: "סה״כ ניחושים",  value: TOTAL },
          { label: "סה״כ פגיעות",   value: DATA.reduce((s, d) => s + d.hits, 0) },
          { label: "תוצאות שונות",  value: DATA.length },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] text-white/25 mb-0.5">{label}</p>
            <p className="text-xl font-black text-white/60">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
