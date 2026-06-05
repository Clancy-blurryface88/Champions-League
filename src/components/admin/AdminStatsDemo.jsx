import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Star, Target, TrendingUp } from 'lucide-react';

// ── Demo data ──────────────────────────────────────────────
const D = {
  avgMatch: 6.37,
  avgRound: 82.77,
  flagA: '🇪🇸', teamA: 'ספרד',
  flagB: '🇨🇻', teamB: 'כף ורדה',
  score: '4 – 1',
  guess: '4 – 1',
  pts: 21.65,
  date: '15.6.2026',
};

// Animated counter on mount
function CountUp({ to, decimals = 2, duration = 1400 }) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const t0 = performance.now();
    let id;
    function tick(now) {
      const t = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - t, 3);
      setVal(parseFloat((e * to).toFixed(decimals)));
      if (t < 1) id = requestAnimationFrame(tick);
    }
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  return <>{val.toFixed(decimals)}</>;
}

const Label = ({ n, name }) => (
  <div className="mb-3 flex items-center gap-2">
    <span className="text-xs font-black text-slate-500 w-5">{n}</span>
    <span className="text-xs text-slate-400">{name}</span>
  </div>
);

// ─── 1. Stadium Floodlights ───────────────────────────────
// hover → floodlight beams light up, numbers glow gold
function V1() {
  const [lit, setLit] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer relative"
      style={{ background: '#020408' }}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={() => setLit(false)}
    >
      {/* Light beams from top corners */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: lit
          ? 'radial-gradient(ellipse 65% 55% at 15% -5%, rgba(255,245,150,0.22) 0%, transparent 55%), radial-gradient(ellipse 65% 55% at 85% -5%, rgba(255,245,150,0.22) 0%, transparent 55%)'
          : 'radial-gradient(ellipse 45% 35% at 15% -5%, rgba(255,245,150,0.06) 0%, transparent 50%), radial-gradient(ellipse 45% 35% at 85% -5%, rgba(255,245,150,0.06) 0%, transparent 50%)',
        transition: 'background 0.7s ease',
      }} />
      {/* Ground glow */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none" style={{
        background: lit ? 'linear-gradient(to top, rgba(255,245,150,0.07), transparent)' : 'transparent',
        transition: 'background 0.7s',
      }} />
      <div className="relative z-10 p-5 space-y-3">
        <div className="flex gap-3">
          {[{ l: 'AVG / MATCH', v: D.avgMatch }, { l: 'AVG / ROUND', v: D.avgRound }].map(({ l, v }) => (
            <div key={l} className="flex-1 text-center py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] text-white/30 mb-1 tracking-widest">{l}</p>
              <p className="text-3xl font-black" style={{
                color: lit ? '#fde68a' : '#614e2a',
                textShadow: lit ? '0 0 28px rgba(253,230,138,1)' : 'none',
                transition: 'color 0.5s, text-shadow 0.5s',
              }}>
                <CountUp to={v} />
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,245,150,0.07)' }}>
          <p className="text-[9px] text-white/20 tracking-widest mb-2">★ המשחק הכי טוב שלך ★</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">{D.flagA}</span>
            <div>
              <p className="text-lg font-black text-white">{D.score}</p>
              <p className="text-2xl font-black" style={{
                color: lit ? '#fde68a' : '#614e2a',
                textShadow: lit ? '0 0 20px rgba(253,230,138,0.9)' : 'none',
                transition: 'color 0.5s, text-shadow 0.5s',
              }}>
                <CountUp to={D.pts} />
              </p>
            </div>
            <span className="text-3xl">{D.flagB}</span>
          </div>
        </div>
        <p className="text-center text-white/15 text-[9px] tracking-widest">HOVER TO LIGHT UP</p>
      </div>
    </div>
  );
}

// ─── 2. FIFA Match Ticket ─────────────────────────────────
// click → slight lift + shadow; realistic ticket with perforated edge
function V2() {
  const [raised, setRaised] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: '#120800',
        boxShadow: raised ? '0 24px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,140,10,0.3)' : '0 6px 20px rgba(0,0,0,0.5)',
        transform: raised ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s ease',
      }}
      onClick={() => setRaised(r => !r)}
    >
      {/* Header bar */}
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ background: 'linear-gradient(90deg,#a06808,#e0981a,#a06808)' }}>
        <div>
          <p className="text-[8px] text-amber-100/60 tracking-widest font-bold">FIFA WORLD CUP™</p>
          <p className="text-white font-black text-sm leading-tight">2026</p>
        </div>
        <div className="text-right">
          <p className="text-[8px] text-amber-100/60 tracking-widest">GROUP STAGE</p>
          <p className="text-white/90 font-bold text-xs">{D.date}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex">
        {/* Left main section */}
        <div className="flex-1 p-4">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{D.flagA}</span>
              <span className="text-white/50 text-[9px] font-bold">{D.teamA}</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-amber-400">{D.score}</p>
              <p className="text-white/20 text-[8px] tracking-widest">FINAL</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{D.flagB}</span>
              <span className="text-white/50 text-[9px] font-bold">{D.teamB}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[8px] text-white/25 tracking-wide">AVG / MATCH</p>
              <p className="text-amber-400 font-black text-xl"><CountUp to={D.avgMatch} /></p>
            </div>
            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-[8px] text-white/25 tracking-wide">AVG / ROUND</p>
              <p className="text-amber-400 font-black text-xl"><CountUp to={D.avgRound} /></p>
            </div>
          </div>
        </div>

        {/* Perforated divider */}
        <div className="w-px flex flex-col items-center py-3 gap-1.5"
          style={{ borderLeft: '2px dashed rgba(200,140,10,0.2)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#120800', border: '1px solid rgba(200,140,10,0.25)' }} />
          ))}
        </div>

        {/* Right stub */}
        <div className="w-20 flex flex-col items-center justify-center p-3 gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <p className="text-amber-400 font-black text-xl"><CountUp to={D.pts} /></p>
          <p className="text-[8px] text-white/25 text-center">נקודות</p>
          {/* Barcode sim */}
          <div className="flex gap-px mt-1">
            {[2,1,3,1,2,1,3,1,2,1,3].map((w, i) => (
              <div key={i} style={{ width: w, height: 16, background: 'rgba(200,140,10,0.4)', borderRadius: 1 }} />
            ))}
          </div>
          <p className="text-[7px] text-white/15 font-mono">2026WC</p>
        </div>
      </div>
    </div>
  );
}

// ─── 3. Football Pitch Top-Down ───────────────────────────
// stats overlaid on a pitch view; immersive green
function V3() {
  return (
    <div className="rounded-2xl overflow-hidden relative"
      style={{ background: 'linear-gradient(170deg,#1c5c1c,#0e3a0e)', minHeight: 210 }}>
      {/* Pitch markings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Outer pitch border */}
        <div className="absolute" style={{ inset: 10, border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 6 }} />
        {/* Halfway line */}
        <div className="absolute left-8 right-8 h-px" style={{ background: 'rgba(255,255,255,0.15)', top: '50%' }} />
        {/* Center circle */}
        <div className="w-20 h-20 rounded-full" style={{ border: '1.5px solid rgba(255,255,255,0.15)' }} />
        {/* Center dot */}
        <div className="absolute w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }} />
        {/* Goal areas */}
        {['top', 'bottom'].map(pos => (
          <div key={pos} className="absolute left-1/2 -translate-x-1/2 w-20 h-10"
            style={{ [pos]: 10, border: '1.5px solid rgba(255,255,255,0.15)', [`border${pos === 'top' ? 'Top' : 'Bottom'}`]: 'none' }} />
        ))}
      </div>

      {/* Stats overlaid */}
      <div className="relative z-10 p-5 flex flex-col h-full gap-3">
        {/* Top half */}
        <div className="flex gap-3">
          {[{ l: 'ממוצע למשחק', v: D.avgMatch }, { l: 'ממוצע למחזור', v: D.avgRound }].map(({ l, v }) => (
            <div key={l} className="flex-1 text-center py-2 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
              <p className="text-[9px] text-white/40 mb-0.5">{l}</p>
              <p className="text-2xl font-black text-white"><CountUp to={v} /></p>
            </div>
          ))}
        </div>

        {/* Center match card */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="text-3xl">{D.flagA}</span>
            <div className="text-center">
              <p className="text-xl font-black text-white">{D.score}</p>
              <p className="text-amber-400 font-black text-lg"><CountUp to={D.pts} /> נק׳</p>
              <p className="text-white/25 text-[8px]">המשחק הכי טוב</p>
            </div>
            <span className="text-3xl">{D.flagB}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 4. LED Stadium Scoreboard ────────────────────────────
// click → digits scramble then settle back
function V4() {
  const [display, setDisplay] = useState({ m: D.avgMatch.toFixed(2), r: D.avgRound.toFixed(2), p: D.pts.toFixed(2) });
  const [scrambling, setScrambling] = useState(false);

  const scramble = () => {
    if (scrambling) return;
    setScrambling(true);
    let count = 0;
    const iv = setInterval(() => {
      setDisplay({
        m: (Math.random() * 15).toFixed(2),
        r: (Math.random() * 130).toFixed(2),
        p: (Math.random() * 30).toFixed(2),
      });
      count++;
      if (count >= 10) {
        clearInterval(iv);
        setDisplay({ m: D.avgMatch.toFixed(2), r: D.avgRound.toFixed(2), p: D.pts.toFixed(2) });
        setScrambling(false);
      }
    }, 75);
  };

  return (
    <div className="rounded-xl overflow-hidden cursor-pointer select-none" style={{ background: '#000', border: '2px solid #1a1a1a' }} onClick={scramble}>
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between" style={{ background: '#0d0d0d', borderBottom: '1px solid #1a1a1a' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: scrambling ? '#ff2200' : '#661100', boxShadow: scrambling ? '0 0 6px #ff2200' : 'none', transition: 'all 0.2s' }} />
          <span className="font-mono text-[9px] tracking-widest" style={{ color: scrambling ? '#ff4400' : '#441100' }}>
            {scrambling ? 'UPDATING...' : 'LIVE'}
          </span>
        </div>
        <span className="font-mono text-[9px] text-white/15 tracking-widest">FIFA WORLD CUP 2026</span>
        <span className="font-mono text-[9px] text-white/15">{D.date}</span>
      </div>

      {/* Score rows */}
      <div className="p-3 space-y-2 font-mono">
        {[
          { l: 'AVG / MATCH', v: display.m, c: '#ff4500' },
          { l: 'AVG / ROUND', v: display.r, c: '#ff4500' },
        ].map(({ l, v, c }) => (
          <div key={l} className="flex items-center justify-between px-3 py-2 rounded-sm" style={{ background: '#080808', border: '1px solid #1a1a1a' }}>
            <span className="text-[9px] tracking-widest" style={{ color: '#2a1a0a' }}>{l}</span>
            <span className="text-2xl font-black tracking-wider" style={{ color: c, textShadow: scrambling ? `0 0 10px ${c}` : 'none', transition: 'text-shadow 0.2s' }}>{v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-3 py-2 rounded-sm mt-1" style={{ background: '#080808', border: '1px solid #2a2000' }}>
          <div className="flex items-center gap-2">
            <span className="text-[9px] tracking-widest" style={{ color: '#3a2a00' }}>BEST </span>
            <span>{D.flagA}</span>
            <span className="text-[10px]" style={{ color: '#2a2a00' }}>{D.score}</span>
            <span>{D.flagB}</span>
          </div>
          <span className="text-2xl font-black tracking-wider" style={{ color: '#ffd700', textShadow: scrambling ? '0 0 10px #ffd700' : 'none', transition: 'text-shadow 0.2s' }}>{display.p}</span>
        </div>
      </div>
      <p className="text-center font-mono text-[8px] pb-2" style={{ color: scrambling ? '#333' : '#222' }}>
        {scrambling ? '● REFRESHING' : '▶ CLICK TO REFRESH'}
      </p>
    </div>
  );
}

// ─── 5. FIFA Ultimate Team Card ───────────────────────────
// mouse move → 3D tilt + moving shiny spot
function V5() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({ x: (y - 0.5) * 26, y: (0.5 - x) * 26 });
    setShine({ x: x * 100, y: y * 100 });
  };

  return (
    <div style={{ perspective: 700, cursor: 'pointer' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setTilt({ x: 0, y: 0 }); }}>
      <div
        onMouseMove={onMove}
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          background: 'linear-gradient(155deg,#7a5c10,#d4a820,#f5d060,#c9a020,#7a5c10)',
          transform: hover ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.04)` : 'none',
          transition: hover ? 'transform 0.08s' : 'transform 0.6s ease',
          boxShadow: hover ? '0 28px 60px rgba(160,120,0,0.55)' : '0 8px 24px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        {/* Moving shiny highlight */}
        {hover && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
            background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.3) 0%, transparent 55%)`,
            mixBlendMode: 'overlay',
          }} />
        )}

        <div className="p-4">
          {/* Rating header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-5xl font-black leading-none" style={{ color: '#3a2800', textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
                {Math.round(D.pts)}
              </p>
              <p className="text-[9px] font-black tracking-widest" style={{ color: '#3a280080' }}>OVR</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-bold tracking-widest" style={{ color: '#3a280070' }}>WORLD CUP</p>
              <p className="text-[8px] font-bold tracking-widest" style={{ color: '#3a280070' }}>2026 ™</p>
            </div>
          </div>

          {/* Flags + score */}
          <div className="flex items-center justify-center gap-3 my-3 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.12)' }}>
            <span className="text-3xl">{D.flagA}</span>
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: '#3a2800' }}>{D.score}</p>
              <p className="text-[8px]" style={{ color: '#3a280060' }}>ניחוש: {D.guess}</p>
            </div>
            <span className="text-3xl">{D.flagB}</span>
          </div>

          {/* Divider */}
          <div className="h-px my-2" style={{ background: 'rgba(58,40,0,0.25)' }} />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-1 text-center">
            {[{ l: 'M/AVG', v: D.avgMatch }, { l: 'R/AVG', v: D.avgRound }, { l: 'BEST', v: D.pts }].map(({ l, v }) => (
              <div key={l}>
                <p className="text-lg font-black" style={{ color: '#3a2800', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{Math.round(v)}</p>
                <p className="text-[8px] font-black" style={{ color: '#3a280055' }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Trophy Showcase / Spotlight ──────────────────────
// hover → trophy glows, scales up, spotlight widens
function V6() {
  const [glow, setGlow] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer relative"
      style={{ background: '#06040f' }}
      onMouseEnter={() => setGlow(true)}
      onMouseLeave={() => setGlow(false)}
    >
      {/* Radial spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: glow
          ? 'radial-gradient(ellipse 70% 60% at 50% 25%, rgba(245,197,24,0.2) 0%, transparent 65%)'
          : 'radial-gradient(ellipse 40% 35% at 50% 20%, rgba(245,197,24,0.07) 0%, transparent 55%)',
        transition: 'background 0.7s ease',
      }} />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />

      <div className="relative z-10 p-5 flex flex-col items-center">
        {/* Trophy */}
        <div className="text-5xl mb-1" style={{
          filter: glow ? 'drop-shadow(0 0 18px rgba(245,197,24,1))' : 'drop-shadow(0 0 4px rgba(245,197,24,0.3))',
          transform: glow ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 0.5s ease',
        }}>🏆</div>

        <p className="text-[9px] tracking-widest mb-4" style={{ color: 'rgba(245,197,24,0.45)' }}>המשחק הכי טוב שלך</p>

        {/* Match */}
        <div className="flex items-center gap-4 mb-3">
          <span className="text-4xl">{D.flagA}</span>
          <div className="text-center">
            <p className="text-2xl font-black text-white">{D.score}</p>
            <p className="text-white/25 text-[9px]">ניחוש: {D.guess} · {D.date}</p>
          </div>
          <span className="text-4xl">{D.flagB}</span>
        </div>

        <p className="text-5xl font-black mb-0.5" style={{
          color: '#f5c518',
          textShadow: glow ? '0 0 35px rgba(245,197,24,1), 0 0 60px rgba(245,197,24,0.5)' : '0 0 8px rgba(245,197,24,0.35)',
          transition: 'text-shadow 0.6s ease',
        }}>
          <CountUp to={D.pts} />
        </p>
        <p className="text-[10px] mb-5" style={{ color: 'rgba(245,197,24,0.35)' }}>נקודות</p>

        {/* Stat pills */}
        <div className="flex gap-4 w-full pt-3" style={{ borderTop: '1px solid rgba(245,197,24,0.1)' }}>
          {[{ l: 'ממוצע למשחק', v: D.avgMatch }, { l: 'ממוצע למחזור', v: D.avgRound }].map(({ l, v }) => (
            <div key={l} className="flex-1 text-center">
              <p className="text-white/55 font-black text-lg"><CountUp to={v} /></p>
              <p className="text-white/20 text-[9px]">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 7. Live TV Broadcast Graphic ────────────────────────
// blinking LIVE indicator; animated entry feel
function V7() {
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const iv = setInterval(() => setBlink(b => !b), 900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#070c18' }}>
      {/* Network bar */}
      <div className="flex items-center gap-2 px-4 py-2.5"
        style={{ background: 'linear-gradient(90deg,#003399,#0055dd)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full"
            style={{ background: blink ? '#ff1111' : '#771111', boxShadow: blink ? '0 0 7px #ff1111' : 'none', transition: 'all 0.3s' }} />
          <span className="text-white font-black text-[9px] tracking-widest" style={{ opacity: blink ? 1 : 0.3, transition: 'opacity 0.3s' }}>LIVE</span>
        </div>
        <div className="h-3 w-px bg-white/15 mx-1" />
        <span className="text-white/75 text-[9px] tracking-widest font-medium">FIFA WORLD CUP 2026</span>
        <span className="ml-auto text-white/40 text-[9px] font-mono">{D.date}</span>
      </div>

      {/* Match result chip */}
      <div className="mx-4 my-3 flex items-center gap-3 px-4 py-2.5 rounded-xl"
        style={{ background: 'rgba(0,51,153,0.25)', borderLeft: '3px solid #0055dd' }}>
        <span className="text-2xl">{D.flagA}</span>
        <span className="text-white font-black text-lg flex-1 text-center">{D.score}</span>
        <span className="text-2xl">{D.flagB}</span>
      </div>

      {/* Stat lower-thirds */}
      <div className="px-4 pb-4 space-y-1.5">
        {[
          { label: 'ממוצע נקודות למשחק', value: D.avgMatch, c: '#60a5fa' },
          { label: 'ממוצע נקודות למחזור', value: D.avgRound, c: '#4ade80' },
          { label: 'נקודות — המשחק הכי טוב', value: D.pts, c: '#fbbf24' },
        ].map(({ label, value, c }) => (
          <div key={label} className="flex items-center justify-between px-3 py-1.5 rounded"
            style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `2px solid ${c}` }}>
            <span className="text-white/40 text-[10px]">{label}</span>
            <span className="font-black text-xl" style={{ color: c }}><CountUp to={value} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 8. Retro World Cup Poster ────────────────────────────
// press/release tactile feel; bold vintage color palette
function V8() {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{ background: '#e85d20', transform: pressed ? 'scale(0.97)' : 'scale(1)', transition: 'transform 0.12s', boxShadow: pressed ? 'none' : '0 8px 24px rgba(232,93,32,0.4)' }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <div className="p-5">
        {/* Poster header */}
        <div className="text-center pb-3 mb-4" style={{ borderBottom: '3px solid #000' }}>
          <p className="text-black font-black text-[9px] tracking-[0.35em] mb-0.5">FIFA WORLD CUP</p>
          <p className="text-black font-black text-4xl leading-none">2026</p>
          <p className="text-black/40 text-[8px] tracking-widest mt-1">USA · CANADA · MEXICO</p>
        </div>

        {/* Stats blocks */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[{ l: 'AVG / MATCH', v: D.avgMatch }, { l: 'AVG / ROUND', v: D.avgRound }].map(({ l, v }) => (
            <div key={l} className="p-2.5" style={{ background: '#000' }}>
              <p className="text-[8px] text-white/30 tracking-widest mb-0.5">{l}</p>
              <p className="text-2xl font-black text-orange-400">{v}</p>
            </div>
          ))}
        </div>

        {/* Best match block */}
        <div className="p-3" style={{ background: '#000' }}>
          <p className="text-[8px] text-orange-500/60 tracking-widest mb-2">★ BEST MATCH ★</p>
          <div className="flex items-center gap-2">
            <span className="text-3xl">{D.flagA}</span>
            <span className="text-xl font-black text-white">{D.score}</span>
            <span className="text-3xl">{D.flagB}</span>
            <span className="ml-auto text-3xl font-black text-orange-400">{D.pts}</span>
          </div>
          <p className="text-white/20 text-[8px] mt-1">{D.teamA} vs {D.teamB} · {D.date}</p>
        </div>
      </div>
    </div>
  );
}

// ─── 9. Gaming Achievement Unlock ────────────────────────
// click to unlock; XP progress bars animate on mount
function V9() {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <div className="space-y-2 cursor-pointer" onClick={() => setUnlocked(u => !u)}>
      {/* Achievement banner */}
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
        style={{
          background: unlocked ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${unlocked ? 'rgba(16,185,129,0.45)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: unlocked ? '0 0 24px rgba(16,185,129,0.18)' : 'none',
          transition: 'all 0.4s ease',
        }}>
        <div className="text-3xl" style={{ filter: unlocked ? 'drop-shadow(0 0 8px rgba(16,185,129,0.8))' : 'grayscale(1) opacity(0.3)', transition: 'filter 0.4s' }}>🏆</div>
        <div className="flex-1">
          <p className="text-[9px] font-bold tracking-widest" style={{ color: unlocked ? '#34d399' : '#4b5563', transition: 'color 0.4s' }}>
            {unlocked ? 'ACHIEVEMENT UNLOCKED' : 'CLICK TO UNLOCK'}
          </p>
          <p className="text-white font-black text-sm">World Cup Predictor</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: unlocked ? '#fbbf24' : '#374151', transition: 'color 0.4s' }}>
            <CountUp to={D.pts} />
          </p>
          <p className="text-[8px]" style={{ color: unlocked ? '#fbbf2480' : '#37415180' }}>XP</p>
        </div>
      </div>

      {/* XP bars */}
      {[
        { l: 'ממוצע למשחק', v: D.avgMatch, max: 20, c: '#60a5fa' },
        { l: 'ממוצע למחזור', v: D.avgRound, max: 150, c: '#34d399' },
      ].map(({ l, v, max, c }) => (
        <div key={l} className="px-3 py-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex justify-between text-[9px] mb-1.5">
            <span className="text-white/50">{l}</span>
            <span className="font-black" style={{ color: c }}>{v} / {max}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-full rounded-full" style={{
              width: `${(v / max) * 100}%`,
              background: c,
              boxShadow: `0 0 8px ${c}80`,
              transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          </div>
        </div>
      ))}

      {/* Best match chip */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl"
        style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)' }}>
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-white/30">Best Performance · {D.date}</p>
          <p className="text-white text-xs font-bold">{D.flagA} {D.score} {D.flagB}</p>
        </div>
        <span className="text-yellow-400 font-black text-sm flex-shrink-0">{D.pts} XP</span>
      </div>
    </div>
  );
}

// ─── 10. Holographic Premium Card ────────────────────────
// hover → iridescent hue-cycle + foil scanlines + 3D tilt
function V10() {
  const [hue, setHue] = useState(0);
  const [hover, setHover] = useState(false);
  const rafRef = useRef(null);
  const t0Ref = useRef(null);

  useEffect(() => {
    if (hover) {
      t0Ref.current = performance.now();
      const animate = (now) => {
        setHue(((now - t0Ref.current) * 0.12) % 360);
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(rafRef.current);
      setHue(0);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [hover]);

  return (
    <div style={{ perspective: 700, cursor: 'pointer' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div style={{
        borderRadius: 20,
        overflow: 'hidden',
        transform: hover ? 'rotateX(4deg) scale(1.03)' : 'none',
        transition: hover ? 'transform 0.15s' : 'transform 0.5s ease',
        boxShadow: hover
          ? `0 28px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.15), 0 0 40px hsla(${hue},100%,60%,0.2)`
          : '0 8px 28px rgba(0,0,0,0.6)',
        position: 'relative',
      }}>
        {/* Holographic foil overlay */}
        {hover && (
          <>
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
              background: `linear-gradient(${hue}deg, rgba(255,0,100,0.12), rgba(255,200,0,0.12), rgba(0,255,200,0.12), rgba(0,100,255,0.12), rgba(255,0,100,0.12))`,
              mixBlendMode: 'screen',
            }} />
            <div style={{
              position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
              background: `repeating-linear-gradient(${hue * 0.3}deg, transparent, transparent 6px, rgba(255,255,255,0.025) 6px, rgba(255,255,255,0.025) 7px)`,
            }} />
          </>
        )}

        {/* Glass base */}
        <div style={{ position: 'relative', background: 'rgba(6,10,24,0.96)', backdropFilter: 'blur(24px)' }}>
          {/* Top iridescent line */}
          <div style={{
            height: 2.5,
            background: hover
              ? `linear-gradient(90deg, hsl(${hue},100%,65%), hsl(${(hue + 120) % 360},100%,65%), hsl(${(hue + 240) % 360},100%,65%))`
              : 'linear-gradient(90deg,#5a3e00,#f5c518,#f0e070,#f5c518,#5a3e00)',
            transition: hover ? 'none' : 'background 0.6s',
          }} />

          <div className="p-5 space-y-3">
            {/* Stats side by side */}
            <div className="flex gap-3">
              {[{ l: 'ממוצע למשחק', v: D.avgMatch, offset: 0 }, { l: 'ממוצע למחזור', v: D.avgRound, offset: 120 }].map(({ l, v, offset }) => (
                <div key={l} className="flex-1 text-center py-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[9px] text-white/30 mb-1">{l}</p>
                  <p className="text-2xl font-black" style={{
                    color: hover ? `hsl(${(hue + offset) % 360},100%,72%)` : '#f5c518',
                    textShadow: hover ? `0 0 20px hsl(${(hue + offset) % 360},100%,72%)` : '0 0 10px rgba(245,197,24,0.45)',
                    transition: hover ? 'none' : 'all 0.6s',
                  }}>
                    <CountUp to={v} />
                  </p>
                </div>
              ))}
            </div>

            {/* Best match */}
            <div className="py-4 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-[9px] text-white/20 tracking-widest mb-2">✦ המשחק הכי טוב שלך ✦</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-3xl">{D.flagA}</span>
                <span className="text-2xl font-black text-white">{D.score}</span>
                <span className="text-3xl">{D.flagB}</span>
              </div>
              <p className="text-4xl font-black" style={{
                color: hover ? `hsl(${(hue + 60) % 360},100%,72%)` : '#f5c518',
                textShadow: hover ? `0 0 30px hsl(${(hue + 60) % 360},100%,72%)` : '0 0 14px rgba(245,197,24,0.55)',
                transition: hover ? 'none' : 'all 0.6s',
              }}>
                <CountUp to={D.pts} />
              </p>
            </div>
          </div>

          {/* Bottom iridescent line */}
          <div style={{
            height: 1,
            background: hover
              ? `linear-gradient(90deg, hsl(${(hue + 180) % 360},100%,65%), hsl(${(hue + 300) % 360},100%,65%), hsl(${hue},100%,65%))`
              : 'linear-gradient(90deg,transparent,rgba(245,197,24,0.2),transparent)',
            transition: hover ? 'none' : 'background 0.6s',
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Registry ──────────────────────────────────────────────
const VARIANTS = [
  { n: 1,  name: 'Stadium Floodlights — hover to light up',    C: V1  },
  { n: 2,  name: 'FIFA Match Ticket — click to lift',          C: V2  },
  { n: 3,  name: 'Football Pitch — top-down view',             C: V3  },
  { n: 4,  name: 'LED Stadium Scoreboard — click to scramble', C: V4  },
  { n: 5,  name: 'FIFA Ultimate Team Card — 3D tilt',          C: V5  },
  { n: 6,  name: 'Trophy Showcase — hover to glow',            C: V6  },
  { n: 7,  name: 'Live TV Broadcast Graphic',                  C: V7  },
  { n: 8,  name: 'Retro 70s World Cup Poster — press me',      C: V8  },
  { n: 9,  name: 'Gaming Achievement Unlock — click',          C: V9  },
  { n: 10, name: 'Holographic Premium Card — hover for foil',  C: V10 },
];

export default function AdminStatsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">עיצובי סטטיסטיקה — 10 וריאציות</h2>
        <p className="text-slate-400 text-sm">כולן אינטרקטיביות · ממוצע למשחק · ממוצע למחזור · המשחק הכי טוב</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {VARIANTS.map(({ n, name, C }) => (
          <div key={n} className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4">
            <Label n={n} name={name} />
            <C />
          </div>
        ))}
      </div>
    </div>
  );
}
