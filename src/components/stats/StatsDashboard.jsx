import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";

// "סטטיסטיקה" tab as a dashboard: small tiles that zoom open into a full
// screen holding the tab's existing cards. Nothing here computes stats — every
// number comes from the props MyStats already calculates.

const TILE_BG = {
  background: "linear-gradient(160deg, rgba(19,37,74,0.88), rgba(15,29,58,0.88))",
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 8px 28px rgba(0,0,0,0.30)",
};

// "League Phase - 2" → "מחזור 2"; any other name stays as it is
const shortRound = (name = "") => {
  const m = name.match(/(\d+)\s*$/);
  return m ? `מחזור ${m[1]}` : name;
};

const fmt = (v) => {
  const n = Number(v) || 0;
  return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(2)));
};

function TileHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-1.5 text-[12.5px] font-bold text-slate-400">
      <span>{title}</span>
      <span className="text-sm">{icon}</span>
    </div>
  );
}

function Tile({ id, title, icon, wide, onOpen, children }) {
  return (
    <motion.div
      layoutId={`stats-tile-${id}`}
      onClick={onOpen}
      whileTap={{ scale: 0.97 }}
      className={`relative cursor-pointer overflow-hidden rounded-[18px] p-[11px] ${wide ? "col-span-2" : ""}`}
      style={TILE_BG}
    >
      <TileHeader title={title} icon={icon} />
      <div className="absolute left-[9px] top-[9px] grid h-[18px] w-[18px] place-items-center rounded-md bg-white/5 text-slate-400">
        <Maximize2 size={9} />
      </div>
      {children}
    </motion.div>
  );
}

export default function StatsDashboard({
  averagePointsPerMatch,
  averagePointsPerRound,
  bestMatch,
  chartData,
  pointsPercentageChartData,
  exactHitsChartData,
  totalExactHits,
  panels,
}) {
  const [open, setOpen] = useState(null);

  // Last round that already has finished matches
  const lastIdx = chartData.reduce((last, d, i) => (d.played ? i : last), -1);
  const lastRound = lastIdx >= 0 ? chartData[lastIdx] : null;
  const lastPct = lastIdx >= 0 ? pointsPercentageChartData[lastIdx]?.percentage : null;
  const lastHits = lastIdx >= 0 ? exactHitsChartData[lastIdx]?.exactHits ?? 0 : null;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const TILES = {
    avg: { title: "ממוצעים", icon: "📊" },
    pts: { title: "ניקוד וצבירה", icon: "💰" },
    hits: { title: "פגיעות", icon: "🎯" },
    map: { title: "מפת ניחושים", icon: "🗺️" },
  };

  return (
    <div dir="rtl">
      <div className="grid grid-cols-2 gap-2.5">
        {/* REEL — opens the existing Champions Reel, like the old button */}
        <motion.div
          whileTap={{ scale: 0.97 }}
          onClick={() => window.dispatchEvent(new Event("openYearlySummaryPanel"))}
          className="relative cursor-pointer overflow-hidden rounded-[18px] p-[11px]"
          style={TILE_BG}
        >
          <TileHeader title="REEL" icon="🎬" />
          <div className="mt-2 flex flex-col items-center gap-2">
            <div className="flex w-full gap-[3px]">
              {[0, 1, 2, 3].map((i) => (
                <i key={i} className="h-[3px] flex-1 rounded-sm" style={{ background: i === 0 ? "#facc15" : "rgba(255,255,255,0.19)" }} />
              ))}
            </div>
            <div
              className="grid h-10 w-10 place-items-center rounded-full pl-[3px] text-sm"
              style={{ background: "linear-gradient(135deg,#facc15,#f59e0b)", color: "#1a1200", boxShadow: "0 0 22px rgba(250,204,21,0.35)" }}
            >
              ▶
            </div>
            <p className="text-center text-[11.5px] text-slate-400">הסיכום האישי שלך בטורניר</p>
          </div>
        </motion.div>

        {/* Averages + best game */}
        <Tile id="avg" {...TILES.avg} onOpen={() => setOpen("avg")}>
          <div className="mt-[7px] flex gap-[5px]">
            {[
              [averagePointsPerMatch, "למשחק"],
              [averagePointsPerRound, "למחזור"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-1 flex-col items-center rounded-lg bg-white/[0.03] py-[3px]">
                <b className="text-[14.5px] text-white">{fmt(v)}</b>
                <span className="text-[10.5px] text-slate-400">{l}</span>
              </div>
            ))}
          </div>
          <div className="mt-1.5 text-center">
            <p className="text-[10.5px] text-slate-400">המשחק הכי טוב</p>
            {bestMatch ? (
              <>
                <div dir="ltr" className="my-0.5 flex items-center justify-center gap-1.5">
                  <TeamFlag logo={bestMatch.match.team_a_logo} name={bestMatch.match.team_a} size={21} />
                  <b className="text-[15px] font-black text-white">
                    {bestMatch.match.actual_score_a} - {bestMatch.match.actual_score_b}
                  </b>
                  <TeamFlag logo={bestMatch.match.team_b_logo} name={bestMatch.match.team_b} size={21} />
                </div>
                <p className="text-xs font-black" style={{ color: "#facc15" }}>
                  {fmt(bestMatch.prediction.points_earned)} נק׳
                </p>
              </>
            ) : (
              <p className="mt-1 text-[11px] text-slate-500">יופיע אחרי שתצבור נקודות</p>
            )}
          </div>
        </Tile>

        {/* Points & accumulation — last round at a glance */}
        <Tile id="pts" {...TILES.pts} onOpen={() => setOpen("pts")}>
          {lastRound ? (
            <>
              <p className="mt-2 text-[11.5px] text-slate-400">{shortRound(lastRound.round)}</p>
              <p className="text-[27px] font-black leading-tight" style={{ color: "#facc15" }}>{fmt(lastRound.roundPoints)}</p>
              <p className="text-[11.5px] text-slate-400">נקודות · {fmt(lastPct)}% מהמקסימום</p>
            </>
          ) : (
            <p className="mt-3 text-[11.5px] text-slate-500">יופיע אחרי המשחקים הראשונים</p>
          )}
        </Tile>

        {/* Exact hits — last round at a glance */}
        <Tile id="hits" {...TILES.hits} onOpen={() => setOpen("hits")}>
          {lastRound ? (
            <>
              <p className="mt-2 text-[11.5px] text-slate-400">{shortRound(lastRound.round)}</p>
              <p className="text-[27px] font-black leading-tight" style={{ color: "#34d399" }}>{lastHits}</p>
              <p className="text-[11.5px] text-slate-400">
                {lastHits === 1 ? "פגיעה מדויקת" : "פגיעות מדויקות"} · {totalExactHits} בטורניר
              </p>
            </>
          ) : (
            <p className="mt-3 text-[11.5px] text-slate-500">יופיע אחרי המשחקים הראשונים</p>
          )}
        </Tile>

        {/* Predictions map — the coloured squares live only inside */}
        <Tile id="map" {...TILES.map} wide onOpen={() => setOpen("map")}>
          <p className="mt-1 text-[11.5px] text-slate-400">כל משחק כמשבצת: פגיעה, כיוון נכון או שגיאה</p>
        </Tile>
      </div>

      {createPortal(
        <AnimatePresence>
          {open && (
            <>
              <motion.div
                key="stats-dim"
                className="fixed inset-0 z-[70] bg-black/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(null)}
              />
              <motion.div
                key="stats-sheet"
                layoutId={`stats-tile-${open}`}
                dir="rtl"
                className="fixed inset-0 z-[71] flex flex-col overflow-hidden"
                style={{ background: "linear-gradient(180deg, #13254a, #070f22 60%)", borderRadius: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 36 }}
              >
                <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-4 pb-2.5 pt-4">
                  <div className="flex items-center gap-2 text-[19px] font-black text-white">
                    <span>{TILES[open].title}</span>
                    <span>{TILES[open].icon}</span>
                  </div>
                  <button
                    onClick={() => setOpen(null)}
                    aria-label="סגירה"
                    className="grid h-[34px] w-[34px] place-items-center rounded-[11px] border border-white/10 bg-white/[0.07] text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.25 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                  className="mx-auto w-full max-w-2xl flex-1 space-y-4 overflow-y-auto px-4 pb-8 pt-1"
                >
                  {panels[open]}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
