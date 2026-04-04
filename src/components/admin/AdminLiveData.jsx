
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Wifi, WifiOff, Clock, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoaderBar } from "../ui/LoaderBar";
import { fetchLiveMatchData } from "@/api/functions";

export default function AdminLiveData() {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    loadLiveData();
  }, []);

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadLiveData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadLiveData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchLiveMatchData({ league: 'champions-league' });
      setLiveData(response.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Error loading live data:", err);
      setError(err.message || 'שגיאה בטעינת הנתונים החיים');
    }
    
    setLoading(false);
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">Unknown</Badge>;
    
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('live') || statusLower.includes('in_play') || statusLower.includes('playing')) {
      return <Badge className="bg-green-600 text-white animate-pulse">🔴 LIVE</Badge>;
    }
    if (statusLower.includes('finished') || statusLower.includes('ft')) {
      return <Badge className="bg-gray-600 text-white">FT</Badge>;
    }
    if (statusLower.includes('half') || statusLower.includes('ht')) {
      return <Badge className="bg-orange-600 text-white">HT</Badge>;
    }
    if (statusLower.includes('paused')) {
      return <Badge className="bg-yellow-600 text-white">⏸️ PAUSED</Badge>;
    }
    
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Live Data Testing</h2>
          <p className="text-slate-400">Champions League</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant="outline"
            size="sm"
            className={`border-slate-600 ${autoRefresh ? 'bg-green-600/20 text-green-300' : 'text-slate-300'}`}
          >
            {autoRefresh ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            <span className="hidden sm:inline">{autoRefresh ? 'Stop Auto' : 'Auto Refresh'}</span>
            <span className="sm:hidden">{autoRefresh ? 'Stop' : 'Auto'}</span>
          </Button>
          <Button
            onClick={loadLiveData}
            disabled={loading}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            onClick={() => {
              // הפעלת פאנל תוצאות חיות - ידמה החלקה
              window.dispatchEvent(new CustomEvent('openLiveDataPanel'));
            }}
            variant="outline"
            size="sm"
            className="border-purple-600 text-purple-300 hover:bg-purple-600/20"
          >
            <span className="hidden sm:inline">פתח תוצאות חיות</span>
            <span className="sm:hidden">תוצאות</span>
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                {liveData?.success ? (
                  <Wifi className="w-4 h-4 text-green-400" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-400" />
                )}
                <span className="text-slate-300">
                  Status: {liveData?.success ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {liveData?.source && (
                <Badge variant="outline" className="border-blue-600 text-blue-300">
                  {liveData.source}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="text-xs sm:text-sm">
                {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-900/50 border-red-700">
          <CardContent className="p-4">
            <p className="text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoaderBar text="LOADING LIVE DATA" />
        </div>
      )}

      {/* Live Matches */}
      {liveData && !loading && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Live Matches ({liveData.matches?.length || 0})
          </h3>
          
          {liveData.matches?.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-8 text-center">
                <p className="text-slate-400">No live matches found for Champions League</p>
              </CardContent>
            </Card>
          ) : (
            liveData.matches?.map((match, index) => (
              <motion.div
                key={match.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4 sm:p-6">
                    {/* Mobile-first responsive layout */}
                    <div className="space-y-4">
                      {/* Teams and Score - Mobile Stack, Desktop Row */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        {/* Team Names */}
                        <div className="flex items-center justify-center sm:justify-start gap-3 text-center sm:text-left flex-1">
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {match.homeTeam || 'Home Team'}
                          </span>
                          <span className="text-slate-400 text-xs sm:text-sm">vs</span>
                          <span className="text-white font-semibold text-sm sm:text-base">
                            {match.awayTeam || 'Away Team'}
                          </span>
                        </div>

                        {/* Score */}
                        <div className="bg-slate-700 px-3 py-2 rounded-lg">
                          <span className="text-white font-bold text-lg sm:text-xl">
                            {match.homeScore || 0} - {match.awayScore || 0}
                          </span>
                        </div>
                      </div>

                      {/* Match Info Row */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <span className="text-slate-400">
                            {match.league || 'League'}
                          </span>
                          {match.competition && match.competition !== match.league && (
                            <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              {match.competition}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusBadge(match.status)}
                          {match.minute && (
                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                              {match.minute}'
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Start Time */}
                      {match.startTime && (
                        <div className="text-center sm:text-left">
                          <span className="text-slate-500 text-xs">
                            Started: {new Date(match.startTime).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Raw Data for Debugging */}
      {liveData?.raw_data && (
        <Card className="bg-slate-900 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Raw API Response (Debug)</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs text-slate-400 overflow-auto max-h-96">
              {JSON.stringify(liveData.raw_data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
