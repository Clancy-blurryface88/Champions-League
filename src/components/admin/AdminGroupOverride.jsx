import React, { useState, useEffect } from 'react';
import { Match } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import { ArrowUp, ArrowDown, RotateCcw, Save, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadGroupOverrides, saveGroupOverrides, applyOverride } from '@/utils/groupOverride';

const ALL_GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const toLetter = g => g?.replace?.('Group ', '').trim() || '';

function calcStandings(matches) {
  const teams = {};
  const ensure = (name, logo) => {
    if (!teams[name]) teams[name] = { name, logo, P:0,W:0,D:0,L:0,GF:0,GA:0,GD:0,Pts:0 };
    return teams[name];
  };
  matches.forEach(m => { ensure(m.team_a, m.team_a_logo); ensure(m.team_b, m.team_b_logo); });
  matches.forEach(m => {
    if (!m.is_finished || m.actual_score_a == null) return;
    const a = teams[m.team_a], b = teams[m.team_b];
    const sa = m.actual_score_a, sb = m.actual_score_b;
    a.P++; b.P++;
    a.GF += sa; a.GA += sb; b.GF += sb; b.GA += sa;
    if (sa > sb)      { a.W++; a.Pts += 3; b.L++; }
    else if (sa < sb) { b.W++; b.Pts += 3; a.L++; }
    else              { a.D++; a.Pts++; b.D++; b.Pts++; }
  });
  Object.values(teams).forEach(t => { t.GD = t.GF - t.GA; });
  const h2h = names => {
    const s = {}; names.forEach(n => { s[n] = { Pts:0, GD:0, GF:0 }; });
    const set = new Set(names);
    matches.forEach(m => {
      if (!m.is_finished || !set.has(m.team_a) || !set.has(m.team_b)) return;
      const sa = m.actual_score_a, sb = m.actual_score_b;
      s[m.team_a].GF += sa; s[m.team_a].GD += sa - sb;
      s[m.team_b].GF += sb; s[m.team_b].GD += sb - sa;
      if (sa > sb) s[m.team_a].Pts += 3;
      else if (sa < sb) s[m.team_b].Pts += 3;
      else { s[m.team_a].Pts++; s[m.team_b].Pts++; }
    });
    return s;
  };
  const list = Object.values(teams).sort((a, b) => b.Pts - a.Pts);
  const result = [];
  let i = 0;
  while (i < list.length) {
    let j = i + 1;
    while (j < list.length && list[j].Pts === list[i].Pts) j++;
    const grp = list.slice(i, j);
    if (grp.length > 1) {
      const h = h2h(grp.map(t => t.name));
      grp.sort((a, b) =>
        (h[b.name].Pts - h[a.name].Pts) || (h[b.name].GD - h[a.name].GD) ||
        (h[b.name].GF - h[a.name].GF) || (b.GD - a.GD) || (b.GF - a.GF) ||
        a.name.localeCompare(b.name));
    }
    result.push(...grp); i = j;
  }
  return result;
}

const positionColor = i =>
  i === 0 ? 'text-green-400' : i === 1 ? 'text-green-400' : i === 2 ? 'text-yellow-400' : 'text-red-400';

const positionBg = i =>
  i === 0 ? 'bg-green-500/8 border-green-500/20' :
  i === 1 ? 'bg-green-500/5 border-green-500/10' :
  i === 2 ? 'bg-yellow-500/5 border-yellow-500/10' :
             'bg-red-500/5 border-red-500/10';

export default function AdminGroupOverride() {
  const [allMatches, setAllMatches] = useState({});
  const [overrides, setOverrides] = useState({});
  const [settingId, setSettingId] = useState(null);
  const [activeGroup, setActiveGroup] = useState('A');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchData, { overrides: saved, settingId: sid }] = await Promise.all([
        Match.list('match_date'),
        loadGroupOverrides(),
      ]);
      const grouped = {};
      matchData.forEach(m => {
        if (!m.league) return;
        const letter = toLetter(m.league);
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(m);
      });
      setAllMatches(grouped);
      setOverrides(saved || {});
      setSettingId(sid);
    } catch (e) { console.error(e); }
    setLoading(false);
    setDirty(false);
  };

  const naturalOrder = g => calcStandings(allMatches[g] || []);
  const currentOrder = g => applyOverride(naturalOrder(g), overrides[g]);
  const hasOverride = g => !!overrides[g];
  const activeGroupsWithOverride = ALL_GROUPS.filter(hasOverride);

  const swap = (g, idx, dir) => {
    const order = currentOrder(g);
    if (idx + dir < 0 || idx + dir >= order.length) return;
    const next = [...order];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    setOverrides(prev => ({ ...prev, [g]: next.map(t => t.name) }));
    setDirty(true);
  };

  const resetGroup = g => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[g];
      return next;
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const newId = await saveGroupOverrides(overrides, settingId);
      setSettingId(newId);
      setDirty(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3500);
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 4000);
    }
    setSaving(false);
  };

  const teams = currentOrder(activeGroup);
  const natural = naturalOrder(activeGroup);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white mb-1">סידור מקומות ידני בבתים</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          שנה את סדר הנבחרות בתוך בית כאשר קיים שוויון מוחלט. השינוי ישתקף מיד בבראקט ובטבלת הטובות מקום 3.
          <br />
          <span className="text-slate-500 text-xs">הסדר הידני משנה מיקום בלבד — הסטטיסטיקות לא משתנות.</span>
        </p>
      </div>

      {/* Active overrides summary */}
      {activeGroupsWithOverride.length > 0 && (
        <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
          <span className="text-orange-300 text-sm">
            סידור ידני פעיל בבתים: <span className="font-bold">{activeGroupsWithOverride.join(', ')}</span>
          </span>
        </div>
      )}

      {/* Group selector */}
      <div>
        <p className="text-slate-500 text-xs mb-2 uppercase tracking-wider">בחר בית</p>
        <div className="flex flex-wrap gap-2">
          {ALL_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`relative px-3.5 py-1.5 rounded-lg text-sm font-bold border transition-all ${
                activeGroup === g
                  ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {g}
              {hasOverride(g) && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Group panel */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-bold text-base">בית {activeGroup}</h3>
            {hasOverride(activeGroup) && (
              <span className="text-[11px] bg-orange-400/15 text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded-full font-medium">
                סידור ידני פעיל
              </span>
            )}
          </div>
          {hasOverride(activeGroup) && (
            <button
              onClick={() => resetGroup(activeGroup)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg transition-all"
            >
              <RotateCcw className="w-3 h-3" />
              איפוס לסדר אוטומטי
            </button>
          )}
        </div>

        {/* Teams list */}
        <div className="p-4">
          {loading ? (
            <div className="py-10 text-center text-slate-500 text-sm">טוען נתונים...</div>
          ) : teams.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">אין נבחרות לבית זה</div>
          ) : (
            <div className="space-y-2">
              {teams.map((team, idx) => {
                const naturalIdx = natural.findIndex(t => t.name === team.name);
                const moved = naturalIdx !== -1 && naturalIdx !== idx;
                return (
                  <div
                    key={team.name}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${positionBg(idx)}`}
                  >
                    {/* Position */}
                    <span className={`text-sm font-black w-5 text-center flex-shrink-0 ${positionColor(idx)}`}>
                      {idx + 1}
                    </span>

                    {/* Flag + name */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <TeamFlag logo={team.logo} name={team.name} className="w-6 h-6 flex-shrink-0" />
                      <span className="text-sm font-medium text-white truncate">{team.name}</span>
                      {moved && (
                        <span className="text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded flex-shrink-0">
                          ↕ ממקום {naturalIdx + 1}
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500 flex-shrink-0">
                      <span className="font-bold text-slate-300">{team.Pts} נק'</span>
                      <span>{team.W}W {team.D}D {team.L}L</span>
                      <span className={team.GD > 0 ? 'text-green-500' : team.GD < 0 ? 'text-red-400' : ''}>
                        {team.GD > 0 ? '+' : ''}{team.GD} GD
                      </span>
                      <span>{team.GF} GF</span>
                    </div>

                    {/* Up / Down */}
                    <div className="flex flex-col gap-0.5 flex-shrink-0">
                      <button
                        onClick={() => swap(activeGroup, idx, -1)}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        title="הזז למעלה"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => swap(activeGroup, idx, 1)}
                        disabled={idx === teams.length - 1}
                        className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                        title="הזז למטה"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Position legend */}
          {teams.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-slate-700/50 text-[10px]">
              <span className="text-green-400">■ מקומות 1–2 עוברים ישירות לשמינית 32</span>
              <span className="text-yellow-400">■ מקום 3 מתחרה בטובות מקום 3</span>
              <span className="text-red-400">■ מקום 4 נפסל</span>
            </div>
          )}
        </div>
      </div>

      {/* Save row */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSave}
          disabled={saving || !dirty}
          className={`flex items-center gap-2 font-semibold transition-all ${
            dirty
              ? 'bg-yellow-500 hover:bg-yellow-400 text-black'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-60'
          }`}
        >
          {saving
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />}
          {saving ? 'שומר...' : 'שמור שינויים'}
        </Button>

        {!dirty && !saving && activeGroupsWithOverride.length > 0 && (
          <span className="text-slate-600 text-sm">כל השינויים שמורים</span>
        )}

        {saveStatus === 'success' && (
          <div className="flex items-center gap-1.5 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            נשמר! הבראקט וטבלת מקום 3 מתעדכנים.
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center gap-1.5 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4" />
            שגיאה בשמירה. נסה שוב.
          </div>
        )}
      </div>
    </div>
  );
}
