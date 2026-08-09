import React, { useState, useEffect } from "react";
import { Loader2, Trophy, Users, BarChart3, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { TOURNAMENT_CODE } from "@/config/tournament";

const TABS = [
  { key: 'standings', label: 'טבלת קבוצות', icon: BarChart3 },
  { key: 'scorers',   label: 'מלכי שערים',  icon: Trophy },
  { key: 'teams',     label: 'קבוצות',       icon: Users },
  { key: 'match',     label: 'משחק בודד',    icon: Zap },
];

function useFetch(url) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setData(null);
    setError(null);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// ── Standings ─────────────────────────────────────────────────────────────────
function StandingsView() {
  const { data, loading, error } = useFetch(`/api/football?type=standings&competition=${TOURNAMENT_CODE}`);
  const [openGroup, setOpenGroup] = useState(null);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} />;
  if (!data) return null;

  const groups = data.standings || [];

  return (
    <div className="space-y-3">
      <p className="text-slate-400 text-xs">
        {groups.length} קבוצות — לחץ כדי לפתוח
      </p>
      {groups.map((g, gi) => {
        const label = g.group || g.stage || `Group ${gi + 1}`;
        const isOpen = openGroup === gi;
        return (
          <div key={gi} className="rounded-xl border border-white/8 overflow-hidden">
            <button
              onClick={() => setOpenGroup(isOpen ? null : gi)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/4 hover:bg-white/8 transition-colors text-sm font-semibold text-white"
            >
              <span>{label}</span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {isOpen && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/6">
                      <th className="text-left px-3 py-2">#</th>
                      <th className="text-left px-3 py-2">קבוצה</th>
                      <th className="text-center px-2 py-2">מש'</th>
                      <th className="text-center px-2 py-2">נצ'</th>
                      <th className="text-center px-2 py-2">תי'</th>
                      <th className="text-center px-2 py-2">הפ'</th>
                      <th className="text-center px-2 py-2">שע'</th>
                      <th className="text-center px-2 py-2 text-sky-400">נק'</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(g.table || []).map(row => (
                      <tr key={row.position} className="border-b border-white/4 hover:bg-white/4 transition-colors">
                        <td className="px-3 py-2 text-slate-500">{row.position}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {row.team?.crest && (
                              <img src={row.team.crest} alt="" className="w-5 h-5 object-contain" />
                            )}
                            <span className="text-white font-medium">{row.team?.shortName || row.team?.name}</span>
                          </div>
                        </td>
                        <td className="text-center px-2 py-2 text-slate-400">{row.playedGames}</td>
                        <td className="text-center px-2 py-2 text-emerald-400">{row.won}</td>
                        <td className="text-center px-2 py-2 text-slate-400">{row.draw}</td>
                        <td className="text-center px-2 py-2 text-red-400">{row.lost}</td>
                        <td className="text-center px-2 py-2 text-slate-400">{row.goalsFor}:{row.goalsAgainst}</td>
                        <td className="text-center px-2 py-2 font-bold text-sky-400">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Scorers ───────────────────────────────────────────────────────────────────
function ScorersView() {
  const { data, loading, error } = useFetch(`/api/football?type=scorers&competition=${TOURNAMENT_CODE}&limit=20`);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} />;
  if (!data) return null;

  const scorers = data.scorers || [];

  return (
    <div className="space-y-2">
      <p className="text-slate-400 text-xs mb-3">{scorers.length} שחקנים</p>
      {scorers.map((s, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/4 border border-white/6 hover:bg-white/6 transition-colors">
          <span className="text-slate-500 text-sm w-5 text-right flex-shrink-0">{i + 1}</span>
          {s.team?.crest && (
            <img src={s.team.crest} alt="" className="w-6 h-6 object-contain flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{s.player?.name}</p>
            <p className="text-slate-500 text-xs truncate">{s.team?.shortName || s.team?.name}</p>
          </div>
          <div className="flex gap-4 text-xs flex-shrink-0">
            <div className="text-center">
              <p className="font-bold text-sky-400 text-base">{s.goals ?? '—'}</p>
              <p className="text-slate-600">שערים</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-blue-400 text-base">{s.assists ?? '—'}</p>
              <p className="text-slate-600">אסיסטים</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-300 text-base">{s.playedMatches ?? '—'}</p>
              <p className="text-slate-600">משחקים</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Teams ─────────────────────────────────────────────────────────────────────
function TeamsView() {
  const { data, loading, error } = useFetch(`/api/football?type=teams&competition=${TOURNAMENT_CODE}`);
  const [openTeam, setOpenTeam] = useState(null);

  if (loading) return <Spinner />;
  if (error) return <ErrorBox msg={error} />;
  if (!data) return null;

  const teams = data.teams || [];

  return (
    <div className="space-y-2">
      <p className="text-slate-400 text-xs mb-3">{teams.length} קבוצות בטורניר</p>
      {teams.map((t, i) => {
        const isOpen = openTeam === i;
        return (
          <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
            <button
              onClick={() => setOpenTeam(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/4 hover:bg-white/8 transition-colors text-left"
            >
              {t.crest && <img src={t.crest} alt="" className="w-7 h-7 object-contain flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{t.name}</p>
                <p className="text-slate-500 text-xs">{t.area?.name} · {t.venue}</p>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
            </button>
            {isOpen && (
              <div className="px-4 py-3 bg-white/2 border-t border-white/6 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <DataRow label="שם קצר" value={t.shortName} />
                  <DataRow label="קיצור" value={t.tla} />
                  <DataRow label="מדינה" value={t.area?.name} />
                  <DataRow label="אצטדיון" value={t.venue} />
                  <DataRow label="מייסד" value={t.founded} />
                  <DataRow label="צבעים" value={t.clubColors} />
                  <DataRow label="ID" value={t.id} />
                  <DataRow label="אתר" value={t.website ? <a href={t.website} target="_blank" rel="noreferrer" className="text-blue-400 underline">קישור</a> : '—'} />
                </div>
                {t.coach && (
                  <div className="pt-2 border-t border-white/6">
                    <p className="text-slate-500 mb-1">מאמן</p>
                    <p className="text-white font-medium">{t.coach.name}</p>
                    {t.coach.nationality && <p className="text-slate-500">{t.coach.nationality}</p>}
                  </div>
                )}
                {t.squad && t.squad.length > 0 && (
                  <div className="pt-2 border-t border-white/6">
                    <p className="text-slate-500 mb-2">הרכב ({t.squad.length} שחקנים)</p>
                    <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                      {t.squad.map((p, pi) => (
                        <div key={pi} className="text-slate-300 truncate">
                          <span className="text-slate-600 text-[10px] mr-1">{p.position?.slice(0,3)}</span>
                          {p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Single Match ──────────────────────────────────────────────────────────────
function MatchView() {
  const [matchId, setMatchId] = useState('');
  const [url, setUrl] = useState(null);
  const { data, loading, error } = useFetch(url);

  const fetch_ = () => {
    if (!matchId.trim()) return;
    setUrl(`/api/football?type=match&matchId=${matchId.trim()}`);
  };

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-xs">הכנס ID של משחק מ-football-data.org כדי לראות את כל הנתונים הזמינים</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={matchId}
          onChange={e => setMatchId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetch_()}
          placeholder="לדוגמה: 508966"
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-sky-400/50"
        />
        <button
          onClick={fetch_}
          className="px-4 py-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/30 text-sky-300 text-sm font-medium transition-colors"
        >
          טען
        </button>
      </div>
      {loading && <Spinner />}
      {error && <ErrorBox msg={error} />}
      {data?.match && (
        <div className="space-y-3">
          {/* Match header */}
          <div className="rounded-xl bg-white/4 border border-white/8 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">{new Date(data.match.utcDate).toLocaleString('he-IL')}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/8 text-slate-300">{data.match.status}</span>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="flex flex-col items-center gap-1">
                {data.match.homeTeam?.crest && <img src={data.match.homeTeam.crest} alt="" className="w-10 h-10 object-contain" />}
                <span className="text-white text-sm font-semibold">{data.match.homeTeam?.shortName}</span>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white">
                  {data.match.score?.fullTime?.home ?? '?'} – {data.match.score?.fullTime?.away ?? '?'}
                </p>
                <p className="text-slate-600 text-xs">סיום</p>
                {data.match.score?.halfTime && (
                  <p className="text-slate-500 text-xs mt-1">
                    ({data.match.score.halfTime.home}–{data.match.score.halfTime.away} הפסקה)
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center gap-1">
                {data.match.awayTeam?.crest && <img src={data.match.awayTeam.crest} alt="" className="w-10 h-10 object-contain" />}
                <span className="text-white text-sm font-semibold">{data.match.awayTeam?.shortName}</span>
              </div>
            </div>
          </div>
          {/* Raw fields */}
          <details className="rounded-xl bg-white/2 border border-white/6 overflow-hidden">
            <summary className="px-4 py-3 text-slate-400 text-xs cursor-pointer hover:text-white transition-colors">
              כל השדות הגולמיים מה-API
            </summary>
            <pre className="px-4 pb-4 text-[10px] text-slate-400 overflow-x-auto leading-relaxed">
              {JSON.stringify(data.match, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16 gap-3">
      <Loader2 className="w-6 h-6 text-sky-400 animate-spin" />
      <span className="text-slate-500 text-sm">טוען...</span>
    </div>
  );
}

function ErrorBox({ msg }) {
  return (
    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
      {msg}
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div>
      <p className="text-slate-600">{label}</p>
      <p className="text-slate-300 font-medium">{value ?? '—'}</p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminApiExplorer() {
  const [tab, setTab] = useState('standings');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">API Explorer</h2>
        <p className="text-slate-400 text-sm mt-1">נתונים זמינים מ-football-data.org (Free + Livescores)</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                tab === t.key
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-white/4 border-white/8 text-slate-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
        {tab === 'standings' && <StandingsView />}
        {tab === 'scorers'   && <ScorersView />}
        {tab === 'teams'     && <TeamsView />}
        {tab === 'match'     && <MatchView />}
      </div>
    </div>
  );
}
