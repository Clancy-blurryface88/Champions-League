import React, { useState } from 'react';

const B = 'rgba(10,60,160,';   // blue
const J = 'rgba(0,95,80,';     // jade
const K = 'rgba(4,20,18,';     // near-black
const W = 'rgba(255,255,255,'; // white

const CARDS = [
  // ── 1-15: Linear gradients — direction & stop variations ────────────────────
  { id: 1,  name: 'Current (145° B→J→K)', style: { background:`linear-gradient(145deg,${B}0.85) 0%,${J}0.9) 45%,${K}0.98) 100%)`, border:'1px solid rgba(0,150,120,0.25)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 50px ${B}0.1),inset 0 1px 0 rgba(100,200,180,0.1)` }},
  { id: 2,  name: '135° B→J→K', style: { background:`linear-gradient(135deg,${B}0.85) 0%,${J}0.9) 50%,${K}0.98) 100%)`, border:'1px solid rgba(0,150,120,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.65)' }},
  { id: 3,  name: '180° top→bottom B→J', style: { background:`linear-gradient(180deg,${B}0.9) 0%,${J}0.85) 100%)`, border:'1px solid rgba(10,60,160,0.3)', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 4,  name: '90° left→right J→B', style: { background:`linear-gradient(90deg,${J}0.9) 0%,${B}0.85) 100%)`, border:'1px solid rgba(0,120,100,0.25)', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 5,  name: '45° diagonal B→K→J', style: { background:`linear-gradient(45deg,${B}0.9) 0%,${K}0.97) 50%,${J}0.85) 100%)`, border:'1px solid rgba(0,95,80,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 6,  name: '225° J→K→B', style: { background:`linear-gradient(225deg,${J}0.85) 0%,${K}0.97) 50%,${B}0.9) 100%)`, border:'1px solid rgba(10,60,160,0.25)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 7,  name: '160° B heavy', style: { background:`linear-gradient(160deg,${B}0.95) 0%,${B}0.6) 40%,${J}0.7) 70%,${K}0.98) 100%)`, border:'1px solid rgba(10,60,160,0.3)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 30px ${B}0.12)` }},
  { id: 8,  name: '160° J heavy', style: { background:`linear-gradient(160deg,${J}0.95) 0%,${J}0.7) 40%,${B}0.6) 70%,${K}0.98) 100%)`, border:'1px solid rgba(0,120,100,0.3)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 30px ${J}0.12)` }},
  { id: 9,  name: 'Symmetric B→J→B', style: { background:`linear-gradient(90deg,${B}0.85) 0%,${J}0.9) 50%,${B}0.85) 100%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 10, name: 'Symmetric J→B→J', style: { background:`linear-gradient(90deg,${J}0.85) 0%,${B}0.9) 50%,${J}0.85) 100%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 11, name: 'B→K narrow', style: { background:`linear-gradient(145deg,${B}0.9) 0%,${B}0.4) 30%,${K}0.99) 60%,${K}0.99) 100%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 12, name: 'J→K narrow', style: { background:`linear-gradient(145deg,${J}0.9) 0%,${J}0.4) 30%,${K}0.99) 60%,${K}0.99) 100%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 13, name: 'Very dark B tint', style: { background:`linear-gradient(145deg,${B}0.4) 0%,${K}0.99) 50%,${K}0.99) 100%)`, border:'1px solid rgba(10,60,160,0.15)', boxShadow:'0 8px 32px rgba(0,0,0,0.75)' }},
  { id: 14, name: 'Very dark J tint', style: { background:`linear-gradient(145deg,${J}0.4) 0%,${K}0.99) 50%,${K}0.99) 100%)`, border:'1px solid rgba(0,120,100,0.15)', boxShadow:'0 8px 32px rgba(0,0,0,0.75)' }},
  { id: 15, name: 'B+J flat 50/50', style: { background:`linear-gradient(90deg,${B}0.7) 0%,${B}0.7) 50%,${J}0.7) 50%,${J}0.7) 100%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }},

  // ── 16-30: Radial gradients ─────────────────────────────────────────────────
  { id: 16, name: 'Radial center B', style: { background:`radial-gradient(ellipse at center,${B}0.7) 0%,${K}0.98) 70%)`, border:'1px solid rgba(10,60,160,0.25)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 40px ${B}0.15)` }},
  { id: 17, name: 'Radial center J', style: { background:`radial-gradient(ellipse at center,${J}0.7) 0%,${K}0.98) 70%)`, border:'1px solid rgba(0,120,100,0.25)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 40px ${J}0.15)` }},
  { id: 18, name: 'Radial top B', style: { background:`radial-gradient(ellipse at top,${B}0.75) 0%,${K}0.98) 65%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 19, name: 'Radial top J', style: { background:`radial-gradient(ellipse at top,${J}0.75) 0%,${K}0.98) 65%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 20, name: 'Radial bottom B', style: { background:`radial-gradient(ellipse at bottom,${B}0.7) 0%,${K}0.98) 65%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 21, name: 'Radial bottom J', style: { background:`radial-gradient(ellipse at bottom,${J}0.7) 0%,${K}0.98) 65%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 22, name: 'Radial top-left B', style: { background:`radial-gradient(ellipse at top left,${B}0.8) 0%,${K}0.98) 65%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 23, name: 'Radial top-right J', style: { background:`radial-gradient(ellipse at top right,${J}0.8) 0%,${K}0.98) 65%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 24, name: 'Radial dual B+J', style: { background:`radial-gradient(ellipse at top left,${B}0.6) 0%,transparent 55%),radial-gradient(ellipse at bottom right,${J}0.6) 0%,transparent 55%),${K}0.97)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 25, name: 'Radial dual reverse', style: { background:`radial-gradient(ellipse at top right,${B}0.6) 0%,transparent 55%),radial-gradient(ellipse at bottom left,${J}0.6) 0%,transparent 55%),${K}0.97)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 26, name: 'Radial center B+J', style: { background:`radial-gradient(ellipse at 30% 40%,${B}0.6) 0%,transparent 50%),radial-gradient(ellipse at 70% 60%,${J}0.6) 0%,transparent 50%),${K}0.97)`, border:'1px solid rgba(0,120,100,0.18)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 27, name: 'Radial large soft B', style: { background:`radial-gradient(ellipse 120% 100% at 20% 20%,${B}0.5) 0%,${K}0.98) 70%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 28, name: 'Radial large soft J', style: { background:`radial-gradient(ellipse 120% 100% at 80% 80%,${J}0.5) 0%,${K}0.98) 70%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 29, name: 'Radial bright B center', style: { background:`radial-gradient(circle at center,${B}0.9) 0%,${B}0.3) 40%,${K}0.99) 70%)`, border:'1px solid rgba(10,60,160,0.3)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 50px ${B}0.2)` }},
  { id: 30, name: 'Radial bright J center', style: { background:`radial-gradient(circle at center,${J}0.9) 0%,${J}0.3) 40%,${K}0.99) 70%)`, border:'1px solid rgba(0,120,100,0.3)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 50px ${J}0.2)` }},

  // ── 31-45: Glassmorphism variations ─────────────────────────────────────────
  { id: 31, name: 'Glass B light', style: { background:`${B}0.15)`, backdropFilter:'blur(40px) saturate(180%)', border:'1px solid rgba(100,150,255,0.2)', boxShadow:'inset 0 1px 0 rgba(150,180,255,0.15),0 8px 32px rgba(0,0,0,0.5)' }},
  { id: 32, name: 'Glass J light', style: { background:`${J}0.15)`, backdropFilter:'blur(40px) saturate(180%)', border:'1px solid rgba(0,180,140,0.2)', boxShadow:'inset 0 1px 0 rgba(100,220,180,0.15),0 8px 32px rgba(0,0,0,0.5)' }},
  { id: 33, name: 'Glass B medium', style: { background:`${B}0.3)`, backdropFilter:'blur(30px) saturate(200%)', border:'1px solid rgba(80,130,240,0.25)', boxShadow:'inset 0 1px 0 rgba(150,180,255,0.12),0 8px 32px rgba(0,0,0,0.55)' }},
  { id: 34, name: 'Glass J medium', style: { background:`${J}0.3)`, backdropFilter:'blur(30px) saturate(200%)', border:'1px solid rgba(0,150,120,0.25)', boxShadow:'inset 0 1px 0 rgba(100,200,160,0.12),0 8px 32px rgba(0,0,0,0.55)' }},
  { id: 35, name: 'Glass B heavy', style: { background:`${B}0.5)`, backdropFilter:'blur(20px) saturate(220%)', border:'1px solid rgba(60,120,240,0.3)', boxShadow:'inset 0 1px 0 rgba(150,180,255,0.1),0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 36, name: 'Glass J heavy', style: { background:`${J}0.5)`, backdropFilter:'blur(20px) saturate(220%)', border:'1px solid rgba(0,130,110,0.3)', boxShadow:'inset 0 1px 0 rgba(100,200,160,0.1),0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 37, name: 'Glass B+J mix', style: { background:`linear-gradient(135deg,${B}0.25) 0%,${J}0.25) 100%)`, backdropFilter:'blur(40px) saturate(200%)', border:'1px solid rgba(100,200,180,0.2)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.08),0 8px 32px rgba(0,0,0,0.55)' }},
  { id: 38, name: 'Glass white tint', style: { background:`linear-gradient(135deg,${W}0.04) 0%,${B}0.2) 50%,${J}0.2) 100%)`, backdropFilter:'blur(40px) saturate(180%)', border:'1px solid rgba(255,255,255,0.1)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.12),0 8px 32px rgba(0,0,0,0.5)' }},
  { id: 39, name: 'Glass dark blur-60', style: { background:`${K}0.7)`, backdropFilter:'blur(60px) saturate(180%)', border:`1px solid ${B}0.2)`, boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06),0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 40, name: 'Glass B subtle', style: { background:`${B}0.08)`, backdropFilter:'blur(60px) saturate(250%)', border:'1px solid rgba(100,150,255,0.15)', boxShadow:'inset 0 1px 0 rgba(150,180,255,0.1),0 8px 40px rgba(0,0,0,0.5)' }},
  { id: 41, name: 'Frosted B thick', style: { background:`${B}0.35)`, backdropFilter:'blur(80px) brightness(0.7) saturate(200%)', border:'1px solid rgba(80,130,255,0.2)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07),0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 42, name: 'Frosted J thick', style: { background:`${J}0.35)`, backdropFilter:'blur(80px) brightness(0.7) saturate(200%)', border:'1px solid rgba(0,150,120,0.2)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.07),0 8px 32px rgba(0,0,0,0.6)' }},
  { id: 43, name: 'Glass B glow border', style: { background:`${B}0.2)`, backdropFilter:'blur(40px)', border:'1px solid rgba(100,160,255,0.4)', boxShadow:`inset 0 1px 0 rgba(150,180,255,0.12),0 8px 32px rgba(0,0,0,0.5),0 0 30px ${B}0.15)` }},
  { id: 44, name: 'Glass J glow border', style: { background:`${J}0.2)`, backdropFilter:'blur(40px)', border:'1px solid rgba(0,180,140,0.4)', boxShadow:`inset 0 1px 0 rgba(100,220,180,0.12),0 8px 32px rgba(0,0,0,0.5),0 0 30px ${J}0.15)` }},
  { id: 45, name: 'Glass gradient + blur', style: { background:`linear-gradient(145deg,${B}0.3) 0%,${K}0.8) 50%,${J}0.25) 100%)`, backdropFilter:'blur(36px) saturate(180%)', border:'1px solid rgba(100,200,180,0.18)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.08),0 8px 40px rgba(0,0,0,0.65)' }},

  // ── 46-58: Glow & neon effects ───────────────────────────────────────────────
  { id: 46, name: 'Neon B glow', style: { background:`${K}0.97)`, border:`1px solid ${B}0.6)`, boxShadow:`0 0 20px ${B}0.3),0 0 40px ${B}0.15),inset 0 0 20px ${B}0.05)` }},
  { id: 47, name: 'Neon J glow', style: { background:`${K}0.97)`, border:`1px solid ${J}0.6)`, boxShadow:`0 0 20px ${J}0.3),0 0 40px ${J}0.15),inset 0 0 20px ${J}0.05)` }},
  { id: 48, name: 'Neon dual B+J', style: { background:`${K}0.97)`, border:'1px solid rgba(50,200,160,0.4)', boxShadow:`0 0 20px ${B}0.2),0 0 20px ${J}0.2),inset 0 0 15px rgba(50,150,120,0.05)` }},
  { id: 49, name: 'Soft glow B', style: { background:`linear-gradient(145deg,${B}0.6) 0%,${K}0.97) 60%)`, border:`1px solid ${B}0.35)`, boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 60px ${B}0.2)` }},
  { id: 50, name: 'Soft glow J', style: { background:`linear-gradient(145deg,${J}0.6) 0%,${K}0.97) 60%)`, border:`1px solid ${J}0.35)`, boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 0 60px ${J}0.2)` }},
  { id: 51, name: 'Inner glow B', style: { background:`${K}0.95)`, border:`1px solid ${B}0.3)`, boxShadow:`inset 0 0 40px ${B}0.15),0 8px 32px rgba(0,0,0,0.7)` }},
  { id: 52, name: 'Inner glow J', style: { background:`${K}0.95)`, border:`1px solid ${J}0.3)`, boxShadow:`inset 0 0 40px ${J}0.15),0 8px 32px rgba(0,0,0,0.7)` }},
  { id: 53, name: 'Bottom glow B', style: { background:`linear-gradient(0deg,${B}0.35) 0%,${K}0.98) 55%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 4px 30px ${B}0.2)` }},
  { id: 54, name: 'Bottom glow J', style: { background:`linear-gradient(0deg,${J}0.35) 0%,${K}0.98) 55%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 4px 30px ${J}0.2)` }},
  { id: 55, name: 'Top glow B', style: { background:`linear-gradient(180deg,${B}0.35) 0%,${K}0.98) 55%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 -4px 30px ${B}0.15)` }},
  { id: 56, name: 'Top glow J', style: { background:`linear-gradient(180deg,${J}0.35) 0%,${K}0.98) 55%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:`0 8px 40px rgba(0,0,0,0.7),0 -4px 30px ${J}0.15)` }},
  { id: 57, name: 'Deep glow B+J', style: { background:`linear-gradient(145deg,${B}0.5) 0%,${K}0.98) 50%,${J}0.4) 100%)`, border:'1px solid rgba(50,180,150,0.25)', boxShadow:`0 8px 50px rgba(0,0,0,0.75),0 0 60px ${B}0.12),0 0 60px ${J}0.12)` }},
  { id: 58, name: 'Halo B', style: { background:`${K}0.96)`, border:`2px solid ${B}0.5)`, boxShadow:`0 0 0 4px ${B}0.08),0 8px 40px rgba(0,0,0,0.7),inset 0 1px 0 rgba(150,180,255,0.1)` }},

  // ── 59-68: Border & inset variations ────────────────────────────────────────
  { id: 59, name: 'Thin B border', style: { background:`linear-gradient(145deg,${B}0.7) 0%,${J}0.75) 50%,${K}0.98) 100%)`, border:`1px solid ${B}0.5)`, boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 60, name: 'Thick J border', style: { background:`linear-gradient(145deg,${B}0.7) 0%,${J}0.75) 50%,${K}0.98) 100%)`, border:`2px solid ${J}0.5)`, boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 61, name: 'Double border', style: { background:`linear-gradient(145deg,${B}0.7) 0%,${K}0.98) 60%)`, border:`1px solid ${B}0.4)`, outline:`1px solid ${J}0.2)`, outlineOffset:'3px', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 62, name: 'Top accent B', style: { background:`${K}0.97)`, borderTop:`2px solid ${B}0.7)`, borderLeft:`1px solid ${B}0.15)`, borderRight:`1px solid ${B}0.15)`, borderBottom:`1px solid ${B}0.1)`, boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 63, name: 'Top accent J', style: { background:`${K}0.97)`, borderTop:`2px solid ${J}0.7)`, borderLeft:`1px solid ${J}0.15)`, borderRight:`1px solid ${J}0.15)`, borderBottom:`1px solid ${J}0.1)`, boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 64, name: 'Top specular line', style: { background:`linear-gradient(145deg,${B}0.7) 0%,${J}0.75) 50%,${K}0.98) 100%)`, border:'1px solid rgba(255,255,255,0.07)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.15),0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 65, name: 'Inset B glow top', style: { background:`linear-gradient(145deg,${B}0.8) 0%,${K}0.98) 55%)`, border:`1px solid ${B}0.2)`, boxShadow:`inset 0 2px 8px ${B}0.25),0 8px 32px rgba(0,0,0,0.7)` }},
  { id: 66, name: 'Inset J glow top', style: { background:`linear-gradient(145deg,${J}0.8) 0%,${K}0.98) 55%)`, border:`1px solid ${J}0.2)`, boxShadow:`inset 0 2px 8px ${J}0.25),0 8px 32px rgba(0,0,0,0.7)` }},
  { id: 67, name: 'Raised card B', style: { background:`linear-gradient(145deg,${B}0.7) 0%,${K}0.98) 60%)`, border:`1px solid ${B}0.3)`, boxShadow:`0 16px 48px rgba(0,0,0,0.8),0 4px 0 ${B}0.4)` }},
  { id: 68, name: 'Sunken card J', style: { background:`linear-gradient(145deg,${J}0.7) 0%,${K}0.98) 60%)`, border:`1px solid ${J}0.25)`, boxShadow:`inset 0 4px 16px rgba(0,0,0,0.5),0 2px 8px rgba(0,0,0,0.4)` }},

  // ── 69-78: Opacity & darkness variations ─────────────────────────────────────
  { id: 69, name: 'Very transparent B', style: { background:`linear-gradient(145deg,${B}0.3) 0%,${J}0.25) 50%,${K}0.6) 100%)`, backdropFilter:'blur(24px)', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }},
  { id: 70, name: 'Very opaque', style: { background:`linear-gradient(145deg,${B}0.95) 0%,${J}0.95) 50%,${K}1) 100%)`, border:'1px solid rgba(0,120,100,0.3)', boxShadow:'0 8px 40px rgba(0,0,0,0.8)' }},
  { id: 71, name: 'Near black B hint', style: { background:`linear-gradient(145deg,${B}0.25) 0%,${K}0.99) 40%)`, border:`1px solid ${B}0.15)`, boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }},
  { id: 72, name: 'Near black J hint', style: { background:`linear-gradient(145deg,${J}0.25) 0%,${K}0.99) 40%)`, border:`1px solid ${J}0.15)`, boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }},
  { id: 73, name: 'Saturated B', style: { background:`linear-gradient(145deg,${B}0.9) 0%,${J}0.8) 50%,${K}0.99) 100%)`, backdropFilter:'saturate(250%)', border:'1px solid rgba(0,150,120,0.3)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 74, name: 'Desaturated', style: { background:`linear-gradient(145deg,rgba(30,50,80,0.85) 0%,rgba(20,45,40,0.9) 50%,rgba(5,10,10,0.98) 100%)`, backdropFilter:'saturate(60%)', border:'1px solid rgba(80,100,100,0.25)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 75, name: 'Bright B vivid', style: { background:`linear-gradient(145deg,rgba(20,80,220,0.9) 0%,rgba(0,120,100,0.85) 50%,${K}0.98) 100%)`, border:'1px solid rgba(0,150,130,0.3)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 76, name: 'Muted J+B', style: { background:`linear-gradient(145deg,rgba(8,45,120,0.7) 0%,rgba(0,70,60,0.75) 50%,${K}0.97) 100%)`, border:'1px solid rgba(0,100,80,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 77, name: 'B tinted noise', style: { background:`linear-gradient(145deg,${B}0.7) 0%,${K}0.97) 60%)`, backgroundBlendMode:'overlay', border:`1px solid ${B}0.25)`, boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 78, name: 'Ink wash', style: { background:`radial-gradient(ellipse at 30% 20%,${B}0.4) 0%,transparent 60%),radial-gradient(ellipse at 70% 80%,${J}0.35) 0%,transparent 60%),${K}0.98)`, border:'1px solid rgba(80,160,140,0.15)', boxShadow:'0 8px 40px rgba(0,0,0,0.75)' }},

  // ── 79-88: Mesh & layered gradients ─────────────────────────────────────────
  { id: 79, name: 'Mesh 3-point', style: { background:`radial-gradient(at 0% 0%,${B}0.55) 0px,transparent 50%),radial-gradient(at 100% 100%,${J}0.55) 0px,transparent 50%),radial-gradient(at 50% 50%,${K}0.8) 0px,transparent 60%),${K}0.97)`, border:'1px solid rgba(50,150,130,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 80, name: 'Mesh 4-point', style: { background:`radial-gradient(at 0% 0%,${B}0.5) 0px,transparent 45%),radial-gradient(at 100% 0%,${J}0.4) 0px,transparent 45%),radial-gradient(at 100% 100%,${B}0.4) 0px,transparent 45%),radial-gradient(at 0% 100%,${J}0.5) 0px,transparent 45%),${K}0.97)`, border:'1px solid rgba(50,150,130,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 81, name: 'Stripe subtle', style: { background:`repeating-linear-gradient(135deg,${B}0.08) 0px,${B}0.08) 1px,transparent 1px,transparent 14px),linear-gradient(145deg,${B}0.6) 0%,${K}0.97) 60%)`, border:'1px solid rgba(10,60,160,0.25)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 82, name: 'Stripe J subtle', style: { background:`repeating-linear-gradient(135deg,${J}0.08) 0px,${J}0.08) 1px,transparent 1px,transparent 14px),linear-gradient(145deg,${J}0.6) 0%,${K}0.97) 60%)`, border:'1px solid rgba(0,120,100,0.25)', boxShadow:'0 8px 32px rgba(0,0,0,0.7)' }},
  { id: 83, name: 'Layered lin+radial', style: { background:`radial-gradient(ellipse at top left,${B}0.5) 0%,transparent 55%),linear-gradient(160deg,${K}0.7) 0%,${J}0.6) 100%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 84, name: 'Layered lin+radial 2', style: { background:`radial-gradient(ellipse at bottom right,${J}0.5) 0%,transparent 55%),linear-gradient(160deg,${B}0.7) 0%,${K}0.97) 100%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 85, name: 'Conic tint', style: { background:`conic-gradient(from 200deg at 30% 40%,${B}0.4) 0deg,${J}0.35) 120deg,${K}0.97) 240deg,${B}0.4) 360deg)`, border:'1px solid rgba(50,150,130,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 86, name: 'Horizontal bands', style: { background:`linear-gradient(180deg,${B}0.7) 0%,${B}0.7) 33%,${J}0.7) 33%,${J}0.7) 66%,${K}0.95) 66%,${K}0.95) 100%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.65)' }},
  { id: 87, name: 'Spotlight center', style: { background:`radial-gradient(circle 80px at 50% 40%,rgba(100,180,255,0.2) 0%,transparent 100%),linear-gradient(145deg,${B}0.7) 0%,${K}0.98) 55%,${J}0.6) 100%)`, border:'1px solid rgba(100,180,255,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 88, name: 'Dual spotlight', style: { background:`radial-gradient(circle 60px at 25% 30%,${B}0.4) 0%,transparent 100%),radial-gradient(circle 60px at 75% 70%,${J}0.4) 0%,transparent 100%),${K}0.97)`, border:'1px solid rgba(50,150,130,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},

  // ── 89-100: Unique & special ─────────────────────────────────────────────────
  { id: 89,  name: 'Carbon B', style: { background:`repeating-linear-gradient(45deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 8px),linear-gradient(145deg,${B}0.7) 0%,${K}0.99) 60%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }},
  { id: 90,  name: 'Carbon J', style: { background:`repeating-linear-gradient(45deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 8px),linear-gradient(145deg,${J}0.7) 0%,${K}0.99) 60%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }},
  { id: 91,  name: 'Vignette B', style: { background:`radial-gradient(ellipse at center,${B}0.5) 0%,${B}0.3) 40%,${K}1) 80%)`, border:'1px solid rgba(10,60,160,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }},
  { id: 92,  name: 'Vignette J', style: { background:`radial-gradient(ellipse at center,${J}0.5) 0%,${J}0.3) 40%,${K}1) 80%)`, border:'1px solid rgba(0,120,100,0.2)', boxShadow:'0 8px 32px rgba(0,0,0,0.8)' }},
  { id: 93,  name: 'Holographic', style: { background:`linear-gradient(135deg,${B}0.6) 0%,rgba(0,180,180,0.5) 33%,${J}0.6) 66%,${B}0.5) 100%)`, border:'1px solid rgba(100,220,200,0.3)', boxShadow:'0 8px 40px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.1)' }},
  { id: 94,  name: 'Deep ocean', style: { background:`linear-gradient(160deg,rgba(5,40,120,0.92) 0%,rgba(0,70,80,0.9) 50%,rgba(2,15,25,0.99) 100%)`, border:'1px solid rgba(0,100,120,0.3)', boxShadow:'0 8px 40px rgba(0,0,10,0.85)' }},
  { id: 95,  name: 'Northern lights', style: { background:`linear-gradient(160deg,rgba(5,80,120,0.6) 0%,rgba(0,100,80,0.55) 35%,${K}0.97) 60%,rgba(0,60,80,0.4) 100%)`, border:'1px solid rgba(0,150,130,0.2)', boxShadow:'0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 96,  name: 'Matte dark B', style: { background:`${B}0.55)`, border:'none', boxShadow:'0 12px 40px rgba(0,0,0,0.8)' }},
  { id: 97,  name: 'Matte dark J', style: { background:`${J}0.55)`, border:'none', boxShadow:'0 12px 40px rgba(0,0,0,0.8)' }},
  { id: 98,  name: 'B+J specular', style: { background:`linear-gradient(145deg,${B}0.75) 0%,${J}0.8) 50%,${K}0.98) 100%)`, border:'1px solid rgba(255,255,255,0.06)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.18),inset 0 -1px 0 rgba(0,0,0,0.3),0 8px 40px rgba(0,0,0,0.7)' }},
  { id: 99,  name: 'Full glass B+J', style: { background:`linear-gradient(145deg,${B}0.22) 0%,${J}0.2) 50%,${K}0.55) 100%)`, backdropFilter:'blur(60px) saturate(220%) brightness(0.85)', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.12),0 8px 40px rgba(0,0,0,0.5)' }},
  { id: 100, name: 'Aurora depth', style: { background:`radial-gradient(ellipse at 20% 10%,${B}0.6) 0%,transparent 50%),radial-gradient(ellipse at 80% 90%,${J}0.55) 0%,transparent 50%),radial-gradient(ellipse at 50% 50%,${K}0.9) 0%,${K}1) 70%)`, backdropFilter:'blur(20px)', border:'1px solid rgba(80,200,170,0.15)', boxShadow:`0 8px 50px rgba(0,0,0,0.75),0 0 80px ${B}0.08)` }},
];

function MiniCard({ card, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-[2px] transition-all duration-200 ${selected ? 'ring-2 ring-yellow-400 scale-105' : 'hover:ring-1 hover:ring-white/20'}`}
    >
      <div className="rounded-xl overflow-hidden h-full flex flex-col relative" style={card.style}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'150px' }} />
        <div className="p-2.5 flex flex-col gap-1.5 relative">
          <div className="flex justify-center">
            <span className="text-[8px] font-semibold text-yellow-400 border border-yellow-400/40 rounded-full px-1.5 py-0.5">Group A</span>
          </div>
          <div className="flex items-center justify-between px-0.5">
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[9px]">🇨🇿</div>
              <span className="text-[7px] text-white/60">CZE</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily:"'Bebas Neue',sans-serif" }}>2</div>
              <span className="text-white/40 text-[9px]">-</span>
              <div className="w-6 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white" style={{ fontFamily:"'Bebas Neue',sans-serif" }}>0</div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[9px]">🇿🇦</div>
              <span className="text-[7px] text-white/60">RSA</span>
            </div>
          </div>
          <div className="text-center text-[7px] text-white/30">18/06 · 19:00</div>
          <div className="text-center text-[8px] font-semibold text-white/70 leading-tight truncate px-1">{card.name}</div>
        </div>
        {selected && <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-yellow-400 flex items-center justify-center"><span className="text-[6px] text-black font-black">✓</span></div>}
      </div>
    </div>
  );
}

export default function AdminCardBgDemo() {
  const [selected, setSelected] = useState(1);
  const cur = CARDS.find(c => c.id === selected);

  return (
    <div className="space-y-6 text-white">
      <div>
        <h2 className="text-2xl font-bold">🎨 Card Background Demo — 100 קונספטים</h2>
        <p className="text-slate-400 text-sm mt-1">פלטת כחול + jade. לחץ לבחירה — הנבחר מסומן בצהוב.</p>
      </div>

      {/* Large preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-72 rounded-2xl overflow-hidden relative" style={cur.style}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize:'180px' }} />
          <div className="p-5 flex flex-col gap-3 relative">
            <div className="flex justify-center">
              <span className="text-xs font-semibold text-yellow-400 border border-yellow-400/50 rounded-full px-3 py-1">Group A</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">🇨🇿</div>
                <span className="text-xs text-white/80 font-medium">Czechia</span>
                <span className="text-[9px] text-white/40">(Home)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-16 rounded-xl bg-white/10 flex items-center justify-center text-4xl font-bold text-white" style={{ fontFamily:"'Bebas Neue',sans-serif" }}>2</div>
                <span className="text-white/40 text-xl">-</span>
                <div className="w-12 h-16 rounded-xl bg-white/10 flex items-center justify-center text-4xl font-bold text-white" style={{ fontFamily:"'Bebas Neue',sans-serif" }}>0</div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-2xl">🇿🇦</div>
                <span className="text-xs text-white/80 font-medium">South Africa</span>
                <span className="text-[9px] text-white/40">(Away)</span>
              </div>
            </div>
            <div className="text-center text-xs text-white/40">18/06/2026 · 19:00 · Atlanta</div>
          </div>
        </div>
        <p className="text-sm"><span className="text-yellow-400 font-bold">#{selected}</span> <span className="text-white/70">{cur.name}</span></p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {CARDS.map(c => (
          <MiniCard key={c.id} card={c} selected={selected === c.id} onClick={() => setSelected(c.id)} />
        ))}
      </div>

      {/* CSS output */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
        <p className="text-slate-400 text-xs mb-2 font-mono">style object — #{selected} {cur.name}</p>
        <pre className="text-green-400 text-xs font-mono overflow-auto whitespace-pre-wrap">{JSON.stringify(cur.style, null, 2)}</pre>
      </div>
    </div>
  );
}
