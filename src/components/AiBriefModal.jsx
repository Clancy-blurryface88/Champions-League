import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamFlag from "@/components/TeamFlag";

export default function AiBriefModal({ match, brief, onClose }) {
  useEffect(() => {
    if (!match) return;
    window.history.pushState({ modal: 'ai-brief' }, '');
    const handlePop = () => onClose();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [match, onClose]);

  if (!match) return null;

  const formattedDate = brief?.generated_at
    ? new Date(brief.generated_at).toLocaleDateString("he-IL", {
        day: "2-digit", month: "2-digit", year: "numeric",
      })
    : null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl"
        style={{ maxHeight: '85dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold text-sm">AI טרום משחק</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Teams row */}
        <div className="flex items-center justify-center gap-4 px-5 py-4 border-b border-slate-700/40 flex-shrink-0">
          <div className="flex flex-col items-center gap-1">
            <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-10 h-10" animate={false} />
            <span className="text-white text-xs font-semibold">{match.team_a}</span>
          </div>
          <span className="text-slate-500 font-bold text-lg">נגד</span>
          <div className="flex flex-col items-center gap-1">
            <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-10 h-10" animate={false} />
            <span className="text-white text-xs font-semibold">{match.team_b}</span>
          </div>
        </div>

        {/* Brief text */}
        <div className="overflow-y-auto flex-1 min-h-0 px-5 py-4" dir="rtl">
          {brief ? (
            <div className="space-y-1">
              {brief.brief_he.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-2" />;
                const isHeader = ['🌍', '⚔️', '📊', '⭐', '🎯'].some(e => trimmed.startsWith(e));
                if (isHeader) {
                  return (
                    <p key={i} className="text-yellow-400 font-bold text-sm pt-3 pb-0.5 first:pt-0">
                      {trimmed}
                    </p>
                  );
                }
                return (
                  <p key={i} className="text-slate-200 text-sm leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">
              הסיכום עבור משחק זה יהיה זמין בקרוב
            </p>
          )}
        </div>

        {/* Footer */}
        {formattedDate && (
          <div className="px-5 py-3 border-t border-slate-700/40 flex-shrink-0">
            <p className="text-slate-500 text-[11px] text-center" dir="rtl">
              נוצר על ידי AI · {formattedDate}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
