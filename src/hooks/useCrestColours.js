import { useEffect, useState } from 'react';

// A club's two main colours, read from its crest image (cached per image). Colourful pixels count more
// than white / black / grey, so a mostly-white crest still gives its club colour. Until the image is
// read (or if it can't be), a neutral slate pair is returned.
const cache = new Map(); // src -> [primary, secondary] | 'pending'
const subs = new Set();
const FALLBACK = ['#64748b', '#94a3b8'];
const hex = (r, g, b) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

function read(src) {
  if (!src || cache.has(src)) return;
  cache.set(src, 'pending');
  const done = (v) => { cache.set(src, v); subs.forEach((f) => f()); };
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    try {
      const S = 40, c = document.createElement('canvas'); c.width = S; c.height = S;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0, S, S);
      const d = x.getImageData(0, 0, S, S).data, buckets = new Map();
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] < 200) continue;
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const w = 0.35 + (mx ? (mx - mn) / mx : 0);
        const k = `${r >> 5},${g >> 5},${b >> 5}`;
        const o = buckets.get(k) || { n: 0, r: 0, g: 0, b: 0 };
        o.n += w; o.r += r * w; o.g += g * w; o.b += b * w; buckets.set(k, o);
      }
      const list = [...buckets.values()].sort((a, b) => b.n - a.n).map((o) => [o.r / o.n, o.g / o.n, o.b / o.n]);
      const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      const p = list[0];
      if (!p) return done(FALLBACK);
      const s = list.find((q) => dist(q, p) > 90) || [255, 255, 255];
      done([hex(...p), hex(...s)]);
    } catch { done(FALLBACK); }
  };
  img.onerror = () => done(FALLBACK);
  img.src = src;
}

export default function useCrestColours(src) {
  const [, tick] = useState(0);
  useEffect(() => {
    const f = () => tick((t) => t + 1);
    subs.add(f); read(src);
    return () => { subs.delete(f); };
  }, [src]);
  const v = cache.get(src);
  return Array.isArray(v) ? v : FALLBACK;
}
