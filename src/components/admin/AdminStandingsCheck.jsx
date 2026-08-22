import React, { useState, useEffect } from 'react';
import { Match } from '@/api/entities';
import { RefreshCw, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadLeagueTableOverride, applyOverride } from '@/utils/standingsOverride';
import { calcStandings } from '@/utils/standings';
import { STAGES } from '@/config/tournament';

function normalize(name) {
  return (name || '').trim().toLowerCase();
}

// Same tolerant matching approach as api/_uefaContext.js's team resolver:
// exact -> one name starts with the other -> substring — since "yours" and
// UEFA's own naming don't always agree exactly (e.g. "PSG" vs "Paris").
function findOfficial(yourName, officialList) {
  const n = normalize(yourName);
  const names = (row) => [row.name, row.officialName].filter(Boolean).map(normalize);
  return (
    officialList.find((row) => names(row).includes(n)) ||
    officialList.find((row) => names(row).some((x) => x.startsWith(n) || n.startsWith(x))) ||
    officialList.find((row) => names(row).some((x) => x.includes(n))) ||
    null
  );
}

export default function AdminStandingsCheck() {
  const [yours, setYours] = useState([]);
  const [official, setOfficial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [matches, { override }, res] = await Promise.all([
        Match.list('match_date'),
        loadLeagueTableOverride(),
        fetch('/api/uefa-standings').then((r) => r.json()),
      ]);

      const leaguePhaseMatches = matches.filter((m) => m.stage === STAGES.LEAGUE_PHASE);
      setYours(applyOverride(calcStandings(leaguePhaseMatches), override));

      if (!res.success) throw new Error(res.error || 'שגיאה בשליפת הטבלה הרשמית');
      setOfficial(res.standings || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-lg font-bold">אימות טבלה מול UEFA</h2>
          <p className="text-slate-400 text-sm">
            השוואת הטבלה שהמערכת מחשבת (מהתוצאות שהוזנו) מול הטבלה הרשמית של UEFA — כלי בדיקת שפיות בלבד, לא משנה כלום.
          </p>
        </div>
        <Button onClick={loadData} disabled={loading} variant="outline" className="border-slate-600">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          רענן
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {!loading && !error && official.length === 0 && (
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-300 text-sm">
          <HelpCircle className="w-4 h-4 shrink-0" />
          UEFA עדיין לא פרסמו נתוני טבלה לעונה הנוכחית — אין מול מה להשוות כרגע.
        </div>
      )}

      {!loading && yours.length > 0 && official.length > 0 && (
        <div className="rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/80 text-slate-400">
              <tr>
                <th className="text-right px-3 py-2 font-medium">קבוצה</th>
                <th className="text-center px-3 py-2 font-medium">מקום אצלכם</th>
                <th className="text-center px-3 py-2 font-medium">מקום ב-UEFA</th>
                <th className="text-center px-3 py-2 font-medium">נק' אצלכם</th>
                <th className="text-center px-3 py-2 font-medium">נק' ב-UEFA</th>
                <th className="text-center px-3 py-2 font-medium">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {yours.map((team, i) => {
                const yourRank = i + 1;
                const match = findOfficial(team.name, official);
                const rankMismatch = match && match.rank !== yourRank;
                const ptsMismatch = match && match.points !== team.Pts;
                return (
                  <tr key={team.name} className="border-t border-slate-800">
                    <td className="px-3 py-2 text-white font-medium">{team.name}</td>
                    <td className="px-3 py-2 text-center text-slate-300">{yourRank}</td>
                    <td className="px-3 py-2 text-center text-slate-300">{match ? match.rank : '—'}</td>
                    <td className="px-3 py-2 text-center text-slate-300">{team.Pts}</td>
                    <td className="px-3 py-2 text-center text-slate-300">{match ? match.points : '—'}</td>
                    <td className="px-3 py-2 text-center">
                      {!match ? (
                        <span className="text-slate-500 text-xs">לא זוהתה</span>
                      ) : rankMismatch || ptsMismatch ? (
                        <span className="inline-flex items-center gap-1 text-red-400 text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5" /> פער
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-green-400 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> תואם
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
