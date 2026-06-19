import React, { useState, useEffect, useMemo } from 'react';
import { Match } from '@/api/entities';
import TeamFlag from '@/components/TeamFlag';
import { ArrowUp, ArrowDown, RotateCcw, Save, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  loadAllOverrides,
  saveGroupOverrides,
  saveBestThirdOrder,
  saveBracketSlotOverride,
  applyOverride,
  applyBestThirdOrder,
} from '@/utils/groupOverride';

// ─── Constants ────────────────────────────────────────────────────────────────
const ALL_GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];
const toLetter = g => g?.replace?.('Group ', '').trim() || '';

const THIRD_SLOTS = {
  74: ['A','B','C','D','F'],
  77: ['C','D','F','G','H'],
  79: ['C','E','F','H','I'],
  80: ['E','H','I','J','K'],
  81: ['B','E','F','I','J'],
  82: ['A','E','H','I','J'],
  85: ['E','F','G','I','J'],
  87: ['D','E','I','J','L'],
};
const SLOT_HOME = { 74:'1E', 77:'1I', 79:'1A', 80:'1L', 81:'1D', 82:'1G', 85:'1B', 87:'1K' };
const BRACKET_SLOTS = [74,77,79,80,81,82,85,87];

// ─── Pure standings calc (shared) ─────────────────────────────────────────────
function calcStandings(matches) {
  const teams = {};
  const ensure = (name, logo) => { if (!teams[name]) teams[name] = { name, logo, P:0,W:0,D:0,L:0,GF:0,GA:0,GD:0,Pts:0 }; };
  matches.forEach(m => { ensure(m.team_a, m.team_a_logo); ensure(m.team_b, m.team_b_logo); });
  matches.forEach(m => {
    if (!m.is_finished || m.actual_score_a == null) return;
    const a = teams[m.team_a], b = teams[m.team_b];
    const sa = m.actual_score_a, sb = m.actual_score_b;
    a.P++; b.P++; a.GF += sa; a.GA += sb; b.GF += sb; b.GA += sa;
    if (sa > sb) { a.W++; a.Pts += 3; b.L++; }
    else if (sa < sb) { b.W++; b.Pts += 3; a.L++; }
    else { a.D++; a.Pts++; b.D++; b.Pts++; }
  });
  Object.values(teams).forEach(t => { t.GD = t.GF - t.GA; });
  const h2h = names => {
    const s = {}; names.forEach(n => { s[n] = { Pts:0,GD:0,GF:0 }; });
    const set = new Set(names);
    matches.forEach(m => {
      if (!m.is_finished || !set.has(m.team_a) || !set.has(m.team_b)) return;
      const sa = m.actual_score_a, sb = m.actual_score_b;
      s[m.team_a].GF += sa; s[m.team_a].GD += sa-sb;
      s[m.team_b].GF += sb; s[m.team_b].GD += sb-sa;
      if (sa > sb) s[m.team_a].Pts += 3;
      else if (sa < sb) s[m.team_b].Pts += 3;
      else { s[m.team_a].Pts++; s[m.team_b].Pts++; }
    });
    return s;
  };
  const list = Object.values(teams).sort((a,b) => b.Pts - a.Pts);
  const result = []; let i = 0;
  while (i < list.length) {
    let j = i+1; while (j < list.length && list[j].Pts === list[i].Pts) j++;
    const grp = list.slice(i,j);
    if (grp.length > 1) {
      const h = h2h(grp.map(t => t.name));
      grp.sort((a,b) => (h[b.name].Pts-h[a.name].Pts)||(h[b.name].GD-h[a.name].GD)||
        (h[b.name].GF-h[a.name].GF)||(b.GD-a.GD)||(b.GF-a.GF)||a.name.localeCompare(b.name));
    }
    result.push(...grp); i = j;
  }
  return result;
}

function autoBacktrack(qualifying) {
  const SLOTS = [74,77,79,80,81,82,85,87];
  const result = {};
  function bt(idx, used) {
    if (idx === SLOTS.length) return true;
    const slot = SLOTS[idx];
    for (const team of qualifying) {
      if (!used.has(team.name) && THIRD_SLOTS[slot].includes(team.group)) {
        result[slot] = team; used.add(team.name);
        if (bt(idx+1, used)) return true;
        delete result[slot]; used.delete(team.name);
      }
    }
    return false;
  }
  bt(0, new Set()); return result;
}

// ─── Shared sub-components ────────────────────────────────────────────────────
const posColor = i => i < 2 ? 'text-green-400' : i === 2 ? 'text-yellow-400' : 'text-red-400';
const posBg    = i => i < 2 ? 'bg-green-500/8 border-green-500/20'
                    : i === 2 ? 'bg-yellow-500/5 border-yellow-500/10'
                    :           'bg-red-500/5 border-red-500/10';

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
          <CheckCircle className="w-4 h-4" /> נשמר! הבראקט מתעדכן.
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

// ─── Tab 1: Group position overrides ─────────────────────────────────────────
function TabGroups({ allMatches, groupOverrides, settingId, onSettingId }) {
  const [overrides, setOverrides] = useState(groupOverrides);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [activeGroup, setActiveGroup] = useState('A');

  useEffect(() => { setOverrides(groupOverrides); }, [groupOverrides]);

  const naturalOrder = g => calcStandings(allMatches[g] || []);
  const currentOrder = g => applyOverride(naturalOrder(g), overrides[g]);
  const hasOverride = g => !!overrides[g];

  const swap = (g, idx, dir) => {
    const order = currentOrder(g);
    if (idx+dir < 0 || idx+dir >= order.length) return;
    const next = [...order]; [next[idx], next[idx+dir]] = [next[idx+dir], next[idx]];
    setOverrides(prev => ({ ...prev, [g]: next.map(t => t.name) }));
    setDirty(true);
  };
  const resetGroup = g => {
    setOverrides(prev => { const n = {...prev}; delete n[g]; return n; });
    setDirty(true);
  };
  const handleSave = async () => {
    setSaving(true); setStatus(null);
    try {
      const newId = await saveGroupOverrides(overrides, settingId);
      onSettingId(newId); setDirty(false); setStatus('success');
      setTimeout(() => setStatus(null), 3500);
    } catch { setStatus('error'); setTimeout(() => setStatus(null), 4000); }
    setSaving(false);
  };

  const teams = currentOrder(activeGroup);
  const natural = naturalOrder(activeGroup);
  const groupsWithOverride = ALL_GROUPS.filter(hasOverride);

  return (
    <div className="space-y-5">
      {groupsWithOverride.length > 0 && (
        <div className="bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
          <span className="text-orange-300 text-sm">סידור ידני פעיל בבתים: <span className="font-bold">{groupsWithOverride.join(', ')}</span></span>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {ALL_GROUPS.map(g => (
          <button key={g} onClick={() => setActiveGroup(g)}
            className={`relative px-3.5 py-1.5 rounded-lg text-sm font-bold border transition-all ${
              activeGroup === g ? 'bg-yellow-400/20 border-yellow-400 text-yellow-400'
                               : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
            {g}
            {hasOverride(g) && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-orange-400" />}
          </button>
        ))}
      </div>
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-bold">בית {activeGroup}</h3>
            {hasOverride(activeGroup) && (
              <span className="text-[11px] bg-orange-400/15 text-orange-400 border border-orange-400/30 px-2 py-0.5 rounded-full">סידור ידני</span>
            )}
          </div>
          {hasOverride(activeGroup) && (
            <button onClick={() => resetGroup(activeGroup)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg transition-all">
              <RotateCcw className="w-3 h-3" /> איפוס
            </button>
          )}
        </div>
        <div className="p-4 space-y-2">
          {teams.map((team, idx) => {
            const naturalIdx = natural.findIndex(t => t.name === team.name);
            const moved = naturalIdx !== -1 && naturalIdx !== idx;
            return (
              <div key={team.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${posBg(idx)}`}>
                <span className={`text-sm font-black w-5 text-center flex-shrink-0 ${posColor(idx)}`}>{idx+1}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TeamFlag logo={team.logo} name={team.name} className="w-6 h-6 flex-shrink-0" />
                  <span className="text-sm font-medium text-white truncate">{team.name}</span>
                  {moved && <span className="text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded flex-shrink-0">↕ ממקום {naturalIdx+1}</span>}
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-300">{team.Pts} נק'</span>
                  <span>{team.W}W {team.D}D {team.L}L</span>
                  <span className={team.GD > 0 ? 'text-green-500' : team.GD < 0 ? 'text-red-400' : ''}>{team.GD > 0 ? '+' : ''}{team.GD} GD</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => swap(activeGroup, idx, -1)} disabled={idx === 0}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => swap(activeGroup, idx, 1)} disabled={idx === teams.length-1}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-700/50 text-[10px]">
            <span className="text-green-400">■ 1–2 עוברים ישירות</span>
            <span className="text-yellow-400">■ 3 בתחרות הטובות</span>
            <span className="text-red-400">■ 4 נפסל</span>
          </div>
        </div>
      </div>
      <SaveRow dirty={dirty} saving={saving} status={status} onSave={handleSave} />
    </div>
  );
}

// ─── Tab 2: Best 3rd place ranking override ───────────────────────────────────
function TabBest3rd({ allMatches, groupOverrides, bestThirdOrder: initOrder, settingId, onSettingId }) {
  const [order, setOrder] = useState(null); // null = auto
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  // All 12 third-place teams (natural auto ranking)
  const naturalList = useMemo(() => {
    return ALL_GROUPS.map(g => {
      const s = applyOverride(calcStandings(allMatches[g] || []), groupOverrides[g]);
      return s.length >= 3 ? { ...s[2], group: g } : null;
    }).filter(Boolean).sort((a,b) => (b.Pts-a.Pts)||(b.GD-a.GD)||(b.GF-a.GF)||a.name.localeCompare(b.name));
  }, [allMatches, groupOverrides]);

  const displayList = useMemo(() => {
    return order ? applyBestThirdOrder(naturalList, order) : naturalList;
  }, [naturalList, order]);

  useEffect(() => { setOrder(initOrder || null); }, [initOrder]);

  const swap = (idx, dir) => {
    const list = displayList;
    if (idx+dir < 0 || idx+dir >= list.length) return;
    const next = [...list]; [next[idx], next[idx+dir]] = [next[idx+dir], next[idx]];
    setOrder(next.map(t => t.name)); setDirty(true);
  };
  const reset = () => { setOrder(null); setDirty(true); };
  const handleSave = async () => {
    setSaving(true); setStatus(null);
    try {
      const newId = await saveBestThirdOrder(order, settingId);
      onSettingId(newId); setDirty(false); setStatus('success');
      setTimeout(() => setStatus(null), 3500);
    } catch { setStatus('error'); setTimeout(() => setStatus(null), 4000); }
    setSaving(false);
  };

  const hasOverride = !!order;
  const naturalByName = Object.fromEntries(naturalList.map((t,i) => [t.name, i]));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-slate-400 text-sm">שנה את דירוג 12 הנבחרות שסיימו במקום 3. שמונת הראשונות עוברות לבראקט.</p>
        {hasOverride && (
          <div className="mt-3 bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-orange-300 text-sm">דירוג ידני פעיל</span>
            </div>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg transition-all">
              <RotateCcw className="w-3 h-3" /> איפוס לאוטומטי
            </button>
          </div>
        )}
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-700 grid grid-cols-[28px_1fr_auto_auto] gap-2 text-[11px] text-slate-500 font-semibold uppercase tracking-wide">
          <span>#</span><span>נבחרת</span><span className="text-right">סטטיסטיקות</span><span className="w-12" />
        </div>
        <div className="p-3 space-y-1.5">
          {displayList.map((team, idx) => {
            const naturalIdx = naturalByName[team.name] ?? idx;
            const moved = naturalIdx !== idx;
            const advances = idx < 8;
            return (
              <div key={team.name} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all ${
                advances ? (idx < 4 ? 'bg-green-500/8 border-green-500/20' : 'bg-green-500/5 border-green-500/10')
                         : 'bg-red-500/5 border-red-500/10'
              }`}>
                <span className={`text-sm font-black w-6 text-center flex-shrink-0 ${advances ? 'text-green-400' : 'text-red-400'}`}>
                  {idx+1}
                </span>
                <span className="text-[11px] font-bold text-slate-500 w-5 flex-shrink-0">{team.group}</span>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TeamFlag logo={team.logo} name={team.name} className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium text-white truncate">{team.name}</span>
                  {moved && <span className="text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded flex-shrink-0">↕ {naturalIdx+1}</span>}
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 flex-shrink-0">
                  <span className="font-bold text-slate-300">{team.Pts}</span>
                  <span className={team.GD > 0 ? 'text-green-500' : team.GD < 0 ? 'text-red-400' : ''}>{team.GD > 0 ? '+' : ''}{team.GD}</span>
                  <span>{team.GF}</span>
                </div>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => swap(idx, -1)} disabled={idx === 0}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => swap(idx, 1)} disabled={idx === displayList.length-1}
                    className="p-1 rounded text-slate-500 hover:text-white hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-4 pb-3 flex gap-4 text-[10px]">
          <span className="text-green-400">■ מקומות 1–8 עוברות לשמינית 32</span>
          <span className="text-red-400">■ 9–12 נפסלות</span>
        </div>
      </div>
      <SaveRow dirty={dirty} saving={saving} status={status} onSave={handleSave} />
    </div>
  );
}

// ─── Tab 3: Bracket slot assignment ──────────────────────────────────────────
function TabBracket({ allMatches, groupOverrides, bestThirdOrder, bracketSlotOverride: initOverride, settingId, onSettingId }) {
  const [slotOverride, setSlotOverride] = useState(initOverride || {});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => { setSlotOverride(initOverride || {}); }, [initOverride]);

  // top-8 qualifying teams (respecting bestThirdOrder)
  const qualifying = useMemo(() => {
    const all3rd = ALL_GROUPS.map(g => {
      const s = applyOverride(calcStandings(allMatches[g] || []), groupOverrides[g]);
      return s.length >= 3 ? { ...s[2], group: g } : null;
    }).filter(Boolean).sort((a,b) => (b.Pts-a.Pts)||(b.GD-a.GD)||(b.GF-a.GF)||a.name.localeCompare(b.name));
    const ordered = bestThirdOrder ? applyBestThirdOrder(all3rd, bestThirdOrder) : all3rd;
    return ordered.slice(0, 8);
  }, [allMatches, groupOverrides, bestThirdOrder]);

  // automatic backtracking assignment
  const autoAssignment = useMemo(() => autoBacktrack(qualifying), [qualifying]);

  // effective assignment: auto + manual overrides
  const effectiveAssignment = useMemo(() => {
    const base = { ...autoAssignment };
    const byName = Object.fromEntries(qualifying.map(t => [t.name, t]));
    Object.entries(slotOverride).forEach(([slot, name]) => {
      const team = byName[name]; if (team) base[parseInt(slot)] = team;
    });
    return base;
  }, [autoAssignment, slotOverride, qualifying]);

  const setSlot = (slot, teamName) => {
    if (!teamName) {
      setSlotOverride(prev => { const n = {...prev}; delete n[slot]; return n; });
    } else {
      setSlotOverride(prev => ({ ...prev, [slot]: teamName }));
    }
    setDirty(true);
  };
  const resetAll = () => { setSlotOverride({}); setDirty(true); };

  const handleSave = async () => {
    setSaving(true); setStatus(null);
    try {
      const newId = await saveBracketSlotOverride(slotOverride, settingId);
      onSettingId(newId); setDirty(false); setStatus('success');
      setTimeout(() => setStatus(null), 3500);
    } catch { setStatus('error'); setTimeout(() => setStatus(null), 4000); }
    setSaving(false);
  };

  const hasAnyOverride = Object.keys(slotOverride).length > 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-slate-400 text-sm">שבץ ידנית נבחרת מקום 3 לכל סלוט בבראקט. כל שינוי מהשיבוץ האוטומטי מסומן.</p>
        {qualifying.length === 0 && (
          <div className="mt-3 p-4 bg-slate-800/60 rounded-xl text-slate-500 text-sm text-center">
            אין עדיין 8 נבחרות מקום 3 — ממלאים לאחר סיום שלב הבתים
          </div>
        )}
        {hasAnyOverride && (
          <div className="mt-3 bg-orange-500/8 border border-orange-500/20 rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-orange-300 text-sm">שיבוץ ידני פעיל ב-{Object.keys(slotOverride).length} סלוטים</span>
            </div>
            <button onClick={resetAll} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg transition-all">
              <RotateCcw className="w-3 h-3" /> איפוס הכל
            </button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {BRACKET_SLOTS.map(slot => {
          const assigned = effectiveAssignment[slot];
          const isManual = !!slotOverride[slot];
          const eligible = THIRD_SLOTS[slot];
          const isInvalid = assigned && !eligible.includes(assigned.group);

          return (
            <div key={slot} className={`bg-slate-800/60 border rounded-xl p-3.5 transition-all ${
              isManual ? 'border-orange-500/30' : 'border-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                {/* Slot info */}
                <div className="flex-shrink-0 text-center w-24">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">משחק {slot}</div>
                  <div className="text-xs text-slate-300 font-bold">{SLOT_HOME[slot]} <span className="text-slate-600">vs</span> 3rd</div>
                  <div className="text-[10px] text-slate-600 mt-0.5">כשיר: {eligible.join(',')}</div>
                </div>

                {/* Current assigned team */}
                <div className="flex-1 min-w-0">
                  {assigned ? (
                    <div className="flex items-center gap-2">
                      <TeamFlag logo={assigned.logo} name={assigned.name} className="w-6 h-6 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-medium">{assigned.name}</span>
                          <span className="text-[10px] text-slate-500">({assigned.group})</span>
                          {isManual && <span className="text-[10px] text-orange-400 bg-orange-400/10 border border-orange-400/20 px-1.5 py-0.5 rounded">ידני</span>}
                          {isInvalid && <span className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded">⚠ בית לא כשיר</span>}
                        </div>
                        {!isManual && <div className="text-[10px] text-slate-600">אוטומטי</div>}
                      </div>
                    </div>
                  ) : (
                    <span className="text-slate-600 text-sm">לא שובצה</span>
                  )}
                </div>

                {/* Dropdown */}
                <select
                  value={slotOverride[slot] || ''}
                  onChange={e => setSlot(slot, e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white text-xs rounded-lg px-2 py-1.5 flex-shrink-0 min-w-[120px]"
                >
                  <option value="">אוטומטי</option>
                  {qualifying.map(team => (
                    <option key={team.name} value={team.name}>
                      {team.name} ({team.group}){!eligible.includes(team.group) ? ' ⚠' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
      <SaveRow dirty={dirty} saving={saving} status={status} onSave={handleSave} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'groups', label: 'סידור בתים' },
  { id: 'best3',  label: 'טובות מקום 3' },
  { id: 'bracket', label: 'בראקט' },
];

export default function AdminGroupOverride() {
  const [allMatches, setAllMatches] = useState({});
  const [groupOverrides, setGroupOverrides] = useState({});
  const [bestThirdOrder, setBestThirdOrder] = useState(null);
  const [bracketSlotOverride, setBracketSlotOverride] = useState({});
  const [settingId, setSettingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('groups');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matchData, { groupOverrides: gOvr, bestThirdOrder: bto, bracketSlotOverride: bso, settingId: sid }] = await Promise.all([
        Match.list('match_date'),
        loadAllOverrides(),
      ]);
      const grouped = {};
      matchData.forEach(m => {
        if (!m.league) return;
        const letter = toLetter(m.league);
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(m);
      });
      setAllMatches(grouped);
      setGroupOverrides(gOvr || {});
      setBestThirdOrder(bto || null);
      setBracketSlotOverride(bso || {});
      setSettingId(sid);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  if (loading) return (
    <div className="py-16 text-center text-slate-500">טוען נתונים...</div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">סידור ידני — בתים, מקום 3 ובראקט</h2>
        <p className="text-slate-500 text-sm">שינויים נשמרים ב-DB ומשתקפים לכל המשתמשים בזמן אמת.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800/80 rounded-xl border border-slate-700 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'groups' && (
        <TabGroups
          allMatches={allMatches}
          groupOverrides={groupOverrides}
          settingId={settingId}
          onSettingId={id => { setSettingId(id); }}
        />
      )}
      {activeTab === 'best3' && (
        <TabBest3rd
          allMatches={allMatches}
          groupOverrides={groupOverrides}
          bestThirdOrder={bestThirdOrder}
          settingId={settingId}
          onSettingId={id => { setSettingId(id); }}
        />
      )}
      {activeTab === 'bracket' && (
        <TabBracket
          allMatches={allMatches}
          groupOverrides={groupOverrides}
          bestThirdOrder={bestThirdOrder}
          bracketSlotOverride={bracketSlotOverride}
          settingId={settingId}
          onSettingId={id => { setSettingId(id); }}
        />
      )}
    </div>
  );
}
