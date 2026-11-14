import React, { useState } from 'react';
import { PitchLineup } from '../predictions/MatchLineups';
import PitchLineupWide from '../predictions/PitchLineupWide';

// Admin preview of the match arena's lineups: load the real UEFA lineup of any match by team
// names (one already played works best — the lineup must be published) and switch between the
// proposed wide layout and the current one. Nothing here touches what users see.

const PRESETS = [['B. Dortmund', 'Real Betis']];

export default function AdminLineupsPreview() {
  const [home, setHome] = useState(PRESETS[0][0]);
  const [away, setAway] = useState(PRESETS[0][1]);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('');
  const [view, setView] = useState('new');

  const load = async () => {
    setStatus('טוען…'); setData(null);
    try {
      const r = await fetch(`/api/uefa-lineups?homeTeam=${encodeURIComponent(home)}&awayTeam=${encodeURIComponent(away)}`);
      const d = await r.json();
      if (d.success && d.lineups) { setData(d.lineups); setStatus(''); } else setStatus('לא נמצא הרכב למשחק הזה (אולי עוד לא פורסם, או ששמות הקבוצות לא תואמים ל־UEFA)');
    } catch (e) { setStatus(`שגיאה: ${e.message}`); }
  };

  return (
    <div dir="rtl" className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="mb-1 text-lg font-bold text-white">👕 תצוגת הרכבים</h2>
        <p className="mb-3 text-sm text-slate-400">טוענים הרכב אמיתי של משחק ומשווים בין הפריסה החדשה (מגרש אחד לרוחב, מאמנים, רשימות) לבין הפריסה של היום.</p>
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-slate-400">קבוצת בית<input value={home} onChange={(e) => setHome(e.target.value)} className="mt-1 block w-40 rounded-md border border-white/15 bg-black/30 px-2 py-1.5 text-sm text-white" /></label>
          <label className="text-xs text-slate-400">קבוצת חוץ<input value={away} onChange={(e) => setAway(e.target.value)} className="mt-1 block w-40 rounded-md border border-white/15 bg-black/30 px-2 py-1.5 text-sm text-white" /></label>
          <button onClick={load} className="rounded-md bg-sky-600 px-4 py-1.5 text-sm font-bold text-white hover:bg-sky-500">טען הרכב</button>
        </div>
        {status && <p className="mt-2 text-sm text-amber-300">{status}</p>}
      </div>

      {data && (
        <>
          <div className="flex justify-center gap-2">{[['new', 'הפריסה החדשה'], ['old', 'כמו היום']].map(([k, l]) => <button key={k} onClick={() => setView(k)} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: view === k ? '#fff' : 'rgba(255,255,255,0.08)', color: view === k ? '#0b1440' : '#e2e8f0' }}>{l}</button>)}</div>
          {/* phone width, as in the arena */}
          <div className="mx-auto max-w-[375px] rounded-2xl border border-white/10 p-3" style={{ background: 'linear-gradient(180deg,#0b1535,#060e1c)' }}>
            <p className="mb-2 text-center text-[10px] font-semibold tracking-wide text-yellow-400">ההרכבים פורסמו</p>
            {view === 'new' ? <PitchLineupWide home={data.homeTeam} away={data.awayTeam} /> : <PitchLineup home={data.homeTeam} away={data.awayTeam} />}
          </div>
        </>
      )}
    </div>
  );
}
