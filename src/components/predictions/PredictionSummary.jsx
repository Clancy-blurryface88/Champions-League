
import TeamFlag from "@/components/TeamFlag";
import OrbitSpinner from "@/components/OrbitSpinner";
import React from "react";
import { motion } from "framer-motion";
// Check import removed as it's replaced with inline SVG
// Button component is no longer used for the specific buttons, but kept if used elsewhere. It's not in the current snippet.
import { CardContent, CardHeader } from "@/components/ui/card";

export default function PredictionSummary({ predictions, matches, onConfirm, onCancel, saving }) {
  console.log("🚨 PredictionSummary RENDER: Component rendered!");
  console.log("🚨 PredictionSummary RENDER: saving prop:", saving);
  console.log("🚨 PredictionSummary RENDER: predictions:", predictions);
  console.log("🚨 PredictionSummary RENDER: matches:", matches?.length);
  console.log("🚨 PredictionSummary RENDER: onConfirm:", typeof onConfirm);
  console.log("🚨 PredictionSummary RENDER: onCancel:", typeof onCancel);

  const predictionsList = Object.entries(predictions).map(([matchId, prediction]) => {
    const match = matches.find((m) => m.id === matchId);
    return { match, prediction };
  }).filter((item) => item.match);

  console.log("🚨 PredictionSummary: predictionsList length:", predictionsList.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        console.log("🚨 PredictionSummary: Background clicked");
        if (e.target === e.currentTarget) {
          console.log("🚨 PredictionSummary: Calling onCancel from background click");
          onCancel();
        }
      }}>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => {
          console.log("🚨 PredictionSummary: Modal content clicked - stopping propagation");
          e.stopPropagation();
        }}>

        <CardHeader className="border-b border-slate-700">
          <div className="flex items-center justify-center">
            <div className="text-white flex items-center gap-3">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/9d1e94ae1_ranking_4835928.png"
                alt="סיכום ניחושים"
                className="w-8 h-8"
              />
              <span className="text-xl font-semibold">סיכום הניחושים שלך</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto p-4 space-y-3">
            {predictionsList.map(({ match, prediction }, index) =>
            <motion.div
              key={match.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-700/50 rounded-lg p-3">

                {/* תצוגה נקייה - רק לוגואים ותוצאה */}
                <div className="flex items-center justify-between">
                  {/* לוגo קבוצה A */}
                  <div className="flex items-center justify-center w-12">
                    <TeamFlag logo={match.team_a_logo} name={match.team_a} className="w-10 h-10 " />

                  </div>

                  {/* תוצאה במרכז */}
                  <div className="bg-slate-600 px-4 py-2 rounded-md">
                    <span className="text-white font-bold text-lg">
                      {prediction.predicted_score_a} - {prediction.predicted_score_b}
                    </span>
                  </div>

                  {/* לוגו קבוצה B */}
                  <div className="flex items-center justify-center w-12">
                    <TeamFlag logo={match.team_b_logo} name={match.team_b} className="w-10 h-10 " />

                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="border-t border-slate-700 p-4">
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  console.log("🚨 PredictionSummary: Cancel button clicked!");
                  console.log("🚨 PredictionSummary: onCancel function:", onCancel);
                  console.log("🚨 PredictionSummary: Calling onCancel...");
                  onCancel();
                  console.log("🚨 PredictionSummary: onCancel called successfully");
                }}
                disabled={saving}
                className="relative font-heebo px-6 py-2 border-0 bg-red-600 text-white font-medium text-sm rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:text-shadow-[0px_5px_10px_rgba(0,0,0,0.562)] hover:scale-101 hover:shadow-[inset_0px_0px_10px_rgba(255,0,0,0.575)] disabled:opacity-50 disabled:cursor-not-allowed after:content-[''] after:absolute after:top-0 after:left-[-100px] after:w-1/2 after:h-full after:rotate-[80deg] after:bg-white/30 after:blur-[10px] after:transition-all after:duration-600 after:ease-in-out hover:after:left-full flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                ביטול
              </button>
              
              <button
                onClick={() => {
                  console.log("🚨 PredictionSummary: Confirm button clicked!");
                  console.log("🚨 PredictionSummary: saving state:", saving);
                  console.log("🚨 PredictionSummary: onConfirm function:", onConfirm);
                  console.log("🚨 PredictionSummary: Calling onConfirm...");
                  onConfirm();
                  console.log("🚨 PredictionSummary: onConfirm called successfully");
                }}
                disabled={saving}
                className="relative font-heebo px-6 py-2 border-0 bg-green-600 text-white font-medium text-sm rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out hover:text-shadow-[0px_5px_10px_rgba(0,0,0,0.562)] hover:scale-101 hover:shadow-[inset_0px_0px_10px_rgba(0,255,0,0.575)] disabled:opacity-50 disabled:cursor-not-allowed after:content-[''] after:absolute after:top-0 after:left-[-100px] after:w-1/2 after:h-full after:rotate-[80deg] after:bg-white/30 after:blur-[10px] after:transition-all after:duration-600 after:ease-in-out hover:after:left-full flex items-center"
              >
                {saving ?
                <>
                    <OrbitSpinner size={18} />
                    שומר...
                  </> :

                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2"><polyline points="20,6 9,17 4,12"/></svg>
                    אישור
                  </>
                }
              </button>
            </div>
          </div>
        </CardContent>
      </motion.div>
    </motion.div>
  );
}
