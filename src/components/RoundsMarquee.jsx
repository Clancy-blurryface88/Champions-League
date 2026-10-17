import React, { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Match } from "@/api/entities";

// "League Phase - 3" -> label "LEAGUE PHASE", number "3"
const splitRoundName = (name = "") => {
  const m = name.trim().match(/^(.*?)\s*-\s*(\d+)$/);
  return m ? { label: m[1].toUpperCase(), num: m[2] } : { label: name.trim().toUpperCase(), num: null };
};

// Broadcast double plate (design 25.1): fading glass name plate with a thin frame with the ball as a watermark, silver number plate.
// The next round to predict (not finished yet) gets a green-to-cyan number plate.
const RoundCard = ({ round, onClick, isNext }) => {
  const { label, num } = splitRoundName(round.name);

  return (
    <div
      className="relative mx-3 h-16 w-60 flex-shrink-0 cursor-pointer flex items-center justify-center transition-[scale,filter] duration-150 ease-out active:scale-[.96] hover:brightness-110"
      onClick={() => onClick(round)}
    >
      <div className="flex h-[42px]" dir="ltr">
        <span
          className="relative overflow-hidden flex items-center text-white"
          style={{
            background: "linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.02))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            font: "700 13px 'Outfit', sans-serif",
            padding: num ? "0 14px 0 44px" : "0 22px 0 44px",
            clipPath: "polygon(0 0,100% 0,92% 100%,0 100%)",
          }}
        >
          {/* Thin frame along the slanted outline (half the stroke is clipped, so 2 shows as ~1px) */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,0 100,0 92,100 0,100" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          <img
            src="/champions/round-ball.png"
            alt=""
            draggable={false}
            className="absolute pointer-events-none select-none"
            style={{ height: 56, left: -12, top: "50%", transform: "translateY(-50%)", opacity: 0.22 }}
          />
          <span className="relative whitespace-nowrap">{label}</span>
        </span>
        {num && (
          <span
            className="grid place-items-center"
            style={{
              background: isNext ? "linear-gradient(135deg,#22c55e,#00e0ff)" : "linear-gradient(180deg,#f8fafc,#94a3b8)",
              color: isNext ? "#04201d" : "#0f172a",
              font: "700 28px 'Teko', sans-serif",
              padding: "0 16px",
              clipPath: "polygon(18% 0,100% 0,100% 100%,0 100%)",
              marginLeft: -8,
            }}
          >
            {num}
          </span>
        )}
      </div>
    </div>
  );
};

export function RoundsMarquee({ rounds, user, onRoundClick }) {
  const navigate = useNavigate();
  const baseX = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    Match.list().then(setMatches).catch(() => setMatches([]));
  }, []);

  const handleRoundClick = useCallback((round) => {
    if (!isDragging) {
      if (onRoundClick) {
        onRoundClick(round);
      } else {
        navigate(createPageUrl(`Predictions?round_id=${round.id}`));
      }
    }
  }, [isDragging, onRoundClick, navigate]);

  // Filter active rounds (hidden for everyone including admins if inactive)
  const displayedRounds = rounds.filter((r) => r.is_active);

  // First round (by order) that still has an unfinished match
  const nextRoundId = displayedRounds.find((r) => {
    const rMatches = matches.filter((m) => m.round_id === r.id);
    return rMatches.length > 0 && rMatches.some((m) => !m.is_finished);
  })?.id;

  if (displayedRounds.length === 0) {
    return null;
  }

  if (displayedRounds.length === 1) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent py-4">
        <div className="flex justify-center">
          <RoundCard round={displayedRounds[0]} onClick={handleRoundClick} isNext={displayedRounds[0].id === nextRoundId} />
        </div>
      </div>
    );
  }

  // Calculate total width of all cards for infinite scroll
  const cardWidth = 240 + 24; // w-60 (240px) + mx-3 (24px total margin)
  const totalWidth = displayedRounds.length * cardWidth;

  // Auto-scroll animation - always moving left
  useAnimationFrame((time) => {
    if (!isDragging && !pauseAnimation) {
      const speed = 50;
      const x = baseX.get();
      const newX = x - (speed / 60);
      
      // When we reach the end of the first set, jump back to start
      if (newX <= -totalWidth) {
        baseX.set(0);
      } else {
        baseX.set(newX);
      }
    }
  });

  // Create multiple copies for seamless left scrolling
  const repeatedRounds = [
    ...displayedRounds, 
    ...displayedRounds, 
    ...displayedRounds
  ];

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent">
      <div className="w-full overflow-hidden">
        <div className="py-4">
          <motion.div
            className="flex cursor-grab active:cursor-grabbing"
            style={{
              x: baseX,
              width: `${repeatedRounds.length * cardWidth}px`
            }}
            drag="x"
            dragConstraints={{
              left: -totalWidth, // Allows dragging left up to the end of the first set of cards
              right: 0           // Prevents dragging right past the initial position (0)
            }}
            dragElastic={0.1}
            onDragStart={() => {
              setIsDragging(true);
              setPauseAnimation(true);
            }}
            onDragEnd={(event, info) => {
              const currentX = baseX.get();
              
              // Only handle leftward drag snapping - if we went too far, snap back
              if (currentX <= -totalWidth) {
                baseX.set(0);
              }
              // If somehow dragged right (shouldn't happen with constraints), snap back to 0
              if (currentX > 0) {
                baseX.set(0);
              }
              
              setIsDragging(false);
              setTimeout(() => {
                setPauseAnimation(false);
              }, 1000);
            }}
            onHoverStart={() => setPauseAnimation(true)}
            onHoverEnd={() => setPauseAnimation(false)}
            whileDrag={{ scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              scale: { duration: 0.2 }
            }}
          >
            {repeatedRounds.map((round, index) => (
              <div key={`${round.id}-${index}`} className="flex-shrink-0">
                <RoundCard round={round} onClick={handleRoundClick} isNext={round.id === nextRoundId} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}