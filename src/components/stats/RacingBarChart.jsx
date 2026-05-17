import React, { useState, useEffect, useRef } from "react";
import { PublicProfile, Round, Match, Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderBar } from "@/components/ui/LoaderBar";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";

const COLORS = [
  "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#d946ef",
  "#a3e635", "#fb923c", "#38bdf8", "#f472b6", "#34d399",
];

export default function RacingBarChart() {
  const [loading, setLoading] = useState(true);
  const [frames, setFrames] = useState([]);   // [{round, users: [{id, name, points, color}]}]
  const [frameIndex, setFrameIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);
  const SPEED = 1800;
  const TOP_N = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roundsData, profilesData, matchesData, predictionsData] = await Promise.all([
          Round.list('order'),
          PublicProfile.list(),
          Match.list(),
          Prediction.list(),
        ]);

        const sortedRounds = roundsData.sort((a, b) => a.order - b.order);

        const uniqueProfilesMap = new Map();
        profilesData.forEach(p => {
          if (!uniqueProfilesMap.has(p.user_id)) uniqueProfilesMap.set(p.user_id, p);
        });
        const users = Array.from(uniqueProfilesMap.values());

        // assign stable colors
        const colorMap = {};
        users.forEach((u, i) => { colorMap[u.user_id] = COLORS[i % COLORS.length]; });

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

        const cumPoints = {};
        users.forEach(u => { cumPoints[u.user_id] = 0; });

        const builtFrames = [];

        sortedRounds.forEach(round => {
          const matches = matchesByRound[round.id] || [];
          if (matches.length === 0) return;

          users.forEach(u => {
            matches.forEach(m => {
              const pred = predsMap[m.id]?.[u.user_id];
              if (pred) cumPoints[u.user_id] += pred.points_earned || 0;
            });
          });

          const sorted = users
            .map(u => ({
              id: u.user_id,
              name: u.display_name || u.user_id.slice(0, 8),
              points: Math.round(cumPoints[u.user_id] * 100) / 100,
              color: colorMap[u.user_id],
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, TOP_N);

          builtFrames.push({ round: round.name, users: sorted });
        });

        setFrames(builtFrames);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setFrameIndex(prev => {
          if (prev >= frames.length - 1) {
            setPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, SPEED);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, frames.length]);

  const reset = () => { setPlaying(false); setFrameIndex(0); };
  const step = () => { if (frameIndex < frames.length - 1) setFrameIndex(f => f + 1); };

  if (loading) return <div className="py-8"><LoaderBar /></div>;
  if (frames.length === 0) return null;

  const frame = frames[frameIndex];
  const maxPts = frame.users[0]?.points || 1;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-700/50">
          <CardTitle className="text-white text-center flex items-center justify-center gap-2 text-base">
            🏁 מירוץ הדירוג
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {/* Round label */}
          <div className="text-center mb-4">
            <AnimatePresence mode="wait">
              <motion.span
                key={frame.round}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="text-amber-400 font-bold text-sm tracking-wide"
              >
                {frame.round}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Bars */}
          <div className="space-y-2.5" dir="rtl">
            <AnimatePresence>
              {frame.users.map((user, i) => {
                const pct = maxPts > 0 ? (user.points / maxPts) * 100 : 0;
                return (
                  <motion.div
                    key={user.id}
                    layout
                    layoutId={user.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, delay: i * 0.04 }}
                    className="flex items-center gap-2"
                  >
                    {/* Rank */}
                    <span className="text-slate-400 text-xs w-4 text-left flex-shrink-0">{i + 1}</span>

                    {/* Name */}
                    <span className="text-white text-xs w-20 truncate flex-shrink-0">{user.name}</span>

                    {/* Bar */}
                    <div className="flex-1 bg-slate-700/50 rounded-full h-5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full flex items-center justify-end pr-2"
                        style={{ backgroundColor: user.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(pct, 3)}%` }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <span className="text-[10px] font-bold text-black/80 whitespace-nowrap">
                          {user.points}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1 mt-5 flex-wrap">
            {frames.map((_, i) => (
              <button
                key={i}
                onClick={() => { setPlaying(false); setFrameIndex(i); }}
                className={`rounded-full transition-all ${
                  i === frameIndex ? 'w-4 h-2 bg-amber-400' : 'w-2 h-2 bg-slate-600 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={reset}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPlaying(p => !p)}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold text-sm transition-all flex items-center gap-1.5"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? 'עצור' : frameIndex === 0 ? 'הפעל' : 'המשך'}
            </button>
            <button
              onClick={step}
              disabled={frameIndex >= frames.length - 1}
              className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-slate-500 text-[10px] mt-2">
            {frameIndex + 1} / {frames.length} מחזורים
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
