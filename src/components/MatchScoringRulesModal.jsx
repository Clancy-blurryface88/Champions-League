import TeamFlag from "@/components/TeamFlag";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Target, Trophy, Zap, Goal } from "lucide-react";

function PtsCard({ label, pts, color = "text-white", delay = 0 }) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl border border-white/8 bg-white/5 px-2 py-3 flex-1 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDuration: "220ms", animationFillMode: "both", animationTimingFunction: "cubic-bezier(0.23,1,0.32,1)", animationDelay: `${delay}ms` }}
    >
      <span className={`text-xl font-bold tabular-nums leading-none ${color}`}>{pts}</span>
      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">נקודות</span>
      <span className="text-[11px] text-slate-300 text-center leading-tight mt-0.5">{label}</span>
    </div>
  );
}

function Section({ title, icon: Icon, color, children, delay = 0 }) {
  return (
    <div
      className="space-y-2.5 animate-in fade-in"
      style={{ animationDuration: "200ms", animationFillMode: "both", animationDelay: `${delay}ms` }}
    >
      <div className={`flex items-center justify-center gap-1.5 ${color}`}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        <span className="text-[11px] uppercase tracking-widest font-semibold">{title}</span>
      </div>
      <div className="flex gap-2 dir-rtl">
        {children}
      </div>
    </div>
  );
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
      <DialogContent className="bg-[#0f172a] text-white p-0 fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-2xl border border-white/8 max-w-sm w-full max-h-[85vh] overflow-hidden flex flex-col">

        {/* Header */}
        <DialogHeader className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-white/6">
          <DialogTitle className="text-sm font-semibold text-slate-200 text-center tracking-wide">ניקוד</DialogTitle>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Teams */}
          <div
            className="flex items-center justify-between bg-white/4 rounded-xl px-4 py-3 border border-white/6 animate-in fade-in slide-in-from-bottom-2"
            style={{ animationDuration: "200ms", animationFillMode: "both", animationTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}
          >
            <div className="flex items-center gap-2 flex-1">
              <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-8 h-8" />
              <span className="text-xs text-slate-200 font-medium leading-tight">{match.team_a}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 mx-2">VS</span>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-xs text-slate-200 font-medium leading-tight text-right">{match.team_b}</span>
              <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-8 h-8" />
            </div>
          </div>

          {/* Match outcome */}
          <Section title="תוצאת המשחק" icon={Trophy} color="text-blue-400" delay={60}>
            <PtsCard label="ניצחון ביתי" pts={match.home_win_points || 0} color="text-emerald-400" delay={80} />
            <PtsCard label="תיקו" pts={match.draw_points || 0} color="text-slate-300" delay={110} />
            <PtsCard label="ניצחון חוץ" pts={match.away_win_points || 0} color="text-blue-400" delay={140} />
          </Section>

          {/* BTTS */}
          <Section title="שתי קבוצות כובשות" icon={Zap} color="text-emerald-400" delay={100}>
            <PtsCard label="כן" pts={match.btts_yes_points || 0} color="text-emerald-400" delay={120} />
            <PtsCard label="לא" pts={match.btts_no_points || 0} color="text-rose-400" delay={150} />
          </Section>

          {/* Goals range */}
          <Section title="טווח שערים" icon={Goal} color="text-sky-400" delay={140}>
            <PtsCard label='0–2 שערים' pts={match.goals_0_2_points || 0} color="text-sky-400" delay={160} />
            <PtsCard label='3–4 שערים' pts={match.goals_3_4_points || 0} color="text-sky-400" delay={190} />
            <PtsCard label='5+ שערים' pts={match.goals_5_plus_points || 0} color="text-sky-400" delay={220} />
          </Section>

          {/* Exact score odds */}
          {hasOdds && (
            <div
              className="space-y-3 animate-in fade-in"
              style={{ animationDuration: "200ms", animationFillMode: "both", animationDelay: "180ms" }}
            >
              <div className="flex items-center justify-center gap-1.5 text-yellow-400">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[11px] uppercase tracking-widest font-semibold">פגיעה מדויקת</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {oddsColumns.map(({ label, filter, sort }) => (
                  <div key={label}>
                    <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</div>
                    <div className="space-y-1">
                      {Object.entries(match.score_odds).filter(filter).sort(sort).map(([score, pts]) => (
                        <div key={score} className="flex justify-between items-center rounded-lg bg-white/4 border border-white/6 px-2 py-1.5">
                          <span className="text-yellow-400 font-bold text-xs tabular-nums">{pts}</span>
                          <span className="text-slate-400 text-xs font-mono">{score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {'other' in match.score_odds && (
                <div className="flex justify-between items-center rounded-lg bg-white/4 border border-white/6 px-3 py-2">
                  <span className="text-yellow-400 font-bold text-sm tabular-nums">{match.score_odds['other']}</span>
                  <span className="text-slate-400 text-xs">כל תוצאה אחרת</span>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-600 pb-1">ניקוד נקבע על ידי מנהל הטורניר</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
