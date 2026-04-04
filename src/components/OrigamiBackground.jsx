import React from 'react';

const random = (min, max) => Math.random() * (max - min) + min;

const STYLE = `
  .origami-bg {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #060d1a 0%, #0d1f35 50%, #060d1a 100%);
    overflow: hidden;
    z-index: 0;
  }

  .drifter-container {
    position: absolute;
    top: 50%;
    left: -15%;
    animation: drift linear infinite;
  }

  @keyframes drift {
    0%   { left: -15%; transform: translateY(var(--y-start)) rotate(var(--r-start)); }
    100% { left: 115%; transform: translateY(var(--y-end))   rotate(var(--r-end)); }
  }

  .origami-crane {
    position: relative;
    width: 80px;
    height: 60px;
    animation: crane-bob ease-in-out infinite alternate;
  }

  @keyframes crane-bob {
    0%   { transform: scale(1) translateY(0px); }
    100% { transform: scale(1) translateY(-6px); }
  }

  .crane-part {
    position: absolute;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(200, 230, 255, 0.25);
    box-shadow: 0 0 12px rgba(100, 180, 255, 0.15), inset 0 0 6px rgba(255, 255, 255, 0.05);
  }

  .crane-part.body {
    width: 40px;
    height: 30px;
    top: 15px;
    left: 20px;
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  }

  .crane-part.wing-left {
    width: 38px;
    height: 22px;
    top: 22px;
    left: 0px;
    clip-path: polygon(0% 60%, 100% 0%, 100% 100%);
    transform-origin: right center;
    animation: flap-left ease-in-out infinite alternate;
  }

  .crane-part.wing-right {
    width: 38px;
    height: 22px;
    top: 22px;
    left: 42px;
    clip-path: polygon(0% 0%, 0% 100%, 100% 60%);
    transform-origin: left center;
    animation: flap-right ease-in-out infinite alternate;
  }

  .crane-part.tail {
    width: 18px;
    height: 18px;
    bottom: 2px;
    left: 31px;
    clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
  }

  @keyframes flap-left {
    0%   { transform: rotate(-15deg); }
    100% { transform: rotate(10deg); }
  }

  @keyframes flap-right {
    0%   { transform: rotate(15deg); }
    100% { transform: rotate(-10deg); }
  }
`;

const cranes = [...Array(15)].map((_, i) => ({
  i,
  duration: random(22, 42),
  delay: random(-42, 0),
  scale: random(0.2, 0.8),
  yStart: `${random(-35, 35)}vh`,
  yEnd: `${random(-35, 35)}vh`,
  rStart: `${random(-25, 25)}deg`,
  rEnd: `${random(-25, 25)}deg`,
  flapDuration: `${random(1, 2.5)}s`,
  flapDelay: `${random(-3, 0)}s`,
  bobDuration: `${random(2, 4)}s`,
}));

export default function OrigamiBackground() {
  return (
    <>
      <style>{STYLE}</style>
      <div className="origami-bg">
        {cranes.map(({ i, duration, delay, scale, yStart, yEnd, rStart, rEnd, flapDuration, flapDelay, bobDuration }) => (
          <div
            key={i}
            className="drifter-container"
            style={{
              '--y-start': yStart,
              '--y-end': yEnd,
              '--r-start': rStart,
              '--r-end': rEnd,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          >
            <div
              className="origami-crane"
              style={{
                transform: `scale(${scale})`,
                animationDuration: bobDuration,
              }}
            >
              <div className="crane-part body" />
              <div className="crane-part wing-left" style={{ animationDuration: flapDuration, animationDelay: flapDelay }} />
              <div className="crane-part wing-right" style={{ animationDuration: flapDuration, animationDelay: flapDelay }} />
              <div className="crane-part tail" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
