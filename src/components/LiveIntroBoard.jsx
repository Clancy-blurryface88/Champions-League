import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import TeamFlag from "@/components/TeamFlag";

// The live-matches intro: glass cards in rows of two (the 7th centred), revealed
// one row at a time — the row's minute notches run and brake to the match
// minute while its score sits at 0–0, then the home digit rolls, then the away
// digit, and only then does the next row start. Seconds, picked in the admin
// prototype; the admin preview tab can try other values.
export const LIVE_INTRO_TIMING = { minutes: 0.75, pause: 0.25, homeAway: 0.26, roll: 0.7, rowGap: 0.15 };
const LEAD_IN_MS = 350; // let the overlay fade in before the first row starts

const rowsOf = (n) => { const rows = []; for (let i = 0; i < n; i += 2) rows.push([i, i + 1].filter((j) => j < n)); return rows; };
const rowMs = (t) => (t.minutes + t.pause + t.homeAway + t.roll) * 1000;
// from the first row starting until the last digit stops (lead-in included)
export const liveIntroDuration = (count, t = LIVE_INTRO_TIMING) => {
  const rows = Math.max(1, Math.ceil(count / 2));
  return LEAD_IN_MS + rows * rowMs(t) + (rows - 1) * t.rowGap * 1000;
};

// Where the match is: the API minute when it has one, else time since kickoff.
// Half-time always sits on the halfway mark.
function matchMinute(m) {
  if (m.status === 'PAUSED') return { value: 45, ht: true };
  let v = m.minute != null ? Number(m.minute) : (m.utcDate ? (Date.now() - new Date(m.utcDate).getTime()) / 60000 : 0);
  if (!(v >= 0)) v = 0;
  return { value: Math.min(Math.floor(v), 90), ht: false };
}
const goals = (v) => Math.min(Math.max(Number(v ?? 0) || 0, 0), 9);
const brake = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -9 * x)); // fast, then a long braking tail

const TICKS = 31; // one every 3', taller each 15' and at 0/45/90
const tickHeight = (min) => (min % 45 === 0 ? 7 : min % 15 === 0 ? 5 : 3);
const TICK_OFF = 'rgba(255,255,255,.2)';

// one rolling digit column (0–9), `value` picks the visible digit
function Digit({ value, ms, instant = false }) {
  return (
    <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', lineHeight: 1 }}>
      <span style={{ display: 'flex', flexDirection: 'column', transform: `translateY(${-value}em)`, transition: instant ? 'none' : `transform ${ms}ms cubic-bezier(.16,1,.3,1)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n} style={{ height: '1em', textAlign: 'center' }}>{n}</span>)}
      </span>
    </span>
  );
}

// stage: 0 waiting (dimmed) · 1 minutes running · 2 minutes stopped (0–0) · 3 home rolled · 4 away rolled · 5 settled
function Tile({ match, prediction, stage, timing, width, centred }) {
  const ticksRef = useRef(null);
  const tensRef = useRef(null), onesRef = useRef(null);
  const [htLabel, setHtLabel] = useState(false);

  // the minute run: notches light up to the minute and the counter rolls with them, braking at the end
  useEffect(() => {
    if (stage !== 1 || !ticksRef.current) return;
    const { value, ht } = matchMinute(match);
    const ticks = [...ticksRef.current.children];
    const dur = timing.minutes * 1000;
    let raf, t0 = null;
    const frame = (now) => {
      if (t0 === null) t0 = now;
      const k = Math.min(1, (now - t0) / dur), v = brake(k) * value;
      let lastOn = -1;
      ticks.forEach((el, j) => { const on = v > 0 && j * 3 <= v; if (on) lastOn = j; el.style.background = on ? '#ef4444' : TICK_OFF; el.style.boxShadow = on ? '0 0 4px rgba(239,68,68,.7)' : 'none'; });
      const n = Math.floor(v);
      if (tensRef.current) tensRef.current.style.transform = `translateY(${-Math.floor(n / 10)}em)`;
      if (onesRef.current) onesRef.current.style.transform = `translateY(${-(n % 10)}em)`;
      if (k < 1) { raf = requestAnimationFrame(frame); return; }
      ticks[lastOn]?.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(2)', boxShadow: '0 0 10px rgba(255,120,120,1)' }, { transform: 'scaleY(1)' }], { duration: 450 });
      if (ht) setHtLabel(true);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps

  const home = stage >= 3 ? goals(match.score?.fullTime?.home) : 0;
  const away = stage >= 4 ? goals(match.score?.fullTime?.away) : 0;
  const lit = stage === 3 || stage === 4;
  const rollMs = timing.roll * 1000;
  const counterCol = (ref) => (
    <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', lineHeight: 1 }}>
      <span ref={ref} style={{ display: 'flex', flexDirection: 'column' }}>{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <span key={n} style={{ height: '1em' }}>{n}</span>)}</span>
    </span>
  );

  return (
    <div style={{
      position: 'relative', width, height: 104, borderRadius: 18, overflow: 'hidden', justifySelf: centred ? 'center' : undefined, gridColumn: centred ? '1 / -1' : undefined,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
      background: 'linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.035))',
      backdropFilter: 'blur(14px) saturate(140%)', WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      border: '1px solid rgba(255,255,255,.14)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,.14), 0 8px 24px rgba(0,0,0,.35)',
      opacity: stage === 0 ? 0.3 : 1, filter: stage === 0 ? 'saturate(.4)' : 'none', transform: lit ? 'scale(1.05)' : 'none',
      transition: 'opacity .45s, filter .45s, transform .45s cubic-bezier(.22,1,.36,1)',
    }}>
      {/* minute notches along the top edge */}
      <div ref={ticksRef} style={{ position: 'absolute', left: 14, right: 14, top: 0, height: 8, direction: 'ltr' }}>
        {Array.from({ length: TICKS }, (_, j) => (
          <span key={j} style={{ position: 'absolute', top: 0, left: `${(j / (TICKS - 1)) * 100}%`, width: 1, height: tickHeight(j * 3), background: TICK_OFF, transformOrigin: 'top', transition: 'background .12s, box-shadow .12s' }} />
        ))}
      </div>
      <div dir="ltr" style={{ display: 'inline-flex', marginTop: 6, font: "600 10px 'Outfit', sans-serif", letterSpacing: '.1em', color: '#7d89a6', height: 10, lineHeight: 1 }}>
        {htLabel ? <span>HT</span> : <>{counterCol(tensRef)}{counterCol(onesRef)}<span>'</span></>}
      </div>
      <div dir="ltr" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <TeamFlag logo={match.homeTeam?.crest} name={match.homeTeam?.name} size={24} animate={false} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Teko', sans-serif", fontWeight: 700, fontSize: 38, lineHeight: 1, color: '#fff' }}>
          <Digit value={home} ms={rollMs} />
          <span style={{ color: 'rgba(255,255,255,.35)', fontSize: 28 }}>–</span>
          <Digit value={away} ms={rollMs} />
        </div>
        <TeamFlag logo={match.awayTeam?.crest} name={match.awayTeam?.name} size={24} animate={false} />
      </div>
      {prediction && (
        <div dir="ltr" style={{ font: "700 13px 'Teko', sans-serif", color: 'rgba(255,255,255,.7)', lineHeight: 1 }}>
          {prediction.predicted_score_a}–{prediction.predicted_score_b}
        </div>
      )}
    </div>
  );
}

export default function LiveIntroBoard({ matches, predictions = {}, timing = LIVE_INTRO_TIMING, onDone }) {
  const [stages, setStages] = useState(() => matches.map(() => 0));
  const doneRef = useRef(onDone); doneRef.current = onDone;
  const key = matches.map((m) => m.id).join(',');

  // the choreography: row after row — minutes, pause, home, away, settle — then the next row
  useEffect(() => {
    setStages(matches.map(() => 0));
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const setRow = (row, s) => setStages((prev) => prev.map((v, i) => (row.includes(i) ? s : v)));
    const t = timing;
    rowsOf(matches.length).forEach((row, r) => {
      const s0 = LEAD_IN_MS + r * (rowMs(t) + t.rowGap * 1000);
      at(s0, () => setRow(row, 1));
      at(s0 + t.minutes * 1000, () => setRow(row, 2));
      at(s0 + (t.minutes + t.pause) * 1000, () => setRow(row, 3));
      at(s0 + (t.minutes + t.pause + t.homeAway) * 1000, () => setRow(row, 4));
      at(s0 + rowMs(t), () => setRow(row, 5));
    });
    at(liveIntroDuration(matches.length, t), () => doneRef.current?.());
    return () => timers.forEach(clearTimeout);
  }, [key, timing]); // eslint-disable-line react-hooks/exhaustive-deps

  const single = matches.length === 1;
  const W = 'min(352px, 92vw)';
  const tileW = single ? 'calc((min(352px, 92vw) - 10px) / 2 + 20px)' : 'calc((min(352px, 92vw) - 10px) / 2)';
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ scale: 0.15, x: '38vw', y: '-42vh', opacity: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } }}
      style={{ width: W, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: "600 11px 'Outfit', sans-serif", letterSpacing: '.22em', color: '#cbd3e6', marginBottom: 16 }}>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        <span>LIVE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: single ? '1fr' : '1fr 1fr', gap: 10, width: '100%', justifyItems: single ? 'center' : undefined }}>
        {matches.map((m, i) => (
          <Tile key={m.id} match={m} prediction={predictions[m.id] || null} stage={stages[i] ?? 0} timing={timing}
            width={tileW} centred={!single && matches.length % 2 === 1 && i === matches.length - 1} />
        ))}
      </div>
    </motion.div>
  );
}
