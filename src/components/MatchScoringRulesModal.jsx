import TeamFlag from "@/components/TeamFlag";
import React, { useState, useEffect, useRef } from "react";
import { getTeamColor } from "@/utils/teamColors";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Target, Trophy, Zap, Goal, ArrowLeft, Calculator } from "lucide-react";
import { ShineBorder } from "@/components/magicui/shine-border";
import { motion, AnimatePresence } from "framer-motion";

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

// iOS-style picker wheel (UIPickerView): scroll-snap column 0-9, the centred
// row is the value. value=null = nothing picked yet (all rows dimmed). Scrolls
// to its initial value on mount only — remount (key) to reset.
const WHEEL_ITEM = 34;
function ScoreWheel({ value, onChange }) {
  const ref = useRef(null);
  useEffect(() => { ref.current?.scrollTo({ top: (value ?? 0) * WHEEL_ITEM }); }, []);
  const onScroll = () => {
    const idx = Math.max(0, Math.min(9, Math.round(ref.current.scrollTop / WHEEL_ITEM)));
    if (idx !== value) onChange(idx);
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
        {Array.from({ length: 10 }, (_, n) => (
          <div
            key={n}
            className="snap-center flex items-center justify-center tabular-nums transition-[opacity,transform] duration-150"
            style={{ height: WHEEL_ITEM, fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, opacity: n === value ? 1 : 0.35, transform: `scale(${n === value ? 1 : 0.85})` }}
          >
            {n}
          </div>
        ))}
        <div style={{ height: WHEEL_ITEM }} />
      </div>
    </div>
  );
}

// Tab bar: a coloured copy of the row is clip-path'ed to the active tab, so
// the highlight slides with a perfect colour transition. Rectangular.
function ClipTabs({ tabs, active, onChange }) {
  const i = Math.max(0, tabs.findIndex((t) => t.id === active));
  const step = 100 / tabs.length;
  // RTL: tab 0 sits on the right
  const clip = `inset(0 ${i * step}% 0 ${(tabs.length - 1 - i) * step}% round 8px)`;
  const Row = ({ on }) => (
    <div className={`flex rounded-lg ${on ? "bg-sky-500 text-white" : "text-slate-400"}`}>
      {tabs.map((t) => (
        <button key={t.id} type="button" onClick={() => onChange(t.id)} className="flex-1 py-2 text-[11px] font-semibold flex items-center justify-center gap-1">
          <t.icon className="w-3.5 h-3.5" />{t.label}
        </button>
      ))}
    </div>
  );
  return (
    <div className="relative rounded-lg bg-white/5 border border-white/10" dir="rtl">
      <Row />
      <div className="absolute inset-0" style={{ clipPath: clip, transition: "clip-path 260ms cubic-bezier(0.23,1,0.32,1)" }} aria-hidden>
        <Row on />
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

const CARD_THEMES = {
  emerald:     { text: "text-emerald-400", bg: "bg-emerald-500/8" },
  blue:        { text: "text-blue-400",    bg: "bg-blue-500/8" },
  rose:        { text: "text-rose-400",    bg: "bg-rose-500/8" },
  sky:         { text: "text-sky-400",     bg: "bg-sky-500/8" },
  amber:       { text: "text-sky-400",   bg: "bg-sky-500/8" },
  muted:       { text: "text-slate-300",   bg: "bg-white/2" },
  gold:        { text: "text-sky-400",   bg: "bg-sky-500/8" },
  'blue-grad': { text: "text-blue-400",    bg: "bg-blue-500/8" },
};

function SegmentedGroup({ items, delay = 60 }) {
  return (
    <div
      className="relative flex rounded-xl overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDuration: "220ms", animationFillMode: "both", animationTimingFunction: "cubic-bezier(0.23,1,0.32,1)", animationDelay: `${delay}ms` }}
    >
      <ShineBorder
        borderRadius={12}
        borderWidth={1.5}
        duration={12}
        shineColor={["#097adc", "#ffffff", "#097adc", "#ffffff"]}
      />
      {items.map((item, i) => {
        const t = CARD_THEMES[item.theme || "muted"];
        return (
          <React.Fragment key={item.label}>
            {i > 0 && <div className="w-px flex-shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent self-stretch" />}
            <div className={`flex flex-col items-center gap-1 py-3.5 flex-1 ${t.bg}`}>
              <span
                className={`text-2xl font-bold tabular-nums leading-none ${
                  item.theme === 'rose'    ? 'bg-gradient-to-br from-rose-400 to-red-600 bg-clip-text text-transparent' :
                  item.theme === 'emerald' ? 'bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent' :
                  'bg-gradient-to-br from-sky-400 to-white bg-clip-text text-transparent'
                }`}
              >
                {item.pts}
              </span>
              <span className={`text-[11px] font-medium text-center leading-tight px-1 mt-0.5 ${
                  item.theme === 'rose'    ? 'bg-gradient-to-br from-rose-400 to-red-600 bg-clip-text text-transparent' :
                  item.theme === 'emerald' ? 'bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent' :
                  'bg-gradient-to-br from-sky-400 to-white bg-clip-text text-transparent'
              }`}>{item.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SectionLabel({ title, icon: Icon, color }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${color}`}>
      {Icon && <Icon className="w-3.5 h-3.5 opacity-80" />}
      <span className="text-[10px] uppercase tracking-[0.12em] font-semibold">{title}</span>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-white/5" />;
}

export default function MatchScoringRulesModal({ isOpen, onClose, match }) {
  // null until the user turns a wheel — the points breakdown opens only then.
  const [simA, setSimA] = useState(null);
  const [simB, setSimB] = useState(null);
  // Turning one wheel picks the other one's current row (0 if untouched).
  const pickA = (v) => { setSimA(v); setSimB((b) => b ?? 0); };
  const pickB = (v) => { setSimB(v); setSimA((a) => a ?? 0); };
  const [tab, setTab] = useState("sim");

  useEffect(() => {
    setSimA(null);
    setSimB(null);
    setTab("sim");
  }, [match?.id]);

  useModalBackButton(isOpen, onClose);

  if (!match) return null;

  const hasOdds = match.score_odds && Object.keys(match.score_odds).length > 0;
  const sim = calcSimPoints(match, simA, simB);
  const tabs = [
    { id: "sim", label: "סימולטור", icon: Calculator },
    { id: "markets", label: "יחסים", icon: Trophy },
    ...(hasOdds ? [{ id: "exact", label: "תוצאה מדויקת", icon: Target }] : []),
  ];

  const oddsColumns = [
    {
      label: '1',
      filter: ([s]) => { if (s === 'other') return false; const [h, a] = s.split(':').map(Number); return h > a; },
      sort: ([ka], [kb]) => { const [ah, aa] = ka.split(':').map(Number); const [bh, ba] = kb.split(':').map(Number); return (ah + aa) - (bh + ba) || ah - bh; },
    },
    {
      label: 'X',
      filter: ([s]) => { if (s === 'other') return false; const [h, a] = s.split(':').map(Number); return h === a; },
      sort: ([ka], [kb]) => ka.split(':').map(Number)[0] - kb.split(':').map(Number)[0],
    },
    {
      label: '2',
      filter: ([s]) => { if (s === 'other') return false; const [h, a] = s.split(':').map(Number); return h < a; },
      sort: ([ka], [kb]) => { const [ah, aa] = ka.split(':').map(Number); const [bh, ba] = kb.split(':').map(Number); return (ah + aa) - (bh + ba) || aa - ba; },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#0d1526] text-white p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl border border-white/8 max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col [&>button:last-child]:hidden">

        {/* Sticky header: close button + teams */}
        <div className="flex-shrink-0">
          {/* Close button */}
          <div className="px-5 pt-4 pb-3 flex items-center">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-sm text-white/70 hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Teams — dynamic banner gradient from flag colors */}
          {(() => {
            const colorA = getTeamColor(match.team_a);
            const colorB = getTeamColor(match.team_b);
            const toRgba = (hex, a) => {
              const r = parseInt(hex.slice(1,3),16);
              const g = parseInt(hex.slice(3,5),16);
              const b = parseInt(hex.slice(5,7),16);
              return `rgba(${r},${g},${b},${a})`;
            };
            return (
          <div className="flex items-center justify-between px-5 py-4 mx-4 mb-1 rounded-2xl overflow-hidden relative"
            style={{ background: `linear-gradient(90deg, ${toRgba(colorA,0.45)} 0%, rgba(15,23,42,0.85) 35%, rgba(15,23,42,0.85) 65%, ${toRgba(colorB,0.45)} 100%)`, border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}>
                <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-12 h-12" />
              </div>
              <span className="text-xs font-bold leading-tight text-center text-white">
                {match.team_a}
              </span>
              <span className="text-[10px] text-slate-300 leading-none">(בית)</span>
            </div>
            <span className="text-sm font-black tracking-widest mx-3 pb-5 bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(180deg, #097adc 0%, #1e40af 100%)' }}>VS</span>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <div style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))' }}>
                <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-12 h-12" />
              </div>
              <span className="text-xs font-bold leading-tight text-center text-white">
                {match.team_b}
              </span>
              <span className="text-[10px] text-slate-300 leading-none">(חוץ)</span>
            </div>
          </div>
            );
          })()}

          <div className="mx-4 mt-3">
            <ClipTabs tabs={tabs} active={tab} onChange={setTab} />
          </div>
        </div>

        {/* Scrollable content — one tab at a time */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
        <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} {...tabSwap} className="space-y-5">
        {tab === "sim" && (

          <div className="rounded-2xl border border-yellow-500/25 overflow-hidden"
            style={{ background: 'linear-gradient(145deg, rgba(9, 122, 220,0.07) 0%, rgba(10,20,50,0.6) 100%)' }}>

            <div className="px-4 pt-3 pb-1 text-center">
              <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-yellow-400/80">סימולטור — כמה שווה הניחוש שלך</span>
            </div>

            {/* Picker wheels */}
            <div key={match.id} className="flex items-center justify-center gap-6 pb-3 pt-1" dir="ltr">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-white font-semibold text-center leading-tight">{match.team_a}</span>
                <ScoreWheel value={simA} onChange={pickA} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-white font-semibold text-center leading-tight">{match.team_b}</span>
                <ScoreWheel value={simB} onChange={pickB} />
              </div>
            </div>

            {/* Breakdown */}
            <AnimatePresence>
              {sim && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="border-t border-yellow-500/15"
                >
                  <div className="px-4 py-3 space-y-1.5">
                    {sim.breakdown.map((row) => (
                      <div key={row.label} className="flex items-center justify-between">
                        <span className={`text-xs ${row.hit ? 'text-white/80' : 'text-white/25 line-through'}`}>
                          {row.label}
                        </span>
                        <span className={`text-xs font-bold tabular-nums ${row.hit ? 'text-yellow-400' : 'text-white/20'}`}>
                          +{row.pts}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mx-4 mb-3 rounded-xl flex items-center justify-center px-4 py-2.5"
                    style={{ background: 'rgba(9, 122, 220,0.12)', border: '1px solid rgba(9, 122, 220,0.3)' }}>
                    <motion.span
                      key={sim.total}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="text-base font-bold text-yellow-400 tabular-nums"
                    >
                      {sim.total} PTS
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {tab === "markets" && (
          <>
          {/* כיוון משחק */}
          <div className="space-y-3">
            <SectionLabel title="כיוון משחק" icon={Trophy} color="text-sky-400" />
            <SegmentedGroup delay={60} items={[
              { label: "ניצחון ביתי", pts: match.home_win_points || 0, theme: "gold" },
              { label: "תיקו",        pts: match.draw_points || 0,      theme: "gold" },
              { label: "ניצחון חוץ", pts: match.away_win_points || 0,  theme: "gold" },
            ]} />
          </div>

          <Divider />

          {/* שתי קבוצות כובשות */}
          <div className="space-y-3">
            <SectionLabel title="שתי קבוצות כובשות" icon={Zap} color="text-sky-400" />
            <SegmentedGroup delay={80} items={[
              { label: "כן", pts: match.btts_yes_points || 0, theme: "emerald" },
              { label: "לא", pts: match.btts_no_points  || 0, theme: "rose"    },
            ]} />
          </div>

          <Divider />

          {/* טווח שערים */}
          <div className="space-y-3">
            <SectionLabel title="טווח שערים" icon={Goal} color="text-sky-400" />
            <SegmentedGroup delay={100} items={[
              { label: "0–2 שערים", pts: match.goals_0_2_points    || 0, theme: "blue-grad" },
              { label: "3–4 שערים", pts: match.goals_3_4_points    || 0, theme: "blue-grad" },
              { label: "5+ שערים",  pts: match.goals_5_plus_points || 0, theme: "blue-grad" },
            ]} />
          </div>

          </>
        )}

          {/* פגיעה מדויקת */}
          {tab === "exact" && hasOdds && (
            <>
              <div
                className="space-y-3 animate-in fade-in"
                style={{ animationDuration: "200ms", animationFillMode: "both", animationDelay: "140ms" }}
              >
                <SectionLabel title="פגיעה מדויקת" icon={Target} color="text-emerald-400/80" />

                <div className="grid grid-cols-3 gap-2">
                  {oddsColumns.map(({ label, filter, sort }) => {
                    const cls = label === '1'
                      ? { pill: 'bg-emerald-500/6 border-emerald-500/15', pts: 'text-emerald-400' }
                      : label === 'X'
                        ? { pill: 'bg-yellow-500/6 border-yellow-500/15', pts: 'text-yellow-400' }
                        : { pill: 'bg-sky-500/6 border-sky-500/15', pts: 'text-sky-400' };
                    return (
                      <div key={label}>
                        <div className="text-center text-xs font-bold text-white/55 uppercase tracking-widest mb-1.5">{label}</div>
                        <div className="space-y-1">
                          {Object.entries(match.score_odds).filter(filter).sort(sort).map(([score, pts]) => (
                            <div key={score} className={`flex justify-between items-center rounded-lg border px-2 py-1.5 ${cls.pill}`}>
                              <span className={`font-bold text-xs tabular-nums ${cls.pts}`}>{pts}</span>
                              <span className="text-white/70 text-xs font-mono">{score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {'other' in match.score_odds && (
                  <div className="flex justify-between items-center rounded-lg bg-yellow-500/6 border border-yellow-500/15 px-3 py-2.5">
                    <span className="text-yellow-400 font-bold text-sm tabular-nums">{match.score_odds['other']}</span>
                    <span className="text-white/70 text-xs">כל תוצאה אחרת</span>
                  </div>
                )}
              </div>
            </>
          )}

        </motion.div>
        </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
