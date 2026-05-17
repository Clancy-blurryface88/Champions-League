import React, { useState, useEffect, useRef, useMemo } from "react";
import { PublicProfile, Round, Match, Prediction } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, ChevronRight } from "lucide-react";
import OrbitSpinner from "@/components/OrbitSpinner";

const COLORS = [
  "#f59e0b","#3b82f6","#10b981","#ef4444","#8b5cf6",
  "#ec4899","#06b6d4","#84cc16","#f97316","#d946ef",
];
const TOP_N = 8;
const SPEED = 1800;

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
        profilesData.forEach(p => {
          if (!uniqueProfiles.has(p.user_id)) uniqueProfiles.set(p.user_id, p);
        });
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

          built.push({ label: round.name, pts: { ...cumPts } });
        }

        setFrames(built);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    clearInterval(timerRef.current);
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setFrameIndex(prev => {
        if (prev >= frames.length - 1) {
          setPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, SPEED);
    return () => clearInterval(timerRef.current);
  }, [playing, frames.length]);

  const rankedUsers = useMemo(() => {
    if (!frames[frameIndex]) return [];
    return Object.entries(frames[frameIndex].pts)
      .map(([id, pts]) => ({ id, pts: Math.round(pts * 100) / 100 }))
      .sort((a, b) => b.pts - a.pts)
      .slice(0, TOP_N);
  }, [frames, frameIndex]);

  const maxPts = rankedUsers[0]?.pts || 1;

  const handlePlay = () => setPlaying(p => !p);
  const handleReset = () => { setPlaying(false); setFrameIndex(0); };
  const handleStep = () => {
    setPlaying(false);
    setFrameIndex(f => Math.min(f + 1, frames.length - 1));
  };

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

  const currentLabel = frames[frameIndex]?.label || '';

  return (
    <Card className="bg-slate-800/80 border border-slate-700 backdrop-blur-sm overflow-hidden mt-6">
      <CardHeader className="pb-3 border-b border-slate-700/50">
        <CardTitle className="text-white text-center text-base">🏁 מירוץ הדירוג</CardTitle>
      </CardHeader>
      <CardContent className="p-4">

        {/* Round label */}
        <div className="text-center mb-5 h-6">
          <span className="text-amber-400 font-bold text-sm tracking-wide">
            {currentLabel}
          </span>
        </div>

        {/* Bars */}
        <div className="space-y-3" dir="rtl">
          {rankedUsers.map((user, i) => {
            const pct = Math.max((user.pts / maxPts) * 100, 3);
            const color = colorMap[user.id] || '#888';
            return (
              <div key={user.id} className="flex items-center gap-2">
                <span className="text-slate-400 text-xs w-4 flex-shrink-0 text-right">{i + 1}</span>
                <span className="text-white text-xs w-20 truncate flex-shrink-0">{nameMap[user.id]}</span>
                <div className="flex-1 bg-slate-700/40 rounded-full h-6 overflow-hidden">
                  <div
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                      transition: 'width 0.8s cubic-bezier(0.23,1,0.32,1)',
                      height: '100%',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '6px',
                    }}
                  >
                    <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'rgba(0,0,0,0.75)', whiteSpace: 'nowrap' }}>
                      {user.pts}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 mt-5 flex-wrap">
          {frames.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPlaying(false); setFrameIndex(i); }}
              style={{
                width: i === frameIndex ? '16px' : '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: i === frameIndex ? '#f59e0b' : '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                padding: 0,
              }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={handleReset}
            style={{ padding: '8px', borderRadius: '8px', background: 'rgba(71,85,105,0.5)', border: 'none', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center' }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={handlePlay}
            style={{
              padding: '8px 24px', borderRadius: '8px',
              background: '#f59e0b', border: 'none', cursor: 'pointer',
              color: 'black', fontWeight: 'bold', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'עצור' : frameIndex === 0 ? 'הפעל' : 'המשך'}
          </button>

          <button
            onClick={handleStep}
            disabled={frameIndex >= frames.length - 1}
            style={{ padding: '8px', borderRadius: '8px', background: 'rgba(71,85,105,0.5)', border: 'none', cursor: 'pointer', color: '#cbd5e1', display: 'flex', alignItems: 'center', opacity: frameIndex >= frames.length - 1 ? 0.3 : 1 }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '10px', marginTop: '8px' }}>
          מחזור {frameIndex + 1} מתוך {frames.length}
        </p>

      </CardContent>
    </Card>
  );
}
