import React, { useState } from "react";
import { Search, RefreshCw, Swords, Users, AlertCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function StatBar({ homeWins, awayWins, draws }) {
  const total = homeWins + awayWins + draws;
  if (total === 0) return null;
  const homePct = Math.round((homeWins / total) * 100);
  const drawPct = Math.round((draws / total) * 100);
  const awayPct = 100 - homePct - drawPct;
  return (
    <div className="space-y-2">
      <div className="flex rounded-full overflow-hidden h-3">
        <div className="bg-blue-500" style={{ width: `${homePct}%` }} />
        <div className="bg-slate-500" style={{ width: `${drawPct}%` }} />
        <div className="bg-orange-500" style={{ width: `${awayPct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-slate-400">
        <span className="text-blue-400">בית {homePct}%</span>
        <span className="text-slate-400">תיקו {drawPct}%</span>
        <span className="text-orange-400">חוץ {awayPct}%</span>
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

function MatchHistoryCard({ events }) {
  if (!events?.length) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp * 1000);
    return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getWinnerStyle = (score, opponentScore) => {
    if (score > opponentScore) return 'text-green-400 font-bold';
    if (score < opponentScore) return 'text-red-400';
    return 'text-slate-300';
  };

  return (
    <Card className="bg-slate-800/60 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white text-base">
          <Trophy className="w-5 h-5 text-yellow-400" />
          היסטוריית מפגשים
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {events.map((event, i) => {
          const homeScore = event.homeScore?.current ?? event.homeScore?.display ?? '?';
          const awayScore = event.awayScore?.current ?? event.awayScore?.display ?? '?';
          const homeName = event.homeTeam?.name || event.homeTeam?.shortName || 'בית';
          const awayName = event.awayTeam?.name || event.awayTeam?.shortName || 'חוץ';
          const tournament = event.tournament?.name || event.season?.name || '';
          const date = formatDate(event.startTimestamp);

          return (
            <div key={event.id || i} className="flex items-center justify-between bg-slate-700/40 rounded-lg px-4 py-3 text-sm">
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-slate-400 text-xs truncate">{tournament}</span>
                <span className="text-slate-500 text-xs">{date}</span>
              </div>
              <div className="flex items-center gap-3 mx-4">
                <span className={`text-right w-24 truncate ${getWinnerStyle(homeScore, awayScore)}`}>{homeName}</span>
                <div className="flex items-center gap-1 bg-slate-900 rounded px-2 py-1 font-mono">
                  <span className={getWinnerStyle(homeScore, awayScore)}>{homeScore}</span>
                  <span className="text-slate-500">-</span>
                  <span className={getWinnerStyle(awayScore, homeScore)}>{awayScore}</span>
                </div>
                <span className={`text-left w-24 truncate ${getWinnerStyle(awayScore, homeScore)}`}>{awayName}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function AdminH2H() {
  const [matchId, setMatchId] = useState("");
  const [loading, setLoading] = useState(false);
  const [h2hData, setH2hData] = useState(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);
  const [rawJson, setRawJson] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const fetchAll = async () => {
    if (!matchId.trim()) return;
    setLoading(true);
    setError(null);
    setH2hData(null);
    setEvents(null);
    setRawJson(null);

    try {
      const [h2hRes, eventsRes, head2headRes] = await Promise.all([
        fetch(`/api/sofascore?action=h2h&matchId=${matchId.trim()}`),
        fetch(`/api/sofascore?action=h2h_events&matchId=${matchId.trim()}`),
        fetch(`/api/sofascore?action=head2head&matchId=${matchId.trim()}`),
      ]);

      const [h2hJson, eventsJson, head2headJson] = await Promise.all([
        h2hRes.json(), eventsRes.json(), head2headRes.json(),
      ]);

      setRawJson({ h2h: h2hJson, h2h_events: eventsJson, head2head: head2headJson });

      if (h2hJson.success) setH2hData(h2hJson.data);
      else setError(`H2H: ${h2hJson.error?.message || h2hJson.error || 'שגיאה'}`);

      // נסה לחלץ events מכל endpoint שמחזיר נתונים
      const fromHead2head = head2headJson?.data;
      const fromEvents = eventsJson?.data;

      const list =
        fromHead2head?.events ||
        fromHead2head?.previousEvents ||
        fromHead2head?.teamDuel?.events ||
        fromEvents?.events ||
        fromEvents?.previousEvents ||
        [];

      setEvents(list);
    } catch (err) {
      setError(err.message || 'שגיאת רשת');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white">H2H Test — Sofascore API</h2>
        <p className="text-slate-400 text-sm mt-1">שלוף נתוני Head to Head + היסטוריית משחקים לפי Match ID</p>
      </div>

      <div className="flex gap-3">
        <Input
          value={matchId}
          onChange={(e) => setMatchId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchAll()}
          placeholder="לדוגמה: 15186526"
          className="bg-slate-800/60 border-slate-600 text-white placeholder:text-slate-500"
          dir="ltr"
        />
        <Button
          onClick={fetchAll}
          disabled={loading || !matchId.trim()}
          className="bg-blue-600 hover:bg-blue-700 gap-2 shrink-0"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? "טוען..." : "שלוף"}
        </Button>
      </div>

      {error && (
        <Card className="bg-red-900/20 border-red-700/50">
          <CardContent className="pt-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {h2hData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
              Match ID: {matchId}
            </Badge>
            <button
              onClick={() => setShowRaw(!showRaw)}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showRaw ? "הסתר JSON" : "הצג JSON גולמי"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DuelCard icon={Swords} title="Team Duel — עימות קבוצות" data={h2hData.teamDuel} color="text-blue-400" />
            <DuelCard icon={Users} title="Manager Duel — עימות מאמנים" data={h2hData.managerDuel} color="text-purple-400" />
          </div>

          {events && <MatchHistoryCard events={events} />}

          {events?.length === 0 && (
            <Card className="bg-slate-700/30 border-slate-600/50">
              <CardContent className="pt-4 space-y-1">
                <p className="text-slate-400 text-sm text-center">לא הוחזרו משחקים מה-events endpoint</p>
                <p className="text-slate-500 text-xs text-center">פתח JSON גולמי → events כדי לראות מה הAPI מחזיר</p>
              </CardContent>
            </Card>
          )}

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
