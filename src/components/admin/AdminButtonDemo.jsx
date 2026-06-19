import React, { useState } from 'react';

const DEMOS = [
  // ─── Glass & Frosted ───────────────────────────────────────
  { id: 1,  name: 'נוכחי (בסיס)',
    wrap: { background: 'rgba(255,255,255,0.04)' },
    btn:  { color: 'rgba(255,255,255,0.75)', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.14)' } },
  { id: 2,  name: 'Glass כחול',
    wrap: { background: 'rgba(59,130,246,0.12)', backdropFilter: 'blur(12px)' },
    btn:  { color: '#93c5fd', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(59,130,246,0.3)' } },
  { id: 3,  name: 'Glass זהב',
    wrap: { background: 'rgba(250,204,21,0.1)', backdropFilter: 'blur(12px)' },
    btn:  { color: '#fde68a', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(250,204,21,0.3)' } },
  { id: 4,  name: 'Glass ירוק',
    wrap: { background: 'rgba(52,211,153,0.1)', backdropFilter: 'blur(12px)' },
    btn:  { color: '#6ee7b7', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(52,211,153,0.25)' } },
  { id: 5,  name: 'Glass ורוד',
    wrap: { background: 'rgba(236,72,153,0.1)', backdropFilter: 'blur(12px)' },
    btn:  { color: '#f9a8d4', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(236,72,153,0.3)' } },
  { id: 6,  name: 'Ice Crystal',
    wrap: { background: 'rgba(224,242,254,0.08)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(186,230,253,0.2)' },
    btn:  { color: '#bae6fd', fontWeight: 700, fontSize: 12, letterSpacing: 1 },
    div:  { background: 'rgba(186,230,253,0.2)' } },
  { id: 7,  name: 'Dark Smoke',
    wrap: { background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.06)' },
    btn:  { color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.08)' } },
  { id: 8,  name: 'Deep Purple Glass',
    wrap: { background: 'rgba(139,92,246,0.12)', backdropFilter: 'blur(16px)' },
    btn:  { color: '#c4b5fd', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(139,92,246,0.3)' } },

  // ─── Gradient Fill ──────────────────────────────────────────
  { id: 9,  name: 'גרדיאנט כחול-סגול',
    wrap: { background: 'linear-gradient(90deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.25) 100%)' },
    btn:  { color: '#e0e7ff', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.15)' } },
  { id: 10, name: 'גרדיאנט זהב-כתום',
    wrap: { background: 'linear-gradient(90deg, rgba(251,191,36,0.2) 0%, rgba(249,115,22,0.2) 100%)' },
    btn:  { color: '#fcd34d', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(251,191,36,0.3)' } },
  { id: 11, name: 'גרדיאנט ירוק-טורקיז',
    wrap: { background: 'linear-gradient(90deg, rgba(52,211,153,0.2) 0%, rgba(6,182,212,0.2) 100%)' },
    btn:  { color: '#6ee7b7', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(52,211,153,0.3)' } },
  { id: 12, name: 'גרדיאנט ורוד-אדום',
    wrap: { background: 'linear-gradient(90deg, rgba(236,72,153,0.2) 0%, rgba(239,68,68,0.2) 100%)' },
    btn:  { color: '#fda4af', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(236,72,153,0.3)' } },
  { id: 13, name: 'Sunset',
    wrap: { background: 'linear-gradient(90deg, rgba(251,113,133,0.2) 0%, rgba(251,191,36,0.2) 100%)' },
    btn:  { color: '#fde68a', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(251,191,36,0.25)' } },
  { id: 14, name: 'Aurora',
    wrap: { background: 'linear-gradient(90deg, rgba(16,185,129,0.18) 0%, rgba(99,102,241,0.18) 100%)' },
    btn:  { color: '#a5f3fc', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(99,102,241,0.25)' } },
  { id: 15, name: 'Holographic',
    wrap: { background: 'linear-gradient(90deg, rgba(236,72,153,0.15), rgba(59,130,246,0.15), rgba(52,211,153,0.15))' },
    btn:  { color: '#fff', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.2)' } },
  { id: 16, name: 'Midnight',
    wrap: { background: 'linear-gradient(90deg, rgba(30,27,75,0.8) 0%, rgba(15,23,42,0.8) 100%)', borderTop: '1px solid rgba(99,102,241,0.3)' },
    btn:  { color: '#818cf8', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(99,102,241,0.2)' } },

  // ─── Neon / Glow ────────────────────────────────────────────
  { id: 17, name: 'Neon כחול',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(59,130,246,0.5)' },
    btn:  { color: '#60a5fa', fontWeight: 800, fontSize: 12, textShadow: '0 0 10px rgba(59,130,246,0.8)' },
    div:  { background: 'rgba(59,130,246,0.4)' } },
  { id: 18, name: 'Neon ירוק',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(52,211,153,0.5)' },
    btn:  { color: '#34d399', fontWeight: 800, fontSize: 12, textShadow: '0 0 10px rgba(52,211,153,0.9)' },
    div:  { background: 'rgba(52,211,153,0.4)' } },
  { id: 19, name: 'Neon ורוד',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(236,72,153,0.5)' },
    btn:  { color: '#f472b6', fontWeight: 800, fontSize: 12, textShadow: '0 0 10px rgba(236,72,153,0.9)' },
    div:  { background: 'rgba(236,72,153,0.4)' } },
  { id: 20, name: 'Neon זהב',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(250,204,21,0.5)' },
    btn:  { color: '#facc15', fontWeight: 800, fontSize: 12, textShadow: '0 0 12px rgba(250,204,21,0.9)' },
    div:  { background: 'rgba(250,204,21,0.4)' } },
  { id: 21, name: 'Neon סגול',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(139,92,246,0.5)' },
    btn:  { color: '#a78bfa', fontWeight: 800, fontSize: 12, textShadow: '0 0 10px rgba(139,92,246,0.9)' },
    div:  { background: 'rgba(139,92,246,0.4)' } },
  { id: 22, name: 'Neon ציאן',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(6,182,212,0.5)' },
    btn:  { color: '#22d3ee', fontWeight: 800, fontSize: 12, textShadow: '0 0 10px rgba(6,182,212,0.9)' },
    div:  { background: 'rgba(6,182,212,0.4)' } },
  { id: 23, name: 'Neon כתום',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(249,115,22,0.5)' },
    btn:  { color: '#fb923c', fontWeight: 800, fontSize: 12, textShadow: '0 0 10px rgba(249,115,22,0.9)' },
    div:  { background: 'rgba(249,115,22,0.4)' } },
  { id: 24, name: 'Neon לבן',
    wrap: { background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.3)' },
    btn:  { color: '#fff', fontWeight: 800, fontSize: 12, textShadow: '0 0 14px rgba(255,255,255,0.8)' },
    div:  { background: 'rgba(255,255,255,0.3)' } },

  // ─── Outline / Minimal ──────────────────────────────────────
  { id: 25, name: 'Outline לבן',
    wrap: { background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.3)' },
    btn:  { color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.2)' } },
  { id: 26, name: 'Ultra Minimal',
    wrap: { background: 'transparent' },
    btn:  { color: 'rgba(255,255,255,0.4)', fontWeight: 400, fontSize: 11, letterSpacing: 2 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
  { id: 27, name: 'מקווקו',
    wrap: { background: 'transparent', borderTop: '1px dashed rgba(255,255,255,0.25)' },
    btn:  { color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.15)' } },
  { id: 28, name: 'Outline כחול',
    wrap: { background: 'transparent', borderTop: '1px solid rgba(59,130,246,0.5)' },
    btn:  { color: '#93c5fd', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(59,130,246,0.3)' } },
  { id: 29, name: 'Outline זהב',
    wrap: { background: 'transparent', borderTop: '1px solid rgba(250,204,21,0.4)' },
    btn:  { color: '#fde68a', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(250,204,21,0.3)' } },
  { id: 30, name: 'Bold Line Top',
    wrap: { background: 'rgba(255,255,255,0.03)', borderTop: '2px solid rgba(255,255,255,0.5)' },
    btn:  { color: '#fff', fontWeight: 900, fontSize: 12, letterSpacing: 1 },
    div:  { background: 'rgba(255,255,255,0.15)' } },
  { id: 31, name: 'Top Line כחול',
    wrap: { background: 'rgba(15,23,42,0.6)', borderTop: '2px solid #3b82f6' },
    btn:  { color: '#93c5fd', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(59,130,246,0.2)' } },
  { id: 32, name: 'Top Line זהב',
    wrap: { background: 'rgba(15,23,42,0.6)', borderTop: '2px solid #facc15' },
    btn:  { color: '#fde68a', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(250,204,21,0.2)' } },

  // ─── Solid Fill ──────────────────────────────────────────────
  { id: 33, name: 'Solid כחול כהה',
    wrap: { background: 'rgba(30,58,138,0.7)' },
    btn:  { color: '#bfdbfe', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(147,197,253,0.25)' } },
  { id: 34, name: 'Solid סגול כהה',
    wrap: { background: 'rgba(76,29,149,0.7)' },
    btn:  { color: '#ddd6fe', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(167,139,250,0.25)' } },
  { id: 35, name: 'Solid ירוק כהה',
    wrap: { background: 'rgba(6,78,59,0.7)' },
    btn:  { color: '#6ee7b7', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(110,231,183,0.25)' } },
  { id: 36, name: 'Solid אפור-פלדה',
    wrap: { background: 'rgba(30,41,59,0.9)', borderTop: '1px solid rgba(71,85,105,0.5)' },
    btn:  { color: '#94a3b8', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(71,85,105,0.5)' } },
  { id: 37, name: 'Solid שחור',
    wrap: { background: 'rgba(0,0,0,0.85)', borderTop: '1px solid rgba(255,255,255,0.08)' },
    btn:  { color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
  { id: 38, name: 'Solid אדום כהה',
    wrap: { background: 'rgba(127,29,29,0.7)' },
    btn:  { color: '#fca5a5', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(252,165,165,0.25)' } },
  { id: 39, name: 'Solid ינשוף',
    wrap: { background: 'rgba(20,20,35,0.95)', borderTop: '1px solid rgba(139,92,246,0.3)' },
    btn:  { color: '#c4b5fd', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(139,92,246,0.2)' } },
  { id: 40, name: 'Solid ים',
    wrap: { background: 'rgba(7,89,133,0.7)' },
    btn:  { color: '#7dd3fc', fontWeight: 700, fontSize: 12 },
    div:  { background: 'rgba(125,211,252,0.25)' } },

  // ─── Special Effects ─────────────────────────────────────────
  { id: 41, name: 'Split כחול-זהב',
    wrap: {},
    btn1: { background: 'rgba(59,130,246,0.2)', color: '#93c5fd', fontWeight: 800, fontSize: 12 },
    btn2: { background: 'rgba(250,204,21,0.15)', color: '#fde68a', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
  { id: 42, name: 'Split ורוד-סגול',
    wrap: {},
    btn1: { background: 'rgba(236,72,153,0.2)', color: '#f9a8d4', fontWeight: 800, fontSize: 12 },
    btn2: { background: 'rgba(139,92,246,0.2)', color: '#c4b5fd', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
  { id: 43, name: 'Split ירוק-כתום',
    wrap: {},
    btn1: { background: 'rgba(52,211,153,0.18)', color: '#6ee7b7', fontWeight: 800, fontSize: 12 },
    btn2: { background: 'rgba(249,115,22,0.18)', color: '#fdba74', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
  { id: 44, name: 'Pill בתוך בר',
    wrap: { background: 'rgba(15,23,42,0.7)', padding: '6px 0' },
    btn:  { margin: '0 8px', borderRadius: 20, background: 'rgba(59,130,246,0.25)', color: '#93c5fd', fontWeight: 700, fontSize: 11, border: '1px solid rgba(59,130,246,0.4)' },
    div:  { background: 'rgba(59,130,246,0.2)' } },
  { id: 45, name: 'Pill זהב',
    wrap: { background: 'rgba(15,23,42,0.7)', padding: '6px 0' },
    btn:  { margin: '0 8px', borderRadius: 20, background: 'rgba(250,204,21,0.15)', color: '#facc15', fontWeight: 700, fontSize: 11, border: '1px solid rgba(250,204,21,0.35)' },
    div:  { background: 'rgba(250,204,21,0.2)' } },
  { id: 46, name: 'CAPS מרווח',
    wrap: { background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.08)' },
    btn:  { color: 'rgba(255,255,255,0.65)', fontWeight: 700, fontSize: 9, letterSpacing: 3 },
    div:  { background: 'rgba(255,255,255,0.12)' } },
  { id: 47, name: 'Underline בלבד',
    wrap: { background: 'transparent' },
    btn:  { color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 12, borderBottom: '2px solid rgba(59,130,246,0.7)', paddingBottom: 4 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
  { id: 48, name: 'אמוג\'י + טקסט',
    wrap: { background: 'rgba(255,255,255,0.04)' },
    btn:  { color: 'rgba(255,255,255,0.8)', fontWeight: 700, fontSize: 11 },
    div:  { background: 'rgba(255,255,255,0.12)' },
    label1: '🎯 1X2', label2: '💬 ניחושים' },
  { id: 49, name: 'Metallic',
    wrap: { background: 'linear-gradient(180deg,rgba(100,116,139,0.3) 0%,rgba(30,41,59,0.5) 100%)', borderTop: '1px solid rgba(148,163,184,0.3)' },
    btn:  { color: '#cbd5e1', fontWeight: 800, fontSize: 12, letterSpacing: 0.5 },
    div:  { background: 'rgba(148,163,184,0.3)' } },
  { id: 50, name: 'Fire & Ice',
    wrap: {},
    btn1: { background: 'linear-gradient(180deg,rgba(239,68,68,0.25),rgba(249,115,22,0.15))', color: '#fca5a5', fontWeight: 800, fontSize: 12 },
    btn2: { background: 'linear-gradient(180deg,rgba(59,130,246,0.25),rgba(6,182,212,0.15))', color: '#7dd3fc', fontWeight: 800, fontSize: 12 },
    div:  { background: 'rgba(255,255,255,0.1)' } },
];

function DemoCard({ demo, selected, onSelect }) {
  const base = demo.btn || {};
  const s1 = { ...base, ...(demo.btn1 || {}) };
  const s2 = { ...base, ...(demo.btn2 || {}) };

  return (
    <div onClick={() => onSelect(demo.id)} className="cursor-pointer select-none">
      <div className="flex items-center gap-1 mb-1 px-0.5">
        <span className="text-[10px] text-slate-600 font-mono">#{demo.id}</span>
        <span className="text-[11px] text-slate-300 truncate flex-1">{demo.name}</span>
        {selected && <span className="text-[10px] text-yellow-400 font-bold">✓</span>}
      </div>
      <div
        className="flex overflow-hidden rounded-xl"
        style={{
          border: selected ? '1.5px solid rgba(250,204,21,0.7)' : '1px solid rgba(255,255,255,0.07)',
          boxShadow: selected ? '0 0 16px rgba(250,204,21,0.2)' : 'none',
          transition: 'box-shadow 0.2s, border-color 0.2s',
          ...demo.wrap,
        }}
      >
        <div className="flex-1 flex items-center justify-center py-2.5" style={s1}>
          {demo.label1 || '1 X 2'}
        </div>
        <div style={{ width: 1, alignSelf: 'stretch', margin: '5px 0', ...demo.div }} />
        <div className="flex-1 flex items-center justify-center py-2.5" style={s2}>
          {demo.label2 || 'ניחושים'}
        </div>
      </div>
    </div>
  );
}

export default function AdminButtonDemo() {
  const [selected, setSelected] = useState(null);
  const chosen = DEMOS.find(d => d.id === selected);

  return (
    <div className="p-4 space-y-6" dir="rtl">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו עיצוב כפתורים</h2>
        <p className="text-slate-400 text-sm">לחץ על עיצוב כדי לסמן — 50 וריאנטים לכפתורי "1X2" ו"ניחושים"</p>
      </div>

      {/* Large preview of selected */}
      {chosen && (
        <div className="bg-slate-800/40 rounded-2xl p-5 border border-yellow-400/20">
          <p className="text-xs text-yellow-400 font-semibold mb-3 text-right">
            בחירה: #{chosen.id} — {chosen.name}
          </p>
          <div
            className="flex overflow-hidden rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.1)', ...chosen.wrap }}
          >
            {[{ s: { ...(chosen.btn || {}), ...(chosen.btn1 || {}) }, l: chosen.label1 || '1 X 2' },
              { s: { ...(chosen.btn || {}), ...(chosen.btn2 || {}) }, l: chosen.label2 || 'ניחושים' }
            ].map(({ s, l }, i) => (
              <React.Fragment key={i}>
                {i === 1 && (
                  <div style={{ width: 1, alignSelf: 'stretch', margin: '10px 0', ...chosen.div }} />
                )}
                <div className="flex-1 flex items-center justify-center py-4 text-sm" style={s}>
                  {l}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {DEMOS.map(demo => (
          <DemoCard
            key={demo.id}
            demo={demo}
            selected={selected === demo.id}
            onSelect={setSelected}
          />
        ))}
      </div>
    </div>
  );
}
