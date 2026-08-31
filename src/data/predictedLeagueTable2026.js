// תחזית "סופרקומפיוטר" לטבלת שלב הליגה 2026/27 — Football Ranked, דרך
// GiveMeSport (https://www.givemesport.com/champions-league-supercomputer-predicts-final-league-phase-table-football/).
// מבוססת על סטטיסטיקות, קושי לוח משחקים ואלפי סימולציות — לא נתונים אמיתיים.
// מפתחות = שמות קבוצות מ-team_logos אחרי trim (בטבלה יש רווחים/כתיב לא אחיד).
export const PREDICTED_TABLE_SUMMARY =
  "אנליסטים של Football Ranked ניתחו סטטיסטיקות וקושי לוח משחקים, והריצו אלפי סימולציות כדי לחזות את טבלת שלב הליגה הסופית של ליגת האלופות 2026/27.";

const RAW_TABLE = {
  "Bayern Munich":     { position: 1,  points: 18.9, note: "באיירן מינכן מנסה לתרגם את הדומיננטיות המקומית שלה לעליונות אירופית." },
  "Arsenal":           { position: 2,  points: 17.7, note: "ארסנל הובילה בעונה הקודמת והגיעה לגמר בעקבות כך." },
  "Paris":             { position: 3,  points: 17.1 },
  "Manchaster City":   { position: 4,  points: 16.9 },
  "Real Madrid":       { position: 5,  points: 16.5 },
  "Inter":             { position: 6,  points: 16.2 },
  "Liverpool":         { position: 7,  points: 15.4 },
  "Barcelona":         { position: 8,  points: 14.8 },
  "Manchester United": { position: 9,  points: 14.1, note: "מיקום תשיעי מחמיץ עלייה אוטומטית לשלב הנוקאאוט — יונייטד תצטרך לעבור דרך הפלייאוף." },
  "Aston villa":       { position: 10, points: 14.0 },
  "Stuttgart":         { position: 11, points: 13.3 },
  "Dortmund":          { position: 12, points: 13.2 },
  "Napoli":            { position: 13, points: 12.5 },
  "AS Roma":           { position: 14, points: 12.0 },
  "Sporting Lisbon":   { position: 15, points: 11.7 },
  "PSV":               { position: 16, points: 11.3 },
  "Porto":             { position: 17, points: 11.0 },
  "Como":              { position: 18, points: 11.0 },
  "Atletico Madrid":   { position: 19, points: 10.9, note: "אמנם הגיעה לחצי הגמר בעונה שעברה, אבל הפעם לא צפוי לה מעבר קל." },
  "Fenerbahce":        { position: 20, points: 10.8 },
  "Leipzig":           { position: 21, points: 10.6 },
  "Bodø/Glimt":        { position: 22, points: 10.0 },
  "RC Lens":           { position: 23, points: 9.6 },
  "LOSC LIlle":        { position: 24, points: 9.6 },
  "Real Betis":        { position: 25, points: 9.6 },
  "Club Brugge":       { position: 26, points: 9.3 },
  "Villarreal":        { position: 27, points: 9.0 },
  "Galatasaray":       { position: 28, points: 8.5 },
  "AEK Athens":        { position: 29, points: 7.9 },
  "Feyenoord":         { position: 30, points: 6.9 },
  "Viking":            { position: 31, points: 5.9 },
  "Slavia Prague":     { position: 32, points: 5.7 },
  "Lask":              { position: 33, points: 5.6 },
  "Shakhtar Donetsk":  { position: 34, points: 4.9 },
  "Slovan Bratislava": { position: 35, points: 3.7 },
  "Sabah FC":          { position: 36, points: 2.9, note: "אין ממש מקום להתלונן על המיקום האחרון הצפוי — זו ההשתתפות הראשונה שלה אי פעם, מול לוח המשחקים הקשה ביותר בתחרות." },
};

export function getPredictedEntry(teamName) {
  return RAW_TABLE[(teamName || "").trim()] || null;
}
