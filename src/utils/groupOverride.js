import { supabase } from '@/api/supabase';

// ─── Load / Save ─────────────────────────────────────────────────────────────

export async function loadAllOverrides() {
  try {
    const { data } = await supabase
      .from('app_settings')
      .select('id, group_position_overrides, best_third_order, bracket_slot_override')
      .limit(1)
      .maybeSingle();
    if (!data) return { groupOverrides: {}, bestThirdOrder: null, bracketSlotOverride: {}, bracketMatchOverride: {}, settingId: null };
    // bracket_slot_override stores both 3rd-place slot overrides (numeric keys)
    // and bracket match team overrides (under the _matches key)
    const slotRaw = JSON.parse(data.bracket_slot_override || '{}');
    const bracketMatchOverride = slotRaw._matches || {};
    const bracketSlotOverride  = Object.fromEntries(Object.entries(slotRaw).filter(([k]) => k !== '_matches'));
    return {
      groupOverrides:      JSON.parse(data.group_position_overrides || '{}'),
      bestThirdOrder:      data.best_third_order ? JSON.parse(data.best_third_order) : null,
      bracketSlotOverride,
      bracketMatchOverride,
      settingId:           data.id,
    };
  } catch {
    return { groupOverrides: {}, bestThirdOrder: null, bracketSlotOverride: {}, bracketMatchOverride: {}, settingId: null };
  }
}

// kept for backward compat (GroupStandingsModal + KnockoutBracket call this)
export async function loadGroupOverrides() {
  const { groupOverrides, settingId } = await loadAllOverrides();
  return { overrides: groupOverrides, settingId };
}

async function saveColumn(column, value, settingId) {
  if (settingId) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ [column]: value, updated_at: new Date().toISOString() })
      .eq('id', settingId)
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } else {
    const { data, error } = await supabase
      .from('app_settings')
      .insert({ [column]: value })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }
}

export const saveGroupOverrides = (v, id) => saveColumn('group_position_overrides', JSON.stringify(v), id);
export const saveBestThirdOrder = (v, id) => saveColumn('best_third_order', v ? JSON.stringify(v) : null, id);

// Save slot override while preserving any existing _matches key
export async function saveBracketSlotOverride(slotOverride, settingId) {
  const { bracketMatchOverride } = await loadAllOverrides();
  const combined = Object.keys(bracketMatchOverride).length
    ? { ...slotOverride, _matches: bracketMatchOverride }
    : slotOverride;
  return saveColumn('bracket_slot_override', JSON.stringify(combined), settingId);
}

// Save match team override while preserving numeric slot keys
export async function saveBracketMatchOverride(matchOverride, settingId) {
  const { bracketSlotOverride } = await loadAllOverrides();
  const combined = { ...bracketSlotOverride, _matches: matchOverride };
  return saveColumn('bracket_slot_override', JSON.stringify(combined), settingId);
}

// ─── Apply helpers ────────────────────────────────────────────────────────────

// Reorder `standings` array to match `overrideOrder` (array of team names).
export function applyOverride(standings, overrideOrder) {
  if (!overrideOrder || overrideOrder.length === 0) return standings;
  const byName = Object.fromEntries(standings.map(t => [t.name, t]));
  const result = overrideOrder.map(name => byName[name]).filter(Boolean);
  standings.forEach(t => { if (!overrideOrder.includes(t.name)) result.push(t); });
  return result;
}

// Reorder `allThirdTeams` (array of team objects) to match `bestThirdOrder` (array of names).
export function applyBestThirdOrder(allThirdTeams, bestThirdOrder) {
  if (!bestThirdOrder || bestThirdOrder.length === 0) return allThirdTeams;
  const byName = Object.fromEntries(allThirdTeams.map(t => [t.name, t]));
  const result = bestThirdOrder.map(name => byName[name]).filter(Boolean);
  allThirdTeams.forEach(t => { if (!bestThirdOrder.includes(t.name)) result.push(t); });
  return result;
}
