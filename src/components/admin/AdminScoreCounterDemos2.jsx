import React, { useState, useEffect, useRef } from 'react';
import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

const TARGET = 47.5;
const DUR = 2400;

/* ─── 1. Blur + Zoom in ─── */
function D1({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(16);
  const [scale, setScale] = useState(2.2);
  useEffect(() => {
    setV(0); setBlur(16); setScale(2.2);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(16 * (1 - e));
      setScale(2.2 - 1.2 * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, transform: `scale(${scale.toFixed(2)})`, display: 'inline-block', transformOrigin: 'center' }}>{v.toFixed(2)}</span>;
}

/* ─── 2. Frosted glass lift ─── */
function D2({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(14);
  const [brightness, setBrightness] = useState(2.5);
  useEffect(() => {
    setV(0); setBlur(14); setBrightness(2.5);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2);
      setV(TARGET * e);
      setBlur(14 * (1 - e));
      setBrightness(2.5 - 1.5 * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) brightness(${brightness.toFixed(2)})`, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 3. Depth of field (out→in) ─── */
function D3({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.3);
  useEffect(() => {
    setV(0); setBlur(10); setOpacity(0.3);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = Math.pow(p, 1.6);
      setV(TARGET * e);
      setBlur(10 * (1 - Math.pow(p, 0.8)));
      setOpacity(0.3 + 0.7 * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, opacity, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 4. Morning fog (slow lift) ─── */
function D4({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(18);
  useEffect(() => {
    setV(0); setBlur(18);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / (DUR * 1.3), 1);
      const e = Math.pow(p, 1.5);
      setV(TARGET * e);
      setBlur(18 * (1 - p));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, color: '#bae6fd', display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 5. Ghost materialize ─── */
function D5({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(12);
  const [opacity, setOpacity] = useState(0);
  const [color, setColor] = useState([180, 180, 255]);
  useEffect(() => {
    setV(0); setBlur(12); setOpacity(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(12 * (1 - e));
      setOpacity(e);
      const r = Math.round(180 + (74 - 180) * e);
      const g = Math.round(180 + (222 - 180) * e);
      const b = Math.round(255 + (128 - 255) * e);
      setColor([r, g, b]);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, opacity, color: `rgb(${color[0]},${color[1]},${color[2]})`, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 6. Neon defocus ─── */
function D6({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(14);
  const [glow, setGlow] = useState(30);
  useEffect(() => {
    setV(0); setBlur(14); setGlow(30);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(14 * (1 - e));
      setGlow(30 * (1 - e) + 8 * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, color: '#a78bfa', textShadow: `0 0 ${glow.toFixed(0)}px #7c3aed`, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 7. Smoke dissipate ─── */
function D7({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(10);
  const [spread, setSpread] = useState(0);
  useEffect(() => {
    setV(0); setBlur(10); setSpread(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2);
      setV(TARGET * e);
      setBlur(10 * (1 - Math.pow(p, 0.6)));
      setSpread(p < 0.5 ? p * 4 : (1 - p) * 4);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, letterSpacing: `${spread.toFixed(2)}em`, display: 'inline-block', transition: 'letter-spacing 0.05s' }}>{v.toFixed(2)}</span>;
}

/* ─── 8. Polaroid develop ─── */
function D8({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(8);
  const [sat, setSat] = useState(0);
  const [bright, setBright] = useState(3);
  useEffect(() => {
    setV(0); setBlur(8); setSat(0); setBright(3);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / (DUR * 1.2), 1);
      const e = 1 - Math.pow(1 - p, 2);
      setV(TARGET * e);
      setBlur(8 * (1 - e));
      setSat(e * 1.4);
      setBright(3 - 2 * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) saturate(${sat.toFixed(2)}) brightness(${bright.toFixed(2)})`, display: 'inline-block', color: '#fde68a' }}>{v.toFixed(2)}</span>;
}

/* ─── 9. Aurora blur ─── */
function D9({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(12);
  const [hue, setHue] = useState(0);
  useEffect(() => {
    setV(0); setBlur(12); setHue(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(12 * (1 - e));
      setHue(p * 180);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) hue-rotate(${hue.toFixed(0)}deg)`, color: '#34d399', textShadow: '0 0 12px #34d399', display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 10. Soft landing (falls from top blurry) ─── */
function D10({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(12);
  const [y, setY] = useState(-30);
  useEffect(() => {
    setV(0); setBlur(12); setY(-30);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(12 * (1 - e));
      setY(-30 * (1 - e));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, transform: `translateY(${y.toFixed(1)}px)`, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 11. VHS tracking (horizontal streak) ─── */
function D11({ run }) {
  const [v, setV] = useState(0);
  const [skew, setSkew] = useState(0);
  const [blur, setBlur] = useState(8);
  useEffect(() => {
    setV(0); setSkew(0); setBlur(8);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(8 * (1 - e));
      setSkew(p < 0.9 ? Math.sin(p * 20) * (1 - p) * 8 : 0);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, transform: `skewX(${skew.toFixed(1)}deg)`, display: 'inline-block', color: '#e2e8f0', fontFamily: 'monospace' }}>{v.toFixed(2)}</span>;
}

/* ─── 12. Ink drop ─── */
function D12({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(0);
  const [contrast, setContrast] = useState(10);
  useEffect(() => {
    setV(0); setBlur(0); setContrast(10);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      const wave = p < 0.7 ? Math.sin(p * Math.PI) * 6 : 6 * (1 - (p - 0.7) / 0.3);
      setBlur(wave);
      setContrast(10 - 9 * Math.pow(p, 0.5));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) contrast(${contrast.toFixed(1)})`, display: 'inline-block', color: '#1e293b', WebkitTextStroke: '1px #4ade80', paintOrder: 'stroke fill' }}>{v.toFixed(2)}</span>;
}

/* ─── 13. Thermal heat haze ─── */
function D13({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(0);
  const [wave, setWave] = useState(0);
  useEffect(() => {
    setV(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(p < 0.85 ? Math.sin(p * Math.PI * 6) * (1 - p) * 3 : 0);
      setWave(p < 0.85 ? Math.sin(p * Math.PI * 8) * (1 - p) * 6 : 0);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${Math.abs(blur).toFixed(1)}px)`, transform: `translateY(${wave.toFixed(1)}px)`, display: 'inline-block', color: '#fbbf24' }}>{v.toFixed(2)}</span>;
}

/* ─── 14. Crystal shatter then clear ─── */
function D14({ run }) {
  const [phase, setPhase] = useState('hidden');
  const [blur, setBlur] = useState(0);
  useEffect(() => {
    setPhase('hidden'); setBlur(0);
    const t1 = setTimeout(() => { setPhase('shatter'); setBlur(16); }, DUR * 0.2);
    const t2 = setTimeout(() => setBlur(8), DUR * 0.4);
    const t3 = setTimeout(() => setBlur(3), DUR * 0.6);
    const t4 = setTimeout(() => { setBlur(0); setPhase('clear'); }, DUR * 0.85);
    return () => [t1,t2,t3,t4].forEach(clearTimeout);
  }, [run]);
  return (
    <motion.span
      animate={phase === 'shatter' ? { scale: [1,1.3,0.9,1.1,1], x: [0,3,-3,1,0] } : {}}
      transition={{ duration: 0.4 }}
      style={{ filter: `blur(${blur}px)`, display: 'inline-block', color: phase === 'clear' ? '#e0f2fe' : '#94a3b8', textShadow: phase === 'clear' ? '0 0 8px #7dd3fc' : 'none' }}>
      {phase === 'hidden' ? '??' : TARGET.toFixed(2)}
    </motion.span>
  );
}

/* ─── 15. Lens flare then reveal ─── */
function D15({ run }) {
  const [blur, setBlur] = useState(0);
  const [bright, setBright] = useState(1);
  const [v, setV] = useState(0);
  useEffect(() => {
    setBlur(0); setBright(1); setV(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      if (p < 0.45) { setBright(1 + p * 2 * 8); setBlur(p * 2 * 16); }
      else { setBright(Math.max(1, 9 - (p - 0.45) / 0.55 * 8)); setBlur(Math.max(0, 16 - (p - 0.45) / 0.55 * 16)); }
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) brightness(${bright.toFixed(1)})`, display: 'inline-block', color: '#fde68a' }}>{v.toFixed(2)}</span>;
}

/* ─── 16. Water ripple distort ─── */
function D16({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(8);
  const [scaleX, setScaleX] = useState(1);
  useEffect(() => {
    setV(0); setBlur(8); setScaleX(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(8 * (1 - e));
      setScaleX(1 + Math.sin(p * Math.PI * 5) * (1 - p) * 0.15);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, transform: `scaleX(${scaleX.toFixed(3)})`, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 17. Double exposure merge ─── */
function D17({ run }) {
  const [v, setV] = useState(0);
  const [offset, setOffset] = useState(12);
  const [blur, setBlur] = useState(8);
  const [opacity2, setOpacity2] = useState(1);
  useEffect(() => {
    setV(0); setOffset(12); setBlur(8); setOpacity2(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setOffset(12 * (1 - e));
      setBlur(8 * (1 - e));
      setOpacity2(1 - e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ filter: `blur(${blur.toFixed(1)}px)`, color: '#4ade80' }}>{v.toFixed(2)}</span>
      <span style={{ position: 'absolute', left: `${offset.toFixed(1)}px`, top: 0, opacity: opacity2, filter: `blur(${(blur * 0.6).toFixed(1)}px)`, color: '#fbbf24' }}>{v.toFixed(2)}</span>
    </span>
  );
}

/* ─── 18. Telescope focus (outside→in) ─── */
function D18({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(20);
  const [vignette, setVignette] = useState(1);
  useEffect(() => {
    setV(0); setBlur(20); setVignette(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(TARGET * e);
      setBlur(20 * (1 - e));
      setVignette(1 - e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ filter: `blur(${blur.toFixed(1)}px)`, color: '#e2e8f0' }}>{v.toFixed(2)}</span>
      {vignette > 0.05 && (
        <span style={{ position: 'absolute', inset: -8, borderRadius: '50%', boxShadow: `inset 0 0 ${(vignette * 20).toFixed(0)}px rgba(0,0,0,${vignette.toFixed(2)})`, pointerEvents: 'none' }} />
      )}
    </span>
  );
}

/* ─── 19. Film grain clear ─── */
function D19({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(4);
  const [contrast, setContrast] = useState(3);
  const [noise, setNoise] = useState(1);
  useEffect(() => {
    setV(0); setBlur(4); setContrast(3); setNoise(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(4 * (1 - e) + (p < 0.9 ? Math.random() * 0.5 : 0));
      setContrast(3 - 2 * e);
      setNoise(1 - e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) contrast(${contrast.toFixed(1)}) grayscale(${noise.toFixed(2)})`, display: 'inline-block', color: '#4ade80' }}>{v.toFixed(2)}</span>;
}

/* ─── 20. Radial zoom blur ─── */
function D20({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(0);
  const [scale, setScale] = useState(0.3);
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setV(0); setBlur(0); setScale(0.3); setOpacity(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setScale(0.3 + 0.7 * e);
      setOpacity(e);
      setBlur(p < 0.6 ? (0.6 - p) / 0.6 * 12 : 0);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, transform: `scale(${scale.toFixed(2)})`, opacity, display: 'inline-block' }}>{v.toFixed(2)}</span>;
}

/* ─── 21. Grayscale → color ─── */
function D21({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(10);
  const [gray, setGray] = useState(1);
  useEffect(() => {
    setV(0); setBlur(10); setGray(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(10 * (1 - e));
      setGray(1 - e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) grayscale(${gray.toFixed(2)}) saturate(${(1 + gray).toFixed(2)})`, display: 'inline-block', color: '#4ade80' }}>{v.toFixed(2)}</span>;
}

/* ─── 22. Inverted then normalize ─── */
function D22({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(6);
  const [invert, setInvert] = useState(1);
  useEffect(() => {
    setV(0); setBlur(6); setInvert(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(6 * (1 - e));
      setInvert(1 - e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) invert(${invert.toFixed(2)})`, display: 'inline-block', color: '#4ade80' }}>{v.toFixed(2)}</span>;
}

/* ─── 23. Sepia develop ─── */
function D23({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(10);
  const [sepia, setSepia] = useState(1);
  useEffect(() => {
    setV(0); setBlur(10); setSepia(1);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / (DUR * 1.2), 1);
      const e = 1 - Math.pow(1 - p, 2);
      setV(TARGET * e);
      setBlur(10 * (1 - e));
      setSepia(1 - e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) sepia(${sepia.toFixed(2)})`, display: 'inline-block', color: '#fbbf24' }}>{v.toFixed(2)}</span>;
}

/* ─── 24. Blur pulse (in-out-in) ─── */
function D24({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(0);
  useEffect(() => {
    setV(0); setBlur(0);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      const pulses = 3;
      const wave = Math.max(0, Math.sin(p * Math.PI * pulses) * (1 - p) * 10);
      setBlur(wave);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px)`, display: 'inline-block', color: '#a78bfa', textShadow: `0 0 ${(blur * 2).toFixed(0)}px #7c3aed` }}>{v.toFixed(2)}</span>;
}

/* ─── 25. Gold shimmer unblur ─── */
function D25({ run }) {
  const [v, setV] = useState(0);
  const [blur, setBlur] = useState(12);
  const [bright, setBright] = useState(0.5);
  useEffect(() => {
    setV(0); setBlur(12); setBright(0.5);
    const start = performance.now();
    const raf = t => {
      const p = Math.min((t - start) / DUR, 1);
      const e = 1 - Math.pow(1 - p, 2.5);
      setV(TARGET * e);
      setBlur(12 * (1 - e));
      setBright(0.5 + 1.5 * e);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [run]);
  return <span style={{ filter: `blur(${blur.toFixed(1)}px) brightness(${bright.toFixed(2)})`, display: 'inline-block', color: '#fbbf24', textShadow: `0 0 ${(blur * 1.5).toFixed(0)}px #f59e0b` }}>{v.toFixed(2)}</span>;
}

const DEMOS = [
  { id: 1,  name: 'Blur + Zoom In',       C: D1  },
  { id: 2,  name: 'Frosted Glass Lift',   C: D2  },
  { id: 3,  name: 'Depth of Field',       C: D3  },
  { id: 4,  name: 'Morning Fog',          C: D4  },
  { id: 5,  name: 'Ghost Materialize',    C: D5  },
  { id: 6,  name: 'Neon Defocus',         C: D6  },
  { id: 7,  name: 'Smoke Dissipate',      C: D7  },
  { id: 8,  name: 'Polaroid Develop',     C: D8  },
  { id: 9,  name: 'Aurora Blur',          C: D9  },
  { id: 10, name: 'Soft Landing',         C: D10 },
  { id: 11, name: 'VHS Tracking',         C: D11 },
  { id: 12, name: 'Ink Drop',             C: D12 },
  { id: 13, name: 'Thermal Haze',         C: D13 },
  { id: 14, name: 'Crystal Shatter',      C: D14 },
  { id: 15, name: 'Lens Flare Reveal',    C: D15 },
  { id: 16, name: 'Water Ripple',         C: D16 },
  { id: 17, name: 'Double Exposure',      C: D17 },
  { id: 18, name: 'Telescope Focus',      C: D18 },
  { id: 19, name: 'Film Grain Clear',     C: D19 },
  { id: 20, name: 'Radial Zoom Blur',     C: D20 },
  { id: 21, name: 'Grayscale → Color',    C: D21 },
  { id: 22, name: 'Invert → Normal',      C: D22 },
  { id: 23, name: 'Sepia Develop',        C: D23 },
  { id: 24, name: 'Blur Pulse',           C: D24 },
  { id: 25, name: 'Gold Shimmer Unblur',  C: D25 },
];

export default function AdminScoreCounterDemos2() {
  const [runKeys, setRunKeys] = useState(() => Object.fromEntries(DEMOS.map(d => [d.id, 0])));
  const [chosen, setChosen] = useState(null);

  const replay = (id) => setRunKeys(k => ({ ...k, [id]: k[id] + 1 }));
  const replayAll = () => setRunKeys(k => Object.fromEntries(Object.entries(k).map(([id, v]) => [id, v + 1])));

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">25 אפקטי טשטוש וחשיפה</h2>
          <p className="text-slate-400 text-sm mt-1">לחץ על קלף לבחירה • ▶ להפעלה מחדש</p>
        </div>
        <div className="flex items-center gap-3">
          {chosen && (
            <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-3 py-1.5 text-sm text-yellow-300">
              בחרת: <strong>#{chosen.id} — {chosen.name}</strong>
            </div>
          )}
          <button onClick={replayAll} className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
            ▶ הפעל הכל
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {DEMOS.map(({ id, name, C }) => (
          <div
            key={id}
            onClick={() => setChosen({ id, name })}
            className="rounded-xl p-4 cursor-pointer transition-all duration-200 relative"
            style={{
              background: chosen?.id === id ? 'rgba(251,191,36,0.10)' : 'rgba(15,23,42,0.85)',
              border: chosen?.id === id ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: chosen?.id === id ? '0 0 14px rgba(251,191,36,0.18)' : 'none',
            }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500">#{id} {name}</span>
              <button
                onClick={e => { e.stopPropagation(); replay(id); }}
                className="text-xs text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 px-2 py-0.5 rounded transition-colors">
                ▶
              </button>
            </div>
            <div className="flex items-center justify-center py-2">
              <span style={{ fontSize: 26, fontWeight: 800, color: '#4ade80', fontFamily: "'Outfit', sans-serif" }}>
                <C run={runKeys[id]} />
              </span>
              <span style={{ fontSize: 13, color: '#64748b', marginLeft: 4, marginTop: 4 }}>Pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
