import { supabase } from '@/api/supabase';

// ─── Load / Save ─────────────────────────────────────────────────────────────

export async function loadLeagueTableOverride() {
  try {
    const { data } = await supabase
      .from('app_settings')
      .select('id, league_table_override')
      .limit(1)
      .maybeSingle();
    if (!data) return { override: [], settingId: null };
    return {
      override: data.league_table_override ? JSON.parse(data.league_table_override) : [],
      settingId: data.id,
    };
  } catch {
    return { override: [], settingId: null };
  }
}

export async function saveLeagueTableOverride(overrideOrder, settingId) {
  const value = overrideOrder && overrideOrder.length ? JSON.stringify(overrideOrder) : null;
  if (settingId) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ league_table_override: value, updated_at: new Date().toISOString() })
      .eq('id', settingId)
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } else {
    const { data, error } = await supabase
      .from('app_settings')
      .insert({ league_table_override: value })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }
}

// ─── Apply helper ─────────────────────────────────────────────────────────────

// Reorder `standings` to match `overrideOrder` exactly (full manual override).
// The override is automatically cleared in AdminMatches when a league-phase match finishes.
export function applyOverride(standings, overrideOrder) {
  if (!overrideOrder || overrideOrder.length === 0) return standings;
  const byName = Object.fromEntries(standings.map(t => [t.name, t]));
  const result = overrideOrder.map(name => byName[name]).filter(Boolean);
  standings.forEach(t => { if (!overrideOrder.includes(t.name)) result.push(t); });
  return result;
}
