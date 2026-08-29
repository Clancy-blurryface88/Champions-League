import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Home, Plane } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";
import TeamFlag from "@/components/TeamFlag";
import { GeneralPrediction, TeamLogo, Match } from "@/api/entities";

const MULTI_TEAM_PICK_COUNT = 8;

// Shows one team's 8 league-phase fixtures in matchday order, home/away
// marked with a house/plane icon — helps the user judge schedule strength
// before picking them for a schedule-sensitive question (e.g. "who tops the
// league phase"). Opened via the info icon, independent of picking a team.
function TeamFixturesModal({ team, allMatches, logosByName, onClose }) {
  const fixtures = useMemo(() => {
    return allMatches
      .filter((m) => m.team_a === team.name || m.team_b === team.name)
      .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
      .map((m, i) => {
        const isHome = m.team_a === team.name;
        const opponent = isHome ? m.team_b : m.team_a;
        return { matchday: i + 1, isHome, opponent, opponentLogo: logosByName[opponent] };
      });
  }, [team, allMatches, logosByName]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl p-5"
        style={{ background: "rgba(15,20,35,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TeamFlag logo={team.logo_url} name={team.name} className="w-7 h-7" animate={false} />
            <span className="text-white font-semibold text-sm">{team.name} — לוח שלב הליגה</span>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {fixtures.length === 0 ? (
          <p className="text-white/40 text-xs text-center py-6">לוח המשחקים עדיין לא ידוע.</p>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {fixtures.map((f) => (
              <div
                key={f.matchday}
                className="flex flex-col items-center gap-1 p-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <span className="text-white/40 text-[9px]">מחזור {f.matchday}</span>
                <TeamFlag logo={f.opponentLogo} name={f.opponent} className="w-6 h-6" animate={false} />
                <span className="text-white/80 text-[8px] text-center leading-tight truncate w-full">{f.opponent}</span>
                {f.isHome ? (
                  <Home className="w-3 h-3 text-green-400" />
                ) : (
                  <Plane className="w-3 h-3 text-sky-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// One-time, pre-tournament "general prediction" questions (e.g. "who wins the
// tournament") — shown right after WelcomeModal closes, once per unanswered
// active question. Visual language cloned from WelcomeModal.jsx.
export default function GeneralPredictionsOnboarding({ isOpen, questions, userId, onDone }) {
  const [logos, setLogos] = useState([]);
  const [leaguePhaseMatches, setLeaguePhaseMatches] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
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
    setSelected(null);
  }, [isOpen]);

  const logosByName = useMemo(() => Object.fromEntries(logos.map((l) => [l.name, l.logo_url])), [logos]);

  if (!isOpen || questions.length === 0) return null;

  const question = questions[step];
  const isLast = step === questions.length - 1;
  const isMulti = question.type === "multi_team";
  const selectedArray = Array.isArray(selected) ? selected : [];
  const isValidSelection = isMulti ? selectedArray.length === MULTI_TEAM_PICK_COUNT : !!selected;

  // Sorted low-to-high by odds (= potential points) so the favorites — the
  // most likely, lowest-payout picks — show first.
  const sortedLogos = [...logos].sort((a, b) => {
    const oddsA = question.odds_table?.[a.name];
    const oddsB = question.odds_table?.[b.name];
    if (oddsA == null && oddsB == null) return 0;
    if (oddsA == null) return 1;
    if (oddsB == null) return -1;
    return oddsA - oddsB;
  });

  const handleTeamClick = (teamName) => {
    if (!isMulti) {
      setSelected(teamName);
      return;
    }
    if (selectedArray.includes(teamName)) {
      setSelected(selectedArray.filter((t) => t !== teamName));
    } else if (selectedArray.length < MULTI_TEAM_PICK_COUNT) {
      setSelected([...selectedArray, teamName]);
    }
  };

  const handleNext = async () => {
    if (!isValidSelection) return;
    setSaving(true);
    try {
      await GeneralPrediction.create({
        user_id: userId,
        question_id: question.id,
        answer: isMulti ? JSON.stringify(selectedArray) : selected,
      });
      if (isLast) {
        onDone();
      } else {
        setStep((s) => s + 1);
        setSelected(null);
      }
    } catch (error) {
      console.error("Error saving general prediction:", error);
      alert("שגיאה בשמירת הניחוש: " + (error?.message || JSON.stringify(error)));
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

              <div className="relative px-8 pt-9 pb-5 text-center flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-white/35 text-[11px]">שאלה {step + 1} מתוך {questions.length}</span>
                <h2 className="text-white text-[17px] font-semibold tracking-tight mt-1.5">
                  {question.question_text}
                </h2>
                {isMulti && (
                  <span className="text-yellow-400/80 text-[11px] block mt-1">
                    {selectedArray.length}/{MULTI_TEAM_PICK_COUNT} נבחרו
                  </span>
                )}
              </div>

              <div className="relative px-6 py-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-4 gap-2.5" dir="rtl">
                  {sortedLogos.map((team) => {
                    const isSelected = isMulti ? selectedArray.includes(team.name) : selected === team.name;
                    const odds = question.odds_table?.[team.name];
                    const multiDisabled = isMulti && !isSelected && selectedArray.length >= MULTI_TEAM_PICK_COUNT;
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
                          disabled={saving || multiDisabled}
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
                          <span className="relative z-10 text-white/85 text-[9px] text-center leading-tight truncate w-full">{team.name}</span>
                          {odds != null && <span className="relative z-10 text-yellow-400/80 text-[8px]">{odds}</span>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative px-8 py-6 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <motion.button
                  onClick={handleNext}
                  disabled={!isValidSelection || saving}
                  className="w-full text-[13px] font-semibold transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "white", color: "black", borderRadius: "0.75rem", padding: "12px 16px" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-2">
                      <OrbitSpinner size={18} />
                      <span>שומר...</span>
                    </div>
                  ) : isLast ? "סיום" : "הבא"}
                </motion.button>
              </div>
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
