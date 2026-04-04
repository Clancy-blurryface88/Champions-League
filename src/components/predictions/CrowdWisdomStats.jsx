import React, { useEffect, useState } from 'react';
import { Prediction } from '@/api/entities';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function CrowdWisdomStats({ matchId, teamA, teamB }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const predictions = await Prediction.filter({ match_id: matchId });

        if (predictions.length === 0) {
          setStats(null);
          setLoading(false);
          return;
        }

        let homeWins = 0;
        let draws = 0;
        let awayWins = 0;

        predictions.forEach((p) => {
          // המרה למספרים למקרה שהם מחרוזות
          const scoreA = Number(p.predicted_score_a);
          const scoreB = Number(p.predicted_score_b);

          if (scoreA > scoreB) homeWins++;else
          if (scoreA < scoreB) awayWins++;else
          draws++;
        });

        const total = predictions.length;

        setStats({
          home: Math.round(homeWins / total * 100),
          draw: Math.round(draws / total * 100),
          away: Math.round(awayWins / total * 100),
          total,
          homeCount: homeWins,
          drawCount: draws,
          awayCount: awayWins
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [matchId]);

  if (loading || !stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-4 pt-3 border-t border-slate-700/50">

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-green-300 font-medium">
          <Users className="w-3.5 h-3.5" />
          <span>חוכמת ההמונים</span>
        </div>
      </div>
      
      <div className="relative h-3 w-full rounded-full overflow-hidden bg-slate-800 flex">
        {stats.home > 0 &&
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.home}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-gradient-to-r from-green-600 to-green-400 h-full" />

        }
        {stats.draw > 0 &&
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.draw}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="bg-yellow-500 h-full" />

        }
        {stats.away > 0 &&
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${stats.away}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-full" />

        }
      </div>
      
      <div className="flex justify-between mt-2 text-[10px] font-medium">
        <div className="text-green-400 flex flex-col items-start">
            <span>{teamA}</span>
            <span className="text-base font-bold mt-0.5">{stats.home}%</span>
            <span className="text-slate-200 font-normal">({stats.homeCount})</span>
        </div>
        <div className="text-yellow-400 flex flex-col items-center">
            <span>תיקו</span>
            <span className="text-base font-bold mt-0.5">{stats.draw}%</span>
            <span className="text-slate-200 font-normal">({stats.drawCount})</span>
        </div>
        <div className="text-blue-400 flex flex-col items-end">
            <span>{teamB}</span>
            <span className="text-base font-bold mt-0.5">{stats.away}%</span>
            <span className="text-slate-200 font-normal">({stats.awayCount})</span>
        </div>
      </div>
    </motion.div>);

}