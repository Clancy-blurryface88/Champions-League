import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wifi, WifiOff, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const STATUS_MAP = {
  IN_PLAY:   { label: '🔴 LIVE',  color: 'bg-green-600',  pulse: true },
  PAUSED:    { label: '⏸ HT',    color: 'bg-orange-600', pulse: false },
  FINISHED:  { label: 'FT',       color: 'bg-slate-600',  pulse: false },
  SCHEDULED: { label: 'מתוכנן',   color: 'bg-blue-700',   pulse: false },
  TIMED:     { label: 'מתוכנן',   color: 'bg-blue-700',   pulse: false },
  POSTPONED: { label: 'נדחה',     color: 'bg-red-800',    pulse: false },
  CANCELLED: { label: 'בוטל',     color: 'bg-red-800',    pulse: false },
};

function StatusBadge({ status, minute }) {
  const s = STATUS_MAP[status] || { label: status, color: 'bg-slate-700', pulse: false };
  return (
    <div className="flex items-center gap-1 justify-center">
      <span className={`text-xs text-white px-2 py-0.5 rounded-full font-bold ${s.color} ${s.pulse ? 'animate-pulse' : ''}`}>
        {s.label}
      </span>
      {minute && (status === 'IN_PLAY' || status === 'PAUSED') && (
        <span className="text-xs text-white bg-blue-700 px-2 py-0.5 rounded-full font-bold">{minute}'</span>
      )}
    </div>
  );
}

function MatchCard({ match, index }) {
  const home = match.homeTeam?.shortName || match.homeTeam?.name || '?';
  const away = match.awayTeam?.shortName || match.awayTeam?.name || '?';
  const homeCrest = match.homeTeam?.crest;
  const awayCrest = match.awayTeam?.crest;
  const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? '-';
  const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? '-';
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-xl border px-4 py-3 mb-2 ${isLive ? 'border-green-500/40 bg-green-900/10' : 'border-slate-700/50 bg-slate-800/50'}`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* Home */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {homeCrest && <img src={homeCrest} alt={home} className="w-7 h-7 object-contain" />}
          <span className="text-white text-xs font-medium text-center leading-tight">{home}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <motion.span
            className="text-white font-bold text-xl min-w-[52px] text-center"
            animate={isLive ? { opacity: [1, 0.6, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {homeScore} – {awayScore}
          </motion.span>
          <StatusBadge status={match.status} minute={match.minute} />
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-1 flex-1">
          {awayCrest && <img src={awayCrest} alt={away} className="w-7 h-7 object-contain" />}
          <span className="text-white text-xs font-medium text-center leading-tight">{away}</span>
        </div>
      </div>

      {/* Time */}
      {match.utcDate && (
        <p className="text-slate-500 text-[10px] text-center mt-2">
          {new Date(match.utcDate).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
        </p>
      )}
    </motion.div>
  );
}

export default function LiveDataPanel({ onClose }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState('LIVE');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/football?competition=WC&filter=${filter}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'שגיאה');
      setMatches(json.matches || []);
      setLastUpdate(new Date());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg">⚽ Live תוצאות</span>
              <button onClick={load} disabled={loading} className="text-slate-400 hover:text-white">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {[{ key: 'LIVE', label: '🔴 חי' }, { key: 'TODAY', label: '📅 היום' }, { key: 'FINISHED', label: '✅ הסתיים' }].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 text-xs py-1 rounded-md font-medium transition-colors ${filter === f.key ? 'bg-yellow-400 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Last update */}
          <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              {error ? <WifiOff className="w-3 h-3 text-red-400" /> : <Wifi className="w-3 h-3 text-green-400" />}
              <span>FIFA World Cup 2026</span>
            </div>
            {lastUpdate && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {loading && matches.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-400 text-sm">{error}</p>
              <button onClick={load} className="mt-3 text-yellow-400 text-xs underline">נסה שוב</button>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">⚽</p>
              <p className="text-slate-400">אין משחקים כרגע</p>
              <p className="text-slate-600 text-xs mt-1">נסה "היום" לראות משחקי היום</p>
            </div>
          ) : (
            <AnimatePresence>
              {matches.map((match, i) => (
                <MatchCard key={match.id} match={match} index={i} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </>
  );
}
