import React from 'react';

const STYLE = `
  .main-fader {
    width: 100%;
    height: 100vh;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .loader svg {
    height: 200px;
    display: block;
    margin: 0 auto;
  }

  .loader svg path {
    animation-duration: 1s;
    animation-name: pulse-loader;
    animation-iteration-count: infinite;
    fill: #3b82f6;
  }

  .loader svg path.path-7 { animation-delay: -1s; }
  .loader svg path.path-6 { animation-delay: -.875s; }
  .loader svg path.path-5 { animation-delay: -.75s; }
  .loader svg path.path-4 { animation-delay: -.625s; }
  .loader svg path.path-3 { animation-delay: -.5s; }
  .loader svg path.path-2 { animation-delay: -.375s; }
  .loader svg path.path-1 { animation-delay: -.25s; }
  .loader svg path.path-0 { animation-delay: -.125s; }

  @keyframes pulse-loader {
    0%   { opacity: .1; }
    30%  { opacity: .9; }
    100% { opacity: .1; }
  }
`;

// SVG עם 8 מקטעים סביב מרכז — אפקט ספינר pulse
export function LoaderBar() {
  const segments = Array.from({ length: 8 });
  const r = 60;
  const cx = 100;
  const cy = 100;
  const arcAngle = 36; // degrees per segment (gap of 9 deg between them)

  const polarToCartesian = (angle, radius) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (startAngle, endAngle, outerR, innerR) => {
    const s1 = polarToCartesian(startAngle, outerR);
    const e1 = polarToCartesian(endAngle, outerR);
    const s2 = polarToCartesian(endAngle, innerR);
    const e2 = polarToCartesian(startAngle, innerR);
    return [
      `M ${s1.x} ${s1.y}`,
      `A ${outerR} ${outerR} 0 0 1 ${e1.x} ${e1.y}`,
      `L ${s2.x} ${s2.y}`,
      `A ${innerR} ${innerR} 0 0 0 ${e2.x} ${e2.y}`,
      'Z',
    ].join(' ');
  };

  return (
    <>
      <style>{STYLE}</style>
      <div className="main-fader">
        <div className="loader">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {segments.map((_, i) => {
              const startAngle = i * 45 + 4;
              const endAngle = startAngle + arcAngle;
              return (
                <path
                  key={i}
                  className={`path-${i}`}
                  d={describeArc(startAngle, endAngle, r, r * 0.55)}
                />
              );
            })}
          </svg>
        </div>
      </div>
    </>
  );
}
