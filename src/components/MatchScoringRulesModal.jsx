import TeamFlag from "@/components/TeamFlag";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Target, Trophy, Zap, Goal } from "lucide-react";
import { useGridBeam, GridBeamCanvas } from "@/components/ui/grid-beam";

const CARD_THEMES = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/8" },
  blue:    { text: "text-blue-400",    bg: "bg-blue-500/8" },
  rose:    { text: "text-rose-400",    bg: "bg-rose-500/8" },
  sky:     { text: "text-sky-400",     bg: "bg-sky-500/8" },
  amber:   { text: "text-amber-400",   bg: "bg-amber-500/8" },
  muted:   { text: "text-slate-300",   bg: "bg-white/2" },
};

function SegmentedGroup({ items, delay = 60 }) {
  const { canvasRef } = useGridBeam({
    rows: 2,
    cols: items.length + 1,
    colorVariant: "colorful",
    theme: "dark",
    duration: 3,
    strength: 0.85,
    breathe: true,
  });

  return (
    <div
      className="relative flex rounded-xl overflow-hidden border border-white/10 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDuration: "220ms", animationFillMode: "both", animationTimingFunction: "cubic-bezier(0.23,1,0.32,1)", animationDelay: `${delay}ms` }}
    >
      <GridBeamCanvas ref={canvasRef} />
      {items.map((item, i) => {
        const t = CARD_THEMES[item.theme || "muted"];
        return (
          <React.Fragment key={item.label}>
            {i > 0 && <div className="relative z-10 w-px flex-shrink-0 bg-gradient-to-b from-transparent via-white/20 to-transparent self-stretch" />}
            <div className={`relative z-10 flex flex-col items-center gap-1 py-3.5 flex-1 ${t.bg}`}>
              <span
                className={`text-2xl font-bold tabular-nums leading-none ${
                  item.theme === 'rose'
                    ? t.text
                    : 'bg-gradient-to-br from-cyan-400 to-emerald-400 bg-clip-text text-transparent'
                }`}
              >
                {item.pts}
              </span>
              <span className={`text-[11px] font-medium text-center leading-tight px-1 mt-0.5 ${t.text}`}>{item.label}</span>
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
  if (!match) return null;

  const hasOdds = match.score_odds && Object.keys(match.score_odds).length > 0;

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
          <div className="px-5 pt-4 pb-3">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-white/6 hover:bg-white/10 active:scale-[0.97] transition-all text-sm font-semibold text-white/80 border border-white/10"
            >
              חזרה לדף הקודם
            </button>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between px-7 py-3">
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-12 h-12" />
              <span className="text-xs text-white font-semibold leading-tight text-center">{match.team_a}</span>
              <span className="text-[10px] text-slate-400 leading-none">(בית)</span>
            </div>
            <span className="text-sm font-bold text-amber-400 tracking-widest mx-3 pb-5">VS</span>
            <div className="flex flex-col items-center gap-1.5 flex-1">
              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-12 h-12" />
              <span className="text-xs text-white font-semibold leading-tight text-center">{match.team_b}</span>
              <span className="text-[10px] text-slate-400 leading-none">(חוץ)</span>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

          <Divider />

          {/* כיוון משחק */}
          <div className="space-y-3">
            <SectionLabel title="כיוון משחק" icon={Trophy} color="text-amber-400" />
            <SegmentedGroup delay={60} items={[
              { label: "ניצחון ביתי", pts: match.home_win_points || 0, theme: "emerald" },
              { label: "תיקו",        pts: match.draw_points || 0,      theme: "muted"   },
              { label: "ניצחון חוץ", pts: match.away_win_points || 0,  theme: "blue"    },
            ]} />
          </div>

          <Divider />

          {/* שתי קבוצות כובשות */}
          <div className="space-y-3">
            <SectionLabel title="שתי קבוצות כובשות" icon={Zap} color="text-amber-400" />
            <SegmentedGroup delay={80} items={[
              { label: "כן", pts: match.btts_yes_points || 0, theme: "emerald" },
              { label: "לא", pts: match.btts_no_points  || 0, theme: "rose"    },
            ]} />
          </div>

          <Divider />

          {/* טווח שערים */}
          <div className="space-y-3">
            <SectionLabel title="טווח שערים" icon={Goal} color="text-amber-400" />
            <SegmentedGroup delay={100} items={[
              { label: "0–2 שערים", pts: match.goals_0_2_points    || 0, theme: "sky" },
              { label: "3–4 שערים", pts: match.goals_3_4_points    || 0, theme: "sky" },
              { label: "5+ שערים",  pts: match.goals_5_plus_points || 0, theme: "sky" },
            ]} />
          </div>

          {/* פגיעה מדויקת */}
          {hasOdds && (
            <>
              <Divider />
              <div
                className="space-y-3 animate-in fade-in"
                style={{ animationDuration: "200ms", animationFillMode: "both", animationDelay: "140ms" }}
              >
                <SectionLabel title="פגיעה מדויקת" icon={Target} color="text-amber-400/80" />

                <div className="grid grid-cols-3 gap-2">
                  {oddsColumns.map(({ label, filter, sort }) => (
                    <div key={label}>
                      <div className="text-center text-[9px] font-bold text-white/25 uppercase tracking-widest mb-1.5">{label}</div>
                      <div className="space-y-1">
                        {Object.entries(match.score_odds).filter(filter).sort(sort).map(([score, pts]) => (
                          <div key={score} className="flex justify-between items-center rounded-lg bg-amber-500/6 border border-amber-500/15 px-2 py-1.5">
                            <span className="text-amber-400 font-bold text-xs tabular-nums">{pts}</span>
                            <span className="text-white/40 text-xs font-mono">{score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {'other' in match.score_odds && (
                  <div className="flex justify-between items-center rounded-lg bg-amber-500/6 border border-amber-500/15 px-3 py-2.5">
                    <span className="text-amber-400 font-bold text-sm tabular-nums">{match.score_odds['other']}</span>
                    <span className="text-white/40 text-xs">כל תוצאה אחרת</span>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}
