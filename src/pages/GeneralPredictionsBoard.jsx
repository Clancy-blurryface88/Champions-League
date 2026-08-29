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

  // Single-pick and 8-pick questions render as two different table shapes —
  // cramming an 8-team list into a generic matrix cell was hard to read, so
  // each multi_team question gets its own dedicated, easy-to-scan table.
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
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-white border-collapse">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-right py-2 px-3 sticky right-0 bg-slate-900">משתמש</th>
                    {singleTeamQuestions.map((q) => (
                      <th key={q.id} className="text-center py-2 px-3 min-w-[140px]">{q.question_text}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.userId} className="border-b border-slate-800">
                      <td className="py-2 px-3 font-medium sticky right-0 bg-slate-900">{row.displayName}</td>
                      {singleTeamQuestions.map((q) => {
                        const answer = row.answers[q.id];
                        return (
                          <td key={q.id} className="text-center py-2 px-3">
                            {answer ? (
                              <div className="flex flex-col items-center gap-1">
                                <TeamFlag logo={logosByName[answer.team]} name={answer.team} className="w-6 h-6" animate={false} />
                                <span className="text-xs text-slate-300">{answer.team}</span>
                                {answer.points != null && (
                                  <span className="text-[10px] text-green-400">+{answer.points}</span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
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
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-white border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-right py-2 px-3 sticky right-0 bg-slate-900 w-28">משתמש</th>
                      <th className="text-center py-2 px-3">8 הבחירות</th>
                      <th className="text-center py-2 px-3 w-20">נק'</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const answer = row.answers[q.id];
                      const teams = answer ? parseMultiAnswer(answer.team) : [];
                      return (
                        <tr key={row.userId} className="border-b border-slate-800">
                          <td className="py-2 px-3 font-medium sticky right-0 bg-slate-900">{row.displayName}</td>
                          <td className="py-2 px-3">
                            {teams.length > 0 ? (
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                {teams.map((team) => (
                                  <div key={team} className="flex flex-col items-center gap-0.5" title={team}>
                                    <TeamFlag logo={logosByName[team]} name={team} className="w-6 h-6" animate={false} />
                                    <span className="text-[8px] text-slate-400 max-w-[52px] truncate">{team}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-600 block text-center">—</span>
                            )}
                          </td>
                          <td className="text-center py-2 px-3">
                            {answer?.points != null ? (
                              <span className="text-green-400 text-xs">+{answer.points}</span>
                            ) : (
                              <span className="text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
