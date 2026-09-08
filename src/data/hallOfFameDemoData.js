// Shared fixed demo data for the admin Hall-of-Fame concept galleries
// (AdminHallOfFameOptions.jsx + AdminHallOfFameOptionsExtra.jsx).
// Not wired to Supabase — purely for comparing visual concepts.

export const TOURNAMENTS = {
  cl:   { name: "ליגת האלופות", short: "UCL",       icon: "🏆", color: "#7cadee", glow: "rgba(124,173,238,0.35)" },
  wc:   { name: "מונדיאל",      short: "World Cup", icon: "🌍", color: "#f5c518", glow: "rgba(245,197,24,0.35)" },
  euro: { name: "יורו",         short: "EURO",       icon: "⭐", color: "#34d399", glow: "rgba(52,211,153,0.35)" },
};

export const WINNERS = [
  { id: 1,  t: "cl",   year: 2025, team: "פ.ס.ז'",       player: "קיליאן אמבפה",      country: "צרפת",     note: "פריז עוצרת את הדומיננטיות של ריאל" },
  { id: 2,  t: "cl",   year: 2024, team: "ריאל מדריד",    player: "דני קרוואחל",       country: "ספרד",     note: "אליפות אירופית 15" },
  { id: 3,  t: "cl",   year: 2023, team: "מנצ'סטר סיטי",  player: "רודרי",             country: "אנגליה",   note: "הטריפל ההיסטורי" },
  { id: 4,  t: "cl",   year: 2022, team: "ריאל מדריד",    player: "קרים בנזמה",        country: "ספרד",     note: "בנזמה זוכה בכדור הזהב" },
  { id: 5,  t: "wc",   year: 2022, team: "ארגנטינה",       player: "ליאונל מסי",        country: "קטאר",     note: "הכתר החסר הושלם בדוחא" },
  { id: 6,  t: "wc",   year: 2018, team: "צרפת",           player: "קיליאן אמבפה",      country: "רוסיה",    note: "דור חדש עולה לגדולה" },
  { id: 7,  t: "wc",   year: 2014, team: "גרמניה",         player: "פיליפ לאם",         country: "ברזיל",    note: "7:1 נגד ברזיל בדרך לגמר" },
  { id: 8,  t: "euro", year: 2024, team: "ספרד",           player: "רודרי",             country: "גרמניה",   note: "אליפות אירופית שישית" },
  { id: 9,  t: "euro", year: 2020, team: "איטליה",         player: "ג'ורג'ו קייליני",   country: "אנגליה",   note: "וומבלי, פנדלים דרמטיים" },
  { id: 10, t: "euro", year: 2016, team: "פורטוגל",         player: "כריסטיאנו רונאלדו", country: "צרפת",     note: "האליפות הראשונה של פורטוגל" },
];

export const sorted = [...WINNERS].sort((a, b) => b.year - a.year);

export function initials(name) {
  return name.trim().slice(0, 2);
}
