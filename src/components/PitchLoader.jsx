import React from 'react';

// The app's loading animation: a football pitch drawing itself in green lines.
//  variant 9  — the whole pitch draws in 1.44s, holds, and starts again (2.4s cycle)
//  variant 13 — every line draws, the pitch tilts back into 3D, then fades (2.6s cycle); the app's
//               opening loader
// `width` is the pitch's width in px (it is 3:2).

const GREEN = '#4ade80';
export const DRAW_MS = { 9: 1440, 13: 2600 }; // how long until the pitch is fully drawn / the cycle ends

const CSS = `
@keyframes pl-draw9{0%{stroke-dashoffset:400}60%,100%{stroke-dashoffset:0}}
@keyframes pl-draw13{0%{stroke-dashoffset:1}45%,85%{stroke-dashoffset:0;opacity:1}100%{stroke-dashoffset:0;opacity:0}}
@keyframes pl-tilt{0%{transform:rotateX(0)}45%,85%{transform:rotateX(55deg)}100%{transform:rotateX(0)}}
`;

const LINES13 = [
  ['rect', { x: 2, y: 2, width: 80, height: 52, rx: 3 }], ['line', { x1: 42, y1: 2, x2: 42, y2: 54 }], ['circle', { cx: 42, cy: 28, r: 9 }],
  ['rect', { x: 2, y: 15, width: 13, height: 26 }], ['rect', { x: 69, y: 15, width: 13, height: 26 }],
  ['rect', { x: 2, y: 22, width: 5, height: 12 }], ['rect', { x: 77, y: 22, width: 5, height: 12 }],
];

export default function PitchLoader({ variant = 13, width = 84 }) {
  const h = (width * 56) / 84;
  if (variant === 13) {
    return (
      <div style={{ perspective: width * 2.6 }} role="status" aria-label="טוען">
        <style>{CSS}</style>
        <div style={{ animation: 'pl-tilt 2.6s ease-in-out infinite' }}>
          <svg width={width} height={h} viewBox="0 0 84 56" fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" style={{ overflow: 'visible', filter: `drop-shadow(0 0 4px ${GREEN})` }}>
            {LINES13.map(([T, p], k) => React.createElement(T, { key: k, ...p, pathLength: 1, style: { strokeDasharray: 1, strokeDashoffset: 1, animation: 'pl-draw13 2.6s ease-in-out infinite' } }))}
            <circle cx="42" cy="28" r="1.5" fill={GREEN} stroke="none" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div role="status" aria-label="טוען">
      <style>{CSS}</style>
      <svg width={width} height={h} viewBox="0 0 84 56" fill="none" stroke={GREEN} strokeWidth="2">
        <g style={{ strokeDasharray: 400, animation: 'pl-draw9 2.4s ease-in-out infinite' }}>
          <rect x="2" y="2" width="80" height="52" rx="3" /><line x1="42" y1="2" x2="42" y2="54" /><circle cx="42" cy="28" r="9" />
          <rect x="2" y="16" width="12" height="24" /><rect x="70" y="16" width="12" height="24" />
        </g>
      </svg>
    </div>
  );
}

// Inline loaders inside the app: nothing for the first 300ms (a quick load just shows its content),
// then the pitch drawing itself and tilting back into 3D (variant 13).
export function InlinePitchLoader({ width = 84 }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setShow(true), 300); return () => clearTimeout(t); }, []);
  return <div style={{ width, height: (width * 56) / 84 }}>{show && <PitchLoader variant={13} width={width} />}</div>;
}
