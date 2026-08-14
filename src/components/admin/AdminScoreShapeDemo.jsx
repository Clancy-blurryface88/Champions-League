import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

// Demo-only: 40 alternative shapes/frames for the tile that holds a single
// team's predicted goal count (the "ellipse around the score picker" the
// admin asked about). The interaction (chevron +/- stepper) stays constant
// across variants — the visual difference is purely the container shape.
// Mock, self-contained local state per variant, fully interactive.
// Doesn't touch ScoreInput.jsx, Predictions.jsx or AdminScoreInputDemo.jsx.

const HOME = '#097adc';
const AWAY = '#8b5cf6';
const BG = '#050a12'; // matches Frame's preview background — used for cutout "notch" tricks

function clamp(v, min = 0, max = 9) { return Math.max(min, Math.min(max, v)); }

function useReplay() {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}

function Frame({ label, desc, children }) {
  const [replay, bump] = useReplay();
  return (
    <div className="bg-slate-800/40 border border-white/8 rounded-2xl p-4 flex flex-col gap-2">
      <div className="rounded-xl overflow-hidden p-3 flex items-center justify-center" style={{ background: BG, minHeight: 170 }}>
        {children(replay)}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0"><div className="text-white text-xs font-bold">{label}</div><div className="text-slate-500 text-[10px]">{desc}</div></div>
        <button onClick={bump} className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-full bg-white/6 border border-white/10 text-slate-300 hover:bg-white/12">
          <RefreshCw className="w-3 h-3" /> הצג שוב
        </button>
      </div>
    </div>
  );
}

// ---- shared primitives ----

// Animated flip digit, reused inside every shape
function Digit({ value, color = '#fff', size = 28 }) {
  return (
    <div style={{ perspective: 200 }}>
      <AnimatePresence mode="popLayout">
        <motion.span key={value} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: size, color, display: 'inline-block', lineHeight: 1, userSelect: 'none' }}>
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// Chevron up/down stepper wrapping any shape tile
function Stepper({ value, onChange, color, children }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button onClick={() => onChange(clamp(value + 1))} className="hover:opacity-70">
        <ChevronUp className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
      </button>
      {children}
      <button onClick={() => onChange(clamp(value - 1))} className="hover:opacity-70">
        <ChevronDown className="w-4 h-4" style={{ color }} strokeWidth={2.5} />
      </button>
    </div>
  );
}

// Renders both team tiles side by side, sharing one Tile component + local state
function TwoTiles({ Tile, a, setA, b, setB, gap = 18 }) {
  return (
    <div className="flex items-center" style={{ gap }}>
      <Stepper value={a} onChange={setA} color={HOME}><Tile value={a} color={HOME} /></Stepper>
      <Stepper value={b} onChange={setB} color={AWAY}><Tile value={b} color={AWAY} /></Stepper>
    </div>
  );
}

// Generic helper for clip-path shapes: draws a thin "frame" by layering a
// colored outer clipped box behind a slightly inset, same-clipped fill box —
// a plain CSS border looks broken on diagonal clip-path edges, this doesn't.
function ClipTile({ value, color, clipPath, width, height, digitSize = 24, borderWidth = 2, fill = 'rgba(255,255,255,0.07)', extraInnerStyle }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width, height, clipPath, background: color }}>
      <div className="absolute flex items-center justify-center" style={{ inset: borderWidth, clipPath, background: fill, ...extraInnerStyle }} />
      <div className="relative"><Digit value={value} size={digitSize} /></div>
    </div>
  );
}

// ================= The 20 shapes =================

// 1. Baseline — the real ScoreInput.jsx split-flap glass tile
function BaselineTile({ value }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: 44, height: 74, borderRadius: 20,
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(16px) saturate(140%)', border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.25)' }}>
      <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)' }} />
      <Digit value={value} size={32} />
      <div className="absolute left-0 right-0 top-1/2 h-px pointer-events-none" style={{ background: 'rgba(0,0,0,0.55)', boxShadow: '0 1px 0 rgba(255,255,255,0.08)' }} />
      <div className="absolute inset-x-0 top-1/2 bottom-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.14) 0%, transparent 35%)' }} />
    </div>
  );
}

// 2. True ellipse/oval — wide flattened oval
function OvalTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 76, height: 46, borderRadius: '50%',
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}>
      <Digit value={value} size={26} />
    </div>
  );
}

// 3. Perfect circle
function CircleTile({ value, color }) {
  return (
    <div className="rounded-full flex items-center justify-center" style={{ width: 56, height: 56, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={28} />
    </div>
  );
}

// 4. Capsule/pill — stadium shape
function PillTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 40, height: 68, borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={30} />
    </div>
  );
}

// 5. Hexagon
function HexagonTile({ value, color }) {
  return <ClipTile value={value} color={color} width={56} height={62} digitSize={26}
    clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" />;
}

// 6. Shield / club-crest silhouette
function ShieldTile({ value, color }) {
  return <ClipTile value={value} color={color} width={54} height={68} digitSize={24}
    clipPath="polygon(15% 0%, 85% 0%, 100% 10%, 100% 45%, 85% 75%, 50% 100%, 15% 75%, 0% 45%, 0% 10%)" />;
}

// 7. Diamond/rhombus — rotated square, digit stays upright
function DiamondTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <div className="absolute" style={{ inset: 4, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88`, borderRadius: 8, transform: 'rotate(45deg)' }} />
      <div className="relative"><Digit value={value} size={26} /></div>
    </div>
  );
}

// 8. Chamfered / cut-corner octagon
function ChamferedTile({ value, color }) {
  return <ClipTile value={value} color={color} width={56} height={56} digitSize={26}
    clipPath="polygon(22% 0%, 78% 0%, 100% 22%, 100% 78%, 78% 100%, 22% 100%, 0% 78%, 0% 22%)" />;
}

// 9. Ribbon/banner — pointed notch tail at the bottom
function RibbonTile({ value, color }) {
  return <ClipTile value={value} color={color} width={54} height={66} digitSize={24}
    clipPath="polygon(0% 0%, 100% 0%, 100% 78%, 50% 62%, 0% 78%)" />;
}

// 10. Speech-bubble / callout — rounded tile with a small downward tail
function CalloutTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 54, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={26} />
      <div className="absolute" style={{
        bottom: -7, left: '50%', width: 12, height: 12, marginLeft: -6, background: 'rgba(255,255,255,0.06)',
        border: `1px solid ${color}88`, borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)',
      }} />
    </div>
  );
}

// 11. Ticket-stub — semi-circle notches on left/right edges (movie-ticket look)
function TicketTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <div className="absolute rounded-full" style={{ width: 15, height: 15, left: -8, top: '50%', marginTop: -7.5, background: BG }} />
      <div className="absolute rounded-full" style={{ width: 15, height: 15, right: -8, top: '50%', marginTop: -7.5, background: BG }} />
      <div className="absolute" style={{ left: 15, top: 6, bottom: 6, borderLeft: `1px dashed ${color}66` }} />
      <div className="absolute" style={{ right: 15, top: 6, bottom: 6, borderLeft: `1px dashed ${color}66` }} />
      <Digit value={value} size={24} />
    </div>
  );
}

// 12. Jersey-number patch — rounded badge with a dashed "stitched" inner border
function PatchTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 12,
      background: `linear-gradient(160deg, ${color}30, rgba(255,255,255,0.04))`, border: `2px solid ${color}` }}>
      <div className="absolute rounded-lg pointer-events-none" style={{ inset: 5, border: `1px dashed ${color}aa` }} />
      <Digit value={value} size={24} />
    </div>
  );
}

// 13. LED-scoreboard bezel — thick dark housing, corner rivets, recessed panel
function BezelTile({ value, color }) {
  const rivet = (style) => <div className="absolute rounded-full" style={{ width: 4, height: 4, background: '#4a5568', ...style }} />;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 62, height: 70, borderRadius: 6, background: '#181d29', border: '2px solid #2c3444' }}>
      {rivet({ top: 5, left: 5 })}{rivet({ top: 5, right: 5 })}{rivet({ bottom: 5, left: 5 })}{rivet({ bottom: 5, right: 5 })}
      <div className="flex items-center justify-center" style={{ width: 40, height: 50, borderRadius: 3, background: '#000', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.85)' }}>
        <Digit value={value} size={28} color={color === HOME ? '#22ff66' : '#ffb020'} />
      </div>
    </div>
  );
}

// 14. Double-ring halo — circular tile plus a glowing separated outer ring
function HaloTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 72, height: 72 }}>
      <div className="absolute rounded-full" style={{ inset: 0, border: `1px solid ${color}66`, filter: `drop-shadow(0 0 4px ${color}aa)` }} />
      <div className="rounded-full flex items-center justify-center" style={{ width: 50, height: 50, background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}` }}>
        <Digit value={value} size={26} />
      </div>
    </div>
  );
}

// 15. Vesica-piscis / lens — two overlapping circle arcs meeting in points
function LensTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" style={{ position: 'absolute', inset: 0 }}>
        <path d="M32,4 A34,34 0 0,1 32,60 A34,34 0 0,1 32,4 Z" fill="rgba(255,255,255,0.07)" stroke={color} strokeWidth="1.5" />
      </svg>
      <div className="relative"><Digit value={value} size={24} /></div>
    </div>
  );
}

// 16. Torn-paper edge — irregular jagged outline
const TORN_PATH = 'polygon(4% 10%, 18% 2%, 30% 11%, 45% 2%, 60% 9%, 76% 1%, 92% 8%, 100% 22%, 93% 36%, 100% 50%, 92% 64%, 100% 79%, 90% 93%, 74% 100%, 58% 92%, 44% 100%, 28% 91%, 12% 100%, 3% 87%, 9% 71%, 0% 55%, 7% 40%, 1% 25%)';
function TornTile({ value, color }) {
  return <ClipTile value={value} color={color} width={60} height={62} digitSize={24} borderWidth={1.5} clipPath={TORN_PATH} />;
}

// 17. Porthole / film-reel — circle with small tick marks around the rim
function PortholeTile({ value, color }) {
  const N = 10;
  return (
    <div className="relative flex items-center justify-center rounded-full" style={{ width: 60, height: 60, background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      {Array.from({ length: N }).map((_, i) => {
        const ang = (i / N) * 2 * Math.PI;
        const x = 30 + Math.cos(ang) * 30, y = 30 + Math.sin(ang) * 30;
        return <div key={i} className="absolute rounded-full" style={{ width: 3, height: 3, left: x - 1.5, top: y - 1.5, background: `${color}cc` }} />;
      })}
      <Digit value={value} size={26} />
    </div>
  );
}

// 18. Pentagon / arrow-cut — pointed upward, road-sign-like
function PentagonTile({ value, color }) {
  return <ClipTile value={value} color={color} width={58} height={60} digitSize={24}
    clipPath="polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" />;
}

// 19. Soccer-ball honeycomb panel — hexagon with an embossed/beveled edge
function HoneycombTile({ value, color }) {
  return <ClipTile value={value} color={color} width={58} height={64} digitSize={26}
    clipPath="polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)"
    extraInnerStyle={{ boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.35), inset 0 -4px 6px rgba(0,0,0,0.55)' }} />;
}

// 20. Neon-outline-only ellipse — no fill, glowing colored stroke
function NeonTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 72, height: 46, borderRadius: '50%', background: 'transparent',
      border: `2px solid ${color}`, boxShadow: `0 0 8px ${color}, 0 0 18px ${color}77, inset 0 0 10px ${color}44` }}>
      <Digit value={value} size={26} />
    </div>
  );
}

// ================= 20 more shapes (21-40) =================

// 21. Square jersey-number block — sharp corners, no rounding
function SquareTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 54, height: 66, borderRadius: 0,
      background: 'rgba(255,255,255,0.06)', border: `2px solid ${color}` }}>
      <Digit value={value} size={30} />
    </div>
  );
}

// 22. Sticker/die-cut card — thick white "rim" + drop shadow, vinyl-sticker look
function StickerTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 14, background: color,
      border: '4px solid rgba(255,255,255,0.92)', boxShadow: '0 6px 14px rgba(0,0,0,0.45)' }}>
      <Digit value={value} size={26} />
    </div>
  );
}

// 23. Football-skin circle — pentagon seam lines drawn behind the digit
function FootballSkinTile({ value, color }) {
  return (
    <div className="relative rounded-full flex items-center justify-center overflow-hidden" style={{ width: 60, height: 60, background: '#f2f0e8', border: `1px solid ${color}66` }}>
      <svg width="60" height="60" style={{ position: 'absolute', inset: 0 }} opacity="0.55">
        <polygon points="30,12 41,20 37,33 23,33 19,20" fill="none" stroke="#222" strokeWidth="1.5" />
        <line x1="30" y1="12" x2="30" y2="1" stroke="#222" strokeWidth="1.5" />
        <line x1="41" y1="20" x2="53" y2="15" stroke="#222" strokeWidth="1.5" />
        <line x1="37" y1="33" x2="44" y2="47" stroke="#222" strokeWidth="1.5" />
        <line x1="23" y1="33" x2="16" y2="47" stroke="#222" strokeWidth="1.5" />
        <line x1="19" y1="20" x2="7" y2="15" stroke="#222" strokeWidth="1.5" />
      </svg>
      <div className="relative"><Digit value={value} size={24} color={color} /></div>
    </div>
  );
}

// 24. Trophy silhouette — clip-path cup outline behind the digit
const TROPHY_PATH = 'polygon(15% 0%, 85% 0%, 85% 20%, 68% 38%, 58% 45%, 58% 65%, 72% 68%, 72% 82%, 28% 82%, 28% 68%, 42% 65%, 42% 45%, 32% 38%, 15% 20%)';
function TrophyTile({ value, color }) {
  return <ClipTile value={value} color={color} width={50} height={72} digitSize={22} borderWidth={1.5} clipPath={TROPHY_PATH} />;
}

// 25. Arch/dome — rounded top (stadium archway), flat bottom
function ArchTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 52, height: 68, borderRadius: '50% 50% 0 0',
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <Digit value={value} size={26} />
    </div>
  );
}

// 26. Pennant/flag-tail — rectangle coming to a triangular point
function PennantTile({ value, color }) {
  return <ClipTile value={value} color={color} width={62} height={48} digitSize={24}
    clipPath="polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)" />;
}

// 27. Ticket-perforation strip — dashed perforation line + torn notch
function PerforatedTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 58, height: 62, borderRadius: 6,
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <div className="absolute rounded-full" style={{ width: 10, height: 10, left: 15, top: -5, background: BG }} />
      <div className="absolute" style={{ left: 20, top: 5, bottom: 5, borderLeft: `1.5px dashed ${color}99` }} />
      <Digit value={value} size={24} />
    </div>
  );
}

// 28. Polaroid frame — thick light border, extra-thick bottom strip
function PolaroidTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 56, height: 70, borderRadius: 3, background: '#f4f1ea',
      padding: '6px 6px 14px 6px', boxShadow: '0 4px 10px rgba(0,0,0,0.35)' }}>
      <div className="flex items-center justify-center w-full h-full" style={{ background: 'rgba(0,0,0,0.78)', borderRadius: 2 }}>
        <Digit value={value} size={24} color={color} />
      </div>
    </div>
  );
}

// 29. Neon sign tube — glowing outline with an animated flicker pulse
function NeonTubeTile({ value, color }) {
  return (
    <motion.div className="flex items-center justify-center" style={{ width: 52, height: 66, borderRadius: 16, border: `3px solid ${color}` }}
      animate={{ boxShadow: [
        `0 0 6px ${color}, 0 0 14px ${color}88, inset 0 0 8px ${color}55`,
        `0 0 10px ${color}, 0 0 22px ${color}aa, inset 0 0 12px ${color}77`,
        `0 0 6px ${color}, 0 0 14px ${color}88, inset 0 0 8px ${color}55`,
      ] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}>
      <Digit value={value} size={28} />
    </motion.div>
  );
}

// 30. Two-tone soccer-ball panels — alternating light/color hexagon facets
function TwoTonePanelTile({ value, color }) {
  const hexClip = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
  return (
    <div className="relative flex items-center justify-center" style={{ width: 58, height: 64, clipPath: hexClip, background: '#1a1a1a' }}>
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(50% 0%, 100% 25%, 50% 50%)', background: '#e8e8e2' }} />
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(0% 75%, 50% 50%, 50% 100%)', background: '#e8e8e2' }} />
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(100% 75%, 100% 25%, 50% 50%)', background: color }} />
      <div className="relative"><Digit value={value} size={24} /></div>
    </div>
  );
}

// 31. Folded-corner page — dog-eared top-right flap with a shadow
function FoldedCornerTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: 58, height: 62, borderRadius: 8,
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      <div className="absolute" style={{ top: 0, right: 0, width: 0, height: 0,
        borderStyle: 'solid', borderWidth: '0 18px 18px 0', borderColor: `transparent ${BG} transparent transparent`,
        filter: 'drop-shadow(-1px 1px 2px rgba(0,0,0,0.5))' }} />
      <div className="absolute" style={{ top: 0, right: 0, width: 0, height: 0,
        borderStyle: 'solid', borderWidth: '0 18px 18px 0', borderColor: `transparent ${color}88 transparent transparent`, opacity: 0.5 }} />
      <Digit value={value} size={24} />
    </div>
  );
}

// 32. Wax-seal stamp — scalloped circular edge + embossed inset shadow
function scallopPath(n = 14, outerR = 50, innerR = 43) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const ang = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${(50 + Math.cos(ang) * r).toFixed(1)}% ${(50 + Math.sin(ang) * r).toFixed(1)}%`);
  }
  return `polygon(${pts.join(', ')})`;
}
const SCALLOP_PATH = scallopPath();
function WaxSealTile({ value, color }) {
  return <ClipTile value={value} color={color} width={58} height={58} digitSize={24} borderWidth={3}
    clipPath={SCALLOP_PATH} extraInnerStyle={{ boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(255,255,255,0.15)' }} />;
}

// 33. Checkered-flag border — checkered ring around a plain inner panel
function CheckeredTile({ value, color }) {
  return (
    <div className="flex items-center justify-center" style={{ width: 62, height: 62, borderRadius: 10, padding: 6,
      background: 'repeating-conic-gradient(#eee 0% 25%, #222 0% 50%) 0 0/10px 10px' }}>
      <div className="w-full h-full flex items-center justify-center rounded-md" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
        <Digit value={value} size={24} />
      </div>
    </div>
  );
}

// 34. Medal — circle with a two-pointed ribbon hanging above it
function MedalTile({ value, color }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: 56, paddingTop: 14 }}>
      <div className="absolute" style={{ top: 0, left: 12, width: 0, height: 0,
        borderStyle: 'solid', borderWidth: '0 10px 14px 10px', borderColor: `transparent transparent ${color} transparent`, opacity: 0.85 }} />
      <div className="absolute" style={{ top: 0, left: 30, width: 0, height: 0,
        borderStyle: 'solid', borderWidth: '0 10px 14px 10px', borderColor: `transparent transparent ${color} transparent`, opacity: 0.85, transform: 'scaleX(-1)' }} />
      <div className="relative rounded-full flex items-center justify-center" style={{ width: 52, height: 52,
        background: 'linear-gradient(160deg, #ffe9a8, #d4a017)', border: `2px solid ${color}` }}>
        <Digit value={value} size={24} color="#3a2a05" />
      </div>
    </div>
  );
}

// 35. Gauge dial — decorative semi-circular speedometer arc with tick marks
function GaugeTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
      <svg width="64" height="64" style={{ position: 'absolute', inset: 0 }}>
        <path d="M8,32 A24,24 0 0 1 56,32" fill="none" stroke={`${color}55`} strokeWidth="2" />
        {Array.from({ length: 7 }).map((_, i) => {
          const theta = (Math.PI * (180 + (i / 6) * 180)) / 180;
          const x1 = 32 + Math.cos(theta) * 20, y1 = 32 + Math.sin(theta) * 20;
          const x2 = 32 + Math.cos(theta) * 25, y2 = 32 + Math.sin(theta) * 25;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={`${color}99`} strokeWidth="1.5" />;
        })}
      </svg>
      <div className="relative flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 8,
        background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
        <Digit value={value} size={22} />
      </div>
    </div>
  );
}

// 36. Cracked-glass border — fracture lines radiating out from the center
function CrackedTile({ value, color }) {
  const cracks = [15, 60, 110, 160, 200, 250, 300, 340];
  return (
    <div className="relative flex items-center justify-center overflow-hidden" style={{ width: 60, height: 60, borderRadius: 8,
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88` }}>
      {cracks.map((ang, i) => (
        <div key={i} className="absolute" style={{ left: '50%', top: '50%', width: 30 + (i % 3) * 6, height: 1,
          background: `${color}55`, transformOrigin: 'left center', transform: `rotate(${ang}deg)` }} />
      ))}
      <div className="absolute rounded-full" style={{ width: 4, height: 4, left: '50%', top: '50%', marginLeft: -2, marginTop: -2, background: `${color}aa` }} />
      <div className="relative"><Digit value={value} size={26} /></div>
    </div>
  );
}

// 37. Esports HUD frame — corner-bracket reticle marks only, no fill
function HudTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
      <div className="absolute" style={{ top: 0, left: 0, width: 14, height: 14, borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div className="absolute" style={{ top: 0, right: 0, width: 14, height: 14, borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <div className="absolute" style={{ bottom: 0, left: 0, width: 14, height: 14, borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div className="absolute" style={{ bottom: 0, right: 0, width: 14, height: 14, borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <Digit value={value} size={28} />
    </div>
  );
}

// 38. Cassette-window — two round cutouts near the top like tape reels
function CassetteTile({ value, color }) {
  return (
    <div className="relative flex flex-col items-center justify-end" style={{ width: 60, height: 64, borderRadius: 8,
      background: 'rgba(255,255,255,0.06)', border: `1px solid ${color}88`, paddingBottom: 8 }}>
      <div className="absolute flex items-center justify-center gap-3" style={{ top: 8, left: 0, right: 0 }}>
        <div className="rounded-full" style={{ width: 12, height: 12, border: `1.5px solid ${color}aa`, background: BG }} />
        <div className="rounded-full" style={{ width: 12, height: 12, border: `1.5px solid ${color}aa`, background: BG }} />
      </div>
      <Digit value={value} size={22} />
    </div>
  );
}

// 39. Low-poly facet — faceted triangular panels with varied shading
function LowPolyTile({ value, color }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 58, height: 58 }}>
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(0% 0%, 100% 0%, 50% 50%)', background: `${color}55` }} />
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)', background: `${color}88` }} />
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(100% 0%, 100% 100%, 50% 50%)', background: `${color}33` }} />
      <div className="absolute" style={{ inset: 0, clipPath: 'polygon(0% 100%, 100% 100%, 50% 50%)', background: `${color}aa` }} />
      <div className="relative"><Digit value={value} size={24} /></div>
    </div>
  );
}

// 40. Underline-only minimalist — no frame at all, just a gradient underline
function UnderlineTile({ value, color }) {
  return (
    <div className="flex flex-col items-center" style={{ width: 44 }}>
      <Digit value={value} size={34} />
      <div className="mt-1.5" style={{ width: 32, height: 4, borderRadius: 2, background: `linear-gradient(90deg, ${color}, ${color}33)` }} />
    </div>
  );
}

// ================= Variant wrappers (local state per variant) =================

function makeVariant(Tile, defaults = [2, 1]) {
  return function Variant() {
    const [a, setA] = useState(defaults[0]);
    const [b, setB] = useState(defaults[1]);
    return <TwoTiles Tile={Tile} a={a} setA={setA} b={b} setB={setB} />;
  };
}

const V1 = makeVariant(BaselineTile);
const V2 = makeVariant(OvalTile);
const V3 = makeVariant(CircleTile);
const V4 = makeVariant(PillTile);
const V5 = makeVariant(HexagonTile);
const V6 = makeVariant(ShieldTile);
const V7 = makeVariant(DiamondTile);
const V8 = makeVariant(ChamferedTile);
const V9 = makeVariant(RibbonTile);
const V10 = makeVariant(CalloutTile);
const V11 = makeVariant(TicketTile);
const V12 = makeVariant(PatchTile);
const V13 = makeVariant(BezelTile);
const V14 = makeVariant(HaloTile);
const V15 = makeVariant(LensTile);
const V16 = makeVariant(TornTile);
const V17 = makeVariant(PortholeTile);
const V18 = makeVariant(PentagonTile);
const V19 = makeVariant(HoneycombTile);
const V20 = makeVariant(NeonTile);
const V21 = makeVariant(SquareTile);
const V22 = makeVariant(StickerTile);
const V23 = makeVariant(FootballSkinTile);
const V24 = makeVariant(TrophyTile);
const V25 = makeVariant(ArchTile);
const V26 = makeVariant(PennantTile);
const V27 = makeVariant(PerforatedTile);
const V28 = makeVariant(PolaroidTile);
const V29 = makeVariant(NeonTubeTile);
const V30 = makeVariant(TwoTonePanelTile);
const V31 = makeVariant(FoldedCornerTile);
const V32 = makeVariant(WaxSealTile);
const V33 = makeVariant(CheckeredTile);
const V34 = makeVariant(MedalTile);
const V35 = makeVariant(GaugeTile);
const V36 = makeVariant(CrackedTile);
const V37 = makeVariant(HudTile);
const V38 = makeVariant(CassetteTile);
const V39 = makeVariant(LowPolyTile);
const V40 = makeVariant(UnderlineTile);

const VARIANTS_1_20 = [
  ['1. הנוכחי (בסיס להשוואה)', 'מלבן מעוגל עם תפר אמצעי — הצורה הקיימת ב-ScoreInput', V1],
  ['2. אליפסה אמיתית', 'מסגרת אליפסה שטוחה ורחבה', V2],
  ['3. עיגול מושלם', 'טבעת עגולה סימטרית', V3],
  ['4. קפסולה/גלולה', 'צורת אצטדיון — קצוות מעוגלים לגמרי', V4],
  ['5. משושה', 'מסגרת הקסגון חדה', V5],
  ['6. מגן/סמל מועדון', 'עליון מעוגל, תחתון מחודד — כמו סמל כדורגל', V6],
  ['7. יהלום', 'ריבוע מסובב 45°, הספרה נשארת זקופה', V7],
  ['8. אוקטגון עם פינות קטומות', 'ריבוע מעוגל עם פינות חתוכות ב-45°', V8],
  ['9. סרט/באנר', 'מלבן עם זנב משולש חתוך בתחתית', V9],
  ['10. בועת דיבור', 'מלבן מעוגל עם זנב משולש כלפי מטה', V10],
  ['11. כרטיס קולנוע', 'מלבן עם חריצים חצי-עגולים בצדדים', V11],
  ['12. טלאי מספר חולצה', 'תג מרובע עם מסגרת מקווקוות כמו רקמה', V12],
  ['13. מסך תוצאות LED', 'מסגרת עבה כמו לוח תוצאות אמיתי, עם ברגים בפינות', V13],
  ['14. הילה כפולה', 'טבעת זוהרת נוספת סביב העיגול, במרחק', V14],
  ['15. עדשה (Vesica Piscis)', 'שתי קשתות חופפות יוצרות צורת עדשה מחודדת', V15],
  ['16. קצה נייר קרוע', 'מתאר משונן ולא סדיר, אווירת פלייר משחק', V16],
  ['17. אשנב/סרט קולנוע', 'עיגול עם חריצים קטנים סביב ההיקף', V17],
  ['18. מצולע חץ', 'פנטגון מחודד כלפי מעלה, כמו תמרור', V18],
  ['19. פאנל כדורגל', 'משושה עם מראה תלת-ממדי מוטבע (בוהק+צל פנימי)', V19],
  ['20. קו ניאון בלבד', 'ללא רקע — רק מתאר אליפסה זוהר', V20],
];

const VARIANTS_21_40 = [
  ['21. בלוק מרובע חד', 'פינות ישרות לגמרי — מינימליזם של לוח תוצאות', V21],
  ['22. מדבקה חתוכה', 'מסגרת עבה לבנה כמו מדבקת ויניל, עם צל', V22],
  ['23. עור כדורגל', 'תפרי פנטגון מצוירים מאחורי הספרה', V23],
  ['24. סמל גביע', 'קונטור גביע — קערה, גזע ובסיס', V24],
  ['25. קשת אצטדיון', 'עליון מעוגל לגמרי, תחתון ישר — כניסת אצטדיון', V25],
  ['26. דגלון', 'מלבן עם קצה משולש חד, כמו דגל קבוצה', V26],
  ['27. רצועת כרטיס מנוקבת', 'קו ניקוב מקווקו וחריץ קטן בצד, כמו בול כרטיס', V27],
  ['28. מסגרת פולארויד', 'מסגרת לבנה עבה עם רצועה תחתונה עבה יותר', V28],
  ['29. שלט ניאון', 'מתאר זוהר פועם, כמו שלט ניאון אמיתי', V29],
  ['30. פאנלים דו-גוניים', 'משושה עם פאנלים בהירים/צבעוניים לסירוגין כמו כדור אמיתי', V30],
  ['31. פינה מקופלת', 'פינה עליונה מקופלת עם צל, כמו דף מקופל', V31],
  ['32. חותמת שעווה', 'עיגול עם היקף מפורכז וצל פנימי מוטבע', V32],
  ['33. מסגרת שחמט מרוצים', 'טבעת משבצות שחור-לבן סביב פאנל פנימי', V33],
  ['34. מדליה', 'עיגול זהב עם שני קצוות סרט תלויים מעליו', V34],
  ['35. חוגת מד מהירות', 'קשת חצי-עגולה עם קווי סימון מאחורי התא', V35],
  ['36. זכוכית סדוקה', 'קווי שבר מסתעפים מהמרכז להיקף התא', V36],
  ['37. מסגרת HUD גיימינג', 'רק פינות ממוסגרות בסוגריים, בלי מילוי', V37],
  ['38. חלון קלטת', 'שני חלונות עגולים למעלה כמו גלילי קלטת', V38],
  ['39. פאנלים לואו-פולי', 'משולשים גיאומטריים בהצללה משתנה', V39],
  ['40. קו תחתי בלבד', 'ללא מסגרת כלל — רק ספרה מודגשת וקו גרדיאנט מתחתיה', V40],
];

export default function AdminScoreShapeDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">דמו — 40 צורות מסגרת לתא התוצאה</h2>
        <p className="text-slate-500 text-sm">כולן חיות ולחיצות (+/- לכל קבוצה). הצורה היא ההבדל היחיד בין הווריאנטים — האינטראקציה זהה. כלי דמו בלבד — לא משפיע על ScoreInput.jsx.</p>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white/70 mb-3">1–20</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANTS_1_20.map(([label, desc, Comp]) => (
            <Frame key={label} label={label} desc={desc}>{() => <Comp />}</Frame>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-white/70 mb-3">21–40 (חדש)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VARIANTS_21_40.map(([label, desc, Comp]) => (
            <Frame key={label} label={label} desc={desc}>{() => <Comp />}</Frame>
          ))}
        </div>
      </div>
    </div>
  );
}
