import React, { useState } from 'react';

const WORD = 'LEADERBOARD';

const effects = [
  {
    id: 1, name: 'Gold Glow',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      color: '#fbbf24',
      textShadow: '0 0 8px #fbbf24, 0 0 20px #f59e0b, 0 0 40px #d97706',
    },
  },
  {
    id: 2, name: 'Neon Blue',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      color: '#38bdf8',
      textShadow: '0 0 6px #38bdf8, 0 0 18px #0ea5e9, 0 0 36px #0369a1, 0 0 60px #0c4a6e',
    },
  },
  {
    id: 3, name: 'Shimmer Sweep',
    className: 'wc-shimmer-text',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(90deg, #94a3b8 0%, #fbbf24 40%, #fff 50%, #fbbf24 60%, #94a3b8 100%)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    },
  },
  {
    id: 4, name: 'Glitch RGB',
    className: 'wc-glitch',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      color: '#fff',
      textShadow: '2px 0 #f43f5e, -2px 0 #38bdf8',
    },
  },
  {
    id: 5, name: 'Fire',
    className: 'wc-fire-text',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(180deg, #fff7ed 0%, #fbbf24 30%, #f97316 60%, #dc2626 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      textShadow: 'none',
      filter: 'drop-shadow(0 0 8px #f97316) drop-shadow(0 0 20px #dc2626)',
    },
  },
  {
    id: 6, name: 'Ice Crystal',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #7dd3fc 40%, #bae6fd 60%, #e0f2fe 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 6px #7dd3fc) drop-shadow(0 0 16px #0ea5e9)',
    },
  },
  {
    id: 7, name: 'Rainbow Slide',
    className: 'wc-rainbow',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(90deg, #f43f5e, #f97316, #fbbf24, #4ade80, #38bdf8, #818cf8, #f43f5e)',
      backgroundSize: '300% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    },
  },
  {
    id: 8, name: 'Deep Space',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.12em',
      color: '#c7d2fe',
      textShadow: '0 0 4px #6366f1, 0 0 16px #4338ca, 0 0 40px #312e81, 0 0 80px #1e1b4b',
    },
  },
  {
    id: 9, name: 'Chrome Metal',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(180deg, #f8fafc 0%, #cbd5e1 25%, #94a3b8 50%, #e2e8f0 75%, #f1f5f9 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8)) drop-shadow(0 0 8px rgba(148,163,184,0.4))',
    },
  },
  {
    id: 10, name: 'Plasma',
    className: 'wc-plasma',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(90deg, #e879f9, #a855f7, #6366f1, #a855f7, #e879f9)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 8px #a855f7) drop-shadow(0 0 20px #7c3aed)',
    },
  },
  {
    id: 11, name: 'Matrix Green',
    style: {
      fontFamily: "'Courier New', monospace", fontSize: 20, letterSpacing: '0.15em',
      color: '#4ade80',
      textShadow: '0 0 4px #4ade80, 0 0 12px #22c55e, 0 0 30px #16a34a',
    },
  },
  {
    id: 12, name: 'Laser Cyan',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.12em',
      color: '#fff',
      textShadow: '0 0 4px #fff, 0 0 10px #67e8f9, 0 0 24px #06b6d4, 0 0 50px #0891b2',
    },
  },
  {
    id: 13, name: 'Retro Wave',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 40%, #a855f7 70%, #6366f1 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 6px #ec4899) drop-shadow(0 0 18px #a855f7)',
    },
  },
  {
    id: 14, name: 'Ember Glow',
    className: 'wc-ember',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      color: '#fdba74',
      textShadow: '0 0 6px #f97316, 0 0 20px #ea580c, 0 0 50px #c2410c66',
    },
  },
  {
    id: 15, name: 'Aurora',
    className: 'wc-aurora',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(90deg, #34d399, #06b6d4, #818cf8, #34d399)',
      backgroundSize: '300% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 8px #34d399)',
    },
  },
  {
    id: 16, name: 'Hologram',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.14em',
      color: 'rgba(103,232,249,0.9)',
      textShadow: '0 0 4px #67e8f9, 2px 2px 0 rgba(167,243,208,0.3), -2px -2px 0 rgba(196,181,253,0.3)',
      border: '1px solid rgba(103,232,249,0.2)',
      padding: '4px 12px',
      borderRadius: 4,
      background: 'rgba(103,232,249,0.05)',
    },
  },
  {
    id: 17, name: 'Gold Foil',
    className: 'wc-foil',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(90deg, #78350f, #fbbf24, #fef3c7, #f59e0b, #92400e, #fbbf24)',
      backgroundSize: '300% auto',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    },
  },
  {
    id: 18, name: 'Electric White',
    className: 'wc-electric',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      color: '#fff',
      textShadow: '0 0 3px #fff, 0 0 10px #fff, 0 0 25px #bfdbfe, 0 0 50px #93c5fd',
    },
  },
  {
    id: 19, name: 'Sunset',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #ec4899 80%, #a855f7 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 6px #f97316)',
    },
  },
  {
    id: 20, name: 'Blueprint',
    style: {
      fontFamily: "'Courier New', monospace", fontSize: 20, letterSpacing: '0.2em',
      color: '#93c5fd',
      textShadow: '0 0 4px #3b82f6',
      borderBottom: '1px solid #3b82f680',
      paddingBottom: 2,
    },
  },
  {
    id: 21, name: 'Volcanic',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(180deg, #fef08a 0%, #f97316 35%, #dc2626 65%, #7f1d1d 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 2px 6px #dc2626) drop-shadow(0 0 20px #f97316aa)',
    },
  },
  {
    id: 22, name: 'Arctic',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #bae6fd 30%, #e0f2fe 60%, #f0f9ff 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 6px #e0f2fe) drop-shadow(0 0 16px #7dd3fc88)',
    },
  },
  {
    id: 23, name: 'Neon Sign',
    className: 'wc-neon-sign',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.12em',
      color: '#fde68a',
      textShadow: '0 0 5px #fde68a, 0 0 15px #fbbf24, 0 0 30px #f59e0b',
    },
  },
  {
    id: 24, name: 'Diamond',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      background: 'linear-gradient(135deg, #fff 0%, #bfdbfe 20%, #fff 40%, #e0e7ff 60%, #fff 80%, #bfdbfe 100%)',
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
      filter: 'drop-shadow(0 0 4px #fff) drop-shadow(0 0 12px #bfdbfe)',
    },
  },
  {
    id: 25, name: 'Shadow Depth',
    style: {
      fontFamily: "'Russo One', sans-serif", fontSize: 22, letterSpacing: '0.1em',
      color: '#fbbf24',
      textShadow: '1px 1px 0 #92400e, 2px 2px 0 #78350f, 3px 3px 0 #451a03, 4px 4px 8px rgba(0,0,0,0.8), 0 0 20px #fbbf2444',
    },
  },
];

export default function AdminTitleEffectDemos() {
  const [chosen, setChosen] = useState(null);

  return (
    <div className="p-6 text-white">
      <style>{`
        @keyframes wc-shimmer { to { background-position: -200% center; } }
        @keyframes wc-rainbow { to { background-position: 300% center; } }
        @keyframes wc-plasma  { to { background-position: -200% center; } }
        @keyframes wc-aurora  { to { background-position: -300% center; } }
        @keyframes wc-foil    { to { background-position: -300% center; } }
        @keyframes wc-glitch  {
          0%,100% { text-shadow: 2px 0 #f43f5e, -2px 0 #38bdf8; }
          25%     { text-shadow: -3px 0 #f43f5e, 3px 0 #38bdf8; clip-path: inset(30% 0 40% 0); }
          50%     { text-shadow: 3px 0 #4ade80, -3px 0 #a855f7; }
          75%     { text-shadow: -2px 0 #fbbf24, 2px 0 #f43f5e; clip-path: inset(60% 0 10% 0); }
        }
        @keyframes wc-fire    {
          0%,100% { filter: drop-shadow(0 0 8px #f97316) drop-shadow(0 0 20px #dc2626); }
          50%     { filter: drop-shadow(0 0 14px #fbbf24) drop-shadow(0 0 30px #f97316); }
        }
        @keyframes wc-ember   {
          0%,100% { text-shadow: 0 0 6px #f97316, 0 0 20px #ea580c; }
          50%     { text-shadow: 0 0 10px #fbbf24, 0 0 28px #f97316, 0 0 50px #ea580c; }
        }
        @keyframes wc-electric {
          0%,100% { text-shadow: 0 0 3px #fff, 0 0 10px #fff, 0 0 25px #bfdbfe; }
          50%     { text-shadow: 0 0 6px #fff, 0 0 18px #fff, 0 0 40px #93c5fd, 0 0 70px #60a5fa; }
        }
        @keyframes wc-neon-flicker {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity: 1; }
          20%,22%,24%,55% { opacity: 0.6; }
        }
        .wc-shimmer-text  { animation: wc-shimmer 2.5s linear infinite; }
        .wc-glitch        { animation: wc-glitch 2.8s steps(1) infinite; }
        .wc-fire-text     { animation: wc-fire 1.8s ease-in-out infinite; }
        .wc-rainbow       { animation: wc-rainbow 3s linear infinite; }
        .wc-plasma        { animation: wc-plasma 2.5s linear infinite; }
        .wc-ember         { animation: wc-ember 2s ease-in-out infinite; }
        .wc-aurora        { animation: wc-aurora 4s linear infinite; }
        .wc-foil          { animation: wc-foil 2s linear infinite; }
        .wc-electric      { animation: wc-electric 1.5s ease-in-out infinite; }
        .wc-neon-sign     { animation: wc-neon-flicker 4s infinite; }
      `}</style>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">אפקטים לכותרת Leaderboard</h2>
          <p className="text-slate-400 text-sm mt-1">לחץ על אפקט שאהבת</p>
        </div>
        {chosen && (
          <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl px-4 py-2 text-sm text-yellow-300">
            בחרת: <strong>#{chosen.id} — {chosen.name}</strong>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {effects.map(e => (
          <div
            key={e.id}
            onClick={() => setChosen(e)}
            className="cursor-pointer rounded-xl p-4 flex flex-col items-center gap-3 transition-all duration-200"
            style={{
              background: chosen?.id === e.id ? 'rgba(251,191,36,0.12)' : 'rgba(15,23,42,0.8)',
              border: chosen?.id === e.id ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: chosen?.id === e.id ? '0 0 16px rgba(251,191,36,0.2)' : 'none',
            }}
          >
            <div className="text-xs text-slate-500 self-start">#{e.id} {e.name}</div>
            <span className={e.className || ''} style={e.style}>{WORD}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
