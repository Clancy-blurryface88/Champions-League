import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShineBorder } from "@/components/magicui/shine-border";

const RoundCard = ({ round, onClick }) => {
  const roundNameLower = round.name?.trim().toLowerCase() || "";
  const isFinal = roundNameLower.includes("final") && !roundNameLower.includes("semi") && !roundNameLower.includes("quarter");

  return (
    <>
    <style>{`
      @keyframes shimmer-text {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      .shimmer-text {
        background: linear-gradient(90deg, #38bdf8, #ffffff, #38bdf8, #ffffff, #38bdf8);
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer-text 3s linear infinite;
      }
      @keyframes final-twinkle {
        0%, 100% { opacity: .15; transform: scale(.6); }
        50% { opacity: 1; transform: scale(1.25); }
      }
      @keyframes final-ring {
        0% { transform: scale(0.6); opacity: .8; }
        100% { transform: scale(2); opacity: 0; }
      }
      @keyframes final-glow-breathe {
        0%, 100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.35), 0 0 6px 0px rgba(56, 189, 248,0.35); }
        50% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.35), 0 0 22px 4px rgba(56, 189, 248,0.75); }
      }
    `}</style>
    <div
      className="relative group cursor-pointer mx-3 flex-shrink-0"
      onClick={() => onClick(round)}
    >
      {/* Glow halo */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-sky-400/60 via-white/20 to-sky-400/60 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <figure
        className="relative h-16 w-60 rounded-2xl flex items-center justify-center gap-4"
        style={{
          background: 'linear-gradient(135deg, rgba(8,22,42,0.55) 0%, rgba(3,10,20,0.45) 100%)',
          border: '1px solid rgba(56, 189, 248,0.28)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 4px 24px rgba(0,0,0,0.35)',
          transition: 'border-color 0.2s',
          animation: isFinal ? 'final-glow-breathe 2.2s ease-in-out infinite' : undefined,
        }}
      >
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <ShineBorder shineColor={["#38bdf8", "#ffffff", "#38bdf8"]} borderRadius={16} borderWidth={1} />
        </div>

        {isFinal && (
          <>
            {[...Array(10)].map((_, i) => (
              <span
                key={`spark-${i}`}
                className="absolute rounded-full bg-sky-200 z-10"
                style={{
                  width: 2,
                  height: 2,
                  top: `${10 + (i * 9) % 80}%`,
                  left: `${5 + (i * 15) % 90}%`,
                  animation: `final-twinkle ${1.4 + (i % 4) * 0.3}s ease-in-out ${(i % 5) * 0.2}s infinite`,
                }}
              />
            ))}
            {[["30%", "15%"], ["65%", "80%"]].map(([top, left], i) => (
              <span
                key={`ring-${i}`}
                className="absolute rounded-full z-10"
                style={{ top, left, width: 4, height: 4, border: "2px solid #38bdf8", animation: `final-ring 2s ease-out ${i * 0.8}s infinite` }}
              />
            ))}
          </>
        )}

        <div className="flex-shrink-0 relative z-20">
          <img src="/cl-emblem.svg" alt="CL2026" className="h-9 w-auto object-contain" />
        </div>

        <div className="text-center relative z-20">
          <h3
            className="shimmer-text font-semibold text-base tracking-wide"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {round.name}
          </h3>
        </div>
      </figure>
    </div>
    </>
  );
};

export function RoundsMarquee({ rounds, user, onRoundClick }) {
  const navigate = useNavigate();
  const baseX = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [pauseAnimation, setPauseAnimation] = useState(false);

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

  if (displayedRounds.length === 0) {
    return null;
  }

  if (displayedRounds.length === 1) {
    return (
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent py-4">
        <div className="flex justify-center">
          <RoundCard round={displayedRounds[0]} onClick={handleRoundClick} />
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
                <RoundCard round={round} onClick={handleRoundClick} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}