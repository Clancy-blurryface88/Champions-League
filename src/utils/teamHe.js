// Short Hebrew team names for tight rows (the predictions table in "הניחושים שלי").
// Keyed by the name as stored on the match (trimmed); unknown teams fall back to that name.
const HE = {
  'AEK Athens': 'א.א.ק', 'AS Roma': 'רומא', Arsenal: 'ארסנל', 'Aston villa': 'וילה', 'Atletico Madrid': 'אתלטיקו', Barcelona: 'ברצלונה',
  'Bayern Munich': 'באיירן', 'Bodø/Glimt': 'בודה', 'Club Brugge': 'ברוז׳', Como: 'קומו', Dortmund: 'דורטמונד', Fenerbahce: 'פנרבחצ׳ה',
  Feyenoord: 'פיינורד', Galatasaray: 'גלאטה', Inter: 'אינטר', 'LOSC LIlle': 'ליל', Lask: 'לינץ', Leipzig: 'לייפציג', Liverpool: 'ליברפול',
  'Manchaster City': 'סיטי', 'Manchester City': 'סיטי', 'Manchester United': 'מנ״י', Napoli: 'נאפולי', PSV: 'פ.ס.וו', Paris: 'פריז', Porto: 'פורטו',
  'RC Lens': 'לאנס', 'Real Betis': 'בטיס', 'Real Madrid': 'ריאל', 'Sabah FC': 'סבאח', 'Shakhtar Donetsk': 'שחטאר', 'Slavia Prague': 'סלביה',
  'Slovan Bratislava': 'סלובן', 'Sporting Lisbon': 'ספורטינג', Stuttgart: 'שטוטגרט', Viking: 'ויקינג', Villarreal: 'ויאריאל',
};
export const teamHe = (name = '') => HE[name.trim()] || name.trim();

// Short English names, for the left-to-right version of the same table
const EN = {
  'AEK Athens': 'AEK', 'AS Roma': 'Roma', 'Aston villa': 'Aston Villa', 'Atletico Madrid': 'Atlético', 'Bayern Munich': 'Bayern', 'Club Brugge': 'Brugge',
  'LOSC LIlle': 'Lille', 'Manchaster City': 'Man City', 'Manchester City': 'Man City', 'Manchester United': 'Man Utd', 'RC Lens': 'Lens', 'Real Betis': 'Betis',
  'Sabah FC': 'Sabah', 'Shakhtar Donetsk': 'Shakhtar', 'Slavia Prague': 'Slavia', 'Slovan Bratislava': 'Slovan', 'Sporting Lisbon': 'Sporting', Fenerbahce: 'Fenerbahçe', Paris: 'PSG',
};
export const teamEn = (name = '') => EN[name.trim()] || name.trim();
