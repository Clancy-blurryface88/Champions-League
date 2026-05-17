import React, { useState, useEffect, useRef } from "react";
import OrbitSpinner from "@/components/OrbitSpinner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, CheckCircle } from "lucide-react";
import { Match } from "@/api/entities";
import TeamFlag from "@/components/TeamFlag";

function localDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function groupMatchesByDate(matches) {
  const groups = {};
  matches.forEach((m) => {
    const key = localDateKey(new Date(m.match_date));
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  });
  return groups;
}

function formatDateTab(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const todayStr = localDateKey(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = localDateKey(tomorrow);

  if (dateStr === todayStr) return { label: "היום", sub: formatShortDate(date), isToday: true };
  if (dateStr === tomorrowStr) return { label: "מחר", sub: formatShortDate(date), isToday: false };
  return { label: formatShortDate(date), sub: formatDayName(date), isToday: false };
}

function formatShortDate(date) {
  return date.toLocaleDateString("he-IL", { day: "numeric", month: "numeric" });
}

function formatDayName(date) {
  return date.toLocaleDateString("he-IL", { weekday: "short" });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
}

function MatchCard({ match }) {
  const finished = match.is_finished;
  const hasScore = match.actual_score_a !== null && match.actual_score_b !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 bg-white/4 border border-white/6 rounded-2xl px-4 py-3"
    >
      {/* Team A */}
      <div className="flex flex-col items-center gap-1 w-16">
        <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-9 h-9" />
        <span className="text-[10px] text-white/70 text-center leading-tight font-medium line-clamp-1 w-full">{match.team_a}</span>
      </div>

      {/* Score / Time */}
      <div className="flex-1 flex flex-col items-center gap-1">
        {finished && hasScore ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tabular-nums">{match.actual_score_a}</span>
              <span className="text-white/30 text-sm">–</span>
              <span className="text-xl font-bold text-white tabular-nums">{match.actual_score_b}</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-emerald-400 font-medium">הסתיים</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-sm font-semibold tabular-nums">{formatTime(match.match_date)}</span>
            </div>
            <span className="text-[10px] text-white/30">טרם החל</span>
          </>
        )}
      </div>

      {/* Team B */}
      <div className="flex flex-col items-center gap-1 w-16">
        <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-9 h-9" />
        <span className="text-[10px] text-white/70 text-center leading-tight font-medium line-clamp-1 w-full">{match.team_b}</span>
      </div>
    </motion.div>
  );
}

export default function MatchesByDateSheet({ isOpen, onClose }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    Match.list("match_date").then((data) => {
      setMatches(data);
      // Auto-select today or nearest date
      const today = localDateKey(new Date());
      const grouped = groupMatchesByDate(data);
      const dates = Object.keys(grouped).sort();
      const todayOrNearest = dates.includes(today)
        ? today
        : dates.find((d) => d >= today) || dates[dates.length - 1];
      setSelectedDate(todayOrNearest);
      setLoading(false);
    });
  }, [isOpen]);

  // Scroll active tab into view
  useEffect(() => {
    if (!selectedDate || !tabsRef.current) return;
    const el = tabsRef.current.querySelector(`[data-date="${selectedDate}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedDate]);

  const grouped = groupMatchesByDate(matches);
  const dates = Object.keys(grouped).sort();
  const dayMatches = selectedDate ? (grouped[selectedDate] || []) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-[#0d1526] rounded-t-3xl flex flex-col max-h-[85vh] shadow-2xl border-t border-white/8"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32, mass: 0.9 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
              <h2 className="text-sm font-semibold text-white/80 tracking-widest uppercase">משחקים לפי תאריך</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-white/50 hover:text-white hover:bg-white/12 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Date Tabs */}
            <div
              ref={tabsRef}
              className="flex gap-2 px-5 pb-3 overflow-x-auto flex-shrink-0 scrollbar-none"
              style={{ scrollbarWidth: "none" }}
            >
              {dates.map((dateStr) => {
                const { label, sub, isToday } = formatDateTab(dateStr);
                const isActive = selectedDate === dateStr;
                const dayMatches = grouped[dateStr] || [];
                const finishedCount = dayMatches.filter(m => m.is_finished).length;

                return (
                  <button
                    key={dateStr}
                    data-date={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 ${
                      isActive
                        ? "bg-amber-500/15 border-amber-400/40 text-amber-400"
                        : "bg-white/4 border-white/8 text-white/50 hover:text-white/80 hover:bg-white/8"
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{label}</span>
                    <span className={`text-[10px] leading-none mt-0.5 ${isActive ? "text-amber-400/70" : "text-white/30"}`}>{sub}</span>
                    <div className="flex items-center gap-0.5 mt-1">
                      <span className={`text-[9px] font-semibold ${isActive ? "text-amber-400/80" : "text-white/25"}`}>
                        {finishedCount}/{dayMatches.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 flex-shrink-0" />

            {/* Matches List */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <OrbitSpinner size={36} />
                </div>
              ) : dayMatches.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-10">אין משחקים בתאריך זה</p>
              ) : (
                dayMatches
                  .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
                  .map((match, i) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <MatchCard match={match} />
                    </motion.div>
                  ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
