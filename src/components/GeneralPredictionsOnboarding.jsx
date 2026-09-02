import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Pencil, CheckCircle2 } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";
import TeamFlag from "@/components/TeamFlag";
import { GeneralPrediction, TeamLogo, Match } from "@/api/entities";
import TeamFixturesModal from "@/components/TeamFixturesModal";
import { isMultiType, getPickCount } from "@/utils/generalQuestionTypes";

// One-time, pre-tournament "general prediction" questions (e.g. "who wins the
// tournament") — shown right after WelcomeModal closes, once per unanswered
// active question. Visual language cloned from WelcomeModal.jsx.
//
// All answers are kept in local state and only written to the DB once, from
// the review screen at the end (step === questions.length) — mirrors the
// round-predictions flow in Predictions.jsx, so a participant can go back and
// change an earlier answer before anything is actually saved.
export default function GeneralPredictionsOnboarding({ isOpen, questions, userId, onDone }) {
  const [logos, setLogos] = useState([]);
  const [leaguePhaseMatches, setLeaguePhaseMatches] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: teamName | teamName[] }
  const [cameFromReview, setCameFromReview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fixturesTeam, setFixturesTeam] = useState(null);

  useEffect(() => {
    if (isOpen) {
      TeamLogo.list("name").then(setLogos);
      Match.filter({ stage: "league_phase" }).then(setLeaguePhaseMatches);
    }
  }, [isOpen]);

  useEffect(() => {
    setStep(0);
    setAnswers({});
    setCameFromReview(false);
  }, [isOpen]);

  const logosByName = useMemo(() => Object.fromEntries(logos.map((l) => [l.name, l.logo_url])), [logos]);

  if (!isOpen || questions.length === 0) return null;

  const isReview = step === questions.length;
  const question = isReview ? null : questions[step];
  const isLast = step === questions.length - 1;
  const isMulti = isMultiType(question?.type);
  const pickCount = getPickCount(question?.type);
  const currentAnswer = question ? answers[question.id] : undefined;
  const selectedArray = Array.isArray(currentAnswer) ? currentAnswer : [];
  const isValidSelection = question ? (isMulti ? selectedArray.length === pickCount : !!currentAnswer) : false;
  const allAnswered = questions.every((q) => {
    const a = answers[q.id];
    return isMultiType(q.type) ? Array.isArray(a) && a.length === getPickCount(q.type) : !!a;
  });

  // Sorted low-to-high by odds (= potential points) so the favorites — the
  // most likely, lowest-payout picks — show first.
  const sortedLogos = question
    ? [...logos].sort((a, b) => {
        const oddsA = question.odds_table?.[a.name];
        const oddsB = question.odds_table?.[b.name];
        if (oddsA == null && oddsB == null) return 0;
        if (oddsA == null) return 1;
        if (oddsB == null) return -1;
        return oddsA - oddsB;
      })
    : [];

  // Earlier multi-team questions already answered in this session — shown as
  // a reference above the grid so the participant can see who they already
  // used before picking again for a different bucket (e.g. the 8 teams
  // picked for "8 המעפילות" while now picking "מקומות 9-24"). Scoped to
  // questions with the same pick count as the current one — e.g. the 2-team
  // "גמר האלופות" question has nothing to do with the 8-team buckets, so it
  // shouldn't show up as a reference there (or vice versa).
  const priorMultiAnswers = isMulti
    ? questions.slice(0, step).filter((q) => getPickCount(q.type) === pickCount && answers[q.id]?.length > 0)
    : [];

  const handleTeamClick = (teamName) => {
    if (!question) return;
    if (!isMulti) {
      setAnswers((prev) => ({ ...prev, [question.id]: teamName }));
      return;
    }
    const current = Array.isArray(answers[question.id]) ? answers[question.id] : [];
    const next = current.includes(teamName)
      ? current.filter((t) => t !== teamName)
      : current.length < pickCount ? [...current, teamName] : current;
    setAnswers((prev) => ({ ...prev, [question.id]: next }));
  };

  const handleNext = () => {
    if (!isValidSelection) return;
    if (cameFromReview) {
      setCameFromReview(false);
      setStep(questions.length);
      return;
    }
    if (isLast) {
      setStep(questions.length);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleEditFromReview = (idx) => {
    setCameFromReview(true);
    setStep(idx);
  };

  const handleConfirmAll = async () => {
    setSaving(true);
    try {
      await Promise.all(
        questions.map((q) =>
          GeneralPrediction.create({
            user_id: userId,
            question_id: q.id,
            answer: isMultiType(q.type) ? JSON.stringify(answers[q.id] || []) : answers[q.id],
          })
        )
      );
      onDone();
    } catch (error) {
      console.error("Error saving general predictions:", error);
      alert("שגיאה בשמירת הניחושים: " + (error?.message || JSON.stringify(error)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "#04050a" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 380, damping: 30, delay: 0.1 }}
          >
            <div
              className="w-full max-w-md overflow-hidden"
              style={{
                position: "relative",
                background: "rgba(255,255,255,0.055)",
                backdropFilter: "blur(28px) saturate(1.6)",
                WebkitBackdropFilter: "blur(28px) saturate(1.6)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: "1.25rem",
                boxShadow: "0 32px 64px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.06)",
                maxHeight: "85vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url(/champions/background.jpeg)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.25,
                }}
              />

              {isReview ? (
                <>
                  <div className="relative px-8 pt-9 pb-5 text-center flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-white/35 text-[11px]">סקירה לפני שמירה</span>
                    <h2 className="text-white text-[17px] font-semibold tracking-tight mt-1.5">בדוק את התשובות שלך</h2>
                    <p className="text-white/45 text-[12px] mt-1">אפשר ללחוץ על כל שאלה כדי לשנות את הבחירה</p>
                  </div>

                  <div className="relative px-6 py-5 overflow-y-auto flex-1 space-y-2" dir="rtl">
                    {questions.map((q, idx) => {
                      const a = answers[q.id];
                      const isM = isMultiType(q.type);
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => handleEditFromReview(idx)}
                          disabled={saving}
                          className="w-full text-right p-3 rounded-xl transition-colors hover:bg-white/[0.06] disabled:opacity-50"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-white/85 text-[13px] font-medium">{q.question_text}</span>
                            <Pencil className="w-3.5 h-3.5 text-white/35 shrink-0" />
                          </div>
                          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                            {isM ? (
                              (Array.isArray(a) ? a : []).map((name) => (
                                <TeamFlag key={name} logo={logosByName[name]} name={name} className="w-6 h-6" animate={false} />
                              ))
                            ) : a ? (
                              <>
                                <TeamFlag logo={logosByName[a]} name={a} className="w-6 h-6" animate={false} />
                                <span dir="ltr" className="text-white/60 text-[11px]">{a}</span>
                              </>
                            ) : (
                              <span className="text-red-400/80 text-[11px]">לא נענה</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative px-8 py-6 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <motion.button
                      onClick={handleConfirmAll}
                      disabled={!allAnswered || saving}
                      className="w-full text-[13px] font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "white", color: "black", borderRadius: "0.75rem", padding: "12px 16px" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {saving ? (
                        <div className="flex items-center justify-center gap-2">
                          <OrbitSpinner size={18} />
                          <span>שומר...</span>
                        </div>
                      ) : "אשר ושמור"}
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative px-8 pt-9 pb-5 text-center flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-white/35 text-[11px]">
                      {cameFromReview ? "עריכת תשובה" : `שאלה ${step + 1} מתוך ${questions.length}`}
                    </span>
                    <h2 className="text-white text-[17px] font-semibold tracking-tight mt-1.5">
                      {question.question_text}
                    </h2>
                    {question.description && (
                      <p className="text-white/45 text-[12px] mt-1">{question.description}</p>
                    )}
                    {isMulti && (
                      <span className="text-yellow-400/80 text-[11px] block mt-1">
                        {selectedArray.length}/{pickCount} נבחרו
                      </span>
                    )}
                  </div>

                  <div className="relative px-6 py-5 overflow-y-auto flex-1">
                    {priorMultiAnswers.length > 0 && (
                      <div className="mb-5" dir="rtl">
                        <div className="space-y-2">
                          {priorMultiAnswers.map((pq) => (
                            <div
                              key={pq.id}
                              className="rounded-xl px-3.5 py-3"
                              style={{
                                background: "linear-gradient(135deg, rgba(245,197,24,0.16) 0%, rgba(245,197,24,0.05) 100%)",
                                border: "1.5px solid rgba(245,197,24,0.45)",
                              }}
                            >
                              <div className="flex items-center gap-1.5 mb-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                                <span className="text-yellow-400 text-[11px] font-semibold">כבר נבחרו ב״{pq.question_text}״</span>
                              </div>
                              <div className="flex gap-1.5 flex-wrap">
                                {answers[pq.id].map((name) => (
                                  <TeamFlag key={name} logo={logosByName[name]} name={name} className="w-6 h-6" animate={false} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 mb-0.5">
                          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                          <span className="text-white/35 text-[10px] font-medium shrink-0">בחר קבוצות אחרות למטה</span>
                          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-4 gap-2.5" dir="rtl">
                      {sortedLogos.map((team) => {
                        const isSelected = isMulti ? selectedArray.includes(team.name) : currentAnswer === team.name;
                        const odds = question.odds_table?.[team.name];
                        const multiDisabled = isMulti && !isSelected && selectedArray.length >= pickCount;
                        return (
                          <div key={team.id} className="relative">
                            {question.show_fixtures_helper && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setFixturesTeam(team); }}
                                className="absolute -top-1 -left-1 z-10 bg-slate-700 hover:bg-slate-600 rounded-full p-1"
                                title="לוח משחקים"
                              >
                                <Info className="w-3 h-3 text-white/80" />
                              </button>
                            )}
                            <button
                              onClick={() => handleTeamClick(team.name)}
                              disabled={multiDisabled}
                              className="relative w-full flex flex-col items-center gap-1 p-2 rounded-xl transition-all overflow-hidden disabled:opacity-30"
                              style={{
                                background: isSelected ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.03)",
                                border: isSelected ? "1.5px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.06)",
                              }}
                            >
                              {/* Oversized, faded logo as a decorative background "shadow" */}
                              <img
                                src={team.logo_url}
                                alt=""
                                aria-hidden="true"
                                className="absolute pointer-events-none select-none"
                                style={{
                                  width: "160%",
                                  height: "160%",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  objectFit: "contain",
                                  opacity: 0.12,
                                  filter: "blur(1px)",
                                }}
                              />
                              <TeamFlag logo={team.logo_url} name={team.name} className="relative z-10 w-8 h-8" animate={false} />
                              <span dir="ltr" className="relative z-10 text-white/85 text-[9px] text-center leading-tight truncate w-full">{team.name}</span>
                              {odds != null && <span className="relative z-10 text-yellow-400/80 text-[8px] font-bold">{odds}</span>}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="relative px-8 py-6 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <motion.button
                      onClick={handleNext}
                      disabled={!isValidSelection}
                      className="w-full text-[13px] font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ background: "white", color: "black", borderRadius: "0.75rem", padding: "12px 16px" }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {cameFromReview ? "עדכן וחזרה לסקירה" : isLast ? "לסקירה" : "הבא"}
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {fixturesTeam && (
            <TeamFixturesModal
              team={fixturesTeam}
              allMatches={leaguePhaseMatches}
              logosByName={logosByName}
              onClose={() => setFixturesTeam(null)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
