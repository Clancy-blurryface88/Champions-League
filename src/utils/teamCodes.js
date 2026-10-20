// 3-letter club codes (BAR, PSG...) for compact score displays — the match
// ticker and the live table's scoreboard. Anything not listed falls back to
// its first letters.
const CODES = {
  'AEK Athens': 'AEK', 'AS Roma': 'ROM', 'Arsenal': 'ARS', 'Aston villa': 'AVL', 'Atletico Madrid': 'ATM', 'Barcelona': 'BAR',
  'Bayern Munich': 'BAY', 'Bodø/Glimt': 'BOD', 'Club Brugge': 'BRU', 'Como': 'COM', 'Dortmund': 'BVB', 'Fenerbahce': 'FEN',
  'Feyenoord': 'FEY', 'Galatasaray': 'GAL', 'Inter': 'INT', 'LOSC LIlle': 'LIL', 'Lask': 'LAS', 'Leipzig': 'RBL',
  'Liverpool': 'LIV', 'Manchaster City': 'MCI', 'Manchester City': 'MCI', 'Manchester United': 'MUN', 'Napoli': 'NAP',
  'PSV': 'PSV', 'Paris': 'PSG', 'Porto': 'POR', 'RC Lens': 'RCL', 'Real Betis': 'BET', 'Real Madrid': 'RMA', 'Sabah FC': 'SAB',
  'Shakhtar Donetsk': 'SHA', 'Slavia Prague': 'SLA', 'Slovan Bratislava': 'SLO', 'Sporting Lisbon': 'SCP', 'Stuttgart': 'STU',
  'Viking': 'VIK', 'Villarreal': 'VIL',
};

export const teamCode = (name = '') => CODES[name.trim()] || name.trim().replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
