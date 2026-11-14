import React, { useState } from 'react';
import CardActions, { ARENA_VARIANTS } from '../predictions/CardActions';

// Admin: the match card's bottom bar with the match arena as a third part, in every variant
// still in the running. Each shows as it looks in a card; "הצג בכרטיסים שלי" turns that variant
// on in the real match cards — on this device only (localStorage), nobody else sees it.

const KEY = 'card-arena-preview';
const read = () => { try { const v = localStorage.getItem(KEY); return v === null ? null : Number(v); } catch { return null; } };

export default function AdminCardButtons() {
  const [on, setOn] = useState(read);
  const pick = (i) => {
    try { i === null ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, String(i)); } catch { /* private mode: nothing to keep */ }
    setOn(i);
  };
  return (
    <div dir="rtl" className="space-y-4 text-white">
      <div>
        <h2 className="text-xl font-bold">🏟️ כפתורי כרטיס המשחק</h2>
        <p className="mt-1 text-sm text-slate-400">
          זירת המשחק כחלק שלישי בפס הכפתורים. "הצג בכרטיסים שלי" מפעיל את העיצוב בכרטיסי המשחק האמיתיים, רק במכשיר הזה. משתתפים אחרים לא רואים שינוי.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="rounded-lg bg-white/5 px-3 py-1.5">
            בכרטיסים שלך עכשיו: <b>{on === null ? 'העיצוב הנוכחי (שני כפתורים + זירה נפרדת)' : ARENA_VARIANTS[on]?.[0]}</b>
          </span>
          {on !== null && (
            <button onClick={() => pick(null)} className="rounded-lg border border-white/20 px-3 py-1.5 hover:bg-white/10">חזרה לעיצוב הנוכחי</button>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ARENA_VARIANTS.map((v, i) => {
          const sel = on === i;
          return (
            <div key={v[0]} className="rounded-2xl p-3" style={{ background: 'linear-gradient(135deg,#0d2b52,#050d1c)', border: `1px solid ${sel ? '#facc15' : 'rgba(255,255,255,0.12)'}` }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{v[0]}</span>
                <button
                  onClick={() => pick(sel ? null : i)}
                  className="shrink-0 rounded-lg px-3 py-1 text-xs font-bold"
                  style={sel ? { background: '#facc15', color: '#1a1405' } : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  {sel ? '✓ מוצג בכרטיסים שלי' : 'הצג בכרטיסים שלי'}
                </button>
              </div>
              <CardActions onOdds={() => {}} onPredictions={() => {}} onArena={() => {}} arena={i} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
