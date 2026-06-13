import React, { useMemo, useState } from "react";

export default function CommonPredictionsStripe({ predictions = [] }) {
  const [hovered, setHovered] = useState(null);

  const { data, total } = useMemo(() => {
    const map = {};
    predictions.forEach(p => {
      if (p.predicted_score_a === null || p.predicted_score_b === null) return;
      const key = `${p.predicted_score_a}-${p.predicted_score_b}`;
      if (!map[key]) map[key] = { score: key, count: 0, hits: 0 };
      map[key].count++;
      if ((p.exact_score_points_earned || 0) > 0) map[key].hits++;
    });
    const sorted = Object.values(map).sort((a, b) => b.count - a.count);
    const total  = sorted.reduce((s, d) => s + d.count, 0);
    return { data: sorted, total };
  }, [predictions]);

  if (data.length === 0) return null;

  const max        = data[0].count;
  const totalHits  = data.reduce((s, d) => s + d.hits, 0);

  return (
    <div>
      {/* Summary */}
      <div className="flex gap-6 mb-4">
        {[
          { label: "סה״כ ניחושים", value: total },
          { label: "סה״כ פגיעות",  value: totalHits },
          { label: "תוצאות שונות", value: data.length },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[10px] mb-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{label}</p>
            <p className="text-xl font-black" style={{ color: "rgba(255,255,255,0.6)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-3 pb-2 mb-1"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <span className="w-5 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>#</span>
        <span className="w-12 text-[10px]"           style={{ color: "rgba(255,255,255,0.55)" }}>תוצאה</span>
        <span className="flex-1 hidden sm:block" />
        <span className="w-28 text-[10px] text-center" style={{ color: "rgba(255,255,255,0.55)" }}>ניחושים</span>
        <span className="w-32 text-[10px] text-center" style={{ color: "rgba(255,255,255,0.55)" }}>פגיעות</span>
        <span className="w-12 text-[10px] text-right" style={{ color: "rgba(255,255,255,0.55)" }}>מהסה״כ</span>
      </div>

      {/* Rows */}
      <div>
        {data.map((d, i) => {
          const hitRate    = d.count > 0 ? ((d.hits / d.count) * 100).toFixed(0) : 0;
          const pctOfTotal = ((d.count / total) * 100).toFixed(0);
          const isTop      = i === 0;
          const isHov      = hovered === i;

          return (
            <div key={d.score}
              className="flex items-center gap-3 px-3 py-2.5 transition-colors"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: isHov ? "rgba(255,255,255,0.04)" : "transparent",
                cursor: "default",
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Rank */}
              <span className="w-5 text-[11px] font-mono flex-shrink-0"
                style={{ color: isTop ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.18)" }}>
                {i + 1}
              </span>

              {/* Score */}
              <span className="w-12 font-mono font-bold text-sm flex-shrink-0"
                style={{ color: isTop ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.55)" }}>
                {d.score}
              </span>

              {/* Bar */}
              <div className="flex-1 h-1.5 rounded-full overflow-hidden hidden sm:block"
                style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full"
                  style={{
                    width: `${(d.count / max) * 100}%`,
                    background: isTop ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.22)",
                  }} />
              </div>

              {/* Count */}
              <div className="w-28 flex-shrink-0 flex items-center justify-center gap-1.5">
                <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>ניחושים</span>
                <span className="text-sm font-bold"
                  style={{ color: isTop ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.45)" }}>
                  {d.count}
                </span>
              </div>

              {/* Hits */}
              <div className="w-32 flex-shrink-0 flex items-center justify-center gap-1">
                {d.hits > 0 ? (
                  <>
                    <span className="text-[11px]" style={{ color: "rgba(52,211,153,0.45)" }}>פגיעות</span>
                    <span className="text-sm font-bold" style={{ color: "rgba(52,211,153,0.85)" }}>{d.hits}</span>
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>({hitRate}%)</span>
                  </>
                ) : (
                  <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>פגיעות 0</span>
                )}
              </div>

              {/* % of total */}
              <div className="w-12 text-right flex-shrink-0">
                <span className="text-[11px] font-semibold"
                  style={{ color: isTop ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)" }}>
                  {pctOfTotal}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
