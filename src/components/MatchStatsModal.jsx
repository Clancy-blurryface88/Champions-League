
import React, { useState } from "react";
import { useModalBackButton } from "@/hooks/useModalBackButton";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderBar } from "./ui/LoaderBar";
import { getMatchStats } from "@/api/functions";

const FormIndicator = ({ result }) => {
  const colors = {
    'W': 'bg-green-500', // Win - Green
    'D': 'bg-yellow-500', // Draw - Yellow
    'L': 'bg-red-500' // Loss - Red
  };

  return (
    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-white font-bold text-xs sm:text-sm ${colors[result]}`}>
      {result}
    </div>);

};

const TeamForm = ({ form, isHome }) => {
  // Display form based on home/away status
  const displayForm = isHome ? form : [...form].reverse();

  return (
    <div className="flex gap-1 justify-center">
      {displayForm.map((result, index) =>
      <FormIndicator key={index} result={result} />
      )}
    </div>);

};

export default function MatchStatsModal({ isOpen, onClose, matchId }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (isOpen && matchId) {
      loadStats();
    }
  }, [isOpen, matchId]);

  useModalBackButton(isOpen, onClose);

  const loadStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMatchStats({ matchId });
      setStats(response.data);
    } catch (err) {
      console.error("Error loading match stats:", err);
      setError("שגיאה בטעינת הסטטיסטיקות");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}>

        <motion.div className="bg-slate-800 mt-16 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"

        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="mt-1 mr-1 mb-1 ml-1 pt-4 pr-4 pb-4 pl-4 p-4 sm:p-6 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h3 className="text-white text-justify px-6 text-lg font-bold sm:text-xl">Match Stats</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-white">

              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {loading &&
            <div className="flex items-center justify-center py-12">
                <LoaderBar text="טוען נתונים" />
              </div>
            }

            {error &&
            <div className="text-center py-12">
                <p className="text-red-400 text-lg">{error}</p>
                <Button onClick={loadStats} className="mt-4">
                  נסה שוב
                </Button>
              </div>
            }

            {stats && !loading &&
            <div className="space-y-6">
                {/* Teams Header - עם הפריסה החדשה */}
                <div className="bg-slate-700/30 rounded-lg p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    {/* Home Team - Left Side */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="h-12 sm:h-16 flex items-center justify-center mb-2">
                        <img
                        src={stats.teamA.logo}
                        alt={stats.teamA.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />

                      </div>
                      <div className="text-center min-h-[4rem] flex flex-col justify-between">
                        <h4 className="text-white font-bold text-base sm:text-lg leading-tight">
                          {stats.teamA.name.split(' ').map((word, i) =>
                        <div key={i}>{word}</div>
                        )}
                        </h4>
                        <p className="text-slate-400 text-xs sm:text-sm mt-auto">בית</p>
                      </div>
                    </div>
                    
                    {/* VS in center - Fixed positioning */}
                    <div className="flex-shrink-0 px-4 flex items-center h-12 sm:h-16">
                      <div className="text-slate-400 text-xl sm:text-2xl font-bold">VS</div>
                    </div>
                    
                    {/* Away Team - Right Side */}
                    <div className="flex flex-col items-center flex-1">
                      <div className="h-12 sm:h-16 flex items-center justify-center mb-2">
                        <img
                        src={stats.teamB.logo}
                        alt={stats.teamB.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />

                      </div>
                      <div className="text-center min-h-[4rem] flex flex-col justify-between">
                        <h4 className="text-white font-bold text-base sm:text-lg leading-tight">
                          {stats.teamB.name.split(' ').map((word, i) =>
                        <div key={i}>{word}</div>
                        )}
                        </h4>
                        <p className="text-slate-400 text-xs sm:text-sm mt-auto">חוץ</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Section - כושר הקבוצות */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-center flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-base sm:text-lg">כושר הקבוצות (5 משחקים אחרונים)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      {/* Home Team Form */}
                      <div className="text-center flex-1">
                        <p className="text-slate-300 text-sm sm:text-base mb-3 font-medium">{stats.teamA.name}</p>
                        <TeamForm form={stats.teamA.stats.form} isHome={true} />
                      </div>
                      
                      {/* Separator */}
                      <div className="w-px h-16 bg-slate-600 mx-6"></div>
                      
                      {/* Away Team Form */}
                      <div className="text-center flex-1">
                        <p className="text-slate-300 text-sm sm:text-base mb-3 font-medium">{stats.teamB.name}</p>
                        <TeamForm form={stats.teamB.stats.form} isHome={false} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Team Stats - אחד מול השני עם קו הפרדה - עיצוב מחודש */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white text-center text-base sm:text-lg">
                      נתוני הקבוצות
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      {/* Home Team Stats - Left Side */}
                      <div className="flex-1 space-y-4">
                        {/* Team Logo Only */}
                        <div className="flex justify-center mb-4">
                          <img
                          src={stats.teamA.logo}
                          alt={stats.teamA.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />

                        </div>
                        
                        {/* Stats with numbers below text */}
                        <div className="text-center space-y-3">
                          <div>
                            <div className="text-slate-400 text-xs sm:text-sm mb-1">ממוצע שערים כולל</div>
                            <div className="text-white font-bold text-lg sm:text-xl">{stats.teamA.stats.overallAverage}</div>
                          </div>
                          
                          <div>
                            <div className="text-slate-400 text-xs sm:text-sm mb-1">ממוצע שערים בבית</div>
                            <div className="text-white font-bold text-lg sm:text-xl">{stats.teamA.stats.homeAverage}</div>
                          </div>
                          
                          <div>
                            <div className="text-slate-400 text-xs sm:text-sm mb-1">ממוצע שערים בחוץ</div>
                            <div className="text-white font-bold text-lg sm:text-xl">{stats.teamA.stats.awayAverage}</div>
                          </div>
                        </div>
                        
                        {/* Match counts at bottom */}
                        <div className="text-xs text-slate-500 pt-3 border-t border-slate-600 text-center leading-relaxed">
                          <div>סה"כ משחקים: {stats.teamA.stats.totalMatches}</div>
                          <div>בית: {stats.teamA.stats.homeMatches} | חוץ: {stats.teamA.stats.awayMatches}</div>
                        </div>
                      </div>
                      
                      {/* Separator */}
                      <div className="w-px bg-slate-600 mx-4 sm:mx-6"></div>
                      
                      {/* Away Team Stats - Right Side */}
                      <div className="flex-1 space-y-4">
                        {/* Team Logo Only */}
                        <div className="flex justify-center mb-4">
                          <img
                          src={stats.teamB.logo}
                          alt={stats.teamB.name}
                          className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />

                        </div>
                        
                        {/* Stats with numbers below text */}
                        <div className="text-center space-y-3">
                          <div>
                            <div className="text-slate-400 text-xs sm:text-sm mb-1">ממוצע שערים כולל</div>
                            <div className="text-white font-bold text-lg sm:text-xl">{stats.teamB.stats.overallAverage}</div>
                          </div>
                          
                          <div>
                            <div className="text-slate-400 text-xs sm:text-sm mb-1">ממוצע שערים בבית</div>
                            <div className="text-white font-bold text-lg sm:text-xl">{stats.teamB.stats.homeAverage}</div>
                          </div>
                          
                          <div>
                            <div className="text-slate-400 text-xs sm:text-sm mb-1">ממוצע שערים בחוץ</div>
                            <div className="text-white font-bold text-lg sm:text-xl">{stats.teamB.stats.awayAverage}</div>
                          </div>
                        </div>
                        
                        {/* Match counts at bottom */}
                        <div className="text-xs text-slate-500 pt-3 border-t border-slate-600 text-center leading-relaxed">
                          <div>סה"כ משחקים: {stats.teamB.stats.totalMatches}</div>
                          <div>בית: {stats.teamB.stats.homeMatches} | חוץ: {stats.teamB.stats.awayMatches}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Combined Averages */}
                <Card className="bg-gradient-to-r from-green-600 to-blue-600 border-green-600/50">
                  <CardHeader className="p-6 flex flex-col space-y-1.5">
                    <CardTitle className="text-white text-center text-base sm:text-lg">
                      ממוצע שערים צפוי למשחק זה
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="bg-slate-800/50 rounded-lg p-4 mb-3">
                        <p className="text-slate-400 text-sm mb-2">לפי יתרון/חסרון ביתיות:</p>
                        <p className="text-blue-300 text-2xl sm:text-3xl font-bold">{stats.combined.homeAwayAverage}</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-4">
                        <p className="text-slate-200 mb-2 text-sm">ממוצע כללי</p>
                        <p className="text-emerald-400 font-bold sm:text-3xl">{stats.combined.overallAverage}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            }
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>);

}