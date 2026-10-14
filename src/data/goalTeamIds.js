// GOAL API (api.goal-api.com) team ids for this season's 36 league-phase
// teams, keyed by our team names (matches.team_a/team_b — typos and all,
// compared trimmed + lowercased). Shared by the match-arena head-to-head
// tab and the push webhook (api/_goalWebhook.js).
export const GOAL_TEAM_IDS = {
  'Arsenal': 'cmr7foowe2kf3rx06u6eu3rhl', 'Aston villa': 'cmr7hvawd3yvgrx06qjdxxr4v', 'AEK Athens': 'cmrib5shdfmxalb07sx4orfri',
  'Atletico Madrid': 'cmr7fp1we2n8rrx066zdyo70w', 'Barcelona': 'cmr7m55u15efyrx06ndeg0510', 'Bayern Munich': 'cmr79jab703zerx06eqilba4s',
  'Real Betis': 'cmr7m55uo5eg8rx06hlsjolr6', 'Bodø/Glimt': 'cmr7qedkz6y2rrx067li8of8c', 'Club Brugge': 'cmri4ql11dmzulb07v3q9pnmj',
  'Como': 'cmr7m6brl5t30rx06i2fz3gmw', 'Dortmund': 'cmr79jabe03zfrx061s6b1xiw', 'Porto': 'cmr7upbul8vobrx06j8bdlukj',
  'Fenerbahce': 'cmri0ey3gb6jzlb07w6sj8iaq', 'Feyenoord': 'cmr7qeuoo746xrx06gpaowm5g', 'Galatasaray': 'cmri0ey53b6kulb07e541svio',
  'Inter': 'cmr7fp1wj2n8urx061yv6ov5t', 'Lask': 'cmr7hu9t63l1jrx06d0t9rema', 'RC Lens': 'cmr7oa1g86g0srx06rgl26fqf',
  'LOSC LIlle': 'cmr7oa1go6g16rx06ws7j9hiq', 'Liverpool': 'cmr7hvad33yp7rx06q6tlbmde', 'Manchaster City': 'cmr7fpx0e2ybgrx06dajtxqc1',
  'Manchester United': 'cmr7fp1wp2n8yrx061vxmb1a5', 'Napoli': 'cmr7m6br45t2orx06ql4em344', 'Paris': 'cmr7oa1gr6g19rx06g1miy6jr',
  'PSV': 'cmr7qeuox746zrx06n7udaoim', 'Leipzig': 'cmr79jabm03zmrx06phgewkx5', 'Real Madrid': 'cmr7fp1wf2n8srx06b3wila7x',
  'AS Roma': 'cmr7m6brt5t37rx06ixsgl3rc', 'Sabah FC': 'cmri0gkbgbr6mlb07s324klf3', 'Shakhtar Donetsk': 'cmri911gbf1a8lb07eetvoj7d',
  'Slavia Prague': 'cmri4pzegddctlb07j7xenzfd', 'Slovan Bratislava': 'cmri2lbvwcmvmlb07i45ou65m', 'Sporting Lisbon': 'cmr7upbvc8vorrx06s3awvvn9',
  'Stuttgart': 'cmr79jabg03zhrx06z7qf1z8v', 'Villarreal': 'cmr7m55u85eg1rx06wsvtxyr5', 'Viking': 'cmr7qedl26y2trx06nvff2rj6',
};

const BY_NORM = Object.fromEntries(Object.entries(GOAL_TEAM_IDS).map(([n, id]) => [n.trim().toLowerCase(), id]));

export function goalTeamId(name) {
  return BY_NORM[(name || '').trim().toLowerCase()] || null;
}

// Reverse lookup: GOAL id → our team name.
export const TEAM_BY_GOAL_ID = Object.fromEntries(Object.entries(GOAL_TEAM_IDS).map(([n, id]) => [id, n]));
