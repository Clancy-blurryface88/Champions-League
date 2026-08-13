import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const WEEKDAY_LABELS = ["א", "ב", "ג", "ד", "ה", "ו", "ש"];

// Month-navigable mini calendar for jumping straight to a marked date
// (dates that actually have matches). markedDates is a Set of "YYYY-MM-DD" keys.
export default function QuickJumpCalendar({ calMonth, setCalMonth, markedDates, selected, onPick }) {
  const y = calMonth.getFullYear(), m = calMonth.getMonth();
  const first = new Date(y, m, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const key = (day) => `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="px-5 pb-3">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setCalMonth(new Date(y, m - 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/8">
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-white/70 text-xs font-bold">{calMonth.toLocaleDateString("he-IL", { month: "long", year: "numeric" })}</span>
        <button onClick={() => setCalMonth(new Date(y, m + 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/8">
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[9px] text-white/25">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dk = key(day);
          const hasMatch = markedDates.has(dk);
          const isSel = dk === selected;
          return (
            <button
              key={i}
              disabled={!hasMatch}
              onClick={() => hasMatch && onPick(dk)}
              className="relative aspect-square rounded-md flex items-center justify-center text-[10px]"
              style={{
                background: isSel ? "rgba(9,122,220,0.25)" : "transparent",
                border: isSel ? "1px solid rgba(9,122,220,0.6)" : "1px solid transparent",
                color: hasMatch ? "#fff" : "rgba(255,255,255,0.2)",
                fontWeight: hasMatch ? 700 : 400,
              }}
            >
              {day}
              {hasMatch && !isSel && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
