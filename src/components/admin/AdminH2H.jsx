import React, { useState } from "react";
import { Search, RefreshCw, Swords, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const H2H_URL = "https://sofascore.p.rapidapi.com/matches/get-h2h";

function StatBar({ homeWins, awayWins, draws }) {
  const total = homeWins + awayWins + draws;
  if (total === 0) return null;

  const homePct = Math.round((homeWins / total) * 100);
  const drawPct = Math.round((draws / total) * 100);
  const awayPct = 100 - homePct - drawPct;

  return (
    <div className="space-y-2">
      <div className="flex rounded-full overflow-hidden h-3">
        <div className="bg-blue-500 transition-all" style={{ width: `${homePct}%` }} />
        <div className="bg-slate-500 transition-all" style={{ width: `${drawPct}%` }} />
        <div className="bg-orange-500 transition-all" style={{ width: `${awayPct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span className="text-blue-400">ניצחון בית {homePct}%</span>
        <span className="text-slate-400">תיקו {drawPct}%</span>
        <span className="text-orange-400">ניצחון חוץ {awayPct}%</span>
      </div>
    </div>
  );
}

function DuelCard({ icon: Icon, title, data, color }) {
  if (!data) return null;
  const { homeWins, awayWins, draws } = data;
  const total = homeWins + awayWins + draws;

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <Icon className={`w-5 h-5 ${color}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-400">{homeWins}</div>
            <div className="text-xs text-slate-400 mt-1">ניצחונות בית</div>
          </div>
          <div className="bg-slate-600/30 rounded-xl p-3 border border-slate-600/30">
            <div className="text-2xl font-bold text-slate-300">{draws}</div>
            <div className="text-xs text-slate-400 mt-1">תיקו</div>
          </div>
          <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-400">{awayWins}</div>
            <div className="text-xs text-slate-400 mt-1">ניצחונות חוץ</div>
          </div>
        </div>
        <StatBar homeWins={homeWins} awayWins={awayWins} draws={draws} />
        <div className="text-center text-xs text-slate-500">סה"כ {total} מפגשים</div>
      </CardContent>
    </Card>
  );
}

export default function AdminH2H() {
  const [matchId, setMatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [rawJson, setRawJson] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const fetchH2H = async () => {
    if (!matchId.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRawJson(null);

    try {
      const res = await fetch(`${H2H_URL}?matchId=${matchId.trim()}`, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "sofascore.p.rapidapi.com",
        },
      });

      const json = await res.json();
      setRawJson(json);

      if (!res.ok) {
        setError(`שגיאה ${res.status}: ${json?.message || res.statusText}`);
      } else {
        setResult(json);
      }
    } catch (err) {
      setError(err.message || "שגיאת רשת");
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchH2H();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">H2H Test — Sofascore API</h2>
        <p className="text-slate-400 text-sm mt-1">הזן Match ID מ-Sofascore כדי לקבל נתוני Head to Head</p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <Input
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="הזן Match ID (לדוגמה: 12345678)"
          className="bg-slate-800/60 border-slate-600 text-white placeholder:text-slate-500 text-right"
          dir="ltr"
        />
        <Button
          onClick={fetchH2H}
          disabled={loading || !matchId.trim()}
          className="bg-blue-600 hover:bg-blue-700 gap-2 shrink-0"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "טוען..." : "שלוף"}
        </Button>
      </div>

      {/* Helper */}
      <Card className="bg-slate-700/30 border-slate-600/50">
        <CardContent className="pt-4 pb-3">
          <p className="text-slate-400 text-sm">
            <span className="text-slate-300 font-medium">איך מוצאים Match ID?</span>{" "}
            נכנס ל-Sofascore, פותחים משחק, ה-ID נמצא ב-URL:{" "}
            <code className="text-blue-300 text-xs bg-slate-800 px-1 py-0.5 rounded">
              sofascore.com/event/<strong>12345678</strong>
            </code>
          </p>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="bg-red-900/20 border-red-700/50">
          <CardContent className="pt-4">
            <p className="text-red-400 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
              Match ID: {matchId}
            </Badge>
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showRaw ? "הסתר JSON גולמי" : "הצג JSON גולמי"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DuelCard
              icon={Swords}
              title="Team Duel — עימות קבוצות"
              data={result.teamDuel}
              color="text-blue-400"
            />
            <DuelCard
              icon={Users}
              title="Manager Duel — עימות מאמנים"
              data={result.managerDuel}
              color="text-purple-400"
            />
          </div>

          {showRaw && (
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">JSON Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-green-300 overflow-auto max-h-64 whitespace-pre-wrap">
                  {JSON.stringify(rawJson, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
