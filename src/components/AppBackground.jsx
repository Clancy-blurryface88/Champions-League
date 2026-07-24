import React, { useEffect, useRef } from "react";

export default function AppBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Floating gold particles
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.3,
        dx: (Math.random() - 0.5) * 0.25,
        dy: -(Math.random() * 0.3 + 0.1),
        opacity: Math.random() * 0.5 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248,${p.opacity})`;
        ctx.fill();
      });

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#030d1a', zIndex: 0 }}>

{/* Central pitch circle */}
      <div
        className="absolute"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 700px)',
          height: 'min(90vw, 700px)',
          borderRadius: '50%',
          border: '1px solid rgba(56, 189, 248,0.06)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute"
        style={{
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(55vw, 420px)',
          height: 'min(55vw, 420px)',
          borderRadius: '50%',
          border: '1px solid rgba(56, 189, 248,0.04)',
          pointerEvents: 'none',
        }}
      />

      {/* Top radial glow — gold */}
      <div
        className="absolute"
        style={{
          top: '-20%', left: '50%',
          transform: 'translateX(-50%)',
          width: '120vw',
          height: '70vh',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248,0.09) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom radial glow — deep teal */}
      <div
        className="absolute"
        style={{
          bottom: '-10%', left: '50%',
          transform: 'translateX(-50%)',
          width: '100vw',
          height: '50vh',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(0,180,160,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Floating particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
