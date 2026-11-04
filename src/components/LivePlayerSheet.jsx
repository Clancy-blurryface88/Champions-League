import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";

// The live table's participant window: three tabs — the live matches with the points each
// prediction earns right now (and the sum written out as a calculation), the same points in
// detail (exact score, outcome, both teams score, goals range), and the live table.

const GOLD = "#facc15", GREEN = "#34d399", BLUE = "#7cadee", MUTED = "#94a3b8";
const NUM = { fontFamily: "var(--num-font)" };
const f2 = (v) => (Math.round(v * 100) / 100).toFixed(2);
const Signed = ({ v }) => <span dir="ltr">{v > 0 ? "+" : ""}{f2(v)}</span>;
const tone = (v) => (v > 0 ? GOLD : "#64748b");
const PARTS = [["exact", "תוצאה מדויקת"], ["outcome", "כיוון המשחק"], ["btts", "שתי הקבוצות כובשות"], ["range", "טווח שערים"]];

// the prediction between the two teams' logos; the live score is already on the strip above
// the table, so the window doesn't repeat it
const Digits = ({ v }) => <span dir="ltr" className="font-black text-white tabular-nums text-[13px]" style={NUM}>{v}</span>;
const Pred = ({ mp, size = 15 }) => (
  <span dir="ltr" className="flex items-center gap-1.5">
    <TeamFlag logo={mp.homeLogo} name={mp.home} size={size} rounded="sm" />
    <Digits v={mp.predicted} />
    <TeamFlag logo={mp.awayLogo} name={mp.away} size={size} rounded="sm" />
  </span>
);

// one live match as slanted plates, like the live table's rows: the points plate (gold when it
// earns something), the prediction between the two logos, and a stripe on the right for what it
// hits right now — green the exact score, yellow the outcome, red neither
const SK = { transform: "skewX(-12deg)" }, UNSK = { transform: "skewX(12deg)" };
export function GameCard({ mp, compact = false }) {
  const stripe = mp.isExact ? "#22c55e" : mp.isHit ? "#facc15" : "#ef4444";
  return (
    <div className={`flex ${compact ? "h-9" : "h-12"} items-stretch gap-1`} dir="ltr">
      <span className={`grid ${compact ? "w-[56px] text-[12px]" : "w-[64px] text-[13px]"} place-items-center rounded-sm font-black`}
        style={{ ...SK, ...NUM, background: mp.points > 0 ? "linear-gradient(135deg,#fde047,#eab308)" : "rgba(255,255,255,0.08)", color: mp.points > 0 ? "#3a2a00" : "#64748b" }}>
        <span style={UNSK}>{mp.points > 0 ? "+" : ""}{f2(mp.points)}</span>
      </span>
      <span className="flex flex-1 items-center justify-center gap-3 rounded-sm" style={{ ...SK, background: "linear-gradient(90deg,#1e2a78,#0b1440)" }}>
        <span style={UNSK}><TeamFlag logo={mp.homeLogo} name={mp.home} size={compact ? 15 : 18} rounded="sm" /></span>
        <span style={{ ...UNSK, ...NUM }} className={`${compact ? "text-[16px]" : "text-[20px]"} font-black text-white`}>{mp.predicted}</span>
        <span style={UNSK}><TeamFlag logo={mp.awayLogo} name={mp.away} size={compact ? 15 : 18} rounded="sm" /></span>
      </span>
      <span className="w-3 rounded-sm" style={{ ...SK, background: stripe }} />
    </div>
  );
}

export default function LivePlayerSheet({ player, rows, onClose, Card = GameCard }) {
  const [tab, setTab] = useState("games");
  const preds = player.matchPredictions || [];
  const delta = (player.officialRank ?? player.liveRank) - player.liveRank;
  const before = player.total - player.liveBonus;
  // a full night (up to 9 live matches) has to fit one phone screen: smaller rows from 4 matches
  const compact = preds.length >= 4;

  return (
    <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }} exit={{ scale: 0.92, opacity: 0 }}
      onClick={(e) => e.stopPropagation()} dir="rtl"
      className="rounded-2xl p-4 w-full max-w-sm flex flex-col" style={{ background: "#0b1a2e", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "calc(100dvh - 24px)" }}>
      {/* who, where, and the live points */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[16px] font-black text-white">{player.name}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            מקום {player.liveRank} · {f2(player.total)} נק׳
            {delta > 0 ? <span className="flex items-center gap-0.5 font-bold" style={{ color: GREEN }}><TrendingUp className="w-3 h-3" />{delta}</span>
              : delta < 0 ? <span className="flex items-center gap-0.5 font-bold text-rose-400"><TrendingDown className="w-3 h-3" />{-delta}</span>
              : <Minus className="w-3 h-3 text-slate-500" />}
          </div>
        </div>
        <div className="text-left">
          <div className="text-[10px] text-slate-400">כרגע במשחקים החיים</div>
          <div className="text-[22px] font-black leading-none" style={{ ...NUM, color: GOLD }}><Signed v={player.liveBonus} /></div>
        </div>
      </div>

      {/* slanted tabs; the selected one in the green-to-cyan of the home screen's next round, the others white with blue text */}
      <div className="flex gap-1 mb-3 px-1">
        {[["games", "משחקים"], ["detail", "מפורט"], ["table", "בטבלה"]].map(([k, l]) => {
          const active = tab === k;
          return (
            <button key={k} onClick={() => setTab(k)} className="relative flex-1 flex items-center justify-center py-2 px-1"
              style={{ transform: "skewX(-12deg)", background: "linear-gradient(180deg,#f8fafc,#cbd5e1)" }}>
              {active && <motion.div layoutId="livePlayerTab" className="absolute inset-0" style={{ background: "linear-gradient(135deg,#22c55e,#00e0ff)" }} transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} />}
              <span className="relative z-10 text-[12px] font-bold leading-tight whitespace-nowrap transition-colors" style={{ transform: "skewX(12deg)", color: active ? "#04201d" : "#1e40af" }}>{l}</span>
            </button>
          );
        })}
      </div>

      {!preds.length ? <p className="text-slate-500 text-xs text-center py-4">אין ניחושים למשחקים החיים כרגע</p> : (
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="min-h-0 flex-1 overflow-y-auto" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {tab === "games" && (
              <>
                <div className={compact ? "space-y-1.5" : "space-y-2"}>{preds.map((mp, i) => <Card key={i} mp={mp} compact={compact} />)}</div>
                {/* the total, written out as a sum */}
                <div className={`${compact ? "mt-2 py-2 text-[11.5px]" : "mt-3 py-2.5 text-[12px]"} rounded-xl px-3`} style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.18)" }}>
                  {/* with many matches the cards above already list each one's points: the sum starts from the total */}
                  {!compact && preds.map((mp, i) => (
                    <div key={i} className="flex items-center justify-between py-0.5 text-slate-300">
                      <Pred mp={mp} size={13} />
                      <span className="tabular-nums" style={NUM}>{f2(mp.points)}</span>
                    </div>
                  ))}
                  {!compact && <div className="my-1.5 border-t border-dashed border-white/25" />}
                  <div className="flex items-center justify-between font-black">
                    <span className="text-slate-100"><span className="ml-1 text-slate-500">=</span>במשחקים החיים</span>
                    <span className="tabular-nums text-[15px]" style={{ ...NUM, color: GOLD }}>{f2(player.liveBonus)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-slate-400"><span>לפני המשחקים</span><span className="tabular-nums" style={NUM}>{f2(before)}</span></div>
                  <div className="flex items-center justify-between text-slate-400"><span>במשחקים החיים</span><span className="tabular-nums" style={NUM}>{f2(player.liveBonus)}</span></div>
                  <div className="my-1.5 border-t border-dashed border-white/25" />
                  <div className="flex items-center justify-between font-bold text-white"><span><span className="ml-1 text-slate-500">=</span>סה״כ בטבלה כרגע</span><span className="tabular-nums text-[14px]" style={NUM}>{f2(player.total)}</span></div>
                </div>
              </>
            )}

            {tab === "detail" && (
              <div className="space-y-3">
                {preds.map((mp, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <div className="flex items-center justify-between text-[12px] mb-1.5">
                      <span dir="ltr" className="flex items-center gap-1 min-w-0 text-slate-300">
                        <TeamFlag logo={mp.homeLogo} name={mp.home} size={14} rounded="sm" /><span className="truncate">{mp.home} - {mp.away}</span><TeamFlag logo={mp.awayLogo} name={mp.away} size={14} rounded="sm" />
                      </span>
                    </div>
                    <div className="mb-2 flex items-center gap-1 text-[11px] text-slate-300">ניחש <Digits v={mp.predicted} /></div>
                    <div className="space-y-1 text-[11.5px]">
                      {PARTS.map(([k, l]) => { const v = mp.parts?.[k] || 0; return (
                        <div key={k} className="flex items-center justify-between" style={{ color: v ? GREEN : "#475569" }}>
                          <span>{v ? "✓" : "✕"} {l}</span><span className="tabular-nums" style={NUM}>{v ? f2(v) : "0"}</span>
                        </div>); })}
                      <div className="flex items-center justify-between border-t border-white/10 pt-1 font-bold" style={{ color: tone(mp.points) }}>
                        <span>סה״כ במשחק</span><span className="tabular-nums" style={NUM}><Signed v={mp.points} /></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "table" && (
              <div className="space-y-1">
                {rows.map((r) => (
                  <div key={r.userId} className="flex items-center justify-between rounded-lg px-3 py-1.5 text-[12px]"
                    style={{ background: r.userId === player.userId ? "rgba(250,204,21,0.12)" : "transparent", color: r.userId === player.userId ? "#fff" : MUTED }}>
                    <span><b className="ml-2" style={NUM}>{r.liveRank}</b>{r.name}</span>
                    <span className="tabular-nums">{f2(r.total)} <span className="text-[10.5px]" style={{ color: tone(r.liveBonus) }}>(<Signed v={r.liveBonus} />)</span></span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <button onClick={onClose} className="w-full mt-4 py-2 rounded-lg text-slate-300 text-xs font-semibold"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        סגור
      </button>
    </motion.div>
  );
}
