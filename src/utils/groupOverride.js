import { supabase } from '@/api/supabase';

export async function loadGroupOverrides() {
  try {
    const { data } = await supabase
      .from('app_settings')
      .select('id, group_position_overrides')
      .limit(1)
      .maybeSingle();
    if (!data) return { overrides: {}, settingId: null };
    return {
      overrides: JSON.parse(data.group_position_overrides || '{}'),
      settingId: data.id,
    };
  } catch {
    return { overrides: {}, settingId: null };
  }
}

export async function saveGroupOverrides(overrides, settingId) {
  const group_position_overrides = JSON.stringify(overrides);
  if (settingId) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ group_position_overrides, updated_at: new Date().toISOString() })
      .eq('id', settingId)
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } else {
    const { data, error } = await supabase
      .from('app_settings')
      .insert({ group_position_overrides })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }
}

// Reorders `standings` according to `overrideOrder` (array of team names).
// Teams not in the override are appended at the end unchanged.
export function applyOverride(standings, overrideOrder) {
  if (!overrideOrder || overrideOrder.length === 0) return standings;
  const byName = Object.fromEntries(standings.map(t => [t.name, t]));
  const result = overrideOrder.map(name => byName[name]).filter(Boolean);
  standings.forEach(t => {
    if (!overrideOrder.includes(t.name)) result.push(t);
  });
  return result;
}
