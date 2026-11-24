// The share picture of a round's forecasts (admin): a 1080px table drawn on a canvas — player, forecast with its
// range, expected outcomes, the chance of passing their average — returned as a PNG blob.
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

// rows: [{ name, fc, lo, hi, dir, beat }], already in the order to show
export async function forecastImage({ round, rows }) {
  await Promise.all([`800 60px ${NUM}`, `800 40px ${OUT}`].map((f) => document.fonts.load(f, 'א1').catch(() => {})));
  await document.fonts.ready;
  const [logo, ball] = await Promise.all([loadImg('/champions/ch-logo.png'), loadImg('/champions/round-ball.png')]);
  const H = TOP + rows.length * ROW + 96;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');

  c.fillStyle = grad(c, 0, 0, W * 0.3, H, [[0, '#1a3f9e'], [0.45, '#0b1c4c'], [1, '#040a1e']]);
  c.fillRect(0, 0, W, H);
  if (ball) { c.globalAlpha = 0.07; c.drawImage(ball, W / 2 - 480, H / 2 - 340, 960, 960); c.globalAlpha = 1; }
  if (logo) { const h = 120, w = (logo.width / logo.height) * h; c.drawImage(logo, W / 2 - w / 2, 40, w, h); }

  c.textBaseline = 'middle';
  const text = (s, x, y, font, color, align = 'center', dir = 'rtl') => { c.direction = dir; c.font = font; c.fillStyle = color; c.textAlign = align; c.fillText(s, x, y); };
  text(`תחזית מחזור ${round}`, W / 2, 226, `900 64px ${OUT}`, '#ffffff');
  c.fillStyle = grad(c, W / 2 - 170, 0, W / 2 + 170, 0, [[0, 'rgba(250,204,21,0)'], [0.5, '#facc15'], [1, 'rgba(250,204,21,0)']]);
  c.fillRect(W / 2 - 170, 274, 340, 3);

  // columns, right to left: the name, the forecast, outcomes, the chance
  const col = { name: W - PAD - 300, fc: 516, dir: 318, beat: 78 }, cw = { fc: 210, dir: 180, beat: 222 };
  const head = `800 29px ${OUT}`;
  [['תחזית', col.fc + cw.fc / 2], ['כיוונים', col.dir + cw.dir / 2], ['לעבור ממוצע', col.beat + cw.beat / 2]].forEach(([s, x]) => text(s, x, TOP - 44, head, '#9fc3ff'));
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
    // the chance, as a plate that fills with it
    const bw = cw.beat;
    slant(c, col.beat, y + 8, bw, h - 16);
    c.fillStyle = 'rgba(0,0,0,.38)'; c.fill();
    if (r.beat != null) {
      c.save(); c.clip();
      c.fillStyle = grad(c, col.beat, 0, col.beat + bw, 0, [[0, '#22c55e'], [1, '#00c8e8']]);
      c.beginPath(); const x = col.beat + SK + (bw - SK) * (r.beat / 100);
      c.moveTo(col.beat - SK, y); c.lineTo(x, y); c.lineTo(x - SK, y + h); c.lineTo(col.beat - SK, y + h); c.fill();
      c.restore();
    }
    c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = 8;
    text(r.beat == null ? '—' : `${r.beat}%`, col.beat + bw / 2, mid, `800 48px ${NUM}`, '#ffffff', 'center', 'ltr');
    c.shadowBlur = 0;
  });
  text('התחזית והטווח בנקודות · כמה כיוונים נכונים צפויים · הסיכוי לעבור את הממוצע האישי', W / 2, H - 46, `600 25px ${OUT}`, 'rgba(255,255,255,.6)');
  return new Promise((ok, no) => cv.toBlob((b) => (b ? ok(b) : no(new Error('התמונה לא נוצרה'))), 'image/png'));
}
