import React, { useState, useEffect } from 'react';
import { Match } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import { ArrowUp, ArrowDown, RotateCcw, Save, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadLeagueTableOverride, saveLeagueTableOverride, applyOverride } from '@/utils/standingsOverride';
import { calcStandings } from '@/utils/standings';
import { STAGES, DIRECT_R16_CUTOFF, PLAYOFF_CUTOFF } from '@/config/tournament';

const posColor = i => i < DIRECT_R16_CUTOFF ? 'text-green-400' : i < PLAYOFF_CUTOFF ? 'text-yellow-400' : 'text-red-400';
const posBg    = i => i < DIRECT_R16_CUTOFF ? 'bg-green-500/8 border-green-500/20'
                    : i < PLAYOFF_CUTOFF ? 'bg-yellow-500/5 border-yellow-500/10'
                    :                       'bg-red-500/5 border-red-500/10';

function SaveRow({ dirty, saving, status, onSave }) {
  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onSave}
        disabled={saving || !dirty}
        className={`flex items-center gap-2 font-semibold transition-all ${
          dirty ? 'bg-yellow-500 hover:bg-yellow-400 text-black' : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
        }`}
      >
        {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? 'שומר...' : 'שמור שינויים'}
      </Button>
      {status === 'success' && (
        <div className="flex items-center gap-1.5 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" /> נשמר! הטבלה והבראקט מתעדכנים.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-1.5 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4" /> שגיאה בשמירה. נסה שוב.
        </div>
      )}
    </div>
  );
}

export default function AdminLeagueOverride() {
  const [leaguePhaseMatches, setLeaguePhaseMatches] = useState([]);
  const [override, setOverride] = useState([]);
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchData, { override: ovr, settingId: sid }] = await Promise.all([
        Match.list('match_date'),
        loadLeagueTableOverride(),
      ]);
      setLeaguePhaseMatches(matchData.filter(m => m.stage === STAGES.LEAGUE_PHASE));
      setOverride(ovr || []);
      setSettingId(sid);
      setDirty(false);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const naturalOrder = calcStandings(leaguePhaseMatches);
  const currentOrder = applyOverride(naturalOrder, override);
  const hasOverride = override.length > 0;

  const swap = (idx, dir) => {
    if (idx + dir < 0 || idx + dir >= currentOrder.length) return;
    const next = [...currentOrder];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    setOverride(next.map(t => t.name));
    setDirty(true);
  };

  const resetOrder = () => {
    setOverride([]);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true); setStatus(null);
    try {
      const newId = await saveLeagueTableOverride(override, settingId);
      setSettingId(newId);
      setDirty(false);
      setStatus('success');
      setTimeout(() => setStatus(null), 3500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="py-16 text-center text-slate-500">טוען נתונים...</div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">סידור ידני — טבלת הליגה</h2>
        <p className="text-slate-500 text-sm">שינויים נשמרים ב-DB ומשתקפים לכל המשתמשים בזמן אמת.</p>
      </div>

      {hasOverride && (
        <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
          <span className="text-orange-300 text-sm">סידור ידני פעיל בטבלת הליגה</span>
        </div>
      )}

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-bold">טבלת הליגה (36 קבוצות)</h3>
            {hasOverride && (
              <span className="text-[11px] bg-orange-400/15 text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded-full">סידור ידני</span>
            )}
          </div>
          {hasOverride && (
            <button onClick={resetOrder}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg transition-all">
              <RotateCcw className="w-3 h-3" /> איפוס
            </button>
          )}
        </div>
        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {currentOrder.map((team, idx) => {
            const naturalIdx = naturalOrder.findIndex(t => t.name === team.name);
            const moved = naturalIdx !== -1 && naturalIdx !== idx;
            return (
              <div key={team.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${posBg(idx)}`}>
                <span className={`text-sm font-black w-6 text-center flex-shrink-0 ${posColor(idx)}`}>{idx + 1}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TeamFlag logo={team.logo} name={team.name} className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm font-medium text-white truncate">{team.name}</span>
                  {moved && <span className="text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded flex-shrink-0">↕ ממקום {naturalIdx + 1}</span>}
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-300">{team.Pts} נק'</span>
                  <span>{team.W}W {team.D}D {team.L}L</span>
                  <span className={team.GD > 0 ? 'text-green-500' : team.GD < 0 ? 'text-red-400' : ''}>{team.GD > 0 ? '+' : ''}{team.GD} GD</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => swap(idx, -1)} disabled={idx === 0}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => swap(idx, 1)} disabled={idx === currentOrder.length - 1}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-700/50 text-[10px]">
            <span className="text-green-400">■ 1–{DIRECT_R16_CUTOFF} עולות ישירות ל-16 הגמר</span>
            <span className="text-yellow-400">■ {DIRECT_R16_CUTOFF + 1}–{PLAYOFF_CUTOFF} פלייאוף</span>
            <span className="text-red-400">■ {PLAYOFF_CUTOFF + 1}+ מודחות</span>
          </div>
        </div>
      </div>

      <SaveRow dirty={dirty} saving={saving} status={status} onSave={handleSave} />
    </div>
  );
}
