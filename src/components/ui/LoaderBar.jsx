import React from 'react';

const STYLE = `
  .pulse-loader-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }

  .pulse-loader svg {
    height: 180px;
    display: block;
  }

  .pulse-loader svg path {
    animation-duration: 1s;
    animation-name: pulse-seg;
    animation-iteration-count: infinite;
    fill: #3b82f6;
  }

  .pulse-loader svg path.seg-7 { animation-delay: -1s; }
  .pulse-loader svg path.seg-6 { animation-delay: -.875s; }
  .pulse-loader svg path.seg-5 { animation-delay: -.75s; }
  .pulse-loader svg path.seg-4 { animation-delay: -.625s; }
  .pulse-loader svg path.seg-3 { animation-delay: -.5s; }
  .pulse-loader svg path.seg-2 { animation-delay: -.375s; }
  .pulse-loader svg path.seg-1 { animation-delay: -.25s; }
  .pulse-loader svg path.seg-0 { animation-delay: -.125s; }

  @keyframes pulse-seg {
    0%   { opacity: .1; }
    30%  { opacity: .9; }
    100% { opacity: .1; }
  }
`;

const cx = 100, cy = 100, outerR = 65, innerR = 36;

const polar = (angle, r) => {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arc = (start, end) => {
  const s1 = polar(start, outerR), e1 = polar(end, outerR);
  const s2 = polar(end, innerR),   e2 = polar(start, innerR);
  return `M${s1.x} ${s1.y} A${outerR} ${outerR} 0 0 1 ${e1.x} ${e1.y} L${s2.x} ${s2.y} A${innerR} ${innerR} 0 0 0 ${e2.x} ${e2.y}Z`;
};

export function LoaderBar() {
  return (
    <>
      <style>{STYLE}</style>
      <div className="pulse-loader-wrap">
        <div className="pulse-loader">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            {Array.from({ length: 8 }).map((_, i) => {
              const start = i * 45 + 4;
              return <path key={i} className={`seg-${i}`} d={arc(start, start + 37)} />;
            })}
          </svg>
        </div>
      </div>
    </>
  );
}
