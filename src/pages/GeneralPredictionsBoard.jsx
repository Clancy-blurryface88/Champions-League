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

// multi_team answers (e.g. "pick 8 teams") show as a dropdown — 8 logos
// inline would be too noisy in a table cell.
function MultiAnswerDropdown({ teams, logosByName, oddsTable, totalPoints }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg px-2 py-1"
      >
        {teams.length} קבוצות
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {totalPoints != null && <div className="text-[10px] text-green-400 mt-0.5">+{totalPoints}</div>}
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute z-40 top-full mt-1 right-0 bg-slate-800 border border-slate-600 rounded-lg p-2 min-w-[160px] shadow-xl">
            {teams.map((team) => (
              <div key={team} className="flex items-center gap-2 py-1 text-xs text-white whitespace-nowrap">
                <TeamFlag logo={logosByName[team]} name={team} className="w-4 h-4" animate={false} />
                <span className="flex-1">{team}</span>
                {oddsTable?.[team] != null && <span className="text-yellow-400/70 text-[10px]">{oddsTable[team]}</span>}
              </div>
            ))}
          </div>
        </>
      )}
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

  return (
    <div className="min-h-screen px-4 py-6" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Dashboard"))}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          ניחושים כלליים — מה כולם ניחשו
        </h1>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-500 text-center py-20">עדיין אין ניחושים כלליים שהוגשו.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-white border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-right py-2 px-3 sticky right-0 bg-slate-900">משתמש</th>
                {questions.map((q) => (
                  <th key={q.id} className="text-center py-2 px-3 min-w-[140px]">{q.question_text}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.userId} className="border-b border-slate-800">
                  <td className="py-2 px-3 font-medium sticky right-0 bg-slate-900">{row.displayName}</td>
                  {questions.map((q) => {
                    const answer = row.answers[q.id];
                    if (!answer) {
                      return (
                        <td key={q.id} className="text-center py-2 px-3">
                          <span className="text-slate-600">—</span>
                        </td>
                      );
                    }
                    if (q.type === "multi_team") {
                      const teams = parseMultiAnswer(answer.team);
                      return (
                        <td key={q.id} className="text-center py-2 px-3">
                          <MultiAnswerDropdown
                            teams={teams}
                            logosByName={logosByName}
                            oddsTable={q.odds_table}
                            totalPoints={answer.points}
                          />
                        </td>
                      );
                    }
                    return (
                      <td key={q.id} className="text-center py-2 px-3">
                        <div className="flex flex-col items-center gap-1">
                          <TeamFlag logo={logosByName[answer.team]} name={answer.team} className="w-6 h-6" animate={false} />
                          <span className="text-xs text-slate-300">{answer.team}</span>
                          {answer.points != null && (
                            <span className="text-[10px] text-green-400">+{answer.points}</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
