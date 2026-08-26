import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, X, Target } from "lucide-react";

// ── Mock data — 7 concurrent live matches (the exact scenario that's
// cramped today) x 4 players, so every option can be judged against the
// real worst case instead of 1-2 matches. ─────────────────────────────────

const MATCHES = [
  { id: "m1", home: "ריאל מדריד", away: "מנצ'סטר סיטי", hs: 2, as: 1 },
  { id: "m2", home: "ברצלונה", away: "באיירן מינכן", hs: 0, as: 0 },
  { id: "m3", home: "ליברפול", away: "פ.ס.ז'", hs: 1, as: 3 },
  { id: "m4", home: "יובנטוס", away: "ארסנל", hs: 2, as: 2 },
  { id: "m5", home: "אינטר", away: "דורטמונד", hs: 3, as: 0 },
  { id: "m6", home: "אתלטיקו מדריד", away: "נאפולי", hs: 1, as: 1 },
  { id: "m7", home: "פורטו", away: "בנפיקה", hs: 0, as: 2 },
];

const PLAYERS = [
  { id: "p1", name: "דימה" },
  { id: "p2", name: "נועה" },
  { id: "p3", name: "איתי" },
  { id: "p4", name: "שירה" },
];

// predictions[playerId][matchId] = { p: "x-y", status }
const PREDICTIONS = {
  p1: {
    m1: { p: "2-1", status: "exact" }, m2: { p: "1-0", status: "hit" },
    m3: { p: "1-1", status: "miss" }, m4: { p: "2-2", status: "exact" },
    m5: { p: "2-0", status: "hit" }, m6: { p: "0-2", status: "miss" },
    m7: { p: "0-2", status: "exact" },
  },
  p2: {
    m1: { p: "1-1", status: "miss" }, m2: { p: "0-0", status: "exact" },
    m3: { p: "0-2", status: "hit" }, m4: { p: "1-0", status: "miss" },
    m5: { p: "3-0", status: "exact" }, m6: { p: "1-1", status: "exact" },
    m7: { p: "1-1", status: "miss" },
  },
  p3: {
    m1: { p: "2-0", status: "hit" }, m3: { p: "1-3", status: "exact" },
    m4: { p: "0-0", status: "miss" }, m5: { p: "1-0", status: "hit" },
    m7: { p: "0-1", status: "hit" },
  },
  p4: {
    m1: { p: "0-0", status: "miss" }, m2: { p: "2-1", status: "miss" },
    m3: { p: "1-2", status: "hit" }, m4: { p: "2-2", status: "exact" },
    m5: { p: "3-1", status: "hit" }, m6: { p: "0-0", status: "miss" },
    m7: { p: "0-2", status: "exact" },
  },
};

const STATUS_STYLE = {
  exact: { icon: "🎯", color: "#34d399", label: "פגיעה מדויקת" },
  hit:   { icon: "✅", color: "#7cadee", label: "כיוון נכון" },
  miss:  { icon: "✕",  color: "#64748b", label: "החטאה" },
};

function matchLabel(m) { return `${m.home} - ${m.away}`; }
function playerPreds(playerId) {
  return MATCHES
    .map(m => ({ match: m, pred: PREDICTIONS[playerId]?.[m.id] }))
    .filter(x => x.pred);
}
function summarize(playerId) {
  const preds = playerPreds(playerId).map(x => x.pred.status);
  return {
    exact: preds.filter(s => s === "exact").length,
    hit: preds.filter(s => s === "hit").length,
    miss: preds.filter(s => s === "miss").length,
  };
}

// ── Shared shell every option renders inside ──────────────────────────────

function OptionCard({ n, title, tagline, approach, children }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="flex items-center justify-center rounded-full text-[11px] font-black flex-shrink-0"
              style={{ width: 22, height: 22, background: "linear-gradient(135deg,#097adc,#7cadee)", color: "#000" }}
            >
              {n}
            </span>
            <h3 className="text-white font-bold text-sm">{title}</h3>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">{tagline}</p>
        </div>
        <span
          className="flex-shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap"
          style={{ background: "rgba(124,173,238,0.12)", color: "#7cadee", border: "1px solid rgba(124,173,238,0.25)" }}
        >
          {approach}
        </span>
      </div>
      <div className="rounded-xl p-4" style={{ background: "rgba(3,13,26,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}>
        {children}
      </div>
    </div>
  );
}

function PlayerRowShell({ name, right, statBadge }) {
  return (
    <div className="flex items-center gap-2.5 py-2">
      <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-300 flex-shrink-0">
        {name.slice(0, 2)}
      </div>
      <p className="flex-1 text-[13px] font-semibold text-slate-200 truncate">{name}</p>
      {statBadge}
      {right}
    </div>
  );
}

// ── 1. Horizontal scroll strip ────────────────────────────────────────────
function Option1() {
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => (
        <PlayerRowShell key={pl.id} name={pl.name} right={
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[190px] pb-1" style={{ scrollbarWidth: "thin" }}>
            {playerPreds(pl.id).map(({ match, pred }) => {
              const s = STATUS_STYLE[pred.status];
              return (
                <div key={match.id} className="flex items-center gap-1 flex-shrink-0 px-1.5 py-0.5 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <span className="text-[10px]" style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[10px] font-mono font-bold text-slate-300">{pred.p}</span>
                </div>
              );
            })}
          </div>
        } />
      ))}
      <p className="text-slate-500 text-[10px] mt-2">גוללים אופקית ימינה/שמאלה בתוך השורה עצמה — אין שינוי בגובה השורה גם עם 7 משחקים.</p>
    </div>
  );
}

// ── 2. 2-row color grid + hover tooltip ───────────────────────────────────
function Option2() {
  const [hover, setHover] = useState(null);
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => (
        <PlayerRowShell key={pl.id} name={pl.name} right={
          <div className="grid grid-cols-4 gap-1 relative" style={{ width: 72 }}>
            {playerPreds(pl.id).map(({ match, pred }) => {
              const s = STATUS_STYLE[pred.status];
              const key = `${pl.id}-${match.id}`;
              return (
                <div key={match.id} className="relative">
                  <div
                    onMouseEnter={() => setHover(key)}
                    onMouseLeave={() => setHover(null)}
                    className="rounded-[3px] cursor-pointer"
                    style={{ width: 14, height: 14, background: s.color, opacity: 0.85 }}
                  />
                  {hover === key && (
                    <div className="absolute z-20 bottom-full mb-1 -translate-x-1/2 left-1/2 whitespace-nowrap text-[10px] px-2 py-1 rounded-md text-white" style={{ background: "#0b1a2e", border: "1px solid rgba(255,255,255,0.15)" }}>
                      {matchLabel(match)}: {pred.p}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        } />
      ))}
      <p className="text-slate-500 text-[10px] mt-2">כל משחק = ריבוע צבע קטן (2 שורות x 4). ריחוף חושף את שם המשחק והניחוש.</p>
    </div>
  );
}

// ── 3. Aggregate summary badge only ───────────────────────────────────────
function Option3() {
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => {
        const sum = summarize(pl.id);
        return (
          <PlayerRowShell key={pl.id} name={pl.name} right={
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span style={{ color: STATUS_STYLE.exact.color }}>🎯{sum.exact}</span>
              <span style={{ color: STATUS_STYLE.hit.color }}>✅{sum.hit}</span>
              <span style={{ color: STATUS_STYLE.miss.color }}>✕{sum.miss}</span>
            </div>
          } />
        );
      })}
      <p className="text-slate-500 text-[10px] mt-2">בלי פירוט לפי משחק בכלל בשורה — רק סיכום מספרי. הכי צפוף, הכי פחות מידע.</p>
    </div>
  );
}

// ── 4. Heat dots row, tap for tooltip ─────────────────────────────────────
function Option4() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => (
        <PlayerRowShell key={pl.id} name={pl.name} right={
          <div className="flex items-center gap-1 relative">
            {playerPreds(pl.id).map(({ match, pred }) => {
              const s = STATUS_STYLE[pred.status];
              const key = `${pl.id}-${match.id}`;
              return (
                <button key={match.id} onClick={() => setOpen(open === key ? null : key)} className="relative">
                  <span className="block rounded-full" style={{ width: 8, height: 8, background: s.color }} />
                  {open === key && (
                    <div className="absolute z-20 top-full mt-1.5 -translate-x-1/2 left-1/2 whitespace-nowrap text-[10px] px-2 py-1.5 rounded-lg text-white text-right" style={{ background: "#0b1a2e", border: "1px solid rgba(255,255,255,0.15)" }}>
                      <div className="font-semibold">{matchLabel(match)}</div>
                      <div style={{ color: s.color }}>{pred.p} · {s.label}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        } />
      ))}
      <p className="text-slate-500 text-[10px] mt-2">שורת נקודות זעירות (8px) — הכי דחוס אפשרי. לחיצה על נקודה פותחת בועית מידע.</p>
    </div>
  );
}

// ── 5. Auto-rotating single chip per row ──────────────────────────────────
function Option5() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const iv = setInterval(() => setTick(t => t + 1), 2200); return () => clearInterval(iv); }, []);
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => {
        const preds = playerPreds(pl.id);
        const cur = preds[tick % preds.length];
        const s = STATUS_STYLE[cur.pred.status];
        return (
          <PlayerRowShell key={pl.id} name={pl.name} right={
            <AnimatePresence mode="wait">
              <motion.div
                key={`${pl.id}-${cur.match.id}`}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.06)", minWidth: 100 }}
              >
                <span className="text-[10px]" style={{ color: s.color }}>{s.icon}</span>
                <span className="text-[10px] text-slate-400 truncate max-w-[70px]">{cur.match.home.slice(0,3)}-{cur.match.away.slice(0,3)}</span>
                <span className="text-[10px] font-mono font-bold text-slate-200">{cur.pred.p}</span>
              </motion.div>
            </AnimatePresence>
          } />
        );
      })}
      <p className="text-slate-500 text-[10px] mt-2">מיני-קרוסלה בכל שורה — מחליף משחק כל ~2.2 שניות, בלי לתפוס יותר מקום מצ'יפ בודד.</p>
    </div>
  );
}

// ── 6. Separate tab, grouped by match ─────────────────────────────────────
function Option6() {
  const [activeMatch, setActiveMatch] = useState(MATCHES[0].id);
  const match = MATCHES.find(m => m.id === activeMatch);
  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: "thin" }}>
        {MATCHES.map(m => (
          <button key={m.id} onClick={() => setActiveMatch(m.id)}
            className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors"
            style={{ background: activeMatch === m.id ? "linear-gradient(135deg,#097adc,#7cadee)" : "rgba(255,255,255,0.05)", color: activeMatch === m.id ? "#000" : "#94a3b8" }}>
            {m.home.slice(0,3)}-{m.away.slice(0,3)}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        {PLAYERS.filter(pl => PREDICTIONS[pl.id]?.[match.id]).map(pl => {
          const pred = PREDICTIONS[pl.id][match.id];
          const s = STATUS_STYLE[pred.status];
          return (
            <div key={pl.id} className="flex items-center justify-between text-[12px] px-2 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="text-slate-300 font-medium">{pl.name}</span>
              <span className="font-mono font-bold" style={{ color: s.color }}>{s.icon} {pred.p}</span>
            </div>
          );
        })}
      </div>
      <p className="text-slate-500 text-[10px] mt-3">טאב נפרד ("לפי משחק") — בוחרים משחק אחד מלמעלה, רואים את כל הניחושים של כולם רק בשבילו. הופך את הכיוון: לא שחקן→משחקים, אלא משחק→שחקנים.</p>
    </div>
  );
}

// ── 7. Expandable accordion row ───────────────────────────────────────────
function Option7() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => {
        const isOpen = open === pl.id;
        return (
          <div key={pl.id}>
            <button onClick={() => setOpen(isOpen ? null : pl.id)} className="w-full">
              <PlayerRowShell name={pl.name} right={
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500">{playerPreds(pl.id).length} משחקים</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
              } />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pb-2 pr-9 space-y-1">
                    {playerPreds(pl.id).map(({ match, pred }) => {
                      const s = STATUS_STYLE[pred.status];
                      return (
                        <div key={match.id} className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{matchLabel(match)}</span>
                          <span className="font-mono font-bold" style={{ color: s.color }}>{s.icon} {pred.p}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <p className="text-slate-500 text-[10px] mt-2">לחיצה על שורת שחקן פותחת רשימה מלאה מתחתיה (דוחפת את שאר השורות למטה), במקום להיכנס לחלון נפרד.</p>
    </div>
  );
}

// ── 8. Compare-by-selected-match table ────────────────────────────────────
function Option8() {
  const [idx, setIdx] = useState(0);
  const match = MATCHES[idx];
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setIdx(i => (i - 1 + MATCHES.length) % MATCHES.length)} className="p-1 rounded-md hover:bg-white/10"><ChevronRight className="w-4 h-4 text-slate-400" /></button>
        <span className="text-[12px] font-bold text-white">{matchLabel(match)}</span>
        <button onClick={() => setIdx(i => (i + 1) % MATCHES.length)} className="p-1 rounded-md hover:bg-white/10"><ChevronLeft className="w-4 h-4 text-slate-400" /></button>
      </div>
      <table className="w-full text-[11px]">
        <tbody>
          {PLAYERS.map(pl => {
            const pred = PREDICTIONS[pl.id]?.[match.id];
            const s = pred && STATUS_STYLE[pred.status];
            return (
              <tr key={pl.id} className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <td className="py-1.5 text-slate-300">{pl.name}</td>
                <td className="py-1.5 text-left font-mono font-bold" style={{ color: s?.color || "#475569" }}>{pred ? `${s.icon} ${pred.p}` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-slate-500 text-[10px] mt-3">חיצים לדפדוף בין המשחקים למעלה, טבלה קבועה של שחקנים למטה — טוב כשרוצים להתמקד במשחק אחד בכל רגע נתון.</p>
    </div>
  );
}

// ── 9. Full players x matches matrix ──────────────────────────────────────
function Option9() {
  return (
    <div className="overflow-x-auto">
      <table className="text-[10px] border-collapse">
        <thead>
          <tr>
            <th className="text-slate-500 text-right pr-2 pb-2 sticky right-0" style={{ background: "rgba(3,13,26,0.6)" }}></th>
            {MATCHES.map(m => (
              <th key={m.id} className="text-slate-500 font-medium pb-2 px-1.5 whitespace-nowrap">{m.home.slice(0,3)}-{m.away.slice(0,3)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAYERS.map(pl => (
            <tr key={pl.id} className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <td className="text-slate-300 font-semibold pr-2 py-1.5 whitespace-nowrap sticky right-0" style={{ background: "rgba(3,13,26,0.6)" }}>{pl.name}</td>
              {MATCHES.map(m => {
                const pred = PREDICTIONS[pl.id]?.[m.id];
                const s = pred && STATUS_STYLE[pred.status];
                return (
                  <td key={m.id} className="text-center px-1.5 py-1.5 font-mono font-bold" style={{ color: s?.color || "#334155" }}>
                    {pred ? pred.p : "–"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-slate-500 text-[10px] mt-3">מטריצה מלאה — כל השחקנים וכל המשחקים בבת אחת, גוללת אופקית בטלפון. הכי מקיף, הכי פחות "יפה".</p>
    </div>
  );
}

// ── 10. Long-press / click → full modal ───────────────────────────────────
function Option10() {
  const [openPlayer, setOpenPlayer] = useState(null);
  const holdTimer = useRef(null);
  const startHold = (id) => { holdTimer.current = setTimeout(() => setOpenPlayer(id), 380); };
  const cancelHold = () => clearTimeout(holdTimer.current);
  const player = PLAYERS.find(p => p.id === openPlayer);
  return (
    <div className="space-y-1 relative">
      {PLAYERS.map(pl => (
        <div key={pl.id}
          onMouseDown={() => startHold(pl.id)} onMouseUp={cancelHold} onMouseLeave={cancelHold}
          onTouchStart={() => startHold(pl.id)} onTouchEnd={cancelHold}
          className="cursor-pointer select-none rounded-lg -mx-1 px-1 hover:bg-white/[0.03]">
          <PlayerRowShell name={pl.name} statBadge={<span className="text-[9px] text-slate-600 ml-1">החזק ללחיצה</span>} />
        </div>
      ))}
      <AnimatePresence>
        {player && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenPlayer(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="rounded-2xl p-5 w-full max-w-xs" style={{ background: "#0b1a2e", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-bold text-sm">כל הניחושים של {player.name}</h4>
                <button onClick={() => setOpenPlayer(null)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="space-y-1.5">
                {playerPreds(player.id).map(({ match, pred }) => {
                  const s = STATUS_STYLE[pred.status];
                  return (
                    <div key={match.id} className="flex items-center justify-between text-[12px]">
                      <span className="text-slate-400">{matchLabel(match)}</span>
                      <span className="font-mono font-bold" style={{ color: s.color }}>{s.icon} {pred.p}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-slate-500 text-[10px] mt-2">לחיצה ארוכה על שם השחקן (בדסקטופ: לחיצה והחזקה) פותחת מודאל מרכזי עם הפירוט המלא — השורה עצמה נשארת נקייה לגמרי.</p>
    </div>
  );
}

// ── 11. Tap status icon → bottom sheet ────────────────────────────────────
function Option11() {
  const [openPlayer, setOpenPlayer] = useState(null);
  const player = PLAYERS.find(p => p.id === openPlayer);
  return (
    <div className="space-y-1 relative">
      {PLAYERS.map(pl => {
        const sum = summarize(pl.id);
        return (
          <PlayerRowShell key={pl.id} name={pl.name} right={
            <button onClick={() => setOpenPlayer(pl.id)} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(124,173,238,0.12)" }}>
              <Target className="w-3 h-3" style={{ color: "#7cadee" }} />
              <span className="text-[10px] font-bold text-sky-300">{sum.exact + sum.hit}/{playerPreds(pl.id).length}</span>
            </button>
          } />
        );
      })}
      <AnimatePresence>
        {player && (
          <motion.div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.55)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenPlayer(null)}>
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 rounded-t-2xl p-5" style={{ background: "#0b1a2e", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-10 h-1 rounded-full bg-slate-700 mx-auto mb-4" />
              <h4 className="text-white font-bold text-sm mb-3">{player.name} — פירוט לפי משחק</h4>
              <div className="space-y-1.5">
                {playerPreds(player.id).map(({ match, pred }) => {
                  const s = STATUS_STYLE[pred.status];
                  return (
                    <div key={match.id} className="flex items-center justify-between text-[12px]">
                      <span className="text-slate-400">{matchLabel(match)}</span>
                      <span className="font-mono font-bold" style={{ color: s.color }}>{s.icon} {pred.p}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-slate-500 text-[10px] mt-2">אייקון קטן בסוף השורה (יחס פגיעות) — הקשה עליו מגלגלת Bottom Sheet מלמטה, הכי טבעי במובייל.</p>
    </div>
  );
}

// ── 12. Long-press → radial fan popover ───────────────────────────────────
function Option12() {
  const [openPlayer, setOpenPlayer] = useState(null);
  const holdTimer = useRef(null);
  const startHold = (id) => { holdTimer.current = setTimeout(() => setOpenPlayer(id), 380); };
  const cancelHold = () => clearTimeout(holdTimer.current);
  const preds = openPlayer ? playerPreds(openPlayer) : [];
  return (
    <div className="space-y-1 relative" style={{ minHeight: 180 }}>
      {PLAYERS.map(pl => (
        <div key={pl.id} className="relative"
          onMouseDown={() => startHold(pl.id)} onMouseUp={cancelHold} onMouseLeave={cancelHold}
          onTouchStart={() => startHold(pl.id)} onTouchEnd={cancelHold}>
          <div className="cursor-pointer select-none rounded-lg -mx-1 px-1 hover:bg-white/[0.03]">
            <PlayerRowShell name={pl.name} statBadge={<span className="text-[9px] text-slate-600 ml-1">החזק</span>} />
          </div>
          <AnimatePresence>
            {openPlayer === pl.id && (
              <div className="absolute z-20 top-full right-6 flex flex-wrap gap-1.5 mt-2 max-w-[240px]" onClick={() => setOpenPlayer(null)}>
                {preds.map(({ match, pred }, i) => {
                  const s = STATUS_STYLE[pred.status];
                  return (
                    <motion.div key={match.id}
                      initial={{ opacity: 0, scale: 0.3, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.3 }}
                      transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 18 }}
                      className="px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
                      style={{ background: "#0b1a2e", border: `1px solid ${s.color}55`, color: s.color }}>
                      {s.icon} {match.home.slice(0,3)}-{match.away.slice(0,3)} {pred.p}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <p className="text-slate-500 text-[10px] mt-2">לחיצה ארוכה "מפוצצת" צ'יפים קטנים מתחת לשם השחקן במניפה קצרה — אפקטיבי ומרשים, אבל עלול להסתיר שורות שמתחת.</p>
    </div>
  );
}

// ── 13. Story-style full-screen tap-through viewer ────────────────────────
function Option13() {
  const [openPlayer, setOpenPlayer] = useState(null);
  const [step, setStep] = useState(0);
  const preds = openPlayer ? playerPreds(openPlayer) : [];
  const player = PLAYERS.find(p => p.id === openPlayer);
  const open = (id) => { setOpenPlayer(id); setStep(0); };
  return (
    <div className="space-y-1 relative">
      {PLAYERS.map(pl => (
        <button key={pl.id} onClick={() => open(pl.id)} className="w-full text-right">
          <PlayerRowShell name={pl.name} statBadge={<span className="text-[9px] text-slate-600 ml-1">הקש לסטורי</span>} />
        </button>
      ))}
      <AnimatePresence>
        {player && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "#030d1a" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="w-full max-w-xs p-4">
              <div className="flex gap-1 mb-4">
                {preds.map((_, i) => (
                  <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <div className="h-full rounded-full" style={{ width: i < step ? "100%" : i === step ? "100%" : "0%", background: "#7cadee", transition: "width .3s" }} />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-white font-bold text-sm">{player.name}</span>
                <button onClick={() => setOpenPlayer(null)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              {preds[step] && (() => {
                const { match, pred } = preds[step]; const s = STATUS_STYLE[pred.status];
                return (
                  <motion.div key={step} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                    <p className="text-slate-400 text-xs mb-2">{matchLabel(match)}</p>
                    <p className="text-4xl font-black font-mono mb-2" style={{ color: s.color }}>{pred.p}</p>
                    <p className="text-xs" style={{ color: s.color }}>{s.icon} {s.label}</p>
                  </motion.div>
                );
              })()}
              <div className="flex items-center justify-between">
                <button disabled={step === 0} onClick={() => setStep(s => s - 1)} className="p-2 rounded-full disabled:opacity-30" style={{ background: "rgba(255,255,255,0.06)" }}><ChevronRight className="w-4 h-4 text-white" /></button>
                <span className="text-[10px] text-slate-500">{step + 1} / {preds.length}</span>
                <button disabled={step === preds.length - 1} onClick={() => setStep(s => s + 1)} className="p-2 rounded-full disabled:opacity-30" style={{ background: "rgba(255,255,255,0.06)" }}><ChevronLeft className="w-4 h-4 text-white" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-slate-500 text-[10px] mt-2">הקשה על שחקן פותחת מסך מלא בסגנון "סטורי" — משחק אחד גדול בכל פעם, מתקדמים בחיצים/נקודות התקדמות למעלה. הכי דרמטי, דורש הכי הרבה הקשות לראות הכל.</p>
    </div>
  );
}

// ── 14. Hover tooltip showing only currently-relevant matches ────────────
function Option14() {
  const [hoverPlayer, setHoverPlayer] = useState(null);
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="space-y-1 relative">
      {PLAYERS.map(pl => {
        const preds = playerPreds(pl.id);
        const relevant = preds.filter(x => x.pred.status !== "miss").slice(0, 3);
        return (
          <div key={pl.id} className="relative" onMouseEnter={() => { setHoverPlayer(pl.id); setShowAll(false); }} onMouseLeave={() => setHoverPlayer(null)}>
            <PlayerRowShell name={pl.name} statBadge={<span className="text-[9px] text-slate-600 ml-1">רחף</span>} />
            <AnimatePresence>
              {hoverPlayer === pl.id && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="absolute z-20 top-full right-6 mt-1 rounded-xl p-3 w-56" style={{ background: "#0b1a2e", border: "1px solid rgba(255,255,255,0.12)" }}>
                  <p className="text-[10px] text-slate-500 mb-1.5">משחקים רלוונטיים כרגע:</p>
                  {(showAll ? preds : relevant).map(({ match, pred }) => {
                    const s = STATUS_STYLE[pred.status];
                    return (
                      <div key={match.id} className="flex items-center justify-between text-[11px] py-0.5">
                        <span className="text-slate-400">{matchLabel(match)}</span>
                        <span className="font-mono font-bold" style={{ color: s.color }}>{s.icon} {pred.p}</span>
                      </div>
                    );
                  })}
                  {!showAll && preds.length > relevant.length && (
                    <button onClick={() => setShowAll(true)} className="text-[10px] text-sky-400 mt-1">+{preds.length - relevant.length} נוספים</button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      <p className="text-slate-500 text-[10px] mt-2">ריחוף מציג רק את המשחקים ה"חמים" (פגיעה/כיוון נכון), עם "+N נוספים" להרחבה — מסנן החטאות מראש כדי לא להציף.</p>
    </div>
  );
}

// ── 15. Single status dot, full detail lives elsewhere ────────────────────
function Option15() {
  const [openDetail, setOpenDetail] = useState(false);
  return (
    <div className="space-y-1">
      {PLAYERS.map(pl => {
        const sum = summarize(pl.id);
        const score = sum.exact * 2 + sum.hit;
        const color = score >= 5 ? "#34d399" : score >= 2 ? "#facc15" : "#f87171";
        return (
          <button key={pl.id} onClick={() => setOpenDetail(pl.id)} className="w-full">
            <PlayerRowShell name={pl.name} right={<span className="block rounded-full flex-shrink-0" style={{ width: 9, height: 9, background: color, boxShadow: `0 0 8px ${color}88` }} />} />
          </button>
        );
      })}
      <p className="text-slate-500 text-[10px] mt-2">מינימליזם מוחלט: נקודת צבע אחת (ירוק/צהוב/אדום = ביצועים חיים כלליים) ליד כל שם. הפירוט המלא לכל משחק גר רק במסך "פירוט חי" נפרד — השורה הראשית לעולם לא מתעבה, לא משנה כמה משחקים במקביל.</p>
      {openDetail && (
        <div className="mt-2 text-center">
          <button onClick={() => setOpenDetail(false)} className="text-[10px] text-sky-400">(בפועל: הקשה כאן הייתה מנווטת למסך "פירוט חי" נפרד — לא מוצג בדמו)</button>
        </div>
      )}
    </div>
  );
}

const OPTIONS = [
  { n: 1, title: "רצועת צ'יפים גוללת בשורה", tagline: "צ'יפ קטן לכל משחק, כל השורה נשארת בגובה קבוע — גוללים אופקית בתוך הרצועה.", approach: "ליד השחקן", Comp: Option1 },
  { n: 2, title: "גריד צבעים 2x4 + טולטיפ", tagline: "ריבוע צבע זעיר לכל משחק (ירוק/כחול/אפור), ריחוף מגלה פרטים.", approach: "ליד השחקן", Comp: Option2 },
  { n: 3, title: "תג סיכום מרוכז בלבד", tagline: "בלי פירוט למשחק — רק מספרים כוללים: 🎯 ✅ ✕.", approach: "ליד השחקן", Comp: Option3 },
  { n: 4, title: "שורת נקודות חום (heat dots)", tagline: "נקודה זעירה לכל משחק, לחיצה בודדת פותחת בועית מידע ממוקדת.", approach: "ליד השחקן", Comp: Option4 },
  { n: 5, title: "צ'יפ מתחלף אוטומטית (מיני-קרוסלה)", tagline: "אותו מקום בשורה, מציג משחק אחר כל 2.2 שניות — בלי לתפוס יותר רוחב.", approach: "ליד השחקן", Comp: Option5 },
  { n: 6, title: "טאב נפרד: לפי משחק", tagline: "בוחרים משחק אחד למעלה, רואים את כל הניחושים של כולם רק בשבילו.", approach: "תפריט נפרד", Comp: Option6 },
  { n: 7, title: "שורה מתרחבת (אקורדיון)", tagline: "לחיצה על שחקן פותחת רשימה מלאה מתחת לשורה שלו, דוחפת את השאר למטה.", approach: "ליד השחקן", Comp: Option7 },
  { n: 8, title: "השוואה לפי משחק נבחר", tagline: "חיצים לדפדוף בין 7 המשחקים למעלה, טבלת שחקנים קבועה למטה.", approach: "תפריט נפרד", Comp: Option8 },
  { n: 9, title: "מטריצה מלאה שחקנים × משחקים", tagline: "טבלה אחת גדולה, כל השחקנים וכל המשחקים בבת אחת (גוללת אופקית).", approach: "תפריט נפרד", Comp: Option9 },
  { n: 10, title: "לחיצה ארוכה → מודאל מרכזי", tagline: "החזקה על שם השחקן פותחת חלון מרכזי עם כל הפירוט; השורה עצמה נשארת נקייה.", approach: "לחיצה ארוכה", Comp: Option10 },
  { n: 11, title: "אייקון סטטוס → Bottom Sheet", tagline: "אייקון קטן (יחס פגיעות) בסוף השורה; הקשה מגלגלת חלונית מלמטה — טבעי במובייל.", approach: "לחיצה ארוכה", Comp: Option11 },
  { n: 12, title: "לחיצה ארוכה → מניפת צ'יפים", tagline: "החזקה 'מפוצצת' צ'יפים קטנים במניפה מתחת לשם, כל אחד עם משחק+ניחוש.", approach: "לחיצה ארוכה", Comp: Option12 },
  { n: 13, title: "תצוגת \"סטורי\" במסך מלא", tagline: "הקשה על שחקן פותחת מסך מלא בסגנון סטורי — משחק גדול אחד בכל פעם, מתקדמים בחיצים.", approach: "לחיצה ארוכה", Comp: Option13 },
  { n: 14, title: "טולטיפ \"משחקים חמים\" בלבד", tagline: "ריחוף מציג רק פגיעות/כיוונים נכונים, עם הרחבה ל'+N נוספים' — מסנן החטאות מראש.", approach: "ליד השחקן", Comp: Option14 },
  { n: 15, title: "נקודת מצב יחידה + מסך נפרד", tagline: "נקודת צבע אחת לכל שחקן (מצב כללי); הפירוט המלא גר רק במסך 'פירוט חי' נפרד לגמרי.", approach: "תפריט נפרד", Comp: Option15 },
];

export default function AdminPredictionDisplayOptions() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">15 אפשרויות להצגת ניחושים לצד כל שחקן</h2>
        <p className="text-slate-400 text-sm">
          כל האפשרויות מודגמות על אותם נתוני דמו: 4 שחקנים × 7 משחקים חיים במקביל — התרחיש הצפוף ביותר האפשרי.
          הן אינטראקטיביות (ריחוף/לחיצה/החזקה) בדיוק כמו שיתנהגו בפועל. תגית בפינה מסמנת את סוג הגישה: ליד השחקן / תפריט נפרד / לחיצה ארוכה.
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.n} n={opt.n} title={opt.title} tagline={opt.tagline} approach={opt.approach}>
            <opt.Comp />
          </OptionCard>
        ))}
      </div>
    </div>
  );
}
