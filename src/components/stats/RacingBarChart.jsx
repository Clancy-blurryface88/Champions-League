import React, { useState, useEffect, useRef, useMemo } from "react";
import { PublicProfile, Round, Match, Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";

const COLORS = [
  "#f59e0b","#3b82f6","#10b981","#ef4444","#8b5cf6",
  "#ec4899","#06b6d4","#84cc16","#f97316","#d946ef",
  "#a3e635","#fb923c","#38bdf8","#f472b6","#34d399",
];
const TOP_N = 8;
const SPEED = 1600;

export default function RacingBarChart() {
  const [loading, setLoading] = useState(true);
  const [frames, setFrames] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [nameMap, setNameMap] = useState({});
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [roundsData, profilesData, matchesData, predictionsData] = await Promise.all([
          Round.list('order'), PublicProfile.list(), Match.list(), Prediction.list(),
        ]);

        const sortedRounds = roundsData.sort((a, b) => a.order - b.order);

        const uniqueProfiles = new Map();
        profilesData.forEach(p => { if (!uniqueProfiles.has(p.user_id)) uniqueProfiles.set(p.user_id, p); });
        const users = Array.from(uniqueProfiles.values());

        const cm = {}, nm = {};
        users.forEach((u, i) => {
          cm[u.user_id] = COLORS[i % COLORS.length];
          nm[u.user_id] = u.display_name || u.user_id.slice(0, 8);
        });
        setColorMap(cm);
        setNameMap(nm);

        const matchesByRound = {};
        matchesData.forEach(m => {
          if (!matchesByRound[m.round_id]) matchesByRound[m.round_id] = [];
          if (m.is_finished) matchesByRound[m.round_id].push(m);
        });

        const predsMap = {};
        predictionsData.forEach(p => {
          if (!predsMap[p.match_id]) predsMap[p.match_id] = {};
          predsMap[p.match_id][p.user_id] = p;
        });

        const cumPts = {};
        users.forEach(u => { cumPts[u.user_id] = 0; });

        const built = [];
        for (const round of sortedRounds) {
          const rMatches = matchesByRound[round.id] || [];
          if (rMatches.length === 0) continue;

          users.forEach(u => {
            rMatches.forEach(m => {
              const pred = predsMap[m.id]?.[u.user_id];
              if (pred) cumPts[u.user_id] += pred.points_earned || 0;
            });
          });

          built.push({
            label: round.name,
            pts: { ...cumPts },
          });
        }

        setFrames(built);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // auto-advance
  useEffect(() => {
    clearInterval(timerRef.current);
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setFrameIndex(prev => {
        if (prev >= frames.length - 1) { setPlaying(false); return prev; }
        return prev + 1;
      });
    }, SPEED);
    return () => clearInterval(timerRef.current);
  }, [playing, frames.length]);

  const currentFrame = frames[frameIndex];

  // sorted top-N for this frame
  const rankedUsers = useMemo(() => {
    if (!currentFrame) return [];
    return Object.entries(currentFrame.pts)
      .map(([id, pts]) => ({ id, pts: Math.round(pts * 100) / 100 }))
      .sort((a, b) => b.pts - a.pts)
      .slice(0, TOP_N);
  }, [currentFrame]);

  const maxPts = rankedUsers[0]?.pts || 1;

  if (loading) {
    return (
      <Card className="bg-slate-800/80 border border-slate-700">
        <CardContent className="flex justify-center py-12">
          <OrbitSpinner size={40} />
        </CardContent>
      </Card>
    );
  }

  if (frames.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-700/50">
          <CardTitle className="text-white text-center text-base">🏁 מירוץ הדירוג</CardTitle>
        </CardHeader>
        <CardContent className="p-4">

          {/* Round label */}
          <div className="text-center mb-5 h-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={currentFrame?.label}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="text-amber-400 font-bold text-sm tracking-wide"
              >
                {currentFrame?.label}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Bars — stable list, positions animate via layout */}
          <div className="space-y-2" dir="rtl">
            {rankedUsers.map((user, i) => {
              const pct = Math.max((user.pts / maxPts) * 100, 2);
              const color = colorMap[user.id] || '#888';
              return (
                <motion.div
                  key={user.id}
                  layout
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="flex items-center gap-2"
                >
                  {/* rank */}
                  <span className="text-slate-400 text-[11px] w-4 flex-shrink-0 text-right">{i + 1}</span>
                  {/* name */}
                  <span className="text-white text-[11px] w-20 truncate flex-shrink-0">{nameMap[user.id]}</span>
                  {/* bar track */}
                  <div className="flex-1 bg-slate-700/40 rounded-full h-6 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end px-2"
                      style={{ backgroundColor: color }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                    >
                      <span className="text-[10px] font-bold text-black/80 whitespace-nowrap">{user.pts}</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-5 flex-wrap">
            {frames.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setFrameIndex(i); }}
                className={`rounded-full transition-all duration-200 ${
                  i === frameIndex ? 'w-4 h-2 bg-amber-400' : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => { setPlaying(false); setFrameIndex(0); }}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setPlaying(p => !p)}
              className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm transition-all flex items-center gap-2"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? 'עצור' : frameIndex === 0 ? 'הפעל' : 'המשך'}
            </button>

            <button
              onClick={() => { setPlaying(false); if (frameIndex < frames.length - 1) setFrameIndex(f => f + 1); }}
              disabled={frameIndex >= frames.length - 1}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-slate-500 text-[10px] mt-2">
            מחזור {frameIndex + 1} מתוך {frames.length}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
