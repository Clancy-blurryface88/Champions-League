import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { getTeamColor } from "@/utils/teamColors";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import OdometerValue from "@/components/OdometerValue";
import { motion, AnimatePresence } from "framer-motion";

// 1X2 panel in the "broadcast" look: the match card grows into a full-screen
// panel (and shrinks back on close), three tabs — simulator, markets, exact
// score (with a "draw diagonal" view). Numbers are Teko.

const CY = "#00e0ff", MG = "#ff2e88", INK = "#070822", MUTED = "#9aa3d6";
const NUM = "'Teko', sans-serif";
const NUM_W = 0.46; // odometer cell width ÷ height for Teko digits
const PANEL_BG = "linear-gradient(170deg,#1a1d5c 0%,#0d0f2e 40%,#070822 100%)";
const EASE = [0.2, 0.8, 0.2, 1];

function calcSimPoints(match, a, b) {
  if (a === null || b === null) return null;
  let total = 0;
  const breakdown = [];

  // כיוון
  let dirPts = 0;
  if (a > b)       dirPts = match.home_win_points || 0;
  else if (a === b) dirPts = match.draw_points      || 0;
  else              dirPts = match.away_win_points  || 0;
  breakdown.push({ label: 'כיוון משחק', pts: dirPts, hit: dirPts > 0 });
  total += dirPts;

  // BTTS
  const btts = a > 0 && b > 0;
  const bttsPts = btts ? (match.btts_yes_points || 0) : (match.btts_no_points || 0);
  breakdown.push({ label: 'שתי קבוצות כובשות', pts: bttsPts, hit: bttsPts > 0 });
  total += bttsPts;

  // טווח שערים
  const goals = a + b;
  let rangePts = 0;
  if (goals <= 2)      rangePts = match.goals_0_2_points    || 0;
  else if (goals <= 4) rangePts = match.goals_3_4_points    || 0;
  else                 rangePts = match.goals_5_plus_points || 0;
  breakdown.push({ label: 'טווח שערים', pts: rangePts, hit: rangePts > 0 });
  total += rangePts;

  // פגיעה מדויקת
  if (match.score_odds) {
    const key = `${a}:${b}`;
    const exactPts = match.score_odds[key] ?? match.score_odds['other'] ?? 0;
    breakdown.push({ label: 'פגיעה מדויקת', pts: exactPts, hit: exactPts > 0 });
    total += exactPts;
  }

  return { total: parseFloat(total.toFixed(2)), breakdown };
}

// iOS-style picker wheel (UIPickerView): scroll-snap column "–", 0…9; the
// centred row is the value. The "–" row (index 0) means nothing picked
// (value null). Scrolls to its initial value on mount only — remount (key)
// to reset.
const WHEEL_ITEM = 34;
const WHEEL_ROWS = [null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
function ScoreWheel({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: WHEEL_ROWS.indexOf(value) * WHEEL_ITEM }); }, []);
  const onScroll = () => {
    const idx = Math.max(0, Math.min(WHEEL_ROWS.length - 1, Math.round(ref.current.scrollTop / WHEEL_ITEM)));
    if (WHEEL_ROWS[idx] !== value) onChange(WHEEL_ROWS[idx]);
  };
  return (
    <div className="relative w-16 rounded-xl bg-white/[0.03] border border-white/10" style={{ height: WHEEL_ITEM * 3 }}>
      <div className="absolute inset-x-1 rounded-lg bg-white/10 pointer-events-none" style={{ top: WHEEL_ITEM, height: WHEEL_ITEM }} />
      <div
        ref={ref}
        onScroll={onScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", maskImage: "linear-gradient(transparent, #000 30%, #000 70%, transparent)", WebkitMaskImage: "linear-gradient(transparent, #000 30%, #000 70%, transparent)" }}
      >
        <div style={{ height: WHEEL_ITEM }} />
        {WHEEL_ROWS.map((n) => {
          const on = n === value;
          return (
            <div
              key={n ?? "none"}
              className="snap-center flex items-center justify-center tabular-nums transition-[opacity,transform] duration-150"
              style={{ height: WHEEL_ITEM, fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, opacity: on ? (n === null ? 0.6 : 1) : 0.35, transform: `scale(${on ? 1 : 0.85})` }}
            >
              {n === null ? "–" : n}
            </div>
          );
        })}
        <div style={{ height: WHEEL_ITEM }} />
      </div>
    </div>
  );
}

// 2 → 0 decimals, 1.5 → 1, 2.35 → 2 — so the odometer shows the value as-is.
const decimalsOf = (v) => Math.min(2, (String(v ?? '').split('.')[1] || '').length);

const Skew = ({ children, bg = MG, color = "#fff", deg = 12 }) => (
  <span className="inline-block font-black text-[11px] px-2.5 py-0.5" style={{ background: bg, color, transform: `skewX(-${deg}deg)` }}>
    <span className="inline-block" style={{ transform: `skewX(${deg}deg)` }}>{children}</span>
  </span>
);

// Odometer roll (same effect as the tables) in the broadcast number font.
const Odo = ({ v, h = 28, color = "#fff" }) => (
  <span dir="ltr" style={{ color, fontFamily: NUM, fontWeight: 700, fontSize: h }}>
    <OdometerValue target={Number(v) || 0} decimals={decimalsOf(v)} height={h} width={Math.round(h * NUM_W)} />
  </span>
);

// implied probability inside one market (1/points, normalised)
const probOf = (items) => {
  const inv = items.map(([, v]) => (v > 0 ? 1 / v : 0));
  const s = inv.reduce((a, b) => a + b, 0) || 1;
  return inv.map((x) => Math.round((x / s) * 100));
};

function Market({ title, items }) {
  const p = probOf(items);
  return (
    <div>
      <div className="mb-1.5"><Skew bg="rgba(255,255,255,.12)">{title}</Skew></div>
      <div className="flex gap-1">
        {items.map(([label, v], i) => (
          <div key={label} className="flex-1 text-center py-2" style={{ background: "rgba(255,255,255,.06)", transform: "skewX(-6deg)" }}>
            <div style={{ transform: "skewX(6deg)" }}>
              <Odo v={v} h={30} />
              <div className="text-[11px] font-bold">{label}</div>
              <span className="inline-block mt-1 px-1.5 text-[10px] font-black" style={{ background: CY, color: "#06102b" }}>{p[i]}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExactColumns({ scores }) {
  const cols = [
    ["1", (s) => s.a > s.b, "#34d399", (x, y) => (x.a + x.b) - (y.a + y.b) || x.a - y.a],
    ["X", (s) => s.a === s.b, "#facc15", (x, y) => x.a - y.a],
    ["2", (s) => s.a < s.b, CY, (x, y) => (x.a + x.b) - (y.a + y.b) || x.b - y.b],
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {cols.map(([label, filter, color, sort]) => (
        <div key={label}>
          <div className="text-center mb-1"><Skew bg={label === "X" ? MG : "rgba(255,255,255,.12)"}>{label}</Skew></div>
          <div className="space-y-1">
            {scores.filter(filter).sort(sort).map((s) => (
              <div key={s.k} className="flex justify-between items-center px-2 py-1" style={{ background: "rgba(255,255,255,.05)", borderInlineStart: `3px solid ${color}` }}>
                <span className="text-[17px] leading-none" style={{ fontFamily: NUM, fontWeight: 700, color }}>{s.v}</span>
                <span className="text-white/75 text-xs font-bold" dir="ltr">{s.a}:{s.b}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExactDiagonal({ scores, match }) {
  const N = Math.min(6, Math.max(5, ...scores.map((s) => Math.max(s.a, s.b) + 1)));
  const at = (a, b) => scores.find((s) => s.a === a && s.b === b);
  return (
    <div>
      <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: MUTED }} dir="ltr">
        <span>↓ {match.team_a}</span><span>{match.team_b} →</span>
      </div>
      <div className="grid gap-[3px]" dir="ltr" style={{ gridTemplateColumns: `repeat(${N},1fr)` }}>
        {[...Array(N)].flatMap((_, a) => [...Array(N)].map((_, b) => {
          const s = at(a, b), d = a === b;
          return (
            <div key={`${a}:${b}`} className="text-center py-1.5" style={{ background: d ? MG : a > b ? "rgba(0,224,255,.16)" : "rgba(255,255,255,.05)", transform: "skewX(-6deg)" }}>
              <div style={{ transform: "skewX(6deg)" }}>
                <div className="text-[10px] font-bold text-white/70">{a}:{b}</div>
                <div className="text-[18px] leading-none" style={{ fontFamily: NUM, fontWeight: 700 }}>{s ? s.v : "–"}</div>
              </div>
            </div>
          );
        }))}
      </div>
      <div className="flex justify-between text-[10px] font-bold mt-2">
        <span style={{ color: CY }}>■ {match.team_a} מנצחת</span>
        <span style={{ color: MG }}>■ תיקו</span>
        <span className="text-white/60">■ {match.team_b} מנצחת</span>
      </div>
    </div>
  );
}

const tabSwap = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
  transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] },
};

// clip-path that covers exactly the given screen rect (the match card)
const clipFor = (r) => r
  ? `inset(${r.top}px ${window.innerWidth - r.right}px ${window.innerHeight - r.bottom}px ${r.left}px round 18px)`
  : "inset(8% 6% 8% 6% round 18px)";

export default function MatchScoringRulesModal({ isOpen, onClose, match, originRect }) {
  // Both wheels start on "–"; the points breakdown opens once both are picked.
  const [simA, setSimA] = useState(null);
  const [simB, setSimB] = useState(null);
  const [tab, setTab] = useState("sim");
  const [diag, setDiag] = useState(false);
  const shown = useRef(null); // keeps the match while the close animation runs

  // reset for a newly opened match (not on close, so the panel doesn't jump while it shrinks)
  useEffect(() => {
    if (!match) return;
    setSimA(null);
    setSimB(null);
    setTab("sim");
    setDiag(false);
  }, [match?.id]);

  useModalBackButton(isOpen, onClose);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [isOpen, onClose]);

  if (match) shown.current = { match, originRect };
  const m = match || shown.current?.match;
  const rect = (match ? originRect : shown.current?.originRect) || null;
  if (!m) return null;

  const hasOdds = m.score_odds && Object.keys(m.score_odds).length > 0;
  const sim = calcSimPoints(m, simA, simB);
  const tabs = [
    ["sim", "סימולטור"],
    ["markets", "יחסים"],
    ...(hasOdds ? [["exact", "תוצאה מדויקת"]] : []),
  ];
  const scores = hasOdds
    ? Object.entries(m.score_odds).filter(([k]) => k !== "other").map(([k, v]) => { const [a, b] = k.split(":").map(Number); return { k, a, b, v }; })
    : [];
  const colorA = getTeamColor(m.team_a), colorB = getTeamColor(m.team_b);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="x12-panel"
          className="fixed inset-0 z-[80] overflow-hidden text-white"
          dir="rtl"
          style={{ background: PANEL_BG }}
          initial={{ clipPath: clipFor(rect) }}
          animate={{ clipPath: "inset(0px 0px 0px 0px round 0px)" }}
          exit={{ clipPath: clipFor(rect) }}
          transition={{ duration: 0.42, ease: EASE }}
        >
          <motion.div
            className="mx-auto flex h-full max-w-md flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.16, duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {/* header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <Skew bg={CY} color="#06102b"><span dir="ltr">1 X 2</span></Skew>
              <button onClick={onClose} aria-label="סגירה" className="w-9 h-9 grid place-items-center text-white/80" style={{ background: "rgba(255,255,255,.08)", transform: "skewX(-10deg)" }}>
                <span style={{ transform: "skewX(10deg)" }}>✕</span>
              </button>
            </div>

            {/* teams as a broadcast score bug */}
            <div className="mx-3 flex items-stretch h-14" dir="ltr">
              <div className="flex-1 min-w-0 flex items-center gap-2 px-3" style={{ background: `linear-gradient(90deg,${colorA},rgba(255,255,255,.06))` }}>
                <TeamFlag logo={m.team_a_logo} name={m.team_a} size={30} animate={false} />
                <b className="text-[13px] truncate">{m.team_a}</b>
              </div>
              <div className="w-14 grid place-items-center flex-shrink-0" style={{ background: "#fff", color: INK, fontFamily: NUM, fontSize: 30, fontWeight: 700, clipPath: "polygon(12% 0,100% 0,88% 100%,0 100%)" }}>VS</div>
              <div className="flex-1 min-w-0 flex items-center justify-end gap-2 px-3" style={{ background: `linear-gradient(270deg,${colorB},rgba(255,255,255,.06))` }}>
                <b className="text-[13px] truncate">{m.team_b}</b>
                <TeamFlag logo={m.team_b_logo} name={m.team_b} size={30} animate={false} />
              </div>
            </div>

            {/* tabs */}
            <div className="flex gap-1 mx-3 mt-3">
              {tabs.map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)} className="flex-1 py-2 text-[12px] font-black" style={{ transform: "skewX(-12deg)", background: tab === id ? "#fff" : "rgba(255,255,255,.07)", color: tab === id ? INK : MUTED }}>
                  <span className="inline-block" style={{ transform: "skewX(12deg)" }}>{label}</span>
                </button>
              ))}
            </div>

            {/* content — one tab at a time */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={tab} {...tabSwap}>
                  {tab === "sim" && (
                    <div>
                      <div className="mb-2"><Skew>סימולטור · כמה שווה הניחוש שלך</Skew></div>
                      <div key={m.id} className="flex items-center justify-center gap-3 py-2" dir="ltr" style={{ background: "rgba(255,255,255,.04)", borderTop: `3px solid ${CY}` }}>
                        <div className="flex flex-col items-center gap-1 w-16 min-w-0">
                          <TeamFlag logo={m.team_a_logo} name={m.team_a} size={36} animate={false} />
                          <span className="text-[11px] font-bold text-center leading-tight line-clamp-2">{m.team_a}</span>
                        </div>
                        <ScoreWheel value={simA} onChange={setSimA} />
                        <ScoreWheel value={simB} onChange={setSimB} />
                        <div className="flex flex-col items-center gap-1 w-16 min-w-0">
                          <TeamFlag logo={m.team_b_logo} name={m.team_b} size={36} animate={false} />
                          <span className="text-[11px] font-bold text-center leading-tight line-clamp-2">{m.team_b}</span>
                        </div>
                      </div>
                      {!sim && <p className="text-center text-[12px] mt-3" style={{ color: MUTED }}>גללו את שני הגלגלים כדי לראות כמה הניחוש שווה</p>}
                      <AnimatePresence>
                        {sim && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                            <div className="mt-2 space-y-1">
                              {sim.breakdown.map((r) => (
                                <div key={r.label} className="flex items-stretch h-8" style={{ background: "rgba(255,255,255,.05)", opacity: r.hit ? 1 : 0.35 }}>
                                  <div className="w-1.5" style={{ background: r.hit ? CY : "transparent" }} />
                                  <div className={`flex-1 flex items-center px-3 text-[12.5px] font-bold ${r.hit ? "" : "line-through"}`}>{r.label}</div>
                                  <div className="w-16 grid place-items-center" style={{ fontFamily: NUM, fontSize: 24, fontWeight: 700, color: r.hit ? CY : MUTED }} dir="ltr">+{r.pts}</div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 flex items-stretch h-12">
                              <div className="flex-1 flex items-center px-3 font-black text-[13px]" style={{ background: MG, transform: "skewX(-8deg)" }}>
                                <span style={{ transform: "skewX(8deg)" }}>סה״כ לניחוש <span dir="ltr">{simA}:{simB}</span></span>
                              </div>
                              <div className="w-28 grid place-items-center" style={{ background: "#fff" }}>
                                <Odo v={sim.total} h={34} color={INK} />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {tab === "markets" && (
                    <div className="space-y-4">
                      <Market title="כיוון משחק" items={[["ניצחון בית", m.home_win_points || 0], ["תיקו", m.draw_points || 0], ["ניצחון חוץ", m.away_win_points || 0]]} />
                      <Market title="שתי קבוצות כובשות" items={[["כן", m.btts_yes_points || 0], ["לא", m.btts_no_points || 0]]} />
                      <Market title="טווח שערים" items={[["0–2", m.goals_0_2_points || 0], ["3–4", m.goals_3_4_points || 0], ["5+", m.goals_5_plus_points || 0]]} />
                    </div>
                  )}

                  {tab === "exact" && hasOdds && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <Skew>פגיעה מדויקת</Skew>
                        <div className="flex" style={{ background: "rgba(255,255,255,.07)" }}>
                          {[[false, "עמודות", "1/X/2"], [true, "אלכסון התיקו", ""]].map(([v, label, extra]) => (
                            <button key={label} onClick={() => setDiag(v)} className="text-[11px] font-black px-2.5 py-1.5" style={{ background: diag === v ? "#fff" : "transparent", color: diag === v ? INK : MUTED }}>
                              {label} {extra && <span dir="ltr">{extra}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div key={String(diag)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                          {diag ? <ExactDiagonal scores={scores} match={m} /> : <ExactColumns scores={scores} />}
                        </motion.div>
                      </AnimatePresence>
                      {"other" in m.score_odds && (
                        <div className="mt-2 flex items-stretch h-9" style={{ background: "rgba(255,255,255,.05)" }}>
                          <div className="flex-1 flex items-center px-3 text-[12px] font-bold">כל תוצאה אחרת</div>
                          <div className="w-20 grid place-items-center" style={{ background: "#fff", color: INK, fontFamily: NUM, fontSize: 24, fontWeight: 700 }}>{m.score_odds.other}</div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
