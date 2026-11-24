// The share picture of a round's forecasts (admin): a 1080px table drawn on a canvas — player, forecast with its
// range, expected correct outcomes — and one number for everyone together, the exact scores expected in the round.
// Returned as a PNG blob.
const W = 1080, ROW = 118, TOP = 400, PAD = 46, SK = 26; // SK: the plates' slant in px
const NUM = "'Big Shoulders Stencil Display', 'Teko', sans-serif", OUT = 'Outfit, system-ui, sans-serif';
const loadImg = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });

// a parallelogram with slightly rounded corners
function slant(c, x, y, w, h, r = 8) {
  const p = [[x + SK, y], [x + w, y], [x + w - SK, y + h], [x, y + h]];
  c.beginPath();
  c.moveTo((p[0][0] + p[1][0]) / 2, y);
  for (let i = 1; i <= 4; i++) { const a = p[i % 4], b = p[(i + 1) % 4]; c.arcTo(a[0], a[1], b[0], b[1], r); }
  c.closePath();
}
const grad = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, col]) => g.addColorStop(o, col)); return g; };

// rows: [{ name, fc, lo, hi, dir }], already in the order to show
export async function forecastImage({ round, rows, exact, evening }) {
  await Promise.all([`800 60px ${NUM}`, `800 40px ${OUT}`].map((f) => document.fonts.load(f, 'א1').catch(() => {})));
  await document.fonts.ready;
  const [logo, ball] = await Promise.all([loadImg('/champions/ch-logo.png'), loadImg('/champions/round-ball.png')]);
  const H = TOP + rows.length * ROW + (exact == null ? 96 : 232);
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');

  c.fillStyle = grad(c, 0, 0, W * 0.3, H, [[0, '#1a3f9e'], [0.45, '#0b1c4c'], [1, '#040a1e']]);
  c.fillRect(0, 0, W, H);
  if (ball) { c.globalAlpha = 0.07; c.drawImage(ball, W / 2 - 480, H / 2 - 340, 960, 960); c.globalAlpha = 1; }
  if (logo) { const h = 120, w = (logo.width / logo.height) * h; c.drawImage(logo, W / 2 - w / 2, 40, w, h); }

  c.textBaseline = 'middle';
  const text = (s, x, y, font, color, align = 'center', dir = 'rtl') => { c.direction = dir; c.font = font; c.fillStyle = color; c.textAlign = align; c.fillText(s, x, y); };
  if (evening) { text(`תחזית ${evening}`, W / 2, 212, `900 58px ${OUT}`, '#ffffff'); text(`מחזור ${round}`, W / 2, 298, `700 30px ${OUT}`, '#9fc3ff'); } else text(`תחזית מחזור ${round}`, W / 2, 226, `900 64px ${OUT}`, '#ffffff');
  c.fillStyle = grad(c, W / 2 - 170, 0, W / 2 + 170, 0, [[0, 'rgba(250,204,21,0)'], [0.5, '#facc15'], [1, 'rgba(250,204,21,0)']]);
  c.fillRect(W / 2 - 170, evening ? 258 : 274, 340, 3);

  // columns, right to left: the name, the forecast, outcomes
  const col = { fc: 400, dir: 82 }, cw = { fc: 280, dir: 270 };
  const head = `800 29px ${OUT}`;
  [['תחזית', col.fc + cw.fc / 2], ['צפי כיוונים', col.dir + cw.dir / 2]].forEach(([s, x]) => text(s, x, TOP - 44, head, '#9fc3ff'));
  text('משתתף', W - PAD - 34, TOP - 44, head, '#9fc3ff', 'right');

  rows.forEach((r, i) => {
    const y = TOP + i * ROW, h = ROW - 16, mid = y + h / 2 + 3;
    slant(c, PAD - 8, y, W - 2 * PAD + 16, h, 12);
    c.fillStyle = grad(c, W, 0, 0, 0, [[0, 'rgba(255,255,255,.17)'], [1, 'rgba(255,255,255,.05)']]);
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,.26)'; c.lineWidth = 2; c.stroke();
    // the name, shrunk if it's long
    let fs = 46; c.font = `800 ${fs}px ${OUT}`;
    while (c.measureText(r.name).width > 250 && fs > 24) c.font = `800 ${--fs}px ${OUT}`;
    text(r.name, W - PAD - 40, mid, `800 ${fs}px ${OUT}`, '#ffffff', 'right');
    // the forecast on a gold plate, its range small under it
    slant(c, col.fc, y + 8, cw.fc, h - 16);
    c.fillStyle = grad(c, 0, y, 0, y + h, [[0, '#fde047'], [1, '#e0a300']]); c.fill();
    text(String(Math.round(r.fc)), col.fc + cw.fc / 2, mid - 14, `800 54px ${NUM}`, '#1a1405', 'center', 'ltr');
    text(`${r.lo}–${r.hi}`, col.fc + cw.fc / 2, mid + 25, `800 25px ${NUM}`, 'rgba(26,20,5,.75)', 'center', 'ltr');
    // expected outcomes
    slant(c, col.dir, y + 8, cw.dir, h - 16);
    c.fillStyle = grad(c, 0, y, 0, y + h, [[0, '#f8fafc'], [1, '#9fb0c6']]); c.fill();
    text(String(Math.round(r.dir)), col.dir + cw.dir / 2, mid, `800 48px ${NUM}`, '#0f172a', 'center', 'ltr');
  });
  if (exact != null) {
    const y = TOP + rows.length * ROW + 22, h = 116, mid = y + h / 2 + 3;
    slant(c, PAD - 8, y, W - 2 * PAD + 16, h, 12);
    c.fillStyle = grad(c, W, 0, 0, 0, [[0, 'rgba(34,197,94,.34)'], [1, 'rgba(0,200,232,.2)']]); c.fill();
    c.strokeStyle = 'rgba(74,222,200,.7)'; c.lineWidth = 2; c.stroke();
    text(evening ? 'צפי פגיעות מדויקות בערב' : 'צפי פגיעות מדויקות של כולם', W - PAD - 40, mid, `800 42px ${OUT}`, '#ffffff', 'right');
    slant(c, 82, y + 9, 190, h - 18);
    c.fillStyle = grad(c, 0, y, 0, y + h, [[0, '#34e0a1'], [1, '#0ea5c6']]); c.fill();
    text(String(exact), 82 + 95, mid, `800 64px ${NUM}`, '#04201d', 'center', 'ltr');
  }
  text('התחזית והטווח בנקודות · צפי כיוונים לכל משתתף', W / 2, H - 46, `600 25px ${OUT}`, 'rgba(255,255,255,.6)');
  return new Promise((ok, no) => cv.toBlob((b) => (b ? ok(b) : no(new Error('התמונה לא נוצרה'))), 'image/png'));
}
