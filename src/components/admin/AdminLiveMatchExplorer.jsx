import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, AlertTriangle, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EVENT_ICON = {
  GOAL: '⚽',
  YELLOW_CARD: '🟨',
  RED_CARD: '🟥',
  SUBSTITUTION: '🔄',
  PENALTY: '🎯',
};

function TeamLineupCard({ label, teamLineup }) {
  if (!teamLineup) return null;
  return (
    <Card className="bg-slate-800/60 border-slate-700 flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-sm">{label}: {teamLineup.team?.internationalName}</CardTitle>
        <p className="text-slate-500 text-xs">מאמן: {teamLineup.coaches?.[0]?.person?.internationalName || '—'}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-slate-400 text-xs font-semibold mb-1">הרכב פותח</p>
          <div className="space-y-0.5">
            {teamLineup.field?.map((p) => (
              <div key={p.player.id} className="flex items-center gap-2 text-sm text-slate-200">
                <span className="text-slate-500 w-5 text-center">{p.jerseyNumber}</span>
                <span>{p.player.internationalName}</span>
                <span className="text-slate-500 text-xs">({p.player.fieldPosition})</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-slate-400 text-xs font-semibold mb-1">ספסל</p>
          <div className="space-y-0.5">
            {teamLineup.bench?.map((p) => (
              <div key={p.player.id} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-5 text-center">{p.jerseyNumber}</span>
                <span>{p.player.internationalName}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminLiveMatchExplorer() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [loadingLive, setLoadingLive] = useState(true);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [matchId, setMatchId] = useState('');
  const [lineups, setLineups] = useState(null);
  const [events, setEvents] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadLiveMatches(); loadRecentMatches(); }, []);

  const loadLiveMatches = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch('/api/uefa-live-matches');
      const data = await res.json();
      setLiveMatches(data.success ? data.matches : []);
    } catch {
      setLiveMatches([]);
    }
    setLoadingLive(false);
  };

  const loadRecentMatches = async () => {
    setLoadingRecent(true);
    try {
      const res = await fetch('/api/uefa-recent-matches');
      const data = await res.json();
      setRecentMatches(data.success ? data.matches : []);
    } catch {
      setRecentMatches([]);
    }
    setLoadingRecent(false);
  };

  const loadDetail = async (id) => {
    if (!id) return;
    setMatchId(id);
    setLoading(true);
    setError(null);
    setLineups(null);
    setEvents(null);
    try {
      const [lRes, eRes] = await Promise.all([
        fetch(`/api/uefa-match-detail?matchId=${id}&type=lineups`).then((r) => r.json()),
        fetch(`/api/uefa-match-detail?matchId=${id}&type=events`).then((r) => r.json()),
      ]);
      if (!lRes.success) throw new Error(lRes.error);
      if (!eRes.success) throw new Error(eRes.error);
      setLineups(lRes.lineups);
      setEvents(eRes.events || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const sortedEvents = [...(events || [])].sort((a, b) => (a.time?.minute || 0) - (b.time?.minute || 0));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-white text-lg font-bold">חקירת הרכבים + אירועי משחק — UEFA</h2>
        <p className="text-slate-400 text-sm">
          כלי בדיקה בלבד (לא מוצג למשתמשים) — בודקים כאן איך זה נראה לפני שמחליטים איך לשלב את זה בפועל בממשק.
        </p>
      </div>

      {/* Quick-pick: currently live CL matches */}
      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-white text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-400" /> משחקים חיים כרגע
          </CardTitle>
          <Button onClick={loadLiveMatches} disabled={loadingLive} variant="ghost" size="icon" className="text-slate-400">
            <RefreshCw className={`w-4 h-4 ${loadingLive ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {liveMatches.length === 0 ? (
            <p className="text-slate-500 text-sm">אין כרגע משחק ליגת אלופות חי — אפשר לבחור משחק מהרשימה "משחקים אחרונים" למטה כדי לבדוק את הכלי בכל זאת.</p>
          ) : (
            <div className="space-y-2">
              {liveMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => loadDetail(m.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm text-white text-right"
                >
                  <span>{m.homeTeam.name} {m.score.fullTime.home}-{m.score.fullTime.away} {m.awayTeam.name}</span>
                  <span className="text-red-400 text-xs">{m.status === 'IN_PLAY' ? `${m.minute}'` : m.status}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick-pick: recently finished matches — real ids to test with when nothing's live */}
      <Card className="bg-slate-800/60 border-slate-700">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-white text-sm">משחקים אחרונים (לבדיקה)</CardTitle>
          <Button onClick={loadRecentMatches} disabled={loadingRecent} variant="ghost" size="icon" className="text-slate-400">
            <RefreshCw className={`w-4 h-4 ${loadingRecent ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          {recentMatches.length === 0 ? (
            <p className="text-slate-500 text-sm">{loadingRecent ? 'טוען...' : 'לא נמצאו משחקים שהסתיימו עדיין העונה.'}</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {recentMatches.map((m) => (
                <button
                  key={m.id}
                  onClick={() => loadDetail(m.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-sm text-white text-right"
                >
                  <span>{m.homeTeam} {m.score.home}-{m.score.away} {m.awayTeam}</span>
                  <span className="text-slate-500 text-xs">{new Date(m.utcDate).toLocaleDateString('he-IL')}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual match id — fallback if you already have one */}
      <Card className="bg-slate-800/60 border-slate-700">
        <CardContent className="pt-4 flex gap-2">
          <Input
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            placeholder="או הזינו UEFA Match ID ידנית"
            className="bg-slate-900 border-slate-700 text-white"
          />
          <Button onClick={() => loadDetail(matchId)} disabled={loading || !matchId.trim()}>
            <Search className="w-4 h-4 mr-2" /> טען
          </Button>
        </CardContent>
      </Card>

      {loading && <p className="text-slate-400 text-sm">טוען...</p>}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {lineups && (
        <div className="flex gap-3">
          <TeamLineupCard label="בית" teamLineup={lineups.homeTeam} />
          <TeamLineupCard label="חוץ" teamLineup={lineups.awayTeam} />
        </div>
      )}

      {events && (
        <Card className="bg-slate-800/60 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm">ציר אירועים ({sortedEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedEvents.length === 0 ? (
              <p className="text-slate-500 text-sm">אין עדיין אירועים.</p>
            ) : (
              <div className="space-y-1.5">
                {sortedEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-2 text-sm text-slate-200">
                    <span className="w-8 text-slate-500 text-xs">{e.time?.minute}{e.time?.injuryMinute ? `+${e.time.injuryMinute}` : ''}'</span>
                    <span>{EVENT_ICON[e.type] || '•'}</span>
                    <span>{e.primaryActor?.person?.internationalName || '—'}</span>
                    <span className="text-slate-500 text-xs">({e.primaryActor?.team?.internationalName})</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
