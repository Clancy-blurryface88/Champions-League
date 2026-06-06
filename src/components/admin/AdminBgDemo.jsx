import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* ── subtle CSS patterns ────────────────────────────────────────────────────── */
const P = {
  diag:   'repeating-linear-gradient(45deg,rgba(255,255,255,0.025) 0px,rgba(255,255,255,0.025) 1px,transparent 1px,transparent 14px)',
  dots:   'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)',
  hlines: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 18px)',
  grid:   'linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)',
  vign:   'radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,0.45) 100%)',
  cross:  'repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 28px)',
};

/* ── 50 backgrounds ──────────────────────────────────────────────────────────── */
const bgs = [

  /* ═══ NAVY / GOLD  1–10 ═══════════════════════════════════════════════════ */
  { id:1,  cat:'נייבי/זהב', name:'Royal Navy',
    bg:'linear-gradient(160deg,#050d1a 0%,#0d1f3c 60%,#1a2f5e 100%)',
    accent:'#FFD700', colors:['#050d1a','#1a2f5e'] },

  { id:2,  cat:'נייבי/זהב', name:'Gold Zenith',
    bg:'radial-gradient(ellipse at 50% 0%,#1a3060 0%,#060d1c 70%)',
    accent:'#FFD700', colors:['#060d1c','#1a3060'] },

  { id:3,  cat:'נייבי/זהב', name:'Deep Ocean',
    bg:'linear-gradient(180deg,#0a1628 0%,#162040 50%,#0a1628 100%)',
    pat:P.hlines,
    accent:'#C9A84C', colors:['#0a1628','#162040'] },

  { id:4,  cat:'נייבי/זהב', name:'Indigo Night',
    bg:'linear-gradient(135deg,#050d1a 0%,#0f2040 50%,#1a1a2e 100%)',
    accent:'#818cf8', colors:['#050d1a','#1a1a2e'] },

  { id:5,  cat:'נייבי/זהב', name:'Navy Diagonal',
    bg:'linear-gradient(45deg,#060d1c 0%,#1a2744 50%,#0c1830 100%)',
    pat:P.diag,
    accent:'#E8C96A', colors:['#060d1c','#1a2744'] },

  { id:6,  cat:'נייבי/זהב', name:'Midnight Glow',
    bg:'radial-gradient(circle at 20% 80%,#1a2f5e 0%,#050d1a 60%)',
    accent:'#FFD700', colors:['#050d1a','#1a2f5e'] },

  { id:7,  cat:'נייבי/זהב', name:'Electric Navy',
    bg:'linear-gradient(160deg,#0a0e2a 0%,#1a2060 100%)',
    pat:P.dots, patSz:'20px 20px',
    accent:'#7EB3FF', colors:['#0a0e2a','#1a2060'] },

  { id:8,  cat:'נייבי/זהב', name:'Sapphire Fade',
    bg:'linear-gradient(160deg,#080e1e 0%,#0f1e40 40%,#1a2855 100%)',
    pat:P.cross, patSz:'28px 28px',
    accent:'#5B9BFF', colors:['#080e1e','#1a2855'] },

  { id:9,  cat:'נייבי/זהב', name:'Trophy Room',
    bg:'radial-gradient(ellipse at 80% 20%,#1a3060 0%,#050d1a 60%)',
    pat:P.vign,
    accent:'#FFD700', colors:['#050d1a','#1a3060'] },

  { id:10, cat:'נייבי/זהב', name:'Admiral',
    bg:'linear-gradient(200deg,#0d1f3c 0%,#050d1a 45%,#0a1826 100%)',
    pat:P.grid, patSz:'24px 24px',
    accent:'#93c5fd', colors:['#050d1a','#0d1f3c'] },

  /* ═══ GREEN / BLACK  11–20 ══════════════════════════════════════════════════ */
  { id:11, cat:'ירוק/שחור', name:'Pitch Black',
    bg:'linear-gradient(160deg,#051a0d 0%,#0d3c1f 60%,#051a0d 100%)',
    accent:'#4ade80', colors:['#051a0d','#0d3c1f'] },

  { id:12, cat:'ירוק/שחור', name:'Emerald Core',
    bg:'radial-gradient(ellipse at 50% 100%,#0d3c1f 0%,#051408 70%)',
    accent:'#86efac', colors:['#051408','#0d3c1f'] },

  { id:13, cat:'ירוק/שחור', name:'Forest Deep',
    bg:'linear-gradient(135deg,#061510 0%,#0f3020 50%,#061510 100%)',
    pat:P.hlines,
    accent:'#86efac', colors:['#061510','#0f3020'] },

  { id:14, cat:'ירוק/שחור', name:'Hunter Green',
    bg:'linear-gradient(180deg,#051a0d,#0d2a18,#051a0d)',
    accent:'#22c55e', colors:['#051a0d','#0d2a18'] },

  { id:15, cat:'ירוק/שחור', name:'Emerald Depth',
    bg:'radial-gradient(circle at 30% 70%,#0f3020 0%,#030d06 60%)',
    pat:P.diag,
    accent:'#4ade80', colors:['#030d06','#0f3020'] },

  { id:16, cat:'ירוק/שחור', name:'Muted Pitch',
    bg:'linear-gradient(160deg,#041208 0%,#0a2814 100%)',
    pat:P.dots, patSz:'16px 16px',
    accent:'#86efac', colors:['#041208','#0a2814'] },

  { id:17, cat:'ירוק/שחור', name:'Deep Turf',
    bg:'linear-gradient(45deg,#050f08 0%,#0d2818 50%,#072010 100%)',
    accent:'#4ade80', colors:['#050f08','#0d2818'] },

  { id:18, cat:'ירוק/שחור', name:'Teal Night',
    bg:'linear-gradient(160deg,#041410 0%,#0a2820 100%)',
    pat:P.cross, patSz:'24px 24px',
    accent:'#2dd4bf', colors:['#041410','#0a2820'] },

  { id:19, cat:'ירוק/שחור', name:'Goal Net',
    bg:'linear-gradient(160deg,#051a0d 0%,#0a2814 40%,#0f3020 100%)',
    pat:P.grid, patSz:'20px 20px',
    accent:'#4ade80', colors:['#051a0d','#0f3020'] },

  { id:20, cat:'ירוק/שחור', name:'Vivid Turf',
    bg:'radial-gradient(ellipse at 50% 0%,#0d3020 0%,#030d06 70%)',
    pat:P.vign,
    accent:'#86efac', colors:['#030d06','#0d3020'] },

  /* ═══ CHARCOAL / SILVER  21–28 ══════════════════════════════════════════════ */
  { id:21, cat:'פחם/כסף', name:'Pure Charcoal',
    bg:'linear-gradient(160deg,#0d0d0d 0%,#1a1a1a 50%,#0f0f0f 100%)',
    accent:'#D1D5DB', colors:['#0d0d0d','#1a1a1a'] },

  { id:22, cat:'פחם/כסף', name:'Steel Gray',
    bg:'linear-gradient(135deg,#0e0e0e 0%,#1e1e1e 50%,#0a0a0a 100%)',
    pat:P.diag,
    accent:'#9ca3af', colors:['#0a0a0a','#1e1e1e'] },

  { id:23, cat:'פחם/כסף', name:'Spotlight Dark',
    bg:'radial-gradient(ellipse at 50% 0%,#242424 0%,#080808 70%)',
    accent:'#E5E7EB', colors:['#080808','#242424'] },

  { id:24, cat:'פחם/כסף', name:'Blue Charcoal',
    bg:'linear-gradient(160deg,#0a0a14,#14141e,#0a0a14)',
    pat:P.dots, patSz:'18px 18px',
    accent:'#94a3b8', colors:['#0a0a14','#14141e'] },

  { id:25, cat:'פחם/כסף', name:'Graphite Wave',
    bg:'linear-gradient(200deg,#0d0d0d 0%,#1c1c1c 40%,#080808 100%)',
    accent:'#9ca3af', colors:['#080808','#1c1c1c'] },

  { id:26, cat:'פחם/כסף', name:'Cool Slate',
    bg:'linear-gradient(135deg,#0a0d10 0%,#141c22 50%,#0a0d10 100%)',
    pat:P.hlines,
    accent:'#94a3b8', colors:['#0a0d10','#141c22'] },

  { id:27, cat:'פחם/כסף', name:'Dark Iron',
    bg:'radial-gradient(circle at 70% 30%,#1e1e1e 0%,#080808 60%)',
    pat:P.vign,
    accent:'#D1D5DB', colors:['#080808','#1e1e1e'] },

  { id:28, cat:'פחם/כסף', name:'Ash Grid',
    bg:'linear-gradient(160deg,#0e0f10 0%,#181a1e 50%,#0e0f10 100%)',
    pat:P.grid, patSz:'22px 22px',
    accent:'#6b7280', colors:['#0e0f10','#181a1e'] },

  /* ═══ CRIMSON / DARK  29–35 ═════════════════════════════════════════════════ */
  { id:29, cat:'קרמיזי/כהה', name:'Deep Crimson',
    bg:'linear-gradient(160deg,#1a0508 0%,#2d0a0f 60%,#1a0508 100%)',
    accent:'#f87171', colors:['#1a0508','#2d0a0f'] },

  { id:30, cat:'קרמיזי/כהה', name:'Red Zenith',
    bg:'radial-gradient(ellipse at 50% 0%,#2d0a0f 0%,#0d0305 70%)',
    accent:'#ef4444', colors:['#0d0305','#2d0a0f'] },

  { id:31, cat:'קרמיזי/כהה', name:'Bordeaux',
    bg:'linear-gradient(135deg,#100208 0%,#200510 50%,#100208 100%)',
    pat:P.diag,
    accent:'#f43f5e', colors:['#100208','#200510'] },

  { id:32, cat:'קרמיזי/כהה', name:'Blood Amber',
    bg:'linear-gradient(160deg,#180505 0%,#2a0808 100%)',
    accent:'#fca5a5', colors:['#180505','#2a0808'] },

  { id:33, cat:'קרמיזי/כהה', name:'Dark Ruby',
    bg:'linear-gradient(200deg,#1a0508 0%,#0d0305 50%,#140408 100%)',
    pat:P.dots, patSz:'16px 16px',
    accent:'#fb7185', colors:['#0d0305','#1a0508'] },

  { id:34, cat:'קרמיזי/כהה', name:'Maroon Depth',
    bg:'radial-gradient(circle at 30% 70%,#200510 0%,#080103 60%)',
    accent:'#f43f5e', colors:['#080103','#200510'] },

  { id:35, cat:'קרמיזי/כהה', name:'Cardinal',
    bg:'linear-gradient(135deg,#12030a 0%,#1f0610 100%)',
    pat:P.vign,
    accent:'#fda4af', colors:['#12030a','#1f0610'] },

  /* ═══ WORLD CUP EDITIONS  36–43 ═════════════════════════════════════════════ */
  { id:36, cat:'מונדיאל', name:'Qatar 2022',
    bg:'linear-gradient(160deg,#16001c 0%,#2e0030 50%,#16001c 100%)',
    accent:'#C9A84C', colors:['#16001c','#2e0030'] },

  { id:37, cat:'מונדיאל', name:'Russia 2018',
    bg:'linear-gradient(160deg,#12001a 0%,#08001a 60%,#12001a 100%)',
    pat:P.vign,
    accent:'#ef4444', colors:['#08001a','#12001a'] },

  { id:38, cat:'מונדיאל', name:'Brazil 2014',
    bg:'linear-gradient(135deg,#051a08 0%,#0a1a05 50%,#051a08 100%)',
    accent:'#FFD700', colors:['#051a08','#0a1a05'] },

  { id:39, cat:'מונדיאל', name:'South Africa 2010',
    bg:'linear-gradient(160deg,#1a0a05 0%,#1a1005 50%,#100a05 100%)',
    accent:'#fb923c', colors:['#1a0a05','#1a1005'] },

  { id:40, cat:'מונדיאל', name:'Germany 2006',
    bg:'linear-gradient(135deg,#0d0d0d 0%,#141414 50%,#0d0d0d 100%)',
    pat:P.diag,
    accent:'#ef4444', colors:['#0d0d0d','#141414'] },

  { id:41, cat:'מונדיאל', name:'France 1998',
    bg:'linear-gradient(160deg,#050d1a 0%,#0d0508 50%,#050a14 100%)',
    accent:'#ef4444', colors:['#050d1a','#0d0508'] },

  { id:42, cat:'מונדיאל', name:'Italy 1990',
    bg:'linear-gradient(160deg,#050d1a 0%,#051a14 50%,#050d14 100%)',
    accent:'#60a5fa', colors:['#050d1a','#051a14'] },

  { id:43, cat:'מונדיאל', name:'USA 2026',
    bg:'linear-gradient(160deg,#050d1a 0%,#1a0508 50%,#050d1a 100%)',
    pat:P.hlines,
    accent:'#f87171', colors:['#050d1a','#1a0508'] },

  /* ═══ LUXURY / UNIQUE  44–50 ════════════════════════════════════════════════ */
  { id:44, cat:'יוקרה', name:'Dark Velvet',
    bg:'linear-gradient(160deg,#0d0a1a 0%,#1a0d2a 50%,#0a0714 100%)',
    accent:'#d8b4fe', colors:['#0d0a1a','#1a0d2a'] },

  { id:45, cat:'יוקרה', name:'Jade Night',
    bg:'linear-gradient(160deg,#0a100d 0%,#0d1a14 50%,#0a0f0d 100%)',
    pat:P.cross, patSz:'26px 26px',
    accent:'#34d399', colors:['#0a100d','#0d1a14'] },

  { id:46, cat:'יוקרה', name:'Bronze Noir',
    bg:'radial-gradient(ellipse at 50% 50%,#1a1510 0%,#0a0805 100%)',
    pat:P.vign,
    accent:'#d97706', colors:['#0a0805','#1a1510'] },

  { id:47, cat:'יוקרה', name:'Steel Blue Night',
    bg:'linear-gradient(135deg,#0a0f14 0%,#141e26 50%,#0a0d12 100%)',
    pat:P.grid, patSz:'22px 22px',
    accent:'#38bdf8', colors:['#0a0f14','#141e26'] },

  { id:48, cat:'יוקרה', name:'Arctic Night',
    bg:'linear-gradient(160deg,#0d1420 0%,#101c2e 50%,#0a1018 100%)',
    accent:'#7dd3fc', colors:['#0d1420','#101c2e'] },

  { id:49, cat:'יוקרה', name:'Amber Noir',
    bg:'radial-gradient(ellipse at 30% 30%,#1c1510 0%,#080808 70%)',
    pat:P.dots, patSz:'18px 18px',
    accent:'#fbbf24', colors:['#080808','#1c1510'] },

  { id:50, cat:'יוקרה', name:'Cosmic Dust',
    bg:'linear-gradient(160deg,#0d0a10 0%,#14101e 50%,#0a0810 100%)',
    pat:P.dots, patSz:'20px 20px',
    accent:'#a78bfa', colors:['#0d0a10','#14101e'] },
];

const CATS = ['הכול', 'נייבי/זהב', 'ירוק/שחור', 'פחם/כסף', 'קרמיזי/כהה', 'מונדיאל', 'יוקרה'];

/* ── Card ─────────────────────────────────────────────────────────────────── */
function BgCard({ bg, isSelected, onSelect }) {
  const [hovered, setHovered]   = useState(false);
  const [copied,  setCopied]    = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const css = `background: ${bg.bg};`;
    navigator.clipboard.writeText(css).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 400, damping: 26 }}
      style={{
        borderRadius: 14,
        overflow: 'hidden',
        border: isSelected ? `2px solid ${bg.accent}` : '2px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        boxShadow: isSelected ? `0 0 24px ${bg.accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition: 'border-color .2s, box-shadow .2s',
      }}
    >
      {/* ── Preview ── */}
      <div style={{ height: 164, position: 'relative', background: bg.bg }}>
        {/* Pattern overlay */}
        {bg.pat && (
          <div style={{ position:'absolute', inset:0, backgroundImage:bg.pat, backgroundSize:bg.patSz||'auto', pointerEvents:'none' }} />
        )}
        {/* Mock stats content */}
        <div style={{ position:'absolute', inset:0, padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'space-between', zIndex:1 }}>
          <div>
            <div style={{ color:bg.accent, fontSize:9, fontWeight:700, letterSpacing:2, opacity:.85 }}>WORLD CUP 2026</div>
            <div style={{ color:'#fff', fontSize:17, fontWeight:900, lineHeight:1, marginTop:3 }}>STATISTICS</div>
            <div style={{ color:'rgba(255,255,255,0.38)', fontSize:10, marginTop:2 }}>Prediction Results</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[['24','Pts',bg.accent],['8','Exact','#4ade80'],['67%','Acc','rgba(255,255,255,0.55)']].map(([v,l,c])=>(
              <div key={l} style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(12px) saturate(1.5)', WebkitBackdropFilter:'blur(12px) saturate(1.5)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 8px', textAlign:'center', flex:1 }}>
                <div style={{ color:c, fontWeight:900, fontSize:15, lineHeight:1 }}>{v}</div>
                <div style={{ color:'rgba(255,255,255,0.35)', fontSize:8, marginTop:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Hover copy overlay */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration:.14 }}
          style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.58)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:2 }}
        >
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.96 }}
            style={{ background: copied ? '#22c55e' : bg.accent, color:'#000', border:'none', borderRadius:8, padding:'9px 20px', fontWeight:800, fontSize:12, cursor:'pointer' }}
          >
            {copied ? '✓ הועתק!' : 'העתק CSS'}
          </motion.button>
        </motion.div>
        {/* Selected badge */}
        {isSelected && (
          <div style={{ position:'absolute', top:10, right:10, width:22, height:22, borderRadius:'50%', background:bg.accent, display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 }}>
            <span style={{ color:'#000', fontSize:12, fontWeight:900, lineHeight:1 }}>✓</span>
          </div>
        )}
      </div>

      {/* ── Info bar ── */}
      <div style={{ background:'rgba(0,0,0,0.72)', backdropFilter:'blur(8px)', padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ background:bg.accent, borderRadius:999, width:17, height:17, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:900, color:'#000', flexShrink:0 }}>{bg.id}</span>
            <span style={{ color:'#fff', fontWeight:700, fontSize:12 }}>{bg.name}</span>
          </div>
          <div style={{ color:'rgba(255,255,255,0.28)', fontSize:9, marginTop:1, paddingLeft:23 }}>{bg.cat}</div>
        </div>
        <div style={{ display:'flex', gap:3 }}>
          {bg.colors.map(c=>(
            <div key={c} style={{ width:13, height:13, borderRadius:'50%', background:c, border:'1.5px solid rgba(255,255,255,0.18)', flexShrink:0 }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function AdminBgDemo() {
  const [selected, setSelected] = useState(null);
  const [cat, setCat]           = useState('הכול');

  const visible     = cat === 'הכול' ? bgs : bgs.filter(b => b.cat === cat);
  const selectedBg  = bgs.find(b => b.id === selected);

  return (
    <div dir="rtl" style={{ color:'#fff', fontFamily:'system-ui,sans-serif' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>50 רקעים — מונדיאל 2026</h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13 }}>
            {selectedBg
              ? `✓ נבחר: ${selectedBg.name} — הובר על הרקע להעתקת CSS`
              : 'לחץ על רקע לבחירה · הובר להעתקת ה-CSS'}
          </p>
        </div>
        {selectedBg && (
          <div style={{ background:selectedBg.bg, border:`1px solid ${selectedBg.accent}55`, borderRadius:8, padding:'7px 14px', fontSize:10, color:'rgba(255,255,255,0.8)', fontFamily:'monospace', maxWidth:280, wordBreak:'break-all', lineHeight:1.5 }}>
            background: {selectedBg.bg};
          </div>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {CATS.map(c => {
          const count = c === 'הכול' ? bgs.length : bgs.filter(b => b.cat === c).length;
          return (
            <button key={c} onClick={() => setCat(c)}
              style={{ padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.18)', background:cat===c?'#FFD700':'rgba(255,255,255,0.06)', color:cat===c?'#000':'#fff', fontWeight:700, fontSize:12, cursor:'pointer', transition:'all .15s' }}>
              {c} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
        {visible.map(bg => (
          <BgCard
            key={bg.id}
            bg={bg}
            isSelected={selected === bg.id}
            onSelect={() => setSelected(selected === bg.id ? null : bg.id)}
          />
        ))}
      </div>
    </div>
  );
}
