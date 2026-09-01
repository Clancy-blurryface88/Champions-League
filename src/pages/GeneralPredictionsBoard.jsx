import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamFlag from "@/components/TeamFlag";
import { GeneralQuestion, GeneralPrediction, PublicProfile, TeamLogo } from "@/api/entities";
import CircleLoader from "@/components/CircleLoader";

function parseMultiAnswer(raw) {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

const NAME_COL_WIDTH = 100;
const ROW_H = 68; // fixed row height shared by both panels so they line up

// Glass/dark-blue treatment for header cells and username cells, replacing
// the flat black background per feedback.
const GLASS_BG = {
  background: "rgba(30,58,138,0.28)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

// Frozen name column as a genuinely separate, non-scrolling panel next to an
// independently horizontally-scrolling picks panel — deliberately NOT using
// `position: sticky`. Sticky-inside-a-scroll-container combined with
// dir="rtl" is inconsistent across mobile browsers (confirmed broken here:
// the name column scrolled away with everything else instead of staying
// put). Two physically separate panels can't have that failure mode.
function FrozenNamesPanel({ headerLabel, rows }) {
  return (
    <div className="flex-shrink-0 text-white" style={{ width: NAME_COL_WIDTH }}>
      <div
        className="flex items-center justify-end px-2 font-medium text-sm border-b border-slate-700"
        style={{ height: ROW_H, ...GLASS_BG }}
      >
        {headerLabel}
      </div>
      {rows.map((row) => (
        <div
          key={row.userId}
          className="flex items-center justify-end px-2 font-medium text-sm border-b border-slate-800"
          style={{ height: ROW_H, ...GLASS_BG }}
        >
          {row.displayName}
        </div>
      ))}
    </div>
  );
}

// No lock gate here: the onboarding flow already blocks a user from reaching
// any other page — including this one — until they've submitted their own
// answers, so there's no way to see others' picks before making your own.
export default function GeneralPredictionsBoard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [rows, setRows] = useState([]); // [{ userId, displayName, answers: {questionId: {team, points}} }]
  const [logosByName, setLogosByName] = useState({});
  const [expandedMulti, setExpandedMulti] = useState({}); // { [questionId]: boolean } — open by default, collapsible

  useEffect(() => {
    const load = async () => {
      const [activeQuestions, predictions, profiles, logos] = await Promise.all([
        GeneralQuestion.filter({ is_active: true }),
        GeneralPrediction.list(),
        PublicProfile.list(),
        TeamLogo.list("name"),
      ]);

      setQuestions(activeQuestions);
      setLogosByName(Object.fromEntries(logos.map((l) => [l.name, l.logo_url])));

      const nameByUserId = Object.fromEntries(profiles.map((p) => [p.user_id, p.display_name]));
      const byUser = {};
      predictions.forEach((p) => {
        if (!byUser[p.user_id]) {
          byUser[p.user_id] = { userId: p.user_id, displayName: nameByUserId[p.user_id] || "משתמש", answers: {} };
        }
        byUser[p.user_id].answers[p.question_id] = { team: p.answer, points: p.points_earned };
      });
      setRows(Object.values(byUser).sort((a, b) => a.displayName.localeCompare(b.displayName, "he")));

      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleLoader />
      </div>
    );
  }

  // Single-pick and 8-pick questions render as two different grid shapes —
  // cramming an 8-team list into a generic matrix cell was hard to read, so
  // each multi_team question gets its own dedicated, easy-to-scan grid.
  const singleTeamQuestions = questions.filter((q) => q.type !== "multi_team");
  const multiTeamQuestions = questions.filter((q) => q.type === "multi_team");
  const usersWithAnyAnswer = rows.filter((r) => Object.keys(r.answers).length > 0);

  return (
    <div className="min-h-screen px-4 py-6 space-y-8" dir="rtl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <img src="/champions/trophy-marquee.png" alt="" className="h-6 w-auto object-contain" />
            ניחושים כלליים
          </h1>
        </div>
      </div>

      {usersWithAnyAnswer.length === 0 ? (
        <p className="text-slate-500 text-center py-20">עדיין אין ניחושים כלליים שהוגשו.</p>
      ) : (
        <>
          {singleTeamQuestions.length > 0 && (
            <div className="flex text-white">
              <FrozenNamesPanel headerLabel="משתמש" rows={rows} />
              <div className="overflow-x-auto flex-1">
                <div className="grid" style={{ gridTemplateColumns: `repeat(${singleTeamQuestions.length}, minmax(130px, 1fr))` }}>
                  {singleTeamQuestions.map((q) => (
                    <div key={q.id} className="flex items-center justify-center px-2 text-sm text-center border-b border-slate-700" style={{ height: ROW_H, whiteSpace: 'pre-line', ...GLASS_BG }}>
                      {q.question_text.replace(/\s+(עונת)/, '\n$1')}
                    </div>
                  ))}
                  {rows.map((row) => (
                    <React.Fragment key={row.userId}>
                      {singleTeamQuestions.map((q) => {
                        const answer = row.answers[q.id];
                        return (
                          <div key={q.id} className="flex items-center justify-center px-2 border-b border-slate-800 overflow-hidden" style={{ height: ROW_H }}>
                            {answer ? (
                              <div className="flex flex-col items-center gap-1">
                                <TeamFlag logo={logosByName[answer.team]} name={answer.team} className="w-6 h-6" animate={false} />
                                <span dir="ltr" className="text-xs text-slate-300 truncate max-w-[110px]">{answer.team}</span>
                                {answer.points != null && (
                                  <span className="text-[10px] text-green-400">+{Number(answer.points).toFixed(2)}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}

          {multiTeamQuestions.map((q) => {
            const isExpanded = expandedMulti[q.id] !== false;
            const correctSet = new Set(parseMultiAnswer(q.correct_answer));
            return (
              <div key={q.id}>
                <button
                  onClick={() => setExpandedMulti((prev) => ({ ...prev, [q.id]: !prev[q.id] }))}
                  className="w-full flex items-center justify-center gap-2 text-white font-semibold text-base mb-3 py-2 rounded-lg hover:bg-white/5"
                >
                  {q.question_text}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </button>
                {isExpanded && (
                  <div className="flex text-white">
                    <FrozenNamesPanel headerLabel="משתמש" rows={rows} />
                    <div className="overflow-x-auto flex-1">
                      <div className="grid" style={{ gridTemplateColumns: `repeat(8, minmax(64px, 1fr)) 56px` }}>
                        {Array.from({ length: 8 }, (_, i) => (
                          <div key={i} className="flex items-center justify-center px-1 text-xs border-b border-slate-700" style={{ height: ROW_H, ...GLASS_BG }}>
                            בחירה {i + 1}
                          </div>
                        ))}
                        <div className="flex items-center justify-center px-1 text-xs border-b border-slate-700" style={{ height: ROW_H, ...GLASS_BG }}>נק'</div>

                        {rows.map((row) => {
                          const answer = row.answers[q.id];
                          const teams = answer ? parseMultiAnswer(answer.team) : [];
                          return (
                            <React.Fragment key={row.userId}>
                              {Array.from({ length: 8 }, (_, i) => {
                                const team = teams[i];
                                const isHit = team && correctSet.has(team);
                                return (
                                  <div
                                    key={i}
                                    className="flex items-center justify-center px-1 border-b border-slate-800 border-r border-slate-800/60 overflow-hidden"
                                    style={{ height: ROW_H, background: isHit ? "rgba(74,222,128,0.18)" : undefined }}
                                  >
                                    {team ? (
                                      <div className="flex flex-col items-center gap-0.5" title={team}>
                                        <TeamFlag logo={logosByName[team]} name={team} className="w-6 h-6" animate={false} />
                                        <span dir="ltr" className={`text-[8px] max-w-[56px] truncate ${isHit ? "text-green-400 font-bold" : "text-slate-400"}`}>{team}</span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-700">—</span>
                                    )}
                                  </div>
                                );
                              })}
                              <div className="flex items-center justify-center px-1 border-b border-slate-800" style={{ height: ROW_H }}>
                                {answer?.points != null ? (
                                  <span className="text-green-400 text-xs">+{Number(answer.points).toFixed(2)}</span>
                                ) : (
                                  <span className="text-slate-600">—</span>
                                )}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
