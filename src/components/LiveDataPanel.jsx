
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Wifi, WifiOff, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchLiveMatchData } from "@/api/functions";
import { LoaderBar } from "./ui/LoaderBar";

export default function LiveDataPanel({ onClose, user }) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadLiveData();

    // Auto refresh every 30 seconds
    const interval = setInterval(() => {
      loadLiveData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);
const [league, setLeague] = useState("champions-league"); // ברירת מחדל

const loadLiveData = async () => {
    if (!loading) setLoading(true);
    setError(null);

    try {
      const response = await fetchLiveMatchData({ league }); // שולח את הסטייט
      setLiveData(response.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error loading live data:", err);
      setError("שגיאה בטעינת הנתונים החיים");
      setLiveData({ success: false, matches: [] });
    }

    setLoading(false);
};



  // פונקציה משופרת לתצוגת שמות קבוצות - מציגה שם מלא אבל מחלקת לשורות אם צריך
  const formatTeamName = (teamName) => {
    if (!teamName) return { firstLine: 'Team', secondLine: '', isMultiLine: false };

    // הסרת סיומות מיותרות בלבד (לא קיצור השם)
    let cleanName = teamName
      .replace(' FC', '')
      .replace(' Football Club', '')
      .trim();

    // אם השם ארוך מ-15 תווים, נחלק אותו לשורות בנקודות הגיוניות
    if (cleanName.length > 15) {
      const words = cleanName.split(' ');
      if (words.length >= 2) {
        // נחלק בערך באמצע
        const midPoint = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, midPoint).join(' ');
        const secondLine = words.slice(midPoint).join(' ');
        return { firstLine, secondLine, isMultiLine: true };
      }
    }

    return { firstLine: cleanName, secondLine: '', isMultiLine: false };
  };

  const getStatusBadge = (status, minute) => {
    if (!status) return <Badge variant="secondary" className="text-xs">Unknown</Badge>;

    const statusLower = status.toLowerCase();

    if (statusLower.includes('live') || statusLower.includes('in_play') || statusLower.includes('playing')) {
      return (
        <div className="flex items-center gap-1">
          <Badge className="bg-green-600 text-white animate-pulse text-xs">🔴 LIVE</Badge>
          {minute &&
          <Badge className="bg-blue-600 text-white text-xs font-bold">
              {minute}'
            </Badge>
          }
        </div>);

    }
    if (statusLower.includes('finished') || statusLower.includes('ft')) {
      return <Badge className="bg-gray-600 text-white text-xs">FT</Badge>;
    }
    if (statusLower.includes('half') || statusLower.includes('ht')) {
      return (
        <div className="flex items-center gap-1">
          <Badge className="bg-orange-600 text-white text-xs">HT</Badge>
          {minute &&
          <Badge className="bg-blue-600 text-white text-xs font-bold">
              {minute}'
            </Badge>
          }
        </div>);

    }
    if (statusLower.includes('paused')) {
      return (
        <div className="flex items-center gap-1">
          <Badge className="bg-yellow-600 text-white text-xs">⏸️ PAUSED</Badge>
          {minute &&
          <Badge className="bg-blue-600 text-white text-xs font-bold">
              {minute}'
            </Badge>
          }
        </div>);

    }

    return <Badge variant="secondary" className="text-xs">{status}</Badge>;
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} />


      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-lg border-l border-slate-700 z-50 overflow-hidden">

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Live תוצאות</h2>
                <Button
                  onClick={loadLiveData}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto text-slate-400 hover:text-white hover:bg-transparent focus:bg-transparent active:bg-transparent"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-white/10 bg-transparent transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {liveData?.success ? (
                  <Wifi className="w-3 h-3 text-green-400" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-400" />
                )}
                <span className="text-slate-300">
                  {liveData?.success ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                <p className="text-red-300 text-sm text-center">{error}</p>
              </div>
            )}

            {loading && !liveData ? (
              <div className="flex items-center justify-center py-8">
                <LoaderBar text="LOADING" />
              </div>
            ) : liveData?.matches?.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-slate-700 rounded-full flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-400 text-base mb-2">אין משחקים כרגע</p>
                <p className="text-slate-500 text-sm">
                  Champions League
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-slate-400 text-sm mb-4">
              Champions League ({liveData?.matches?.length || 0})
              </p>


                <div className="relative">
                  {liveData?.matches?.map((match, index) => {
                    const homeTeamFormatted = formatTeamName(match.homeTeam);
                    const awayTeamFormatted = formatTeamName(match.awayTeam);

                    return (
                      <motion.div
                        key={match.id || index}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                        whileHover={{ scale: 1.02 }}
                        className="mb-3"
                      >
                        <Card className="bg-slate-800/60 border-slate-600 hover:bg-slate-700/60 transition-all duration-200 hover:shadow-lg">
                          <CardContent className="p-4">
                            {/* עיצוב חדש עם שמות מלאים */}
                            <div className="space-y-3">
                              {/* שורה עליונה - שמות קבוצות ותוצאה */}
                              <div className="flex items-center justify-between gap-3">
                                {/* קבוצת בית */}
                                <div className="flex-1 text-center">
                                  <div className="text-white font-medium text-sm leading-tight">
                                    <div>{homeTeamFormatted.firstLine}</div>
                                    {homeTeamFormatted.isMultiLine && (
                                      <div>{homeTeamFormatted.secondLine}</div>
                                    )}
                                  </div>
                                </div>

                                {/* תוצאה */}
                                <motion.div
                                  className="bg-slate-700 px-3 py-2 rounded-lg flex-shrink-0"
                                  animate={{
                                    boxShadow: match.status?.toLowerCase().includes('live')
                                      ? ['0 0 0 rgba(34, 197, 94, 0)', '0 0 10px rgba(34, 197, 94, 0.3)', '0 0 0 rgba(34, 197, 94, 0)']
                                      : '0 0 0 rgba(34, 197, 94, 0)'
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: match.status?.toLowerCase().includes('live') ? Infinity : 0,
                                    ease: "easeInOut"
                                  }}
                                >
                                  <span className="text-white font-bold text-xl">
                                    {match.homeScore || 0} - {match.awayScore || 0}
                                  </span>
                                </motion.div>

                                {/* קבוצת חוץ */}
                                <div className="flex-1 text-center">
                                  <div className="text-white font-medium text-sm leading-tight">
                                    <div>{awayTeamFormatted.firstLine}</div>
                                    {awayTeamFormatted.isMultiLine && (
                                      <div>{awayTeamFormatted.secondLine}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* שורה תחתונה - סטטוס ודקה */}
                              <div className="flex items-center justify-center">
                                {getStatusBadge(match.status, match.minute)}
                              </div>

                              {/* שעת התחלה - קטנה יותר */}
                              {match.startTime && (
                                <div className="text-center">
                                  <span className="text-slate-500 text-xs">
                                    {new Date(match.startTime).toLocaleString('he-IL', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}

                  {/* Gradient fade effect at bottom */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/95 to-transparent"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
