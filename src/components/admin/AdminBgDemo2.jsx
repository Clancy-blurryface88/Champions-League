import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── pattern overlays ──────────────────────────────────────────────────────── */
const P = {
  diag:   'repeating-linear-gradient(45deg,rgba(255,255,255,0.022) 0px,rgba(255,255,255,0.022) 1px,transparent 1px,transparent 12px)',
  diag60: 'repeating-linear-gradient(60deg,rgba(255,255,255,0.025) 0px,rgba(255,255,255,0.025) 1px,transparent 1px,transparent 16px)',
  hlines: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.028) 0px,rgba(255,255,255,0.028) 1px,transparent 1px,transparent 20px)',
  dots:   'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)',
  stars:  'radial-gradient(circle,rgba(255,255,255,0.45) 1px,transparent 1px)',
  grid:   'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
  vign:   'radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.55) 100%)',
};

/* ── 50 new backgrounds ────────────────────────────────────────────────────── */
const bgs = [

  /* ═══ MESH GRADIENTS  1–10 ════════════════════════════════════════════════
     3-point organic radial colour fields — no hard edges, pure depth         */
  { id:1,  cat:'Mesh', name:'Navy × Emerald',
    bg:'radial-gradient(at 15% 25%,#1a3060 0%,transparent 55%),radial-gradient(at 85% 75%,#0d3c1f 0%,transparent 55%),#050d1a',
    accent:'#4ade80', colors:['#1a3060','#0d3c1f','#050d1a'] },

  { id:2,  cat:'Mesh', name:'Crimson × Navy',
    bg:'radial-gradient(at 20% 80%,#2d0a0f 0%,transparent 55%),radial-gradient(at 80% 20%,#1a2f5e 0%,transparent 55%),#080308',
    accent:'#f87171', colors:['#2d0a0f','#1a2f5e','#080308'] },

  { id:3,  cat:'Mesh', name:'Teal × Violet',
    bg:'radial-gradient(at 30% 65%,#0d2820 0%,transparent 55%),radial-gradient(at 75% 30%,#1a0d2a 0%,transparent 55%),#050505',
    accent:'#34d399', colors:['#0d2820','#1a0d2a','#050505'] },

  { id:4,  cat:'Mesh', name:'Gold × Navy',
    bg:'radial-gradient(at 50% 0%,#2a1800 0%,transparent 55%),radial-gradient(at 10% 85%,#0d1f3c 0%,transparent 55%),#050505',
    accent:'#FFD700', colors:['#2a1800','#0d1f3c','#050505'] },

  { id:5,  cat:'Mesh', name:'Emerald × Teal',
    bg:'radial-gradient(at 80% 20%,#0d3c1f 0%,transparent 60%),radial-gradient(at 20% 80%,#0d2820 0%,transparent 60%),#030c06',
    accent:'#86efac', colors:['#0d3c1f','#0d2820','#030c06'] },

  { id:6,  cat:'Mesh', name:'Violet × Navy',
    bg:'radial-gradient(at 30% 30%,#1a0d2a 0%,transparent 55%),radial-gradient(at 70% 70%,#0d1f3c 0%,transparent 55%),#05030a',
    accent:'#a78bfa', colors:['#1a0d2a','#0d1f3c','#05030a'] },

  { id:7,  cat:'Mesh', name:'Amber × Crimson',
    bg:'radial-gradient(at 80% 80%,#2a1400 0%,transparent 55%),radial-gradient(at 20% 20%,#2d0a0f 0%,transparent 55%),#050505',
    accent:'#fbbf24', colors:['#2a1400','#2d0a0f','#050505'] },

  { id:8,  cat:'Mesh', name:'Cyan × Navy',
    bg:'radial-gradient(at 10% 50%,#0d2828 0%,transparent 60%),radial-gradient(at 90% 50%,#0d1f3c 0%,transparent 60%),#030d0d',
    accent:'#22d3ee', colors:['#0d2828','#0d1f3c','#030d0d'] },

  { id:9,  cat:'Mesh', name:'Triple Royal',
    bg:'radial-gradient(at 0% 0%,#0d1f3c 0%,transparent 50%),radial-gradient(at 100% 100%,#1a0d2a 0%,transparent 50%),radial-gradient(at 50% 100%,#0d1f3c 0%,transparent 40%),#030808',
    accent:'#FFD700', colors:['#0d1f3c','#1a0d2a','#030808'] },

  { id:10, cat:'Mesh', name:'Dark Trinity',
    bg:'radial-gradient(at 0% 0%,#0d1f3c 0%,transparent 50%),radial-gradient(at 100% 0%,#0d3c1f 0%,transparent 50%),radial-gradient(at 50% 100%,#1a0508 0%,transparent 55%),#050505',
    accent:'#4ade80', colors:['#0d1f3c','#0d3c1f','#1a0508'] },

  /* ═══ HARD GEOMETRY  11–18 ════════════════════════════════════════════════
     Sharp colour splits — no feathering, pure graphic design                 */
  { id:11, cat:'גיאומטריה', name:'Navy × Forest',
    bg:'linear-gradient(135deg,#050d1a 50%,#051a0d 50%)',
    accent:'#4ade80', colors:['#050d1a','#051a0d'] },

  { id:12, cat:'גיאומטריה', name:'Crimson × Navy',
    bg:'linear-gradient(135deg,#1a0508 50%,#050d1a 50%)',
    accent:'#f87171', colors:['#1a0508','#050d1a'] },

  { id:13, cat:'גיאומטריה', name:'Corner Slice',
    bg:'linear-gradient(225deg,#0d1f3c 0%,#0d1f3c 38%,#050d1a 38%)',
    pat:P.diag,
    accent:'#93c5fd', colors:['#0d1f3c','#050d1a'] },

  { id:14, cat:'גיאומטריה', name:'Triple Panel',
    bg:'linear-gradient(90deg,#050d1a 0% 33%,#051a0d 33% 66%,#1a0508 66% 100%)',
    accent:'#FFD700', colors:['#050d1a','#051a0d','#1a0508'] },

  { id:15, cat:'גיאומטריה', name:'Heavy Left',
    bg:'linear-gradient(100deg,#0d1f3c 0%,#0d1f3c 58%,#050d1a 58%)',
    pat:P.grid, patSz:'22px 22px',
    accent:'#60a5fa', colors:['#0d1f3c','#050d1a'] },

  { id:16, cat:'גיאומטריה', name:'Gold Strike',
    bg:'linear-gradient(18deg,#050d1a 0%,#050d1a 47%,#1a1200 48%,#1a1200 52%,#050d1a 53%)',
    accent:'#FFD700', colors:['#050d1a','#1a1200'] },

  { id:17, cat:'גיאומטריה', name:'Diagonal Thirds',
    bg:'linear-gradient(150deg,#050d1a 0% 33%,#051a0d 33% 66%,#050d1a 66% 100%)',
    accent:'#4ade80', colors:['#050d1a','#051a0d'] },

  { id:18, cat:'גיאומטריה', name:'Horizon',
    bg:'linear-gradient(180deg,#050d1a 0%,#050d1a 52%,#0d1f3c 52%)',
    pat:P.hlines,
    accent:'#93c5fd', colors:['#050d1a','#0d1f3c'] },

  /* ═══ AURORA ATMOSPHERIC  19–26 ═══════════════════════════════════════════
     Northern lights — thin horizontal gradient bands, ethereal              */
  { id:19, cat:'אורורה', name:'Aurora Borealis',
    bg:'linear-gradient(180deg,#0a001a 0%,#001a20 30%,#001a10 55%,#0a001a 100%)',
    pat:P.hlines,
    accent:'#34d399', colors:['#0a001a','#001a20','#001a10'] },

  { id:20, cat:'אורורה', name:'Arctic Blue',
    bg:'linear-gradient(180deg,#010815 0%,#021428 25%,#021c22 52%,#010815 100%)',
    pat:P.hlines,
    accent:'#38bdf8', colors:['#010815','#021c22'] },

  { id:21, cat:'אורורה', name:'Violet Aurora',
    bg:'linear-gradient(180deg,#0a0015 0%,#18002a 22%,#0a001e 48%,#050010 72%,#0a0015 100%)',
    pat:P.hlines,
    accent:'#c084fc', colors:['#0a0015','#18002a'] },

  { id:22, cat:'אורורה', name:'Cyan Night',
    bg:'linear-gradient(180deg,#020a0a 0%,#042020 26%,#031a18 52%,#020a0a 100%)',
    pat:P.hlines,
    accent:'#22d3ee', colors:['#020a0a','#042020'] },

  { id:23, cat:'אורורה', name:'Amber Dusk',
    bg:'linear-gradient(180deg,#0a0600 0%,#1a0e00 22%,#100900 52%,#0a0600 100%)',
    pat:P.hlines,
    accent:'#fbbf24', colors:['#0a0600','#1a0e00'] },

  { id:24, cat:'אורורה', name:'Indigo Wave',
    bg:'linear-gradient(180deg,#030315 0%,#0a0a28 22%,#060620 50%,#030315 100%)',
    pat:P.diag60,
    accent:'#818cf8', colors:['#030315','#0a0a28'] },

  { id:25, cat:'אורורה', name:'Teal Pulse',
    bg:'linear-gradient(180deg,#020f10 0%,#042828 24%,#031c1c 52%,#020f10 100%)',
    accent:'#2dd4bf', colors:['#020f10','#042828'] },

  { id:26, cat:'אורורה', name:'Warm Aurora',
    bg:'linear-gradient(180deg,#0a0305 0%,#1a0510 22%,#0d0308 52%,#0a0305 100%)',
    pat:P.hlines,
    accent:'#fb7185', colors:['#0a0305','#1a0510'] },

  /* ═══ WARM LUXURY  27–34 ══════════════════════════════════════════════════
     Amber, bourbon, terracotta — completely different palette                */
  { id:27, cat:'חום/יוקרה', name:'Dark Amber',
    bg:'radial-gradient(ellipse at 50% 0%,#2a1600 0%,#0a0700 70%)',
    accent:'#fbbf24', colors:['#2a1600','#0a0700'] },

  { id:28, cat:'חום/יוקרה', name:'Bourbon',
    bg:'linear-gradient(160deg,#180c00 0%,#2a1400 50%,#180c00 100%)',
    accent:'#d97706', colors:['#180c00','#2a1400'] },

  { id:29, cat:'חום/יוקרה', name:'Cognac',
    bg:'radial-gradient(circle at 60% 40%,#241000 0%,#0a0400 70%)',
    accent:'#f59e0b', colors:['#241000','#0a0400'] },

  { id:30, cat:'חום/יוקרה', name:'Dark Velvet Rouge',
    bg:'linear-gradient(135deg,#1a0010 0%,#2d0020 50%,#1a0010 100%)',
    pat:P.diag,
    accent:'#e879f9', colors:['#1a0010','#2d0020'] },

  { id:31, cat:'חום/יוקרה', name:'Caramel',
    bg:'linear-gradient(160deg,#1a1000 0%,#2a1800 50%,#1a1000 100%)',
    pat:P.diag,
    accent:'#fcd34d', colors:['#1a1000','#2a1800'] },

  { id:32, cat:'חום/יוקרה', name:'Bronze Radial',
    bg:'radial-gradient(ellipse at 30% 30%,#2a1800 0%,#0a0a0a 70%)',
    accent:'#d97706', colors:['#2a1800','#0a0a0a'] },

  { id:33, cat:'חום/יוקרה', name:'Mahogany',
    bg:'linear-gradient(200deg,#1a0800 0%,#100500 50%,#1a0800 100%)',
    accent:'#b45309', colors:['#1a0800','#100500'] },

  { id:34, cat:'חום/יוקרה', name:'Terracotta Night',
    bg:'linear-gradient(160deg,#1a0800 0%,#200d04 50%,#1a0800 100%)',
    pat:P.dots, patSz:'20px 20px',
    accent:'#fb923c', colors:['#1a0800','#200d04'] },

  /* ═══ DEEP SPACE / VOID  35–42 ════════════════════════════════════════════
     Near-black + sparse dots simulating stars — vast and mysterious          */
  { id:35, cat:'חלל/Void', name:'Star Field',
    bg:'linear-gradient(160deg,#020408 0%,#050d14 100%)',
    pat:P.stars, patSz:'40px 40px',
    accent:'#e2e8f0', colors:['#020408','#050d14'] },

  { id:36, cat:'חלל/Void', name:'Cosmic Indigo',
    bg:'radial-gradient(ellipse at 40% 60%,#0d0a1a 0%,#030308 70%)',
    pat:P.stars, patSz:'28px 28px',
    accent:'#818cf8', colors:['#0d0a1a','#030308'] },

  { id:37, cat:'חלל/Void', name:'Nebula Blue',
    bg:'radial-gradient(at 30% 50%,#080d20 0%,transparent 60%),radial-gradient(at 70% 50%,#040a18 0%,transparent 60%),#020408',
    pat:P.stars, patSz:'34px 34px',
    accent:'#60a5fa', colors:['#080d20','#020408'] },

  { id:38, cat:'חלל/Void', name:'Black Hole',
    bg:'radial-gradient(circle at center,#060614 0%,#000000 70%)',
    pat:P.stars, patSz:'50px 50px',
    accent:'#6366f1', colors:['#060614','#000000'] },

  { id:39, cat:'חלל/Void', name:'Stellar Navy',
    bg:'linear-gradient(200deg,#050d1a 0%,#020408 60%)',
    pat:P.stars, patSz:'36px 36px',
    accent:'#93c5fd', colors:['#050d1a','#020408'] },

  { id:40, cat:'חלל/Void', name:'Void Purple',
    bg:'linear-gradient(160deg,#0a0514 0%,#030208 100%)',
    pat:P.stars, patSz:'30px 30px',
    accent:'#a78bfa', colors:['#0a0514','#030208'] },

  { id:41, cat:'חלל/Void', name:'Space Teal',
    bg:'radial-gradient(ellipse at 20% 20%,#04141a 0%,#020508 70%)',
    pat:P.stars, patSz:'38px 38px',
    accent:'#2dd4bf', colors:['#04141a','#020508'] },

  { id:42, cat:'חלל/Void', name:'Dark Cosmos',
    bg:'radial-gradient(at 60% 40%,#080516 0%,transparent 55%),#020208',
    pat:P.stars, patSz:'32px 32px',
    accent:'#c084fc', colors:['#080516','#020208'] },

  /* ═══ EDGE GLOW  43–50 ════════════════════════════════════════════════════
     Near-black base, colour ONLY at edges / borders — premium spotlight     */
  { id:43, cat:'Edge Glow', name:'Navy Sides',
    bg:'radial-gradient(ellipse at 0% 50%,#1a2f5e 0%,transparent 50%),radial-gradient(ellipse at 100% 50%,#1a2f5e 0%,transparent 50%),#040810',
    accent:'#60a5fa', colors:['#1a2f5e','#040810'] },

  { id:44, cat:'Edge Glow', name:'Crimson Crown',
    bg:'radial-gradient(ellipse at 50% 0%,#2d0a0f 0%,transparent 55%),#050203',
    accent:'#f87171', colors:['#2d0a0f','#050203'] },

  { id:45, cat:'Edge Glow', name:'Emerald Frame',
    bg:'radial-gradient(ellipse at 0% 0%,#0d3c1f 0%,transparent 50%),radial-gradient(ellipse at 100% 100%,#0d3c1f 0%,transparent 50%),#020a04',
    accent:'#4ade80', colors:['#0d3c1f','#020a04'] },

  { id:46, cat:'Edge Glow', name:'Gold Halo',
    bg:'radial-gradient(ellipse at 50% 0%,#2a1800 0%,transparent 52%),radial-gradient(ellipse at 50% 100%,#1a1000 0%,transparent 52%),#050505',
    accent:'#FFD700', colors:['#2a1800','#050505'] },

  { id:47, cat:'Edge Glow', name:'Purple Veil',
    bg:'radial-gradient(ellipse at 100% 0%,#1a0d2a 0%,transparent 55%),radial-gradient(ellipse at 0% 100%,#1a0d2a 0%,transparent 55%),#050308',
    accent:'#a78bfa', colors:['#1a0d2a','#050308'] },

  { id:48, cat:'Edge Glow', name:'Teal Border',
    bg:'radial-gradient(ellipse at 50% 0%,#042828 0%,transparent 55%),radial-gradient(ellipse at 50% 100%,#042828 0%,transparent 55%),#020808',
    accent:'#2dd4bf', colors:['#042828','#020808'] },

  { id:49, cat:'Edge Glow', name:'Amber Rim',
    bg:'radial-gradient(ellipse at 0% 50%,#241000 0%,transparent 55%),radial-gradient(ellipse at 100% 50%,#241000 0%,transparent 55%),#050500',
    accent:'#fbbf24', colors:['#241000','#050500'] },

  { id:50, cat:'Edge Glow', name:'Royal Frame',
    bg:'radial-gradient(ellipse at 0% 0%,#0d1f3c 0%,transparent 45%),radial-gradient(ellipse at 100% 0%,#0d1f3c 0%,transparent 45%),radial-gradient(ellipse at 50% 100%,#051a0d 0%,transparent 50%),#030508',
    accent:'#FFD700', colors:['#0d1f3c','#051a0d','#030508'] },
];

/* ── categories ────────────────────────────────────────────────────────────── */
const CATS = ['הכול','Mesh','גיאומטריה','אורורה','חום/יוקרה','חלל/Void','Edge Glow'];

/* ── Full-page preview modal ────────────────────────────────────────────────── */
function FullPreview({ bg, onClose }) {
  return (
    <AnimatePresence>
      {bg && (
        <motion.div
          key="modal"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          onClick={onClose}
          style={{ position:'fixed', inset:0, zIndex:999, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)' }}
        >
          <motion.div
            initial={{ scale:.92, opacity:0 }}
            animate={{ scale:1, opacity:1 }}
            exit={{ scale:.92, opacity:0 }}
            transition={{ type:'spring', duration:.45, bounce:.15 }}
            onClick={e=>e.stopPropagation()}
            style={{ width:'min(90vw,640px)', height:'min(85vh,440px)', borderRadius:18, overflow:'hidden', position:'relative', background:bg.bg, boxShadow:`0 0 60px ${bg.accent}33,0 24px 60px rgba(0,0,0,0.7)` }}
          >
            {bg.pat && <div style={{ position:'absolute', inset:0, backgroundImage:bg.pat, backgroundSize:bg.patSz||'auto', pointerEvents:'none' }} />}
            <div style={{ position:'absolute', inset:0, padding:'32px', display:'flex', flexDirection:'column', justifyContent:'space-between', zIndex:1 }}>
              <div>
                <div style={{ color:bg.accent, fontSize:11, fontWeight:700, letterSpacing:3, opacity:.8, marginBottom:6 }}>WORLD CUP 2026</div>
                <div style={{ color:'#fff', fontSize:32, fontWeight:900, letterSpacing:-1, lineHeight:1 }}>STATISTICS</div>
                <div style={{ color:'rgba(255,255,255,0.4)', fontSize:13, marginTop:4 }}>Prediction Results Overview</div>
              </div>
              <div style={{ display:'flex', gap:12 }}>
                {[['24','נקודות',bg.accent],['8','פגיעות','#4ade80'],['67%','דיוק','rgba(255,255,255,0.6)'],['3rd','מיקום',bg.accent]].map(([v,l,c])=>(
                  <div key={l} style={{ flex:1, background:'rgba(255,255,255,0.07)', backdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'14px 10px', textAlign:'center' }}>
                    <div style={{ color:c, fontWeight:900, fontSize:22, lineHeight:1 }}>{v}</div>
                    <div style={{ color:'rgba(255,255,255,0.35)', fontSize:10, marginTop:4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'#fff', padding:'6px 12px', cursor:'pointer', fontSize:12, fontWeight:700, zIndex:2 }}>
              ✕ סגור
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Card ───────────────────────────────────────────────────────────────────── */
function BgCard({ bg, isSelected, onSelect, onPreview }) {
  const [hovered, setHovered] = useState(false);
  const [copied,  setCopied]  = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`background: ${bg.bg};`).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale:1.03 }}
      transition={{ type:'spring', stiffness:400, damping:26 }}
      style={{
        borderRadius:14, overflow:'hidden', cursor:'pointer',
        border: isSelected ? `2px solid ${bg.accent}` : '2px solid rgba(255,255,255,0.07)',
        boxShadow: isSelected ? `0 0 28px ${bg.accent}55` : '0 4px 20px rgba(0,0,0,0.5)',
        transition:'border-color .2s,box-shadow .2s',
      }}
    >
      {/* Preview */}
      <div style={{ height:164, position:'relative', background:bg.bg }}>
        {bg.pat && <div style={{ position:'absolute', inset:0, backgroundImage:bg.pat, backgroundSize:bg.patSz||'auto', pointerEvents:'none' }} />}

        {/* Mock content */}
        <div style={{ position:'absolute', inset:0, padding:'14px 16px', display:'flex', flexDirection:'column', justifyContent:'space-between', zIndex:1 }}>
          <div>
            <div style={{ color:bg.accent, fontSize:9, fontWeight:700, letterSpacing:2, opacity:.8 }}>WORLD CUP 2026</div>
            <div style={{ color:'#fff', fontSize:16, fontWeight:900, lineHeight:1, marginTop:3 }}>STATISTICS</div>
            <div style={{ color:'rgba(255,255,255,0.35)', fontSize:10, marginTop:2 }}>Predictions</div>
          </div>
          <div style={{ display:'flex', gap:5 }}>
            {[['24','Pts',bg.accent],['8','Exact','#4ade80'],['67%','Acc','rgba(255,255,255,0.5)']].map(([v,l,c])=>(
              <div key={l} style={{ flex:1, background:'rgba(255,255,255,0.07)', backdropFilter:'blur(12px) saturate(1.4)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'5px 6px', textAlign:'center' }}>
                <div style={{ color:c, fontWeight:900, fontSize:14, lineHeight:1 }}>{v}</div>
                <div style={{ color:'rgba(255,255,255,0.3)', fontSize:8, marginTop:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity:0 }}
          animate={{ opacity:hovered?1:0 }}
          transition={{ duration:.13 }}
          style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', display:'flex', alignItems:'center', justifyContent:'center', gap:8, zIndex:2 }}
        >
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale:.96 }}
            style={{ background:copied?'#22c55e':bg.accent, color:'#000', border:'none', borderRadius:7, padding:'7px 14px', fontWeight:800, fontSize:11, cursor:'pointer' }}
          >
            {copied ? '✓ הועתק' : 'העתק CSS'}
          </motion.button>
          <motion.button
            onClick={e=>{e.stopPropagation();onPreview();}}
            whileTap={{ scale:.96 }}
            style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)', borderRadius:7, padding:'7px 14px', fontWeight:800, fontSize:11, cursor:'pointer' }}
          >
            תצוגה מלאה
          </motion.button>
        </motion.div>

        {isSelected && (
          <div style={{ position:'absolute', top:10, right:10, width:20, height:20, borderRadius:'50%', background:bg.accent, display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 }}>
            <span style={{ color:'#000', fontSize:11, fontWeight:900, lineHeight:1 }}>✓</span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(8px)', padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ background:bg.accent, borderRadius:999, width:16, height:16, display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:8, fontWeight:900, color:'#000', flexShrink:0 }}>{bg.id}</span>
            <span style={{ color:'#fff', fontWeight:700, fontSize:12 }}>{bg.name}</span>
          </div>
          <div style={{ color:'rgba(255,255,255,0.28)', fontSize:9, marginTop:1, paddingLeft:21 }}>{bg.cat}</div>
        </div>
        <div style={{ display:'flex', gap:3 }}>
          {bg.colors.map(c=><div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c, border:'1.5px solid rgba(255,255,255,0.18)', flexShrink:0 }} />)}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────────── */
export default function AdminBgDemo2() {
  const [selected,  setSelected]  = useState(null);
  const [cat,       setCat]       = useState('הכול');
  const [previewBg, setPreviewBg] = useState(null);

  const visible    = cat === 'הכול' ? bgs : bgs.filter(b => b.cat === cat);
  const selectedBg = bgs.find(b => b.id === selected);

  return (
    <div dir="rtl" style={{ color:'#fff', fontFamily:'system-ui,sans-serif' }}>
      <FullPreview bg={previewBg} onClose={() => setPreviewBg(null)} />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:900, marginBottom:4 }}>50 רקעים — סדרה 2</h1>
          <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13 }}>
            Mesh Gradients · גיאומטריה · Aurora Bands · Edge Glow · חלל/Void · חום/יוקרה
          </p>
        </div>
        {selectedBg && (
          <div style={{ background:selectedBg.bg, border:`1px solid ${selectedBg.accent}55`, borderRadius:8, padding:'7px 14px', fontSize:10, color:'rgba(255,255,255,0.8)', fontFamily:'monospace', maxWidth:260, wordBreak:'break-all', lineHeight:1.5 }}>
            background: {selectedBg.bg};
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {CATS.map(c=>{
          const count = c==='הכול' ? bgs.length : bgs.filter(b=>b.cat===c).length;
          return (
            <button key={c} onClick={()=>setCat(c)}
              style={{ padding:'6px 14px', borderRadius:999, border:'1px solid rgba(255,255,255,0.18)', background:cat===c?'#FFD700':'rgba(255,255,255,0.06)', color:cat===c?'#000':'#fff', fontWeight:700, fontSize:12, cursor:'pointer', transition:'all .15s' }}>
              {c} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
        {visible.map(bg=>(
          <BgCard
            key={bg.id}
            bg={bg}
            isSelected={selected===bg.id}
            onSelect={()=>setSelected(selected===bg.id?null:bg.id)}
            onPreview={()=>setPreviewBg(bg)}
          />
        ))}
      </div>
    </div>
  );
}
