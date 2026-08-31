// היסטוריה כל-הזמנים בליגת האלופות (כולל עידן "גביע האלופות" הישן) —
// מקור: UCL_AllTime.csv שסופק ע"י המשתמש. רק 6 השדות שבשימוש בפועל
// נשמרים כאן (לא כל 12 העמודות המקוריות). שערים/ספיגות למשחק מעוגלים
// כבר ל-2 ספרות אחרי הנקודה.
// מפתחות = שמות קבוצות מ-team_logos אחרי trim (כמו predictedLeagueTable2026.js) —
// כולל שגיאות כתיב קיימות באפליקציה ("Manchaster City", "Aston villa" וכו').
// 3 מתוך 36 הקבוצות (Como, Bodø/Glimt, Sabah FC) לא מופיעות כאן בכוונה —
// זו השתתפות ראשונה שלהן בליגת האלופות, אין להן היסטוריה כלל.
const RAW_HISTORY = {
  "Bayern Munich":     { matches: 388, wins: 231, draws: 78, losses: 79,  goalsPerMatch: 2.11, concededPerMatch: 1.01 },
  "Arsenal":           { matches: 197, wins: 93,  draws: 44, losses: 60,  goalsPerMatch: 1.64, concededPerMatch: 1.15 },
  "Paris":             { matches: 151, wins: 79,  draws: 29, losses: 43,  goalsPerMatch: 1.95, concededPerMatch: 1.19 },
  "Manchaster City":   { matches: 127, wins: 72,  draws: 26, losses: 29,  goalsPerMatch: 2.12, concededPerMatch: 1.15 },
  "Real Madrid":       { matches: 486, wins: 291, draws: 85, losses: 110, goalsPerMatch: 2.21, concededPerMatch: 1.12 },
  "Inter":             { matches: 203, wins: 97,  draws: 53, losses: 53,  goalsPerMatch: 1.41, concededPerMatch: 1.03 },
  "Liverpool":         { matches: 230, wins: 128, draws: 48, losses: 54,  goalsPerMatch: 1.89, concededPerMatch: 0.96 },
  "Barcelona":         { matches: 341, wins: 196, draws: 77, losses: 68,  goalsPerMatch: 1.98, concededPerMatch: 1.04 },
  "Manchester United": { matches: 289, wins: 153, draws: 69, losses: 67,  goalsPerMatch: 1.81, concededPerMatch: 1.04 },
  "Aston villa":       { matches: 15,  wins: 9,   draws: 3,  losses: 3,   goalsPerMatch: 1.60, concededPerMatch: 0.67 },
  "Stuttgart":         { matches: 27,  wins: 8,   draws: 7,  losses: 12,  goalsPerMatch: 1.22, concededPerMatch: 1.56 },
  "Dortmund":          { matches: 176, wins: 83,  draws: 36, losses: 57,  goalsPerMatch: 1.69, concededPerMatch: 1.26 },
  "Napoli":            { matches: 66,  wins: 30,  draws: 17, losses: 19,  goalsPerMatch: 1.71, concededPerMatch: 1.26 },
  "AS Roma":           { matches: 109, wins: 41,  draws: 26, losses: 42,  goalsPerMatch: 1.37, concededPerMatch: 1.46 },
  "Sporting Lisbon":   { matches: 92,  wins: 28,  draws: 15, losses: 49,  goalsPerMatch: 1.36, concededPerMatch: 1.79 },
  "PSV":               { matches: 171, wins: 58,  draws: 43, losses: 70,  goalsPerMatch: 1.25, concededPerMatch: 1.31 },
  "Porto":             { matches: 265, wins: 120, draws: 58, losses: 87,  goalsPerMatch: 1.48, concededPerMatch: 1.15 },
  "Atletico Madrid":   { matches: 166, wins: 79,  draws: 44, losses: 43,  goalsPerMatch: 1.46, concededPerMatch: 0.99 },
  "Fenerbahce":        { matches: 73,  wins: 20,  draws: 10, losses: 43,  goalsPerMatch: 1.01, concededPerMatch: 1.95 },
  "Leipzig":           { matches: 46,  wins: 22,  draws: 6,  losses: 18,  goalsPerMatch: 1.76, concededPerMatch: 1.80 },
  "RC Lens":           { matches: 18,  wins: 6,   draws: 6,  losses: 6,   goalsPerMatch: 1.22, concededPerMatch: 1.56 },
  "LOSC LIlle":        { matches: 46,  wins: 9,   draws: 15, losses: 22,  goalsPerMatch: 0.83, concededPerMatch: 1.24 },
  "Real Betis":        { matches: 6,   wins: 2,   draws: 1,  losses: 3,   goalsPerMatch: 0.50, concededPerMatch: 1.17 },
  "Club Brugge":       { matches: 97,  wins: 31,  draws: 22, losses: 44,  goalsPerMatch: 1.19, concededPerMatch: 1.48 },
  "Villarreal":        { matches: 40,  wins: 11,  draws: 15, losses: 14,  goalsPerMatch: 1.08, concededPerMatch: 1.25 },
  "Galatasaray":       { matches: 161, wins: 43,  draws: 41, losses: 77,  goalsPerMatch: 1.08, concededPerMatch: 1.68 },
  "AEK Athens":        { matches: 56,  wins: 9,   draws: 19, losses: 28,  goalsPerMatch: 1.04, concededPerMatch: 1.79 },
  "Feyenoord":         { matches: 85,  wins: 32,  draws: 22, losses: 31,  goalsPerMatch: 1.66, concededPerMatch: 1.33 },
  "Viking":            { matches: 14,  wins: 1,   draws: 2,  losses: 11,  goalsPerMatch: 0.79, concededPerMatch: 2.07 },
  "Slavia Prague":     { matches: 12,  wins: 1,   draws: 4,  losses: 7,   goalsPerMatch: 0.75, concededPerMatch: 2.17 },
  "Lask":              { matches: 2,   wins: 0,   draws: 0,  losses: 2,   goalsPerMatch: 1.00, concededPerMatch: 2.50 },
  "Shakhtar Donetsk":  { matches: 118, wins: 39,  draws: 26, losses: 53,  goalsPerMatch: 1.36, concededPerMatch: 1.76 },
  "Slovan Bratislava": { matches: 16,  wins: 7,   draws: 2,  losses: 7,   goalsPerMatch: 1.31, concededPerMatch: 1.56 },
};

export function getUclAllTimeHistory(teamName) {
  return RAW_HISTORY[(teamName || "").trim()] || null;
}
