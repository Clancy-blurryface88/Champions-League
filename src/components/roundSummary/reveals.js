// Round summary entries: stadium floodlights + gold dust gathering into the
// participant's round rank, then the stats unfold. Plain DOM (ported from the
// .claude/prototypes/round-summary pages), run into a container element.
// runReveal(el, summary, id) — summary from utils/roundSummary.js.

const CSS = `
.rsx{position:relative;font-family:'Fredoka',sans-serif;color:#e9edf6}
.rsx .n{font-family:'Big Shoulders Stencil Display','Teko',sans-serif;font-weight:800;line-height:1;direction:ltr;unicode-bidi:isolate}
.rsx .lbl{font-size:12px;color:#7d89a6}
.rsx .glass{background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.035));backdrop-filter:blur(14px) saturate(140%);-webkit-backdrop-filter:blur(14px) saturate(140%);border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 8px 24px rgba(0,0,0,.3)}
.rsx .fade{animation:rsxFade .55s cubic-bezier(.22,1,.36,1) both}
@keyframes rsxFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}`;
const injectCss = () => { if (document.getElementById('rsx-css')) return; const s = document.createElement('style'); s.id = 'rsx-css'; s.textContent = CSS; document.head.appendChild(s); };

let S;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const tween = (dur, fn, e = (t) => 1 - Math.pow(1 - t, 3)) => new Promise((res) => { const t0 = performance.now(); const f = (t) => { const k = Math.min(1, (t - t0) / dur); fn(e(k)); k < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
const EZ = 'cubic-bezier(.22,1,.36,1)';
const A = (n, kf, o = {}) => n.animate(kf, { fill: 'forwards', easing: EZ, ...o });
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const f2 = (n) => (Math.round(n * 100) / 100).toFixed(2);
const rankText = () => (S.rank == null ? '–' : String(S.rank));

const base = (el) => {
  el.style.padding = 0;
  el.innerHTML = `<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding:26px 14px;overflow-y:auto">
    <div class="lbl tp" style="font-size:13px;letter-spacing:.2em;opacity:0;text-align:center">${esc(S.round)}${S.me ? ` · ${esc(S.me)}` : ''}</div>
    <div class="slot" style="position:relative;height:212px;width:100%;display:grid;place-items:center;flex:none"></div>
    <div class="lbl bt" style="opacity:0;margin-top:-6px;font-size:14px">המיקום שלך</div>
    <div class="grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;margin-top:20px"></div></div>`;
  return el.querySelector('.slot');
};
const BIG = (css = '') => `<div class="big n" style="font-size:200px;color:#facc15;text-shadow:0 0 60px rgba(250,204,21,.5);${css}">${rankText()}</div>`;
const ov = (el, css, html = '') => { const d = document.createElement('div'); d.style.cssText = `position:absolute;inset:0;z-index:5;${css}`; d.innerHTML = html; el.appendChild(d); return d; };
const shake = (el, k = 4) => el.animate([{ transform: 'none' }, { transform: `translate(${-k}px,${k * .7}px)` }, { transform: `translate(${k * .7}px,${-k * .5}px)` }, { transform: `translate(${-k * .4}px,${k * .3}px)` }, { transform: 'none' }], { duration: 320 });
const cells = () => {
  const c = [['נקודות', f2(S.pts), S.change == null ? '' : `${S.change >= 0 ? '▲' : '▼'} ${Math.abs(S.change).toFixed(1)}% מהמחזור הקודם`]];
  c.push(['פגיעות מדויקות', S.exact, `${S.dir}/${S.dirOf} ניחושי כיוון`]);
  if (S.best) c.push(['המשחק הכי טוב', `+${+(+S.best.pts).toFixed(2)}`, S.best.label]);
  c.push(['ממוצע למשחק', f2(S.avg), `${S.ofMax.toFixed(1)}% מהמקסימום`]);
  if (S.king) c.push(['מלך הפגיעות', S.king.name, `${S.king.n} פגיעות מדויקות`]);
  if (S.common) c.push(['התוצאה הכי שכיחה', S.common.score, `${S.common.n} ניחושים`]);
  c.push(['פגיעות במחזור', S.allExact, `${S.allDir} כיוונים נכונים · כולם`]);
  if (c.length % 2) c.pop();
  return c;
};
const finish = async (el) => {
  if (!el.isConnected) return;
  A(el.querySelector('.tp'), [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'none' }], { duration: 600 });
  A(el.querySelector('.bt'), [{ opacity: 0 }, { opacity: 1 }], { duration: 600, delay: 150 });
  el.querySelector('.grid').innerHTML = cells().map(([l, v, s], k) => `<div class="glass fade" style="border-radius:16px;padding:12px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;animation-delay:${300 + k * 90}ms"><div class="lbl">${esc(l)}</div><div class="n" style="font-size:26px;margin:5px 0">${esc(v)}</div><div style="font-size:10.5px;color:#94a3b8">${esc(s)}</div></div>`).join('');
};

const lights = (el, n = 4) => {
  const o = ov(el, 'background:#000;overflow:hidden', [...Array(n)].map((_, k) => `<i class="fl" style="position:absolute;top:18px;left:${(100 - n * 12) / (n + 1) * (k + 1) + k * 12}%;width:46px;height:30px;border-radius:6px;background:#1f2937;z-index:2"></i>`).join(''));
  return { o, fls: [...o.querySelectorAll('.fl')] };
};
const lightOn = (f) => { f.style.cssText += ';background:#fefce8;box-shadow:0 0 30px 10px rgba(254,249,195,.9),0 60px 120px 40px rgba(254,249,195,.25)'; f.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .2 }, { opacity: 1 }], { duration: 300 }); };
const beam = (o, f, tx = 50, ty = 34, op = .22) => { const r = f.getBoundingClientRect(), R = o.getBoundingClientRect(); const x = r.left - R.left + r.width / 2, y = r.top - R.top + r.height / 2, X = R.width * tx / 100, Y = R.height * ty / 100;
  const len = Math.hypot(X - x, Y - y) * 1.5, ang = Math.atan2(Y - y, X - x) * 180 / Math.PI - 90; const b = document.createElement('i');
  b.style.cssText = `position:absolute;left:${x - 110}px;top:${y}px;width:220px;height:${len}px;transform-origin:50% 0;transform:rotate(${ang}deg);background:linear-gradient(180deg,rgba(254,249,195,${op}),transparent);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%);opacity:0;mix-blend-mode:screen`; o.appendChild(b); A(b, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 }); return b; };
const flood = (o, ms = 1100) => A(o, [{ background: '#000' }, { background: 'rgba(255,255,240,.85)', offset: .25 }, { background: 'rgba(0,0,0,0)' }], { duration: ms });
const dust = async (el, slot, { start, pos, delay = (k) => (k % 7) * .04, dur = 1800, dim = 1, fls = [], lin }) => {
  const W = el.clientWidth, H = el.clientHeight, o = ov(el, 'pointer-events:none;z-index:6', '<canvas></canvas>'), cv = o.firstChild; cv.width = W * 2; cv.height = H * 2; cv.style.cssText = 'width:100%;height:100%'; const c = cv.getContext('2d');
  const er = el.getBoundingClientRect(), sr = slot.getBoundingClientRect(), cx = (sr.left - er.left + sr.width / 2) * 2, cy = (sr.top - er.top + sr.height / 2) * 2;
  const L = fls.map((f) => { const r = f.getBoundingClientRect(); return [(r.left - er.left + r.width / 2) * 2, (r.top - er.top + r.height / 2) * 2]; });
  c.font = "800 400px 'Big Shoulders Stencil Display'"; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(rankText(), cx, cy); const d = c.getImageData(0, 0, cv.width, cv.height).data; c.clearRect(0, 0, cv.width, cv.height);
  const pts = []; for (let y = 0; y < cv.height; y += 7) for (let x = 0; x < cv.width; x += 7) if (d[(y * cv.width + x) * 4 + 3] > 128) { const k = pts.length, [sx, sy] = start(k, cv.width, cv.height, L, x, y, cx, cy); pts.push({ tx: x, ty: y, x: sx, y: sy, cx, cy }); }
  const ds = pts.map((p, k) => delay(k, p)), span = 1 + Math.max(0, ...ds);
  const draw = (e) => { c.clearRect(0, 0, cv.width, cv.height); pts.forEach((p, k) => { const q = Math.min(1, Math.max(0, e * span - ds[k])); const [x, y] = pos ? pos(p, q, k) : [p.x + (p.tx - p.x) * q + Math.sin(q * Math.PI) * 40 * ((k % 2) * 2 - 1), p.y + (p.ty - p.y) * q];
    c.fillStyle = `rgba(250,${190 + (k % 4) * 15},${40 + (k % 3) * 30},${(.5 + q * .5) * dim})`; c.fillRect(x, y, 5, 5); }); };
  await tween(dur, (e) => draw(lin ? e : 1 - Math.pow(1 - e, 3)), (t) => t);
  o.draw = draw; o.cv = cv; o.pts = pts; return o;
};
const solid = async (el, slot, o) => { if (!el.isConnected) return; A(slot.querySelector('.big'), [{ opacity: 0, filter: 'brightness(2.5)' }, { opacity: 1, filter: 'none' }], { duration: 600 }); A(o, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 }); await wait(500); o.remove(); };
const bootstrap = (el) => { const slot = base(el); slot.innerHTML = BIG('opacity:0'); return slot; };

export const REVEALS = [];
const add = (name, desc, hint, run) => REVEALS.push({ name, desc, run });

add('האורות שופכים זהב', 'הזרקורים נדלקים אחד אחרי השני, ומכל זרקור נשפך זרם של אבק זהב שמרכיב את המספר.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(380); if (!el.isConnected) return; lightOn(f); }
  await wait(200); const dz = await dust(el, slot, { fls, dur: 2000, start: (k, W, H, L) => { const [x, y] = L[k % L.length]; return [x + (Math.random() - .5) * 30, y + Math.random() * 20]; } }); if (!el.isConnected) return;
  flood(o); shake(el, 4); await solid(el, slot, dz); o.remove(); finish(el);
});

add('זהב בחושך, ואז האורות', 'בחושך, אבק זהב עמום מתאסף למספר, ואז הזרקורים נדלקים בבת אחת והמספר מבריק.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  const dz = await dust(el, slot, { dur: 2200, dim: .35, start: (k, W, H) => [Math.random() * W, Math.random() * H] }); if (!el.isConnected) return;
  await wait(250); for (const f of fls) { lightOn(f); await wait(110); }
  dz.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(4)' }], { duration: 300, fill: 'forwards' });
  A(o, [{ background: '#000' }, { background: 'rgba(255,255,240,.9)', offset: .3 }, { background: 'rgba(0,0,0,0)' }], { duration: 1200 }); shake(el, 5);
  await wait(200); await solid(el, slot, dz); o.remove(); finish(el);
});

add('הבזק ופיצוץ זהב', 'הזרקורים נדלקים, הבזק לבן, ואבק זהב מכל המסך נשאב לתוך המספר עם מכה.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(330); if (!el.isConnected) return; lightOn(f); }
  await wait(250); A(o, [{ background: '#000' }, { background: 'rgba(255,255,240,.95)', offset: .2 }, { background: 'rgba(0,0,0,.55)' }], { duration: 700 }); await wait(250);
  const dz = await dust(el, slot, { dur: 1500, start: (k, W, H) => { const a = Math.random() * Math.PI * 2, r = Math.max(W, H) * (.5 + Math.random() * .3); return [W / 2 + Math.cos(a) * r, H / 3 + Math.sin(a) * r]; } }); if (!el.isConnected) return;
  shake(el, 7); A(o, [{ background: 'rgba(0,0,0,.55)' }, { background: 'rgba(0,0,0,0)' }], { duration: 700 });
  await solid(el, slot, dz); o.remove(); finish(el);
});

// 1
add('קרני אור וגשם זהב', 'הזרקורים נדלקים וקרני אור נראות יורדות מהם אל מרכז המגרש. אבק הזהב "יורד" בתוך הקרניים כמו גשם עדין ונאסף למספר.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(330); if (!el.isConnected) return; lightOn(f); beam(o, f); }
  await wait(300); const dz = await dust(el, slot, { fls, dur: 2200, delay: (k, p) => p.ty / 2000 + (k % 5) * .03, start: (k, W, H, L, x) => [x + (Math.random() - .5) * 60, -20 - Math.random() * 200], pos: (p, q) => [p.x + (p.tx - p.x) * q, p.y + (p.ty - p.y) * (q * q * (3 - 2 * q))] });
  if (!el.isConnected) return; flood(o); shake(el, 3); await solid(el, slot, dz); o.remove(); finish(el);
});

// 2
add('מערבולת זהב', 'הזרקורים נדלקים משמאל לימין, ואבק הזהב מסתחרר במערבולת סביב מרכז המסך, הולך ומתהדק, עד שהוא ננעל לצורת המספר.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(300); if (!el.isConnected) return; lightOn(f); }
  const dz = await dust(el, slot, { dur: 2400, start: (k, W, H) => [Math.random() * W, Math.random() * H], pos: (p, q, k) => { const a0 = Math.atan2(p.y - p.cy, p.x - p.cx), r0 = Math.hypot(p.x - p.cx, p.y - p.cy), a = a0 + (1 - q) * 5, r = r0 * (1 - q); const sx = p.cx + Math.cos(a) * r, sy = p.cy + Math.sin(a) * r; const m = q * q; return [sx + (p.tx - p.cx) * m, sy + (p.ty - p.cy) * m]; } });
  if (!el.isConnected) return; flood(o); shake(el, 4); await solid(el, slot, dz); o.remove(); finish(el);
});

// 3
add('עולה מהדשא', 'האורות נדלקים מעל מגרש חשוך, ומהדשא בתחתית המסך עולים ניצוצות זהב, מרחפים למעלה ומתחברים למספר.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el); o.insertAdjacentHTML('beforeend', '<i style="position:absolute;left:0;right:0;bottom:0;height:22%;background:repeating-linear-gradient(90deg,#052e16 0 30px,#064e3b 30px 60px);opacity:.7;mask-image:linear-gradient(transparent,#000);-webkit-mask-image:linear-gradient(transparent,#000)"></i>');
  for (const f of fls) { await wait(300); if (!el.isConnected) return; lightOn(f); }
  const dz = await dust(el, slot, { dur: 2300, delay: (k, p) => (1 - p.ty / 1000) * .3 + Math.random() * .3, start: (k, W, H, L, x) => [x + (Math.random() - .5) * 200, H + Math.random() * 100], pos: (p, q, k) => [p.x + (p.tx - p.x) * q + Math.sin(q * 9 + k) * 18 * (1 - q), p.y + (p.ty - p.y) * q] });
  if (!el.isConnected) return; flood(o); await solid(el, slot, dz); o.remove(); finish(el);
});

// 4
add('כל זרקור רבע', 'כל זרקור שנדלק "מצייר" חלק אחר מהמספר: הראשון את הרבע העליון, השני את הבא, וכך הלאה. המספר נבנה בשלבים, אור אחרי אור.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el); await wait(300); if (!el.isConnected) return;
  const band = (p) => Math.max(0, Math.min(3, Math.floor((p.ty - (p.cy - 160)) / 80)));
  const dz = dust(el, slot, { fls, lin: true, dur: 3200, delay: (k, p) => band(p) * .7 + Math.random() * .1, start: (k, W, H, L, x, y, cx, cy) => { const [lx, ly] = L[Math.max(0, Math.min(3, Math.floor((y - (cy - 160)) / 80)))]; return [lx + (Math.random() - .5) * 30, ly + 10]; },
    pos: (p, q, k) => { const e = 1 - Math.pow(1 - q, 3); return [p.x + (p.tx - p.x) * e + Math.sin(e * Math.PI) * 30 * ((k % 2) * 2 - 1), p.y + (p.ty - p.y) * e]; } });
  for (const f of fls) { lightOn(f); await wait(690); if (!el.isConnected) return; }
  const z = await dz; if (!el.isConnected) return; flood(o); shake(el, 3); await solid(el, slot, z); o.remove(); finish(el);
});

// 5
add('פלאשים מהקהל', 'אבק הזהב מתאסף למספר בחושך, הזרקורים נדלקים, ואז מכל עבר מבזיקים פלאשים קטנים של מצלמות מהקהל, כאילו כולם מצלמים אותך.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  const dz = await dust(el, slot, { dur: 1800, dim: .6, start: (k, W, H) => [Math.random() * W, Math.random() * H] }); if (!el.isConnected) return;
  for (const f of fls) { lightOn(f); await wait(120); }
  flood(o, 1400); await solid(el, slot, dz);
  for (let k = 0; k < 26; k++) { const p = document.createElement('i'), s = 4 + Math.random() * 8; p.style.cssText = `position:absolute;z-index:6;left:${Math.random() * 100}%;top:${30 + Math.random() * 65}%;width:${s}px;height:${s}px;border-radius:50%;background:#fff;box-shadow:0 0 12px 4px #fff;pointer-events:none`; el.appendChild(p); p.animate([{ opacity: 0 }, { opacity: 1, offset: .1 }, { opacity: 0 }], { duration: 300, delay: Math.random() * 1500, fill: 'both' }).onfinish = () => p.remove(); }
  o.remove(); finish(el);
});

// 6
add('קרניים מתכנסות', 'ארבע קרני אור חזקות נדלקות מהזרקורים ומתכנסות לנקודה אחת במרכז. בנקודת המפגש נוצר כדור זהב, והוא מתפרק ונפרש לצורת המספר.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(280); if (!el.isConnected) return; lightOn(f); beam(o, f, 50, 34, .4); }
  const core = document.createElement('i'); core.style.cssText = 'position:absolute;left:50%;top:34%;width:30px;height:30px;margin:-15px;border-radius:50%;background:#fde68a;box-shadow:0 0 40px 16px #facc15'; o.appendChild(core);
  A(core, [{ transform: 'scale(0)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 700 }); await wait(700); if (!el.isConnected) return; core.remove();
  const dz = await dust(el, slot, { dur: 1300, delay: () => Math.random() * .2, start: (k, W, H, L, x, y) => { const sr = slot.getBoundingClientRect(), er = el.getBoundingClientRect(); return [(sr.left - er.left + sr.width / 2) * 2, (sr.top - er.top + sr.height / 2) * 2]; }, pos: (p, q) => [p.x + (p.tx - p.x) * q, p.y + (p.ty - p.y) * q] });
  if (!el.isConnected) return; flood(o); shake(el, 5); await solid(el, slot, dz); o.remove(); finish(el);
});

// 7
add('נשימה', 'המספר נבנה מאבק זהב, הזרקורים מהבהבים, והמספר "נושם": מתפזר מעט החוצה ונאסף בחזרה פעמיים, ורק אז מתמצק עם מכת אור.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(260); if (!el.isConnected) return; lightOn(f); }
  const dz = await dust(el, slot, { dur: 1500, start: (k, W, H) => [Math.random() * W, Math.random() * H] }); if (!el.isConnected) return;
  const out = dz.pts.map(() => [(Math.random() - .5) * 120, (Math.random() - .5) * 120]); const c = dz.cv.getContext('2d');
  const at = (s) => { c.clearRect(0, 0, dz.cv.width, dz.cv.height); dz.pts.forEach((p, k) => { c.fillStyle = `rgba(250,${190 + (k % 4) * 15},${40 + (k % 3) * 30},1)`; c.fillRect(p.tx + out[k][0] * s, p.ty + out[k][1] * s, 5, 5); }); };
  for (let b = 0; b < 2; b++) { fls.forEach((f) => f.animate([{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }], { duration: 700 })); await tween(700, (e) => at(Math.sin(e * Math.PI) * (b ? .5 : .35)), (t) => t); if (!el.isConnected) return; }
  flood(o); shake(el, 6); await solid(el, slot, dz); o.remove(); finish(el);
});

// 8
add('זיקוק', 'הזרקורים נדלקים, ומתחתית המסך נורה זיקוק זהב כלפי מעלה. הוא מתפוצץ מעל, והניצוצות נופלים ונוחתים בדיוק לתוך צורת המספר.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  for (const f of fls) { await wait(280); if (!el.isConnected) return; lightOn(f); }
  const rk = document.createElement('i'); rk.style.cssText = 'position:absolute;left:50%;bottom:0;width:6px;height:26px;margin-left:-3px;border-radius:3px;background:linear-gradient(#fde68a,transparent);box-shadow:0 0 12px #facc15'; o.appendChild(rk);
  await A(rk, [{ transform: 'translateY(0)' }, { transform: `translateY(${-el.clientHeight * .9}px)` }], { duration: 700, easing: 'cubic-bezier(.2,.6,.4,1)' }).finished; rk.remove(); if (!el.isConnected) return;
  const top = el.clientHeight * .2; const dz = await dust(el, slot, { dur: 1900, delay: () => Math.random() * .15, start: (k, W) => [W / 2, top], pos: (p, q, k) => { const a = (k * 2.4) % 6.28, burst = Math.sin(Math.min(q * 2, 1) * Math.PI / 2) * 220 * (1 - q); return [p.x + (p.tx - p.x) * q + Math.cos(a) * burst, p.y + (p.ty - p.y) * q * q + Math.sin(a) * burst]; } });
  if (!el.isConnected) return; flood(o); shake(el, 4); await solid(el, slot, dz); o.remove(); finish(el);
});

// 9
add('זריחה', 'הגרסה הרגועה והאלגנטית: הזרקורים מתחממים לאט, מגחלת אדומה ללבן מלא, ובמקביל אבק הזהב מתאסף לאט למספר. בלי מכות, רק אור שעולה.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el);
  fls.forEach((f, k) => A(f, [{ background: '#1f2937', boxShadow: 'none' }, { background: '#7f1d1d', boxShadow: '0 0 12px 2px rgba(239,68,68,.5)', offset: .3 }, { background: '#fbbf24', boxShadow: '0 0 24px 6px rgba(251,191,36,.7)', offset: .65 }, { background: '#fefce8', boxShadow: '0 0 30px 10px rgba(254,249,195,.9),0 60px 120px 40px rgba(254,249,195,.25)' }], { duration: 3000, delay: k * 150, easing: 'ease-in' }));
  A(o, [{ background: '#000' }, { background: 'rgba(0,0,0,.35)' }], { duration: 3200, easing: 'ease-in' });
  const dz = await dust(el, slot, { dur: 3000, start: (k, W, H) => [Math.random() * W, Math.random() * H], dim: .9 }); if (!el.isConnected) return;
  A(o, [{ background: 'rgba(0,0,0,.35)' }, { background: 'rgba(0,0,0,0)' }], { duration: 800 }); await solid(el, slot, dz); o.remove(); finish(el);
});

// 10
add('שני זרמים', 'זרקור אחד בכל צד נדלק, ומכל צד נשפך זרם של אבק זהב לאורך המסך. שני הזרמים נפגשים במרכז, ובמפגש נבנה המספר. ואז כל שאר האורות נדלקים.', '', async (el) => {
  const slot = bootstrap(el), { o, fls } = lights(el); const [a, b, c2, d] = fls;
  lightOn(a); await wait(150); lightOn(d); await wait(300); if (!el.isConnected) return;
  const dz = await dust(el, slot, { dur: 2000, delay: (k, p) => Math.abs(p.tx - p.cx) / 900 * -1 + .4, start: (k, W, H, L, x, y) => [x < 0 ? 0 : (k % 2 ? -30 : W + 30), y + (Math.random() - .5) * 80], pos: (p, q, k) => [p.x + (p.tx - p.x) * q, p.y + (p.ty - p.y) * q + Math.sin(q * 10 + k * .3) * 25 * (1 - q)] });
  if (!el.isConnected) return; lightOn(b); await wait(110); lightOn(c2); flood(o); shake(el, 4); await solid(el, slot, dz); o.remove(); finish(el);
});

const IDS = ['pour', 'dark', 'flash', 'rain', 'vortex', 'grass', 'quarters', 'crowd', 'converge', 'breathe', 'firework', 'sunrise', 'streams'];
REVEALS.forEach((r, i) => { r.id = IDS[i]; });
export const DEFAULT_REVEAL = 'pour';

// Runs one entry into el (sized, position:relative). Returns a stop function.
export function runReveal(el, summary, id = DEFAULT_REVEAL) {
  injectCss();
  el.classList.add('rsx');
  const host = document.createElement('div');
  host.style.cssText = 'position:absolute;inset:0;overflow:hidden';
  el.innerHTML = '';
  el.appendChild(host);
  S = summary;
  (REVEALS.find((r) => r.id === id) || REVEALS[0]).run(host);
  return () => host.remove();
}
