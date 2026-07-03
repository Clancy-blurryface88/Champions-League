// ─── Daily Recap — pure data helpers ────────────────────────────────────────
// Computes the "yesterday" ceremonial recap: personal performance + group
// highlights for the most recent calendar day that had finished, scored
// matches. No network calls here — caller passes in already-fetched lists.

// Local (not UTC) calendar-day key, e.g. "2026-07-03" — mirrors the pattern
// already used elsewhere in the app (Layout.jsx live-match date checks).
export function localDateKey(date) {
  return date.toLocaleDateString('sv-SE');
}

function dedupeLatestByMatch(predictions) {
  const map = {};
  predictions.forEach((p) => {
    const key = `${p.user_id}__${p.match_id}`;
    const existing = map[key];
    if (!existing || new Date(p.created_at || p.created_date) > new Date(existing.created_at || existing.created_date)) {
      map[key] = p;
    }
  });
  return Object.values(map);
}

/**
 * Finds the most recent calendar day (strictly before today) that has at
 * least one finished + scored match. Returns null if there is none — the
 * caller should treat that as "nothing to recap" and skip the ceremony.
 */
export function findRecapDate(matches, todayKey = localDateKey(new Date())) {
  const days = new Set();
  matches.forEach((m) => {
    if (!m.is_finished || !m.is_score_calculated) return;
    const key = localDateKey(new Date(m.match_date));
    if (key < todayKey) days.add(key);
  });
  if (days.size === 0) return null;
  return [...days].sort().pop();
}

/**
 * Builds the full recap payload for a given day.
 * @returns {object|null} null when the day has no qualifying matches.
 */
export function computeDailyRecap({ matches, predictions, profiles, userId, recapDate }) {
  const dayMatches = matches.filter((m) =>
    m.is_finished && m.is_score_calculated && localDateKey(new Date(m.match_date)) === recapDate
  );
  if (dayMatches.length === 0) return null;

  const dayMatchIds = new Set(dayMatches.map((m) => m.id));
  const dayPredictions = dedupeLatestByMatch(predictions.filter((p) => dayMatchIds.has(p.match_id)));

  const nameFor = (uid) => profiles.find((p) => p.user_id === uid)?.display_name || 'שחקן';

  // ── Personal stats for the day ─────────────────────────────────────────
  const myDayPredictions = dayPredictions.filter((p) => p.user_id === userId);
  const personalPoints = myDayPredictions.reduce((sum, p) => sum + (p.points_earned || 0), 0);
  const personalExactHits = myDayPredictions.filter((p) => {
    const m = matches.find((mm) => mm.id === p.match_id);
    return m && p.predicted_score_a === m.actual_score_a && p.predicted_score_b === m.actual_score_b;
  }).length;
  const personalCorrectOutcomes = myDayPredictions.filter((p) => {
    const m = matches.find((mm) => mm.id === p.match_id);
    if (!m) return false;
    const predOut = p.predicted_score_a > p.predicted_score_b ? 'h' : p.predicted_score_a < p.predicted_score_b ? 'a' : 'd';
    const actOut = m.actual_score_a > m.actual_score_b ? 'h' : m.actual_score_a < m.actual_score_b ? 'a' : 'd';
    return predOut === actOut;
  }).length;

  // ── Cumulative rank movement (before this day vs. through this day) ────
  const calcCumScores = (cutoffKey, inclusive) => {
    const matchIds = new Set(
      matches.filter((m) => {
        if (!m.is_finished || !m.is_score_calculated) return false;
        const key = localDateKey(new Date(m.match_date));
        return inclusive ? key <= cutoffKey : key < cutoffKey;
      }).map((m) => m.id)
    );
    const relevant = dedupeLatestByMatch(predictions.filter((p) => matchIds.has(p.match_id)));
    const scores = {};
    relevant.forEach((p) => {
      scores[p.user_id] = parseFloat(((scores[p.user_id] || 0) + (p.points_earned || 0)).toFixed(2));
    });
    return scores;
  };
  const rankAndGap = (scores) => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const idx = sorted.findIndex(([id]) => id === userId);
    if (idx === -1) return { rank: null, gap: null };
    const rank = idx + 1;
    const gap = sorted[0][0] === userId ? 0 : parseFloat(((sorted[0][1] || 0) - (scores[userId] || 0)).toFixed(2));
    return { rank, gap };
  };
  const before = rankAndGap(calcCumScores(recapDate, false));
  const after = rankAndGap(calcCumScores(recapDate, true));
  const rankChange = before.rank != null && after.rank != null ? before.rank - after.rank : null;

  // ── Group highlight: "king of the day" (most exact hits, tie-break points) ─
  const perUser = {};
  dayPredictions.forEach((p) => {
    const m = matches.find((mm) => mm.id === p.match_id);
    if (!m) return;
    if (!perUser[p.user_id]) perUser[p.user_id] = { exact: 0, points: 0 };
    if (p.predicted_score_a === m.actual_score_a && p.predicted_score_b === m.actual_score_b) {
      perUser[p.user_id].exact++;
    }
    perUser[p.user_id].points += p.points_earned || 0;
  });
  const ranked = Object.entries(perUser).sort(([, a], [, b]) => b.exact - a.exact || b.points - a.points);
  const kingOfDay = ranked.length > 0 && ranked[0][1].exact > 0
    ? { userId: ranked[0][0], name: nameFor(ranked[0][0]), exactHits: ranked[0][1].exact }
    : null;

  // ── Per-match summary (results + how many people nailed it) ────────────
  const matchSummaries = dayMatches
    .sort((a, b) => new Date(a.match_date) - new Date(b.match_date))
    .map((m) => {
      const preds = dayPredictions.filter((p) => p.match_id === m.id);
      const exactCount = preds.filter((p) => p.predicted_score_a === m.actual_score_a && p.predicted_score_b === m.actual_score_b).length;
      return {
        id: m.id,
        team_a: m.team_a, team_a_logo: m.team_a_logo,
        team_b: m.team_b, team_b_logo: m.team_b_logo,
        actual_score_a: m.actual_score_a, actual_score_b: m.actual_score_b,
        exactCount, totalPredictions: preds.length,
      };
    });

  return {
    recapDate,
    dayMatches: matchSummaries,
    personal: {
      points: parseFloat(personalPoints.toFixed(2)),
      exactHits: personalExactHits,
      correctOutcomes: personalCorrectOutcomes,
      totalMatches: myDayPredictions.length,
      rankBefore: before.rank,
      rankAfter: after.rank,
      rankChange,
      gapBefore: before.gap,
      gapAfter: after.gap,
    },
    kingOfDay,
  };
}
