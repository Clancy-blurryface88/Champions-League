import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw, Wifi, WifiOff, Clock } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";

const FILTERS = [
  { key: 'LIVE',     label: 'חי',      emoji: '🔴' },
  { key: 'TODAY',    label: 'היום',    emoji: '📅' },
  { key: 'FINISHED', label: 'הסתיים', emoji: '✅' },
];

const STATUS_MAP = {
  IN_PLAY:   { label: 'LIVE',    dot: 'bg-red-500',    text: 'text-red-400',    pulse: true  },
  PAUSED:    { label: 'HT',      dot: 'bg-orange-400', text: 'text-orange-400', pulse: false },
  FINISHED:  { label: 'FT',      dot: 'bg-slate-500',  text: 'text-slate-400',  pulse: false },
  SCHEDULED: { label: 'מתוכנן', dot: 'bg-blue-500',   text: 'text-blue-400',   pulse: false },
  TIMED:     { label: 'מתוכנן', dot: 'bg-blue-500',   text: 'text-blue-400',   pulse: false },
  POSTPONED: { label: 'נדחה',   dot: 'bg-red-700',    text: 'text-red-500',    pulse: false },
  CANCELLED: { label: 'בוטל',   dot: 'bg-red-700',    text: 'text-red-500',    pulse: false },
};

function StatusBadge({ status, minute }) {
  const s = STATUS_MAP[status] || { label: status, dot: 'bg-slate-600', text: 'text-slate-400', pulse: false };
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold tracking-widest uppercase ${s.text}`}>
        {s.label}{minute && (status === 'IN_PLAY' || status === 'PAUSED') ? ` ${minute}'` : ''}
      </span>
    </div>
  );
}

function MatchCard({ match, index }) {
  const home = match.homeTeam?.shortName || match.homeTeam?.name || '?';
  const away = match.awayTeam?.shortName || match.awayTeam?.name || '?';
  const homeCrest = match.homeTeam?.crest;
  const awayCrest = match.awayTeam?.crest;
  const homeScore = match.score?.fullTime?.home ?? match.score?.halfTime?.home ?? null;
  const awayScore = match.score?.fullTime?.away ?? match.score?.halfTime?.away ?? null;
  const hasScore = homeScore !== null && awayScore !== null;
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="relative overflow-hidden rounded-2xl mb-3"
      style={{
        background: isLive
          ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,13,26,0.9) 100%)'
          : 'rgba(255,255,255,0.04)',
        border: isLive
          ? '1px solid rgba(16,185,129,0.25)'
          : '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Live glow strip */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      )}

      <div className="px-4 py-3.5">
        {/* Status row */}
        <div className="flex items-center justify-between mb-3">
          <StatusBadge status={match.status} minute={match.minute} />
          {match.utcDate && !isLive && (
            <span className="text-[10px] text-slate-500">
              {new Date(match.utcDate).toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>

        {/* Teams + Score */}
        <div className="flex items-center gap-2">
          {/* Home team */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {homeCrest
              ? <img src={homeCrest} alt={home} className="w-9 h-9 object-contain drop-shadow-md" />
              : <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-lg">⚽</div>
            }
            <span className="text-white/80 text-[11px] font-semibold text-center leading-tight">{home}</span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center flex-shrink-0 min-w-[64px]">
            {hasScore ? (
              <motion.div
                className="flex items-center gap-1"
                animate={isLive ? { opacity: [1, 0.75, 1] } : {}}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{
                    background: isLive
                      ? 'linear-gradient(135deg, #34d399, #fff)'
                      : isFinished
                        ? 'linear-gradient(135deg, #94a3b8, #fff)'
                        : 'linear-gradient(135deg, #fbbf24, #fff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {homeScore}
                </span>
                <span className="text-white/30 text-lg font-light">–</span>
                <span
                  className="text-2xl font-black tabular-nums"
                  style={{
                    background: isLive
                      ? 'linear-gradient(135deg, #34d399, #fff)'
                      : isFinished
                        ? 'linear-gradient(135deg, #94a3b8, #fff)'
                        : 'linear-gradient(135deg, #fbbf24, #fff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {awayScore}
                </span>
              </motion.div>
            ) : (
              <span className="text-white/20 text-lg font-bold">vs</span>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-1.5 flex-1">
            {awayCrest
              ? <img src={awayCrest} alt={away} className="w-9 h-9 object-contain drop-shadow-md" />
              : <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-lg">⚽</div>
            }
            <span className="text-white/80 text-[11px] font-semibold text-center leading-tight">{away}</span>
          </div>
        </div>
      </div>
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
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[45]"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        className="fixed inset-y-0 right-0 w-[340px] z-50 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #060e1c 0%, #0a1628 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Gold top border */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent flex-shrink-0" />

        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src="/wc-trophy.png" alt="trophy" className="w-7 h-7 object-contain"
                  onError={e => { e.target.style.display='none'; }} />
              </div>
              <div>
                <p className="text-white font-bold text-[15px] leading-tight tracking-wide">Live Results</p>
                <p
                  className="text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ background: 'linear-gradient(90deg, #f5c518, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >
                  FIFA World Cup 2026
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={load}
                disabled={loading}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/8"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/8"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="relative flex bg-white/4 rounded-xl p-1 border border-white/6">
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="relative flex-1 py-2 text-xs font-semibold rounded-lg transition-colors z-10"
                style={{ color: filter === f.key ? '#000' : 'rgba(255,255,255,0.4)' }}
              >
                {filter === f.key && (
                  <motion.div
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #f5c518, #fde68a)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{f.emoji} {f.label}</span>
              </button>
            ))}
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between mt-3 text-[10px]">
            <div className="flex items-center gap-1.5">
              {error
                ? <WifiOff className="w-3 h-3 text-red-400" />
                : <Wifi className="w-3 h-3 text-emerald-400" />
              }
              <span className="text-slate-500">מתעדכן כל 30 שניות</span>
            </div>
            {lastUpdate && (
              <div className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3 h-3" />
                <span>{lastUpdate.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-5 bg-gradient-to-r from-transparent via-white/8 to-transparent flex-shrink-0" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="wait">
            {loading && matches.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3"
              >
                <OrbitSpinner size={36} />
                <span className="text-slate-500 text-xs">טוען נתונים...</span>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <WifiOff className="w-10 h-10 text-red-400/40 mx-auto mb-3" />
                <p className="text-red-400 text-sm mb-3">{error}</p>
                <button onClick={load} className="text-amber-400 text-xs underline hover:text-amber-300">נסה שוב</button>
              </motion.div>
            ) : matches.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 gap-3"
              >
                <span className="text-5xl">⚽</span>
                <p className="text-slate-400 text-sm font-medium">אין משחקים כרגע</p>
                <p className="text-slate-600 text-xs">נסה "היום" לראות משחקי היום</p>
              </motion.div>
            ) : (
              <motion.div key="matches" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {matches.map((match, i) => (
                  <MatchCard key={match.id} match={match} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom gold line */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent flex-shrink-0" />
      </motion.div>
    </>
  );
}
