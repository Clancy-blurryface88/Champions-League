import { supabase } from '@/api/supabase';

// Phase 2 — knockout-phase play-off (positions 9-24, 8 two-legged ties).
// Per user decision: no automated aggregate/extra-time/penalties tie-break logic —
// the admin manually enters each tie's two teams and manually declares the winner.
// Stored as one JSON array of 8 slots (index 0 = playoff slot 1, ... index 7 = slot 8),
// matching the `{ playoff: N }` labels already wired into KnockoutBracket.jsx's R16 layout.

export const EMPTY_PLAYOFF_SLOT = { teamA: '', teamALogo: '', teamB: '', teamBLogo: '', winner: null };

export function emptyPlayoffOverride() {
  return Array.from({ length: 8 }, () => ({ ...EMPTY_PLAYOFF_SLOT }));
}

export async function loadPlayoffOverride() {
  try {
    const { data } = await supabase
      .from('app_settings')
      .select('id, playoff_winners_override')
      .limit(1)
      .maybeSingle();
    if (!data) return { slots: emptyPlayoffOverride(), settingId: null };
    const parsed = data.playoff_winners_override ? JSON.parse(data.playoff_winners_override) : null;
    return {
      slots: parsed && parsed.length === 8 ? parsed : emptyPlayoffOverride(),
      settingId: data.id,
    };
  } catch {
    return { slots: emptyPlayoffOverride(), settingId: null };
  }
}

export async function savePlayoffOverride(slots, settingId) {
  const value = JSON.stringify(slots);
  if (settingId) {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ playoff_winners_override: value, updated_at: new Date().toISOString() })
      .eq('id', settingId)
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } else {
    const { data, error } = await supabase
      .from('app_settings')
      .insert({ playoff_winners_override: value })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  }
}

// slotNum is 1-8 (matches the `{ playoff: N }` labels in KnockoutBracket.jsx)
export function resolvePlayoffWinner(slots, slotNum) {
  const slot = slots?.[slotNum - 1];
  if (!slot || !slot.winner) return null;
  const name = slot.winner === 'a' ? slot.teamA : slot.teamB;
  const logo = slot.winner === 'a' ? slot.teamALogo : slot.teamBLogo;
  if (!name) return null;
  return { name, logo };
}
