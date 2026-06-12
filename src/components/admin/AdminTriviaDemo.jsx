import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, RotateCcw, HelpCircle } from "lucide-react";

// ── Sample questions ──────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question: "כמה קבוצות משתתפות במונדיאל 2026?",
    options: ["32", "36", "48", "64"],
    correct: 2,
    fact: "מונדיאל 2026 יהיה הראשון עם 48 קבוצות, לעומת 32 בעבר.",
  },
  {
    id: 2,
    question: "באיזו מדינה יתקיים פתיחת המונדיאל 2026?",
    options: ["קנדה", "מקסיקו", "ארה\"ב", "ברזיל"],
    correct: 1,
    fact: "טקס הפתיחה יתקיים באצטדיון Azteca במקסיקו סיטי.",
  },
  {
    id: 3,
    question: "מי מחזיק ברקורד של הכי הרבה כדורים במונדיאל אחד?",
    options: ["רונאלדו", "מסי", "ז'וסט פונטן", "גרד מולר"],
    correct: 2,
    fact: "ז'וסט פונטן (צרפת) כבש 13 כדורים במונדיאל 1958 — שיא שעדיין לא נשבר.",
  },
  {
    id: 4,
    question: "כמה פעמים זכתה ברזיל בגביע העולם?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    fact: "ברזיל היא המדינה המצליחה ביותר עם 5 אליפויות עולם.",
  },
  {
    id: 5,
    question: "מה כינויה של נבחרת ארגנטינה?",
    options: ["לה פוריה", "לה אלביסלסטה", "לה סלסיאון", "לה סקאדרה"],
    correct: 1,
    fact: "La Albiceleste — על שם צבעי החולצה הלבן-תכלת.",
  },
];

// Simulated vote distribution per question (total 100%)
const SIMULATED_VOTES = [
  [12, 8, 63, 17],
  [24, 51, 19, 6],
  [18, 22, 40, 20],
  [7, 15, 61, 17],
  [11, 55, 28, 6],
];

function PercentBar({ pct, isCorrect, isChosen, animate }) {
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: animate ? `${pct}%` : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: isCorrect
            ? 'linear-gradient(90deg,#34d399,#10b981)'
            : isChosen
            ? 'linear-gradient(90deg,#f87171,#ef4444)'
            : 'rgba(255,255,255,0.18)',
        }}
      />
    </div>
  );
}

function TriviaCard({ q, qIndex, total, onAnswer, onNext, onPrev, onReset }) {
  const [chosen, setChosen] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const votes = SIMULATED_VOTES[qIndex] || [25, 25, 25, 25];

  const handleChoice = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    setTimeout(() => setShowResult(true), 300);
    onAnswer(i === q.correct);
  };

  const isAnswered = chosen !== null;

  return (
    <div className="flex flex-col" style={{ minHeight: 480 }}>
      {/* Question number */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-slate-500 text-xs">שאלה {qIndex + 1} מתוך {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors"
              style={{ background: i === qIndex ? '#f5c518' : 'rgba(255,255,255,0.12)' }} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8 flex-1">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,rgba(245,197,24,.2),rgba(245,197,24,.05))', border: '1px solid rgba(245,197,24,.3)' }}>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-white font-bold text-base leading-snug pt-1">{q.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correct;
            const isChosen  = i === chosen;
            const pct       = votes[i];

            let borderColor = 'rgba(255,255,255,0.1)';
            let bg          = 'rgba(255,255,255,0.04)';
            let textColor   = 'rgba(255,255,255,0.75)';

            if (isAnswered) {
              if (isCorrect) {
                borderColor = 'rgba(52,211,153,0.6)';
                bg          = 'rgba(52,211,153,0.08)';
                textColor   = '#34d399';
              } else if (isChosen) {
                borderColor = 'rgba(248,113,113,0.6)';
                bg          = 'rgba(248,113,113,0.08)';
                textColor   = '#f87171';
              }
            }

            return (
              <motion.button
                key={i}
                type="button"
                whileTap={!isAnswered ? { scale: 0.98 } : {}}
                onClick={() => handleChoice(i)}
                className="w-full text-right rounded-xl px-4 py-3 transition-all duration-300"
                style={{
                  border: `1px solid ${borderColor}`,
                  background: bg,
                  cursor: isAnswered ? 'default' : 'pointer',
                  touchAction: 'manipulation',
                }}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                    {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
                    {(!isAnswered || (!isCorrect && !isChosen)) && (
                      <span className="w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
                        style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }}>
                        {['א','ב','ג','ד'][i]}
                      </span>
                    )}
                    <span className="text-sm font-medium truncate" style={{ color: textColor }}>{opt}</span>
                  </div>
                  {showResult && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                      className="text-xs font-bold flex-shrink-0" style={{ color: isCorrect ? '#34d399' : 'rgba(255,255,255,0.35)' }}>
                      {pct}%
                    </motion.span>
                  )}
                </div>
                {showResult && (
                  <PercentBar pct={pct} isCorrect={isCorrect} isChosen={isChosen} animate={showResult} />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Fact + controls */}
      <AnimatePresence>
        {showResult && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="mb-4 px-4 py-3 rounded-xl text-xs text-slate-400 leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              💡 {q.fact}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav buttons */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-4">
        <button type="button" onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-slate-300 transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <RotateCcw className="w-3.5 h-3.5" /> איפוס
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onPrev} disabled={qIndex === 0}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium transition-all disabled:opacity-30"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            <ChevronRight className="w-3.5 h-3.5" /> קודם
          </button>
          <button type="button" onClick={onNext} disabled={qIndex === total - 1}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30"
            style={{ background: 'rgba(245,197,24,0.15)', border: '1px solid rgba(245,197,24,0.4)', color: '#f5c518' }}>
            הבא <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminTriviaDemo() {
  const [qIndex, setQIndex]     = useState(0);
  const [answered, setAnswered] = useState({}); // qIndex → true/false
  const [key, setKey]           = useState(0);  // force remount on reset

  const handleAnswer = (correct) => {
    setAnswered(prev => ({ ...prev, [qIndex]: correct }));
  };

  const handleReset = () => {
    setAnswered({});
    setKey(k => k + 1);
    setQIndex(0);
  };

  const score = Object.values(answered).filter(Boolean).length;
  const total = QUESTIONS.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <HelpCircle className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Trivia יומית — דמו</h2>
          <p className="text-slate-400 text-sm">תצוגה מקדימה של חלון השאלה היומית</p>
        </div>
      </div>

      {/* Score strip */}
      <div className="flex items-center gap-4 px-4 py-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <span className="text-slate-400 text-xs">ניקוד בדמו:</span>
        <span className="text-amber-400 font-bold">{score} / {Object.keys(answered).length || '—'}</span>
        <span className="text-slate-600 text-xs mr-auto">שאלה {qIndex + 1}/{total}</span>
      </div>

      {/* Modal preview */}
      <div className="max-w-sm mx-auto">
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(5,10,20,0.97)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
          <div className="px-5 pt-5 pb-6">
            <AnimatePresence mode="wait">
              <motion.div key={`${key}-${qIndex}`}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}>
                <TriviaCard
                  q={QUESTIONS[qIndex]}
                  qIndex={qIndex}
                  total={total}
                  onAnswer={handleAnswer}
                  onNext={() => setQIndex(i => Math.min(i + 1, total - 1))}
                  onPrev={() => setQIndex(i => Math.max(i - 1, 0))}
                  onReset={handleReset}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />
        </div>

        <p className="text-center text-slate-600 text-[11px] mt-3">
          האחוזים הם סימולציה — בגרסה הסופית יגיעו מ-Supabase
        </p>
      </div>
    </div>
  );
}
