import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { AppSettings } from '@/api/entities';

// Has this device finished the tour with this key? Follows the admin panel: off = treated as seen,
// and a finish before the last "show again to everyone" counts as not seen. ?<replay> shows it again.
export function useTourSeen(key, replay) {
  const [cfg, setCfg] = React.useState(null);
  React.useEffect(() => {
    AppSettings.list()
      .then((l) => setCfg({ on: l[0]?.tour_enabled !== false, resetAt: l[0]?.tour_reset_at ? Date.parse(l[0].tour_reset_at) : 0 }))
      .catch(() => setCfg({ on: true, resetAt: 0 }));
  }, []);
  const seen = () => {
    if (!cfg) return null; // not known yet
    if (!cfg.on) return true;
    if (replay && new URLSearchParams(window.location.search).has(replay)) return false;
    let v = null;
    try { v = localStorage.getItem(key); } catch { /* private mode */ }
    return !!v && (v === 'done' ? 0 : Number(v) || 0) >= cfg.resetAt;
  };
  const mark = () => { try { localStorage.setItem(key, String(Math.max(Date.now(), (cfg?.resetAt || 0) + 1))); } catch { /* private mode */ } };
  return { ready: !!cfg, seen, mark };
}

// The dimmed screen with a lit hole on the step's part. It used to be one box with a huge shadow
// (0 0 0 9999px) around it; phones sometimes failed to paint part of that shadow while it moved, and
// the page flashed through it at full brightness ("like lightning"). Now it's one SVG the size of the
// screen: a rectangle with a rounded hole cut out (even-odd), the hole following a spring.
const SPRING = { stiffness: 260, damping: 30 };
function Dim({ box, radius, outline }) {
  const t = useSpring(box.top, SPRING), l = useSpring(box.left, SPRING);
  const w = useSpring(box.width, SPRING), h = useSpring(box.height, SPRING);
  React.useEffect(() => { t.set(box.top); l.set(box.left); w.set(box.width); h.set(box.height); }, [box.top, box.left, box.width, box.height]); // eslint-disable-line react-hooks/exhaustive-deps
  const d = useTransform([t, l, w, h], ([T, L, W, H]) => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const rr = Math.max(0, Math.min(radius, W / 2, H / 2));
    const outer = `M0 0H${vw}V${vh}H0Z`;
    if (W < 1 || H < 1) return outer;
    return `${outer}M${L + rr} ${T}H${L + W - rr}A${rr} ${rr} 0 0 1 ${L + W} ${T + rr}V${T + H - rr}A${rr} ${rr} 0 0 1 ${L + W - rr} ${T + H}H${L + rr}A${rr} ${rr} 0 0 1 ${L} ${T + H - rr}V${T + rr}A${rr} ${rr} 0 0 1 ${L + rr} ${T}Z`;
  });
  return (
    <>
      <svg width="100%" height="100%" style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <motion.path d={d} fill="rgba(2,6,23,0.8)" fillRule="evenodd" />
      </svg>
      {outline && (
        <motion.div style={{ position: 'fixed', top: t, left: l, width: w, height: h, borderRadius: radius, outline: '1.5px solid rgba(250,204,21,0.75)', pointerEvents: 'none' }} />
      )}
    </>
  );
}

// The round 5 first-time tour, in parts that follow one another (Predictions runs the chain):
//   round     the round page: the stories strip, the card (timer, teams, score), sending; ends on a summary
//   tap-x12   the three buttons under the card, then "tap 1X2" — only that button can be tapped
//   x12       inside 1X2, tab by tab (the simulator plays an example score); summary, and the window closes
//   tap-arena "tap the match arena"
//   arena     inside the arena, tab by tab; summary, and the window closes
//   tap-bets  "tap BETS"
//   bets      inside BETS; summary, then "tap ✕" — and the user can start predicting
// Each part is done once (localStorage). Nothing can be closed half way. Targets are found by their
// data-tour attribute; a window's tab is opened by clicking its [data-tour-tab] button.
//
// A step is one of:
//   { target, title, subtitle, rows | lines }   lights its part, with a card that says what it is
//   { summary: true, title, lines }             a card in the middle: "המשך" / "צפה שוב"
//   { tap: true, target, title, lines }         lights a button that has to be tapped to go on
// and may also have tab (open that tab of the window first), event (sent to the window once the step
// is on — the simulator's example), keep (a tab the match doesn't have keeps its step, as a card in
// the middle with missingSubtitle) — otherwise a missing tab drops its step.

const Y = '#facc15', G = '#4ade80', GREY = '#94a3b8', BLUE = '#60a5fa', W = '#e2e8f0', RED = '#f87171';

const ROUND = [
  { target: 'strip', noScroll: true, radius: 18, pad: 4, title: 'משחקי המחזור', subtitle: 'צבע הטבעת מציין את מצב הניחוש',
    intro: ['ניתן ללחוץ על טבעות המשחקים על מנת לנווט בין המשחקים'], rows: [
    { head: 'מקרא צבעי הטבעות:' },
    { key: 'צהוב', color: Y, ring: true, text: 'ממתין לניחוש שלך' },
    { key: 'ירוק', color: G, ring: true, text: 'ניחשת את תוצאת המשחק' },
    { key: 'אפור', color: GREY, ring: true, text: 'המשחק נעול לניחושים' },
  ] },
  { target: 'card', radius: 20, pad: 4, swipe: true, title: 'מעבר בין משחקים', subtitle: 'החלקה לצדדים על הכרטיס',
    intro: ['בדומה ללחיצה על טבעות המשחקים, ניתן לנווט בין המשחקים על ידי החלקה בין כרטיסי המשחק'], rows: [
    { key: 'ימינה', color: W, text: 'המשחק הבא' },
    { key: 'שמאלה', color: W, text: 'המשחק הקודם' },
  ] },
  { target: 'timer', radius: 16, pad: 6, title: 'זמן לניחוש', subtitle: 'מתחלף בין ספירה לאחור למועד המשחק',
    intro: ['לכל כרטיס משחק יש טיימר עד נעילת הניחוש, ואת תאריך ושעת המשחק'], rows: [
    { key: 'ספירה לאחור', color: Y, text: 'הזמן שנותר עד הנעילה' },
    { key: 'תאריך ושעה', color: W, text: 'מועד שריקת הפתיחה' },
    { key: 'נעילה', color: GREY, text: 'מתבצעת 10 דקות לפני המשחק' },
  ] },
  { target: 'team-info', radius: 12, pad: 8, title: 'הקבוצות', subtitle: 'מתחת לכל סמל',
    intro: ['מתחת לכל קבוצה מופיע חיווי בית/חוץ, ובנוסף המיקום הנוכחי בטבלה'], rows: [
    { key: '(Home)', color: W, ltr: true, text: 'הקבוצה המארחת' },
    { key: '(Away)', color: W, ltr: true, text: 'הקבוצה האורחת' },
    { key: 'מספר', color: W, text: 'מציין את המיקום בטבלת שלב הליגה, לפי הדירוג הבא:' },
    { key: '1–8', color: G, ltr: true, text: 'עולות ישירות לשמינית הגמר' },
    { key: '9–24', color: Y, ltr: true, text: 'עולות לפלייאוף' },
    { key: '25–36', color: RED, ltr: true, text: 'מודחות' },
  ] },
  { target: 'score', radius: 18, pad: 8, title: 'הניחוש שלך', subtitle: 'בורר התוצאה',
    intro: ['ניחוש תוצאת המשחק על ידי בחירה בעזרת בוררי התוצאה'], rows: [
    { key: 'חצים', color: Y, text: 'מספר השערים לכל קבוצה' },
    { key: 'בחר עבורי', color: G, text: 'הצעת תוצאה אוטומטית' },
  ] },
  { target: 'bottom', noScroll: true, radius: 18, pad: 2, title: 'שליחת הניחושים',
    intro: ['בתחתית המסך מופיעים חיווי התקדמות מילוי תוצאות המשחקים, וכפתור השליחה'], rows: [
    { key: 'מונה', color: Y, text: 'כמה משחקים ניחשת במחזור' },
    { key: 'שליחה', color: G, text: 'שליחת כל הניחושים בסיום' },
  ] },
  { summary: true, title: 'זה היה הסבר של כרטיס המשחק ועמוד מחזור המשחקים', lines: [
    'עכשיו נעבור על שלושת הכפתורים שמתחת לכרטיס.',
    'הם עוזרים להחליט מה לנחש ומספקים מידע נוסף.',
  ] },
];

const tapLines = ['לחצו על הכפתור המסומן'];

export const TOURS = {
  round: { key: 'tour_round_v4', steps: ROUND },
  'tap-x12': { steps: [
    { target: 'actions', radius: 18, pad: 6, title: 'לפני שמנחשים', subtitle: 'שלושה כפתורי מידע', rows: [
      { key: '1X2', color: BLUE, ltr: true, text: 'ניקוד ויחסים לכל ניחוש ותוצאת המשחק' },
      { key: 'זירת המשחק', color: Y, text: 'תחזית, כושר, טבלה ועוד מידע' },
      { key: 'BETS', color: G, ltr: true, text: 'הניחושים של כל המשתתפים' },
    ] },
    { tap: true, target: 'btn-odds', radius: 12, pad: 4, title: 'נתחיל ב-1X2', lines: tapLines },
  ] },
  x12: { key: 'tour_x12_v5', example: true, steps: [
    { tab: 'sim', event: 'tour:sim-demo', place: 'top', target: 'x12-scroll', noScroll: true, radius: 16, pad: 4, title: 'סימולטור',
      intro: ['בעזרת הסימולטור ניתן לראות כמה נקודות צפויות לכל תוצאה, על פי יחסי תוצאות המשחקים', 'לדוגמה: 1–1, ואחר כך 2–2'], rows: [
      { key: 'בורר התוצאה', color: Y, text: 'ניתן לגלילה – בוחרים תוצאה לכל קבוצה' },
      { key: 'פירוט', color: G, text: 'תצוגה של הנקודות לכל רכיב בניחוש' },
      { key: 'סה״כ', color: W, text: 'הניקוד הכולל לתוצאה במקרה של פגיעה' },
    ] },
    { tab: 'markets', target: 'x12-scroll', noScroll: true, radius: 16, pad: 4, title: 'יחסים', subtitle: 'הצגת נקודות לכל סוג הימור', rows: [
      { key: 'כיוון משחק', color: BLUE, text: 'ניצחון בית, תיקו או ניצחון חוץ' },
      { key: 'שתי כובשות', color: Y, text: 'האם שתי הקבוצות יבקיעו' },
      { key: 'טווח שערים', color: G, text: 'כמה שערים יהיו במשחק' },
    ] },
    { tab: 'exact', target: 'x12-scroll', noScroll: true, radius: 16, pad: 4, title: 'תוצאה מדויקת', lines: [
      'כאן רואים את היחס לכל תוצאה, ואפשר לראות גם בתצוגת אלכסון התיקו.',
    ] },
    { summary: true, title: 'זה היה הסבר של אזור יחסים וניקוד', lines: ['ממשיכים לזירת המשחק.'] },
  ] },
  'tap-arena': { steps: [
    { tap: true, target: 'btn-arena', radius: 12, pad: 4, title: 'עכשיו – זירת המשחק', lines: tapLines },
  ] },
  arena: { key: 'tour_arena_v5', example: true, steps: [
    { tab: 'odds', target: 'arena-scroll', noScroll: true, radius: 16, pad: 4, title: 'תחזית', subtitle: 'הצגת יחסי סיכוי מנותחת לפי יחסי ההימורים', rows: [
      { key: 'אחוזים', color: Y, text: 'הסיכוי של כל קבוצה לנצח או לסיים בתיקו' },
      { key: 'תוצאות', color: G, text: 'תוצאות עם יחס הסיכוי הגבוה ביותר' },
    ] },
    { tab: 'form', target: 'arena-scroll', noScroll: true, radius: 16, pad: 4, title: '5 אחרונים',
      subtitle: 'הכושר של שתי הקבוצות במשחקים האחרונים בליגת האלופות או בעונת המשחקים הנוכחית', rows: [
      { key: 'ליגת האלופות', color: BLUE, text: 'הכושר של הקבוצה לפי מחזור ותוצאה בכל משחק' },
      { key: 'כל המסגרות', color: G, text: 'כלל המשחקים, בבית ובחוץ, לפי מפעלים שונים' },
    ] },
    { tab: 'h2h', target: 'arena-scroll', noScroll: true, radius: 16, pad: 4, title: 'ראש בראש', subtitle: 'המפגשים הקודמים', rows: [
      { key: 'תוצאות', color: BLUE, text: 'כל המשחקים בין שתי הקבוצות בליגת האלופות, עם התוצאות ויחס השערים' },
    ] },
    { tab: 'lineups', keep: true, target: 'arena-scroll', noScroll: true, radius: 16, pad: 4, title: 'הרכבים', subtitle: 'מתפרסמים כשעה לפני המשחק',
      missingSubtitle: 'הלשונית מופיעה כשעה לפני המשחק', rows: [
      { key: 'מגרש', color: G, text: 'ההרכב הפותח של שתי הקבוצות, לפי מערך משוער' },
    ] },
    { tab: 'table', target: 'arena-scroll', noScroll: true, radius: 16, pad: 4, title: 'טבלה', subtitle: 'טבלת שלב הליגה', rows: [
      { key: 'מסומנות', color: Y, text: 'שתי הקבוצות של המשחק, בכחול ובירוק לפי בית/חוץ' },
      { head: 'מקרא מיקום בטבלה:' },
      { key: '1–8', color: G, ltr: true, text: 'עולות ישירות לשמינית הגמר' },
      { key: '9–24', color: Y, ltr: true, text: 'עולות לפלייאוף' },
      { key: '25–36', color: RED, ltr: true, text: 'מודחות' },
    ] },
    { summary: true, title: 'זה היה הסבר של אזור זירת המשחק' },
  ] },
  'tap-bets': { steps: [
    { tap: true, target: 'btn-bets', radius: 12, pad: 4, title: 'כעת נעבור לכפתור האחרון בכרטיס המשחק – BETS', lines: tapLines },
  ] },
  bets: { key: 'tour_bets_v4', example: true, steps: [
    { target: 'bets-cols', noScroll: true, radius: 16, pad: 6, title: 'BETS', subtitle: 'הניחושים של כל המשתתפים', rows: [
      { key: 'מתי', color: GREY, text: 'הניחושים נחשפים 10 דקות לפני המשחק, לאחר נעילת הניחושים' },
      { key: 'אחוזים', color: Y, text: 'הצגת אחוזי ניחוש עבור כל אפשרות' },
      { key: 'עמודות', color: G, text: 'כל משתתף מוצג יחד עם התוצאה שניחש' },
    ] },
    { summary: true, title: 'זהו, זה היה הסבר על עמוד המחזור והאפשרויות השונות בו', lines: ['עכשיו אפשר להתחיל לנחש.', 'בהצלחה!'] },
    { tap: true, target: 'bets-close', radius: 10, pad: 4, lines: ['לחצו על כפתור ✕ לסגירה'] },
  ] },
};

// The notifications tour, on the main screen: the bell (only it can be tapped), then the notifications
// menu part by part — the device's status, the two tabs, each tab's switches, the LIVE minute.
TOURS['notif-tap'] = { steps: [
  { target: 'bell', radius: 999, pad: 6, title: 'מערכת ההתראות החדשה', subtitle: 'בוחרים בדיוק אילו התראות לקבל, ואילו מעדיפים שלא', rows: [
    { head: 'חיווי האם אתם רשומים להתראות:' },
    { key: 'זהב', color: '#f5c518', text: 'ההתראות פעילות במכשיר הזה' },
    { key: 'אפור', color: GREY, text: 'ההתראות כבויות במכשיר הזה' },
  ] },
  { tap: true, target: 'bell', radius: 999, pad: 6, title: 'נכנסים להגדרות', subtitle: 'ועכשיו למערכת החדשה', lines: ['לחצו על הפעמון'] },
] };
TOURS.notif = { key: 'tour_notif_v2', steps: [
  { target: 'notif-status', noScroll: true, radius: 16, pad: 4, title: 'מצב ההתראות', subtitle: 'ההגדרות במכשיר הזה', rows: [
    { key: 'ירוק', color: G, text: 'ההתראות פעילות במכשיר שלכם' },
    { key: 'הפעלה', color: Y, text: 'כשהן כבויות, לחיצה אחת מפעילה אותן' },
  ] },
  { target: 'notif-tabs', noScroll: true, radius: 12, pad: 4, title: 'שני סוגי קטגוריות התראות', rows: [
    { key: 'כללי', color: BLUE, text: 'מתייחס להרכבים, שריקת הסיום וסיכומים' },
    { key: 'LIVE', color: RED, ltr: true, text: 'מתייחס למה שקורה בזמן המשחק' },
  ] },
  { tab: 'general', target: 'notif-list', noScroll: true, radius: 16, pad: 4, title: 'כללי', subtitle: 'מופיע מתג לכל סוג התראה',
    intro: ['כל מתג קובע אם לקבל את ההתראה.', 'השינוי נשמר מיד לאחר ההפעלה או הכיבוי.'], rows: [
    { key: 'הרכבים', color: W, text: 'כשההרכבים יוצאים, כשעה לפני המשחק' },
    { key: 'שריקת הסיום', color: W, text: 'כמה נקודות קיבלת' },
    { key: 'סיכומים', color: W, text: 'סיכום ערב המשחקים וסיכום המחזור' },
  ] },
  { tab: 'live', target: 'notif-minute', noScroll: true, radius: 16, pad: 4, title: 'מאיזו דקה',
    intro: ['ניתן לבחור שהתראות ה-LIVE יישלחו במהלך המשחקים רק מהדקה שבחרתם.'], rows: [
    { key: 'כפתורים', color: Y, text: 'מתחילת המשחק, מהמחצית, מדקה 60 או 75' },
    { key: 'ציר', color: W, text: 'גרירה ובחירה של כל דקה אחרת שתרצו' },
  ] },
  { tab: 'live', target: 'notif-list', noScroll: true, radius: 16, pad: 4, title: 'הודעות LIVE', subtitle: 'בזמן המשחק', rows: [
    { key: 'גולים', color: G, text: 'גול שהעניק או הרס פגיעה מדויקת' },
    { key: 'טבלה', color: Y, text: 'עלייה לפסגה, או כשמשתתף אחר עקף אותך' },
    { key: 'VAR', color: GREY, ltr: true, text: 'גול שבוטל, או שינוי אחר שמשפיע על התוצאה' },
  ] },
  { summary: true, title: 'מעכשיו אתם שולטים במערכת ההתראות', lines: [
    'אפשר לחזור לכאן בכל זמן דרך הפעמון.',
  ] },
] };

// The table (Leaderboard) tour, the first time it's opened: the table, a long press (a player's stats),
// one tap (the points gap), then the rank journey button — only it can be tapped — and inside it the
// views, the players to show and the timeline.
TOURS.lb = { key: 'tour_lb_v1', steps: [
  { target: 'lb-list', noScroll: true, radius: 14, pad: 2, title: 'טבלת המשתתפים', subtitle: 'הדירוג הכללי של כל המשתתפים', rows: [
    { key: 'מספר ברקע', color: W, text: 'המקום בטבלה' },
    { key: 'Pts', color: G, ltr: true, text: 'סך הנקודות' },
    { key: 'זהב, כסף, ארד', color: Y, text: 'שלושת המקומות הראשונים' },
  ] },
  { target: 'lb-card', event: 'tour:lb-expand', radius: 10, pad: 4, title: 'לחיצה ממושכת', subtitle: 'החזיקו את האצבע על משתתף', rows: [
    { key: 'פגיעות', color: Y, text: 'מספר הפגיעות המדויקות' },
    { key: 'כיוונים', color: G, text: 'ניחושי כיוון נכונים' },
    { key: 'רצף', color: W, text: 'רצף הניחושים הנכונים' },
  ] },
  { target: 'lb-gap', event: 'tour:lb-gap', noScroll: true, radius: 16, pad: 2, title: 'לחיצה אחת', subtitle: 'פער הנקודות מול כל המשתתפים', rows: [
    { key: 'ירוק', color: G, text: 'משתתף שמקדים, ובכמה נקודות' },
    { key: 'אדום', color: RED, text: 'משתתף שמאחור, ובכמה נקודות' },
    { key: 'לחיצה', color: W, text: 'על משתתף אחר בודקת את הפער מולו' },
  ] },
  { tap: true, target: 'lb-journey', event: 'tour:lb-gap-close', radius: 16, pad: 4, title: 'מסלול הדירוג', subtitle: 'איך המקום של כל משתתף השתנה לאורך העונה', lines: ['לחצו על הכפתור המסומן'] },
] };
TOURS.journey = { key: 'tour_lb_v1', steps: [
  { target: 'rj-views', noScroll: true, radius: 14, pad: 4, title: 'תצוגה', subtitle: 'שתי דרכים לראות את העונה', rows: [
    { key: 'מסלול דירוג', color: Y, text: 'איך המקום השתנה' },
    { key: 'טבלה', color: W, text: 'נקודות ומקום' },
    { key: 'ערב / מחזור', color: BLUE, text: 'כל נקודה היא ערב משחקים, או מחזור שלם' },
  ] },
  { target: 'rj-people', noScroll: true, radius: 14, pad: 4, title: 'בחירת משתתפים', subtitle: 'את מי לראות בגרף', rows: [
    { key: 'זהב', color: Y, text: 'הקו שלך' },
    { key: 'רק אני / כולם', color: W, text: 'רק אתם, או כל המשתתפים' },
    { key: 'שם', color: BLUE, text: 'לחיצה מוסיפה או מסירה משתתף' },
  ] },
  { target: 'rj-timeline', noScroll: true, radius: 14, pad: 6, title: 'ציר הזמן', subtitle: 'מנגנים את העונה מההתחלה', rows: [
    { key: 'ניגון', color: G, text: 'המסלול רץ ערב אחרי ערב' },
    { key: 'מהירות', color: W, text: 'קצב הניגון' },
    { key: 'גרירה', color: Y, text: 'מעבר לכל ערב או מחזור' },
  ] },
  { summary: true, title: 'זהו, ראית את כל הטבלה', lines: ['אפשר לחזור למסלול הדירוג בכל זמן, מתחתית הטבלה.'] },
] };

const rectOf = (name) => {
  const el = name && document.querySelector(`[data-tour="${name}"]`);
  return el ? el.getBoundingClientRect() : null;
};

const TEXT = { font: '500 12.5px/1.45 Outfit, system-ui', color: 'rgba(255,255,255,0.85)', textWrap: 'balance' };
const BTN_MAIN = { padding: '7px 16px', borderRadius: 12, font: '800 12px Outfit, system-ui', color: '#1a1405', background: 'linear-gradient(135deg,#fde047,#eab308)' };
const BTN_SOFT = { padding: '7px 12px', borderRadius: 12, font: '700 12px Outfit, system-ui', color: 'rgba(255,255,255,0.75)', background: 'rgba(255,255,255,0.08)' };

export function Tour({ steps: allSteps, onDone, badge, z = 120 }) {
  const [at, setI] = React.useState(0);
  const [rect, setRect] = React.useState(null);
  const [missing, setMissing] = React.useState(() => new Set()); // tabs this match doesn't have
  const cardRef = React.useRef(null);
  const [cardH, setCardH] = React.useState(220);
  // the card comes in only once its part has stopped moving (scrolling, a window sliding up, a tab
  // swapping), so it doesn't appear in one place and jump to another
  const [settled, setSettled] = React.useState(-1);
  const steps = allSteps.filter((s) => !s.tab || s.keep || !missing.has(s.tab));
  const i = Math.min(at, steps.length - 1);
  const step = steps[i];
  const last = i === steps.length - 1;
  const absent = step.tab && missing.has(step.tab); // a kept step whose tab isn't there
  const target = step.summary || absent ? null : step.target;
  const content = steps.filter((s) => !s.summary && !s.tap); // what the counter counts
  const n = content.indexOf(step);

  // open the step's tab of the window (it may still be coming in), then send its event
  React.useEffect(() => {
    if (!step.tab) return undefined;
    let tries = 0, t = 0;
    const open = () => {
      const b = document.querySelector(`[data-tour-tab="${step.tab}"]`);
      if (b) {
        b.click();
        if (step.event) t = setTimeout(() => window.dispatchEvent(new CustomEvent(step.event)), 350);
        return;
      }
      if (++tries > 12) { setMissing((m) => new Set(m).add(step.tab)); return; }
      t = setTimeout(open, 100);
    };
    open();
    return () => clearTimeout(t);
  }, [i, step.tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // a step's event when it isn't a tab's (a tab's is sent once the tab is open, above)
  React.useEffect(() => {
    if (!step.event || step.tab) return undefined;
    const t = setTimeout(() => window.dispatchEvent(new CustomEvent(step.event)), 150);
    return () => clearTimeout(t);
  }, [i]); // eslint-disable-line react-hooks/exhaustive-deps

  // bring the step's part into view, then follow it (it can move: animations, scrolling)
  React.useEffect(() => {
    if (!target) { setRect(null); setSettled(i); return undefined; }
    const el = document.querySelector(`[data-tour="${target}"]`);
    // scroll only when the part isn't fully on screen (scrolling the page every step made it jump)
    if (el && !step.noScroll) {
      const r0 = el.getBoundingClientRect();
      if (r0.top < 8 || r0.bottom > window.innerHeight - 8) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    let raf = 0, still = 0, prev = null, gone = 0;
    const tick = () => {
      const r = rectOf(target);
      if (!r && ++gone === 90) setSettled(i); // its part never showed (~1.5s): the card alone, in the middle
      if (r) {
        const same = prev && Math.abs(prev.top - r.top) < 0.5 && Math.abs(prev.left - r.left) < 0.5 && Math.abs(prev.width - r.width) < 0.5 && Math.abs(prev.height - r.height) < 0.5;
        still = same ? still + 1 : 0;
        prev = r;
        if (still === 8) setSettled(i); // ~8 frames without moving
        setRect((p) => (p && Math.abs(p.top - r.top) < 0.5 && Math.abs(p.left - r.left) < 0.5 && Math.abs(p.width - r.width) < 0.5 && Math.abs(p.height - r.height) < 0.5 ? p : { top: r.top, left: r.left, width: r.width, height: r.height }));
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [i, target]); // eslint-disable-line react-hooks/exhaustive-deps

  const pad = step.pad || 0;
  const vh = window.innerHeight, vw = window.innerWidth;
  // the lit part, cut to the screen (a long tab — the league table — runs far below it)
  const box = (() => {
    if (!rect || !target) return { top: vh * 0.36, left: vw / 2, width: 0, height: 0 };
    const top = Math.max(4, rect.top - pad), bottom = Math.min(vh - 4, rect.top + rect.height + pad);
    return { top, left: rect.left - pad, width: rect.width + pad * 2, height: Math.max(0, bottom - top) };
  })();
  // the hole moves only to a part that has stopped moving: chasing a window while it slid up made the
  // hole (and the page under it) jump across the screen. Until then it stays where it last settled —
  // or, at the start of a tour, the whole screen stays dim.
  const settledBoxRef = React.useRef(null);
  const steady = settled === i || !target;
  if (steady) settledBoxRef.current = box;
  const holeBox = steady ? box : (settledBoxRef.current || { top: vh * 0.36, left: vw / 2, width: 0, height: 0 });
  const cardW = Math.min(340, vw - 32);
  // the card's real height (texts differ in length), for placing it
  // measured the moment the card is put on the page (before it's drawn): measuring later, on the next
  // render, placed a new card by the previous card's height first — it showed under its part, then jumped
  // over it
  const cardHRef = React.useRef(cardH);
  const measureCard = React.useCallback((el) => {
    cardRef.current = el;
    if (!el) return;
    const h = el.offsetHeight;
    if (h && Math.abs(h - cardHRef.current) > 2) { cardHRef.current = h; setCardH(h); }
  }, []);
  const need = cardH + 24;
  const below = box.top + box.height + need < vh; // room for the card under the lit part?
  const above = !below && box.top > need; // or over it?
  // no room either side: the card sits at the bottom of the screen, over the lit part
  const cardTop = below ? box.top + box.height + 12 : above ? box.top - 12 : vh - 16;
  const next = () => (last ? onDone?.() : setI(i + 1));
  const stop = (e) => e.stopPropagation();
  // a tap step: only the lit button takes a tap — four blocks cover the rest of the screen
  const blocks = step.tap ? [
    { top: 0, left: 0, width: vw, height: box.top },
    { top: box.top + box.height, left: 0, width: vw, height: Math.max(0, vh - box.top - box.height) },
    { top: box.top, left: 0, width: Math.max(0, box.left), height: box.height },
    { top: box.top, left: box.left + box.width, width: Math.max(0, vw - box.left - box.width), height: box.height },
  ] : [];

  return createPortal(
    <div dir="rtl" style={{ position: 'fixed', inset: 0, zIndex: z, pointerEvents: step.tap ? 'none' : 'auto' }} onClick={stop}>
      {blocks.map((b, k) => <div key={k} onClick={stop} onPointerDown={stop} style={{ position: 'fixed', ...b, pointerEvents: 'auto' }} />)}
      {badge && (
        <span style={{ position: 'fixed', top: 'max(10px, env(safe-area-inset-top))', left: '50%', transform: 'translateX(-50%)', padding: '4px 12px', borderRadius: 999, font: '800 11px Outfit, system-ui', color: '#1a1405', background: 'linear-gradient(135deg,#fde047,#eab308)', boxShadow: '0 4px 14px rgba(0,0,0,.4)', zIndex: 1, pointerEvents: 'none' }}>{badge}</span>
      )}
      {/* the dimmed page with a lit hole on the step's part */}
      <Dim box={holeBox} radius={step.radius || 16} outline={holeBox.width > 0} />
      {/* a tap step: a pulsing ring and a finger on the button */}
      {step.tap && rect && settled === i && (
        <>
          <motion.div
            key={`pulse-${i}`}
            animate={{ scale: [1, 1.18], opacity: [0.9, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            style={{ position: 'fixed', top: box.top, left: box.left, width: box.width, height: box.height, borderRadius: step.radius, border: '2px solid #facc15', pointerEvents: 'none' }}
          />
          <motion.span
            key={`finger-${i}`}
            animate={{ y: box.top + box.height + 40 > vh ? [-6, 4, -6] : [6, -4, 6] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            // under the button, or over it (pointing down) when the button is at the bottom of the screen
            style={{ position: 'fixed', top: box.top + box.height + 40 > vh ? box.top - 38 : box.top + box.height + 2, left: box.left + box.width / 2 - 15, fontSize: 30, pointerEvents: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.6))' }}
          >{box.top + box.height + 40 > vh ? '👇' : '👆'}</motion.span>
        </>
      )}
      {/* a hand showing the swipe */}
      {step.swipe && (
        <motion.span
          key={`hand-${i}`}
          animate={{ x: [40, -40, 40], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'fixed', top: box.top + box.height / 2 - 18, left: box.left + box.width / 2 - 16, fontSize: 32, pointerEvents: 'none', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.6))' }}
        >👆</motion.span>
      )}
      {/* the card */}
      <AnimatePresence mode="wait">
        {settled === i && <motion.div
          key={`${i}-${step.title}`}
          ref={measureCard}
          onClick={stop}
          initial={{ opacity: 0, y: below ? 10 : -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{
            position: 'fixed', left: (vw - cardW) / 2, width: cardW, pointerEvents: 'auto',
            // a tap step: under the finger, or over the button when it's low on the screen
            ...(step.place === 'top' ? { top: 44 } : step.tap ? (box.top + box.height + 54 > vh - 150 ? { bottom: vh - box.top + 14 } : { top: box.top + box.height + 54 })
              : below ? { top: cardTop } : { bottom: vh - cardTop }),
            padding: '14px 16px 12px', borderRadius: 18, color: '#fff', textAlign: step.summary ? 'center' : undefined,
            background: 'linear-gradient(170deg,#16295a,#0b1426 80%)', border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 18px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.12)',
          }}
        >
          {step.title && <div className={step.summary || step.tap ? 'text-center' : 'flex items-center justify-between'}>
            <span style={{ font: `800 ${step.summary ? 17 : 16}px Outfit, system-ui`, textWrap: 'balance', display: step.summary || step.tap ? 'block' : undefined }}>{step.title}</span>
            {n >= 0 && <span dir="ltr" style={{ font: '900 12px var(--num-font)', color: '#facc15', letterSpacing: '.06em' }}>{n + 1}/{content.length}</span>}
          </div>}
          {(absent ? step.missingSubtitle : step.subtitle) && (
            <div style={{ font: '600 12px Outfit, system-ui', color: 'rgba(255,255,255,0.55)', marginTop: 2, textWrap: 'balance' }}>{absent ? step.missingSubtitle : step.subtitle}</div>
          )}
          {!step.tap && (step.rows || step.lines || step.intro) && <div style={{ height: 1, margin: '10px 0 8px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)' }} />}
          {/* the step's opening sentences, before its keys */}
          {step.intro && (
            <div style={{ display: 'grid', rowGap: 3, marginBottom: step.rows ? 9 : 0 }}>
              {step.intro.map((l) => <div key={l} style={{ ...TEXT, color: '#fff', fontWeight: 600 }}>{l}</div>)}
            </div>
          )}
          {step.rows && (
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 10, rowGap: 7, alignItems: 'center' }}>
              {step.rows.map((row) => row.head ? (
                <div key={row.head} style={{ gridColumn: '1 / -1', font: '700 11.5px Outfit, system-ui', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{row.head}</div>
              ) : (() => {
                const key = (
                  <span className="flex items-center gap-1.5" style={{ whiteSpace: 'nowrap' }}>
                    {row.ring
                      ? <span style={{ width: 11, height: 11, borderRadius: '50%', border: `2.5px solid ${row.color}`, boxShadow: `0 0 6px ${row.color}66` }} />
                      : <span style={{ width: 4, height: 14, borderRadius: 2, background: row.color }} />}
                    <span dir={row.ltr ? 'ltr' : undefined} style={{ font: row.ltr ? '900 14px var(--num-font)' : '800 13px Outfit, system-ui', letterSpacing: row.ltr ? '.06em' : 0, color: row.color }}>{row.key}</span>
                  </span>
                );
                // a long row: its key on top and the text under it, across the card (not squeezed beside it)
                if (row.key.length + row.text.length > 40) {
                  return (
                    <div key={row.key} style={{ gridColumn: '1 / -1', display: 'grid', rowGap: 2 }}>
                      {key}
                      <span style={{ ...TEXT, paddingInlineStart: 10 }}>{row.text}</span>
                    </div>
                  );
                }
                return (
                  <React.Fragment key={row.key}>
                    {key}
                    <span style={TEXT}>{row.text}</span>
                  </React.Fragment>
                );
              })())}
            </div>
          )}
          {/* sentences: each on its own line */}
          {step.lines && (
            <div style={{ display: 'grid', rowGap: 4, marginTop: step.tap ? 4 : 0, textAlign: step.summary || step.tap ? 'center' : undefined }}>
              {step.lines.map((l) => <div key={l} style={{ ...TEXT, fontSize: step.summary ? 13.5 : 12.5, color: step.tap ? '#facc15' : TEXT.color, fontWeight: step.tap ? 700 : 500 }}>{l}</div>)}
            </div>
          )}
          {step.summary && (
            <div className="flex justify-center gap-2" style={{ marginTop: 14 }}>
              <button type="button" onClick={() => setI(0)} style={BTN_SOFT}>↻ צפה שוב</button>
              <button type="button" onClick={next} style={BTN_MAIN}>המשך</button>
            </div>
          )}
          {!step.summary && !step.tap && (
            <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
              <div className="flex gap-1.5">
                {content.map((_, k) => <span key={k} style={{ width: k === n ? 16 : 6, height: 6, borderRadius: 3, background: k <= n ? '#facc15' : 'rgba(255,255,255,0.22)', transition: 'all .25s' }} />)}
              </div>
              <div className="flex gap-2">
                {i > 0 && <button type="button" onClick={() => setI(i - 1)} style={BTN_SOFT}>הקודם</button>}
                <button type="button" onClick={next} style={BTN_MAIN}>הבא</button>
              </div>
            </div>
          )}
        </motion.div>}
      </AnimatePresence>
    </div>,
    document.body
  );
}
