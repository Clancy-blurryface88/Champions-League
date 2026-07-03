import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ──────────────────────────────────────────────────────────────────────────
   25 concept redesigns for the Dashboard hero (home screen).
   Each is a compact, self-contained live preview — pure inline styles so it
   renders identically regardless of the app's real CSS/theme.
   ────────────────────────────────────────────────────────────────────────── */

const F = { fontFamily: "'Russo One', system-ui, sans-serif" };

const Chip = ({ children, c = '#FFD700', style }) => (
  <span style={{ background: c, color: '#000', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 5, letterSpacing: 0.5, ...style }}>
    {children}
  </span>
);

const Glass = ({ children, style }) => (
  <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, ...style }}>
    {children}
  </div>
);

const Center = ({ children, style }) => (
  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', ...style }}>{children}</div>
);

/* ── 25 preview renderers ─────────────────────────────────────────────── */

const P1 = () => ( // Stadium Lights
  <>
    <div style={{ position: 'absolute', top: 0, left: '-15%', width: '65%', height: '100%', background: 'linear-gradient(115deg, rgba(255,215,0,0.20), transparent 60%)' }} />
    <div style={{ position: 'absolute', top: 0, right: '-15%', width: '65%', height: '100%', background: 'linear-gradient(245deg, rgba(255,215,0,0.20), transparent 60%)' }} />
    <div style={{ position: 'absolute', top: 10, left: 0, right: 0, textAlign: 'center', color: '#FFD700', fontSize: 9, fontWeight: 900, letterSpacing: 3 }}>WORLD CUP 2026</div>
    <Center><span style={{ fontSize: 44, filter: 'drop-shadow(0 0 22px rgba(255,215,0,0.85))' }}>🏆</span></Center>
    <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 9 }}>ליל המשחק הגדול</div>
  </>
);

const P2 = () => ( // Global Route Map
  <>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.14, backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '14px 14px' }} />
    <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
      <path d="M45,150 Q140,45 250,120" stroke="#2dd4bf" strokeWidth="2" fill="none" strokeDasharray="4 6" />
    </svg>
    <div style={{ position: 'absolute', left: 24, bottom: 34, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🇨🇦</div><Chip c="#2dd4bf">CA</Chip></div>
    <div style={{ position: 'absolute', left: '46%', top: 30, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🇺🇸</div><Chip c="#2dd4bf">US</Chip></div>
    <div style={{ position: 'absolute', right: 24, bottom: 46, textAlign: 'center' }}><div style={{ fontSize: 20 }}>🇲🇽</div><Chip c="#2dd4bf">MX</Chip></div>
    <div style={{ position: 'absolute', top: 12, left: 0, right: 0, textAlign: 'center', color: '#2dd4bf', fontWeight: 900, fontSize: 11 }}>3 מדינות מארחות</div>
  </>
);

const P3 = () => ( // Match Ticket / Boarding Pass
  <div style={{ position: 'absolute', inset: '14px 16px', background: '#0d1626', border: '1px dashed rgba(255,215,0,0.4)', borderRadius: 10, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
    <div style={{ flex: 1, padding: '0 12px' }}>
      <div style={{ color: '#FFD700', fontSize: 9, fontWeight: 900, letterSpacing: 2 }}>BOARDING · WC26</div>
      <div style={{ color: '#fff', fontSize: 15, fontWeight: 900, marginTop: 4 }}>המסלול שלי</div>
      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, marginTop: 2 }}>SEAT · שער החיזויים</div>
    </div>
    <div style={{ width: 1, alignSelf: 'stretch', borderRight: '1px dashed rgba(255,255,255,0.25)' }} />
    <div style={{ writingMode: 'vertical-rl', padding: '10px 8px', color: '#FFD700', fontSize: 9, fontWeight: 900, letterSpacing: 2 }}>2026</div>
  </div>
);

const P4 = () => ( // Broadcast Graphics
  <>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: 46, background: '#FFD700', clipPath: 'polygon(0 0,100% 0,88% 100%,0 100%)' }} />
    <div style={{ position: 'absolute', top: 6, left: 14, color: '#000', fontWeight: 900, fontSize: 13, ...F }}>WORLD CUP</div>
    <div style={{ position: 'absolute', top: 50, left: 14, color: '#fff', fontSize: 9, letterSpacing: 2, opacity: 0.6 }}>LIVE · הבית</div>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' }}>
      <Chip c="#ef4444">LIVE</Chip>
      <span style={{ color: '#fff', fontSize: 9 }}>ברזיל 2 - 1 ארגנטינה · 78'</span>
    </div>
  </>
);

const P5 = () => ( // Jersey Wall
  <div style={{ position: 'absolute', inset: 12, display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6 }}>
    {['#facc15', '#3b82f6', '#22c55e', '#ef4444', '#111827', '#06b6d4', '#f97316', '#a855f7', '#14b8a6', '#e11d48', '#eab308', '#0ea5e9'].map((c, i) => (
      <div key={i} style={{ background: c, borderRadius: 5, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>👕</div>
    ))}
  </div>
);

const P6 = () => ( // Confetti Trophy Lift
  <>
    {Array.from({ length: 22 }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, width: 4, height: 8, background: ['#FFD700', '#4ade80', '#60a5fa', '#f87171'][i % 4], transform: `rotate(${(i * 47) % 360}deg)`, opacity: 0.8 }} />
    ))}
    <Center><span style={{ fontSize: 40 }}>🏆</span><div style={{ color: '#FFD700', fontWeight: 900, fontSize: 11, marginTop: 4, letterSpacing: 1 }}>אלופי החיזוי!</div></Center>
  </>
);

const P7 = () => ( // Retro '70s Poster
  <>
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 30%, #f4a340 0%, #e8622c 45%, #7a2e2e 100%)' }} />
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', top: '30%', left: '50%', width: 3, height: 90, background: 'rgba(255,238,204,0.35)', transformOrigin: 'top', transform: `rotate(${i * 30}deg)` }} />
    ))}
    <Center style={{ top: 6 }}><div style={{ color: '#fff3d6', fontSize: 22, fontWeight: 900, fontFamily: 'Georgia, serif' }}>MUNDIAL</div><div style={{ color: '#fff3d6', fontSize: 11, letterSpacing: 4 }}>1970 · 2026</div></Center>
  </>
);

const P8 = () => ( // Neon Esports HUD
  <>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(217,70,239,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(217,70,239,0.15) 1px,transparent 1px)', backgroundSize: '18px 18px' }} />
    <Center><div style={{ color: '#fff', fontSize: 20, fontWeight: 900, textShadow: '0 0 12px #d946ef, 0 0 24px #22d3ee' }}>WC//26</div><div style={{ color: '#22d3ee', fontSize: 9, letterSpacing: 3, marginTop: 2 }}>PREDICTION.EXE</div></Center>
    <div style={{ position: 'absolute', top: 8, right: 10, color: '#22d3ee', fontSize: 8 }}>█▌ ONLINE</div>
  </>
);

const P9 = () => ( // Mono Minimal
  <Center>
    <div style={{ color: '#fff', fontSize: 30, fontWeight: 900, letterSpacing: -1 }}>2026</div>
    <div style={{ width: 30, height: 2, background: '#fff', margin: '8px 0' }} />
    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: 3 }}>WORLD CUP</div>
  </Center>
);

const P10 = () => ( // Bento Grid Dashboard
  <div style={{ position: 'absolute', inset: 12, display: 'grid', gridTemplateColumns: '1.3fr 1fr', gridTemplateRows: '1fr 1fr', gap: 6 }}>
    <Glass style={{ gridRow: '1 / 3', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><span style={{ fontSize: 22 }}>🏆</span><span style={{ color: '#FFD700', fontSize: 9, fontWeight: 900 }}>מחזור 6</span></Glass>
    <Glass style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><span style={{ color: '#4ade80', fontWeight: 900, fontSize: 15 }}>#3</span><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8 }}>דירוג</span></Glass>
    <Glass style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><span style={{ color: '#fff', fontWeight: 900, fontSize: 15 }}>128</span><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 8 }}>נק'</span></Glass>
  </div>
);

const P11 = () => { // Countdown Hero
  return (
    <>
      <div style={{ position: 'absolute', top: 10, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 9, letterSpacing: 2 }}>עד לפתיחת הטורניר</div>
      <Center>
        <div style={{ display: 'flex', gap: 8 }}>
          {[['12', 'ימים'], ['08', 'שעות'], ['41', 'דק']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.4)', borderRadius: 8, padding: '6px 9px', color: '#FFD700', fontWeight: 900, fontSize: 16 }}>{v}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
      </Center>
    </>
  );
};

const P12 = () => ( // Aerial Stadium
  <>
    <div style={{ position: 'absolute', inset: 18, border: '2px solid rgba(74,222,128,0.5)', borderRadius: '50% / 30%' }} />
    <div style={{ position: 'absolute', top: '50%', left: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, border: '1px solid rgba(74,222,128,0.5)', borderRadius: '50%' }} />
    <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(74,222,128,0.5)' }} />
    <Center><span style={{ fontSize: 26 }}>🏟️</span></Center>
  </>
);

const P13 = () => { // Flag Mosaic
  const flags = ['🇧🇷', '🇦🇷', '🇫🇷', '🇩🇪', '🇪🇸', '🇮🇹', '🇬🇧', '🇵🇹', '🇲🇦', '🇯🇵', '🇰🇷', '🇺🇸', '🇲🇽', '🇨🇦', '🇳🇱', '🇭🇷'];
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', opacity: 0.35 }}>
        {flags.concat(flags).map((f, i) => <div key={i} style={{ textAlign: 'center', fontSize: 12, padding: '4px 0' }}>{f}</div>)}
      </div>
      <Center style={{ background: 'rgba(3,13,26,0.55)' }}><div style={{ color: '#FFD700', fontWeight: 900, fontSize: 15 }}>48 נבחרות</div><div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9 }}>עולם אחד, גביע אחד</div></Center>
    </>
  );
};

const P14 = () => ( // Holographic Foil
  <>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(120deg,#ff9ecb,#a78bfa,#7dd3fc,#fbbf24,#ff9ecb)', backgroundSize: '300% 300%', animation: 'wc-holo 5s ease infinite', opacity: 0.85 }} />
    <div style={{ position: 'absolute', inset: 10, border: '1px solid rgba(255,255,255,0.6)', borderRadius: 8 }} />
    <Center><span style={{ fontSize: 30, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🏆</span><div style={{ color: '#1a1030', fontWeight: 900, fontSize: 11, marginTop: 2 }}>מדבקה #1</div></Center>
    <style>{`@keyframes wc-holo{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`}</style>
  </>
);

const P15 = () => ( // Newspaper Front Page
  <div style={{ position: 'absolute', inset: 12, background: '#f4efe4', borderRadius: 4, padding: 10, color: '#1a1a1a' }}>
    <div style={{ textAlign: 'center', fontFamily: 'Georgia, serif', fontWeight: 900, fontSize: 16, borderBottom: '2px solid #1a1a1a', paddingBottom: 4 }}>THE WORLD CUP TIMES</div>
    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
      <div style={{ flex: 1, fontSize: 7, lineHeight: 1.4, opacity: 0.75 }}>מחזור 6 ננעל הערב. מי יצליח לנחש את התוצאה המדויקת ולטפס בטבלה?</div>
      <div style={{ flex: 1, fontSize: 7, lineHeight: 1.4, opacity: 0.75, borderRight: '1px solid #1a1a1a', paddingRight: 6 }}>הכוכבים החדשים של המונדיאל נכנסים לתמונה החל מהיום.</div>
    </div>
  </div>
);

const P16 = () => ( // Comic Book Action
  <>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '6px 6px', backgroundColor: '#e11d48' }} />
    <div style={{ position: 'absolute', inset: 10, border: '3px solid #111', borderRadius: 6, background: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-2deg)' }}>
      <div style={{ color: '#111', fontWeight: 900, fontSize: 20, fontStyle: 'italic', ...F }}>GOAL!</div>
    </div>
  </>
);

const P17 = () => ( // Claymorphism 3D
  <Center>
    <div style={{ width: 70, height: 70, borderRadius: 26, background: 'linear-gradient(145deg,#1f2a44,#141c30)', boxShadow: '8px 8px 16px #0a0f1c, -8px -8px 16px #26314f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 30 }}>🏆</span>
    </div>
    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 9, marginTop: 8 }}>המסלול שלי ל-2026</div>
  </Center>
);

const P18 = () => ( // Aurora Mesh
  <>
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 20%, rgba(56,189,248,0.5), transparent 45%), radial-gradient(circle at 80% 30%, rgba(217,70,239,0.4), transparent 45%), radial-gradient(circle at 50% 90%, rgba(74,222,128,0.35), transparent 50%)', filter: 'blur(6px)' }} />
    <Center><Glass style={{ padding: '10px 18px' }}><div style={{ color: '#fff', fontWeight: 900, fontSize: 14, textAlign: 'center' }}>World Cup 2026</div></Glass></Center>
  </>
);

const P19 = () => ( // Brutalist Scoreboard
  <div style={{ position: 'absolute', inset: 10, border: '3px solid #fff', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr' }}>
    {['WC', '26', '48', 'GO'].map((t, i) => (
      <div key={i} style={{ borderRight: i % 2 === 0 ? '3px solid #fff' : 'none', borderBottom: i < 2 ? '3px solid #fff' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFD700', fontWeight: 900, fontSize: 18, fontFamily: 'monospace', background: '#000' }}>{t}</div>
    ))}
  </div>
);

const P20 = () => ( // Golden Hour Pitch
  <>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,#3b1f0f 0%,#a8551f 40%,#e8934a 65%,#3b1f0f 100%)' }} />
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(180deg,transparent,#150a05)' }} />
    <div style={{ position: 'absolute', bottom: 6, left: '20%', width: 6, height: 34, background: '#150a05', borderRadius: 2 }} />
    <div style={{ position: 'absolute', bottom: 6, left: '55%', width: 6, height: 40, background: '#150a05', borderRadius: 2 }} />
    <div style={{ position: 'absolute', top: '20%', left: '50%', width: 26, height: 26, marginLeft: -13, borderRadius: '50%', background: '#ffdca8', boxShadow: '0 0 30px #ffdca8' }} />
  </>
);

const P21 = () => ( // Social Stories
  <>
    <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', gap: 8 }}>
      {['1', '2', '3', '4', '5'].map((n, i) => (
        <div key={n} style={{ width: 26, height: 26, borderRadius: '50%', background: i === 0 ? 'conic-gradient(#FFD700,#f97316,#FFD700)' : 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', fontWeight: 900 }}>{n}</div>
      ))}
    </div>
    <div style={{ position: 'absolute', bottom: 10, left: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Glass style={{ padding: '6px 10px', fontSize: 9, color: '#fff' }}>🇧🇷 ברזיל 2-1 ארגנטינה 🇦🇷</Glass>
      <Glass style={{ padding: '6px 10px', fontSize: 9, color: '#fff' }}>הניחוש שלך זכה ב-12 נק' 🎉</Glass>
    </div>
  </>
);

const P22 = () => { // Leaderboard Podium
  const bars = [['2', 34, '#c0c0c0'], ['1', 50, '#FFD700'], ['3', 24, '#cd7f32']];
  return (
    <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 6 }}>
      {bars.map(([n, h, c]) => (
        <div key={n} style={{ width: 44, height: h, background: c, borderRadius: '6px 6px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 4, color: '#000', fontWeight: 900, fontSize: 12 }}>{n}</div>
      ))}
    </div>
  );
};

const P23 = () => ( // Passport Stamps
  <div style={{ position: 'absolute', inset: 12, background: '#efe6d0', borderRadius: 6, padding: 10 }}>
    <div style={{ color: '#5a4a2a', fontSize: 9, fontWeight: 900, letterSpacing: 2, textAlign: 'center' }}>PASSPORT · FAN ID</div>
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
      {[['🇨🇦', '-6°'], ['🇺🇸', '12°'], ['🇲🇽', '-24°']].map(([f, r]) => (
        <div key={f} style={{ border: '2px solid #b91c1c', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${r})`, fontSize: 15, opacity: 0.85 }}>{f}</div>
      ))}
    </div>
  </div>
);

const P24 = () => ( // Command Center HUD
  <>
    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(74,222,128,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.08) 1px,transparent 1px)', backgroundSize: '12px 12px' }} />
    <div style={{ position: 'absolute', top: 10, left: 10, color: '#4ade80', fontSize: 8, fontFamily: 'monospace' }}>SYS://LIVE_TRACKING</div>
    <Center>
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" stroke="rgba(74,222,128,0.25)" strokeWidth="2" fill="none" />
        <circle cx="32" cy="32" r="26" stroke="#4ade80" strokeWidth="2" fill="none" strokeDasharray="60 200" />
        <text x="32" y="37" textAnchor="middle" fill="#4ade80" fontSize="13" fontWeight="900">72%</text>
      </svg>
    </Center>
  </>
);

const P25 = () => ( // Origami Paper-Craft
  <>
    <div style={{ position: 'absolute', top: '15%', left: '20%', width: 46, height: 46, background: '#f5c518', clipPath: 'polygon(50% 0,100% 100%,0 100%)', opacity: 0.9 }} />
    <div style={{ position: 'absolute', top: '20%', right: '18%', width: 40, height: 40, background: '#0ea5a4', clipPath: 'polygon(0 0,100% 0,100% 100%)', opacity: 0.85 }} />
    <div style={{ position: 'absolute', bottom: '15%', left: '38%', width: 50, height: 50, background: '#e2725b', clipPath: 'polygon(50% 0,100% 50%,50% 100%,0 50%)', opacity: 0.9 }} />
    <Center style={{ top: 4 }}><div style={{ color: '#fff', fontSize: 10, fontWeight: 900, letterSpacing: 2, marginTop: -6 }}>ORIGAMI · 2026</div></Center>
  </>
);

/* ── data ─────────────────────────────────────────────────────────────── */

const DESIGNS = [
  { id: 1, cat: 'דרמטי', name: 'אורות האצטדיון', sub: 'Stadium Lights', desc: 'זרקורים דרמטיים מתכנסים אל הגביע — אווירת ליל משחק גדול.', tags: ['דרמטי', 'זהב'], accent: '#FFD700', bg: 'linear-gradient(160deg,#050d1a,#0d1f3c)', Preview: P1 },
  { id: 2, cat: 'ייחודי', name: 'מסלול המפה הגלובלית', sub: 'Global Route Map', desc: 'מפה עם קו מנוקד בין קנדה, ארה"ב ומקסיקו — שלוש המדינות המארחות.', tags: ['נסיעות', 'ייחודי'], accent: '#2dd4bf', bg: 'linear-gradient(160deg,#04141a,#0a2830)', Preview: P2 },
  { id: 3, cat: 'ייחודי', name: 'כרטיס כניסה למשחק', sub: 'Boarding Pass', desc: 'מסך הבית בעיצוב כרטיס טיסה/כניסה עם קו פרפורציה וברקוד.', tags: ['ייחודי', 'טיקט'], accent: '#FFD700', bg: 'linear-gradient(160deg,#050d1a,#0a1830)', Preview: P3 },
  { id: 4, cat: 'טכנולוגי', name: 'גרפיקת שידור ספורט', sub: 'Broadcast Graphics', desc: 'בלוקים אלכסוניים נועזים וסרגל תחתון חי, כמו גרפיקת טלוויזיה.', tags: ['נועז', 'שידור'], accent: '#FFD700', bg: 'linear-gradient(160deg,#0a0a0a,#1a1a1a)', Preview: P4 },
  { id: 5, cat: 'משחקי', name: 'קיר החולצות', sub: 'Jersey Wall', desc: 'גריד צבעוני של חולצות נבחרות — משחקי וססגוני.', tags: ['משחקי', 'צבעוני'], accent: '#f97316', bg: 'linear-gradient(160deg,#0a0a12,#161625)', Preview: P5 },
  { id: 6, cat: 'דרמטי', name: 'פיצוץ קונפטי', sub: 'Confetti Lift', desc: 'רגע ההרמה של הגביע קפוא בזמן, עם התפוצצות קונפטי זהב.', tags: ['חגיגי', 'תנועה'], accent: '#FFD700', bg: 'linear-gradient(160deg,#0a0620,#1a0f38)', Preview: P6 },
  { id: 7, cat: 'עיתונאי/רטרו', name: 'פוסטר וינטג׳ 1970', sub: "Retro '70s Poster", desc: 'איור שטוח עם קרני שמש, פלטת כתום-בורדו וטיפוגרפיה קלאסית.', tags: ['רטרו', 'איור'], accent: '#f4a340', bg: 'linear-gradient(160deg,#7a2e2e,#3a1414)', Preview: P7 },
  { id: 8, cat: 'טכנולוגי', name: 'HUD ניאון גיימינג', sub: 'Neon Esports HUD', desc: 'רשת ניאון, זוהר מגנטה-ציאן וטיפוגרפיה טכנולוגית.', tags: ['גיימינג', 'ניאון'], accent: '#22d3ee', bg: 'linear-gradient(160deg,#0a0014,#160026)', Preview: P8 },
  { id: 9, cat: 'מינימלי', name: 'מינימליזם מונוכרום', sub: 'Mono Minimal', desc: 'צבע אחד, טיפוגרפיה ענקית והמון רווח שחור — שקט וממוקד.', tags: ['מינימלי', 'נקי'], accent: '#ffffff', bg: '#0a0a0a', Preview: P9 },
  { id: 10, cat: 'מינימלי', name: 'דשבורד בנטו', sub: 'Bento Grid', desc: 'מסך בית כרשת תאי מידע: מחזור קרוב, דירוג וניקוד — פחות הירו, יותר דאטה.', tags: ['דאטה', 'בנטו'], accent: '#4ade80', bg: 'linear-gradient(160deg,#050d1a,#0d1a2e)', Preview: P10 },
  { id: 11, cat: 'דרמטי', name: 'גיבור הספירה לאחור', sub: 'Countdown Hero', desc: 'טיימר ענק לפתיחת הטורניר כאלמנט המרכזי של הדף.', tags: ['ספירה', 'מתח'], accent: '#FFD700', bg: 'linear-gradient(160deg,#050d1a,#101c30)', Preview: P11 },
  { id: 12, cat: 'ייחודי', name: 'אצטדיון מציפור', sub: 'Aerial Stadium', desc: 'איור מבט-על על המגרש, עם קווי המשחק כמסגרת עדינה.', tags: ['גרפי', 'ספורט'], accent: '#4ade80', bg: 'linear-gradient(160deg,#051a0d,#0a2814)', Preview: P12 },
  { id: 13, cat: 'משחקי', name: 'פסיפס דגלים', sub: 'Flag Mosaic', desc: 'רקע עשוי אריחי דגלי נבחרות זעירים — "עולם אחד, גביע אחד".', tags: ['דגלים', 'עולמי'], accent: '#FFD700', bg: 'linear-gradient(160deg,#050d1a,#0d1626)', Preview: P13 },
  { id: 14, cat: 'משחקי', name: 'כרטיס הולוגרפי', sub: 'Holographic Foil', desc: 'ברק הולוגרפי כמו מדבקת פאניני — אפקט מתכתי זז.', tags: ['הולוגרפי', 'אספנות'], accent: '#a78bfa', bg: '#1a1030', Preview: P14 },
  { id: 15, cat: 'עיתונאי/רטרו', name: 'עיתון ספורט', sub: 'Newspaper Front Page', desc: 'כותרת ראשית וטור טקסט בסגנון עיתון ספורט קלאסי.', tags: ['עיתונאי', 'טקסט'], accent: '#1a1a1a', bg: '#efe6d0', Preview: P15 },
  { id: 16, cat: 'עיתונאי/רטרו', name: 'קומיקס אקשן', sub: 'Comic Book', desc: 'נקודות האלפטון, מסגרת עבה ובועת "GOAL!" בסגנון קומיקס.', tags: ['קומיקס', 'אקשן'], accent: '#e11d48', bg: '#e11d48', Preview: P16 },
  { id: 17, cat: 'מינימלי', name: 'קליי תלת-מימד', sub: 'Claymorphism 3D', desc: 'צורות רכות מעוגלות עם צללים רכים — עדין ומודרני.', tags: ['רך', '3D'], accent: '#93a5c9', bg: 'linear-gradient(160deg,#141c30,#0d1220)', Preview: P17 },
  { id: 18, cat: 'טכנולוגי', name: 'מש גרדיאנט אורורה', sub: 'Aurora Mesh', desc: 'רקע גרדיאנט זורם רב-גוני עם כרטיסי זכוכית צפים מעליו.', tags: ['גרדיאנט', 'זכוכית'], accent: '#38bdf8', bg: '#0a0e1a', Preview: P18 },
  { id: 19, cat: 'עיתונאי/רטרו', name: 'ברוטליזם לוח תוצאות', sub: 'Brutalist Scoreboard', desc: 'גריד גולמי, מסגרות עבות ופונט מונוספייס בסגנון לוח תוצאות ישן.', tags: ['ברוטליסט', 'נועז'], accent: '#FFD700', bg: '#000000', Preview: P19 },
  { id: 20, cat: 'דרמטי', name: 'שעת זהב על המגרש', sub: 'Golden Hour Pitch', desc: 'גרדיאנט שקיעה חם מעל מגרש, עם צלליות שערים ושמש שוקעת.', tags: ['שקיעה', 'חם'], accent: '#e8934a', bg: 'linear-gradient(180deg,#3b1f0f,#a8551f)', Preview: P20 },
  { id: 21, cat: 'משחקי', name: 'פיד סטוריז חברתי', sub: 'Social Stories', desc: 'שורת סטוריז עגולים למחזורים למעלה, פיד עדכונים חי למטה.', tags: ['חברתי', 'פיד'], accent: '#FFD700', bg: 'linear-gradient(160deg,#0a0f1e,#141c30)', Preview: P21 },
  { id: 22, cat: 'משחקי', name: 'פודיום מקום ראשון', sub: 'Leaderboard Podium', desc: 'פודיום מדליות כגיבור הראשי במקום הגביע — ממוקד תחרותיות.', tags: ['תחרות', 'פודיום'], accent: '#FFD700', bg: 'linear-gradient(160deg,#0a0d16,#141a28)', Preview: P22 },
  { id: 23, cat: 'ייחודי', name: 'חותמות דרכון', sub: 'Passport Stamps', desc: 'עיצוב עמוד דרכון עם חותמות עבור ערי האירוח — תמת מסע.', tags: ['דרכון', 'מסע'], accent: '#b91c1c', bg: '#3a3220', Preview: P23 },
  { id: 24, cat: 'טכנולוגי', name: 'חדר בקרה / טלמטריה', sub: 'Command Center HUD', desc: 'דשבורד נתונים בהשראת פורמולה 1 — מד התקדמות ורשת טכנית.', tags: ['טלמטריה', 'דאטה'], accent: '#4ade80', bg: '#04140a', Preview: P24 },
  { id: 25, cat: 'ייחודי', name: 'אוריגמי נייר', sub: 'Origami Paper-Craft', desc: 'קפלים גיאומטריים בסגנון גזירת נייר, שכבות רכות וצבעוניות.', tags: ['נייר', 'גיאומטרי'], accent: '#e2725b', bg: 'linear-gradient(160deg,#0d1220,#141a2e)', Preview: P25 },
];

const CATS = ['הכול', 'דרמטי', 'מינימלי', 'משחקי', 'עיתונאי/רטרו', 'טכנולוגי', 'ייחודי'];

/* ── Card ─────────────────────────────────────────────────────────────── */
function DesignCard({ d, isSelected, onSelect }) {
  const { Preview } = d;
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: isSelected ? `2px solid ${d.accent}` : '2px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        boxShadow: isSelected ? `0 0 24px ${d.accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      <div style={{ height: 190, position: 'relative', background: d.bg, overflow: 'hidden' }}>
        <Preview />
        {isSelected && (
          <div style={{ position: 'absolute', top: 10, left: 10, width: 22, height: 22, borderRadius: '50%', background: d.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            <span style={{ color: '#000', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', borderRadius: 999, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900, color: '#fff' }}>{d.id}</div>
      </div>

      <div style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 6 }}>
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{d.name}</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9 }}>{d.sub}</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10.5, marginTop: 4, lineHeight: 1.5 }}>{d.desc}</div>
        <div style={{ display: 'flex', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
          {d.tags.map((t) => (
            <span key={t} style={{ border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)', fontSize: 9, padding: '2px 7px', borderRadius: 999 }}>{t}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */
export default function AdminHomeDesignsDemo() {
  const [selected, setSelected] = useState(null);
  const [cat, setCat] = useState('הכול');

  const visible = cat === 'הכול' ? DESIGNS : DESIGNS.filter((d) => d.cat === cat);
  const selectedDesign = DESIGNS.find((d) => d.id === selected);

  return (
    <div dir="rtl" style={{ color: '#fff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 4 }}>25 רעיונות עיצוב — מסך הבית</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            {selectedDesign ? `✓ נבחר: ${selectedDesign.name} (${selectedDesign.sub})` : 'כיוונים חלופיים לעיצוב ה-Hero של הדשבורד — לחצו לבחירה'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATS.map((c) => {
          const count = c === 'הכול' ? DESIGNS.length : DESIGNS.filter((d) => d.cat === c).length;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.18)', background: cat === c ? '#FFD700' : 'rgba(255,255,255,0.06)', color: cat === c ? '#000' : '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', transition: 'all .15s' }}
            >
              {c} ({count})
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {visible.map((d) => (
          <DesignCard key={d.id} d={d} isSelected={selected === d.id} onSelect={() => setSelected(selected === d.id ? null : d.id)} />
        ))}
      </div>
    </div>
  );
}
