import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Crown, TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import TeamFlag from "@/components/TeamFlag";
import BlurScoreCounter from "@/components/BlurScoreCounter";
import { Match, Prediction, PublicProfile } from "@/api/entities";
import { LoaderBar } from "@/components/ui/LoaderBar";
import { findRecapDate, computeDailyRecap } from "@/utils/dailyRecap";

const cardVariants = {
  enter: (direction) => ({ x: direction > 0 ? 1000 : -1000, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 1000 : -1000, opacity: 0 }),
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

const seenKey = (recapDate, uid) => `daily_recap_seen_${recapDate}_${uid}`;
const RECAP_PAGE_COUNT = 4; // intro, personal, group, outro

function fmtDayLabel(dateKey) {
  const d = new Date(`${dateKey}T12:00:00`);
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'numeric' });
}

function Confetti({ count = 26 }) {
  const pieces = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.6 + Math.random() * 1.1,
    rotate: 180 + Math.random() * 360,
    color: ['#f5c518', '#4ade80', '#2dd4bf', '#ffffff'][i % 4],
  })), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{ y: 320, opacity: [0, 1, 1, 0], rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{ position: 'absolute', top: 0, left: `${p.left}%`, width: 6, height: 10, background: p.color, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

export default function DailyRecapModal({ isOpen, onClose, user, forceShow = false }) {
  const [status, setStatus] = useState('loading'); // loading | ready | none
  const [recap, setRecap] = useState(null);
  const [aiLine, setAiLine] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!isOpen || !user?.id) return;
    let cancelled = false;

    (async () => {
      setStatus('loading');
      try {
        const matches = await Match.list();
        const recapDate = findRecapDate(matches);

        if (!recapDate) { if (!cancelled) { setStatus('none'); } return; }
        if (!forceShow && localStorage.getItem(seenKey(recapDate, user.id)) === 'true') {
          if (!cancelled) setStatus('none');
          return;
        }

        const [predictions, profiles] = await Promise.all([Prediction.list(), PublicProfile.list()]);
        const data = computeDailyRecap({ matches, predictions, profiles, userId: user.id, recapDate });
        if (!data) { if (!cancelled) setStatus('none'); return; }

        if (cancelled) return;
        setRecap(data);
        setStatus('ready');
        setPage(0);

        // Fire off the AI headline in parallel — never blocks the screen.
        setAiLoading(true);
        try {
          const res = await fetch('/api/generate-daily-brief', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recap_date: recapDate }),
          });
          if (res.ok) {
            const json = await res.json();
            if (!cancelled) setAiLine(json.brief?.brief_he || null);
          }
        } catch {
          // No AI line — the screen still works fine with stats alone.
        } finally {
          if (!cancelled) setAiLoading(false);
        }
      } catch (err) {
        console.error('DailyRecapModal load error:', err);
        if (!cancelled) setStatus('none');
      }
    })();

    return () => { cancelled = true; };
  }, [isOpen, user?.id, forceShow]);

  // Nothing to recap on an automatic (non-forced) trigger — skip silently.
  useEffect(() => {
    if (status === 'none' && !forceShow) onClose();
  }, [status, forceShow, onClose]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (recap) {
      try { localStorage.setItem(seenKey(recap.recapDate, user.id), 'true'); } catch {}
    }
    onClose();
  };

  const paginate = (dir) => {
    const next = page + dir;
    if (next >= 0 && next < RECAP_PAGE_COUNT) { setPage(next); setDirection(dir); }
  };

  if (status === 'loading') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg" style={{ background: '#030d1a' }}>
        <LoaderBar text="LOADING" />
      </div>
    );
  }

  if (status === 'none') {
    // Only reachable here when forceShow=true (auto-trigger already closed itself).
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-8"
        style={{ background: '#030d1a' }}
      >
        <button onClick={onClose} className="absolute top-14 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <X className="h-4 w-4 text-white/80" />
        </button>
        <span className="text-4xl mb-4">🗓️</span>
        <p className="text-white/70 text-sm">אין עדיין סיכום יומי זמין — נחכה למשחקים הבאים</p>
      </motion.div>
    );
  }

  const { personal, kingOfDay, dayMatches, recapDate } = recap;
  const RankIcon = personal.rankChange > 0 ? TrendingUp : personal.rankChange < 0 ? TrendingDown : Minus;
  const rankColor = personal.rankChange > 0 ? '#4ade80' : personal.rankChange < 0 ? '#f87171' : '#94a3b8';
  const isKing = kingOfDay?.userId === user.id;

  // Per-page accent — drives the background glow + progress indicators, so
  // each beat of the story reads with its own emotional color.
  const PAGE_ACCENTS = ['#f5c518', rankColor, '#2dd4bf', '#f5c518'];
  const accent = PAGE_ACCENTS[page];

  const PageIntro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="text-xs uppercase tracking-[0.3em] text-amber-400/70 font-semibold mb-6">
        {fmtDayLabel(recapDate)}
      </motion.p>

      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
        className="relative mb-8">
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: 'rgba(245,197,24,0.3)' }}
          animate={{ scale: [1.3, 1.55, 1.3] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <img src="/trophy.png" alt="" className="w-32 h-32 object-contain relative z-10" style={{ filter: 'drop-shadow(0 0 24px rgba(245,197,24,0.6))' }} />
      </motion.div>

      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="text-3xl font-black mb-6" style={{ fontFamily: "'Russo One', sans-serif", color: '#fff' }}>
        מה קרה אתמול
      </motion.h1>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="min-h-[64px] flex items-center justify-center max-w-sm">
        {aiLoading ? (
          <div className="flex items-center gap-2 text-white/30 text-sm">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>הפרשן מכין את הפתיח...</span>
          </div>
        ) : aiLine ? (
          <p className="text-white/85 text-base leading-relaxed">{aiLine}</p>
        ) : (
          <p className="text-white/50 text-sm">יום נוסף במונדיאל 2026 מאחורינו — בואו נראה איך הלך.</p>
        )}
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-10 text-white/25 text-xs">החלק ימינה להמשיך →</motion.p>
    </div>
  );

  const PagePersonal = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <p className="text-xs uppercase tracking-[0.25em] text-amber-400/70 mb-6">איפה אתה עומד</p>

      <div className="text-[5rem] font-black leading-none mb-1" style={{ color: '#f5c518', filter: 'drop-shadow(0 0 20px rgba(245,197,24,0.35))' }}>
        <BlurScoreCounter value={personal.points} duration={1.2} showDecimals={!Number.isInteger(personal.points)} />
      </div>
      <p className="text-white/40 text-sm tracking-widest uppercase">נקודות אתמול</p>

      {personal.vsAverage != null && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-xs mt-2 mb-6" style={{ color: personal.vsAverage >= 0 ? '#4ade80' : '#f87171' }}>
          {personal.vsAverage >= 0 ? `+${personal.vsAverage}` : personal.vsAverage} נק' לעומת ממוצע הקבוצה ({personal.groupAveragePoints})
        </motion.p>
      )}

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-6 mt-2">
        <div className="rounded-2xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="text-2xl font-black text-white">{personal.exactHits}</div>
          <div className="text-white/40 text-xs mt-1">פגיעות מדויקות</div>
        </div>
        <div className="rounded-2xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="text-2xl font-black text-white">{personal.correctOutcomes}/{personal.totalMatches}</div>
          <div className="text-white/40 text-xs mt-1">כיוונים נכונים</div>
        </div>
      </div>

      {personal.rankAfter != null && (
        <div className="flex items-center gap-2 rounded-full px-5 py-2.5 mb-3" style={{ background: `${rankColor}18`, border: `1px solid ${rankColor}50` }}>
          <RankIcon className="w-4 h-4" style={{ color: rankColor }} />
          <span className="text-sm font-bold" style={{ color: rankColor }}>
            {personal.rankChange > 0 ? `עלית ${personal.rankChange} מקומות` : personal.rankChange < 0 ? `ירדת ${Math.abs(personal.rankChange)} מקומות` : 'ללא שינוי במיקום'}
          </span>
          <span className="text-white/40 text-xs">(כעת מקום {personal.rankAfter})</span>
        </div>
      )}

      {(personal.overtook.length > 0 || personal.overtakenBy.length > 0) && (
        <div className="flex flex-col gap-1 w-full max-w-xs">
          {personal.overtook.map((o) => (
            <div key={o.userId} className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#4ade80' }}>
              <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" /><span>עקפת את {o.name}</span>
            </div>
          ))}
          {personal.overtakenBy.map((o) => (
            <div key={o.userId} className="flex items-center justify-center gap-1.5 text-xs" style={{ color: '#f87171' }}>
              <TrendingDown className="w-3.5 h-3.5 flex-shrink-0" /><span>{o.name} עקף אותך</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const PageGroup = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 w-full select-none relative">
      {isKing && <Confetti />}

      {kingOfDay && (
        <div className="mb-6 relative z-10">
          <Crown className="w-10 h-10 mx-auto mb-2" style={{ color: '#f5c518' }} />
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">מלך היום{isKing ? ' — זה אתה! 🎉' : ''}</p>
          <p className="text-2xl font-black text-white">{kingOfDay.name}</p>
          <p className="text-amber-400 text-sm mt-0.5">
            <BlurScoreCounter value={kingOfDay.exactHits} duration={0.9} showDecimals={false} /> פגיעות מדויקות
          </p>
        </div>
      )}

      <div className="w-full max-w-sm space-y-2 relative z-10">
        {dayMatches.map((m) => {
          const ratio = m.totalPredictions > 0 ? (m.exactCount / m.totalPredictions) * 100 : 0;
          return (
            <div key={m.id} className="rounded-xl px-4 py-2.5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TeamFlag logo={m.team_a_logo} name={m.team_a} className="w-6 h-6" animate={false} />
                  <span className="text-white text-xs font-bold">{m.actual_score_a}-{m.actual_score_b}</span>
                  <TeamFlag logo={m.team_b_logo} name={m.team_b} className="w-6 h-6" animate={false} />
                </div>
                {m.totalPredictions > 0 && (
                  <span className="text-[11px] text-white/40 flex-shrink-0">{m.exactCount}/{m.totalPredictions} בול</span>
                )}
              </div>
              {m.totalPredictions > 0 && (
                <div className="w-full h-1 rounded-full overflow-hidden mt-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: '#2dd4bf' }}
                    initial={{ width: '0%' }} animate={{ width: `${ratio}%` }} transition={{ duration: 0.8, delay: 0.2 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const PageOutro = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 select-none">
      <Sparkles className="w-14 h-14 mb-6" style={{ color: '#f5c518' }} />
      <h2 className="text-2xl font-bold text-white mb-10">
        {isKing ? 'המשך כך — אתה שולט!' : 'שיהיה יום מוצלח'}
      </h2>
      <button
        onClick={handleClose}
        className="text-lg font-bold py-4 px-10 rounded-full shadow-2xl transition-transform hover:scale-105"
        style={{ background: '#f5c518', color: '#000' }}
      >
        בואו נמשיך
      </button>
    </div>
  );

  const pages = [<PageIntro key="intro" />, <PagePersonal key="personal" />, <PageGroup key="group" />, <PageOutro key="outro" />];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed inset-0 z-50 text-white flex flex-col" style={{ background: '#030d1a' }}
    >
      {/* Per-page emotional glow */}
      <AnimatePresence mode="sync">
        <motion.div
          key={page}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
          className="absolute inset-0 pointer-events-none z-0"
          style={{ background: `radial-gradient(ellipse at 50% 20%, ${accent}22 0%, transparent 60%)` }}
        />
      </AnimatePresence>

      <button onClick={handleClose}
        className="absolute top-14 right-4 z-50 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
        <X className="h-4 w-4 text-white/80" />
      </button>

      {/* Progress pills */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 px-3 pt-3 z-40">
        {pages.map((_, idx) => (
          <div key={idx} className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            {idx < page && <div className="h-full w-full rounded-full" style={{ background: PAGE_ACCENTS[idx] }} />}
            {idx === page && (
              <motion.div className="h-full rounded-full" style={{ background: accent }}
                initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 4, ease: 'linear' }} />
            )}
          </div>
        ))}
      </div>

      <div className="flex-grow flex items-center justify-center relative overflow-hidden z-10">
        <div className="absolute inset-0 flex z-20">
          <div className="flex-1 cursor-pointer" onClick={() => paginate(-1)} />
          <div className="flex-1 cursor-pointer" onClick={() => paginate(1)} />
        </div>

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page} custom={direction} variants={cardVariants} initial="enter" animate="center" exit="exit"
            transition={{ x: { type: 'spring', stiffness: 280, damping: 28 }, opacity: { duration: 0.15 } }}
            drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.8}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) paginate(1);
              else if (swipe > swipeConfidenceThreshold) paginate(-1);
            }}
            className="absolute w-full h-full flex items-center justify-center z-10"
          >
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-1.5 pb-10 pt-4 z-40">
        {pages.map((_, idx) => (
          <button key={idx} onClick={() => { const d = idx > page ? 1 : -1; setDirection(d); setPage(idx); }}
            className="rounded-full transition-all duration-300"
            style={{ width: idx === page ? 20 : 6, height: 6, background: idx === page ? accent : 'rgba(255,255,255,0.2)' }} />
        ))}
      </div>
    </motion.div>
  );
}
