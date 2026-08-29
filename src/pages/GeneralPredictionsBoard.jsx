import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import TeamFlag from "@/components/TeamFlag";
import { GeneralQuestion, GeneralPrediction, PublicProfile, TeamLogo } from "@/api/entities";
import CircleLoader from "@/components/CircleLoader";

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
    </div>
  );
}
