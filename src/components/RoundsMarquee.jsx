import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShineBorder } from "@/components/magicui/shine-border";

const RoundCard = ({ round, onClick }) => {
  return (
    <div
      className="relative group cursor-pointer mx-3 flex-shrink-0"
      onClick={() => onClick(round)}
    >
      {/* Glow halo */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-amber-400/60 via-white/20 to-amber-400/60 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <figure
        className="relative h-16 w-60 overflow-hidden rounded-2xl flex items-center justify-center gap-2"
        style={{
          background: 'rgba(8,22,45,0.88)',
          border: '1px solid rgba(245,197,24,0.28)',
          backdropFilter: 'blur(14px)',
          transition: 'border-color 0.2s',
        }}
      >
        <ShineBorder shineColor={["#f5c518", "#ffffff", "#f5c518"]} borderRadius={16} borderWidth={1} />

        <div className="flex-shrink-0">
          <img src="/trophy-marquee.png" alt="WC2026" className="h-9 w-auto object-contain" />
        </div>

        <div className="text-center">
          <h3
            className="text-white font-semibold text-base tracking-wide"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {round.name}
          </h3>
        </div>
      </figure>
    </div>
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