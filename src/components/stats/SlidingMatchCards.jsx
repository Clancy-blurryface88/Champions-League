import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/core/text-shimmer";

export default function SlidingMatchCards({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleSwipe = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = items.length - 1;
      if (next >= items.length) next = 0;
      return next;
    });
  };

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        scale: 0.8,
        rotateY: direction > 0 ? -45 : 45,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.8,
        rotateY: direction > 0 ? 45 : -45,
      };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4">
      <div className="relative w-full max-w-sm h-[320px] flex items-center justify-center perspective-[1000px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              rotateY: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                handleSwipe(-1); // Swipe left -> prev
              } else if (swipe > swipeConfidenceThreshold) {
                handleSwipe(1); // Swipe right -> next
              }
            }}
            className="absolute w-full bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="p-6">
              {/* Teams and Score Header */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white/5 rounded-full p-2">
                  <img src={currentItem.match.team_a_logo} alt={currentItem.match.team_a} className="w-full h-full object-contain" />
                </div>
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-white tracking-wider" dir="ltr">
                    {currentItem.prediction.predicted_score_b} - {currentItem.prediction.predicted_score_a}
                  </div>
                  <div className="text-sm text-slate-400 uppercase tracking-wider mt-2">
                    {new Date(currentItem.match.match_date).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })}
                  </div>
                </div>
                <div className="flex items-center justify-center w-16 h-16 bg-white/5 rounded-full p-2">
                  <img src={currentItem.match.team_b_logo} alt={currentItem.match.team_b} className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Points Breakdown */}
              <div className="bg-slate-900/50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center text-base">
                  <span className="text-white">תוצאה מדויקת</span>
                  <Badge className="bg-green-500/20 text-green-400 border-0 px-3 py-1 text-sm">
                    {currentItem.prediction.exact_score_points_earned}
                  </Badge>
                </div>
                <div className="h-px bg-slate-800 my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">סה"כ ניקוד</span>
                  <Badge className="bg-blue-600/30 text-blue-300 border border-blue-600/50 px-3 py-1 text-sm font-bold">
                    {currentItem.prediction.points_earned}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex flex-col items-center gap-1 mt-2 w-full max-w-sm">
        <div className="text-slate-300 font-bold text-lg" dir="ltr">
          {currentIndex + 1} <span className="text-slate-500 mx-1">/</span> {items.length}
        </div>
        <div className="flex items-center justify-center gap-1.5 px-2 w-full whitespace-nowrap" dir="rtl">
          <TextShimmer className="text-xs sm:text-sm font-medium truncate" duration={4}>
            החלק ימינה ושמאלה למעבר בין המשחקים
          </TextShimmer>
          <span className="text-sm shrink-0">👋</span>
        </div>
      </div>
    </div>
  );
}