// The evening it is now: until 06:00 it is still last night's, so a night of matches that ended late stays "tonight".
export const eveningOf = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'Asia/Jerusalem' });
export const tonightIs = () => eveningOf(Date.now() - 6 * 3600e3);

// the active round being played today (from its first match day to its last), or null between rounds
export function roundTonight(rounds, matches) {
  const now = tonightIs();
  return rounds.find((r) => {
    if (!r.is_active) return false;
    const days = matches.filter((m) => m.round_id === r.id && m.match_date).map((m) => eveningOf(m.match_date)).sort();
    return days.length > 0 && days[0] <= now && now <= days[days.length - 1];
  }) || null;
}
