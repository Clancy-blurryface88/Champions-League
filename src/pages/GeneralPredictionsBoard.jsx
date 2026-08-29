import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Trophy, ChevronDown } from "lucide-react";
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

// Plain CSS Grid instead of an HTML <table> — on mobile WebKit, a <table>
// combined with a sticky column and horizontal touch-scroll is a known
// source of compositing glitches (content briefly rendering outside its
// cell mid-scroll, e.g. a logo floating over the text below it). Grid with
// `overflow: hidden` per cell avoids that whole class of bug.
function Cell({ children, sticky, header, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center py-2 px-2 border-b border-slate-800 overflow-hidden ${className}`}
      style={{
        position: sticky ? "sticky" : "static",
        right: sticky ? 0 : undefined,
        background: header ? "#0f172a" : sticky ? "#0f172a" : "transparent",
        zIndex: sticky ? 1 : undefined,
      }}
    >
      {children}
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
  const [expandedMulti, setExpandedMulti] = useState({}); // { [questionId]: boolean } — hidden until clicked

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
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          ניחושים כלליים — מה כולם ניחשו
        </h1>
      </div>

      {usersWithAnyAnswer.length === 0 ? (
        <p className="text-slate-500 text-center py-20">עדיין אין ניחושים כלליים שהוגשו.</p>
      ) : (
        <>
          {singleTeamQuestions.length > 0 && (
            <div className="overflow-x-auto text-sm text-white">
              <div
                className="grid"
                style={{ gridTemplateColumns: `112px repeat(${singleTeamQuestions.length}, minmax(130px, 1fr))` }}
              >
                <Cell sticky header className="justify-end font-medium">משתמש</Cell>
                {singleTeamQuestions.map((q) => (
                  <Cell key={q.id} header>{q.question_text}</Cell>
                ))}

                {rows.map((row) => (
                  <React.Fragment key={row.userId}>
                    <Cell sticky className="justify-end font-medium">{row.displayName}</Cell>
                    {singleTeamQuestions.map((q) => {
                      const answer = row.answers[q.id];
                      return (
                        <Cell key={q.id}>
                          {answer ? (
                            <div className="flex flex-col items-center gap-1">
                              <TeamFlag logo={logosByName[answer.team]} name={answer.team} className="w-6 h-6" animate={false} />
                              <span dir="ltr" className="text-xs text-slate-300 truncate max-w-[110px]">{answer.team}</span>
                              {answer.points != null && (
                                <span className="text-[10px] text-green-400">+{answer.points}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </Cell>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {multiTeamQuestions.map((q) => {
            const isExpanded = !!expandedMulti[q.id];
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
                  <div className="overflow-x-auto text-sm text-white">
                    <div
                      className="grid"
                      style={{ gridTemplateColumns: `112px repeat(8, minmax(64px, 1fr)) 56px` }}
                    >
                      <Cell sticky header className="justify-end font-medium">משתמש</Cell>
                      {Array.from({ length: 8 }, (_, i) => (
                        <Cell key={i} header className="text-xs">בחירה {i + 1}</Cell>
                      ))}
                      <Cell header className="text-xs">נק'</Cell>

                      {rows.map((row) => {
                        const answer = row.answers[q.id];
                        const teams = answer ? parseMultiAnswer(answer.team) : [];
                        return (
                          <React.Fragment key={row.userId}>
                            <Cell sticky className="justify-end font-medium">{row.displayName}</Cell>
                            {Array.from({ length: 8 }, (_, i) => {
                              const team = teams[i];
                              return (
                                <Cell key={i} className="border-r border-slate-800/60">
                                  {team ? (
                                    <div className="flex flex-col items-center gap-0.5" title={team}>
                                      <TeamFlag logo={logosByName[team]} name={team} className="w-6 h-6" animate={false} />
                                      <span dir="ltr" className="text-[8px] text-slate-400 max-w-[56px] truncate">{team}</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-700">—</span>
                                  )}
                                </Cell>
                              );
                            })}
                            <Cell>
                              {answer?.points != null ? (
                                <span className="text-green-400 text-xs">+{answer.points}</span>
                              ) : (
                                <span className="text-slate-600">—</span>
                              )}
                            </Cell>
                          </React.Fragment>
                        );
                      })}
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
