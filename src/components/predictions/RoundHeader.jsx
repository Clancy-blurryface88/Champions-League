import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// The predictions page's round header: one bar as wide as the days bar under it, cut by the
// same diagonal slit (same lean, same slit width, a thin outline along the cut too). The right
// ~35% is the league-table button: gold tint, gold outline, the word TABLE. The left part is the
// round: number large, stage name beside it, both in the stencil number font and fitted to
// the space. Once predictions are sent, a pulsing green dot and "הניחושים נשלחו בהצלחה"
// appear under the stage name.

const GOLD = '#facc15';
const NUM = { fontFamily: 'var(--num-font)', fontWeight: 900 };
const H = 70;                  // bar height, px
const R = 12;                  // outer corner radius (the days bar's)
const SHARE = 0.35;            // table part's share of the width
const S = (26 / 56) * H / 2;   // half the lean: the days bar leans 26px over its 56px height
const G = 5.25;                // half the slit

// "League Phase - 3" -> label "LEAGUE PHASE", number "3"
const splitRoundName = (name = '') => {
  const m = name.trim().match(/^(.*?)\s*-\s*(\d+)$/);
  return m ? { label: m[1].toUpperCase(), num: m[2] } : { label: name.trim().toUpperCase(), num: null };
};

const leftPath = (L) => `M ${R} 0 L ${L + S - G} 0 L ${L - S - G} ${H} L ${R} ${H} A ${R} ${R} 0 0 1 0 ${H - R} L 0 ${R} A ${R} ${R} 0 0 1 ${R} 0 Z`;
const rightPath = (L, W) => `M ${L + S + G} 0 L ${W - R} 0 A ${R} ${R} 0 0 1 ${W} ${R} L ${W} ${H - R} A ${R} ${R} 0 0 1 ${W - R} ${H} L ${L - S + G} ${H} Z`;

// scales its content down (or up to `max`) to fit width × height
function Fit({ width, height, max = 1, children }) {
  const ref = React.useRef(null);
  const [k, setK] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    setK(Math.min(max, width / (el.scrollWidth || 1), height / (el.scrollHeight || 1)));
  }, [width, height, max, children]);
  return <span ref={ref} style={{ display: 'inline-flex', alignItems: 'center', transform: `scale(${k})`, transformOrigin: 'center', whiteSpace: 'nowrap' }}>{children}</span>;
}

// one side of the bar: clipped to its shape, with the shape's outline drawn inside it
function Part({ path, bg, line, onClick, label, children }) {
  const Tag = onClick ? motion.button : 'div';
  const tap = onClick ? { whileTap: { scale: 0.97 }, transition: { duration: 0.12 } } : {};
  return (
    <Tag onClick={onClick} aria-label={label} {...tap}
      style={{ position: 'absolute', inset: 0, clipPath: `path('${path}')`, background: bg, cursor: onClick ? 'pointer' : 'default' }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }} aria-hidden><path d={path} fill="none" stroke={line} strokeWidth="2" /></svg>
      {children}
    </Tag>
  );
}

export default function RoundHeader({ name, sent, onOpenTable }) {
  const { label, num } = splitRoundName(name);
  const box = React.useRef(null);
  const [W, setW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = box.current; if (!el) return undefined;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el); setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);
  // the cut sits at C: the round on the left (the wide part), the table button on the right
  const C = Math.round(W * (1 - SHARE));
  return (
    <div ref={box} dir="ltr" className="relative w-full" style={{ height: H }}>
      {W > 0 && <>
        <Part path={leftPath(C)} bg="rgba(255,255,255,0.06)" line="rgba(255,255,255,0.4)">
          <div className="absolute inset-y-0 left-0 flex items-center justify-center" style={{ width: C - S - 6 }}>
            <Fit width={Math.max(60, C - S - 30)} height={H - 14}>
              <span dir="rtl" className="flex items-center gap-3">
                {num && <span style={{ ...NUM, fontSize: 60, lineHeight: 1, color: '#fff' }}>{num}</span>}
                <span className="flex flex-col items-start">
                  <span style={{ ...NUM, fontSize: 24, letterSpacing: '0.08em', color: '#fff', lineHeight: 1.05 }}>{label}</span>
                  <AnimatePresence initial={false}>
                    {sent && (
                      <motion.span
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="mt-1 flex items-center gap-1.5 text-[12px] font-bold"
                        style={{ color: '#6ee7b7' }}
                      >
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" style={{ animationDuration: '2.4s' }} />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        </span>
                        הניחושים נשלחו בהצלחה
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </span>
            </Fit>
          </div>
        </Part>
        <Part path={rightPath(C, W)} bg="rgba(250,204,21,0.14)" line="rgba(250,204,21,0.8)" onClick={onOpenTable} label="טבלת הליגה">
          <span className="absolute inset-y-0 right-0 flex items-center justify-center" style={{ left: C + S + 2 }}>
            <Fit width={Math.max(40, W - C - S - 26)} height={H - 30} max={1.7}>
              <span style={{ ...NUM, fontSize: 27, letterSpacing: '0.08em', color: GOLD, lineHeight: 1 }}>TABLE</span>
            </Fit>
          </span>
        </Part>
      </>}
    </div>
  );
}

