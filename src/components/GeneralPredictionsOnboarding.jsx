import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrbitSpinner from "@/components/OrbitSpinner";
import TeamFlag from "@/components/TeamFlag";
import { GeneralPrediction, TeamLogo } from "@/api/entities";

// One-time, pre-tournament "general prediction" questions (e.g. "who wins the
// tournament") — shown right after WelcomeModal closes, once per unanswered
// active question. Visual language cloned from WelcomeModal.jsx.
export default function GeneralPredictionsOnboarding({ isOpen, questions, userId, onDone }) {
  const [logos, setLogos] = useState([]);
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) TeamLogo.list("name").then(setLogos);
  }, [isOpen]);

  useEffect(() => {
    setStep(0);
    setSelected(null);
  }, [isOpen]);

  if (!isOpen || questions.length === 0) return null;

  const question = questions[step];
  const isLast = step === questions.length - 1;

  const handleNext = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await GeneralPrediction.create({
        user_id: userId,
        question_id: question.id,
        answer: selected,
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
              </div>

              <div className="relative px-6 py-5 overflow-y-auto flex-1">
                <div className="grid grid-cols-4 gap-2.5" dir="rtl">
                  {logos.map((team) => {
                    const isSelected = selected === team.name;
                    return (
                      <button
                        key={team.id}
                        onClick={() => setSelected(team.name)}
                        disabled={saving}
                        className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all"
                        style={{
                          background: isSelected ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.03)",
                          border: isSelected ? "1.5px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <TeamFlag logo={team.logo_url} name={team.name} className="w-8 h-8" animate={false} />
                        <span className="text-white/85 text-[9px] text-center leading-tight truncate w-full">{team.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative px-8 py-6 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <motion.button
                  onClick={handleNext}
                  disabled={!selected || saving}
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
        </>
      )}
    </AnimatePresence>
  );
}
