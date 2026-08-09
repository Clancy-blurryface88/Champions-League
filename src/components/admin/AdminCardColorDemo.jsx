import React from 'react';

// Demo-only shade palettes — pick a favorite combo, then hardcode it into
// the real match card gradient in Predictions.jsx (line ~891).
const BLUES = [
  { name: 'כחול חשמלי', rgb: '30,136,229' },
  { name: 'כחול שמיים', rgb: '56,189,248' },
  { name: 'כחול קלאסי', rgb: '59,130,246' },
  { name: 'אינדיגו', rgb: '99,102,241' },
];
const PURPLES = [
  { name: 'סגול בהיר', rgb: '168,85,247' },
  { name: 'סגול-כחול', rgb: '139,92,246' },
  { name: 'פוקסיה', rgb: '217,70,239' },
  { name: 'סגול כהה', rgb: '126,34,206' },
];
const GREENS = [
  { name: 'ירוק אזמרגד', rgb: '16,185,129' },
  { name: 'ירוק קלאסי', rgb: '34,197,94' },
  { name: 'ירוק אזמרגד כהה', rgb: '5,150,105' },
  { name: 'טורקיז', rgb: '20,184,166' },
];

function buildCombos(setA, labelA, setB, labelB) {
  // 4 matched-index pairs + 4 cross pairs = 8 varied combos per family-pair
  const pairs = [
    [0, 0], [1, 1], [2, 2], [3, 3],
    [0, 2], [1, 3], [2, 0], [3, 1],
  ];
  return pairs.map(([i, j]) => ({
    a: setA[i], b: setB[j], labelA, labelB,
  }));
}

const COMBOS = [
  ...buildCombos(BLUES, 'כחול', PURPLES, 'סגול'),
  ...buildCombos(BLUES, 'כחול', GREENS, 'ירוק'),
  ...buildCombos(PURPLES, 'סגול', GREENS, 'ירוק'),
];

function DemoCard({ combo }) {
  const { a, b, labelA, labelB } = combo;
  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10"
        style={{
          height: 130,
          background: `radial-gradient(ellipse at 15% 20%, rgba(${a.rgb},0.45) 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(${b.rgb},0.35) 0%, transparent 45%), rgba(5,10,18,0.75)`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3">
          <div className="flex items-center gap-2 text-white text-sm font-semibold">
            <span>קבוצה א׳</span>
            <span className="text-white/40">נגד</span>
            <span>קבוצה ב׳</span>
          </div>
          <span className="text-white/50 text-xs">1 : 2</span>
        </div>
      </div>
      <div className="text-[11px] text-slate-400 text-center">
        {labelA} <span className="text-slate-600">({a.name})</span>
        {' + '}
        {labelB} <span className="text-slate-600">({b.name})</span>
      </div>
    </div>
  );
}

export default function AdminCardColorDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — שילובי צבע לכרטיס משחק</h2>
        <p className="text-slate-500 text-sm">24 שילובים של כחול/סגול/ירוק (2 צבעים בכל כרטיס). זה כלי דמו בלבד — לא משפיע על שום מקום אחר באפליקציה.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {COMBOS.map((combo, i) => (
          <DemoCard key={i} combo={combo} />
        ))}
      </div>
    </div>
  );
}
