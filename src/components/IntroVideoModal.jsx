import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextRotate from "./ui/TextRotate";

const rotatingTexts = [
  "ברוך הבא לטורניר הגדול בעולם",
  "מונדיאל 2026",
  "שיהיה טורניר",
  "מוצלח ומהנה",
  "בהצלחה 🏆",
];

export default function IntroVideoModal({ isOpen, onVideoCompleted }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => {});
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-full max-w-2xl">
          <video
            ref={videoRef}
            className="w-full block"
            playsInline
            muted
            onEnded={onVideoCompleted}
            style={{ maxHeight: '70vh' }}
          >
            <source src="/VIDEO.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="p-4 text-center w-full">
          <TextRotate
            texts={rotatingTexts}
            className="text-xl font-bold text-white"
            interval={3000}
          />
        </div>

        <button
          onClick={onVideoCompleted}
          className="absolute bottom-6 left-6 text-white/50 hover:text-white text-sm transition-colors"
        >
          דלג ←
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
