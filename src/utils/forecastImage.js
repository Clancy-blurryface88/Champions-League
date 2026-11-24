// The share picture of a round's forecasts (admin): a 1080px table drawn on a canvas — player, forecast with its
// range, expected correct outcomes — and one number for everyone together, the exact scores expected in the round.
// With `compare` (after the evening or round was calculated) it sets the forecast against what was really earned.
// Returned as a PNG blob.
const W = 1080, ROW = 130, TOP = 400, PAD = 46, SK = 26; // SK: the plates' slant in px
const NUM = "'Big Shoulders Stencil Display', 'Teko', sans-serif", OUT = 'Outfit, system-ui, sans-serif';
const loadImg = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });

// a parallelogram with slightly rounded corners
function slant(c, x, y, w, h, r = 8, sk = SK) {
  const p = [[x + sk, y], [x + w, y], [x + w - sk, y + h], [x, y + h]];
  c.beginPath();
  c.moveTo((p[0][0] + p[1][0]) / 2, y);
  for (let i = 1; i <= 4; i++) { const a = p[i % 4], b = p[(i + 1) % 4]; c.arcTo(a[0], a[1], b[0], b[1], r); }
  c.closePath();
}
const grad = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };

// rows: [{ name, fc, lo, hi, dir }], already in the order to show; with compare each also has { actual, adir }, and
// compare is { exact: the exact hits that came, live: 'HH:MM' for the live tab, partial: 'X מתוך Y'
// while only some matches are calculated; neither: final }
export async function forecastImage({ round, rows, exact, evening, compare }) {
  await Promise.all([`800 60px ${NUM}`, `800 40px ${OUT}`].map((f) => document.fonts.load(f, 'א1').catch(() => {})));
  await document.fonts.ready;
  const [logo, ball] = await Promise.all([loadImg('/champions/ch-logo.png'), loadImg('/champions/round-ball.png')]);
  const H = TOP + rows.length * ROW + (exact == null ? 96 : compare ? 286 : 232);
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');

  c.fillStyle = grad(c, 0, 0, W * 0.3, H, [[0, '#1a3f9e'], [0.45, '#0b1c4c'], [1, '#040a1e']]);
  c.fillRect(0, 0, W, H);
  if (ball) { c.globalAlpha = 0.07; c.drawImage(ball, W / 2 - 480, H / 2 - 340, 960, 960); c.globalAlpha = 1; }
  if (logo) { const h = 120, w = (logo.width / logo.height) * h; c.drawImage(logo, W / 2 - w / 2, 40, w, h); }

  c.textBaseline = 'middle';
  const text = (s, x, y, font, color, align = 'center', dir = 'rtl') => { c.direction = dir; c.font = font; c.fillStyle = color; c.textAlign = align; c.fillText(s, x, y); };
  text(evening ? 'תחזית נקודות לערב המשחקים' : 'תחזית נקודות למחזור המשחקים', W / 2, 212, `900 58px ${OUT}`, '#ffffff');
  text([evening, `מחזור ${round}`, compare?.live && `נכון ל־${compare.live}`, compare?.partial && `חושבו ${compare.partial} משחקים`].filter(Boolean).join(' · '), W / 2, 298, `700 30px ${OUT}`, '#9fc3ff');
  c.fillStyle = grad(c, W / 2 - 170, 0, W / 2 + 170, 0, [[0, 'rgba(250,204,21,0)'], [0.5, '#facc15'], [1, 'rgba(250,204,21,0)']]);
  c.fillRect(W / 2 - 170, 258, 340, 3);

  // columns, right to left: the name, the forecast, its range, outcomes; in the comparison the forecast and what was
  // earned side by side, with the range framed under both
  const col = compare ? { both: 344, dir: 56 } : { fc: 530, rng: 254, dir: 82 }, cw = compare ? { both: 404, dir: 254 } : { fc: 186, rng: 284, dir: 180 };
  const head = `800 29px ${OUT}`;
  const pw = cw.both / 2, rx = col.both + pw + 2, lx = col.both + 10; // the comparison's two plates
  const heads = compare ? [['תחזית', rx + pw / 2], [compare.live ? 'עכשיו' : 'בפועל', lx + pw / 2], ['כיוונים', col.dir + cw.dir / 2]]
    : [['תחזית', col.fc + cw.fc / 2], ['טווח', col.rng + cw.rng / 2], ['צפי כיוונים', col.dir + cw.dir / 2]];
  heads.forEach(([s, x]) => text(s, x, TOP - 44, head, '#9fc3ff'));
  text('משתתף', W - PAD - 34, TOP - 44, head, '#9fc3ff', 'right');

  rows.forEach((r, i) => {
    const y = TOP + i * ROW, h = ROW - 16, mid = y + h / 2 + 3;
    slant(c, PAD - 8, y, W - 2 * PAD + 16, h, 12);
    c.fillStyle = grad(c, W, 0, 0, 0, [[0, 'rgba(255,255,255,.17)'], [1, 'rgba(255,255,255,.05)']]);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.26)'; c.lineWidth = 2; c.stroke();
    // the name, shrunk if it's long
    let fs = 46; c.font = `800 ${fs}px ${OUT}`;
    while (c.measureText(r.name).width > 230 && fs > 24) c.font = `800 ${--fs}px ${OUT}`;
    text(r.name, W - PAD - 40, mid, `800 ${fs}px ${OUT}`, '#ffffff', 'right');
    // the comparison: forecast (gold) and what was earned — green when the forecast was reached, red when not (grey
    // while it can still be) — on two plates, and under them the range framed in the result's colour. Otherwise the
    // forecast on a gold plate, the range beside it
    if (compare) {
      const ok = Math.round(r.actual) >= Math.round(r.fc), open = compare.live || compare.partial;
      const [a, b, tone] = ok ? ['#4ade80', '#12994a', '#4ade80'] : open ? ['#64748b', '#334155', '#94a3b8'] : ['#f87171', '#b91c1c', '#fb7185'];
      const x0 = col.both, w = cw.both, t0 = y + 8, ph = 54;
      [[rx, r.fc, '#fde047', '#e0a300', '#1a1405'], [lx, r.actual, a, b, '#ffffff']].forEach(([x, v, c0, c1, ink]) => {
        slant(c, x, t0, pw - 5, ph, 8, 15);
        c.fillStyle = grad(c, 0, t0, 0, t0 + ph, [[0, c0], [1, c1]]); c.fill();
        text(String(Math.round(v)), x + pw / 2 - 2, t0 + 30, `800 50px ${NUM}`, ink, 'center', 'ltr');
      });
      slant(c, x0 + 1, t0 + 63, w - 18, 34, 8, 10);
      c.fillStyle = 'rgba(4,10,30,.45)'; c.fill(); c.strokeStyle = tone; c.lineWidth = 2.5; c.stroke();
      c.fillStyle = grad(c, x0 + 76, 0, x0 + w - 92, 0, [[0, 'rgba(255,255,255,0)'], [0.5, tone], [1, 'rgba(255,255,255,0)']]);
      c.fillRect(x0 + 76, t0 + 79, w - 168, 3);
      text(String(r.lo), x0 + 42, t0 + 82, `800 34px ${NUM}`, '#ffffff', 'center', 'ltr');
      text(String(r.hi), x0 + w - 60, t0 + 82, `800 34px ${NUM}`, '#ffffff', 'center', 'ltr');
    } else {
      slant(c, col.fc, y + 8, cw.fc, h - 16);
      c.fillStyle = grad(c, 0, y, 0, y + h, [[0, '#fde047'], [1, '#e0a300']]); c.fill();
      text(String(Math.round(r.fc)), col.fc + cw.fc / 2, mid, `800 64px ${NUM}`, '#1a1405', 'center', 'ltr');
      slant(c, col.rng, y + 8, cw.rng, h - 16);
      c.fillStyle = 'rgba(250,204,21,.14)'; c.fill(); c.strokeStyle = 'rgba(250,204,21,.75)'; c.lineWidth = 3; c.stroke();
      text(`${r.lo}–${r.hi}`, col.rng + cw.rng / 2, mid, `800 56px ${NUM}`, '#fde68a', 'center', 'ltr');
    }
    // outcomes: expected; in the comparison two plates — expected (gold, like the forecast) and what came (blue)
    const plate = (x, w, stops, num, cap, ink) => {
      slant(c, x, y + 8, w, h - 16);
      c.fillStyle = grad(c, 0, y, 0, y + h, stops); c.fill();
      text(String(num), x + w / 2, cap ? mid - 16 : mid, `800 ${cap ? 50 : 48}px ${NUM}`, ink, 'center', 'ltr');
      if (cap) text(cap, x + w / 2, mid + 28, `700 23px ${OUT}`, ink);
    };
    if (compare) {
      plate(col.dir + 120, 134, [[0, '#fde047'], [1, '#e0a300']], Math.round(r.dir), 'תחזית', '#1a1405');
      plate(col.dir, 134, [[0, '#7dd3fc'], [1, '#0b84d8']], r.adir, compare.live ? 'עכשיו' : 'בפועל', '#04203a');
    } else plate(col.dir, cw.dir, [[0, '#f8fafc'], [1, '#9fb0c6']], Math.round(r.dir), null, '#0f172a');
  });
  if (exact != null) {
    const y = TOP + rows.length * ROW + 22, h = 116, mid = y + h / 2 + 3;
    slant(c, PAD - 8, y, W - 2 * PAD + 16, h, 12);
    c.fillStyle = grad(c, W, 0, 0, 0, [[0, 'rgba(34,197,94,.34)'], [1, 'rgba(0,200,232,.2)']]); c.fill();
    c.strokeStyle = 'rgba(74,222,200,.7)'; c.lineWidth = 2; c.stroke();
    text(compare ? 'פגיעות מדויקות של כולם' : evening ? 'צפי פגיעות מדויקות בערב' : 'צפי פגיעות מדויקות של כולם', W - PAD - 40, mid, `800 42px ${OUT}`, '#ffffff', 'right');
    slant(c, 82, y + 9, 190, h - 18);
    c.fillStyle = grad(c, 0, y, 0, y + h, [[0, '#34e0a1'], [1, '#0ea5c6']]); c.fill();
    if (compare) {
      text(String(compare.exact), 82 + 95, mid - 14, `800 58px ${NUM}`, '#04201d', 'center', 'ltr');
      text(`צפי ${exact}`, 82 + 95, mid + 28, `700 25px ${OUT}`, 'rgba(4,32,29,.8)');
      const inRange = rows.filter((r) => r.lo <= Math.round(r.actual) && Math.round(r.actual) <= r.hi).length;
      const miss = (r) => Math.abs(r.actual - r.fc), best = [...rows].sort((a, b) => miss(a) - miss(b))[0];
      const passed = rows.filter((r) => Math.round(r.actual) >= Math.round(r.fc));
      text(compare.live || compare.partial ? `עברו את התחזית: ${passed.length} מתוך ${rows.length} · מוביל/ה: ${rows[0].name}` : `בתוך הטווח: ${inRange} מתוך ${rows.length} · התחזית הכי קרובה: ${best.name}`, W / 2, y + h + 48, `800 32px ${OUT}`, '#ffffff');
    } else text(String(exact), 82 + 95, mid, `800 64px ${NUM}`, '#04201d', 'center', 'ltr');
  }
  text(compare ? (compare.live || compare.partial ? `ירוק: עבר את התחזית · אפור: עוד לא${compare.live ? ' · הניקוד משתנה עם כל שער' : ''}` : 'ירוק: עבר את התחזית · אדום: מתחת לתחזית') : 'התחזית והטווח בנקודות · צפי כיוונים: כמה כיוונים נכונים', W / 2, H - 46, `600 25px ${OUT}`, 'rgba(255,255,255,.6)');
  return new Promise((ok, no) => cv.toBlob((b) => (b ? ok(b) : no(new Error('התמונה לא נוצרה'))), 'image/png'));
}
