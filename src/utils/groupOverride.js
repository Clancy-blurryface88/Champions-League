import { supabase } from '@/api/supabase';

const OVERRIDE_KEY = 'group_position_overrides';

export async function loadGroupOverrides() {
  try {
    const { data } = await supabase
      .from('app_settings')
      .select('*')
      .eq('key', OVERRIDE_KEY)
      .maybeSingle();
    if (!data) return { overrides: {}, settingId: null };
    return {
      overrides: JSON.parse(data.value || '{}'),
      settingId: data.id,
    };
  } catch {
    return { overrides: {}, settingId: null };
  }
}

export async function saveGroupOverrides(overrides, settingId) {
  const value = JSON.stringify(overrides);
  if (settingId) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('id', settingId)
      .select()
      .single();
    if (error) throw error;
    return data.id;
  } else {
    const { data, error } = await supabase
      .from('app_settings')
      .insert({ key: OVERRIDE_KEY, value })
      .select()
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
