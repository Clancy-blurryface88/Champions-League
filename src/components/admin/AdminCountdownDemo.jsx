import React from 'react';
import { motion } from 'framer-motion';

// Demo-only: 25 visual treatments for the match-card countdown timer.
// Fixed mock time so all styles are directly comparable side by side.
const T = { d: 2, h: 14, m: 32, s: 7 };
const pad = (n) => String(n).padStart(2, '0');
const BLUE = '9,122,220';

function Frame({ label, children, dark = true }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="rounded-xl border border-white/10 flex items-center justify-center overflow-hidden"
        style={{ height: 110, background: dark ? 'rgba(5,10,18,0.9)' : 'rgba(15,23,42,0.6)' }}
      >
        {children}
      </div>
      <div className="text-[11px] text-slate-400 text-center">{label}</div>
    </div>
  );
}

// 1. Current implementation — glass pills (baseline for comparison)
function StyleGlassPills() {
  return (
    <div className="flex rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)' }}>
      {[[T.s, 'שניות'], [T.m, 'דקות'], [T.h, 'שעות'], [T.d, 'ימים']].map(([v, l], i) => (
        <React.Fragment key={l}>
          <div className="flex flex-col items-center px-3 py-2">
            <span className="font-extrabold text-white text-base leading-none mb-0.5">{v}</span>
            <span className="text-[9px] text-white/45">{l}</span>
          </div>
          {i < 3 && <div style={{ width: 1, background: 'rgba(255,255,255,0.12)' }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// 2. Digital flip clock
function StyleFlipClock() {
  return (
    <div dir="ltr" className="flex gap-1.5">
      {[T.d, T.h, T.m, T.s].map((v, i) => (
        <div key={i} className="w-9 h-12 rounded-md flex items-center justify-center relative" style={{ background: '#111827', boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.5)' }}>
          <div className="absolute inset-x-0 top-1/2 h-px bg-black/60" />
          <span className="text-white font-bold text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>{pad(v)}</span>
        </div>
      ))}
    </div>
  );
}

// 3. Concentric progress rings
function StyleConcentricRings() {
  const rings = [
    { r: 38, pct: T.d / 7, color: `rgba(${BLUE},1)` },
    { r: 30, pct: T.h / 24, color: '#38bdf8' },
    { r: 22, pct: T.m / 60, color: '#a78bfa' },
    { r: 14, pct: T.s / 60, color: '#f97316' },
  ];
  return (
    <svg width="90" height="90" viewBox="0 0 90 90">
      {rings.map((ring, i) => {
        const c = 2 * Math.PI * ring.r;
        return (
          <g key={i} transform="translate(45,45) rotate(-90)">
            <circle r={ring.r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={4} />
            <circle r={ring.r} fill="none" stroke={ring.color} strokeWidth={4} strokeDasharray={c} strokeDashoffset={c * (1 - ring.pct)} strokeLinecap="round" />
          </g>
        );
      })}
    </svg>
  );
}

// 4. Single momentum bar
function StyleMomentumBar() {
  return (
    <div className="w-full px-6">
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full" style={{ width: '68%', background: `linear-gradient(90deg, rgba(${BLUE},1), #f97316)` }} />
      </div>
      <div className="text-center mt-2 text-white text-sm font-semibold">{T.d}d {T.h}h {T.m}m</div>
    </div>
  );
}

// 5. Minimal plain text
function StyleMinimalText() {
  return <span className="text-white/80 text-sm font-medium">נעילה בעוד {T.d} ימים {T.h} שעות</span>;
}

// 6. Pulsing status dot
function StylePulsingDot() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <motion.span animate={{ scale: [1, 1.8], opacity: [0.7, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="absolute inline-flex h-full w-full rounded-full" style={{ background: '#4ade80' }} />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background: '#4ade80' }} />
      </span>
      <span className="text-white text-sm font-semibold">פתוח · נעילה בעוד {T.h}:{pad(T.m)}</span>
    </div>
  );
}

// 7. Scoreboard corner brackets
function StyleCornerBrackets() {
  return (
    <div className="relative px-6 py-3">
      {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((pos, i) => (
        <div key={i} className={`absolute w-3 h-3 ${pos}`} style={{ borderColor: `rgba(${BLUE},1)` }} />
      ))}
      <span dir="ltr" className="text-white font-black text-lg" style={{ fontFamily: "'Orbitron', sans-serif" }}>{pad(T.d)}:{pad(T.h)}:{pad(T.m)}</span>
    </div>
  );
}

// 8. Vertical equalizer bars
function StyleEqualizerBars() {
  const vals = [T.d / 7, T.h / 24, T.m / 60, T.s / 60];
  return (
    <div className="flex items-end gap-2" style={{ height: 60 }}>
      {vals.map((v, i) => (
        <div key={i} className="w-3 rounded-t-sm" style={{ height: `${Math.max(v * 100, 8)}%`, background: `rgba(${BLUE},${0.5 + i * 0.15})` }} />
      ))}
    </div>
  );
}

// 9. Mini analog clock
function StyleAnalogClock() {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <line x1="28" y1="28" x2="28" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${T.h * 30} 28 28)`} />
        <line x1="28" y1="28" x2="40" y2="28" stroke={`rgba(${BLUE},1)`} strokeWidth="2" strokeLinecap="round" transform={`rotate(${T.m * 6} 28 28)`} />
      </svg>
      <span className="text-[10px] text-slate-400">עוד {T.d} ימים</span>
    </div>
  );
}

// 10. LED 7-segment style
function StyleLedSegment() {
  return (
    <div dir="ltr" className="px-3 py-2 rounded-md" style={{ background: '#000' }}>
      <span className="font-bold text-2xl tracking-widest" style={{ fontFamily: "'Orbitron', sans-serif", color: '#ff3b30', textShadow: '0 0 8px rgba(255,59,48,0.8)' }}>
        {pad(T.h)}:{pad(T.m)}:{pad(T.s)}
      </span>
    </div>
  );
}

// 11. Neon glow tubes
function StyleNeonGlow() {
  return (
    <span dir="ltr" className="font-black text-3xl" style={{ fontFamily: "'Orbitron', sans-serif", color: '#fff', textShadow: `0 0 6px rgba(${BLUE},1), 0 0 18px rgba(${BLUE},0.8), 0 0 32px rgba(${BLUE},0.5)` }}>
      {pad(T.h)}:{pad(T.m)}
    </span>
  );
}

// 12. 4th-official added-time board
function StyleFourthOfficial() {
  return (
    <div className="px-5 py-3 rounded-sm" style={{ background: '#0a0a0a', border: '3px solid #1a1a1a' }}>
      <div className="text-[9px] text-slate-400 text-center mb-0.5">נעילה בעוד</div>
      <span dir="ltr" className="font-black text-2xl" style={{ fontFamily: "'Orbitron', sans-serif", color: '#ff2d2d' }}>+{T.h}:{pad(T.m)}</span>
    </div>
  );
}

// 13. Hourglass icon + text
function StyleHourglass() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <motion.span animate={{ rotate: [0, 180] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }} className="text-2xl">⏳</motion.span>
      <span className="text-white text-xs font-semibold">{T.d} ימים {T.h} שעות</span>
    </div>
  );
}

// 14. Single ring, all-in-one percentage
function StyleSingleRing() {
  const pct = 0.42;
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <g transform="translate(45,45) rotate(-90)">
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6} />
          <circle r={r} fill="none" stroke={`rgba(${BLUE},1)`} strokeWidth={6} strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" />
        </g>
      </svg>
      <span className="absolute text-white text-xs font-bold">{T.d}d {T.h}h</span>
    </div>
  );
}

// 15. ECG heartbeat waveform
function StyleHeartbeat() {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="120" height="30" viewBox="0 0 120 30">
        <motion.path
          d="M0 15 H35 L42 4 L50 26 L57 15 H120"
          fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <span className="text-white text-xs font-semibold">{T.h}:{pad(T.m)}:{pad(T.s)}</span>
    </div>
  );
}

// 16. Activity-ring rows with labels
function StyleActivityRows() {
  const rows = [['ימים', T.d, 7], ['שעות', T.h, 24], ['דקות', T.m, 60]];
  return (
    <div className="w-full px-6 space-y-1.5">
      {rows.map(([label, v, max]) => (
        <div key={label} className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 w-8">{label}</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full rounded-full" style={{ width: `${(v / max) * 100}%`, background: `rgba(${BLUE},1)` }} />
          </div>
          <span className="text-[10px] text-white w-4">{v}</span>
        </div>
      ))}
    </div>
  );
}

// 17. Ticker scroll text
function StyleTickerText() {
  return (
    <div className="w-full overflow-hidden">
      <motion.div animate={{ x: ['0%', '-50%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} className="flex whitespace-nowrap text-white text-sm font-semibold">
        <span className="mx-4">⏱ נעילה בעוד {T.d} ימים {T.h}:{pad(T.m)}</span>
        <span className="mx-4">⏱ נעילה בעוד {T.d} ימים {T.h}:{pad(T.m)}</span>
      </motion.div>
    </div>
  );
}

// 18. 3D flip digit
function StyleFlip3D() {
  return (
    <div dir="ltr" className="flex gap-2" style={{ perspective: 200 }}>
      {[T.h, T.m].map((v, i) => (
        <motion.div
          key={i}
          animate={{ rotateX: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          className="w-11 h-14 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <span className="text-white font-black text-xl" style={{ fontFamily: "'Orbitron', sans-serif" }}>{pad(v)}</span>
        </motion.div>
      ))}
    </div>
  );
}

// 19. Terminal / monospace
function StyleTerminal() {
  return (
    <div dir="ltr" className="px-3 py-2 rounded-md" style={{ background: '#000', border: '1px solid #1f2937' }}>
      <span className="font-mono text-sm" style={{ color: '#4ade80' }}>{'>'} LOCKS_IN {pad(T.d)}:{pad(T.h)}:{pad(T.m)}:{pad(T.s)}_</span>
    </div>
  );
}

// 20. Closing lock icon
function StyleClosingLock() {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-3xl">🔓</span>
      <span className="text-white text-xs font-semibold">ננעל בעוד {T.h} שעות</span>
    </div>
  );
}

// 21. Progress dots (days)
function StyleProgressDots() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i < 7 - T.d ? `rgba(${BLUE},1)` : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
      <span className="text-white text-xs font-semibold">{T.d} ימים נותרו</span>
    </div>
  );
}

// 22. Speedometer gauge
function StyleGauge() {
  const pct = 0.42;
  const angle = -90 + pct * 180;
  return (
    <div className="flex flex-col items-center">
      <svg width="90" height="55" viewBox="0 0 90 55">
        <path d="M5 50 A40 40 0 0 1 85 50" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="6" strokeLinecap="round" />
        <path d="M5 50 A40 40 0 0 1 85 50" fill="none" stroke={`rgba(${BLUE},1)`} strokeWidth="6" strokeLinecap="round" strokeDasharray="126" strokeDashoffset={126 * (1 - pct)} />
        <line x1="45" y1="50" x2={45 + 30 * Math.cos((angle * Math.PI) / 180)} y2={50 + 30 * Math.sin((angle * Math.PI) / 180)} stroke="white" strokeWidth="2" />
      </svg>
      <span className="text-white text-xs font-semibold -mt-1">{T.d}d {T.h}h</span>
    </div>
  );
}

// 23. Urgency color-shift big number
function StyleUrgencyColor() {
  const color = T.d > 1 ? '#4ade80' : T.h > 6 ? '#facc15' : '#f87171';
  return (
    <div className="flex flex-col items-center">
      <span className="font-black text-4xl" style={{ color, fontFamily: "'Orbitron', sans-serif" }}>{T.d}</span>
      <span className="text-[10px] text-slate-400">ימים לנעילה</span>
    </div>
  );
}

// 24. Broadcast lower-third style
function StyleBroadcastBar() {
  return (
    <div className="flex items-stretch">
      <div className="px-2 py-1.5 flex items-center" style={{ background: `rgba(${BLUE},1)` }}>
        <span className="text-white text-[10px] font-bold">נעילה</span>
      </div>
      <div className="px-3 py-1.5 flex items-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <span dir="ltr" className="text-white text-sm font-bold" style={{ fontFamily: "'Orbitron', sans-serif" }}>{T.d}d {T.h}h {T.m}m</span>
      </div>
    </div>
  );
}

// 25. Countdown wave bars (audio-visualizer style, animated)
function StyleWaveBars() {
  return (
    <div className="flex items-end gap-1" style={{ height: 40 }}>
      {[8, 20, 30, 16, 26, 12, 22].map((h, i) => (
        <motion.div
          key={i}
          animate={{ height: [h, h + 12, h] }}
          transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }}
          className="w-1.5 rounded-full"
          style={{ background: `rgba(${BLUE},0.9)` }}
        />
      ))}
    </div>
  );
}

const STYLES = [
  ['1. עיגולי זכוכית (קיים)', StyleGlassPills],
  ['2. שעון פליפ דיגיטלי', StyleFlipClock],
  ['3. טבעות מרוכזות', StyleConcentricRings],
  ['4. פס מומנטום', StyleMomentumBar],
  ['5. טקסט מינימלי', StyleMinimalText],
  ['6. נקודת סטטוס פועמת', StylePulsingDot],
  ['7. סוגריים סקורבורד', StyleCornerBrackets],
  ['8. פסי אקולייזר', StyleEqualizerBars],
  ['9. שעון אנלוגי מיני', StyleAnalogClock],
  ['10. LED שבעה מקטעים', StyleLedSegment],
  ['11. זוהר ניאון', StyleNeonGlow],
  ['12. לוח שופט רביעי', StyleFourthOfficial],
  ['13. שעון חול', StyleHourglass],
  ['14. טבעת יחידה', StyleSingleRing],
  ['15. גל דופק (ECG)', StyleHeartbeat],
  ['16. שורות אקטיביטי', StyleActivityRows],
  ['17. טקסט נגלל', StyleTickerText],
  ['18. פליפ תלת-ממד', StyleFlip3D],
  ['19. טרמינל', StyleTerminal],
  ['20. מנעול נסגר', StyleClosingLock],
  ['21. נקודות התקדמות', StyleProgressDots],
  ['22. מד מהירות', StyleGauge],
  ['23. מספר צבע-דחיפות', StyleUrgencyColor],
  ['24. פס שידור תחתון', StyleBroadcastBar],
  ['25. פסי גל אודיו', StyleWaveBars],
];

export default function AdminCountdownDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 25 סגנונות לספירה לאחור בכרטיס המשחק</h2>
        <p className="text-slate-500 text-sm">זמן קבוע לדוגמה: {T.d} ימים {T.h} שעות {T.m} דקות {T.s} שניות. כלי דמו בלבד — לא משפיע על מסך הניחושים.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STYLES.map(([label, Comp]) => (
          <Frame key={label} label={label}>
            <Comp />
          </Frame>
        ))}
      </div>
    </div>
  );
}
