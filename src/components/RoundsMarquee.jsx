import React, { useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Match } from "@/api/entities";

// "League Phase - 3" -> label "LEAGUE PHASE", number "3"
const splitRoundName = (name = "") => {
  const m = name.trim().match(/^(.*?)\s*-\s*(\d+)$/);
  return m ? { label: m[1].toUpperCase(), num: m[2] } : { label: name.trim().toUpperCase(), num: null };
};

// Broadcast double plate as rounded parallelograms (shapes25 #3): framed glass name plate with the
// ball as a watermark, silver number plate. Both plates share one skew, so the break between them is
// a constant gap with parallel edges.
// The next round to predict (not finished yet) gets a green-to-cyan number plate.
const SKEW = 13.5; // deg — 12px of slant over the 50px plate height
const unskew = `skewX(${SKEW}deg)`;

// The ball in the plate rolls as the strip moves, slowly: a sixth of a real roll for the distance travelled
// (a 78px ball rolling on the floor turns 360/(π·78) degrees a pixel).
const ROLL_PER_PX = (360 / (Math.PI * 78)) / 6;

const RoundCard = ({ round, onClick, isNext, roll }) => {
  const { label, num } = splitRoundName(round.name);

  return (
    <div
      className="relative mx-3 h-16 w-[284px] flex-shrink-0 cursor-pointer flex items-center justify-center transition-[scale,filter] duration-150 ease-out active:scale-[.96] hover:brightness-110"
      onClick={() => onClick(round)}
    >
      <div className="flex h-[50px] gap-1" dir="ltr">
        <span
          className="relative overflow-hidden flex items-center text-white rounded"
          style={{
            transform: `skewX(-${SKEW}deg)`,
            background: "linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.03))",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,.45)",
            font: "800 17px 'EnStencil', 'Outfit', sans-serif",
            letterSpacing: '0.08em',
            padding: num ? "0 20px 0 60px" : "0 28px 0 60px",
          }}
        >
          <span
            className="absolute pointer-events-none select-none"
            style={{ height: 78, left: -20, top: "50%", transform: `translateY(-50%) ${unskew}`, opacity: 0.75, display: "flex" }}
          >
            <motion.img
              src="/champions/round-ball.png"
              alt=""
              draggable={false}
              style={{ height: 78, rotate: roll }}
            />
          </span>
          <span className="relative whitespace-nowrap" style={{ transform: unskew }}>{label}</span>
        </span>
        {num && (
          <span
            className="grid place-items-center rounded"
            style={{
              transform: `skewX(-${SKEW}deg)`,
              background: isNext ? "linear-gradient(135deg,#22c55e,#00e0ff)" : "linear-gradient(180deg,#f8fafc,#94a3b8)",
              color: isNext ? "#04201d" : "#0f172a",
              font: "700 34px var(--num-font)",
              width: 56,
            }}
          >
            <span style={{ transform: unskew }}>{num}</span>
          </span>
        )}
      </div>
    </div>
  );
};

export function RoundsMarquee({ rounds, user, onRoundClick }) {
  const navigate = useNavigate();
  const location = useLocation(); // the round opens as a sheet over this screen
  const baseX = useMotionValue(0);
  // the balls' turn, following the strip's movement (the jump back to the start is skipped, not rolled)
  const roll = useMotionValue(0);
  useEffect(() => {
    let prev = baseX.get();
    return baseX.on("change", (v) => {
      const dx = v - prev;
      prev = v;
      if (Math.abs(dx) < 100) roll.set(roll.get() + dx * ROLL_PER_PX);
    });
  }, [baseX, roll]);
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
        navigate(createPageUrl(`Predictions?round_id=${round.id}`), { state: { background: location } });
      }
    }
  }, [isDragging, onRoundClick, navigate, location]);

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
          <RoundCard round={displayedRounds[0]} onClick={handleRoundClick} isNext={displayedRounds[0].id === nextRoundId} roll={roll} />
        </div>
      </div>
    );
  }

  // Calculate total width of all cards for infinite scroll
  const cardWidth = 284 + 24; // w-[284px] + mx-3 (24px total margin)
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
                <RoundCard round={round} onClick={handleRoundClick} isNext={round.id === nextRoundId} roll={roll} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}