import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Match } from "@/api/entities";
import LiveIntroBoard, { LIVE_INTRO_TIMING, liveIntroDuration } from "@/components/LiveIntroBoard";

// Plays the live-matches intro on made-up matches (real team logos) so it can
// be checked when nothing is live: pick how many matches, edit or shuffle the
// scores, minutes and predictions, and try other timings. The timing sliders
// only affect this preview — the app uses LIVE_INTRO_TIMING.
const rnd = (n) => Math.floor(Math.random() * n);
const randGoals = () => [0, 0, 1, 1, 1, 2, 2, 3, 4][rnd(9)];

const TIMING_CTL = [
  ['minutes', 'ריצת הדקות בכל שורה', 0.3, 2.5, 0.05],
  ['pause', 'הפסקה לפני התוצאה', 0, 1.5, 0.05],
  ['homeAway', 'מרווח בית ← חוץ', 0, 0.8, 0.02],
  ['roll', 'גלגול של ספרה', 0.2, 1.6, 0.05],
  ['rowGap', 'הפסקה בין שורות', 0, 1.2, 0.05],
];

export default function AdminLiveIntroPreview() {
  const [teams, setTeams] = useState([]);
  const [count, setCount] = useState(7);
  const [rows, setRows] = useState([]);
  const [timing, setTiming] = useState(LIVE_INTRO_TIMING);
  const [playing, setPlaying] = useState(0); // run counter; 0 = closed
  const [revealed, setRevealed] = useState(false);

  // every distinct team with a logo, from the matches table
  useEffect(() => {
    Match.list().then((ms) => {
      const seen = new Map();
      ms.forEach((m) => { [[m.team_a, m.team_a_logo], [m.team_b, m.team_b_logo]].forEach(([name, logo]) => { const k = (name || '').trim(); if (k && !seen.has(k)) seen.set(k, logo || null); }); });
      setTeams([...seen].map(([name, logo]) => ({ name, logo })));
    }).catch(() => setTeams([]));
  }, []);

  const shuffle = (n = count) => {
    const pool = [...teams].sort(() => Math.random() - 0.5);
    setRows(Array.from({ length: n }, (_, i) => {
      const ht = Math.random() < 0.25;
      return {
        id: `demo-${i}-${Date.now()}`,
        home: pool[(2 * i) % pool.length] || { name: 'Home' }, away: pool[(2 * i + 1) % pool.length] || { name: 'Away' },
        h: randGoals(), a: randGoals(), ht, minute: ht ? 45 : 1 + rnd(90),
        pred: Math.random() < 0.85 ? { a: randGoals(), b: randGoals() } : null,
      };
    }));
  };
  useEffect(() => { if (teams.length) shuffle(count); }, [teams.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const setCountAndRows = (n) => {
    setCount(n);
    if (n <= rows.length) setRows(rows.slice(0, n));
    else { const keep = rows; shuffle(n); setRows((fresh) => [...keep, ...fresh.slice(keep.length)]); }
  };
  const edit = (i, patch) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  // the shape the board gets from the live API / the predictions lookup
  const apiMatches = rows.map((r) => ({
    id: r.id, status: r.ht ? 'PAUSED' : 'IN_PLAY', minute: r.ht ? 45 : r.minute,
    homeTeam: { name: r.home.name, crest: r.home.logo }, awayTeam: { name: r.away.name, crest: r.away.logo },
    score: { fullTime: { home: r.h, away: r.a } },
  }));
  const predictions = Object.fromEntries(rows.filter((r) => r.pred).map((r) => [r.id, { predicted_score_a: r.pred.a, predicted_score_b: r.pred.b }]));

  const play = () => { setRevealed(false); setPlaying((p) => p + 1); };
  const close = () => setPlaying(0);
  useEffect(() => { if (!playing || !revealed) return; const t = setTimeout(close, 1600); return () => clearTimeout(t); }, [playing, revealed]);

  const num = (v, onChange, w = 44) => (
    <input type="number" min="0" max="9" value={v} onChange={(e) => onChange(Math.max(0, Math.min(9, +e.target.value || 0)))}
      className="bg-slate-900 border border-slate-600 rounded text-center text-white" style={{ width: w, padding: '3px 0' }} />
  );

  return (
    <div className="space-y-5 text-white" dir="rtl">
      <div>
        <h2 className="text-2xl font-bold">תצוגת כניסת לייב</h2>
        <p className="text-slate-400 text-sm mt-1">מריץ את חלון המשחקים החיים על משחקים לדוגמה, כדי לראות איך הוא נראה כשאין משחק אמיתי. אפשר לבחור כמה משחקים, לשנות תוצאות, דקות וניחושים, ולנסות תזמונים אחרים.</p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-300 ml-2">כמה משחקים:</span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button key={n} onClick={() => setCountAndRows(n)}
              className={`w-9 h-9 rounded-lg border text-sm font-bold ${n === count ? 'bg-white text-slate-900 border-white' : 'border-slate-600 text-slate-300'}`}>{n}</button>
          ))}
          <button onClick={() => shuffle(count)} className="mr-auto px-4 h-9 rounded-lg border border-slate-500 text-sm">🔀 ערבב הכול</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400">
              <tr><th className="text-right font-normal py-1">משחק</th><th className="font-normal">תוצאה</th><th className="font-normal">דקה</th><th className="font-normal">HT</th><th className="font-normal">ניחוש</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-t border-slate-700/60">
                  <td className="py-1.5 whitespace-nowrap">{r.home.name} – {r.away.name}</td>
                  <td className="text-center whitespace-nowrap" dir="ltr">{num(r.h, (v) => edit(i, { h: v }))} – {num(r.a, (v) => edit(i, { a: v }))}</td>
                  <td className="text-center">
                    <input type="number" min="1" max="90" value={r.minute} disabled={r.ht} onChange={(e) => edit(i, { minute: Math.max(1, Math.min(90, +e.target.value || 1)) })}
                      className="bg-slate-900 border border-slate-600 rounded text-center text-white disabled:opacity-40" style={{ width: 52, padding: '3px 0' }} />
                  </td>
                  <td className="text-center"><input type="checkbox" checked={r.ht} onChange={(e) => edit(i, { ht: e.target.checked })} /></td>
                  <td className="text-center whitespace-nowrap" dir="ltr">
                    {r.pred
                      ? <>{num(r.pred.a, (v) => edit(i, { pred: { ...r.pred, a: v } }), 38)} – {num(r.pred.b, (v) => edit(i, { pred: { ...r.pred, b: v } }), 38)} <button onClick={() => edit(i, { pred: null })} className="text-slate-400 mx-1">✕</button></>
                      : <button onClick={() => edit(i, { pred: { a: 1, b: 1 } })} className="text-slate-400 text-xs underline">בלי ניחוש · הוסף</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">תזמון (רק לתצוגה הזו)</span>
          <button onClick={() => setTiming(LIVE_INTRO_TIMING)} className="text-xs text-slate-400 underline">חזרה לערכי האפליקציה</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {TIMING_CTL.map(([k, label, mn, mx, st]) => (
            <label key={k} className="block text-sm">
              <div className="flex justify-between text-slate-300"><span>{label}</span><b dir="ltr">{timing[k].toFixed(2)}s</b></div>
              <input type="range" min={mn} max={mx} step={st} value={timing[k]} onChange={(e) => setTiming({ ...timing, [k]: +e.target.value })} className="w-full accent-red-500" />
            </label>
          ))}
        </div>
        <p className="text-slate-400 text-sm mt-3">משך החשיפה עם {count} משחקים: <b className="text-white" dir="ltr">{(liveIntroDuration(count, timing) / 1000).toFixed(1)}s</b>, ועוד 1.6 שניות עד שהחלון נסגר.</p>
      </div>

      <button onClick={play} disabled={!rows.length} className="w-full py-3 rounded-full bg-white text-slate-900 font-bold text-lg disabled:opacity-50">▶ הצג כמו באפליקציה</button>

      <AnimatePresence>
        {playing > 0 && (
          <>
            <motion.div key="bg" className="fixed inset-0 z-[60]" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={close} />
            <div key="board" className="fixed inset-0 z-[61] flex items-center justify-center pointer-events-none">
              <LiveIntroBoard key={playing} matches={apiMatches} predictions={predictions} timing={timing} onDone={() => setRevealed(true)} />
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
