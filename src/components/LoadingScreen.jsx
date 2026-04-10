import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);

  // Fade out after a short delay so the animation completes
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0a0f2e 0%, #0d1b4b 60%, #0a0f2e 100%)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* Animated ring SVG */}
      <div style={{ position: "relative", width: 180, height: 180 }}>
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Outer glow ring */}
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="rgba(255,179,0,0.15)"
            strokeWidth="6"
          />
          {/* Animated stroke ring */}
          <circle
            cx="90"
            cy="90"
            r="82"
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="515"
            strokeDashoffset="515"
            style={{
              animation: "drawRing 1.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
          />
          {/* Second faster accent ring */}
          <circle
            cx="90"
            cy="90"
            r="74"
            fill="none"
            stroke="rgba(255,179,0,0.35)"
            strokeWidth="1.5"
            strokeDasharray="465"
            strokeDashoffset="465"
            style={{
              animation: "drawRing 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards",
              transformOrigin: "center",
              transform: "rotate(-90deg)",
            }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE066" />
              <stop offset="50%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
          </defs>
        </svg>

        {/* Trophy image centered inside the ring */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 110,
            height: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "trophyIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both",
          }}
        >
          <img
            src="/trophy-loading.png"
            alt="World Cup Trophy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: "drop-shadow(0 0 18px rgba(255,179,0,0.6)) drop-shadow(0 0 6px rgba(255,230,102,0.4))",
            }}
          />
        </div>
      </div>

      {/* Title text */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(50% - 130px)",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          animation: "fadeUp 0.8s ease 0.8s both",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            background: "linear-gradient(90deg, #FFE066, #FFB300, #FFE066)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.12em",
          }}
        >
          WORLD CUP 2026
        </div>
        <div
          style={{
            marginTop: 4,
            display: "flex",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FFB300",
                animation: `dotPulse 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes drawRing {
          to { stroke-dashoffset: 0; }
        }
        @keyframes trophyIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40%            { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
