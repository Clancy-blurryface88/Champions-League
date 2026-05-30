import React, { useState, useEffect } from "react";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Prediction } from "@/api/entities";
import { Match } from "@/api/entities";
import { LoaderBar } from "../ui/LoaderBar";
import { FlexibleIcon } from "../ui/FlexibleIcon";
import SlidingMatchCards from "./SlidingMatchCards";

export default function UserExactHitsModal({ userId, userName, isOpen, onClose, exactHitsCount, totalPredictions }) {
  const [loading, setLoading] = useState(true);
  const [exactHitsList, setExactHitsList] = useState([]);

  const hitRate = totalPredictions > 0 ? (exactHitsCount / totalPredictions * 100).toFixed(1) : "0.0";

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchExactHits = async () => {
      setLoading(true);
      try {
        const [userPredictions, allMatches] = await Promise.all([
        Prediction.filter({ user_id: userId }),
        Match.list()]
        );

        // Deduplicate predictions
        const uniquePredictionsMap = {};
        userPredictions.forEach((prediction) => {
          const key = `${prediction.user_id}_${prediction.match_id}`;
          if (!uniquePredictionsMap[key] || new Date(prediction.created_date) > new Date(uniquePredictionsMap[key].created_date)) {
            uniquePredictionsMap[key] = prediction;
          }
        });
        const uniquePredictions = Object.values(uniquePredictionsMap);

        // Process exact hits list
        const exactHits = uniquePredictions.filter((p) => (p.exact_score_points_earned || 0) > 0);
        const exactHitsWithMatch = exactHits.map((p) => {
          const match = allMatches.find((m) => m.id === p.match_id);
          return { prediction: p, match };
        }).filter((item) => item.match && item.match.is_finished);

        // Sort by total points descending
        exactHitsWithMatch.sort((a, b) => (b.prediction.points_earned || 0) - (a.prediction.points_earned || 0));
        setExactHitsList(exactHitsWithMatch);
      } catch (error) {
        console.error("Error fetching exact hits:", error);
      }
      setLoading(false);
    };

    fetchExactHits();
  }, [userId, isOpen]);

  useModalBackButton(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          style={{ direction: 'rtl' }}>
          
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-slate-800 bg-slate-900/50">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <FlexibleIcon
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/7ec75a888_target_5987470.png"
                  alt="פגיעות מדויקות"
                  size="medium" />
                
                <h2 className="text-xl font-bold text-white">פגיעות מדויקות</h2>
              </div>
              <div className="mt-2">
                {loading && <p className="text-orange-400 text-lg font-medium">{userName}</p>}
                {!loading &&
                <div className="flex flex-col mt-1">
                    <div className="flex items-center gap-1 text-base">
                      <span className="text-orange-400 text-lg font-medium">{userName}</span>
                      <span className="text-slate-100 uppercase">פגעת ב</span>
                      <span className="text-orange-400 font-bold">{hitRate}%</span><span className="text-white font-normal">מהמשחקים</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm mt-0.5">
                      <span className="text-white font-bold">{exactHitsCount} פגיעות</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-slate-300">{totalPredictions} ניחושים</span>
                    </div>
                  </div>
                }
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-full">
              
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {loading ?
            <div className="py-12">
                <LoaderBar text="טוען נתונים..." />
              </div> :
            exactHitsList.length > 0 ?
            <SlidingMatchCards items={exactHitsList} /> :

            <div className="text-center py-16">
                <div className="text-5xl mb-4 opacity-50">🎯</div>
                <p className="text-slate-300 text-lg">אין פגיעות מדויקות עדיין</p>
              </div>
            }
          </div>
        </motion.div>
      </div>
    </AnimatePresence>);

}