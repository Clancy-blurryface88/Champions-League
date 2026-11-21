import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { teamHe } from "@/utils/teamHe";

// "הניחושים שלי" in the predictions-and-results page (21.11.2026, design 23 + 27's tap): a frosted panel of
// slanted rows, each tinted by how the pick did (green exact / gold direction / blue some points / red nothing),
// the points in a slanted colour block at the end. A tap on a row opens where its points came from.
// On top: the round's points, the rank, and two counts only — exact hits and right direction.

const NUM = "var(--num-font)";
const GREEN = "#22c55e", GOLD = "#facc15", BLUE = "#60a5fa", RED = "#f87171", GREY = "#64748b";
const ease = [0.23, 1, 0.32, 1];
const SK = 10;
const TPL = "1fr 38px 38px";

const verdict = (d) => (d.actual === "Not finished" ? GREY : d.exactScore ? GREEN : d.correctOutcome ? GOLD : d.points > 0 ? BLUE : RED);
const Num = ({ children, s = 14, c = "#fff", style }) => <span dir="ltr" style={{ fontFamily: NUM, fontWeight: 800, fontSize: s, color: c, fontVariantNumeric: "tabular-nums", ...style }}>{children}</span>;
const Logo = ({ src, s = 15 }) => (src ? <img src={src} alt="" style={{ width: s, height: s, objectFit: "contain", flexShrink: 0, filter: "drop-shadow(0 2px 3px rgba(0,0,0,.5))" }} /> : null);

function Breakdown({ d }) {
  const parts = [["כיוון", d.ocPts], ["טווח שערים", d.grPts], ["שתי כובשות", d.btPts], ["מדויקת", d.exPts]];
  return (
    <div className="flex flex-wrap justify-center gap-1.5" style={{ padding: "8px 0 4px" }}>
      {parts.map(([n, v]) => (
        <span key={n} style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 8, background: v > 0 ? "rgba(34,197,94,.16)" : "rgba(255,255,255,.05)", color: v > 0 ? "#86efac" : "rgba(255,255,255,.4)" }}>
          {n} <span dir="ltr">{v > 0 ? "+" + v.toFixed(2) : "0"}</span>
        </span>
      ))}
    </div>
  );
}

function Row({ d, match, i, open }) {
  const col = verdict(d);
  const done = d.actual !== "Not finished";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 18) * 0.03, duration: 0.35, ease }} className="flex"
      style={{ transform: `skewX(-${SK}deg)`, borderRadius: 8, overflow: "hidden", border: `1px solid ${col}40`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.15)",
        background: `linear-gradient(270deg, ${col}${open ? "66" : "2a"}, ${col}08 70%), linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.03))`, transition: "background .3s" }}>
      <div className="grid items-center" style={{ flex: 1, gridTemplateColumns: TPL, padding: "7px 6px", transform: `skewX(${SK}deg)` }}>
        <span className="flex items-center gap-1" style={{ minWidth: 0 }}>
          <Logo src={match.team_a_logo} /><Logo src={match.team_b_logo} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{teamHe(match.team_a)} – {teamHe(match.team_b)}</span>
        </span>
        <span className="text-center"><Num c="#bfdbfe">{d.prediction}</Num></span>
        <span className="text-center"><Num>{done ? d.actual : "–"}</Num></span>
      </div>
      <div className="grid place-items-center" style={{ width: 54, background: `linear-gradient(180deg, ${col}66, ${col}30)`, borderInlineStart: `1px solid ${col}66` }}>
        <span style={{ transform: `skewX(${SK}deg)` }}>{done ? <Num s={15} style={{ textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>{d.points.toFixed(2)}</Num> : <span style={{ fontSize: 13 }}>⏳</span>}</span>
      </div>
    </motion.div>
  );
}

export default function MyRoundTable({ details, matches, earned, rank, of }) {
  const [open, setOpen] = React.useState(null);
  const done = details.filter((d) => d.actual !== "Not finished");
  const exact = done.filter((d) => d.exactScore).length;
  const dir = done.filter((d) => !d.exactScore && d.correctOutcome).length;
  return (
    <div dir="rtl" style={{ color: "#fff" }}>
      <div style={{ margin: "0 0 12px", padding: 12, borderRadius: 16, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
        <div className="flex items-baseline justify-center gap-2">
          <Num s={40}>{earned.toFixed(2)}</Num>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)", fontWeight: 700 }}>נק׳{rank ? ` · מקום ${rank} מתוך ${of}` : ""}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5" style={{ marginTop: 8 }}>
          {[["🎯 פגיעות מדויקות", exact, GREEN], ["✓ כיוון", dir, GOLD]].map(([t, v, c]) => (
            <div key={t} className="text-center" style={{ padding: "5px 0", borderRadius: 10, background: `${c}18` }}>
              <Num s={20} c={c}>{v}</Num><div style={{ fontSize: 10.5, fontWeight: 800, color: c }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderRadius: 18, padding: "6px 4px", background: "linear-gradient(160deg,rgba(255,255,255,.12),rgba(255,255,255,.03))", border: "1px solid rgba(255,255,255,.16)", backdropFilter: "blur(14px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)" }}>
        <div className="grid items-center" style={{ gridTemplateColumns: "1fr 38px 38px 58px", padding: "4px 16px", fontSize: 10.5, fontWeight: 800, color: "rgba(255,255,255,.5)" }}>
          <span>משחק</span><span className="text-center">ניחוש</span><span className="text-center">תוצאה</span><span className="text-center">נק׳</span>
        </div>
        <div className="grid" style={{ gap: 6, padding: "0 8px" }}>
          {details.map((d, i) => {
            const match = matches.find((m) => m.id === d.matchId);
            if (!match) return null;
            const canOpen = d.actual !== "Not finished";
            return (
              <div key={d.matchId}>
                <button type="button" className="w-full" style={{ textAlign: "right", cursor: canOpen ? "pointer" : "default" }} onClick={() => canOpen && setOpen(open === i ? null : i)}>
                  <Row d={d} match={match} i={i} open={open === i} />
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} style={{ overflow: "hidden" }}>
                      <Breakdown d={d} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
      <div className="text-center" style={{ fontSize: 11, color: "rgba(255,255,255,.5)", marginTop: 6 }}>לחיצה על משחק – מאיפה הגיעו הנקודות</div>
    </div>
  );
}
